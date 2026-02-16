---
id: provider-29
title: GCP - Security, IAM, and Compliance
type: text
---

# GCP - Security, IAM, and Compliance

GCP provides comprehensive security services and features to protect your data, applications, and infrastructure with defense-in-depth approach.

## Identity and Access Management (IAM)

### IAM Model

**Who + What + Which Resource**

- **Who (Identity)**: User, service account, group, domain
- **What (Role)**: Collection of permissions
- **Which Resource**: Project, folder, organization, specific resource

### Role Types

**Primitive Roles** (Legacy, avoid in production):
- **Owner**: Full access, billing, IAM management
- **Editor**: Modify access, cannot manage IAM/billing
- **Viewer**: Read-only access

**Predefined Roles**:
Fine-grained, service-specific roles managed by Google.

```bash
# List predefined roles for a service
gcloud iam roles list --filter="name:roles/compute.*"

# View role permissions
gcloud iam roles describe roles/compute.instanceAdmin.v1
```

**Custom Roles**:
Create roles with specific permissions.

```bash
# Create custom role
gcloud iam roles create customComputeRole \
  --project=PROJECT_ID \
  --title="Custom Compute Role" \
  --description="Custom role for compute operations" \
  --permissions=compute.instances.get,compute.instances.list,compute.instances.start,compute.instances.stop \
  --stage=ALPHA

# Update custom role
gcloud iam roles update customComputeRole \
  --project=PROJECT_ID \
  --add-permissions=compute.instances.reset

# Delete custom role
gcloud iam roles delete customComputeRole --project=PROJECT_ID
```

### Granting IAM Permissions

```bash
# Grant role at project level
gcloud projects add-iam-policy-binding PROJECT_ID \
  --member=user:alice@example.com \
  --role=roles/compute.instanceAdmin.v1

# Grant role to service account
gcloud projects add-iam-policy-binding PROJECT_ID \
  --member=serviceAccount:myapp@PROJECT_ID.iam.gserviceaccount.com \
  --role=roles/storage.objectViewer

# Grant role to group
gcloud projects add-iam-policy-binding PROJECT_ID \
  --member=group:developers@example.com \
  --role=roles/editor

# Grant role at resource level (bucket)
gsutil iam ch user:bob@example.com:objectViewer gs://my-bucket

# Remove binding
gcloud projects remove-iam-policy-binding PROJECT_ID \
  --member=user:alice@example.com \
  --role=roles/compute.instanceAdmin.v1
```

### Conditional IAM Policies

Grant temporary or conditional access:

```bash
# Grant access with expiration condition
gcloud projects add-iam-policy-binding PROJECT_ID \
  --member=user:contractor@example.com \
  --role=roles/compute.viewer \
  --condition='expression=request.time < timestamp("2025-12-31T23:59:59Z"),title=Expires end of 2025'

# Grant access based on resource tag
gcloud projects add-iam-policy-binding PROJECT_ID \
  --member=user:alice@example.com \
  --role=roles/compute.instanceAdmin.v1 \
  --condition='expression=resource.matchTag("environment", "development"),title=Dev environment only'
```

### Policy Troubleshooter

```bash
# Check if user has permission
gcloud policy-troubleshoot iam PROJECT_ID \
  --principal-email=alice@example.com \
  --permission=compute.instances.create \
  --resource=//compute.googleapis.com/projects/PROJECT_ID
```

## Service Accounts

Machine accounts for applications and services.

### Creating Service Accounts

```bash
# Create service account
gcloud iam service-accounts create app-backend \
  --display-name="Application Backend Service Account" \
  --description="Service account for backend application"

# Grant permissions to service account
gcloud projects add-iam-policy-binding PROJECT_ID \
  --member=serviceAccount:app-backend@PROJECT_ID.iam.gserviceaccount.com \
  --role=roles/storage.objectAdmin

# Grant user permission to impersonate service account
gcloud iam service-accounts add-iam-policy-binding \
  app-backend@PROJECT_ID.iam.gserviceaccount.com \
  --member=user:developer@example.com \
  --role=roles/iam.serviceAccountUser

# Create and download key (avoid if possible)
gcloud iam service-accounts keys create key.json \
  --iam-account=app-backend@PROJECT_ID.iam.gserviceaccount.com
```

### Service Account Best Practices

**Do:**
- Use Workload Identity for GKE
- Use service account impersonation
- Rotate keys regularly (if using keys)
- Use short-lived credentials
- Grant minimum permissions

**Don't:**
- Download service account keys (use alternatives)
- Share keys between environments
- Grant primitive roles
- Use default service accounts

### Service Account Impersonation

```bash
# Impersonate service account for one command
gcloud compute instances list \
  --impersonate-service-account=app-backend@PROJECT_ID.iam.gserviceaccount.com

# Set default
gcloud config set auth/impersonate_service_account \
  app-backend@PROJECT_ID.iam.gserviceaccount.com
```

### Short-Lived Credentials

```python
from google.auth import impersonated_credentials
from google.auth.transport import requests
from google.cloud import storage

# Target service account to impersonate
target_scopes = ['https://www.googleapis.com/auth/cloud-platform']
target_service_account = 'target-sa@project.iam.gserviceaccount.com'

# Get credentials
credentials = impersonated_credentials.Credentials(
    source_credentials=source_credentials,
    target_principal=target_service_account,
    target_scopes=target_scopes,
    lifetime=3600  # 1 hour
)

# Use credentials
client = storage.Client(credentials=credentials)
buckets = list(client.list_buckets())
```

## Cloud KMS (Key Management Service)

Manage cryptographic keys for encryption.

### Creating Keys

```bash
# Create key ring
gcloud kms keyrings create my-keyring \
  --location=us-central1

# Create symmetric encryption key
gcloud kms keys create my-key \
  --location=us-central1 \
  --keyring=my-keyring \
  --purpose=encryption

# Create asymmetric signing key
gcloud kms keys create signing-key \
  --location=us-central1 \
  --keyring=my-keyring \
  --purpose=asymmetric-signing \
  --default-algorithm=rsa-sign-pss-2048-sha256

# Create key version
gcloud kms keys versions create \
  --location=us-central1 \
  --keyring=my-keyring \
  --key=my-key
```

### Encrypting and Decrypting

```bash
# Encrypt file
gcloud kms encrypt \
  --location=us-central1 \
  --keyring=my-keyring \
  --key=my-key \
  --plaintext-file=secret.txt \
  --ciphertext-file=secret.txt.enc

# Decrypt file
gcloud kms decrypt \
  --location=us-central1 \
  --keyring=my-keyring \
  --key=my-key \
  --ciphertext-file=secret.txt.enc \
  --plaintext-file=decrypted.txt
```

### Using KMS in Python

```python
from google.cloud import kms

def encrypt_data(project_id, location, keyring, key_name, plaintext):
    """Encrypt data using KMS."""
    client = kms.KeyManagementServiceClient()
    
    key_name = client.crypto_key_path(project_id, location, keyring, key_name)
    
    # Convert plaintext to bytes
    plaintext_bytes = plaintext.encode('utf-8')
    
    # Encrypt
    response = client.encrypt(
        request={'name': key_name, 'plaintext': plaintext_bytes}
    )
    
    return response.ciphertext

def decrypt_data(project_id, location, keyring, key_name, ciphertext):
    """Decrypt data using KMS."""
    client = kms.KeyManagementServiceClient()
    
    key_name = client.crypto_key_path(project_id, location, keyring, key_name)
    
    # Decrypt
    response = client.decrypt(
        request={'name': key_name, 'ciphertext': ciphertext}
    )
    
    return response.plaintext.decode('utf-8')
```

### Automatic Key Rotation

```bash
# Set rotation period (90 days)
gcloud kms keys update my-key \
  --location=us-central1 \
  --keyring=my-keyring \
  --rotation-period=90d \
  --next-rotation-time=2025-01-01T00:00:00Z
```

## Secret Manager

Store and manage sensitive information.

```bash
# Create secret
gcloud secrets create db-password \
  --replication-policy=automatic

# Add secret version
echo -n "super-secret-password" | \
  gcloud secrets versions add db-password --data-file=-

# Access secret
gcloud secrets versions access latest --secret=db-password

# Grant access to service account
gcloud secrets add-iam-policy-binding db-password \
  --member=serviceAccount:app@PROJECT_ID.iam.gserviceaccount.com \
  --role=roles/secretmanager.secretAccessor
```

### Python Secret Manager Client

```python
from google.cloud import secretmanager

def access_secret(project_id, secret_id, version_id="latest"):
    """Access secret from Secret Manager."""
    client = secretmanager.SecretManagerServiceClient()
    
    name = f"projects/{project_id}/secrets/{secret_id}/versions/{version_id}"
    response = client.access_secret_version(request={"name": name})
    
    return response.payload.data.decode('UTF-8')

def create_secret(project_id, secret_id, secret_data):
    """Create new secret."""
    client = secretmanager.SecretManagerServiceClient()
    
    parent = f"projects/{project_id}"
    
    # Create secret
    secret = client.create_secret(
        request={
            "parent": parent,
            "secret_id": secret_id,
            "secret": {"replication": {"automatic": {}}},
        }
    )
    
    # Add version
    response = client.add_secret_version(
        request={
            "parent": secret.name,
            "payload": {"data": secret_data.encode('UTF-8')},
        }
    )
    
    return response

# Usage
db_password = access_secret("my-project", "db-password")
```

## VPC Service Controls

Create security perimeters around GCP resources.

```bash
# Create access policy
gcloud access-context-manager policies create \
  --organization=ORG_ID \
  --title="My Access Policy"

# Create access level
gcloud access-context-manager levels create high_trust_level \
  --policy=POLICY_ID \
  --basic-level-spec=conditions.yaml

# conditions.yaml
cat > conditions.yaml << EOF
- ipSubnetworks:
  - 192.0.2.0/24
  members:
  - user:alice@example.com
  regions:
  - US
EOF

# Create service perimeter
gcloud access-context-manager perimeters create production_perimeter \
  --policy=POLICY_ID \
  --title="Production Perimeter" \
  --resources=projects/123,projects/456 \
  --restricted-services=storage.googleapis.com,bigquery.googleapis.com \
  --access-levels=high_trust_level
```

## Security Command Center

Centralized security and risk management.

**Features:**
- Asset discovery and inventory
- Vulnerability scanning
- Threat detection
- Compliance monitoring
- Security Health Analytics
- Web Security Scanner

```bash
# List findings
gcloud scc findings list ORG_ID

# Create notification config
gcloud scc notifications create my-notifications \
  --organization=ORG_ID \
  --pubsub-topic=projects/PROJECT_ID/topics/security-findings \
  --filter="state=\"ACTIVE\""
```

## Cloud Armor

DDoS protection and WAF (Web Application Firewall).

```bash
# Create security policy
gcloud compute security-policies create web-policy \
  --description="Security policy for web applications"

# Block specific countries
gcloud compute security-policies rules create 1000 \
  --security-policy=web-policy \
  --expression="origin.region_code == 'CN' || origin.region_code == 'RU'" \
  --action="deny-403" \
  --description="Block specific countries"

# Rate limiting
gcloud compute security-policies rules create 2000 \
  --security-policy=web-policy \
  --expression="true" \
  --action="rate-based-ban" \
  --rate-limit-threshold-count=100 \
  --rate-limit-threshold-interval-sec=60 \
  --ban-duration-sec=600 \
  --enforce-on-key=IP \
  --description="Rate limit: 100 requests per minute"

# SQL injection protection
gcloud compute security-policies rules create 3000 \
  --security-policy=web-policy \
  --expression="evaluatePreconfiguredExpr('sqli-stable')" \
  --action="deny-403" \
  --description="SQL injection protection"

# XSS protection
gcloud compute security-policies rules create 4000 \
  --security-policy=web-policy \
  --expression="evaluatePreconfiguredExpr('xss-stable')" \
  --action="deny-403" \
  --description="XSS protection"

# Attach to backend service
gcloud compute backend-services update web-backend \
  --security-policy=web-policy \
  --global
```

## Binary Authorization

Ensure only trusted container images are deployed.

```bash
# Create attestor
gcloud container binauthz attestors create prod-attestor \
  --attestation-authority-note=prod-note \
  --attestation-authority-note-project=PROJECT_ID

# Enable on GKE cluster
gcloud container clusters update my-cluster \
  --enable-binauthz \
  --zone=us-central1-a
```

## Cloud Audit Logs

Track who did what, where, and when.

**Log Types:**
- **Admin Activity**: Configuration changes (always enabled)
- **Data Access**: Read/write operations (must enable)
- **System Events**: GCP system operations
- **Policy Denied**: Access denials

```bash
# Enable Data Access logs
cat > audit-config.yaml << EOF
auditConfigs:
- auditLogConfigs:
  - logType: ADMIN_READ
  - logType: DATA_READ
  - logType: DATA_WRITE
  service: storage.googleapis.com
EOF

# Apply configuration
gcloud projects set-iam-policy PROJECT_ID audit-config.yaml

# Query logs
gcloud logging read "resource.type=gcs_bucket AND protoPayload.methodName=storage.objects.get" \
  --limit 50 \
  --format json
```

## Compliance and Certifications

GCP compliance certifications:
- **ISO 27001, 27017, 27018**
- **SOC 2/3**
- **PCI DSS**
- **HIPAA**
- **FedRAMP** (Moderate, High)
- **GDPR** compliant
- **CSA STAR**

### Compliance resources
```bash
# Access Transparency logs (Premium feature)
gcloud logging read "logName:\"cloudaudit.googleapis.com%2Faccess_transparency\""

# Assured Workloads (for regulated workloads)
# Create workload
gcloud assured workloads create \
  --compliance-regime=FEDRAMP_HIGH \
  --display-name="FedRAMP High Workload" \
  --location=us-central1 \
  --organization=ORG_ID
```

## Security Best Practices

1. **Principle of least privilege**: Grant minimum necessary permissions
2. **Use service accounts**: Not user accounts for applications
3. **Enable MFA**: Multi-factor authentication for all users
4. **Rotate keys regularly**: Service account keys and KMS keys
5. **Enable audit logging**: Track all activity
6. **Use VPC Service Controls**: Protect sensitive data
7. **Encrypt data**: At rest and in transit
8. **Scan for vulnerabilities**: Container images and dependencies
9. **Implement Cloud Armor**: Protect public-facing apps
10. **Monitor continuously**: Security Command Center, Cloud Monitoring

GCP provides comprehensive security services and features to protect your cloud resources with defense-in-depth approach, enabling you to meet stringent security and compliance requirements.
