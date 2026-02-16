---
id: provider-23
title: Google Cloud Platform - Overview
type: text
---

# Google Cloud Platform - Overview

Google Cloud Platform (GCP) is Google's comprehensive cloud computing platform offering infrastructure, platform, and software services. Launched in 2008, GCP leverages Google's massive global infrastructure and expertise in distributed systems, data analytics, and machine learning.

## GCP Introduction

### Key Strengths

- **Data Analytics and Big Data**: BigQuery, Dataflow, Dataproc
- **Machine Learning**: TensorFlow, Vertex AI, AutoML
- **Kubernetes**: GKE (Google created Kubernetes)
- **Global Network**: Premium Tier network with extensive fiber optic cables
- **Open Source**: Strong commitment to open-source technologies
- **Live Migration**: VMs can be migrated without downtime
- **Pricing**: Per-second billing, sustained use discounts

### Market Position

- **Third-largest** cloud provider (after AWS and Azure)
- **Strong in**: Analytics, ML, containers, developer tools
- **Notable customers**: Spotify, Snapchat, Twitter, PayPal
- **Growing rapidly** in enterprise segment

## GCP Global Infrastructure

### Regions and Zones

**Regions:** 38+ regions worldwide
- North America: 11 regions
- South America: 2 regions
- Europe: 11 regions
- Asia Pacific: 12 regions
- Middle East: 2 regions

**Zones:** 3+ zones per region
- Independent failure domains
- Low-latency connectivity within region
- High-bandwidth connections

```plaintext
Example Region: us-central1 (Iowa)
├── us-central1-a
├── us-central1-b
├── us-central1-c
└── us-central1-f
```

### Network

**Premium Tier**
- Traffic routed through Google's global network
- Lower latency, better performance
- Single global IP anycast

**Standard Tier**
- Traffic routed via public internet
- Lower cost
- Regional IP addresses

### Points of Presence (PoPs)

- 140+ edge network locations
- Cloud CDN caching
- Reduced latency for users worldwide

## GCP Services Overview

### Compute Services

- **Compute Engine**: Virtual machines (IaaS)
- **App Engine**: Platform as a Service (PaaS)
- **Cloud Functions**: Serverless functions (FaaS)
- **Google Kubernetes Engine (GKE)**: Managed Kubernetes
- **Cloud Run**: Serverless containers
- **Bare Metal Solution**: Physical servers

### Storage Services

- **Cloud Storage**: Object storage (like S3)
- **Persistent Disk**: Block storage for VMs
- **Filestore**: Fully managed NFS file storage
- **Cloud Storage for Firebase**: Mobile/web app storage

### Database Services

- **Cloud SQL**: Managed MySQL, PostgreSQL, SQL Server
- **Cloud Spanner**: Globally distributed relational database
- **Cloud Bigtable**: NoSQL wide-column database
- **Firestore**: Document database
- **Firebase Realtime Database**: NoSQL mobile database
- **Memorystore**: Managed Redis and Memcached

### Networking Services

- **Virtual Private Cloud (VPC)**: Software-defined networking
- **Cloud Load Balancing**: Global load distribution
- **Cloud CDN**: Content delivery network
- **Cloud Interconnect**: Dedicated connectivity
- **Cloud VPN**: Secure VPN connections
- **Cloud DNS**: Managed DNS service
- **Cloud Armor**: DDoS protection and WAF

### Big Data and Analytics

- **BigQuery**: Serverless data warehouse
- **Dataflow**: Stream and batch data processing
- **Dataproc**: Managed Hadoop and Spark
- **Pub/Sub**: Messaging and event ingestion
- **Data Fusion**: Data integration service
- **Looker**: Business intelligence platform

### AI and Machine Learning

- **Vertex AI**: Unified ML platform
- **AutoML**: Custom ML models without coding
- **Pre-trained APIs**: Vision, Natural Language, Translation, Speech
- **TensorFlow Enterprise**: Managed TensorFlow
- **AI Platform Notebooks**: Jupyter notebooks

### Developer Tools

- **Cloud Build**: CI/CD platform
- **Cloud Source Repositories**: Git repositories
- **Container Registry**: Docker image storage
- **Artifact Registry**: Universal package manager
- **Cloud Deployment Manager**: Infrastructure as Code

### Management Tools

- **Cloud Console**: Web UI
- **Cloud Shell**: Browser-based shell
- **Cloud SDK (gcloud)**: Command-line tools
- **Cloud APIs**: Programmatic access
- **Cloud Monitoring (Stackdriver)**: Monitoring and logging
- **Cloud Logging**: Log management
- **Cloud Trace**: Application performance
- **Cloud Profiler**: CPU and memory profiling

## GCP Resource Hierarchy

```plaintext
Organization
    ├── Folder: Production
    │   ├── Project: prod-web
    │   │   ├── Compute Engine VMs
    │   │   └── Cloud Storage Buckets
    │   └── Project: prod-data
    │       └── BigQuery Datasets
    └── Folder: Development
        └── Project: dev-environment
            └── Resources
```

### Organization

- Root node of hierarchy
- Linked to Google Workspace or Cloud Identity domain
- Centralized policy management

### Folders

- Grouping mechanism for projects
- Map to organizational structure
- Hierarchical permissions

### Projects

- Fundamental organizing entity
- Resources belong to projects
- Billing, quota, and IAM boundaries
- Project ID (globally unique)

### Resources

- Individual services (VMs, databases, storage)
- Belong to exactly one project

## Identity and Access Management (IAM)

### IAM Components

**Who:** Identity
- Google account
- Service account
- Google group
- Cloud Identity domain

**Can do what:** Role
- **Primitive roles**: Owner, Editor, Viewer
- **Predefined roles**: Fine-grained, service-specific
- **Custom roles**: User-defined permissions

**On which resource:** Resource
- Organization, folder, project, or specific resource

### IAM Policy

```yaml
bindings:
- role: roles/storage.objectViewer
  members:
  - user:alice@example.com
  - group:developers@example.com
  - serviceAccount:myapp@project.iam.gserviceaccount.com
  
- role: roles/storage.objectAdmin
  members:
  - user:bob@example.com
  
- role: roles/owner
  members:
  - user:admin@example.com
  condition:
    title: "Expires 2026-12-31"
    expression: "request.time < timestamp('2026-12-31T23:59:59Z')"
```

### Service Accounts

Machine accounts for applications.

```bash
# Create service account
gcloud iam service-accounts create myapp-sa \
  --display-name "My Application Service Account"

# Grant role
gcloud projects add-iam-policy-binding myproject \
  --member serviceAccount:myapp-sa@myproject.iam.gserviceaccount.com \
  --role roles/storage.objectViewer

# Create and download key
gcloud iam service-accounts keys create key.json \
  --iam-account myapp-sa@myproject.iam.gserviceaccount.com
```

## GCP Pricing

### Pricing Models

**Pay-As-You-Go**
- Per-second billing (minimum 1 minute)
- No upfront costs
- Automatic discounts

**Sustained Use Discounts**
- Automatic up to 30% discount
- For VMs running >25% of month
- No commitment required

**Committed Use Discounts**
- 1 or 3-year commitment
- Up to 57% discount for VMs
- Up to 70% for memory-optimized

**Preemptible VMs**
- Up to 80% discount
- Can be terminated by GCP
- Maximum 24-hour runtime

### Free Tier

**Always Free:**
- Compute Engine: 1 f1-micro VM/month (US regions)
- Cloud Storage: 5 GB standard storage
- BigQuery: 1 TB queries/month, 10 GB storage
- Cloud Functions: 2M invocations/month
- Cloud Shell: 5 GB storage

**90-Day Trial:**
- $300 credit
- Valid for 90 days
- Access to all services

## GCP Tools

### Cloud Console

Web-based management interface at https://console.cloud.google.com

**Features:**
- Visual resource management
- Cloud Shell integration
- Performance monitoring
- Cost tracking
- API explorer

### gcloud CLI

```bash
# Initialize gcloud
gcloud init

# Set project
gcloud config set project myproject

# Create VM
gcloud compute instances create myvm \
  --zone us-central1-a \
  --machine-type e2-medium \
  --image-family debian-11 \
  --image-project debian-cloud

# List VMs
gcloud compute instances list

# Deploy App Engine app
gcloud app deploy

# Build container
gcloud builds submit --tag gcr.io/myproject/myapp:v1

# Authenticate with docker
gcloud auth configure-docker
```

### Cloud Shell

Browser-based shell with pre-installed tools:
- gcloud CLI
- kubectl
- docker
- terraform
- git
- python, node, go
- 5 GB persistent storage

## GCP vs AWS vs Azure Terminology

| GCP | AWS | Azure |
|-----|-----|-------|
| Project | Account | Subscription |
| Compute Engine | EC2 | Virtual Machines |
| Cloud Storage | S3 | Blob Storage |
| Cloud SQL | RDS | SQL Database |
| Cloud Spanner | Aurora (global) | Cosmos DB |
| BigQuery | Redshift/Athena | Synapse Analytics |
| Cloud Functions | Lambda | Functions |
| GKE | EKS | AKS |
| Cloud Run | Fargate | Container Instances |
| App Engine | Elastic Beanstalk | App Service |
| VPC | VPC | VNet |
| Cloud Load Balancing | ELB/ALB | Load Balancer |
| Cloud CDN | CloudFront | CDN |
| IAM | IAM | Azure AD + RBAC |
| Cloud Interconnect | Direct Connect | ExpressRoute |

## GCP Certifications

**Associate Level:**
- Cloud Engineer

**Professional Level:**
- Cloud Architect
- Data Engineer
- Cloud Developer
- Cloud DevOps Engineer
- Cloud Security Engineer
- Cloud Network Engineer
- Collaboration Engineer
- Machine Learning Engineer

## Best Practices

1. **Use the resource hierarchy**: Organize with folders and projects
2. **Implement IAM properly**: Least privilege principle
3. **Enable Cloud Audit Logs**: Track all API calls
4. **Use service accounts**: For application authentication
5. **Tag resources**: Labels for organization and billing
6. **Monitor costs**: Use budgets and alerts
7. **Choose right region**: Consider latency and data residency
8. **Leverage sustained use discounts**: Automatic savings
9. **Use committed use discounts**: For predictable workloads
10. **Implement security best practices**: VPC Service Controls, Cloud Armor

## Unique GCP Features

### Live Migration

VMs can be migrated between hosts without downtime during maintenance.

### Custom Machine Types

Create VMs with exact CPU and memory specifications.

```bash
gcloud compute instances create myvm \
  --custom-cpu 6 \
  --custom-memory 20GB
```

### Sole-Tenant Nodes

Dedicated physical servers for your workloads.

### Anthos

Hybrid and multi-cloud platform to modernize applications.

### Beyond Corp

Zero-trust security model.

Google Cloud Platform offers powerful infrastructure, advanced data analytics capabilities, and leading-edge machine learning tools, making it an excellent choice for data-intensive and ML-focused applications, as well as organizations committed to open-source technologies and Kubernetes.
