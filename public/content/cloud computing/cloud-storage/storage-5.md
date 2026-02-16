---
id: storage-5
title: "Google Cloud Storage"
type: text
---

# Google Cloud Storage

Google Cloud Storage (GCS) is GCP's unified object storage service for any amount of data with high availability.

## Storage Classes

**Standard**: Frequently accessed data
- Best for "hot" data
- No minimum storage duration

**Nearline**: Once per month access
- 30-day minimum storage
- Lower cost than Standard

**Coldline**: Once per quarter access
- 90-day minimum storage
- Archival with faster access than Archive

**Archive**: Once per year access
- 365-day minimum storage
- Lowest cost option

## Key Features

**Uniform Bucket Access**: Simplified permissions
**Object Lifecycle Management**: Automatic transitions
**Object Versioning**: Maintain history
**Retention Policies**: Compliance requirements
**Requester Pays**: Charge usage to requester

## Locations

**Multi-Region**: Highest availability (US, EU, ASIA)
**Dual-Region**: Specific region pairs
**Region**: Single region, lower cost

## GCS Operations

```bash
# Create bucket
gsutil mb gs://my-bucket

# Upload file
gsutil cp myfile.txt gs://my-bucket/

# Download file
gsutil cp gs://my-bucket/myfile.txt ./

# Sync directory
gsutil rsync -r ./local-dir gs://my-bucket/dir

# Change storage class
gsutil rewrite -s NEARLINE gs://my-bucket/object
```

## Integration

- BigQuery for analytics
- Cloud Functions for processing
- Cloud CDN for content delivery
- Cloud Pub/Sub for notifications

GCS offers strong consistency and global edge caching for optimal performance.
