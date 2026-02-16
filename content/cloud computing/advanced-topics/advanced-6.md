---
id: advanced-6
title: Serverless Best Practices and Patterns
type: text
---

# Serverless Best Practices and Patterns

## Overview

Serverless architectures require different approaches to design, development, and operations compared to traditional applications. This lesson explores proven patterns and best practices for building production-ready serverless applications.

## Core Design Patterns

### 1. Function Composition Patterns

**Chain Pattern**
```javascript
// AWS Lambda - Sequential processing
exports.handler = async (event) => {
  const step1Result = await processStep1(event);
  const step2Result = await processStep2(step1Result);
  const step3Result = await processStep3(step2Result);
  return step3Result;
};
```

**Fan-out/Fan-in Pattern**
```python
# AWS Lambda with SNS/SQS
import boto3
import json

sns = boto3.client('sns')
sqs = boto3.client('sqs')

def fan_out_handler(event, context):
    """Distribute work to multiple functions"""
    tasks = event['tasks']
    for task in tasks:
        sns.publish(
            TopicArn='arn:aws:sns:region:account:task-topic',
            Message=json.dumps(task)
        )
    return {'taskCount': len(tasks)}

def fan_in_handler(event, context):
    """Aggregate results from multiple workers"""
    results = []
    for record in event['Records']:
        result = json.loads(record['body'])
        results.append(result)
    
    # Aggregate logic
    final_result = aggregate_results(results)
    return final_result
```

### 2. Event-Driven Patterns

**Event Sourcing**
```typescript
// Store events instead of current state
interface Event {
  eventId: string;
  eventType: string;
  timestamp: number;
  data: any;
}

export const handler = async (event: any) => {
  const domainEvent: Event = {
    eventId: generateId(),
    eventType: 'OrderPlaced',
    timestamp: Date.now(),
    data: event.orderData
  };
  
  // Store event
  await dynamoDB.putItem({
    TableName: 'EventStore',
    Item: domainEvent
  });
  
  // Publish for downstream processing
  await eventBridge.putEvents({
    Entries: [{
      Source: 'order.service',
      DetailType: domainEvent.eventType,
      Detail: JSON.stringify(domainEvent)
    }]
  });
};
```

**CQRS (Command Query Responsibility Segregation)**
```python
# Separate read and write models
def command_handler(event, context):
    """Handle write operations"""
    command = event['command']
    
    if command['type'] == 'CreateOrder':
        # Validate and process command
        order = create_order(command['data'])
        
        # Emit event
        emit_event('OrderCreated', order)
        
        return {'orderId': order['id']}

def query_handler(event, context):
    """Handle read operations - optimized read model"""
    query = event['query']
    
    # Read from optimized view
    result = dynamodb.query(
        TableName='OrderReadModel',
        KeyConditionExpression='customerId = :id',
        ExpressionAttributeValues={':id': query['customerId']}
    )
    
    return result['Items']
```

## Cold Start Optimization

### 1. Minimize Package Size

**Python Example**
```python
# requirements.txt - Only include necessary dependencies
boto3  # Usually pre-installed in Lambda
requests==2.28.0

# Use Lambda Layers for common dependencies
# Layer 1: boto3, requests
# Layer 2: Custom utilities
# Function code: Business logic only
```

**Node.js Example**
```json
{
  "dependencies": {
    "aws-sdk": "^2.1234.0",
    "lodash.get": "^4.4.2"
  },
  "devDependencies": {
    "webpack": "^5.0.0",
    "webpack-cli": "^4.0.0"
  }
}
```

```javascript
// webpack.config.js - Bundle and minify
module.exports = {
  entry: './src/index.js',
  target: 'node',
  mode: 'production',
  optimization: {
    minimize: true
  },
  externals: {
    'aws-sdk': 'aws-sdk'  // Don't bundle AWS SDK
  }
};
```

### 2. Keep Functions Warm

**Scheduled Warming**
```yaml
# serverless.yml
functions:
  api:
    handler: handler.main
    events:
      - http: GET /api
      - schedule:
          rate: rate(5 minutes)
          enabled: true
          input:
            warmup: true
```

**Provisioned Concurrency**
```terraform
resource "aws_lambda_function" "api" {
  function_name = "api-function"
  handler       = "index.handler"
  runtime       = "nodejs18.x"
}

resource "aws_lambda_provisioned_concurrency_config" "api" {
  function_name                     = aws_lambda_function.api.function_name
  provisioned_concurrent_executions = 5
  qualifier                         = aws_lambda_function.api.version
}
```

### 3. Lazy Loading

```python
# Load heavy dependencies lazily
import json

# Global scope - loaded once per container
dynamodb = None

def get_dynamodb():
    global dynamodb
    if dynamodb is None:
        import boto3
        dynamodb = boto3.resource('dynamodb')
    return dynamodb

def handler(event, context):
    # Only load DynamoDB if needed
    if event.get('skipDatabase'):
        return {'message': 'Skipped'}
    
    db = get_dynamodb()
    table = db.Table('MyTable')
    # Use table...
```

## Error Handling and Resilience

### 1. Retry Logic

```javascript
// Exponential backoff with jitter
async function retryWithBackoff(fn, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      
      // Exponential backoff with jitter
      const delay = Math.min(1000 * Math.pow(2, i), 10000);
      const jitter = Math.random() * 1000;
      
      await new Promise(resolve => setTimeout(resolve, delay + jitter));
    }
  }
}

exports.handler = async (event) => {
  return await retryWithBackoff(async () => {
    return await externalAPI.call(event.data);
  });
};
```

### 2. Dead Letter Queues (DLQ)

```python
import boto3
import json

sqs = boto3.client('sqs')

def handler(event, context):
    try:
        # Process message
        result = process_message(event)
        return result
    except ValidationError as e:
        # Permanent error - send to DLQ with metadata
        send_to_dlq(event, str(e), 'validation_error')
        return {'status': 'failed', 'reason': 'validation'}
    except Exception as e:
        # Transient error - let Lambda retry
        raise e

def send_to_dlq(original_event, error_message, error_type):
    dlq_message = {
        'originalEvent': original_event,
        'error': error_message,
        'errorType': error_type,
        'timestamp': int(time.time()),
        'functionName': context.function_name
    }
    
    sqs.send_message(
        QueueUrl=os.environ['DLQ_URL'],
        MessageBody=json.dumps(dlq_message)
    )
```

### 3. Circuit Breaker Pattern

```typescript
class CircuitBreaker {
  private failures = 0;
  private lastFailureTime = 0;
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';
  
  constructor(
    private threshold = 5,
    private timeout = 60000,
    private halfOpenTimeout = 30000
  ) {}
  
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime > this.timeout) {
        this.state = 'HALF_OPEN';
      } else {
        throw new Error('Circuit breaker is OPEN');
      }
    }
    
    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }
  
  private onSuccess() {
    this.failures = 0;
    this.state = 'CLOSED';
  }
  
  private onFailure() {
    this.failures++;
    this.lastFailureTime = Date.now();
    
    if (this.failures >= this.threshold) {
      this.state = 'OPEN';
    }
  }
}

// Usage
const breaker = new CircuitBreaker();

export const handler = async (event: any) => {
  return await breaker.execute(async () => {
    return await callExternalService(event);
  });
};
```

## Security Best Practices

### 1. Least Privilege IAM

```yaml
# serverless.yml
provider:
  name: aws
  runtime: nodejs18.x
  iam:
    role:
      statements:
        - Effect: Allow
          Action:
            - dynamodb:GetItem
            - dynamodb:PutItem
          Resource: 
            - arn:aws:dynamodb:${aws:region}:${aws:accountId}:table/Orders
        - Effect: Allow
          Action:
            - s3:GetObject
          Resource:
            - arn:aws:s3:::my-bucket/*
```

### 2. Secrets Management

```python
import boto3
import json
from functools import lru_cache

secrets_client = boto3.client('secretsmanager')

@lru_cache(maxsize=1)
def get_secret(secret_name):
    """Cache secret to avoid repeated API calls"""
    response = secrets_client.get_secret_value(SecretId=secret_name)
    return json.loads(response['SecretString'])

def handler(event, context):
    # Get cached secret
    db_credentials = get_secret('prod/database/credentials')
    
    # Use credentials
    connection = create_connection(
        host=db_credentials['host'],
        user=db_credentials['username'],
        password=db_credentials['password']
    )
```

### 3. Input Validation

```javascript
const Joi = require('joi');

const schema = Joi.object({
  email: Joi.string().email().required(),
  age: Joi.number().integer().min(0).max(150),
  name: Joi.string().min(1).max(100).required()
});

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    
    // Validate input
    const { error, value } = schema.validate(body);
    
    if (error) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: 'Invalid input',
          details: error.details
        })
      };
    }
    
    // Process validated data
    const result = await processUser(value);
    
    return {
      statusCode: 200,
      body: JSON.stringify(result)
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' })
    };
  }
};
```

## Performance Optimization

### 1. Connection Reuse

```python
import psycopg2
import os

# Initialize connection at module level (outside handler)
conn = None

def get_connection():
    global conn
    if conn is None or conn.closed:
        conn = psycopg2.connect(
            host=os.environ['DB_HOST'],
            database=os.environ['DB_NAME'],
            user=os.environ['DB_USER'],
            password=os.environ['DB_PASSWORD']
        )
    return conn

def handler(event, context):
    # Reuse connection across invocations
    connection = get_connection()
    cursor = connection.cursor()
    
    cursor.execute("SELECT * FROM users WHERE id = %s", (event['userId'],))
    result = cursor.fetchone()
    
    return {'user': result}
```

### 2. Async Processing

```javascript
// Process items in parallel
exports.handler = async (event) => {
  const items = event.items;
  
  // Process all items concurrently
  const results = await Promise.all(
    items.map(item => processItem(item))
  );
  
  return {
    processedCount: results.length,
    results
  };
};

async function processItem(item) {
  // Async processing logic
  const [data1, data2] = await Promise.all([
    fetchFromAPI(item.id),
    fetchFromDatabase(item.id)
  ]);
  
  return combineData(data1, data2);
}
```

## Monitoring and Observability

### 1. Structured Logging

```python
import json
import logging
from datetime import datetime

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def log_event(level, message, **kwargs):
    log_entry = {
        'timestamp': datetime.utcnow().isoformat(),
        'level': level,
        'message': message,
        **kwargs
    }
    logger.info(json.dumps(log_entry))

def handler(event, context):
    log_event('INFO', 'Function invoked', 
              requestId=context.request_id,
              eventType=event.get('eventType'))
    
    try:
        result = process_event(event)
        
        log_event('INFO', 'Processing successful',
                  requestId=context.request_id,
                  duration=context.get_remaining_time_in_millis())
        
        return result
    except Exception as e:
        log_event('ERROR', 'Processing failed',
                  requestId=context.request_id,
                  error=str(e),
                  errorType=type(e).__name__)
        raise
```

### 2. Custom Metrics

```typescript
import { CloudWatch } from 'aws-sdk';

const cloudwatch = new CloudWatch();

async function publishMetric(name: string, value: number, unit: string) {
  await cloudwatch.putMetricData({
    Namespace: 'MyApp/Functions',
    MetricData: [{
      MetricName: name,
      Value: value,
      Unit: unit,
      Timestamp: new Date(),
      Dimensions: [{
        Name: 'Environment',
        Value: process.env.ENVIRONMENT || 'dev'
      }]
    }]
  }).promise();
}

export const handler = async (event: any) => {
  const startTime = Date.now();
  
  try {
    const result = await processEvent(event);
    
    // Publish success metric
    await publishMetric('ProcessingSuccess', 1, 'Count');
    await publishMetric('ProcessingDuration', Date.now() - startTime, 'Milliseconds');
    
    return result;
  } catch (error) {
    await publishMetric('ProcessingErrors', 1, 'Count');
    throw error;
  }
};
```

## Cost Optimization

### 1. Right-Sizing Memory

```python
# Test different memory configurations
# More memory = more CPU = potentially faster execution

# 128 MB: $0.0000002083 per 100ms
# Duration: 500ms, Cost: $0.0010415

# 512 MB: $0.0000008333 per 100ms  
# Duration: 200ms, Cost: $0.0016666

# 1024 MB: $0.0000016667 per 100ms
# Duration: 150ms, Cost: $0.0025000

# Choose 512 MB for best price/performance
```

### 2. Batch Processing

```javascript
// Process records in batches to reduce invocations
exports.handler = async (event) => {
  const records = event.Records;
  const BATCH_SIZE = 25;
  
  for (let i = 0; i < records.length; i += BATCH_SIZE) {
    const batch = records.slice(i, i + BATCH_SIZE);
    await processBatch(batch);
  }
};

async function processBatch(records) {
  // Process multiple records in single DB call
  const items = records.map(r => transformRecord(r));
  
  await dynamoDB.batchWriteItem({
    RequestItems: {
      'MyTable': items.map(item => ({
        PutRequest: { Item: item }
      }))
    }
  }).promise();
}
```

## Key Takeaways

1. **Design Patterns**: Use appropriate patterns (fan-out, event sourcing, CQRS) for your use case
2. **Cold Starts**: Minimize package size, use provisioned concurrency, lazy load dependencies
3. **Error Handling**: Implement retries, DLQs, and circuit breakers
4. **Security**: Apply least privilege, manage secrets properly, validate all inputs
5. **Performance**: Reuse connections, process asynchronously, optimize memory allocation
6. **Observability**: Use structured logging and custom metrics
7. **Cost**: Right-size functions, batch operations, clean up unused resources

## Next Steps

- Explore edge computing and CDN integration
- Learn about serverless frameworks (Serverless Framework, SAM, Terraform)
- Study event-driven architectures in depth
