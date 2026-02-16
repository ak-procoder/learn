---
id: security-24
title: "Serverless Security"
type: text
---

# Serverless Security

Serverless computing introduces unique security considerations while eliminating traditional infrastructure security concerns.

## Serverless Security Model

**Provider Responsibilities**:
- Physical security
- Network infrastructure
- Host patching
- Runtime environment
- Availability

**Customer Responsibilities**:
- Function code security
- Dependencies
- Access control
- Data protection
- Application logic

## Function Security

**Code Security**:
- Input validation
- Secure dependencies
- No hardcoded secrets
- Error handling
- Least privilege

**Dependency Management**:
```json
{
  "dependencies": {
    "axios": "^0.21.1"  // Known vulnerabilities
  }
}
```
- Regular updates
- Vulnerability scanning
- Minimal dependencies
- Version pinning

## Access Control

**IAM Roles**:
```json
{
  "Effect": "Allow",
  "Action": [
    "dynamodb:GetItem",
    "dynamodb:PutItem"
  ],
  "Resource": "arn:aws:dynamodb:us-east-1:123456789012:table/MyTable"
}
```
- One role per function
- Least privilege
- No wildcards in production
- Regular audits

**API Security**:
- Authentication (API keys, OAuth)
- Authorization
- Rate limiting
- Input validation

## Secrets Management

**Never in Code**:
```python
# Bad
api_key = "abc123def456"

# Good
import os
api_key = os.environ['API_KEY']

# Better
import boto3
secrets = boto3.client('secretsmanager')
api_key = secrets.get_secret_value(SecretId='api-key')['SecretString']
```

**Services**:
- AWS Secrets Manager
- Azure Key Vault
- Google Secret Manager
- Parameter Store

## Monitoring and Logging

**CloudWatch/Application Insights**:
- Function invocations
- Errors and timeouts
- Custom metrics
- Distributed tracing

**Security Monitoring**:
- Unusual invocation patterns
- Failed authentications
- Error spikes
- Long execution times

## Data Protection

**Encryption**:
- Environment variables encrypted
- Data at rest (S3, DynamoDB)
- Data in transit (HTTPS)

**Data Handling**:
- Minimal data retention
- Secure data disposal
- No PII in logs
- Data classification

## Vendor Lock-in Considerations

**Portability**:
- Abstract cloud-specific APIs
- Containerized functions
- Infrastructure as Code
- Multi-cloud strategy

## Serverless-Specific Threats

**Event Injection**:
- Validate all input
- Sanitize event data
- Type checking
- Schema validation

**Denial of Wallet**:
- Cost monitoring
- Concurrency limits
- Rate limiting
- Budget alerts

**Third-Party Dependencies**:
- Supply chain attacks
- Compromised packages
- Outdated libraries
- License issues

## Best Practices

**Function Design**:
- Single responsibility
- Stateless functions
- Idempotent operations
- Timeout configuration

**Security Controls**:
- Enable X-Ray tracing
- Use VPCs for sensitive data
- implement dead letter queues
- Regular security reviews

**Deployment**:
- Separate dev/prod environments
- Version control
- Automated testing
- Gradual rollouts

Serverless security requires a different mindset focused on application-level security.
