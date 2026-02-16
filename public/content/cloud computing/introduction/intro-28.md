---
id: intro-28
title: Cloud Computing Identity and Access Management
type: text
---

## What is IAM?

**Definition**: Framework for managing digital identities and controlling access to resources.

**Core Functions**:
- Authentication: Verify who you are
- Authorization: Determine what you can do
- Accounting/Auditing: Track what was done

## Key IAM Concepts

### Users

**Definition**: Individual people or services that interact with cloud resources

**Types**:
- Human users (employees, contractors)
- Service accounts (applications, services)
- Federated users (external identity providers)

### Groups

**Purpose**: Collection of users with similar access needs

**Benefits**:
- Easier permission management
- Consistency
- Scalability

**Example**:
- Developers group
- Database Administrators group
- Read-Only Auditors group

### Roles

**Definition**: Set of permissions that can be assumed

**Use Cases**:
- Cross-account access
- Temporary elevated privileges
- Service-to-service permissions

**Benefits**:
- No long-term credentials
- Temporary security credentials
- Easy to delegate

### Policies

**Definition**: Document that defines permissions

**Format** (JSON example):
```json
{
  "Effect": "Allow",
  "Action": [
    "s3:GetObject",
    "s3:ListBucket"
  ],
  "Resource": "arn:aws:s3:::my-bucket/*"
}
```

**Types**:
- Identity-based: Attached to users, groups, roles
- Resource-based: Attached to resources
- Permission boundaries: Maximum permissions limit

## Access Control Models

### Role-Based Access Control (RBAC)

**Principle**: Permissions based on job function

**Example Roles**:
- Administrator: Full access
- Developer: Create/modify resources
- Viewer: Read-only access

### Attribute-Based Access Control (ABAC)

**Principle**: Permissions based on attributes (tags)

**Example**:
Grant access to resources where:
- Department = Finance
- Environment = Production
- Cost Center = CC-12345

**Benefits**: More flexible and scalable than RBAC

## IAM Best Practices

### Least Privilege Principle

**Guideline**: Grant minimum permissions necessary

**Practice**:
1. Start with no permissions
2. Add permissions as needed
3. Regularly review and remove unnecessary permissions

### Multi-Factor Authentication (MFA)

**Requirement**: Something you know + something you have

**Types**:
- SMS codes
- Authenticator apps (TOTP)
- Hardware tokens
- Biometrics

**Apply to**:
- All users
- Especially privileged accounts
- Sensitive operations

### Credential Management

**Best Practices**:
- Rotate credentials regularly
- Use temporary credentials when possible
- Never hardcode credentials
- Use secrets management services
- Audit credential usage

### Regular Audits

**Activities**:
- Review user access
- Identify unused permissions
- Check for overly permissive policies
- Remove inactive users
- Validate MFA compliance

## Federated Identity

**Definition**: Use existing identity provider for cloud access

**Benefits**:
- Single sign-on (SSO)
- Centralized identity management
- No duplicate accounts
- Simplified user lifecycle

**Protocols**:
- SAML 2.0
- OpenID Connect (OIDC)
- OAuth 2.0

**Common Identity Providers**:
- Microsoft Active Directory
- Okta
- Azure AD
- Google Workspace

## Service Accounts and Workload Identity

**Purpose**: Provide identity for applications and services

**Best Practices**:
- One service account per application
- Minimal permissions
- Rotate credentials
- Avoid long-lived keys when possible
- Use managed identities when available

## Monitoring and Logging

**Track**:
- Authentication attempts
- Authorization decisions
- Permission changes
- Policy modifications
- Unusual access patterns

**Tools**:
- Cloud audit logs
- Security information and event management (SIEM)
- Alerting on suspicious activity
