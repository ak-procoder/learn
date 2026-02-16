---
id: security-4
title: "AWS Identity and Access Management"
type: text
---

# AWS Identity and Access Management

AWS IAM provides fine-grained access control for AWS resources.

## AWS IAM Entities

**Users**: Individual AWS accounts
**Groups**: Collections of users
**Roles**: Assumable by users or services
**Policies**: JSON documents defining permissions

## IAM Policy Example

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
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
    }
  ]
}
```

## Policy Evaluation Logic

1. **Explicit Deny**: Always wins
2. **Explicit Allow**: Grants access
3. **Implicit Deny**: Default (no allow = deny)

## IAM Roles Use Cases

**EC2 Instance Role**:
- Attach to EC2 instances
- No credentials in code
- Automatic rotation

**Cross-Account Role**:
- Access resources in another account
- Temporary credentials
- Auditable access

**Service Role**:
- Lambda, ECS, etc.
- Minimal permissions for service

## MFA (Multi-Factor Authentication)

**Virtual MFA**: Google Authenticator, Authy
**Hardware MFA**: YubiKey, Gemalto
**SMS MFA**: Text message (not recommended)

```bash
# Require MFA for sensitive operations
{
  "Effect": "Deny",
  "Action": "*",
  "Resource": "*",
  "Condition": {
    "BoolIfExists": {
      "aws:MultiFactorAuthPresent": "false"
    }
  }
}
```

## IAM Best Practices

- Root account: MFA, no daily use
- Create individual IAM users
- Use groups for permissions
- Rotate credentials regularly
- Enable CloudTrail logging
- Use IAM Access Analyzer
- Implement permission boundaries

AWS IAM provides powerful, flexible access control when properly configured.
