---
id: security-3
title: "Identity and Access Management (IAM) Overview"
type: text
---

# Identity and Access Management (IAM) Overview

IAM controls who can access resources and what actions they can perform.

## Core IAM Concepts

**Identities**:
- Users: Individual people
- Groups: Collections of users
- Roles: Assumed by services or users
- Service Accounts: For applications

**Permissions**:
- Policies defining allowed actions
- Attached to identities
- Principle of least privilege

**Authentication**:
- Verifying identity
- Passwords, MFA, certificates
- Federated authentication

**Authorization**:
- What actions are allowed
- Policy evaluation
- Deny takes precedence

## IAM Components

**Users and Groups**:
```
Organization
├── Admin Group
│   ├── alice@example.com
│   └── bob@example.com
├── Developer Group
│   ├── charlie@example.com
│   └── diana@example.com
└── Auditor Group
    └── eve@example.com
```

**Policies**:
- Managed policies (reusable)
- Inline policies (specific to identity)
- Resource-based policies
- Permission boundaries

**Roles**:
- Temporary credentials
- Cross-account access
- Service-to-service access
- Federated access

## IAM Best Practices

**Use Roles Over Keys**:
- Temporary credentials
- Automatic rotation
- No storage in code

**Enable MFA**:
- Multi-factor authentication
- Especially for privileged accounts
- Hardware or software tokens

**Least Privilege**:
- Grant minimum permissions
- Start restrictive, expand as needed
- Regular access reviews

**Separate Duties**:
- Different roles for different tasks
- No single super user
- Audit critical actions

**Monitor and Audit**:
- Track all IAM changes
- Review access regularly
- Unused credential cleanup

IAM is the foundation of cloud security - get it right first!
