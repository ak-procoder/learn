---
id: provider-15
title: Azure Storage Services
type: text
---

# Azure Storage Services

Azure Storage provides highly available, secure, durable, scalable, and redundant storage solutions. It offers multiple storage services to handle different data types and access patterns.

## Azure Storage Account

A storage account provides a unique namespace for your Azure Storage data that's accessible from anywhere via HTTP or HTTPS.

### Storage Account Types

| Type | Supported Services | Use Case |
|------|-------------------|----------|
| Standard General-purpose v2 | Blob, Queue, Table, Files | Most scenarios |
| Premium Block blobs | Block blobs only | High transaction rates |
| Premium File shares | Files only | Enterprise file shares |
| Premium Page blobs | Page blobs only | Premium VM disks |

### Performance Tiers

**Standard**
- HDD-backed storage
- Cost-effective
- Good for bulk storage

**Premium**
- SSD-backed storage
- Low latency
- High throughput
- Better for databases, VMs

### Replication Options

**Locally Redundant Storage (LRS)**
- 11 nines (99.999999999%) durability
- 3 copies within single datacenter
- Lowest cost
- Protection against disk/rack failures

**Zone-Redundant Storage (ZRS)**
- 12 nines durability
- 3 copies across availability zones
- Protection against datacenter failures
- Available in select regions

**Geo-Redundant Storage (GRS)**
- 16 nines durability
- 6 copies (3 local + 3 in secondary region)
- Protection against regional disasters
- Read access to secondary (RA-GRS)

**Geo-Zone-Redundant Storage (GZRS)**
- ZRS + GRS combined
- Highest durability and availability
- Read access to secondary (RA-GZRS)

```plaintext
Replication Comparison:

LRS:  ███ (single zone)
ZRS:  ███ ███ ███ (3 zones)
GRS:  ███ (primary region) → ███ (secondary region)
GZRS: ███ ███ ███ (primary) → ███ (secondary)
```

## Azure Blob Storage

Object storage for unstructured data (images, videos, documents, backups).

### Blob Types

**Block Blobs**
- Optimized for uploading large amounts of data
- Up to 190.7 TiB
- Ideal for images, videos, documents
- Supports parallel upload

**Append Blobs**
- Optimized for append operations
- Logging scenarios
- Up to 195 GiB

**Page Blobs**
- Optimized for random read/write
- Azure VM disks
- Up to 8 TiB

### Access Tiers

**Hot**
- Frequently accessed data
- Highest storage cost
- Lowest access cost
- Online access

**Cool**
- Infrequently accessed (minimum 30 days)
- Lower storage cost
- Higher access cost
- Online access

**Archive**
- Rarely accessed (minimum 180 days)
- Lowest storage cost
- Highest access cost
- Offline (hours to retrieve)

### Blob Storage Pricing Example

```plaintext
Hot Tier (per GB/month): $0.0184
Cool Tier (per GB/month): $0.0100
Archive Tier (per GB/month): $0.00099

1 TB for 1 month:
Hot: 1024 × $0.0184 = $18.84
Cool: 1024 × $0.0100 = $10.24
Archive: 1024 × $0.00099 = $1.01
```

### Lifecycle Management

```json
{
  "rules": [
    {
      "name": "moveToCool",
      "enabled": true,
      "type": "Lifecycle",
      "definition": {
        "filters": {
          "blobTypes": ["blockBlob"],
          "prefixMatch": ["logs/"]
        },
        "actions": {
          "baseBlob": {
            "tierToCool": {
              "daysAfterModificationGreaterThan": 30
            },
            "tierToArchive": {
              "daysAfterModificationGreaterThan": 90
            },
            "delete": {
              "daysAfterModificationGreaterThan": 365
            }
          }
        }
      }
    }
  ]
}
```

### Blob Storage Operations

```python
from azure.storage.blob import BlobServiceClient

# Connect to storage account
connection_string = "DefaultEndpointsProtocol=https;AccountName=..."
blob_service_client = BlobServiceClient.from_connection_string(connection_string)

# Create container
container_client = blob_service_client.create_container("mycontainer")

# Upload blob
blob_client = blob_service_client.get_blob_client(
    container="mycontainer",
    blob="myfile.txt"
)
with open("local_file.txt", "rb") as data:
    blob_client.upload_blob(data)

# Download blob
with open("downloaded_file.txt", "wb") as download_file:
    download_file.write(blob_client.download_blob().readall())

# List blobs
container_client = blob_service_client.get_container_client("mycontainer")
blob_list = container_client.list_blobs()
for blob in blob_list:
    print(f"Name: {blob.name}")
```

## Azure Files

Fully managed file shares in the cloud accessible via SMB and NFS protocols.

### Features

- **SMB 3.0 and 2.1 support**
- **NFS 4.1 support** (preview)
- **Cloud and on-premises access**
- **Lift-and-shift applications**
- **Shared application data**
- **Diagnostic logs and metrics**

### Performance Tiers

**Standard (HDD-backed)**
- Cost-effective
- General-purpose file shares
- Transaction-based pricing

**Premium (SSD-backed)**
- High-performance, low-latency
- Provisioned capacity
- IO-intensive workloads

### Azure File Sync

Sync on-premises file servers with Azure Files.

```plaintext
On-Premises File Server
         ↕ (sync)
    Azure File Sync
         ↕
    Azure Files
         ↕
   Other Servers (cached)
```

**Benefits:**
- Centralized file services in Azure
- Multi-site access and sync
- Cloud tiering for rarely used files
- Backup and disaster recovery

### Creating File Share

```bash
# Create storage account
az storage account create \
  --name mystorageaccount \
  --resource-group myResourceGroup \
  --location eastus \
  --sku Standard_LRS

# Create file share
az storage share create \
  --name myfileshare \
  --account-name mystorageaccount \
  --quota 100

# Mount on Windows
net use Z: \\mystorageaccount.file.core.windows.net\myfileshare /u:AZURE\mystorageaccount <storage-key>

# Mount on Linux
sudo mount -t cifs //mystorageaccount.file.core.windows.net/myfileshare /mnt/myfileshare -o vers=3.0,username=mystorageaccount,password=<storage-key>,dir_mode=0777,file_mode=0777
```

## Azure Queue Storage

Message queuing for asynchronous communication between application components.

### Features

- Store millions of messages
- Each message up to 64 KB
- Access via HTTP/HTTPS
- Time-to-live for messages
- FIFO within best effort

### Use Cases

- Decouple application components
- Load leveling
- Asynchronous processing
- Task queues

```python
from azure.storage.queue import QueueClient

# Create queue
queue_client = QueueClient.from_connection_string(
    connection_string,
    queue_name="myqueue"
)
queue_client.create_queue()

# Send message
queue_client.send_message("Hello, Queue!")

# Receive messages
messages = queue_client.receive_messages(messages_per_page=10)
for message in messages:
    print(message.content)
    queue_client.delete_message(message)
```

## Azure Table Storage

NoSQL key-value store for semi-structured data.

### Features

- Schema-less design
- Automatic indexing
- OData queries
- Up to 500 TB per account
- Fast queries on partition and row keys

### Data Structure

```plaintext
Table: Customers
┌──────────────┬────────┬──────┬───────┬────────┐
│ PartitionKey │ RowKey │ Name │ Email │ Phone  │
├──────────────┼────────┼──────┼───────┼────────┤
│ USA          │ 001    │ John │ ...   │ ...    │
│ USA          │ 002    │ Jane │ ...   │ ...    │
│ UK           │ 001    │ Bob  │ ...   │ ...    │
└──────────────┴────────┴──────┴───────┴────────┘

PartitionKey: Logical grouping (determines physical distribution)
RowKey: Unique within partition
```

```python
from azure.data.tables import TableServiceClient

# Create table
table_service_client = TableServiceClient.from_connection_string(connection_string)
table_client = table_service_client.create_table_if_not_exists("Customers")

# Insert entity
entity = {
    'PartitionKey': 'USA',
    'RowKey': '001',
    'Name': 'John Doe',
    'Email': 'john@example.com'
}
table_client.create_entity(entity)

# Query entities
entities = table_client.query_entities("PartitionKey eq 'USA'")
for entity in entities:
    print(entity['Name'])
```

## Azure Disk Storage

Block-level storage volumes for Azure VMs.

### Managed Disks

**Advantages:**
- No storage account management
- High availability (99.999%)
- Role-based access control
- Snapshots and images
- Encryption at rest

**Disk Types:**
- **Ultra Disk**: Sub-ms latency, up to 160,000 IOPS
- **Premium SSD**: Production workloads, up to 20,000 IOPS
- **Standard SSD**: Web servers, dev/test, up to 6,000 IOPS
- **Standard HDD**: Backup, non-critical, up to 500 IOPS

### Disk Encryption

**Azure Disk Encryption (ADE)**
- BitLocker for Windows
- DM-Crypt for Linux
- Integrates with Azure Key Vault

**Encryption at Host**
- End-to-end encryption
- Includes temporary disk and cache
- No performance impact

## Azure Data Lake Storage Gen2

Optimized for big data analytics.

### Features

- Hierarchical namespace
- Hadoop compatible
- Fine-grained access control
- Massive scale (exabytes)
- Azure Blob Storage features

### Comparison: Blob vs Data Lake

| Feature | Blob Storage | Data Lake Gen2 |
|---------|--------------|----------------|
| Namespace | Flat | Hierarchical |
| Directory operations | Emulated | Native |
| ACLs | Container level | File/directory level |
| Hadoop | Via WASB | Native ABFS |
| Analytics | Good | Optimized |

## Azure Storage Security

### Authentication Methods

**Shared Key**
- Storage account keys
- Full access to account
- Not recommended for applications

**Shared Access Signatures (SAS)**
```plaintext
SAS Types:
1. Account SAS: Multiple services
2. Service SAS: Single service
3. User delegation SAS: Azure AD credentials

Permissions: Read, Write, Delete, List, Add, Create
Expiration: Time-bound access
IP restrictions: Allowed IP ranges
```

**Azure Active Directory (Azure AD)**
- Role-based access control
- Managed identities
- Recommended method

### Encryption

**Encryption at Rest**
- Automatic for all data
- Microsoft-managed keys (default)
- Customer-managed keys (Azure Key Vault)

**Encryption in Transit**
- HTTPS/TLS
- SMB 3.0 encryption (Azure Files)
- Require secure transfer option

### Network Security

**Firewalls and Virtual Networks**
- Restrict access to specific networks
- Service endpoints
- Private endpoints

```bash
# Configure firewall
az storage account update \
  --name mystorageaccount \
  --resource-group myResourceGroup \
  --default-action Deny

az storage account network-rule add \
  --account-name mystorageaccount \
  --resource-group myResourceGroup \
  --ip-address 203.0.113.0/24
```

## Best Practices

1. **Choose the right redundancy**: Match to availability requirements
2. **Use lifecycle management**: Automate tier transitions
3. **Enable soft delete**: Protection against accidental deletion
4. **Versioning**: Track blob changes
5. **Use Azure AD**: Preferred authentication method
6. **Network security**: Private endpoints for sensitive data
7. **Monitor and alert**: Azure Monitor integration
8. **Optimize costs**: Right-tier for access patterns
9. **Backup critical data**: Azure Backup integration
10. **Tag resources**: Cost tracking and organization

Azure Storage provides flexible, secure, and highly available storage solutions for diverse data types and access patterns, from low-cost archive storage to high-performance premium disks.
