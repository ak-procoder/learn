---
id: advanced-24
title: Cloud-Native Development Patterns
type: text
---

# Cloud-Native Development Patterns

## Overview

Cloud-native development is an approach to building and running applications that exploits cloud computing advantages. This lesson covers the fundamental patterns, principles, and practices of cloud-native architecture.

## The Twelve-Factor App

### I. Codebase

**One codebase tracked in revision control, many deploys**

```bash
# Git repository structure
my-app/
├── .git/
├── src/
├── tests/
├── Dockerfile
├── docker-compose.yml
├── kubernetes/
│   ├── dev/
│   ├── staging/
│   └── production/
└── README.md

# Multiple environments from single codebase
git checkout main        # Production
git checkout staging     # Staging
git checkout develop     # Development
```

### II. Dependencies

**Explicitly declare and isolate dependencies**

```python
# requirements.txt
flask==2.3.0
psycopg2-binary==2.9.6
redis==4.5.5
celery==5.2.7
gunicorn==20.1.0

# Pipfile for pipenv
[packages]
flask = "~=2.3"
psycopg2-binary = "~=2.9"
redis = "~=4.5"
celery = "~=5.2"

[dev-packages]
pytest = "*"
black = "*"
flake8 = "*"
```

```javascript
// package.json
{
  "name": "my-app",
  "version": "1.0.0",
  "dependencies": {
    "express": "^4.18.2",
    "pg": "^8.11.0",
    "redis": "^4.6.7",
    "dotenv": "^16.0.3"
  },
  "devDependencies": {
    "jest": "^29.5.0",
    "eslint": "^8.42.0",
    "nodemon": "^2.0.22"
  }
}
```

### III. Config

**Store config in the environment**

```python
# config.py
import os
from typing import Optional

class Config:
    """Base configuration"""
    # Database
    DATABASE_URL: str = os.getenv('DATABASE_URL', 'postgresql://localhost/myapp')
    
    # Redis
    REDIS_URL: str = os.getenv('REDIS_URL', 'redis://localhost:6379/0')
    
    # Application
    SECRET_KEY: str = os.getenv('SECRET_KEY', 'dev-secret-key')
    DEBUG: bool = os.getenv('DEBUG', 'False').lower() == 'true'
    
    # External Services
    API_BASE_URL: str = os.getenv('API_BASE_URL', 'https://api.example.com')
    API_KEY: str = os.getenv('API_KEY', '')
    
    # Logging
    LOG_LEVEL: str = os.getenv('LOG_LEVEL', 'INFO')
    
    @classmethod
    def validate(cls):
        """Validate required configuration"""
        required = ['DATABASE_URL', 'SECRET_KEY', 'API_KEY']
        missing = [key for key in required if not getattr(cls, key)]
        
        if missing:
            raise ValueError(f"Missing required config: {', '.join(missing)}")

class DevelopmentConfig(Config):
    DEBUG = True

class ProductionConfig(Config):
    DEBUG = False

# Select config based on environment
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}

def get_config(env: Optional[str] = None) -> Config:
    env = env or os.getenv('ENVIRONMENT', 'development')
    return config.get(env, config['default'])
```

```yaml
# Kubernetes ConfigMap
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  DATABASE_URL: "postgresql://postgres:5432/myapp"
  REDIS_URL: "redis://redis:6379/0"
  LOG_LEVEL: "INFO"
  API_BASE_URL: "https://api.example.com"
---
# Kubernetes Secret
apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
type: Opaque
stringData:
  SECRET_KEY: "production-secret-key"
  API_KEY: "your-api-key"
```

### IV. Backing Services

**Treat backing services as attached resources**

```python
# database.py
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

class DatabaseConnection:
    def __init__(self):
        self.engine = None
        self.session_factory = None
    
    def connect(self, database_url: str = None):
        """Connect to database using URL from config"""
        url = database_url or os.getenv('DATABASE_URL')
        self.engine = create_engine(url)
        self.session_factory = sessionmaker(bind=self.engine)
    
    def get_session(self):
        """Get database session"""
        return self.session_factory()

# cache.py
import redis
import os

class CacheConnection:
    def __init__(self):
        self.client = None
    
    def connect(self, redis_url: str = None):
        """Connect to Redis using URL from config"""
        url = redis_url or os.getenv('REDIS_URL')
        self.client = redis.from_url(url)
    
    def get(self, key: str):
        return self.client.get(key)
    
    def set(self, key: str, value: str, ttl: int = 3600):
        self.client.setex(key, ttl, value)

# Easy to swap implementations
db = DatabaseConnection()
db.connect()  # Uses DATABASE_URL from environment

cache = CacheConnection()
cache.connect()  # Uses REDIS_URL from environment
```

### V. Build, Release, Run

**Strictly separate build and run stages**

```dockerfile
# Multi-stage Dockerfile
# Build stage
FROM node:18-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Release stage
FROM node:18-alpine AS release
WORKDIR /app

COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY package*.json ./

# Run stage
FROM node:18-alpine
WORKDIR /app

COPY --from=release /app ./

USER node
EXPOSE 3000

CMD ["node", "dist/server.js"]
```

```yaml
# CI/CD Pipeline
name: Build and Deploy

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      # Build
      - name: Build Docker image
        run: |
          docker build -t myapp:${{ github.sha }} .
          docker tag myapp:${{ github.sha }} myapp:latest
      
      # Push to registry
      - name: Push to ECR
        run: |
          aws ecr get-login-password | docker login --username AWS --password-stdin $ECR_REGISTRY
          docker push myapp:${{ github.sha }}
  
  release:
    needs: build
    runs-on: ubuntu-latest
    steps:
      # Create release with config
      - name: Create release manifest
        run: |
          cat > release.yaml <<EOF
          image: myapp:${{ github.sha }}
          config:
            DATABASE_URL: \${{ secrets.DATABASE_URL }}
            SECRET_KEY: \${{ secrets.SECRET_KEY }}
          EOF
  
  deploy:
    needs: release
    runs-on: ubuntu-latest
    steps:
      # Deploy to Kubernetes
      - name: Deploy
        run: |
          kubectl set image deployment/myapp myapp=myapp:${{ github.sha }}
          kubectl rollout status deployment/myapp
```

### VI. Processes

**Execute the app as one or more stateless processes**

```python
# stateless_service.py
from flask import Flask, request, jsonify
from redis import Redis
import os

app = Flask(__name__)
redis = Redis.from_url(os.getenv('REDIS_URL'))

@app.route('/api/counter', methods=['POST'])
def increment_counter():
    """Stateless - state stored in Redis"""
    user_id = request.json.get('user_id')
    
    # Don't store in process memory - use backing service
    counter = redis.incr(f'user:{user_id}:counter')
    
    return jsonify({'counter': counter})

@app.route('/api/session', methods=['POST'])
def create_session():
    """Stateless - session in Redis, not memory"""
    session_id = request.json.get('session_id')
    session_data = request.json.get('data')
    
    # Store session in Redis with TTL
    redis.setex(
        f'session:{session_id}',
        3600,  # 1 hour TTL
        json.dumps(session_data)
    )
    
    return jsonify({'status': 'created'})

if __name__ == '__main__':
    # Processes are stateless and disposable
    app.run()
```

### VII. Port Binding

**Export services via port binding**

```python
# server.py
from flask import Flask
import os

app = Flask(__name__)

@app.route('/health')
def health():
    return {'status': 'healthy'}

@app.route('/')
def index():
    return {'message': 'Hello from cloud-native app'}

if __name__ == '__main__':
    # Self-contained, export HTTP via port binding
    port = int(os.getenv('PORT', 8000))
    app.run(host='0.0.0.0', port=port)
```

```yaml
# Kubernetes Service
apiVersion: v1
kind: Service
metadata:
  name: myapp
spec:
  selector:
    app: myapp
  ports:
    - protocol: TCP
      port: 80
      targetPort: 8000  # App binds to port 8000
  type: LoadBalancer
```

### VIII. Concurrency

**Scale out via the process model**

```yaml
# docker-compose.yml
version: '3.8'

services:
  web:
    image: myapp:latest
    deploy:
      replicas: 3  # Scale web processes
    environment:
      - PROCESS_TYPE=web
    ports:
      - "8000-8002:8000"
  
  worker:
    image: myapp:latest
    deploy:
      replicas: 5  # Scale worker processes
    environment:
      - PROCESS_TYPE=worker
      - WORKER_CONCURRENCY=4
  
  scheduler:
    image: myapp:latest
    deploy:
      replicas: 1  # Single scheduler
    environment:
      - PROCESS_TYPE=scheduler
```

```python
# Procfile approach
# web: gunicorn app:app --workers 4 --worker-class gevent
# worker: celery -A tasks worker --concurrency=10
# scheduler: celery -A tasks beat

import os
import sys

process_type = os.getenv('PROCESS_TYPE', 'web')

if process_type == 'web':
    # Run web server
    from gunicorn.app.base import BaseApplication
    from app import app
    
    class StandaloneApplication(BaseApplication):
        def load_config(self):
            self.cfg.set('bind', '0.0.0.0:8000')
            self.cfg.set('workers', 4)
        
        def load(self):
            return app
    
    StandaloneApplication().run()

elif process_type == 'worker':
    # Run Celery worker
    from celery import Celery
    from tasks import celery_app
    
    celery_app.worker_main(['worker', '--loglevel=info'])

elif process_type == 'scheduler':
    # Run Celery beat
    from tasks import celery_app
    
    celery_app.Beat().run()
```

### IX. Disposability

**Maximize robustness with fast startup and graceful shutdown**

```python
# graceful_shutdown.py
import signal
import sys
import time
from flask import Flask

app = Flask(__name__)

class GracefulShutdown:
    def __init__(self):
        self.is_shutting_down = False
        self.active_requests = 0
        
        # Register signal handlers
        signal.signal(signal.SIGTERM, self.handle_sigterm)
        signal.signal(signal.SIGINT, self.handle_sigterm)
    
    def handle_sigterm(self, signum, frame):
        """Handle shutdown signal gracefully"""
        print("Received shutdown signal, draining connections...")
        self.is_shutting_down = True
        
        # Wait for active requests to complete
        timeout = 30  # 30 second grace period
        start = time.time()
        
        while self.active_requests > 0 and (time.time() - start) < timeout:
            print(f"Waiting for {self.active_requests} requests to complete...")
            time.sleep(1)
        
        print("Shutdown complete")
        sys.exit(0)
    
    def track_request(self):
        """Context manager to track active requests"""
        class RequestTracker:
            def __init__(tracker_self, shutdown_handler):
                tracker_self.shutdown = shutdown_handler
            
            def __enter__(tracker_self):
                if tracker_self.shutdown.is_shutting_down:
                    raise Exception("Service is shutting down")
                tracker_self.shutdown.active_requests += 1
            
            def __exit__(tracker_self, *args):
                tracker_self.shutdown.active_requests -= 1
        
        return RequestTracker(self)

shutdown_handler = GracefulShutdown()

@app.before_request
def before_request():
    request.tracker = shutdown_handler.track_request()
    request.tracker.__enter__()

@app.after_request
def after_request(response):
    if hasattr(request, 'tracker'):
        request.tracker.__exit__()
    return response

@app.route('/health')
def health():
    if shutdown_handler.is_shutting_down:
        return {'status': 'draining'}, 503
    return {'status': 'healthy'}
```

### X. Dev/Prod Parity

**Keep development, staging, and production as similar as possible**

```yaml
# docker-compose.yml (matches production Kubernetes)
version: '3.8'

services:
  app:
    build: .
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/myapp
      - REDIS_URL=redis://redis:6379/0
    depends_on:
      - db
      - redis
  
  db:
    image: postgres:15-alpine  # Same version as production
    environment:
      - POSTGRES_DB=myapp
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
  
  redis:
    image: redis:7-alpine  # Same version as production
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

### XI. Logs

**Treat logs as event streams**

```python
# logging_config.py
import logging
import sys
import json
from datetime import datetime

class JSONFormatter(logging.Formatter):
    def format(self, record):
        log_record = {
            'timestamp': datetime.utcnow().isoformat(),
            'level': record.levelname,
            'message': record.getMessage(),
            'logger': record.name,
        }
        
        if record.exc_info:
            log_record['exception'] = self.formatException(record.exc_info)
        
        return json.dumps(log_record)

# Configure logging to stdout
handler = logging.StreamHandler(sys.stdout)
handler.setFormatter(JSONFormatter())

logger = logging.getLogger()
logger.addHandler(handler)
logger.setLevel(logging.INFO)

# Application just writes to stdout
logger.info("Application started")
logger.error("Error occurred", extra={'user_id': 123})

# Log aggregation handled by platform (Fluentd, CloudWatch, etc.)
```

### XII. Admin Processes

**Run admin/management tasks as one-off processes**

```python
# manage.py
import click
from app import db, create_app

@click.group()
def cli():
    """Management commands"""
    pass

@cli.command()
def migrate():
    """Run database migrations"""
    click.echo("Running migrations...")
    # Migration logic
    db.create_all()
    click.echo("Migrations complete")

@cli.command()
def seed():
    """Seed database with initial data"""
    click.echo("Seeding database...")
    # Seeding logic
    click.echo("Seeding complete")

@cli.command()
@click.argument('email')
def create_admin(email):
    """Create admin user"""
    click.echo(f"Creating admin user: {email}")
    # Create admin logic
    click.echo("Admin created")

if __name__ == '__main__':
    cli()
```

```yaml
# Kubernetes Job for one-off tasks
apiVersion: batch/v1
kind: Job
metadata:
  name: db-migration
spec:
  template:
    spec:
      containers:
        - name: migrate
          image: myapp:latest
          command: ["python", "manage.py", "migrate"]
          envFrom:
            - configMapRef:
                name: app-config
            - secretRef:
                name: app-secrets
      restartPolicy: Never
  backoffLimit: 3
```

## Cloud-Native Patterns

### Circuit Breaker

```python
# circuit_breaker.py
from enum import Enum
from datetime import datetime, timedelta
from typing import Callable, Any
import time

class CircuitState(Enum):
    CLOSED = "closed"      # Normal operation
    OPEN = "open"          # Failing, reject requests
    HALF_OPEN = "half_open"  # Testing if service recovered

class CircuitBreaker:
    def __init__(self, failure_threshold: int = 5, 
                 timeout_seconds: int = 60,
                 success_threshold: int = 2):
        self.failure_threshold = failure_threshold
        self.timeout_seconds = timeout_seconds
        self.success_threshold = success_threshold
        
        self.state = CircuitState.CLOSED
        self.failure_count = 0
        self.success_count = 0
        self.last_failure_time = None
    
    def call(self, func: Callable, *args, **kwargs) -> Any:
        """Execute function with circuit breaker protection"""
        if self.state == CircuitState.OPEN:
            if self._should_attempt_reset():
                self.state = CircuitState.HALF_OPEN
            else:
                raise Exception("Circuit breaker is OPEN")
        
        try:
            result = func(*args, **kwargs)
            self._on_success()
            return result
        except Exception as e:
            self._on_failure()
            raise
    
    def _on_success(self):
        """Handle successful call"""
        self.failure_count = 0
        
        if self.state == CircuitState.HALF_OPEN:
            self.success_count += 1
            if self.success_count >= self.success_threshold:
                self.state = CircuitState.CLOSED
                self.success_count = 0
    
    def _on_failure(self):
        """Handle failed call"""
        self.failure_count += 1
        self.last_failure_time = datetime.now()
        self.success_count = 0
        
        if self.failure_count >= self.failure_threshold:
            self.state = CircuitState.OPEN
    
    def _should_attempt_reset(self) -> bool:
        """Check if enough time has passed to try again"""
        return (datetime.now() - self.last_failure_time 
                > timedelta(seconds=self.timeout_seconds))

# Usage
import requests

circuit_breaker = CircuitBreaker(failure_threshold=3, timeout_seconds=30)

def call_external_api():
    return requests.get('https://api.example.com/data', timeout=5)

try:
    response = circuit_breaker.call(call_external_api)
    print(response.json())
except Exception as e:
    print(f"Circuit breaker prevented call or call failed: {e}")
```

## Key Takeaways

1. **Twelve-Factor App** provides cloud-native development principles
2. **Stateless processes** enable horizontal scaling
3. **Config in environment** separates code from configuration
4. **Graceful shutdown** ensures zero-downtime deployments
5. **Circuit breakers** protect against cascading failures

## Next Steps

- Explore microservices architecture patterns
- Learn about service mesh implementations
- Study event-driven architectures
