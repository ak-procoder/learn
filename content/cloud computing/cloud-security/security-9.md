---
id: security-9
title: "Web Application Firewall (WAF)"
type: text
---

# Web Application Firewall (WAF)

WAF protects web applications from common attacks like SQL injection, cross-site scripting, and more.

## What is WAF?

Layer 7 (application) firewall that:
- Inspects HTTP/HTTPS traffic
- Applies rules to block attacks
- Protects against OWASP Top 10
- Customizable rule sets

## Common Attack Protections

**SQL Injection**:
```sql
OR 1=1; DROP TABLE users;--
```
WAF detects and blocks malicious SQL patterns

**Cross-Site Scripting (XSS)**:
```html
<script>alert('XSS')</script>
```
Blocks malicious JavaScript injection

**Cross-Site Request Forgery (CSRF)**:
Validates request origins and tokens

**Path Traversal**:
```
../../etc/passwd
```
Prevents directory traversal attempts

## Cloud WAF Services

**AWS WAF**:
- Integrates with CloudFront, ALB, API Gateway
- Managed rules (AWS and partners)
- Custom rules with conditions
- Rate-based rules

**Azure WAF**:
- Application Gateway WAF
- Front Door WAF
- OWASP Core Rule Set
- Bot protection

**Google Cloud Armor**:
- Global HTTP(S) load balancing
- Preconfigured WAF rules
- Custom rules
- Adaptive protection

## WAF Rule Example (AWS)

```json
{
  "Name": "BlockSQLInjection",
  "Priority": 1,
  "Statement": {
    "SqliMatchStatement": {
      "FieldToMatch": {
        "Body": {}
      },
      "TextTransformations": [
        {
          "Priority": 0,
          "Type": "URL_DECODE"
        }
      ]
    }
  },
  "Action": {
    "Block": {}
  }
}
```

## Rate Limiting

Block excessive requests:
```
IF request_count > 2000 in 5 minutes
FROM same IP
THEN block for 10 minutes
```

## Geo-Blocking

```
Allow: US, CA, UK
Block: All others
```

## Bot Management

**Bot Detection**:
- User-agent analysis
- Behavioral analysis
- Challenge mechanisms

**Good Bots**: Allow search engines, monitoring
**Bad Bots**: Block scrapers, attackers

## WAF Best Practices

**Start in Detection Mode**:
- Monitor without blocking
- Identify false positives
- Tune rules before enforcing

**Use Managed Rules**:
- OWASP Top 10 protection
- Known vulnerability protection
- Regular updates

**Custom Rules**:
- Application-specific logic
- Business requirements
- Complement managed rules

**Logging and Monitoring**:
- Enable detailed logging
- Analyze blocked requests
- Alert on attack patterns
- Regular review

**Testing**:
- Test rules before production
- Validate legitimate traffic
- Performance testing
- Regular security scans

## Limitations

- Cannot protect against all attacks
- Requires tuning to avoid false positives
- Not a substitute for secure coding
- Application-layer only
- Can add latency

WAF is an essential layer in web application security defense.
