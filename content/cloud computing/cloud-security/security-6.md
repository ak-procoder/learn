---
id: security-6
title: "Google Cloud IAM"
type: text
---

# Google Cloud IAM

Google Cloud IAM provides unified access control for all GCP resources.

## IAM Components

**Members (Who)**:
- Google Account: Individual user
- Service Account: Application identity
- Google Group: Collection of accounts
- Google Workspace domain: Organization
- Cloud Identity domain: Identity provider

**Roles (What)**:
- Primitive: Owner, Editor, Viewer
- Predefined: Service-specific, curated by Google
- Custom: User-defined permissions

**Resources (Which)**:
- Organization
- Folder
- Project
- Individual resources

## IAM Policy

```json
{
  "bindings": [
    {
      "role": "roles/storage.objectViewer",
      "members": [
        "user:alice@example.com",
        "serviceAccount:sa@project.iam.gserviceaccount.com"
      ],
      "condition": {
        "title": "Expires in 2026",
        "expression": "request.time < timestamp('2026-12-31T23:59:59Z')"
      }
    }
  ]
}
```

## Service Accounts

**Types**:
- User-managed: Created by users
- Default: Automatically created
- Google-managed: Used by Google services

**Best Practices**:
```bash
# Create service account
gcloud iam service-accounts create my-sa

# Grant role
gcloud projects add-iam-policy-binding my-project \
  --member="serviceAccount:my-sa@my-project.iam.gserviceaccount.com" \
  --role="roles/storage.objectViewer"

# Use with Compute Engine
gcloud compute instances create my-vm \
  --service-account=my-sa@my-project.iam.gserviceaccount.com
```

## IAM Conditions

Time-based access:
```
request.time < timestamp('2026-12-31T23:59:59Z')
```

Resource-based:
```
resource.name.startsWith('projects/_/buckets/prod-')
```

IP-based:
```
origin.ip in ['203.0.113.0/24']
```

## Organization Policy

Enforce compliance across organization:
- Restrict resource locations
- Disable service accounts
- Require encryption
- Control external access

## IAM Recommender

- Identifies over-privileged accounts
- Suggests permission removals
- Machine learning-based
- Reduce security risk

## Best Practices

- Use service accounts for applications
- Grant roles at lowest resource level
- Use predefined roles when possible
- Enable audit logging
- Review permissions regularly
- Implement organization policies
- Use IAM Conditions for temporary access
- Rotate service account keys

GCP IAM provides fine-grained, flexible access control with advanced features like conditions and recommendations.
