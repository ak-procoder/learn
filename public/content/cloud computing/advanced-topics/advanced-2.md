---
id: advanced-2  
title: AWS Lambda - Deep Dive
type: text
---

## AWS Lambda Overview

**Launched**: 2014

**Definition**: Event-driven, serverless compute service

**Execution Model**: Run code in response to events without provisioning servers

## How Lambda Works

### Function Anatomy

**Handler**: Entry point for execution

**Example (Node.js)**:
```javascript
exports.handler = async (event, context) => {
    // Your code here
    const response = {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda!'),
    };
    return response;
};
```

**Example (Python)**:
```python
def lambda_handler(event, context):
    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda!')
    }
```

### Event Sources

**AWS Services**:
- API Gateway (HTTP requests)
- S3 (object uploads)
- DynamoDB Streams
- SNS/SQS
- EventBridge
- CloudWatch Events

**Direct Invocation**:
- AWS SDK
- AWS CLI
- Other AWS services

### Execution Environment

**Cold Start**:
- Initialize execution environment
- Download code
- Start runtime
- Run initialization code
- Can take 100ms-several seconds

**Warm Start**:
- Reuse existing environment
- Much faster (ms)
- Environment reused for ~15 minutes

**Optimizations**:
- Keep functions warm (scheduled pings)
- Minimize dependencies
- Use Lambda SnapStart (Java)
- Provisioned Concurrency

## Lambda Configuration

### Runtime Support

**Supported Languages**:
- Node.js
- Python
- Java
- .NET (C#/PowerShell)
- Go
- Ruby
- Custom runtimes (via Lambda Layers)

### Resources

**Memory**: 128 MB to 10,240 MB (10 GB)
- CPU scales with memory
- More memory = more CPU

**Timeout**: Max 15 minutes

**Storage**: 512 MB to 10 GB ephemeral (/tmp)

**Concurrency**: 1000 concurrent executions (default, can increase)

### Environment Variables

```javascript
const dbHost = process.env.DB_HOST;
const apiKey = process.env.API_KEY;
```

**Use for**:
- Configuration
- Secrets (with KMS encryption)
- Feature flags

### Triggers and Destinations

**Triggers**: What invokes your function

**Destinations**: Where to send results
- On success: Another Lambda, SNS, SQS, EventBridge
- On failure: DLQ, error handling

## Lambda Pricing

**Charges**:

**Requests**: $0.20 per 1M requests

**Duration**: Based on GB-seconds
- Memory allocated × execution time
- $0.0000166667 per GB-second

**Example**:
- 1M executions
- 512 MB memory
- 1 second each
- Cost: ~$13/month

**Free Tier**:
- 1M free requests per month
- 400,000 GB-seconds compute time

## Best Practices

### Code Optimization

**Minimize Package Size**:
- Smaller packages = faster cold starts
- Use Lambda Layers for dependencies
- Tree-shake dependencies

**Reuse Resources**:
```javascript
// Initialize outside handler (reused)
const dbConnection = createConnection();

exports.handler = async (event) => {
    // Use connection
    const result = await dbConnection.query(...);
    return result;
};
```

**Async Where Possible**:
- Non-blocking I/O
- Parallel operations
- Better performance

### Security

**Least Privilege IAM**:
- Minimum necessary permissions
- Function-specific roles

**Environment Variables Encryption**:
- Use KMS for secrets
- Or use AWS Secrets Manager

**VPC Configuration**:
- Access private resources
- Note: Cold start impact

### Monitoring

**CloudWatch Logs**:
- Automatic logging
- stdout/stderr captured

**CloudWatch Metrics**:
- Invocations
- Duration
- Errors
- Throttles
- Concurrent executions

**X-Ray Tracing**:
- Distributed tracing
- Performance analysis
- Bottleneck identification

### Error Handling

**Retry Behavior**:
- Synchronous: Client retries
- Asynchronous: Lambda retries twice
- Stream-based: Retry until success or data expires

**Dead Letter Queues**:
- SQS or SNS
- Failed event storage
- Manual processing

## Advanced Features

### Lambda Layers
- Share code across functions
- Manage dependencies centrally
- Up to 5 layers per function
- Max 250 MB total

### Provisioned Concurrency
- Pre-initialized environments
- Eliminate cold starts
- Additional cost
- Critical for latency-sensitive apps

### Lambda@Edge
- Run at CloudFront edge locations
- Low latency globally
- Customize CDN behavior

### Container Images
- Package as container (up to 10 GB)
- Use familiar tools
- More flexibility

## Common Patterns

### API Backend
```
API Gateway → Lambda → DynamoDB
```

### File Processing
```
S3 Upload → Lambda → Process → Store
```

### Stream Processing
```
Kinesis → Lambda → Transform → S3/DB
```

### Scheduled Tasks
```
EventBridge Rule → Lambda → Execute Task
```

## Limitations

- 15 minute max execution
- 10 GB max memory
- 250 MB deployment package (direct)
- 10 GB container image
- 6 MB synchronous payload
- 256 KB asynchronous payload
- /tmp storage only persistent within invocation
