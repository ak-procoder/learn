---
id: provider-9
title: AWS Security Services
type: text
---

# AWS Security Services

AWS provides a comprehensive suite of security services and features to protect your applications, data, and infrastructure. Security is a shared responsibility between AWS and customers, with AWS offering tools to help you meet your security and compliance requirements.

## AWS Shared Responsibility Model

```plaintext
Customer Responsibility (Security IN the Cloud):
- Customer Data
- Platform, Applications, IAM
- Operating System, Network, Firewall
- Client-side Encryption
- Server-side Encryption
- Network Traffic Protection

AWS Responsibility (Security OF the Cloud):
- Software (Compute, Storage, Database, Networking)
- Hardware/AWS Global Infrastructure
- Regions, Availability Zones, Edge Locations
```

## Identity and Access Management (IAM)

IAM enables secure control over access to AWS resources through authentication and authorization.

### Core Components

**Users**
- Individual identities
- Long-term credentials
- Access keys for programmatic access
- Password for console access

**Groups**
- Collection of users
- Simplify permission management
- Users inherit group permissions

**Roles**
- Temporary security credentials
- Assumed by users, applications, or services
- No long-term credentials
- Cross-account access

**Policies**
```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": [
      "s3:GetObject",
      "s3:PutObject"
    ],
    "Resource": "arn:aws:s3:::my-bucket/*",
    "Condition": {
      "IpAddress": {
        "aws:SourceIp": "203.0.113.0/24"
      }
    }
  }]
}
```

**Policy Types:**
- **Identity-based**: Attached to users, groups, roles
- **Resource-based**: Attached to resources (S3 buckets, SNS topics)
- **Permission boundaries**: Maximum permissions for identity
- **Service control policies (SCPs)**: Organization-level controls

### IAM Best Practices

1. **Enable MFA**: Multi-factor authentication for all users
2. **Principle of least privilege**: Grant minimum required permissions
3. **Use roles**: Prefer roles over long-term credentials
4. **Rotate credentials**: Regular key rotation
5. **Use policy conditions**: Add constraints to permissions
6. **Monitor with CloudTrail**: Track API calls
7. **Use IAM Access Analyzer**: Identify unintended access
8. **Password policy**: Enforce strong passwords

## AWS Organizations

Centrally manage and govern multiple AWS accounts.

### Features

**Organizational Units (OUs)**
```plaintext
Root
├── Production OU
│   ├── Account A
│   └── Account B
├── Development OU
│   ├── Account C
│   └── Account D
└── Security OU
    └── Account E
```

**Service Control Policies (SCPs)**
- Define maximum permissions
- Applied at OU or account level
- Override IAM permissions

**Consolidated Billing**
- Single payment method
- Volume discounts
- Cost allocation by account

**AWS Control Tower**
- Automated account setup
- Guardrails for governance
- Compliant multi-account environment

## Network Security

### Security Groups

Stateful virtual firewalls for instances.

```plaintext
Inbound Rules:
| Type  | Protocol | Port | Source      |
|-------|----------|------|-------------|
| HTTP  | TCP      | 80   | 0.0.0.0/0   |
| HTTPS | TCP      | 443  | 0.0.0.0/0   |
| SSH   | TCP      | 22   | 10.0.0.0/16 |

Outbound Rules:
| Type        | Protocol | Port | Destination |
|-------------|----------|------|-------------|
| All traffic | All      | All  | 0.0.0.0/0   |
```

**Features:**
- Allow rules only (no deny rules)
- Stateful (return traffic automatically allowed)
- Evaluate all rules
- Default: deny all inbound, allow all outbound

### Network ACLs (NACLs)

Stateless subnet-level firewalls.

**Differences from Security Groups:**
- Stateless (must allow return traffic)
- Support allow and deny rules
- Rules processed in number order
- Apply to entire subnet

### AWS WAF (Web Application Firewall)

Protect web applications from common exploits.

**Features:**
- SQL injection protection
- Cross-site scripting (XSS) prevention
- Rate-based rules
- Geo-blocking
- IP reputation lists
- Bot control

**Deployment:**
- CloudFront distributions
- Application Load Balancers
- API Gateway
- AWS AppSync

```json
{
  "Name": "RateLimitRule",
  "Priority": 1,
  "Statement": {
    "RateBasedStatement": {
      "Limit": 2000,
      "AggregateKeyType": "IP"
    }
  },
  "Action": {
    "Block": {}
  }
}
```

### AWS Shield

DDoS protection service.

**AWS Shield Standard**
- Free for all AWS customers
- Protection against common layer 3/4 attacks
- SYN/UDP floods, reflection attacks
- Automatic protection

**AWS Shield Advanced**
- $3,000/month
- Enhanced DDoS protection
- 24/7 DDoS Response Team (DRT)
- Cost protection (credits for scaling)
- Advanced attack diagnostics
- Integration with WAF

## Data Protection

### AWS KMS (Key Management Service)

Managed service for creating and controlling encryption keys.

**Features:**
- Centralized key management
- Encryption for AWS services
- Audit key usage with CloudTrail
- FIPS 140-2 validated
- Automatic key rotation

**Key Types:**
- **AWS managed keys**: Created and managed by AWS
- **Customer managed keys**: You create and manage
- **AWS owned keys**: Used by AWS services

```python
import boto3

# Encrypt data
kms = boto3.client('kms')
response = kms.encrypt(
    KeyId='arn:aws:kms:us-east-1:123456789012:key/12345678-1234-1234-1234-123456789012',
    Plaintext='sensitive data'
)
ciphertext = response['CiphertextBlob']

# Decrypt data
response = kms.decrypt(CiphertextBlob=ciphertext)
plaintext = response['Plaintext']
```

### AWS CloudHSM

Hardware security module for cryptographic operations.

**Use Cases:**
- Meet compliance requirements (FIPS 140-2 Level 3)
- Dedicated hardware
- Single-tenant access
- Custom key management

**vs KMS:**
| Feature | KMS | CloudHSM |
|---------|-----|----------|
| Management | Fully managed | Customer managed |
| Multi-tenancy | Yes | No (dedicated) |
| Compliance | FIPS 140-2 L2 | FIPS 140-2 L3 |
| Integration | Native AWS | Manual integration |
| Cost | Lower | Higher |

### AWS Secrets Manager

Store, retrieve, and rotate secrets.

**Features:**
- Automatic secret rotation
- Fine-grained access control
- Audit with CloudTrail
- Encrypt with KMS
- Cross-region replication

```python
import boto3

secrets = boto3.client('secretsmanager')

# Store secret
secrets.create_secret(
    Name='prod/db/password',
    SecretString='MySecretPassword123!'
)

# Retrieve secret
response = secrets.get_secret_value(SecretId='prod/db/password')
password = response['SecretString']
```

### AWS Certificate Manager (ACM)

Provision and manage SSL/TLS certificates.

**Features:**
- Free public certificates
- Automatic renewal
- Integration with ELB, CloudFront, API Gateway
- Private certificate authority

## Monitoring and Compliance

### AWS CloudTrail

Records API calls and account activity.

**Features:**
- 90-day history (free)
- Create trails for long-term storage
- Multi-region and multi-account trails
- Integration with CloudWatch Logs
- Event history search

**Use Cases:**
- Security analysis
- Compliance auditing
- Operational troubleshooting
- Risk auditing

### Amazon GuardDuty

Intelligent threat detection service.

**Detection Types:**
- Unusual API calls
- Compromised instances
- Reconnaissance attacks
- Account compromise
- Cryptocurrency mining

**Data Sources:**
- VPC Flow Logs
- CloudTrail logs
- DNS logs
- Kubernetes audit logs

**Features:**
- Machine learning powered
- Threat intelligence feeds
- Automated response with EventBridge
- Centralized across accounts

### AWS Security Hub

Centralized security and compliance dashboard.

**Features:**
- Aggregate findings from multiple services
- Automated compliance checks
- Security standards (CIS, PCI-DSS)
- Integration with GuardDuty, Inspector, Macie
- Automated remediation

**Security Standards:**
- AWS Foundational Security Best Practices
- CIS AWS Foundations Benchmark
- PCI DSS
- ISO 27001
- HIPAA

### Amazon Macie

Data security and privacy service using machine learning.

**Features:**
- Discover and classify sensitive data
- PII (Personally Identifiable Information) detection
- Financial data identification
- Automated data discovery
- Data access patterns

### AWS Config

Track resource configurations and changes.

**Features:**
- Resource inventory
- Configuration history
- Change notifications
- Compliance auditing
- Remediation actions

**Config Rules:**
```plaintext
Rule: encrypted-volumes
Trigger: Configuration change
Resource: EC2::Volume
Compliance: All EBS volumes must be encrypted
```

### Amazon Inspector

Automated security assessment service.

**Features:**
- Vulnerability scanning
- Network reachability analysis
- Package vulnerabilities (CVEs)
- Continuously assess workloads
- Integration with Systems Manager

## Incident Response

### AWS Systems Manager Incident Manager

Automated incident response.

**Features:**
- Incident response plans
- Automated runbooks
- Team engagement
- Post-incident analysis
- Integration with SNS, EventBridge

## Compliance

### Compliance Programs

AWS supports numerous compliance programs:
- **HIPAA**: Healthcare data
- **PCI DSS**: Payment card data
- **SOC 1/2/3**: Service organization controls
- **ISO 27001**: Information security
- **FedRAMP**: US government
- **GDPR**: EU data protection

### AWS Artifact

Self-service portal for compliance reports.

**Features:**
- On-demand access to compliance reports
- Agreements (BAA, GDPR DPA)
- Third-party attestations
- SOC reports, ISO certifications

## Best Practices

1. **Defense in depth**: Multiple security layers
2. **Least privilege**: Minimum permissions required
3. **Enable MFA**: All accounts, especially root
4. **Encrypt data**: At rest and in transit
5. **Enable logging**: CloudTrail, VPC Flow Logs
6. **Automate security**: Security Hub, Config rules
7. **Regular audits**: IAM Access Analyzer, Trusted Advisor
8. **Incident response plan**: Prepare for security events
9. **Security training**: Educate team members
10. **Stay updated**: AWS security bulletins and advisories

AWS security services provide comprehensive tools to protect your cloud infrastructure, from identity management to threat detection, encryption, and compliance monitoring. Proper implementation of these services is crucial for maintaining a secure cloud environment.
