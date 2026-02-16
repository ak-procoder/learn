---
id: advanced-22
title: Observability, Monitoring and Logging
type: text
---

# Observability, Monitoring and Logging

## Overview

Observability is the ability to understand the internal state of a system from its external outputs. This lesson covers the three pillars of observability: metrics, logs, and traces, along with practical implementation strategies.

## The Three Pillars

### 1. Metrics

**Time-series numerical data points**

```python
# prometheus_metrics.py
from prometheus_client import Counter, Histogram, Gauge, Summary, start_http_server
import time
import random

# Counter: cumulative metric that only goes up
request_count = Counter(
    'http_requests_total',
    'Total HTTP requests',
    ['method', 'endpoint', 'status']
)

# Histogram: samples observations and counts them in configurable buckets
request_duration = Histogram(
    'http_request_duration_seconds',
    'HTTP request latency',
    ['method', 'endpoint'],
    buckets=(0.005, 0.01, 0.025, 0.05, 0.075, 0.1, 0.25, 0.5, 0.75, 1.0, 2.5, 5.0, 7.5, 10.0)
)

# Gauge: metric that can go up and down
active_users = Gauge(
    'active_users',
    'Number of active users'
)

database_connections = Gauge(
    'database_connections_active',
    'Active database connections',
    ['pool']
)

# Summary: similar to histogram but calculates quantiles
response_size = Summary(
    'http_response_size_bytes',
    'HTTP response size in bytes'
)

class MetricsExample:
    def __init__(self):
        self.user_count = 0
    
    def handle_request(self, method: str, endpoint: str):
        """Handle HTTP request with metrics"""
        start = time.time()
        
        try:
            # Simulate request processing
            processing_time = random.uniform(0.01, 0.5)
            time.sleep(processing_time)
            
            # Determine status
            status = random.choices([200, 404, 500], weights=[90, 8, 2])[0]
            
            # Record metrics
            request_count.labels(method=method, endpoint=endpoint, status=status).inc()
            request_duration.labels(method=method, endpoint=endpoint).observe(time.time() - start)
            
            # Response size
            response_size.observe(random.randint(100, 10000))
            
            return status
            
        except Exception as e:
            request_count.labels(method=method, endpoint=endpoint, status=500).inc()
            raise
    
    def user_login(self):
        """Simulate user login"""
        self.user_count += 1
        active_users.set(self.user_count)
    
    def user_logout(self):
        """Simulate user logout"""
        self.user_count -= 1
        active_users.set(self.user_count)

# Start metrics server
if __name__ == '__main__':
    start_http_server(8000)  # Metrics available at http://localhost:8000/metrics
    
    app = MetricsExample()
    
    while True:
        app.handle_request('GET', '/api/users')
        app.handle_request('POST', '/api/orders')
        time.sleep(0.1)
```

**PromQL Queries**

```promql
# Request rate (requests per second)
rate(http_requests_total[5m])

# Request rate by status
sum by (status) (rate(http_requests_total[5m]))

# Error rate percentage
sum(rate(http_requests_total{status=~"5.."}[5m])) / sum(rate(http_requests_total[5m])) * 100

# P95 latency
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))

# P99 latency by endpoint
histogram_quantile(0.99, sum by (endpoint, le) (rate(http_request_duration_seconds_bucket[5m])))

# Average active users over 1 hour
avg_over_time(active_users[1h])

# Request per second threshold alert
rate(http_requests_total[1m]) > 1000
```

### 2. Logging

**Structured logging for searchable, parseable logs**

```python
# structured_logging.py
import logging
import json
from datetime import datetime
from typing import Any, Dict
import traceback

class JSONFormatter(logging.Formatter):
    """Custom JSON formatter for structured logging"""
    
    def format(self, record: logging.LogRecord) -> str:
        log_data: Dict[str, Any] = {
            'timestamp': datetime.utcnow().isoformat(),
            'level': record.levelname,
            'logger': record.name,
            'message': record.getMessage(),
            'module': record.module,
            'function': record.funcName,
            'line': record.lineno,
        }
        
        # Add extra fields
        if hasattr(record, 'user_id'):
            log_data['user_id'] = record.user_id
        if hasattr(record, 'request_id'):
            log_data['request_id'] = record.request_id
        if hasattr(record, 'duration_ms'):
            log_data['duration_ms'] = record.duration_ms
        
        # Add exception info
        if record.exc_info:
            log_data['exception'] = {
                'type': record.exc_info[0].__name__,
                'message': str(record.exc_info[1]),
                'traceback': traceback.format_exception(*record.exc_info)
            }
        
        return json.dumps(log_data)

# Configure structured logging
def setup_logging():
    logger = logging.getLogger()
    logger.setLevel(logging.INFO)
    
    handler = logging.StreamHandler()
    handler.setFormatter(JSONFormatter())
    logger.addHandler(handler)
    
    return logger

# Usage
logger = setup_logging()

# Simple log
logger.info("User logged in")

# Structured log with context
logger.info("Request processed", extra={
    'user_id': '12345',
    'request_id': 'abc-def-123',
    'duration_ms': 45.2,
    'endpoint': '/api/users',
    'method': 'GET'
})

# Error with exception
try:
    result = 1 / 0
except Exception as e:
    logger.error("Calculation failed", exc_info=True, extra={
        'user_id': '12345',
        'operation': 'divide'
    })
```

**ELK Stack Query Examples**

```json
// Elasticsearch query for errors in last hour
{
  "query": {
    "bool": {
      "must": [
        {
          "match": {
            "level": "ERROR"
          }
        },
        {
          "range": {
            "timestamp": {
              "gte": "now-1h"
            }
          }
        }
      ]
    }
  }
}

// Aggregation: error count by service
{
  "size": 0,
  "query": {
    "match": {
      "level": "ERROR"
    }
  },
  "aggs": {
    "services": {
      "terms": {
        "field": "service.keyword",
        "size": 10
      }
    }
  }
}

// Find slow requests (> 1 second)
{
  "query": {
    "range": {
      "duration_ms": {
        "gte": 1000
      }
    }
  },
  "sort": [
    {
      "duration_ms": {
        "order": "desc"
      }
    }
  ]
}
```

### 3. Distributed Tracing

**Track requests across microservices**

```python
# opentelemetry_tracing.py
from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor, ConsoleSpanExporter
from opentelemetry.sdk.resources import Resource
from opentelemetry.semconv.resource import ResourceAttributes
import time
import random

# Setup tracing
resource = Resource(attributes={
    ResourceAttributes.SERVICE_NAME: "my-service",
    ResourceAttributes.SERVICE_VERSION: "1.0.0",
    ResourceAttributes.DEPLOYMENT_ENVIRONMENT: "production"
})

provider = TracerProvider(resource=resource)
processor = BatchSpanProcessor(ConsoleSpanExporter())
provider.add_span_processor(processor)
trace.set_tracer_provider(provider)

tracer = trace.get_tracer(__name__)

class DistributedService:
    @tracer.start_as_current_span("process_order")
    def process_order(self, order_id: str, user_id: str):
        """Process order with distributed tracing"""
        span = trace.get_current_span()
        
        # Add attributes to span
        span.set_attribute("order.id", order_id)
        span.set_attribute("user.id", user_id)
        span.set_attribute("order.total", 99.99)
        
        try:
            # Call sub-services
            self.validate_inventory(order_id)
            self.process_payment(order_id, user_id)
            self.create_shipment(order_id)
            
            span.set_attribute("order.status", "success")
            return True
            
        except Exception as e:
            span.set_status(trace.Status(trace.StatusCode.ERROR, str(e)))
            span.record_exception(e)
            raise
    
    @tracer.start_as_current_span("validate_inventory")
    def validate_inventory(self, order_id: str):
        """Validate inventory availability"""
        span = trace.get_current_span()
        span.set_attribute("inventory.check", "passed")
        
        # Simulate database query
        with tracer.start_as_current_span("database.query") as db_span:
            db_span.set_attribute("db.system", "postgresql")
            db_span.set_attribute("db.statement", "SELECT * FROM inventory WHERE order_id = $1")
            time.sleep(random.uniform(0.01, 0.05))
    
    @tracer.start_as_current_span("process_payment")
    def process_payment(self, order_id: str, user_id: str):
        """Process payment"""
        span = trace.get_current_span()
        
        # Simulate external API call
        with tracer.start_as_current_span("payment_gateway.charge") as api_span:
            api_span.set_attribute("http.method", "POST")
            api_span.set_attribute("http.url", "https://api.stripe.com/v1/charges")
            api_span.set_attribute("http.status_code", 200)
            time.sleep(random.uniform(0.1, 0.3))
            
        span.set_attribute("payment.status", "success")
        span.set_attribute("payment.transaction_id", "tx_123456")
    
    @tracer.start_as_current_span("create_shipment")
    def create_shipment(self, order_id: str):
        """Create shipment"""
        span = trace.get_current_span()
        span.set_attribute("shipment.carrier", "UPS")
        span.set_attribute("shipment.tracking_number", "1Z999AA10123456784")
        time.sleep(random.uniform(0.02, 0.08))

# Usage
service = DistributedService()
service.process_order(order_id="ORD-12345", user_id="USR-67890")
```

## Observability Platforms

### Datadog Implementation

```python
# datadog_monitoring.py
from datadog import initialize, api
from datadog import statsd
import time

# Initialize Datadog
options = {
    'api_key': 'your_api_key',
    'app_key': 'your_app_key'
}
initialize(**options)

class DatadogMonitoring:
    def __init__(self, service_name: str):
        self.service_name = service_name
        self.tags = [f'service:{service_name}']
    
    def track_request(self, endpoint: str, method: str, duration_ms: float, status: int):
        """Track HTTP request metrics"""
        tags = self.tags + [
            f'endpoint:{endpoint}',
            f'method:{method}',
            f'status:{status}'
        ]
        
        # Increment request counter
        statsd.increment('http.requests', tags=tags)
        
        # Record duration
        statsd.histogram('http.request.duration', duration_ms, tags=tags)
        
        # Track error rate
        if status >= 500:
            statsd.increment('http.errors', tags=tags)
    
    def track_database_query(self, query_type: str, duration_ms: float):
        """Track database query metrics"""
        tags = self.tags + [f'query_type:{query_type}']
        
        statsd.histogram('database.query.duration', duration_ms, tags=tags)
        statsd.increment('database.queries', tags=tags)
    
    def set_gauge(self, metric: str, value: float, tags: list = None):
        """Set a gauge metric"""
        all_tags = self.tags + (tags or [])
        statsd.gauge(metric, value, tags=all_tags)
    
    def create_event(self, title: str, text: str, alert_type: str = 'info'):
        """Create a Datadog event"""
        api.Event.create(
            title=title,
            text=text,
            tags=self.tags,
            alert_type=alert_type  # 'error', 'warning', 'info', 'success'
        )

# Usage
monitor = DatadogMonitoring('my-api')

# Track a request
start = time.time()
# ... process request ...
duration_ms = (time.time() - start) * 1000
monitor.track_request('/api/users', 'GET', duration_ms, 200)

# Track database query
start = time.time()
# ... execute query ...
query_duration = (time.time() - start) * 1000
monitor.track_database_query('SELECT', query_duration)

# Set custom gauge
monitor.set_gauge('cache.hit_rate', 0.85, tags=['cache:redis'])

# Create deployment event
monitor.create_event(
    title='Deployment Complete',
    text='Version 1.2.3 deployed successfully',
    alert_type='success'
)
```

### Grafana Dashboard as Code

```json
{
  "dashboard": {
    "title": "Application Metrics",
    "tags": ["application", "monitoring"],
    "timezone": "browser",
    "panels": [
      {
        "id": 1,
        "title": "Request Rate",
        "type": "graph",
        "targets": [
          {
            "expr": "sum(rate(http_requests_total[5m])) by (status)",
            "legendFormat": "{{status}}",
            "refId": "A"
          }
        ],
        "gridPos": {
          "h": 8,
          "w": 12,
          "x": 0,
          "y": 0
        }
      },
      {
        "id": 2,
        "title": "Error Rate",
        "type": "graph",
        "targets": [
          {
            "expr": "sum(rate(http_requests_total{status=~\"5..\"}[5m])) / sum(rate(http_requests_total[5m])) * 100",
            "legendFormat": "Error %",
            "refId": "A"
          }
        ],
        "gridPos": {
          "h": 8,
          "w": 12,
          "x": 12,
          "y": 0
        },
        "alert": {
          "conditions": [
            {
              "evaluator": {
                "params": [5],
                "type": "gt"
              },
              "operator": {
                "type": "and"
              },
              "query": {
                "params": ["A", "5m", "now"]
              },
              "reducer": {
                "params": [],
                "type": "avg"
              },
              "type": "query"
            }
          ],
          "executionErrorState": "alerting",
          "frequency": "60s",
          "handler": 1,
          "name": "High Error Rate",
          "noDataState": "no_data",
          "notifications": []
        }
      },
      {
        "id": 3,
        "title": "P95 Latency",
        "type": "graph",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, sum by (endpoint, le) (rate(http_request_duration_seconds_bucket[5m])))",
            "legendFormat": "{{endpoint}}",
            "refId": "A"
          }
        ],
        "gridPos": {
          "h": 8,
          "w": 24,
          "x": 0,
          "y": 8
        }
      }
    ],
    "refresh": "10s",
    "schemaVersion": 27,
    "version": 0
  }
}
```

## Alerting

### Alert Rules

```yaml
# prometheus-alerts.yaml
groups:
  - name: application_alerts
    interval: 30s
    rules:
      # High error rate
      - alert: HighErrorRate
        expr: |
          sum(rate(http_requests_total{status=~"5.."}[5m])) by (service)
          / sum(rate(http_requests_total[5m])) by (service) > 0.05
        for: 5m
        labels:
          severity: critical
          team: backend
        annotations:
          summary: "High error rate on {{ $labels.service }}"
          description: "Error rate is {{ $value | humanizePercentage }} on {{ $labels.service }}"
      
      # High latency
      - alert: HighLatency
        expr: |
          histogram_quantile(0.95,
            sum by (service, le) (rate(http_request_duration_seconds_bucket[5m]))
          ) > 1
        for: 10m
        labels:
          severity: warning
          team: backend
        annotations:
          summary: "High latency on {{ $labels.service }}"
          description: "P95 latency is {{ $value }}s on {{ $labels.service }}"
      
      # Service down
      - alert: ServiceDown
        expr: up{job="my-service"} == 0
        for: 1m
        labels:
          severity: critical
          team: sre
        annotations:
          summary: "Service {{ $labels.instance }} is down"
          description: "{{ $labels.instance }} has been down for more than 1 minute"
      
      # High memory usage
      - alert: HighMemoryUsage
        expr: |
          (node_memory_MemTotal_bytes - node_memory_MemAvailable_bytes)
          / node_memory_MemTotal_bytes > 0.9
        for: 5m
        labels:
          severity: warning
          team: platform
        annotations:
          summary: "High memory usage on {{ $labels.instance }}"
          description: "Memory usage is {{ $value | humanizePercentage }}"
      
      # Disk space low
      - alert: DiskSpaceLow
        expr: |
          (node_filesystem_avail_bytes{mountpoint="/"}
          / node_filesystem_size_bytes{mountpoint="/"}) < 0.1
        for: 5m
        labels:
          severity: warning
          team: platform
        annotations:
          summary: "Low disk space on {{ $labels.instance }}"
          description: "Only {{ $value | humanizePercentage }} disk space remaining"
```

### Alert Manager Configuration

```yaml
# alertmanager.yaml
global:
  resolve_timeout: 5m
  slack_api_url: 'https://hooks.slack.com/services/YOUR/WEBHOOK/URL'

route:
  receiver: 'default'
  group_by: ['alertname', 'cluster', 'service']
  group_wait: 10s
  group_interval: 10s
  repeat_interval: 12h
  
  routes:
    # Critical alerts to PagerDuty
    - match:
        severity: critical
      receiver: pagerduty
      continue: true
    
    # Backend team alerts
    - match:
        team: backend
      receiver: backend-team
    
    # Platform team alerts
    - match:
        team: platform
      receiver: platform-team

receivers:
  - name: 'default'
    slack_configs:
      - channel: '#alerts'
        title: 'Alert: {{ .GroupLabels.alertname }}'
        text: '{{ range .Alerts }}{{ .Annotations.description }}{{ end }}'
  
  - name: 'pagerduty'
    pagerduty_configs:
      - service_key: 'YOUR_PAGERDUTY_KEY'
        description: '{{ .GroupLabels.alertname }}'
  
  - name: 'backend-team'
    slack_configs:
      - channel: '#backend-alerts'
        title: '{{ .GroupLabels.alertname }}'
        text: '{{ range .Alerts }}{{ .Annotations.summary }}{{ end }}'
  
  - name: 'platform-team'
    slack_configs:
      - channel: '#platform-alerts'
        title: '{{ .GroupLabels.alertname }}'
        text: '{{ range .Alerts }}{{ .Annotations.summary }}{{ end }}'

inhibit_rules:
  # Inhibit warning if critical is firing
  - source_match:
      severity: 'critical'
    target_match:
      severity: 'warning'
    equal: ['alertname', 'cluster', 'service']
```

## Key Takeaways

1. **Three pillars**: Metrics, logs, and traces provide complete observability
2. **Structured logging** enables better searchability and analysis
3. **Distributed tracing** tracks requests across microservices
4. **Alerting** should be actionable and routed appropriately
5. **Dashboards** visualize system health and performance

## Next Steps

- Explore chaos engineering
- Learn about FinOps and cost optimization
- Study incident management best practices
