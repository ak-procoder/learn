---
id: storage-3
title: "Amazon S3 (Simple Storage Service)"
type: text
---

# Amazon S3 (Simple Storage Service)

Amazon S3 is AWS's object storage service, offering industry-leading scalability, availability, and performance.

## S3 Basics

**Buckets**: Top-level containers (globally unique names)
**Objects**: Files stored in buckets (up to 5TB)
**Keys**: Object identifiers (like file paths)
**Regions**: Geographic location for data

## Storage Classes

**S3 Standard**: Frequently accessed data
**S3 Intelligent-Tiering**: Automatic cost optimization
**S3 Standard-IA**: Infrequent access
**S3 One Zone-IA**: Single AZ, infrequent access
**S3 Glacier Instant Retrieval**: Archive with instant access
**S3 Glacier Flexible Retrieval**: Archive, minutes to hours
**S3 Glacier Deep Archive**: Lowest cost, 12-hour retrieval

## Key Features

**Versioning**: Keep multiple versions
**Replication**: Cross-region or same-region
**Encryption**: Server-side or client-side
**Access Control**: IAM, bucket policies, ACLs
**Event Notifications**: Trigger Lambda, SQS, SNS

## Common Operations

```bash
# Upload file
aws s3 cp myfile.txt s3://my-bucket/

# Download file
aws s3 cp s3://my-bucket/myfile.txt ./

# Sync directory
aws s3 sync ./local-dir s3://my-bucket/

# List objects
aws s3 ls s3://my-bucket/
```

## Use Cases

- Website hosting
- Data lakes
- Backup and restore
- Content distribution
- Big data analytics

S3 is one of the most widely used cloud services globally.
