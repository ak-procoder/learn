---
id: storage-12
title: "Azure Files and NetApp Files"
type: text
---

# Azure Files and NetApp Files

Azure provides multiple file storage options for different use cases and performance requirements.

## Azure Files

Fully managed file shares in the cloud using SMB and NFS protocols.

**Features**:
- SMB 3.0 and NFS 4.1 support
- Access from Windows, Linux, macOS
- Integration with Active Directory
- Snapshots for backup and recovery
- Up to 100 TiB per share

**Tiers**:
- **Premium**: SSD-backed, low latency
- **Transaction Optimized**: Balanced (default)
- **Hot**: Frequently accessed
- **Cool**: Cost-effective for infrequent access

**Usage**:
```bash
# Mount on Windows
net use Z: \\mystorageaccount.file.core.windows.net\myshare

# Mount on Linux
sudo mount -t cifs //mystorageaccount.file.core.windows.net/myshare /mnt/myshare
```

## Azure NetApp Files

Enterprise-grade file storage powered by NetApp.

**Features**:
- Extreme performance (up to 4.5 GiB/s per volume)
- Sub-millisecond latency
- Multi-protocol support (NFS, SMB)
- Snapshots and cloning
- Cross-region replication

**Service Levels**:
- **Standard**: 16 MiB/s per TiB
- **Premium**: 64 MiB/s per TiB
- **Ultra**: 128 MiB/s per TiB

**Use Cases**:
- SAP HANA
- High-performance computing
- Media rendering
- Database workloads
- Enterprise applications

Choose Azure Files for general use and Azure NetApp Files for enterprise, high-performance requirements.
