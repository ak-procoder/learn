---
id: storage-6
title: "Block Storage Fundamentals"
type: text
---

# Block Storage Fundamentals

Block storage provides raw storage volumes that can be attached to virtual machines, offering low-latency, high-performance storage.

## What is Block Storage?

Block storage divides data into fixed-size blocks:
- Each block has a unique address
- No metadata or file system at storage level
- Direct access via OS file system
- Similar to physical hard drives

## Characteristics

**Low Latency**: Direct block-level access
**High IOPS**: Suitable for databases
**Formatted**: Must be formatted with file system
**Attached**: Connected to single instance
**Persistent**: Data survives instance termination

## Block vs Object Storage

**Block Storage**:
- Low latency
- Structured data
- Databases, applications
- More expensive
- Limited scalability

**Object Storage**:
- Higher latency
- Unstructured data
- Archives, backups
- Cost-effective
- Unlimited scalability

## Use Cases

**Databases**: MySQL, PostgreSQL, MongoDB
**Transactional Systems**: High IOPS requirements
**Enterprise Applications**: SAP, Oracle
**File Systems**: General-purpose storage
**Boot Volumes**: Operating system disks

## Volume Types

**SSD-backed**: High performance, low latency
**HDD-backed**: Throughput-optimized, cost-effective
**Provisioned IOPS**: Guaranteed performance levels

Block storage is essential for applications requiring consistent, low-latency disk access.
