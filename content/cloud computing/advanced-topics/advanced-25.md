---
id: advanced-25
title: Microservices Architecture in Cloud
type: text
---

# Microservices Architecture in Cloud

## Overview

Microservices architecture decomposes applications into small, independent services that communicate over network protocols. This lesson covers microservices patterns, communication strategies, and implementation best practices in cloud environments.

## Microservices Fundamentals

### Service Decomposition

```python
# Monolith (before)
class ECommerceApplication:
    def create_order(self, user_id, items):
        # User validation
        user = self.validate_user(user_id)
        
        # Inventory check
        self.check_inventory(items)
        
        # Payment processing
        payment = self.process_payment(user, items)
        
        # Order creation
        order = self.save_order(user, items, payment)
        
        # Shipping
        self.create_shipment(order)
        
        # Notification
        self.send_notification(user, order)
        
        return order

# Microservices (after)
# Each service is independent

# user-service/app.py
from flask import Flask, jsonify, request

app = Flask(__name__)

@app.route('/users/<user_id>', methods=['GET'])
def get_user(user_id):
    # User service focused on user management only
    user = db.query(User).filter_by(id=user_id).first()
    return jsonify(user.to_dict())

@app.route('/users/<user_id>/validate', methods=['POST'])
def validate_user(user_id):
    user = db.query(User).filter_by(id=user_id).first()
    return jsonify({'valid': user is not None and user.active})

# inventory-service/app.py
@app.route('/inventory/check', methods=['POST'])
def check_inventory():
    items = request.json['items']
    availability = {}
    
    for item in items:
        stock = db.query(Inventory).filter_by(product_id=item['id']).first()
        availability[item['id']] = stock.quantity >= item['quantity']
    
    return jsonify(availability)

@app.route('/inventory/reserve', methods=['POST'])
def reserve_inventory():
    items = request.json['items']
    reservation_id = str(uuid.uuid4())
    
    # Reserve items with timeout
    for item in items:
        db.execute("""
            UPDATE inventory 
            SET reserved = reserved + :qty,
                reservation_id = :res_id,
                reservation_expires = NOW() + INTERVAL '15 minutes'
            WHERE product_id = :product_id
        """, qty=item['quantity'], res_id=reservation_id, product_id=item['id'])
    
    return jsonify({'reservation_id': reservation_id})

# payment-service/app.py
@app.route('/payments/process', methods=['POST'])
def process_payment():
    data = request.json
    
    # Process payment with external gateway
    payment_result = stripe.Charge.create(
        amount=data['amount'],
        currency='usd',
        source=data['payment_token']
    )
    
    # Store payment record
    payment = Payment(
        transaction_id=payment_result.id,
        amount=data['amount'],
        status='completed'
    )
    db.session.add(payment)
    db.session.commit()
    
    return jsonify(payment.to_dict())

# order-service/app.py (orchestrates other services)
import requests

@app.route('/orders', methods=['POST'])
def create_order():
    data = request.json
    
    try:
        # Call user service
        user_resp = requests.post(
            f'http://user-service/users/{data["user_id"]}/validate'
        )
        if not user_resp.json()['valid']:
            return jsonify({'error': 'Invalid user'}), 400
        
        # Call inventory service
        inventory_resp = requests.post(
            'http://inventory-service/inventory/reserve',
            json={'items': data['items']}
        )
        reservation_id = inventory_resp.json()['reservation_id']
        
        # Call payment service
        payment_resp = requests.post(
            'http://payment-service/payments/process',
            json={
                'amount': data['total'],
                'payment_token': data['payment_token']
            }
        )
        
        # Create order
        order = Order(
            user_id=data['user_id'],
            items=data['items'],
            payment_id=payment_resp.json()['id'],
            reservation_id=reservation_id
        )
        db.session.add(order)
        db.session.commit()
        
        # Publish event for async processing
        publish_event('order.created', order.to_dict())
        
        return jsonify(order.to_dict()), 201
        
    except Exception as e:
        # Compensating transactions
        rollback_order(reservation_id, payment_id)
        raise
```

## Service Communication

### Synchronous Communication (REST)

```python
# service_client.py
import requests
from typing import Optional
import time
from circuit_breaker import CircuitBreaker

class ServiceClient:
    def __init__(self, base_url: str, timeout: int = 5):
        self.base_url = base_url
        self.timeout = timeout
        self.circuit_breaker = CircuitBreaker()
    
    def get(self, path: str, params: Optional[dict] = None):
        """GET request with circuit breaker and retry"""
        return self.circuit_breaker.call(
            self._make_request,
            'GET',
            path,
            params=params
        )
    
    def post(self, path: str, json: Optional[dict] = None):
        """POST request with circuit breaker"""
        return self.circuit_breaker.call(
            self._make_request,
            'POST',
            path,
            json=json
        )
    
    def _make_request(self, method: str, path: str, **kwargs):
        """Make HTTP request with retry logic"""
        url = f"{self.base_url}{path}"
        
        for attempt in range(3):
            try:
                response = requests.request(
                    method,
                    url,
                    timeout=self.timeout,
                    **kwargs
                )
                response.raise_for_status()
                return response.json()
                
            except requests.exceptions.Timeout:
                if attempt == 2:
                    raise
                time.sleep(2 ** attempt)  # Exponential backoff
            
            except requests.exceptions.RequestException as e:
                raise

# Usage
user_service = ServiceClient('http://user-service:8000')
inventory_service = ServiceClient('http://inventory-service:8000')

user = user_service.get('/users/123')
availability = inventory_service.post('/inventory/check', json={'items': [...]})
```

### Asynchronous Communication (Message Queue)

```python
# message_publisher.py
import pika
import json
from typing import Dict, Any

class MessagePublisher:
    def __init__(self, rabbitmq_url: str):
        self.connection = pika.BlockingConnection(
            pika.URLParameters(rabbitmq_url)
        )
        self.channel = self.connection.channel()
    
    def publish_event(self, event_type: str, data: Dict[Any, Any]):
        """Publish event to exchange"""
        exchange = 'events'
        
        # Declare exchange
        self.channel.exchange_declare(
            exchange=exchange,
            exchange_type='topic',
            durable=True
        )
        
        # Publish message
        self.channel.basic_publish(
            exchange=exchange,
            routing_key=event_type,
            body=json.dumps(data),
            properties=pika.BasicProperties(
                delivery_mode=2,  # Persistent
                content_type='application/json'
            )
        )
    
    def close(self):
        self.connection.close()

# message_consumer.py
class MessageConsumer:
    def __init__(self, rabbitmq_url: str, queue_name: str):
        self.connection = pika.BlockingConnection(
            pika.URLParameters(rabbitmq_url)
        )
        self.channel = self.connection.channel()
        self.queue_name = queue_name
        
        # Declare queue
        self.channel.queue_declare(queue=queue_name, durable=True)
    
    def subscribe(self, event_types: list, callback):
        """Subscribe to events"""
        exchange = 'events'
        
        for event_type in event_types:
            self.channel.queue_bind(
                queue=self.queue_name,
                exchange=exchange,
                routing_key=event_type
            )
        
        self.channel.basic_qos(prefetch_count=1)
        self.channel.basic_consume(
            queue=self.queue_name,
            on_message_callback=callback
        )
        
        print(f'Waiting for messages on {self.queue_name}...')
        self.channel.start_consuming()

# notification-service/worker.py
publisher = MessagePublisher('amqp://rabbitmq:5672')
consumer = MessageConsumer('amqp://rabbitmq:5672', 'notifications')

def handle_order_created(ch, method, properties, body):
    """Handle order created event"""
    data = json.loads(body)
    
    # Send notification
    send_email(
        to=data['user_email'],
        subject='Order Confirmation',
        body=f"Order {data['order_id']} created successfully"
    )
    
    # Acknowledge message
    ch.basic_ack(delivery_tag=method.delivery_tag)

# Subscribe to order events
consumer.subscribe(['order.created', 'order.shipped'], handle_order_created)

# shipping-service/worker.py
def handle_order_created(ch, method, properties, body):
    """Handle order created event and create shipment"""
    data = json.loads(body)
    
    # Create shipment
    shipment = create_shipment(data['order_id'], data['items'])
    
    # Publish shipment created event
    publisher.publish_event('shipment.created', {
        'shipment_id': shipment.id,
        'order_id': data['order_id'],
        'tracking_number': shipment.tracking_number
    })
    
    ch.basic_ack(delivery_tag=method.delivery_tag)
```

### gRPC Communication

```protobuf
// user.proto
syntax = "proto3";

package user;

service UserService {
  rpc GetUser(GetUserRequest) returns (User);
  rpc ValidateUser(ValidateUserRequest) returns (ValidateUserResponse);
  rpc CreateUser(CreateUserRequest) returns (User);
}

message User {
  string id = 1;
  string email = 2;
  string name = 3;
  bool active = 4;
}

message GetUserRequest {
  string id = 1;
}

message ValidateUserRequest {
  string id = 1;
}

message ValidateUserResponse {
  bool valid = 1;
  string reason = 2;
}

message CreateUserRequest {
  string email = 1;
  string name = 2;
}
```

```python
# user_service_grpc.py
import grpc
from concurrent import futures
import user_pb2
import user_pb2_grpc

class UserService(user_pb2_grpc.UserServiceServicer):
    def GetUser(self, request, context):
        user = db.query(User).filter_by(id=request.id).first()
        
        if not user:
            context.set_code(grpc.StatusCode.NOT_FOUND)
            context.set_details('User not found')
            return user_pb2.User()
        
        return user_pb2.User(
            id=user.id,
            email=user.email,
            name=user.name,
            active=user.active
        )
    
    def ValidateUser(self, request, context):
        user = db.query(User).filter_by(id=request.id).first()
        
        if not user:
            return user_pb2.ValidateUserResponse(
                valid=False,
                reason='User not found'
            )
        
        if not user.active:
            return user_pb2.ValidateUserResponse(
                valid=False,
                reason='User inactive'
            )
        
        return user_pb2.ValidateUserResponse(valid=True)

def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    user_pb2_grpc.add_UserServiceServicer_to_server(UserService(), server)
    server.add_insecure_port('[::]:50051')
    server.start()
    server.wait_for_termination()

# user_client.py
import grpc
import user_pb2
import user_pb2_grpc

class UserServiceClient:
    def __init__(self, host: str, port: int):
        self.channel = grpc.insecure_channel(f'{host}:{port}')
        self.stub = user_pb2_grpc.UserServiceStub(self.channel)
    
    def get_user(self, user_id: str):
        request = user_pb2.GetUserRequest(id=user_id)
        return self.stub.GetUser(request)
    
    def validate_user(self, user_id: str):
        request = user_pb2.ValidateUserRequest(id=user_id)
        return self.stub.ValidateUser(request)

# Usage
client = UserServiceClient('user-service', 50051)
user = client.get_user('123')
validation = client.validate_user('123')
```

## Service Discovery

### Consul Integration

```python
# service_registry.py
import consul
import socket

class ServiceRegistry:
    def __init__(self, consul_host: str = 'localhost', consul_port: int = 8500):
        self.consul = consul.Consul(host=consul_host, port=consul_port)
    
    def register_service(self, service_name: str, service_port: int,
                        health_check_path: str = '/health'):
        """Register service with Consul"""
        service_id = f"{service_name}-{socket.gethostname()}"
        
        self.consul.agent.service.register(
            name=service_name,
            service_id=service_id,
            address=socket.gethostbyname(socket.gethostname()),
            port=service_port,
            check=consul.Check.http(
                f"http://localhost:{service_port}{health_check_path}",
                interval='10s',
                timeout='5s'
            )
        )
        
        return service_id
    
    def deregister_service(self, service_id: str):
        """Deregister service from Consul"""
        self.consul.agent.service.deregister(service_id)
    
    def discover_service(self, service_name: str):
        """Discover healthy service instances"""
        _, services = self.consul.health.service(service_name, passing=True)
        
        instances = []
        for service in services:
            instances.append({
                'address': service['Service']['Address'],
                'port': service['Service']['Port']
            })
        
        return instances

# Usage in service
registry = ServiceRegistry()

# Register on startup
service_id = registry.register_service('user-service', 8000)

# Discover other services
inventory_instances = registry.discover_service('inventory-service')
if inventory_instances:
    instance = inventory_instances[0]
    inventory_url = f"http://{instance['address']}:{instance['port']}"

# Deregister on shutdown
registry.deregister_service(service_id)
```

### Kubernetes Service Discovery

```yaml
# user-service.yaml
apiVersion: v1
kind: Service
metadata:
  name: user-service
spec:
  selector:
    app: user-service
  ports:
    - port: 80
      targetPort: 8000
  type: ClusterIP
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: user-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: user-service
  template:
    metadata:
      labels:
        app: user-service
    spec:
      containers:
        - name: user-service
          image: user-service:latest
          ports:
            - containerPort: 8000
          env:
            - name: DATABASE_URL
              valueFrom:
                secretKeyRef:
                  name: user-service-secrets
                  key: database-url
```

```python
# Using Kubernetes DNS for service discovery
import requests

# Service discovery via DNS (automatic in Kubernetes)
user_service_url = "http://user-service"  # Resolves to service
inventory_service_url = "http://inventory-service"
payment_service_url = "http://payment-service"

# Cross-namespace discovery
admin_service_url = "http://admin-service.admin-namespace.svc.cluster.local"

# Make request
response = requests.get(f"{user_service_url}/users/123")
```

## Data Management

### Database per Service

```python
# user-service with its own database
# user-service/models.py
from sqlalchemy import create_engine
import os

# Each service has its own database
DATABASE_URL = os.getenv('DATABASE_URL', 'postgresql://localhost/users_db')
engine = create_engine(DATABASE_URL)

class User(Base):
    __tablename__ = 'users'
    id = Column(String, primary_key=True)
    email = Column(String, unique=True)
    name = Column(String)

# order-service with its own database
# order-service/models.py
DATABASE_URL = os.getenv('DATABASE_URL', 'postgresql://localhost/orders_db')
engine = create_engine(DATABASE_URL)

class Order(Base):
    __tablename__ = 'orders'
    id = Column(String, primary_key=True)
    user_id = Column(String)  # Reference, not foreign key
    status = Column(String)
```

### Saga Pattern for Distributed Transactions

```python
# saga_orchestrator.py
from enum import Enum
from typing import List, Callable
import requests

class SagaStep:
    def __init__(self, name: str, action: Callable, compensate: Callable):
        self.name = name
        self.action = action
        self.compensate = compensate

class SagaOrchestrator:
    def __init__(self):
        self.steps: List[SagaStep] = []
        self.completed_steps: List[SagaStep] = []
    
    def add_step(self, name: str, action: Callable, compensate: Callable):
        """Add step to saga"""
        self.steps.append(SagaStep(name, action, compensate))
    
    def execute(self, context: dict):
        """Execute saga with compensation on failure"""
        try:
            # Execute all steps
            for step in self.steps:
                print(f"Executing: {step.name}")
                result = step.action(context)
                context[step.name] = result
                self.completed_steps.append(step)
            
            return context
            
        except Exception as e:
            print(f"Saga failed at {step.name}: {e}")
            self._compensate(context)
            raise
    
    def _compensate(self, context: dict):
        """Execute compensation for completed steps in reverse"""
        for step in reversed(self.completed_steps):
            try:
                print(f"Compensating: {step.name}")
                step.compensate(context)
            except Exception as e:
                print(f"Compensation failed for {step.name}: {e}")

# Example: Order creation saga
def create_order_saga(user_id: str, items: list, payment_token: str):
    saga = SagaOrchestrator()
    
    # Step 1: Reserve inventory
    def reserve_inventory(ctx):
        response = requests.post(
            'http://inventory-service/reserve',
            json={'items': items}
        )
        return response.json()['reservation_id']
    
    def release_inventory(ctx):
        requests.post(
            'http://inventory-service/release',
            json={'reservation_id': ctx['reserve_inventory']}
        )
    
    saga.add_step('reserve_inventory', reserve_inventory, release_inventory)
    
    # Step 2: Process payment
    def process_payment(ctx):
        response = requests.post(
            'http://payment-service/charge',
            json={'token': payment_token, 'amount': 100}
        )
        return response.json()['payment_id']
    
    def refund_payment(ctx):
        requests.post(
            'http://payment-service/refund',
            json={'payment_id': ctx['process_payment']}
        )
    
    saga.add_step('process_payment', process_payment, refund_payment)
    
    # Step 3: Create order
    def create_order(ctx):
        response = requests.post(
            'http://order-service/orders',
            json={
                'user_id': user_id,
                'items': items,
                'reservation_id': ctx['reserve_inventory'],
                'payment_id': ctx['process_payment']
            }
        )
        return response.json()['order_id']
    
    def cancel_order(ctx):
        requests.post(
            'http://order-service/orders/cancel',
            json={'order_id': ctx['create_order']}
        )
    
    saga.add_step('create_order', create_order, cancel_order)
    
    # Execute saga
    return saga.execute({'user_id': user_id})
```

## API Gateway

```python
# api_gateway.py
from flask import Flask, request, jsonify
import requests
from functools import wraps

app = Flask(__name__)

# Service registry
SERVICES = {
    'user': 'http://user-service:8000',
    'order': 'http://order-service:8000',
    'inventory': 'http://inventory-service:8000',
    'payment': 'http://payment-service:8000'
}

def authenticate(f):
    """Authentication middleware"""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        
        if not token:
            return jsonify({'error': 'No token provided'}), 401
        
        # Validate token
        auth_response = requests.post(
            f"{SERVICES['user']}/auth/validate",
            headers={'Authorization': token}
        )
        
        if auth_response.status_code != 200:
            return jsonify({'error': 'Invalid token'}), 401
        
        request.user = auth_response.json()
        return f(*args, **kwargs)
    
    return decorated

def rate_limit(f):
    """Rate limiting middleware"""
    @wraps(f)
    def decorated(*args, **kwargs):
        # Implement rate limiting logic
        return f(*args, **kwargs)
    return decorated

# Route aggregation
@app.route('/api/users/<user_id>/orders', methods=['GET'])
@authenticate
@rate_limit
def get_user_orders(user_id):
    """Aggregate user and order data"""
    # Get user
    user_response = requests.get(f"{SERVICES['user']}/users/{user_id}")
    
    # Get orders
    orders_response = requests.get(
        f"{SERVICES['order']}/orders",
        params={'user_id': user_id}
    )
    
    return jsonify({
        'user': user_response.json(),
        'orders': orders_response.json()
    })

# Request routing
@app.route('/api/<service>/<path:path>', methods=['GET', 'POST', 'PUT', 'DELETE'])
@authenticate
@rate_limit
def proxy_request(service, path):
    """Route request to appropriate service"""
    if service not in SERVICES:
        return jsonify({'error': 'Service not found'}), 404
    
    service_url = f"{SERVICES[service]}/{path}"
    
    resp = requests.request(
        method=request.method,
        url=service_url,
        json=request.get_json() if request.is_json else None,
        params=request.args,
        headers={k: v for k, v in request.headers if k != 'Host'}
    )
    
    return (resp.content, resp.status_code, resp.headers.items())
```

## Key Takeaways

1. **Service decomposition** splits monoliths into independent services
2. **Communication** can be synchronous (REST/gRPC) or asynchronous (messages)
3. **Service discovery** enables dynamic service location
4. **Sagas** handle distributed transactions across services
5. **API gateways** provide single entry point and cross-cutting concerns

## Next Steps

- Explore service mesh architectures
- Learn about event sourcing and CQRS
- Study microservices observability
