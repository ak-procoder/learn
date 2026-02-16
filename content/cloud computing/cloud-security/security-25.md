---
id: security-25
title: "API Security"
type: text
---

# API Security

APIs are critical attack vectors requiring comprehensive security measures.

## API Security Threats

**Broken Object Level Authorization**:
- Users accessing others' data
- Implement proper authorization checks
- Never rely on IDs alone

**Broken Authentication**:
- Weak authentication mechanisms
- Credential stuffing
- Token leakage

**Excessive Data Exposure**:
- Returning more data than needed
- Filter responses
- Field-level security

**Lack of Resources & Rate Limiting**:
- DoS attacks
- Resource exhaustion
- Cost implications

**Broken Function Level Authorization**:
- Accessing admin functions
- Privilege escalation
- Role-based access control

**Mass Assignment**:
- Binding client data without filtering
- param Pollution
- Whitelist allowed fields

**Security Misconfiguration**:
- Default configurations
- Verbose error messages
- Missing security headers

**Injection**:
- SQL injection
- NoSQL injection
- Command injection
- LDAP injection

**Improper Assets Management**:
- Undocumented APIs
- Old API versions
- Deprecated endpoints

**Insufficient Logging & Monitoring**:
- No audit trail
- Delayed breach detection
- Incomplete logging

## Authentication

**API Keys**:
```http
GET /api/data
X-API-Key: abc123def456
```
- Simple but less secure
- Rotation required
- Scope limitations

**OAuth 2.0**:
- Industry standard
- Token-based
- Scopes for permissions
- Refresh tokens

**JWT (JSON Web Tokens)**:
```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "sub": "user123",
    "exp": 1735689600,
    "scope": ["read", "write"]
  }
}
```

**mTLS (Mutual TLS)**:
- Certificate-based
- Highest security
- Service-to-service

## Authorization

**RBAC (Role-Based Access Control)**:
```json
{
  "user": "alice",
  "role": "editor",
  "permissions": ["read", "write"]
}
```

**ABAC (Attribute-Based Access Control)**:
```json
{
  "subject": {"role": "doctor", "department": "cardiology"},
  "resource": {"type": "patient-record", "department": "cardiology"},
  "action": "read",
  "environment": {"time": "business-hours"}
}
```

## Rate Limiting

**Implementation**:
```python
# Token bucket algorithm
class RateLimiter:
    def __init__(self, rate, capacity):
        self.rate = rate  # tokens per second
        self.capacity = capacity
        self.tokens = capacity
        self.last_update = time.time()
    
    def allow_request(self):
        now = time.time()
        elapsed = now - self.last_update
        self.tokens = min(self.capacity, 
                         self.tokens + elapsed * self.rate)
        self.last_update = now
        
        if self.tokens >= 1:
            self.tokens -= 1
            return True
        return False
```

**Headers**:
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 75
X-RateLimit-Reset: 1735689600
```

## Input Validation

**Validation Rules**:
- Type checking
- Format validation
- Range checking
- Length limits
- Whitelist allowed values

**Example**:
```python
from pydantic import BaseModel, constr, conint

class CreateUser(BaseModel):
    username: constr(regex=r'^[a-zA-Z0-9_]{3,20}$')
    email: constr(regex=r'^[\w\.-]+@[\w\.-]+\.\w+$')
    age: conint(ge=18, le=120)
```

## CORS (Cross-Origin Resource Sharing)

**Configuration**:
```http
Access-Control-Allow-Origin: https://example.com
Access-Control-Allow-Methods: GET, POST, PUT
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Max-Age: 86400
```

**Best Practices**:
- Specific origins, not *
- Minimal methods
- Validate Origin header
- Use credentials carefully

## API Gateway Security

**AWS API Gateway**:
- Authentication (IAM, Cognito, Custom)
- Rate limiting (throttling)
- WAF integration
- Usage plans and API keys
- Request/response validation

**Features**:
- SSL termination
- Certificate management
- DDoS protection
- Logging and monitoring

## Security Headers

```http
Strict-Transport-Security: max-age=31536000; includeSubDomains
Content-Security-Policy: default-src 'self'
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
```

## API Versioning

**URL Versioning**:
```
https://api.example.com/v1/users
https://api.example.com/v2/users
```

**Header Versioning**:
```http
Accept: application/vnd.example.v1+json
```

**Benefits**:
- Maintain old versions securely
- Deprecate vulnerable versions
- Controlled migration

## Best Practices

- Use HTTPS everywhere
- Implement proper authentication
- Apply least privilege
- Rate limit all endpoints
- Validate and sanitize input
- Implement comprehensive logging
- Use API gateway
- Regular security testing
- API documentation
- Deprecation policy

API security is crucial as APIs become the primary attack surface in cloud applications.
