---
id: provider-7
title: AWS Serverless - Lambda and API Gateway
type: text
---

# AWS Serverless - Lambda and API Gateway

AWS serverless services enable you to build and run applications without managing servers. The core serverless compute service is AWS Lambda, often combined with API Gateway to create complete serverless applications.

## AWS Lambda

Lambda is a serverless compute service that runs code in response to events and automatically manages the underlying compute resources.

### Core Concepts

**Function**
- Code package with configuration
- Runtime environment (Python, Node.js, Java, Go, .NET, Ruby, custom)
- Up to 10 GB memory allocation
- Maximum execution duration: 15 minutes
- Ephemeral storage: 512 MB to 10 GB (/tmp)

**Event Sources**
- API Gateway
- S3 events
- DynamoDB Streams
- SQS/SNS messages
- CloudWatch Events/EventBridge
- Direct invocation via SDK

### Lambda Function Structure

```python
import json

def lambda_handler(event, context):
    """
    event: Contains data about the triggering event
    context: Contains runtime information
    """
    
    # Process the event
    name = event.get('name', 'World')
    
    # Return response
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json'
        },
        'body': json.dumps({
            'message': f'Hello, {name}!'
        })
    }
```

### Invocation Types

**Synchronous Invocation**
- Wait for function to complete
- Return result directly
- Used by: API Gateway, SDK invoke
- Errors returned to caller

**Asynchronous Invocation**
- Don't wait for completion
- Event queued for processing
- Used by: S3, SNS, CloudWatch Events
- Automatic retries (2 retries with exponential backoff)

**Event Source Mapping (Polling)**
- Lambda polls event source
- Used by: SQS, DynamoDB Streams, Kinesis
- Batch processing of records

### Lambda Features

**Versions and Aliases**
```plaintext
Function: myFunction
├── $LATEST (mutable)
├── Version 1 (immutable)
├── Version 2 (immutable)
└── Version 3 (immutable)

Aliases:
├── PROD → Version 3
├── STAGING → Version 2
└── DEV → $LATEST
```

**Environment Variables**
- Configure function behavior
- Stored encrypted with AWS KMS
- Access secrets securely

**Layers**
- Package libraries and dependencies
- Share code across functions
- Up to 5 layers per function
- Max unzipped size: 250 MB

**Concurrency**
- **Reserved Concurrency**: Guarantee capacity, set maximum
- **Provisioned Concurrency**: Pre-warmed instances for low latency
- Account limit: 1,000 concurrent executions (default, can increase)

**VPC Integration**
- Access private resources (RDS, ElastiCache)
- ENI (Elastic Network Interface) in VPC subnets
- Hyperplane ENIs for improved performance

**Destinations**
- Route execution results
- On success or failure
- Targets: SQS, SNS, Lambda, EventBridge

### Cold Starts vs Warm Starts

```plaintext
Cold Start (First invocation):
Download Code → Start Runtime → Run Init Code → Run Handler
(~100ms - several seconds)

Warm Start (Subsequent invocations):
Run Handler
(~1-10ms)
```

**Minimize Cold Starts:**
- Use provisioned concurrency
- Keep functions small
- Minimize initialization code
- Use compiled languages (Go, Java with GraalVM)

## Amazon API Gateway

API Gateway is a fully managed service for creating, publishing, maintaining, monitoring, and securing APIs at any scale.

### API Types

**REST APIs**
- RESTful API development
- Resource-based model
- Support for request/response transformation
- API keys, usage plans, throttling

**HTTP APIs**
- Lower cost (70% cheaper than REST APIs)
- Lower latency
- Simpler feature set
- JWT authorizers, CORS support
- Best for simple proxy to Lambda or HTTP backends

**WebSocket APIs**
- Two-way communication
- Real-time applications
- Persistent connections
- Chat apps, live dashboards, gaming

### REST API Components

**Resources and Methods**
```plaintext
/users
  ├── GET (list users)
  ├── POST (create user)
  └── /{id}
      ├── GET (get user)
      ├── PUT (update user)
      └── DELETE (delete user)
```

**Integration Types**
- **Lambda Function**: Invoke Lambda
- **HTTP**: Proxy to HTTP endpoint
- **AWS Service**: Integrate with AWS services (S3, DynamoDB)
- **Mock**: Return response without backend
- **VPC Link**: Access private resources

**Stages**
- Named references to deployment
- Example: dev, staging, prod
- Each stage has unique URL
- Stage variables for environment-specific configuration

**Request/Response Transformation**
```plaintext
Client Request
    ↓
Method Request (validation)
    ↓
Integration Request (transform)
    ↓
Backend
    ↓
Integration Response (transform)
    ↓
Method Response (validation)
    ↓
Client Response
```

### Authorization and Security

**IAM Authentication**
- AWS Signature Version 4
- For AWS service-to-service calls
- Use credentials for access

**Amazon Cognito**
- User pools for authentication
- Identity pools for authorization
- OAuth 2.0 and SAML support

**Lambda Authorizers**
- Custom authorization logic
- Token-based or request-based
- Cache authorization decisions

**API Keys**
- Simple usage tracking
- Usage plans and throttling
- Not recommended for authentication alone

### API Gateway Features

**Caching**
- Cache endpoint responses
- 0.5 GB to 237 GB cache size
- TTL: 0 to 3600 seconds
- Reduce backend load
- Improve latency

**Throttling**
- **Account-level**: 10,000 RPS soft limit
- **Method-level**: Custom limits per method
- **Usage Plans**: Throttle by API key
- Token bucket algorithm

**CORS (Cross-Origin Resource Sharing)**
- Enable browser-based applications
- Configure allowed origins, methods, headers
- Preflight OPTIONS requests

**Request Validation**
- Validate request parameters
- Validate request body against JSON schema
- Return 400 error for invalid requests
- Reduce backend load

### Monitoring and Logging

**CloudWatch Metrics**
- API calls count
- Latency
- Error rates (4XX, 5XX)
- Cache hit/miss

**CloudWatch Logs**
- Execution logs
- Access logs (who, when, what)
- Debug API execution

**AWS X-Ray**
- Trace requests through system
- Identify performance bottlenecks
- Visualize service map

## Serverless Application Architecture

```plaintext
Client (Web/Mobile)
        ↓
    CloudFront
        ↓
    API Gateway
        ↓
   AWS Lambda ←→ DynamoDB
        ↓
       S3 / SQS / SNS
```

### Example: Serverless REST API

```python
# Lambda function for user management
import json
import boto3

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('Users')

def lambda_handler(event, context):
    http_method = event['httpMethod']
    path = event['path']
    
    if http_method == 'GET' and path == '/users':
        # List users
        response = table.scan()
        return {
            'statusCode': 200,
            'body': json.dumps(response['Items'])
        }
    
    elif http_method == 'POST' and path == '/users':
        # Create user
        body = json.loads(event['body'])
        table.put_item(Item=body)
        return {
            'statusCode': 201,
            'body': json.dumps({'message': 'User created'})
        }
    
    return {
        'statusCode': 404,
        'body': json.dumps({'error': 'Not found'})
    }
```

## Best Practices

### Lambda
1. **Separate handler from logic**: Easier to test
2. **Minimize package size**: Faster cold starts
3. **Reuse connections**: Database, HTTP clients
4. **Use environment variables**: Configuration
5. **Set appropriate timeout**: Avoid unnecessary costs
6. **Monitor with CloudWatch**: Track performance and errors
7. **Use layers**: Share code and dependencies
8. **Implement error handling**: Dead letter queues, destinations

### API Gateway
1. **Enable caching**: Reduce latency and costs
2. **Use custom domain names**: Better branding
3. **Implement throttling**: Protect backend
4. **Enable CORS properly**: Secure browser access
5. **Use stages**: Separate environments
6. **Request validation**: Validate before backend
7. **Monitor and log**: Track usage and debug
8. **Use HTTP APIs**: When features suffice (cost savings)

## Use Cases

- **Web APIs**: RESTful microservices
- **Real-time Processing**: File processing, image transformation
- **Data Processing**: ETL jobs, log analysis
- **Chatbots**: Serverless chatbot backends
- **IoT Backends**: Process device data
- **Scheduled Tasks**: Cron jobs in the cloud
- **Event-driven Applications**: Respond to AWS service events

AWS Lambda and API Gateway together form a powerful serverless platform for building scalable, cost-effective applications without managing infrastructure.
