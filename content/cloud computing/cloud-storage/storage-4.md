---
id: storage-4
title: "Azure Blob Storage"
type: text
---

# Azure Blob Storage

Azure Blob Storage is Microsoft's object storage solution for the cloud, optimized for storing massive amounts of unstructured data.

## Blob Types

**Block Blobs**: Text and binary data (up to 190.7 TiB)
- Ideal for documents, images, videos
- Upload in blocks

**Append Blobs**: Optimized for append operations
- Perfect for logging scenarios
- Cannot modify existing data

**Page Blobs**: Random access files (up to 8 TiB)
- Virtual hard disks for VMs
- Database files

## Access Tiers

**Hot**: Frequently accessed data
- Highest storage cost
- Lowest access cost

**Cool**: Infrequently accessed (30+ days)
- Lower storage cost
- Higher access cost
- Minimum 30-day retention

**Archive**: Rarely accessed (180+ days)
- Lowest storage cost
- Highest access cost and rehydration time
- Minimum 180-day retention

## Storage Account Types

**General-purpose v2**: Recommended for most scenarios
**Premium Block Blobs**: High transaction rates
**Premium Page Blobs**: For VMs and disks

## Key Features

```bash
# Azure CLI examples
az storage container create --name mycontainer

az storage blob upload \
  --container-name mycontainer \
  --name myblob \
  --file myfile.txt

az storage blob download \
  --container-name mycontainer \
  --name myblob \
  --file downloaded.txt
```

Security features include encryption at rest, Azure AD integration, and shared access signatures (SAS).
