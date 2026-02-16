---
id: security-13
title: "Key Management Services"
type: text
---

# Key Management Services

Key Management Services (KMS) provide centralized control over encryption keys used to protect data.

## What is KMS?

**Centralized Key Management**:
- Create and manage encryption keys
- Control key usage with policies
- Audit key usage
- Rotate keys automatically
- HSM-backed security

## AWS Key Management Service (KMS)

**Features**:
- Create and manage keys
- Envelope encryption
- Integration with AWS services
- CloudTrail logging
- Automatic key rotation

**Key Types**:
- **Symmetric**: Single key for encrypt/decrypt (AES-256)
- **Asymmetric**: Public/private key pairs (RSA, ECC)

**Creating a Key**:
```bash
aws kms create-key \
  --description "My application key" \
  --key-usage ENCRYPT_DECRYPT

aws kms create-alias \
  --alias-name alias/my-app-key \
  --target-key-id 1234abcd-12ab-34cd-56ef-1234567890ab
```

**Envelope Encryption**:
1. Data encrypted with data key
2. Data key encrypted with master key
3. Only encrypted data key stored with data
4. Master key never leaves KMS

**Key Policies**:
```json
{
  "Effect": "Allow",
  "Principal": {
    "AWS": "arn:aws:iam::123456789012:role/MyRole"
  },
  "Action": [
    "kms:Decrypt",
    "kms:Encrypt"
  ],
  "Resource": "*"
}
```

## Azure Key Vault

**Capabilities**:
- Keys, secrets, certificates
- Hardware Security Module (HSM) backed
- Soft-delete and purge protection
- Network access control

**Key Types**:
- Software-protected
- HSM-protected (Premium tier)

**Access Tiers**:
- **Standard**: Software keys
- **Premium**: HSM-backed keys
- **Managed HSM**: Dedicated HSM pool

**Creating Secrets**:
```bash
az keyvault create --name myKeyVault --resource-group myRG

az keyvault secret set \
  --vault-name myKeyVault \
  --name db-password \
  --value "P@ssw0rd123!"

az keyvault secret show \
  --vault-name myKeyVault \
  --name db-password
```

## Google Cloud KMS

**Features**:
- Global, regional, and multi-regional keys
- Automatic or manual rotation
- Cloud HSM support
- External Key Manager (EKM)

**Key Management**:
```bash
# Create key ring
gcloud kms keyrings create my-keyring \
  --location us-east1

# Create key
gcloud kms keys create my-key \
  --keyring my-keyring \
  --location us-east1 \
  --purpose encryption

# Encrypt data
gcloud kms encrypt \
  --key my-key \
  --keyring my-keyring \
  --location us-east1 \
  --plaintext-file data.txt \
  --ciphertext-file data.enc
```

## Hardware Security Modules (HSM)

**What is HSM?**:
- Physical device for key management
- FIPS 140-2 Level 3 certified
- Tamper-resistant
- High security for sensitive keys

**Cloud HSM Options**:
- **AWS CloudHSM**: Dedicated HSM
- **Azure Dedicated HSM**: Single-tenant
- **Google Cloud HSM**: Fully-managed

## Key Rotation

**Why Rotate?**:
- Limit key exposure
- Compliance requirements
- Reduce impact of compromise
- Security best practice

**Automatic Rotation**:
- New key version created
- Old versions remain for decryption
- Transparent to applications

**Manual Rotation**:
- Create new key
- Re-encrypt data
- Retire old key
- More control, more work

## Best Practices

**Key Management**:
- Separate keys by environment
- Use different keys for different purposes
- Implement least privilege for key access
- Enable automatic rotation
- Regular key audits

**Access Control**:
- Restrict who can use keys
- Restrict who can manage keys
- Use IAM policies effectively
- Separate duties

**Monitoring**:
- Enable logging (CloudTrail, etc.)
- Monitor key usage
- Alert on unusual patterns
- Regular access reviews

**Compliance**:
- Use HSM for sensitive data
- Document key management procedures
- Implement key lifecycle policies
- Regular compliance audits

**Disaster Recovery**:
- Backup keys securely
- Test key recovery
- Document recovery procedures
- Multi-region key replication

## Common Use Cases

- Encrypt S3 buckets
- Encrypt EBS volumes
- Database encryption
- Application secrets
- Certificate management
- Digital signatures
- Code signing

Proper key management is crucial for maintaining the security of encrypted data.
