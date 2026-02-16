---
id: storage-20
title: "Storage Security Fundamentals"
type: text
---

# Storage Security Fundamentals

Securing cloud storage requires multiple layers of protection including encryption, access control, and monitoring.

## Encryption

**At Rest**:
- Data encrypted on disk
- AES-256 encryption standard
- Provider-managed or customer-managed keys

**In Transit**:
- TLS/SSL for data transfer
- HTTPS for object storage
- VPN for private connections

**Encryption Options**:
- **Server-Side**: Provider handles encryption
- **Client-Side**: Encrypt before uploading
- **Customer-Managed Keys**: Full key control

## Access Control

**Identity and Access Management (IAM)**:
- User and service accounts
- Role-based access control (RBAC)
- Principle of least privilege

**Bucket/Container Policies**:
- Resource-level permissions
- Condition-based access
- IP restrictions

**Access Control Lists (ACLs)**:
- Grant access to specific users
- Legacy method (prefer IAM)

**Pre-Signed URLs**:
- Temporary access to objects
- Time-limited
- No credentials required

## Network Security

**Private Endpoints**:
- Access without internet exposure
- VPC/VNet integration
- Private connectivity

**Firewall Rules**:
- IP whitelisting
- Geo-blocking
- Rate limiting

**Service Endpoints**:
- Secure access from cloud services
- No public IP required

## Compliance and Auditing

**Access Logging**:
- Track all access requests
- Who, what, when, where
- Store in secure location

**Versioning**:
- Recover from deletions
- Protect against overwrites
- MFA delete protection

**Compliance Certifications**:
- HIPAA, PCI DSS, SOC 2
- GDPR compliance
- Regional data residency

## Security Best Practices

- Enable encryption by default
- Use IAM roles over access keys
- Implement MFA for sensitive operations
- Regular access audits
- Enable logging and monitoring
- Block public access by default
- Use VPC endpoints
- Implement data classification

Security is a shared responsibility between provider and customer.
