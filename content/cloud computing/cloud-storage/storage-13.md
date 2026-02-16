---
id: storage-13
title: "Google Filestore"
type: text
---

# Google Filestore

Google Filestore provides fully managed NFS file storage for applications requiring a file system interface.

## Filestore Tiers

**Basic HDD**:
- Cost-effective
- 1-63.9 TiB capacity
- Up to 180 MB/s throughput
- General-purpose workloads

**Basic SSD**:
- Better performance
- 2.5-63.9 TiB capacity
- Up to 1,200 MB/s throughput
- Performance-sensitive applications

**High Scale SSD**:
- High performance and scale
- 10-100 TiB capacity
- Up to 1,200 MB/s per TiB
- Demanding workloads

**Enterprise**:
- Mission-critical applications
- 1-10 TiB capacity
- 99.99% availability SLA
- Regional replication

**Zonal**:
- Single zone deployment
- Lower cost
- 1-10 TiB capacity

## Key Features

**NFSv3 Support**: Standard NFS protocol
**Active Directory**: Integration for authentication
**Backups**: Automated and on-demand
**Snapshots**: Point-in-time copies
**Multi-Share**: Multiple shares per instance

## Creating Filestore

```bash
# Create instance
gcloud filestore instances create my-filestore \
  --tier=BASIC_HDD \
  --file-share=name=myshare,capacity=1TB \
  --network=name=default \
  --zone=us-central1-a

# Mount on GCE/GKE
sudo mount 10.0.0.2:/myshare /mnt/filestore
```

## GKE Integration

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: filestore-pv
spec:
  capacity:
    storage: 1Ti
  accessModes:
  - ReadWriteMany
  nfs:
    path: /myshare
    server: 10.0.0.2
```

Filestore is ideal for applications migrating from on-premises NFS storage.
