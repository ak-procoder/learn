---
id: storage-8
title: "Azure Managed Disks"
type: text
---

# Azure Managed Disks

Azure Managed Disks provide durable, high-performance block storage for Azure Virtual Machines.

## Disk Types

**Ultra Disk**:
- Highest performance
- Sub-millisecond latency
- Up to 160,000 IOPS
- Mission-critical workloads

**Premium SSD v2**:
- Next-gen premium storage
- Customizable performance
- Cost-effective for varying workloads

**Premium SSD**:
- Production workloads
- Consistent low latency
- Up to 20,000 IOPS

**Standard SSD**:
- Lower-cost SSD
- Dev/test environments
- Web servers

**Standard HDD**:
- Lowest cost
- Infrequent access
- Backup scenarios

## Managed vs Unmanaged

**Managed Disks** (Recommended):
- Azure manages storage accounts
- Better availability and scalability
- Easier backup and disaster recovery
- No storage account limits

**Unmanaged Disks** (Legacy):
- Manual storage account management
- More complex
- Being phased out

## Key Features

**Disk Snapshots**: Point-in-time copies
**Shared Disks**: Attach to multiple VMs
**Bursting**: Temporary performance boost
**Encryption**: Azure Disk Encryption (ADE)
**Availability Zones**: Zone-redundant storage

## Performance Tiers

Adjust performance without changing disk size:
```bash
az disk update --resource-group myRG \
  --name myDisk \
  --set tier=P50
```

Azure Managed Disks simplify storage management while providing enterprise-grade performance.
