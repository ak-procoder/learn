---
id: advanced-5
title: Serverless Frameworks and Tools
type: text
---

# Serverless Frameworks and Tools

Serverless frameworks simplify deploying and managing serverless applications across cloud providers. This guide covers the most popular frameworks and tools for serverless development.

## The Serverless Framework

Cross-cloud serverless application framework.

### Installation and Setup

```bash
# Install Serverless Framework
npm install -g serverless

# Create new project
serverless create --template aws-nodejs --path my-service
cd my-service

# Or for other templates
serverless create --template aws-python3
serverless create --template azure-nodejs
serverless create --template google-nodejs
```

### serverless.yml Configuration

```yaml
service: my-api

provider:
  name: aws
  runtime: nodejs18.x
  stage: ${opt:stage, 'dev'}
  region: us-east-1
  memorySize: 256
  timeout: 30
  
  environment:
    STAGE: ${self:provider.stage}
    DB_TABLE: ${self:custom.tableName}
  
  iam:
    role:
      statements:
        - Effect: Allow
          Action:
            - dynamodb:PutItem
            - dynamodb:GetItem
            - dynamodb:Query
          Resource: !GetAtt UsersTable.Arn

functions:
  createUser:
    handler: handlers/users.create
    events:
      - http:
          path: users
          method: post
          cors: true
          authorizer:
            name: authorizerFunc
            resultTtlInSeconds: 300
  
  getUser:
    handler: handlers/users.get
    events:
      - http:
          path: users/{id}
          method: get
          cors: true
  
  processQueue:
    handler: handlers/queue.process
    events:
      - sqs:
          arn: !GetAtt ProcessQueue.Arn
          batchSize: 10

  cronJob:
    handler: handlers/cron.run
    events:
      - schedule:
          rate: rate(1 hour)
          enabled: true

resources:
  Resources:
    UsersTable:
      Type: AWS::DynamoDB::Table
      Properties:
        TableName: ${self:custom.tableName}
        BillingMode: PAY_PER_REQUEST
        AttributeDefinitions:
          - AttributeName: userId
            AttributeType: S
        KeySchema:
          - AttributeName: userId
            KeyType: HASH
    
    ProcessQueue:
      Type: AWS::SQS::Queue
      Properties:
        QueueName: ${self:service}-${self:provider.stage}-process-queue

custom:
  tableName: ${self:service}-${self:provider.stage}-users

plugins:
  - serverless-offline
  - serverless-plugin-typescript
  - serverless-domain-manager
```

### Deployment

```bash
# Deploy to dev
serverless deploy

# Deploy to specific stage
serverless deploy --stage production --region eu-west-1

# Deploy single function
serverless deploy function -f createUser

# Remove service
serverless remove
```

### Local Development

```bash
# Install serverless-offline
npm install --save-dev serverless-offline

# Run locally
serverless offline start

# Invoke function locally
serverless invoke local -f createUser -d '{"body":"{\"name\":\"John\"}"}'
```

## AWS SAM (Serverless Application Model)

AWS-specific serverless framework.

### template.yaml

```yaml
AWSTemplateFormatVersion: '2010-09-09'
Transform: AWS::Serverless-2016-10-31

Globals:
  Function:
    Timeout: 30
    Runtime: python3.11
    Environment:
      Variables:
        TABLE_NAME: !Ref UsersTable

Resources:
  ApiFunction:
    Type: AWS::Serverless::Function
    Properties:
      CodeUri: src/
      Handler: app.lambda_handler
      Events:
        GetUsers:
          Type: Api
          Properties:
            Path: /users
            Method: get
        CreateUser:
          Type: Api
          Properties:
            Path: /users
            Method: post
      Policies:
        - DynamoDBCrudPolicy:
            TableName: !Ref UsersTable
  
  ProcessorFunction:
    Type: AWS::Serverless::Function
    Properties:
      CodeUri: src/
      Handler: processor.handler
      Events:
        SQSEvent:
          Type: SQS
          Properties:
            Queue: !GetAtt ProcessQueue.Arn
            BatchSize: 10
  
  UsersTable:
    Type: AWS::DynamoDB::Table
    Properties:
      BillingMode: PAY_PER_REQUEST
      AttributeDefinitions:
        - AttributeName: userId
          AttributeType: S
      KeySchema:
        - AttributeName: userId
          KeyType: HASH
  
  ProcessQueue:
    Type: AWS::SQS::Queue

Outputs:
  ApiUrl:
    Description: "API Gateway endpoint URL"
    Value: !Sub "https://${ServerlessRestApi}.execute-api.${AWS::Region}.amazonaws.com/Prod/"
```

### SAM CLI Commands

```bash
# Initialize new project
sam init --runtime python3.11 --name my-app

# Build application
sam build

# Test locally
sam local start-api
sam local invoke ApiFunction -e events/event.json

# Deploy
sam deploy --guided

# View logs
sam logs -n ApiFunction --tail

# Delete stack
sam delete
```

## Terraform for Serverless

Infrastructure as Code for serverless applications.

### main.tf

```hcl
# AWS Lambda with Terraform

provider "aws" {
  region = "us-east-1"
}

# Archive Python code
data "archive_file" "lambda" {
  type        = "zip"
  source_file = "lambda_function.py"
  output_path = "lambda_function.zip"
}

# Lambda function
resource "aws_lambda_function" "api" {
  filename         = data.archive_file.lambda.output_path
  function_name    = "my-api-function"
  role            = aws_iam_role.lambda.arn
  handler         = "lambda_function.handler"
  source_code_hash = data.archive_file.lambda.output_base64sha256
  runtime         = "python3.11"
  timeout         = 30
  memory_size     = 256
  
  environment {
    variables = {
      TABLE_NAME = aws_dynamodb_table.users.name
    }
  }
}

# IAM role for Lambda
resource "aws_iam_role" "lambda" {
  name = "lambda_execution_role"
  
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "lambda.amazonaws.com"
      }
    }]
  })
}

# Attach policies
resource "aws_iam_role_policy_attachment" "lambda_basic" {
  role       = aws_iam_role.lambda.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

# DynamoDB table
resource "aws_dynamodb_table" "users" {
  name           = "users"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "userId"
  
  attribute {
    name = "userId"
    type = "S"
  }
}

# API Gateway
resource "aws_apigatewayv2_api" "api" {
  name          = "my-api"
  protocol_type = "HTTP"
}

resource "aws_apigatewayv2_integration" "lambda" {
  api_id           = aws_apigatewayv2_api.api.id
  integration_type = "AWS_PROXY"
  integration_uri  = aws_lambda_function.api.invoke_arn
}

resource "aws_apigatewayv2_route" "get_users" {
  api_id    = aws_apigatewayv2_api.api.id
  route_key = "GET /users"
  target    = "integrations/${aws_apigatewayv2_integration.lambda.id}"
}

resource "aws_apigatewayv2_stage" "default" {
  api_id      = aws_apigatewayv2_api.api.id
  name        = "$default"
  auto_deploy = true
}

# Lambda permission for API Gateway
resource "aws_lambda_permission" "api_gw" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.api.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.api.execution_arn}/*/*"
}

output "api_url" {
  value = aws_apigatewayv2_stage.default.invoke_url
}
```

## Pulumi

Modern IaC with programming languages.

### TypeScript Example

```typescript
import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

// Create Lambda function
const lambdaRole = new aws.iam.Role("lambdaRole", {
    assumeRolePolicy: JSON.stringify({
        Version: "2012-10-17",
        Statement: [{
            Action: "sts:AssumeRole",
            Effect: "Allow",
            Principal: {
                Service: "lambda.amazonaws.com",
            },
        }],
    }),
});

new aws.iam.RolePolicyAttachment("lambdaRoleAttach", {
    role: lambdaRole,
    policyArn: aws.iam.ManagedPolicy.AWSLambdaBasicExecutionRole,
});

const lambda = new aws.lambda.Function("myFunction", {
    code: new pulumi.asset.FileArchive("./app"),
    runtime: aws.lambda.Runtime.NodeJS18dX,
    role: lambdaRole.arn,
    handler: "index.handler",
    environment: {
        variables: {
            TABLE_NAME: dynamoTable.name,
        },
    },
});

// DynamoDB table
const dynamoTable = new aws.dynamodb.Table("usersTable", {
    attributes: [{
        name: "userId",
        type: "S",
    }],
    hashKey: "userId",
    billingMode: "PAY_PER_REQUEST",
});

// API Gateway
const api = new aws.apigatewayv2.Api("httpApi", {
    protocolType: "HTTP",
});

const integration = new aws.apigatewayv2.Integration("lambdaIntegration", {
    apiId: api.id,
    integrationType: "AWS_PROXY",
    integrationUri: lambda.arn,
});

const route = new aws.apigatewayv2.Route("getRoute", {
    apiId: api.id,
    routeKey: "GET /users",
    target: pulumi.interpolate`integrations/${integration.id}`,
});

const stage = new aws.apigatewayv2.Stage("defaultStage", {
    apiId: api.id,
    name: "$default",
    autoDeploy: true,
});

const permission = new aws.lambda.Permission("apiPermission", {
    action: "lambda:InvokeFunction",
    function: lambda.name,
    principal: "apigateway.amazonaws.com",
    sourceArn: pulumi.interpolate`${api.executionArn}/*/*`,
});

export const url = stage.invokeUrl;
```

## Serverless Testing Tools

### LocalStack

Local AWS cloud stack for testing.

```bash
# Install LocalStack
pip install localstack

# Start LocalStack
localstack start

# Or with Docker
docker run -d \
  --name localstack \
  -p 4566:4566 \
  -p 4571:4571 \
  localstack/localstack

# Configure AWS CLI for LocalStack
aws --endpoint-url=http://localhost:4566 s3 mb s3://test-bucket

# Test Lambda locally
aws --endpoint-url=http://localhost:4566 lambda create-function \
  --function-name test-function \
  --runtime python3.11 \
  --role arn:aws:iam::000000000000:role/lambda-role \
  --handler index.handler \
  --zip-file fileb://function.zip
```

### Serverless Testing Framework

```javascript
// tests/handler.test.js
const { handler } = require('../handler');

describe('Lambda Handler', () => {
  test('should return 200', async () => {
    const event = {
      httpMethod: 'GET',
      path: '/users',
      queryStringParameters: { id: '123' }
    };
    
    const result = await handler(event);
    
    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toHaveProperty('userId');
  });
  
  test('should handle errors', async () => {
    const event = {
      httpMethod: 'GET',
      path: '/users',
      queryStringParameters: {}
    };
    
    const result = await handler(event);
    
    expect(result.statusCode).toBe(400);
  });
});
```

## Multi-Cloud Deployment

### Serverless Framework Multi-Cloud

```yaml
# serverless.yml
service: multi-cloud-app

provider:
  name: ${opt:provider, 'aws'}
  runtime: nodejs18.x

functions:
  hello:
    handler: handler.hello
    events:
      - http:
          path: hello
          method: get
```

```bash
# Deploy to AWS
serverless deploy --provider aws

# Deploy to Azure
serverless deploy --provider azure

# Deploy to GCP
serverless deploy --provider google
```

## Serverless Monitoring

### Serverless Dashboard

```yaml
# serverless.yml
org: myorg
app: myapp
service: my-service

provider:
  name: aws
  runtime: nodejs18.x
  
custom:
  alerts:
    stages:
      - production
    topics:
      alarm:
        topic: ${self:service}-${self:provider.stage}-alerts
    alarms:
      - functionErrors
      - functionThrottles
      - functionDuration
```

### Lumigo

```javascript
const lumigo = require('@lumigo/tracer');

// Wrap handler
exports.handler = lumigo.trace(async (event) => {
  // Your code
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Success' })
  };
});
```

## Best Practices

1. **Use framework for multi-function apps**: Serverless Framework or SAM
2. **Version control everything**: Including infrastructure code
3. **Implement CI/CD**: Automated testing and deployment
4. **Use environment variables**: For configuration
5. **Test locally first**: Before deploying to cloud
6. **Monitor and alert**: Track errors and performance
7. **Optimize cold starts**: Bundle size, memory allocation
8. **Implement proper error handling**: Retry logic, dead letter queues
9. **Use IAM properly**: Least privilege principle
10. **Document your architecture**: Keep README updated

Serverless frameworks eliminate boilerplate and enable rapid development of cloud-native applications with infrastructure as code, making serverless deployments consistent and repeatable.
