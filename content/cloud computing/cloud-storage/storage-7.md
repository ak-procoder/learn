---
id: storage-7
title: "Amazon EBS (Elastic Block Store)"
type: text
---

# Amazon EBS (Elastic Block Store)

Amazon EBS provides persistent block storage volumes for use with EC2 instances.

## EBS Volume Types

**General Purpose SSD (gp3/gp2)**:
- Balanced price/performance
- 3,000-16,000 IOPS
- Use for boot volumes, development

**Provisioned IOPS SSD (io2/io1)**:
- High performance
- Up to 64,000 IOPS
- Use for critical databases

**Throughput Optimized HDD (st1)**:
- Low-cost HDD
- Throughput-intensive workloads
- Big data, data warehouses

**Cold HDD (sc1)**:
- Lowest cost
- Infrequently accessed data
- Archive storage

## Key Features

**Snapshots**: Point-in-time backups to S3
**Encryption**: AES-256 encryption at rest
**Multi-Attach**: Share io1/io2 volumes (limited)
**Elastic Volumes**: Modify size, type, IOPS without downtime

## EBS Operations

```bash
# Create volume
aws ec2 create-volume \
  --availability-zone us-east-1a \
  --size 100 \
  --volume-type gp3

# Attach volume
aws ec2 attach-volume \
  --volume-id vol-1234567890abcdef0 \
  --instance-id i-1234567890abcdef0 \
  --device /dev/sdf

# Create snapshot
aws ec2 create-snapshot \
  --volume-id vol-1234567890abcdef0 \
  --description "MySnapshot"
```

## Best Practices

- Use gp3 for most workloads
- Enable encryption by default
- Regular snapshots for backup
- Monitor CloudWatch metrics
- Right-size volumes

EBS provides reliable, high-performance block storage for EC2 instances.
