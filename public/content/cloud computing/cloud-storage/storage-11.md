---
id: storage-11
title: "Amazon EFS (Elastic File System)"
type: text
---

# Amazon EFS (Elastic File System)

Amazon EFS provides serverless, elastic file storage that automatically grows and shrinks as files are added or removed.

## EFS Features

**Elastic**: Automatically scales to petabytes
**Serverless**: No provisioning or management
**Shared**: Concurrent access from thousands of instances
**Regional**: Available across multiple AZs
**POSIX-compliant**: Standard file system semantics

## Storage Classes

**EFS Standard**: Frequently accessed files
**EFS Infrequent Access (IA)**: Lower-cost for infrequent access
**Lifecycle Management**: Automatic tiering to IA

## Performance Modes

**General Purpose**: Low latency (default)
- Web serving, content management
- Up to 35,000 IOPS

**Max I/O**: Higher aggregate throughput
- Big data, media processing
- Higher latency

## Throughput Modes

**Bursting**: Scales with file system size
**Provisioned**: Fixed throughput regardless of size
**Elastic**: Automatically scales throughput

## Creating and Using EFS

```bash
# Create file system
aws efs create-file-system \
  --performance-mode generalPurpose \
  --throughput-mode elastic

# Mount on EC2/ECS
sudo mount -t efs fs-12345678:/ /mnt/efs

# Add to /etc/fstab
fs-12345678:/ /mnt/efs efs defaults,_netdev 0 0
```

## Use Cases

- Container storage for ECS/EKS
- Content management systems
- Web serving environments
- Data analytics
- Machine learning training data
- Home directories

EFS provides simple, scalable file storage for AWS compute services.
