---
id: storage-9
title: "Google Persistent Disks"
type: text
---

# Google Persistent Disks

Google Persistent Disks provide durable, high-performance block storage for Compute Engine VMs.

## Disk Types

**Persistent Disk SSD (pd-ssd)**:
- High performance
- Low latency
- Up to 100,000 IOPS (read)
- Databases and applications

**Balanced Persistent Disk (pd-balanced)**:
- Cost-effective performance
- Good balance of price and performance
- Recommended for most workloads

**Persistent Disk HDD (pd-standard)**:
- Throughput-oriented
- Lower cost
- Batch processing, sequential I/O

**Extreme Persistent Disk (pd-extreme)**:
- Highest performance
- Consistent IOPS and throughput
- Mission-critical applications

## Key Features

**Automatic Encryption**: Always encrypted at rest
**Snapshots**: Incremental backups
**Resize**: Increase size without downtime
**Multi-Zone**: Regional persistent disks
**Machine Images**: Full VM backup with disks

## Regional Persistent Disks

Replicate data between zones:
- Higher availability
- Synchronous replication
- Automatic failover
- Higher cost

## Hyperdisk

Next-generation storage:
- Extreme performance
- Flexible provisioning
- Independent IOPS and throughput
- Advanced workloads

## Operations

```bash
# Create disk
gcloud compute disks create my-disk \
  --size=100GB \
  --type=pd-balanced \
  --zone=us-central1-a

# Attach disk
gcloud compute instances attach-disk my-instance \
  --disk=my-disk \
  --zone=us-central1-a

# Create snapshot
gcloud compute disks snapshot my-disk \
  --snapshot-names=my-snapshot
```

Persistent Disks offer reliable, flexible block storage for GCP workloads.
