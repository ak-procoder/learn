---
id: advanced-26
title: Service Mesh and API Gateways
type: text
---

# Service Mesh and API Gateways

## Overview

Service meshes and API gateways are infrastructure layers that handle service-to-service communication, security, observability, and traffic management in microservices architectures. This lesson explores Istio, Linkerd, Kong, and API management patterns.

## Service Mesh Fundamentals

### What is a Service Mesh?

A service mesh is a dedicated infrastructure layer for handling service-to-service communication, providing:

- **Traffic Management**: Load balancing, routing, circuit breaking
- **Security**: mTLS, authentication, authorization
- **Observability**: Metrics, logs, traces
- **Resilience**: Retries, timeouts, fault injection

### Istio Architecture

```yaml
# Install Istio
# istioctl install --set profile=demo

# Enable automatic sidecar injection
apiVersion: v1
kind: Namespace
metadata:
  name: production
  labels:
    istio-injection: enabled
---
# Deploy application
apiVersion: apps/v1
kind: Deployment
metadata:
  name: user-service
  namespace: production
spec:
  replicas: 3
  selector:
    matchLabels:
      app: user-service
  template:
    metadata:
      labels:
        app: user-service
        version: v1
    spec:
      containers:
        - name: user-service
          image: user-service:v1
          ports:
            - containerPort: 8000
          env:
            - name: VERSION
              value: "v1"
```

### Traffic Management

**Virtual Service (Request Routing)**

```yaml
# virtual-service.yaml
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: user-service
spec:
  hosts:
    - user-service
  http:
    # Canary deployment: 90% v1, 10% v2
    - match:
        - headers:
            canary:
              exact: "true"
      route:
        - destination:
            host: user-service
            subset: v2
          weight: 100
    
    - route:
        - destination:
            host: user-service
            subset: v1
          weight: 90
        - destination:
            host: user-service
            subset: v2
          weight: 10
---
# Destination Rule (Define subsets)
apiVersion: networking.istio.io/v1beta1
kind: DestinationRule
metadata:
  name: user-service
spec:
  host: user-service
  trafficPolicy:
    loadBalancer:
      simple: LEAST_REQUEST
    connectionPool:
      tcp:
        maxConnections: 100
      http:
        http1MaxPendingRequests: 10
        maxRequestsPerConnection: 2
    outlierDetection:
      consecutive5xxErrors: 5
      interval: 30s
      baseEjectionTime: 30s
      maxEjectionPercent: 50
  subsets:
    - name: v1
      labels:
        version: v1
    - name: v2
      labels:
        version: v2
```

**Traffic Splitting**

```yaml
# A/B testing
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: ab-test
spec:
  hosts:
    - myapp.example.com
  http:
    # Route mobile users to v2
    - match:
        - headers:
            user-agent:
              regex: ".*Mobile.*"
      route:
        - destination:
            host: myapp
            subset: v2
    
    # Default route to v1
    - route:
        - destination:
            host: myapp
            subset: v1
```

**Circuit Breaking**

```yaml
# circuit-breaker.yaml
apiVersion: networking.istio.io/v1beta1
kind: DestinationRule
metadata:
  name: payment-service
spec:
  host: payment-service
  trafficPolicy:
    connectionPool:
      tcp:
        maxConnections: 10
      http:
        http1MaxPendingRequests: 5
        maxRequestsPerConnection: 1
    outlierDetection:
      consecutiveErrors: 3
      interval: 30s
      baseEjectionTime: 60s
      maxEjectionPercent: 100
      minHealthPercent: 50
```

**Fault Injection**

```yaml
# fault-injection.yaml
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: chaos-testing
spec:
  hosts:
    - order-service
  http:
    - fault:
        # Inject 500ms delay for 10% of requests
        delay:
          percentage:
            value: 10.0
          fixedDelay: 500ms
        
        # Abort 5% of requests with 503
        abort:
          percentage:
            value: 5.0
          httpStatus: 503
      
      route:
        - destination:
            host: order-service
```

**Retry Policy**

```yaml
# retry-policy.yaml
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: resilient-service
spec:
  hosts:
    - payment-service
  http:
    - retries:
        attempts: 3
        perTryTimeout: 2s
        retryOn: 5xx,reset,connect-failure,refused-stream
      
      timeout: 10s
      
      route:
        - destination:
            host: payment-service
```

### Security

**mTLS (Mutual TLS)**

```yaml
# peer-authentication.yaml
apiVersion: security.istio.io/v1beta1
kind: PeerAuthentication
metadata:
  name: default
  namespace: production
spec:
  mtls:
    mode: STRICT  # Enforce mTLS for all services
---
# Destination rule for mTLS
apiVersion: networking.istio.io/v1beta1
kind: DestinationRule
metadata:
  name: mtls-default
  namespace: production
spec:
  host: "*.production.svc.cluster.local"
  trafficPolicy:
    tls:
      mode: ISTIO_MUTUAL  # Use Istio's mTLS
```

**Authorization Policies**

```yaml
# authorization-policy.yaml
apiVersion: security.istio.io/v1beta1
kind: AuthorizationPolicy
metadata:
  name: user-service-authz
  namespace: production
spec:
  selector:
    matchLabels:
      app: user-service
  
  action: ALLOW
  
  rules:
    # Allow GET from any service
    - from:
        - source:
            principals: ["cluster.local/ns/production/sa/*"]
      to:
        - operation:
            methods: ["GET"]
    
    # Allow POST only from API gateway
    - from:
        - source:
            principals: ["cluster.local/ns/production/sa/api-gateway"]
      to:
        - operation:
            methods: ["POST", "PUT", "DELETE"]
---
# Deny all by default
apiVersion: security.istio.io/v1beta1
kind: AuthorizationPolicy
metadata:
  name: deny-all
  namespace: production
spec:
  {}  # Empty spec = deny all
```

**JWT Authentication**

```yaml
# jwt-auth.yaml
apiVersion: security.istio.io/v1beta1
kind: RequestAuthentication
metadata:
  name: jwt-auth
  namespace: production
spec:
  selector:
    matchLabels:
      app: api-gateway
  jwtRules:
    - issuer: "https://auth.example.com"
      jwksUri: "https://auth.example.com/.well-known/jwks.json"
      audiences:
        - "api.example.com"
---
# Require valid JWT
apiVersion: security.istio.io/v1beta1
kind: AuthorizationPolicy
metadata:
  name: require-jwt
spec:
  selector:
    matchLabels:
      app: api-gateway
  action: ALLOW
  rules:
    - from:
        - source:
            requestPrincipals: ["*"]
```

### Observability

**Telemetry Collection**

```yaml
# telemetry.yaml
apiVersion: telemetry.istio.io/v1alpha1
kind: Telemetry
metadata:
  name: custom-metrics
  namespace: production
spec:
  metrics:
    - providers:
        - name: prometheus
      dimensions:
        request_protocol: request.protocol
        response_code: response.code
        source_service: source.service.name
        destination_service: destination.service.name
      overrides:
        - match:
            metric: REQUEST_COUNT
          tagOverrides:
            response_code:
              value: "response.code"
```

**Distributed Tracing**

```yaml
# Enable tracing with Jaeger
apiVersion: install.istio.io/v1alpha1
kind: IstioOperator
spec:
  meshConfig:
    enableTracing: true
    defaultConfig:
      tracing:
        sampling: 100.0  # 100% sampling for demo
        zipkin:
          address: jaeger-collector.istio-system:9411
```

## Linkerd Service Mesh

### Installation and Setup

```bash
# Install Linkerd CLI
curl -sL https://run.linkerd.io/install | sh

# Check prerequisites
linkerd check --pre

# Install Linkerd
linkerd install | kubectl apply -f -

# Verify installation
linkerd check

# Install viz extension for observability
linkerd viz install | kubectl apply -f -
```

### Inject Linkerd Proxy

```yaml
# Automatic injection
apiVersion: v1
kind: Namespace
metadata:
  name: production
  annotations:
    linkerd.io/inject: enabled
---
# Manual injection via annotation
apiVersion: apps/v1
kind: Deployment
metadata:
  name: user-service
  annotations:
    linkerd.io/inject: enabled
spec:
  replicas: 3
  template:
    spec:
      containers:
        - name: user-service
          image: user-service:latest
```

### Traffic Split (Canary)

```yaml
# traffic-split.yaml
apiVersion: split.smi-spec.io/v1alpha1
kind: TrafficSplit
metadata:
  name: user-service-split
spec:
  service: user-service
  backends:
    - service: user-service-v1
      weight: 900  # 90%
    - service: user-service-v2
      weight: 100  # 10%
---
# Services for each version
apiVersion: v1
kind: Service
metadata:
  name: user-service-v1
spec:
  selector:
    app: user-service
    version: v1
  ports:
    - port: 80
---
apiVersion: v1
kind: Service
metadata:
  name: user-service-v2
spec:
  selector:
    app: user-service
    version: v2
  ports:
    - port: 80
```

## API Gateway Patterns

### Kong API Gateway

**Installation**

```yaml
# kong-deployment.yaml
apiVersion: v1
kind: Service
metadata:
  name: kong-proxy
spec:
  type: LoadBalancer
  ports:
    - name: proxy
      port: 80
      targetPort: 8000
    - name: proxy-ssl
      port: 443
      targetPort: 8443
  selector:
    app: kong
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: kong
spec:
  replicas: 2
  selector:
    matchLabels:
      app: kong
  template:
    metadata:
      labels:
        app: kong
    spec:
      containers:
        - name: kong
          image: kong:3.0
          env:
            - name: KONG_DATABASE
              value: "postgres"
            - name: KONG_PG_HOST
              value: "postgres"
            - name: KONG_PROXY_ACCESS_LOG
              value: "/dev/stdout"
            - name: KONG_ADMIN_ACCESS_LOG
              value: "/dev/stdout"
            - name: KONG_PROXY_ERROR_LOG
              value: "/dev/stderr"
            - name: KONG_ADMIN_ERROR_LOG
              value: "/dev/stderr"
          ports:
            - containerPort: 8000
            - containerPort: 8443
            - containerPort: 8001
            - containerPort: 8444
```

**API Configuration**

```yaml
# kong-ingress.yaml
apiVersion: configuration.konghq.com/v1
kind: KongPlugin
metadata:
  name: rate-limiting
plugin: rate-limiting
config:
  minute: 100
  policy: local
---
apiVersion: configuration.konghq.com/v1
kind: KongPlugin
metadata:
  name: jwt-auth
plugin: jwt
---
apiVersion: configuration.konghq.com/v1
kind: KongPlugin
metadata:
  name: cors
plugin: cors
config:
  origins:
    - "*"
  methods:
    - GET
    - POST
    - PUT
    - DELETE
  headers:
    - Accept
    - Authorization
    - Content-Type
  credentials: true
  max_age: 3600
---
# Apply plugins to ingress
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: api-ingress
  annotations:
    konghq.com/plugins: rate-limiting,jwt-auth,cors
    konghq.com/strip-path: "true"
spec:
  ingressClassName: kong
  rules:
    - host: api.example.com
      http:
        paths:
          - path: /users
            pathType: Prefix
            backend:
              service:
                name: user-service
                port:
                  number: 80
          
          - path: /orders
            pathType: Prefix
            backend:
              service:
                name: order-service
                port:
                  number: 80
```

### AWS API Gateway

```python
# api_gateway_setup.py
import boto3
import json

class AWSAPIGateway:
    def __init__(self):
        self.client = boto3.client('apigatewayv2')
    
    def create_http_api(self, name: str, target_url: str):
        """Create HTTP API with Lambda integration"""
        # Create API
        api = self.client.create_api(
            Name=name,
            ProtocolType='HTTP',
            Target=target_url
        )
        
        # Create stage
        stage = self.client.create_stage(
            ApiId=api['ApiId'],
            StageName='production',
            AutoDeploy=True
        )
        
        # Add throttling
        self.client.update_stage(
            ApiId=api['ApiId'],
            StageName='production',
            RouteSettings={
                '*': {
                    'ThrottlingBurstLimit': 5000,
                    'ThrottlingRateLimit': 10000
                }
            }
        )
        
        return api
    
    def add_jwt_authorizer(self, api_id: str, issuer: str, audience: list):
        """Add JWT authorizer"""
        authorizer = self.client.create_authorizer(
            ApiId=api_id,
            AuthorizerType='JWT',
            IdentitySource=['$request.header.Authorization'],
            Name='jwt-authorizer',
            JwtConfiguration={
                'Audience': audience,
                'Issuer': issuer
            }
        )
        
        return authorizer
    
    def add_cors(self, api_id: str):
        """Configure CORS"""
        self.client.update_api(
            ApiId=api_id,
            CorsConfiguration={
                'AllowOrigins': ['*'],
                'AllowMethods': ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
                'AllowHeaders': ['Content-Type', 'Authorization'],
                'MaxAge': 3600,
                'AllowCredentials': True
            }
        )

# Usage
gateway = AWSAPIGateway()

# Create API
api = gateway.create_http_api(
    'my-api',
    'https://my-backend.execute-api.us-east-1.amazonaws.com'
)

# Add authorizer
gateway.add_jwt_authorizer(
    api['ApiId'],
    'https://cognito-idp.us-east-1.amazonaws.com/us-east-1_xxxxx',
    ['my-app-client-id']
)

# Configure CORS
gateway.add_cors(api['ApiId'])

print(f"API Endpoint: {api['ApiEndpoint']}")
```

### GraphQL Gateway

```python
# graphql_gateway.py
from ariadne import QueryType, MutationType, make_executable_schema
from ariadne.asgi import GraphQL
import requests

# Schema definition
type_defs = """
    type Query {
        user(id: ID!): User
        orders(userId: ID!): [Order]
    }
    
    type Mutation {
        createOrder(userId: ID!, items: [OrderItemInput!]!): Order
    }
    
    type User {
        id: ID!
        email: String!
        name: String!
        orders: [Order]
    }
    
    type Order {
        id: ID!
        userId: ID!
        items: [OrderItem]
        total: Float!
    }
    
    type OrderItem {
        productId: ID!
        quantity: Int!
        price: Float!
    }
    
    input OrderItemInput {
        productId: ID!
        quantity: Int!
    }
"""

query = QueryType()
mutation = MutationType()

# Resolvers that aggregate multiple services
@query.field("user")
async def resolve_user(obj, info, id):
    # Call user service
    response = requests.get(f'http://user-service/users/{id}')
    return response.json()

@query.field("orders")
async def resolve_orders(obj, info, userId):
    # Call order service
    response = requests.get(
        f'http://order-service/orders',
        params={'userId': userId}
    )
    return response.json()

# Field resolver for nested data
@query.field("User")
async def resolve_user_orders(user, info):
    # Lazy load orders
    response = requests.get(
        f'http://order-service/orders',
        params={'userId': user['id']}
    )
    return response.json()

@mutation.field("createOrder")
async def resolve_create_order(obj, info, userId, items):
    # Call order service
    response = requests.post(
        f'http://order-service/orders',
        json={
            'userId': userId,
            'items': items
        }
    )
    return response.json()

# Create executable schema
schema = make_executable_schema(type_defs, query, mutation)

# ASGI application
app = GraphQL(schema)
```

## API Gateway Patterns

### Rate Limiting

```python
# rate_limiter.py
import redis
from functools import wraps
from flask import request, jsonify
import time

class RateLimiter:
    def __init__(self, redis_client):
        self.redis = redis_client
    
    def limit(self, key_func, limit: int, window: int):
        """Rate limit decorator"""
        def decorator(f):
            @wraps(f)
            def wrapped(*args, **kwargs):
                # Get rate limit key
                key = key_func(request)
                rate_key = f"rate_limit:{key}"
                
                # Sliding window counter
                now = time.time()
                window_start = now - window
                
                # Remove old entries
                self.redis.zremrangebyscore(rate_key, 0, window_start)
                
                # Count requests in window
                request_count = self.redis.zcard(rate_key)
                
                if request_count >= limit:
                    return jsonify({
                        'error': 'Rate limit exceeded',
                        'retry_after': window
                    }), 429
                
                # Add current request
                self.redis.zadd(rate_key, {now: now})
                self.redis.expire(rate_key, window)
                
                return f(*args, **kwargs)
            
            return wrapped
        return decorator

# Usage
redis_client = redis.Redis(host='localhost', port=6379)
rate_limiter = RateLimiter(redis_client)

def get_client_ip(request):
    return request.remote_addr

@app.route('/api/users')
@rate_limiter.limit(get_client_ip, limit=100, window=60)  # 100 req/min
def get_users():
    return jsonify({'users': []})
```

## Key Takeaways

1. **Service meshes** handle cross-cutting concerns like security and observability
2. **Istio** provides comprehensive traffic management and security features
3. **Linkerd** offers lightweight, performant service mesh
4. **API gateways** provide single entry point for external clients
5. **Rate limiting** and **authentication** protect backend services

## Next Steps

- Explore emerging cloud trends
- Learn about cloud certification paths
- Study advanced security patterns
