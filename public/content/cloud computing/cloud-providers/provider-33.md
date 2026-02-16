---
id: provider-33
title: Provider Comparison - Compute and Storage
type: text
---

# Provider Comparison - Compute and Storage

Understanding the similarities and differences between AWS, Azure, and GCP for compute and storage services helps you make informed decisions for your cloud architecture.

## Compute Services Comparison

### Virtual Machines

| Feature | AWS EC2 | Azure Virtual Machines | GCP Compute Engine |
|---------|---------|------------------------|-------------------|
| **Instance Types** | 500+ types | 600+ sizes | 60+ machine types |
| **Custom Sizes** | No | Limited | Yes (custom VMs) |
| **Billing** | Per second | Per second | Per second |
| **Free Tier** | 750 hours t2.micro | 750 hours B1S | 1 f1-micro (US only) |
| **Min Duration** | 60 seconds | 60 seconds | 60 seconds |
| **Live Migration** | No | Planned maintenance | Yes, automatic |
| **Spot/Preemptible** | Spot Instances (3 min notice) | Spot VMs (30 sec notice) | Spot/Preemptible (30 sec) |
| **Discount Options** | Reserved (1-3 yr), Savings Plans | Reserved (1-3 yr), Spot | CUD (1-3 yr), SUD (automatic) |

**Equivalent Instance Types:**

| Use Case | AWS | Azure | GCP |
|----------|-----|-------|-----|
| **Small general** | t3.small | B2s | e2-small |
| **Medium general** | t3.medium | B2ms | e2-medium |
| **Production general** | m5.large | D2s v3 | n2-standard-2 |
| **Compute optimized** | c5.2xlarge | F4s v2 | c2-standard-8 |
| **Memory optimized** | r5.xlarge | E4s v3 | n2-highmem-4 |
| **GPU** | p3.2xlarge | NC6s v3 | n1-standard-4 + T4 |

**Price Comparison** (us-central/us-east region, Linux, pay-as-you-go):

| Type | AWS ($/hour) | Azure ($/hour) | GCP ($/hour) |
|------|--------------|----------------|--------------|
| **2 vCPU, 8GB** | $0.0832 (t3.large) | $0.096 (B2ms) | $0.0670 (e2-standard-2) |
| **4 vCPU, 16GB** | $0.166 (t3.xlarge) | $0.192 (B4ms) | $0.134 (e2-standard-4) |
| **8 vCPU, 32GB** | $0.333 (t3.2xlarge) | $0.384 (B8ms) | $0.268 (e2-standard-8) |

### Serverless Compute

| Feature | AWS Lambda | Azure Functions | GCP Cloud Functions |
|---------|-----------|-----------------|---------------------|
| **Max Duration** | 15 minutes | Consumption: 10 min, Premium: Unlimited | 60 minutes (2nd gen) |
| **Max Memory** | 10 GB | 14 GB | 32 GB (2nd gen) |
| **Languages** | Node, Python, Java, Go, C#, Ruby, Custom | Node, Python, Java, C#, PowerShell, Custom | Node, Python, Go, Java, Ruby, .NET, Custom |
| **Free Tier** | 1M requests, 400K GB-s | 1M requests, 400K GB-s | 2M requests, 400K GB-s |
| **Concurrent Executions** | 1000 (default) | 200 per app | 1000 (default) |
| **Cold Start** | ~100-200ms | ~200-500ms | ~100-300ms |
| **Pricing** | $0.20/1M requests | $0.20/1M requests | $0.40/1M requests |

**Equivalent Services:**

```
Event-Driven Functions:
├── AWS Lambda
├── Azure Functions
└── GCP Cloud Functions

Containerized Serverless:
├── AWS Fargate
├── Azure Container Instances
└── GCP Cloud Run

Platform-as-a-Service:
├── AWS Elastic Beanstalk
├── Azure App Service
└── GCP App Engine
```

### Container Orchestration (Kubernetes)

| Feature | AWS EKS | Azure AKS | GCP GKE |
|---------|---------|-----------|---------|
| **Kubernetes Version** | Managed, auto-upgrade | Managed, auto-upgrade | Managed, auto-upgrade |
| **Control Plane Cost** | $0.10/hour ($73/month) | Free | Autopilot: Free, Standard: $0.10/hour |
| **Managed Upgrades** | Yes | Yes | Yes |
| **Node Autoscaling** | Yes | Yes | Yes |
| **Pod Autoscaling** | Yes | Yes | Yes |
| **Windows Nodes** | Yes | Yes | Yes |
| **ARM64 Support** | Yes | Yes | Yes |
| **Serverless Pods** | Fargate | Virtual Nodes | Autopilot |

## Storage Services Comparison

### Object Storage

| Feature | AWS S3 | Azure Blob Storage | GCP Cloud Storage |
|---------|--------|-------------------|-------------------|
| **Max Object Size** | 5 TB | 190.7 TB | 5 TB |
| **Storage Classes** | 6 | 4 | 4 |
| **Durability** | 99.999999999% | 99.999999999% | 99.999999999% |
| **Data Transfer In** | Free | Free | Free |
| **Data Transfer Out** | $0.09/GB | $0.087/GB | $0.085/GB |
| **Versioning** | Yes | Yes | Yes |
| **Lifecycle Policies** | Yes | Yes | Yes |
| **Events** | S3 Events | Event Grid | Pub/Sub |

**Storage Class Comparison:**

| Tier | AWS S3 | Azure Blob | GCP Storage | Price/GB/Month |
|------|--------|------------|-------------|----------------|
| **Hot (frequent)** | Standard | Hot | Standard | $0.020-$0.023 |
| **Warm (monthly)** | Standard-IA | Cool | Nearline | $0.010-$0.0125 |
| **Cold (quarterly)** | Glacier Instant | Cool | Coldline | $0.004-$0.010 |
| **Archive (yearly)** | Glacier Deep | Archive | Archive | $0.0012-$0.002 |

**CLI Commands Comparison:**

```bash
# List buckets/containers
aws s3 ls
az storage container list --account-name NAME
gsutil ls

# Upload file
aws s3 cp file.txt s3://bucket/
az storage blob upload -f file.txt -c container -n file.txt
gsutil cp file.txt gs://bucket/

# Download file
aws s3 cp s3://bucket/file.txt .
az storage blob download -c container -n file.txt -f file.txt
gsutil cp gs://bucket/file.txt .

# Sync directory
aws s3 sync ./local s3://bucket/
az storage blob sync -s ./local -c container
gsutil rsync -r ./local gs://bucket/
```

### Block Storage

| Feature | AWS EBS | Azure Managed Disks | GCP Persistent Disk |
|---------|---------|---------------------|---------------------|
| **Max Size** | 64 TB | 64 TB | 64 TB |
| **IOPS (max)** | 256,000 (io2) | 160,000 (Ultra) | 100,000 (Extreme) |
| **Throughput (max)** | 4,000 MB/s | 4,000 MB/s | 1,200 MB/s (SSD) |
| **Snapshots** | Yes | Yes | Yes |
| **Encryption** | Yes (default) | Yes (default) | Yes (default) |
| **Regional Disk** | Yes (Multi-AZ) | ZRS disks | Regional PD |

**Types and Pricing:**

| Type | AWS EBS | Azure Disk | GCP PD | Price/GB/Month |
|------|---------|------------|--------|----------------|
| **HDD** | st1 | Standard HDD | Standard | $0.040-$0.045 |
| **Balanced SSD** | gp3 | Premium SSD | Balanced | $0.080-$0.100 |
| **High-perf SSD** | io2 | Premium SSD v2 | SSD | $0.125-$0.170 |
| **Ultra** | io2 Block Express | Ultra Disk | Extreme | Custom pricing |

### File Storage

| Feature | AWS EFS | Azure Files | GCP Filestore |
|---------|---------|-------------|---------------|
| **Protocol** | NFS 4.0, 4.1 | SMB, NFS | NFS 3.0 |
| **Performance** | Up to 10 GB/s | Up to 10 GB/s | Up to 2.4 GB/s |
| **Capacity** | Unlimited | 100 TB | 100 TB |
| **Tiers** | Standard, IA | Premium, Standard, Cool | Basic, High Scale, Enterprise |
| **Pricing** | $0.30/GB (Standard) | $0.06/GB (Standard) | $0.20/GB (Basic HDD) |
| **Snapshots** | Yes | Yes | Yes |

**Use Cases:**

```
AWS EFS:
├── Linux workloads
├── Container persistent storage
├── Web serving
└── Content management

Azure Files:
├── Windows workloads (SMB)
├── Hybrid scenarios
├── Lift-and-shift migrations
└── Development environments

GCP Filestore:
├── GKE persistent volumes
├── Enterprise applications
├── Media rendering
└── Genomics analysis
```

## Performance Comparison

### VM Performance

**Network:**
| Provider | Standard | Enhanced |
|----------|----------|----------|
| **AWS** | 5 Gbps (m5.large) | 100 Gbps (p4d.24xlarge) |
| **Azure** | 2 Gbps (D2s) | 200 Gbps (ND H100 v5) |
| **GCP** | 10 Gbps (n2-standard-2) | 100 Gbps (a2-ultragpu-8g) |

**Storage:**
| Provider | Standard IOPS | Max IOPS |
|----------|---------------|----------|
| **AWS** | 3,000-16,000 (gp3) | 256,000 (io2) |
| **Azure** | 500-20,000 (Premium) | 160,000 (Ultra) |
| **GCP** | 3,000-15,000 (Balanced) | 100,000 (SSD) |

### Object Storage Performance

| Provider | Read Latency | Throughput |
|----------|--------------|------------|
| **AWS S3** | ~100ms | 5,500 GET/s per prefix |
| **Azure Blob** | ~100ms | 20,000 requests/s per blob |
| **GCP Storage** | ~100ms | 5,000 requests/s per bucket |

## Geographic Availability

**Regions (as of 2024):**
- **AWS**: 33 regions, 105 availability zones
- **Azure**: 60+ regions, 140+ availability zones
- **GCP**: 38 regions, 115 zones

**Global Network:**
- **AWS**: CloudFront (450+ edge locations)
- **Azure**: Azure CDN (130+ edge locations)
- **GCP**: Cloud CDN (140+ edge locations, Premium Tier network)

## Migration Between Providers

**VM Migration:**
```bash
# AWS VM to GCP
gcov import ovf-to-gce \
  --source-uri=s3://bucket/vm-image.ova \
  --zone=us-central1-a

# Azure VM to AWS
aws ec2 import-image \
  --disk-containers Format=VHD,UserBucket={S3Bucket=bucket,S3Key=vm-image.vhd}
```

**Storage Migration:**
```bash
# S3 to GCS
gsutil -m rsync -r s3://aws-bucket gs://gcp-bucket

# Azure Blob to S3
az storage copy \
  --source https://account.blob.core.windows.net/container \
  --destination s3://aws-bucket \
  --recursive
```

## Best Practices by Provider

**AWS:**
- Use Reserved Instances for steady-state workloads
- Implement S3 lifecycle policies
- Use CloudWatch for monitoring
- Leverage AWS Organizations for multi-account

**Azure:**
- Use Azure Reservations for cost savings
- Implement Azure Policy for governance
- Use Azure Monitor extensively
- Leverage Management Groups

**GCP:**
- Use Committed Use Discounts
- Benefit from automatic Sustained Use Discounts
- Implement labels for resource organization
- Use Cloud Monitoring (Operations Suite)

## Decision Matrix

**Choose AWS if:**
- Need widest service selection
- Require most third-party integrations
- Operating in most global regions
- Mature DevOps tooling required

**Choose Azure if:**
- Microsoft-centric environment (.NET, Windows, AD)
- Office 365 integration needed
- Hybrid cloud with Azure Stack/Arc
- Strong compliance requirements

**Choose GCP if:**
- Data analytics and ML focus
- Kubernetes-native development
- BigQuery for data warehouse
- Google Workspace integration
- Per-second billing important

Most organizations use **multi-cloud** or **hybrid** approaches, leveraging strengths of each provider for different workloads.
