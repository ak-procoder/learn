---
id: provider-4
title: AWS S3 and Storage Services
type: text
---

# AWS S3 and Storage Services

Amazon Simple Storage Service (S3) is AWS's flagship object storage service, providing industry-leading scalability, data availability, security, and performance. Along with S3, AWS offers a comprehensive suite of storage services for different use cases.

## Amazon S3 Overview

S3 is an object storage service that stores data as objects within buckets. It's designed to deliver 99.999999999% (11 9's) durability and stores data across multiple facilities.

### Key Features
- **Scalability**: Store unlimited amounts of data
- **Durability**: 99.999999999% annual durability
- **Availability**: 99.99% availability SLA
- **Security**: Encryption at rest and in transit
- **Performance**: Thousands of requests per second
- **Cost-Effective**: Pay only for what you use

## S3 Storage Classes

### S3 Standard
- **Use Case**: Frequently accessed data
- **Availability**: 99.99%
- **Min Storage Duration**: None
- **Retrieval Fee**: None

### S3 Intelligent-Tiering
- **Use Case**: Unknown or changing access patterns
- **Feature**: Automatically moves objects between tiers
- **Tiers**: Frequent, Infrequent, Archive Instant, Archive, Deep Archive
- **Monitoring Fee**: Small monthly fee per object

### S3 Standard-IA (Infrequent Access)
- **Use Case**: Long-lived, infrequently accessed data
- **Availability**: 99.9%
- **Min Storage Duration**: 30 days
- **Lower Cost**: 40% less than S3 Standard

### S3 One Zone-IA
- **Use Case**: Recreatable, infrequently accessed data
- **Availability**: 99.5% (single AZ)
- **Cost**: 20% less than Standard-IA

### S3 Glacier Storage Classes

**S3 Glacier Instant Retrieval**
- Millisecond retrieval
- Minimum 90-day storage
- For data accessed once per quarter

**S3 Glacier Flexible Retrieval**
- Minutes to hours retrieval
- Minimum 90-day storage
- Expedited (1-5 minutes), Standard (3-5 hours), Bulk (5-12 hours)

**S3 Glacier Deep Archive**
- Lowest cost storage
- 12-48 hour retrieval
- Minimum 180-day storage
- For long-term archival

## S3 Features

### Versioning
```plaintext
Bucket: my-bucket
├── document.pdf (Version 3) - Current
├── document.pdf (Version 2) - Previous
└── document.pdf (Version 1) - Original
```

- Keeps multiple versions of objects
- Protects against accidental deletion
- Can restore previous versions

### Lifecycle Policies
```json
{
  "Rules": [{
    "Id": "Move to IA after 30 days",
    "Status": "Enabled",
    "Transitions": [{
      "Days": 30,
      "StorageClass": "STANDARD_IA"
    }, {
      "Days": 90,
      "StorageClass": "GLACIER"
    }],
    "Expiration": {
      "Days": 365
    }
  }]
}
```

### Replication
- **Cross-Region Replication (CRR)**: Replicate across regions
- **Same-Region Replication (SRR)**: Replicate within region
- Use cases: Compliance, latency reduction, disaster recovery

### S3 Object Lock
- Write-Once-Read-Many (WORM) model
- Prevents object deletion for specified retention period
- Compliance and governance modes
- Legal hold capability

## Other AWS Storage Services

### Amazon EBS (Elastic Block Store)
- Block-level storage volumes for EC2
- **Types**:
  - **gp3/gp2**: General Purpose SSD (balanced)
  - **io2/io1**: Provisioned IOPS SSD (high performance)
  - **st1**: Throughput Optimized HDD (big data)
  - **sc1**: Cold HDD (infrequent access)
- Snapshots for backup (stored in S3)
- **Use Case**: Database storage, boot volumes

### Amazon EFS (Elastic File System)
- Fully managed NFS file system
- Scalable, elastic capacity
- Concurrent access from multiple EC2 instances
- **Storage Classes**: Standard, Infrequent Access
- **Performance Modes**: General Purpose, Max I/O
- **Use Case**: Shared file storage, content management

### Amazon FSx
**FSx for Windows File Server**
- Fully managed Windows native file system
- SMB protocol support
- Active Directory integration

**FSx for Lustre**
- High-performance file system
- ML, HPC, media processing
- Sub-millisecond latencies

**FSx for NetApp ONTAP**
- Enterprise storage features
- Multi-protocol support (NFS, SMB, iSCSI)

**FSx for OpenZFS**
- Cost-effective, high-performance storage
- Point-in-time snapshots

### AWS Storage Gateway
- Hybrid cloud storage service
- Connects on-premises applications to cloud storage
- **Types**:
  - **File Gateway**: NFS/SMB interface to S3
  - **Volume Gateway**: iSCSI block storage
  - **Tape Gateway**: Virtual tape library

### AWS Backup
- Centralized backup service
- Automate backup schedules
- Supports EC2, EBS, S3, RDS, DynamoDB, EFS, and more
- Cross-region and cross-account backups

## S3 Security

### Encryption
- **Server-Side Encryption (SSE)**:
  - SSE-S3: AWS managed keys
  - SSE-KMS: AWS KMS managed keys
  - SSE-C: Customer-provided keys
- **Client-Side Encryption**: Encrypt before upload

### Access Control
- **Bucket Policies**: JSON-based access policies
- **IAM Policies**: User/role-based permissions
- **Access Control Lists (ACLs)**: Legacy method
- **S3 Block Public Access**: Prevent public access

### Monitoring and Logging
- **S3 Access Logs**: Detailed record of requests
- **AWS CloudTrail**: API call logging
- **S3 Inventory**: List of objects and metadata

## Best Practices

1. **Use Appropriate Storage Class**: Match class to access patterns
2. **Enable Versioning**: Protect critical data
3. **Implement Lifecycle Policies**: Automate tiering and deletion
4. **Encrypt Data**: Enable encryption by default
5. **Use Bucket Policies**: Control access granularly
6. **Monitor Costs**: Use S3 Storage Class Analysis
7. **Enable MFA Delete**: Extra protection for critical buckets
8. **Tag Resources**: Organize and track costs
9. **Use S3 Transfer Acceleration**: Faster uploads from distant locations
10. **Regular Security Audits**: Review permissions and access patterns

AWS S3 and its ecosystem of storage services provide comprehensive solutions for virtually any storage need, from frequently accessed web content to long-term archival data.
