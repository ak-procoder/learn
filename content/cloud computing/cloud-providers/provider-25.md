---
id: provider-25
title: Google Cloud Platform - Storage Services
type: text
---

# Google Cloud Platform - Storage Services

GCP offers diverse storage solutions for different data types and access patterns, from object storage to high-performance block storage and managed file systems.

## Cloud Storage (Object Storage)

GCP's object storage service similar to AWS S3 and Azure Blob Storage.

### Storage Classes

| Class | Availability | Min Storage | Use Case | Price/GB/month |
|-------|--------------|-------------|----------|----------------|
| **Standard** | >99.99% | None | Hot data, frequently accessed | $0.020-0.023 |
| **Nearline** | 99.9% | 30 days | Backups, accessed monthly | $0.010 |
| **Coldline** | 99.9% | 90 days | Disaster recovery, accessed quarterly | $0.004 |
| **Archive** | 99.9% | 365 days | Long-term archival, rarely accessed | $0.0012 |

**Autoclass:**
Automatically moves objects to appropriate storage class based on access patterns.

### Bucket Operations

**Create and Configure Bucket:**

```bash
# Create bucket
gsutil mb -c STANDARD -l US gs://my-bucket

# Create multi-region bucket with versioning
gsutil mb -c STANDARD -l US gs://my-versioned-bucket
gsutil versioning set on gs://my-versioned-bucket

# Set lifecycle policy
cat > lifecycle.json << EOF
{
  "lifecycle": {
    "rule": [
      {
        "action": {"type": "SetStorageClass", "storageClass": "NEARLINE"},
        "condition": {"age": 30, "matchesStorageClass": ["STANDARD"]}
      },
      {
        "action": {"type": "SetStorageClass", "storageClass": "COLDLINE"},
        "condition": {"age": 90, "matchesStorageClass": ["NEARLINE"]}
      },
      {
        "action": {"type": "Delete"},
        "condition": {"age": 365, "isLive": false}
      }
    ]
  }
}
EOF

gsutil lifecycle set lifecycle.json gs://my-bucket

# Enable autoclass
gsutil autoclass set on gs://my-bucket
```

### Object Operations

```bash
# Upload file
gsutil cp file.txt gs://my-bucket/
gsutil cp -r folder/ gs://my-bucket/

# Upload with metadata
gsutil -h "Content-Type:application/json" \
       -h "Cache-Control:public, max-age=3600" \
       cp data.json gs://my-bucket/

# Download file
gsutil cp gs://my-bucket/file.txt .

# List objects
gsutil ls gs://my-bucket/
gsutil ls -l -h gs://my-bucket/**

# Delete object
gsutil rm gs://my-bucket/file.txt

# Make object public
gsutil acl ch -u AllUsers:R gs://my-bucket/public-file.txt

# Sync directories
gsutil rsync -r local_dir/ gs://my-bucket/remote_dir/
```

### Python Client Library

```python
from google.cloud import storage

def upload_blob(bucket_name, source_file, destination_blob):
    """Upload file to Cloud Storage."""
    client = storage.Client()
    bucket = client.bucket(bucket_name)
    blob = bucket.blob(destination_blob)
    
    # Upload with metadata
    blob.metadata = {
        'uploaded-by': 'python-script',
        'environment': 'production'
    }
    blob.upload_from_filename(source_file)
    
    print(f"File {source_file} uploaded to {destination_blob}")

def download_blob(bucket_name, source_blob, destination_file):
    """Download file from Cloud Storage."""
    client = storage.Client()
    bucket = client.bucket(bucket_name)
    blob = bucket.blob(source_blob)
    blob.download_to_filename(destination_file)
    
    print(f"Downloaded {source_blob} to {destination_file}")

def list_blobs(bucket_name, prefix=None):
    """List objects in bucket."""
    client = storage.Client()
    blobs = client.list_blobs(bucket_name, prefix=prefix)
    
    for blob in blobs:
        print(f"{blob.name} - {blob.size} bytes - {blob.time_created}")

def set_blob_storage_class(bucket_name, blob_name, storage_class):
    """Change object storage class."""
    client = storage.Client()
    bucket = client.bucket(bucket_name)
    blob = bucket.blob(blob_name)
    
    blob.update_storage_class(storage_class)
    print(f"Updated {blob_name} to {storage_class}")

# Usage
upload_blob("my-bucket", "local-file.txt", "remote-file.txt")
download_blob("my-bucket", "remote-file.txt", "downloaded-file.txt")
list_blobs("my-bucket", prefix="logs/")
set_blob_storage_class("my-bucket", "old-data.csv", "NEARLINE")
```

### Signed URLs

Generate temporary access URLs:

```python
from google.cloud import storage
from datetime import timedelta

def generate_signed_url(bucket_name, blob_name):
    """Generate signed URL for temporary access."""
    client = storage.Client()
    bucket = client.bucket(bucket_name)
    blob = bucket.blob(blob_name)
    
    # URL valid for 1 hour
    url = blob.generate_signed_url(
        version="v4",
        expiration=timedelta(hours=1),
        method="GET"
    )
    
    return url

# Upload signed URL (valid for 15 minutes)
def generate_upload_signed_url(bucket_name, blob_name):
    """Generate signed URL for uploading."""
    client = storage.Client()
    bucket = client.bucket(bucket_name)
    blob = bucket.blob(blob_name)
    
    url = blob.generate_signed_url(
        version="v4",
        expiration=timedelta(minutes=15),
        method="PUT",
        content_type="application/octet-stream"
    )
    
    return url
```

### Advanced Features

**Object Holds and Retention:**

```bash
# Set retention policy (3 years)
gsutil retention set 3y gs://my-bucket

# Lock retention policy (irreversible)
gsutil retention lock gs://my-bucket

# Event-based hold
gsutil retention event-default set gs://my-bucket
gsutil retention event gs://my-bucket/file.txt
```

**Customer-Managed Encryption Keys (CMEK):**

```bash
# Create encryption key in Cloud KMS
gcloud kms keyrings create my-keyring --location us

gcloud kms keys create my-key \
  --location us \
  --keyring my-keyring \
  --purpose encryption

# Upload with CMEK
gsutil -o "GSUtil:encryption_key=projects/PROJECT/locations/us/keyRings/my-keyring/cryptoKeys/my-key" \
  cp encrypted-file.txt gs://my-bucket/
```

**Requester Pays:**

```bash
# Enable requester pays
gsutil requesterpays set on gs://my-bucket

# Access with billing project
gsutil -u billing-project ls gs://requester-pays-bucket
```

## Persistent Disk

Block storage for Compute Engine VMs.

### Disk Types

| Type | Performance | Use Case | Price/GB/month |
|------|-------------|----------|----------------|
| **Standard (pd-standard)** | Sequential: 120 MB/s read, 90 MB/s write | Batch processing, dev | $0.040 |
| **Balanced (pd-balanced)** | Sequential: 240 MB/s, IOPS: 6000 | General purpose | $0.100 |
| **SSD (pd-ssd)** | Sequential: 1200 MB/s, IOPS: 100,000 | High-performance databases | $0.170 |
| **Extreme (pd-extreme)** | Customizable IOPS up to 120,000 | Mission-critical apps | $0.125 + IOPS |

### Managing Persistent Disks

```bash
# Create disk
gcloud compute disks create my-disk \
  --size 100GB \
  --type pd-balanced \
  --zone us-central1-a

# Create snapshot
gcloud compute disks snapshot my-disk \
  --snapshot-names my-snapshot \
  --zone us-central1-a

# Create disk from snapshot
gcloud compute disks create restored-disk \
  --source-snapshot my-snapshot \
  --zone us-central1-a

# Attach disk to VM
gcloud compute instances attach-disk myvm \
  --disk my-disk \
  --zone us-central1-a

# Detach disk
gcloud compute instances detach-disk myvm \
  --disk my-disk \
  --zone us-central1-a

# Resize disk (can only increase)
gcloud compute disks resize my-disk \
  --size 200GB \
  --zone us-central1-a
```

### Regional Persistent Disks

Replicated across two zones for high availability:

```bash
# Create regional disk
gcloud compute disks create my-regional-disk \
  --size 100GB \
  --type pd-balanced \
  --region us-central1 \
  --replica-zones us-central1-a,us-central1-b
```

## Filestore

Fully managed NFS file server.

### Tiers

| Tier | Capacity | Throughput | IOPS | Use Case |
|------|----------|------------|------|----------|
| **Basic HDD** | 1-63.9 TB | 180 MB/s | 3,000 | General purpose |
| **Basic SSD** | 2.5-63.9 TB | 1,200 MB/s | 100,000 | High performance |
| **High Scale SSD** | 10-100 TB | 2,400 MB/s | 200,000 | Enterprise apps |
| **Enterprise** | 1-10 TB | Up to 1,200 MB/s | 100,000 | Regional HA |

### Creating Filestore Instance

```bash
# Create Filestore instance
gcloud filestore instances create my-filestore \
  --tier BASIC_HDD \
  --file-share name=share1,capacity=1TB \
  --network name=default \
  --zone us-central1-a

# Mount on VM (run on VM)
sudo apt-get install -y nfs-common
sudo mkdir /mnt/filestore
sudo mount <FILESTORE_IP>:/share1 /mnt/filestore

# Add to /etc/fstab for automatic mounting
echo '<FILESTORE_IP>:/share1 /mnt/filestore nfs defaults 0 0' | sudo tee -a /etc/fstab
```

## Local SSD

High-performance local block storage attached to VM.

**Characteristics:**
- 375 GB per device (up to 24 devices)
- Very high IOPS and throughput
- Ephemeral (data lost if VM stops)
- Lower cost than Persistent Disk SSD

```bash
# Create VM with Local SSD
gcloud compute instances create vm-with-local-ssd \
  --zone us-central1-a \
  --machine-type n2-standard-8 \
  --local-ssd interface=nvme \
  --local-ssd interface=nvme
```

## Cloud Storage for Firebase

Object storage for mobile and web apps with Firebase SDK.

```javascript
// JavaScript SDK
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const storage = getStorage();
const storageRef = ref(storage, 'images/photo.jpg');

// Upload file
uploadBytes(storageRef, file).then((snapshot) => {
  console.log('Uploaded file!');
});

// Get download URL
getDownloadURL(storageRef).then((url) => {
  console.log('File URL:', url);
});
```

## Storage Transfer Service

Migrate data to Cloud Storage from other cloud providers or on-premises.

```bash
# Create transfer job from AWS S3
gcloud transfer jobs create s3://source-bucket \
  gs://destination-bucket \
  --source-creds-file=/path/to/aws-credentials.json
```

## Storage Comparison

| Storage Type | Access Method | Use Case | Performance | Persistence |
|--------------|---------------|----------|-------------|-------------|
| **Cloud Storage** | Object API, gsutil | Unstructured data, backups, media | Moderate | Durable |
| **Persistent Disk** | Block device | VM boot/data disks | High | Durable |
| **Local SSD** | Block device | Temporary cache, scratch space | Very high | Ephemeral |
| **Filestore** | NFS mount | Shared file system | High | Durable |
| **Memory** | In-memory | Application state | Extreme | Ephemeral |

## Best Practices

1. **Choose right storage class**: Use Autoclass or lifecycle policies
2. **Use regional/multi-regional buckets**: For high availability
3. **Enable versioning**: For important data
4. **Use CMEK for sensitive data**: Customer-managed encryption
5. **Set appropriate IAM policies**: Principle of least privilege
6. **Use signed URLs**: For temporary access
7. **Monitor costs**: Set up budgets and alerts
8. **Use labels**: For organization and billing tracking
9. **Enable audit logs**: Track access and modifications
10. **Optimize persistent disk type**: Match workload requirements

GCP's storage services provide flexible, scalable, and performant options for all your data storage needs, from object storage to high-performance block and file storage.
