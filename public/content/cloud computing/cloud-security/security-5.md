---
id: security-5
title: "Azure Active Directory and RBAC"
type: text
---

# Azure Active Directory and RBAC

Azure AD provides identity and access management, while RBAC controls resource access.

## Azure Active Directory (Azure AD)

**Identity Service**:
- User and group management
- Multi-factor authentication
- Single sign-on (SSO)
- Application integration

**Types of Identities**:
- **Users**: Individual accounts
- **Groups**: Collections of users
- **Service Principals**: Application identities
- **Managed Identities**: Azure resource identities

## Managed Identities

**System-Assigned**:
- Tied to Azure resource lifecycle
- Automatically created and deleted
- One per resource

**User-Assigned**:
- Independent lifecycle
- Reusable across resources
- Managed separately

```bash
# Enable system-assigned identity
az vm identity assign --name myVM --resource-group myRG

# No credentials needed in code!
```

## Role-Based Access Control (RBAC)

**Built-in Roles**:
- **Owner**: Full access including access management
- **Contributor**: Full access except access management
- **Reader**: View only
- **User Access Administrator**: Manage user access only

**Custom Roles**:
```json
{
  "Name": "VM Operator",
  "Actions": [
    "Microsoft.Compute/virtualMachines/start/action",
    "Microsoft.Compute/virtualMachines/restart/action",
    "Microsoft.Compute/virtualMachines/read"
  ],
  "NotActions": [],
  "AssignableScopes": [
    "/subscriptions/{subscription-id}"
  ]
}
```

## RBAC Assignment

```
Security Principal + Role Definition + Scope = Role Assignment
```

**Scopes**:
- Management Group
- Subscription
- Resource Group
- Resource

## Azure AD Premium Features

**Conditional Access**:
- Location-based access
- Device compliance
- Risk-based policies

**Privileged Identity Management (PIM)**:
- Just-in-time access
- Time-bound permissions
- Approval workflows
- Access reviews

## Best Practices

- Use managed identities for Azure resources
- Assign roles at appropriate scope
- Regular access reviews
- Enable MFA for all users
- Use Conditional Access policies
- Monitor sign-ins and audit logs
- Implement Privileged Identity Management

Azure AD and RBAC provide enterprise-grade identity and access management.
