---
id: security-11
title: "Encryption at Rest"
type: text
---

# Encryption at Rest

Encryption at rest protects stored data from unauthorized access using cryptographic algorithms.

## Why Encrypt at Rest?

**Protection**: Data breaches, physical theft
**Compliance**: HIPAA, PCI DSS, GDPR requirements
**Defense in Depth**: Additional security layer
**Regulatory**: Often legally required

## Encryption Methods

**Server-Side Encryption (SSE)**:
- Cloud provider encrypts data
- Transparent to application
- Automatic key management option

**Client-Side Encryption**:
- Encrypt before uploading
- Full control over encryption
- Manage keys independently

## Key Management Options

**Provider-Managed Keys**:
- Simplest option
- Provider handles everything
- No key management burden
- Less control

**Customer-Managed Keys**:
- Create and manage keys
- Use provider's key management service
- Rotation and policies
- More control

**Customer-Provided Keys**:
- Bring your own key (BYOK)
- Maximum control
- Key never leaves your control
- Most complex

## AWS Encryption at Rest

**S3 Encryption**:
- SSE-S3: AWS-managed keys
- SSE-KMS: AWS KMS keys
- SSE-C: Customer-provided keys
- Client-side encryption

**EBS Encryption**:
```bash
aws ec2 create-volume \
  --size 100 \
  --encrypted \
  --kms-key-id arn:aws:kms:us-east-1:123456789012:key/abcd1234
```

**RDS Encryption**:
- Encrypt database instances
- Automated backups encrypted
- Read replicas encrypted
- Transparent Data Encryption (TDE)

## Azure Encryption

**Storage Service Encryption**:
- Enabled by default
- AES-256 encryption
- Customer-managed keys supported

**Azure Disk Encryption**:
- BitLocker (Windows)
- DM-Crypt (Linux)
- Integrates with Key Vault

**SQL Transparent Data Encryption**:
- Database, backups, logs
- Encryption/decryption on-the-fly

## Google Cloud Encryption

**Default Encryption**:
- All data encrypted at rest
- Google-managed keys
- No configuration needed

**Customer-Managed Encryption Keys (CMEK)**:
```bash
gcloud compute disks create my-disk \
  --kms-key projects/my-project/locations/us/keyRings/my-ring/cryptoKeys/my-key
```

**Customer-Supplied Encryption Keys (CSEK)**:
- Provide key with each request
- Key not stored by Google

## Encryption Algorithms

**AES (Advanced Encryption Standard)**:
- AES-256: Industry standard
- FIPS 140-2 compliant
- Used by all major providers

**Algorithm Strength**:
- AES-128: Good
- AES-256: Better (recommended)

## Key Rotation

**Automatic Rotation**:
- KMS handles rotation
- New key for new data
- Old keys for old data

**Manual Rotation**:
- Create new key version
- Re-encrypt data
- More control, more work

## Best Practices

- Encrypt all sensitive data
- Use strong algorithms (AES-256)
- Implement key rotation
- Separate key management from data
- Use hardware security modules (HSM)
- Audit key usage
- Test disaster recovery with encrypted data
- Document key management procedures

## Performance Considerations

- Minimal overhead with modern hardware
- AES-NI CPU instruction support
- Consider caching for frequently accessed data
- Test performance impact

Encryption at rest is a fundamental security control that should be enabled for all sensitive data.
