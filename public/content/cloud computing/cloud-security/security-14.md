---
id: security-14
title: "Security Monitoring and Logging"
type: text
---

# Security Monitoring and Logging

Comprehensive logging and monitoring are essential for detecting, responding to, and investigating security incidents.

## Why Security Monitoring?

**Threat Detection**: Identify attacks in progress
**Compliance**: Regulatory requirements
**Incident Response**: Investigation and forensics
**Audit Trail**: Track actions and changes
**Anomaly Detection**: Unusual patterns

## Types of Logs

**Infrastructure Logs**:
- System logs
- Network flow logs
- Resource creation/deletion
- Configuration changes

**Application Logs**:
- Application events
- Error logs
- Transaction logs
- Performance metrics

**Security Logs**:
- Authentication attempts
- Authorization decisions
- Security group changes
- Encryption key usage

**Audit Logs**:
- API calls
- Admin actions
- Data access
- Policy changes

## AWS Logging Services

**CloudTrail**:
- Records API calls
- Governance and compliance
- Operational auditing
- Risk auditing

```json
{
  "eventName": "RunInstances",
  "userIdentity": {
    "type": "IAMUser",
    "userName": "Alice"
  },
  "eventTime": "2026-02-16T10:30:00Z",
  "sourceIPAddress": "203.0.113.50",
  "responseElements": {
    "instancesSet": {
      "items": [
        { "instanceId": "i-1234567890abcdef0" }
      ]
    }
  }
}
```

**VPC Flow Logs**:
- Network traffic metadata
- Source/destination IPs
- Ports and protocols
- Accept/reject decisions

**CloudWatch Logs**:
- Application logs
- System logs
- Custom logs
- Real-time monitoring

## Azure Monitoring

**Activity Log**:
- Subscription-level events
- Resource changes
- Service health events

**Diagnostic Logs**:
- Resource-specific logs
- Metrics and logs
- Archive to storage

**Azure Monitor**:
- Centralized monitoring
- Metrics and logs
- Alerts and dashboards

**Azure Sentinel**: Security Information and Event Management (SIEM)
- Collect data at scale
- Detect threats
- Investigate with AI
- Respond rapidly

## Google Cloud Logging

**Cloud Audit Logs**:
- Admin Activity: Who did what
- Data Access: Data read/write
- System Events: Google actions
- Policy Denied: Denied requests

**VPC Flow Logs**:
- Network connectivity
- Troubleshooting
- Security analysis

**Cloud Logging**:
- Centralized logging
- Real-time log management
- Export to BigQuery

## SIEM Integration

**SIEM Solutions**:
- Splunk
- Azure Sentinel
- Google Chronicle
- Elastic Security

**Capabilities**:
- Log aggregation
- Correlation analysis
- Threat detection
- Compliance reporting

## Log Analysis

**Common Queries**:

Failed login attempts:
```
eventName = "ConsoleLogin" AND errorMessage exists
```

S3 bucket access from unusual IP:
```
eventName = "GetObject" AND requestParameters.bucketName = "sensitive-data" 
AND sourceIPAddress NOT IN [known_ips]
```

IAM policy changes:
```
eventName IN ["PutUserPolicy", "AttachUserPolicy", "CreateAccessKey"]
```

## Alerting

**Alert Rules**:
- Multiple failed logins
- Root account usage
- Security group changes
- Unusual data transfer
- Privilege escalation attempts

**Alert Channels**:
- Email
- SMS
- Slack/Teams
- PagerDuty
- SNS/EventBridge

## Best Practices

**Logging**:
- Enable logging for all critical resources
- Centralize logs
- Protect log integrity
- Retain logs per compliance requirements
- Encrypt logs at rest

**Monitoring**:
- Real-time alerting
- Baseline normal behavior
- Automated response where possible
- Regular review of alerts
- Tune to reduce false positives

**Log Management**:
- Structured logging (JSON)
- Consistent timestamp format (UTC)
- Include context (user, resource, action)
- Archive old logs
- Cost optimization (log retention tiers)

**Security**:
- Restrict access to logs
- Tamper-proof logging
- Separate logging account
- Monitor the monitors
- Encrypt log data

## Compliance Requirements

**PCI DSS**: 10.1 - Trails to link access to system components
**HIPAA**: Track access to ePHI
**GDPR**: Demonstrate data processing activities
**SOX**: Financial system access logging

Security logging and monitoring are foundational for maintaining security posture.
