---
id: provider-24
title: Google Cloud Platform - Compute Services
type: text
---

# Google Cloud Platform - Compute Services

GCP provides a comprehensive range of compute options, from traditional VMs to cutting-edge serverless containers. Understanding these services helps you choose the right compute model for your applications.

## Compute Engine (IaaS)

### Virtual Machine Instances

Compute Engine provides scalable, high-performance VMs running on Google's infrastructure.

**Machine Types:**

```plaintext
General Purpose:
├── E2: Cost-optimized, shared-core to 32 vCPUs
├── N2: Balanced, 2-128 vCPUs, up to 864 GB RAM
├── N2D: AMD-based, 2-224 vCPUs
├── N1: Previous generation, 1-96 vCPUs
└── Tau T2D: Scale-out workloads, 1-60 vCPUs

Compute-Optimized:
├── C2: Ultra-high performance, 4-60 vCPUs
└── C2D: AMD-based, 2-112 vCPUs

Memory-Optimized:
├── M2: Ultra-high memory, up to 12 TB RAM
└── M1: High memory, up to 4 TB RAM

Accelerator-Optimized:
└── A2: NVIDIA A100 GPUs, ML and HPC
```

**Custom Machine Types:**
Define exact CPU and memory:

```bash
# Create custom VM: 6 vCPUs, 20 GB RAM
gcloud compute instances create custom-vm \
  --custom-cpu 6 \
  --custom-memory 20GB \
  --zone us-central1-a \
  --image-family debian-11 \
  --image-project debian-cloud
```

### Creating VMs

**Using gcloud:**

```bash
# Basic VM
gcloud compute instances create myvm \
  --zone us-central1-a \
  --machine-type e2-medium \
  --image-family ubuntu-2204-lts \
  --image-project ubuntu-os-cloud \
  --boot-disk-size 20GB \
  --boot-disk-type pd-standard

# VM with startup script
gcloud compute instances create web-server \
  --zone us-central1-a \
  --machine-type n2-standard-2 \
  --tags http-server,https-server \
  --metadata startup-script='#!/bin/bash
    apt-get update
    apt-get install -y nginx
    systemctl start nginx'

# VM with service account
gcloud compute instances create app-server \
  --zone us-central1-a \
  --machine-type e2-medium \
  --service-account myapp@myproject.iam.gserviceaccount.com \
  --scopes cloud-platform
```

**Using Python Client Library:**

```python
from google.cloud import compute_v1

def create_instance(project_id, zone, instance_name):
    """Create a VM instance."""
    instance_client = compute_v1.InstancesClient()
    
    # Define the instance
    instance = compute_v1.Instance()
    instance.name = instance_name
    instance.machine_type = f"zones/{zone}/machineTypes/e2-medium"
    
    # Boot disk
    disk = compute_v1.AttachedDisk()
    initialize_params = compute_v1.AttachedDiskInitializeParams()
    initialize_params.source_image = (
        "projects/debian-cloud/global/images/family/debian-11"
    )
    initialize_params.disk_size_gb = 20
    disk.initialize_params = initialize_params
    disk.auto_delete = True
    disk.boot = True
    instance.disks = [disk]
    
    # Network interface
    network_interface = compute_v1.NetworkInterface()
    network_interface.name = "global/networks/default"
    access = compute_v1.AccessConfig()
    access.name = "External NAT"
    access.type_ = "ONE_TO_ONE_NAT"
    network_interface.access_configs = [access]
    instance.network_interfaces = [network_interface]
    
    # Create
    operation = instance_client.insert(
        project=project_id,
        zone=zone,
        instance_resource=instance
    )
    
    return operation

# Usage
create_instance("myproject", "us-central1-a", "myvm")
```

### Preemptible and Spot VMs

**Preemptible VMs:**
- Up to 80% discount
- Can be terminated anytime
- Maximum 24-hour runtime
- 30-second shutdown warning

**Spot VMs:**
- Similar to Preemptible
- No maximum runtime
- Modern replacement for Preemptible

```bash
# Create Spot VM
gcloud compute instances create spot-vm \
  --zone us-central1-a \
  --machine-type e2-medium \
  --provisioning-model SPOT \
  --instance-termination-action DELETE
```

### VM Features

**Live Migration:**
VMs automatically migrated during host maintenance without downtime.

**Automatic Restart:**
VMs restarted if they crash.

**Shielded VMs:**
Enhanced security with secure boot, vTPM, and integrity monitoring.

```bash
# Create shielded VM
gcloud compute instances create secure-vm \
  --zone us-central1-a \
  --machine-type e2-medium \
  --shielded-secure-boot \
  --shielded-vtpm \
  --shielded-integrity-monitoring
```

**GPU Attachment:**

```bash
# Create VM with GPU
gcloud compute instances create gpu-vm \
  --zone us-west1-b \
  --machine-type n1-standard-8 \
  --accelerator type=nvidia-tesla-t4,count=1 \
  --maintenance-policy TERMINATE \
  --metadata install-nvidia-driver=True
```

### Instance Groups

**Managed Instance Groups (MIG):**
Identical VMs based on instance template, with autoscaling and load balancing.

```bash
# Create instance template
gcloud compute instance-templates create web-template \
  --machine-type e2-medium \
  --image-family debian-11 \
  --image-project debian-cloud \
  --metadata startup-script='#!/bin/bash
    apt-get update
    apt-get install -y nginx'

# Create managed instance group
gcloud compute instance-groups managed create web-group \
  --base-instance-name web \
  --template web-template \
  --size 3 \
  --zone us-central1-a

# Configure autoscaling
gcloud compute instance-groups managed set-autoscaling web-group \
  --zone us-central1-a \
  --max-num-replicas 10 \
  --min-num-replicas 2 \
  --target-cpu-utilization 0.75
```

## App Engine (PaaS)

Fully managed platform for deploying applications without managing infrastructure.

### Environments

**Standard Environment:**
- Preconfigured runtimes: Python, Java, Node.js, PHP, Ruby, Go
- Automatic scaling, including to zero
- Free tier available
- Fast startup
- Restricted system access

**Flexible Environment:**
- Custom runtimes via Docker
- SSH access
- Runs in Compute Engine VMs
- More configuration options
- Minimum 1 instance always running

### Deploying to App Engine

**app.yaml (Standard):**

```yaml
runtime: python39
entrypoint: gunicorn -b :$PORT main:app

automatic_scaling:
  target_cpu_utilization: 0.65
  min_instances: 1
  max_instances: 10
  
handlers:
- url: /static
  static_dir: static
  
- url: /.*
  script: auto
```

**Python App:**

```python
# main.py
from flask import Flask

app = Flask(__name__)

@app.route('/')
def hello():
    return 'Hello from App Engine!'

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
```

**Deploy:**

```bash
gcloud app deploy

# View app
gcloud app browse

# View logs
gcloud app logs tail -s default

# Deploy specific version without routing traffic
gcloud app deploy --no-promote --version v2
```

### Traffic Splitting

```bash
# Split traffic between versions
gcloud app services set-traffic default \
  --splits v1=0.9,v2=0.1

# Gradual rollout
gcloud app services set-traffic default \
  --splits v2=1.0 \
  --migrate
```

## Cloud Functions (FaaS)

Event-driven serverless functions.

### Generations

**1st Gen:**
- Simpler configuration
- Limited to 540 seconds
- HTTP and event triggers

**2nd Gen:**
- Built on Cloud Run
- Up to 60 minutes runtime
- More instance sizes
- Concurrency support
- Enhanced networking

### Creating Functions

**Python Function (2nd Gen):**

```python
# main.py
import functions_framework
from flask import Request

@functions_framework.http
def hello_http(request: Request):
    """HTTP Cloud Function."""
    name = request.args.get('name', 'World')
    return f'Hello, {name}!'

@functions_framework.cloud_event
def hello_pubsub(cloud_event):
    """Pub/Sub Cloud Function."""
    import base64
    
    message = base64.b64decode(cloud_event.data["message"]["data"]).decode()
    print(f"Received: {message}")
```

**Deploy:**

```bash
# HTTP function
gcloud functions deploy hello-http \
  --gen2 \
  --runtime python311 \
  --trigger-http \
  --entry-point hello_http \
  --allow-unauthenticated \
  --region us-central1

# Pub/Sub function
gcloud functions deploy hello-pubsub \
  --gen2 \
  --runtime python311 \
  --trigger-topic my-topic \
  --entry-point hello_pubsub \
  --region us-central1

# Cloud Storage trigger
gcloud functions deploy process-upload \
  --gen2 \
  --runtime python311 \
  --trigger-bucket my-bucket \
  --entry-point process_file \
  --region us-central1
```

## Google Kubernetes Engine (GKE)

Managed Kubernetes service.

### GKE Modes

**Autopilot:**
- Fully managed
- Per-pod billing
- Optimized for cost
- Limited customization

**Standard:**
- More control
- Node-level management
- Per-node billing
- Full Kubernetes features

### Creating GKE Cluster

```bash
# Autopilot cluster
gcloud container clusters create-auto my-autopilot-cluster \
  --region us-central1

# Standard cluster
gcloud container clusters create my-cluster \
  --zone us-central1-a \
  --num-nodes 3 \
  --machine-type e2-medium \
  --enable-autoscaling \
  --min-nodes 1 \
  --max-nodes 10 \
  --enable-autorepair \
  --enable-autoupgrade

# Get credentials
gcloud container clusters get-credentials my-cluster \
  --zone us-central1-a

# Deploy application
kubectl create deployment nginx --image=nginx:latest
kubectl expose deployment nginx --port=80 --type=LoadBalancer
```

## Cloud Run

Serverless platform for running containers.

**Features:**
- Fully managed
- Automatic scaling to zero
- Pay per use (100ms increments)
- HTTPS endpoints
- Any language/binary
- Up to 60 minutes per request

### Deploying to Cloud Run

```bash
# Deploy from source
gcloud run deploy myapp \
  --source . \
  --region us-central1 \
  --allow-unauthenticated

# Deploy from container image
gcloud run deploy myapp \
  --image gcr.io/myproject/myapp:v1 \
  --region us-central1 \
  --cpu 2 \
  --memory 1Gi \
  --max-instances 100 \
  --concurrency 80 \
  --set-env-vars "DB_HOST=10.1.2.3" \
  --allow-unauthenticated
```

**Dockerfile:**

```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

CMD exec gunicorn --bind :$PORT --workers 1 --threads 8 main:app
```

## Compute Service Comparison

| Feature | Compute Engine | App Engine | Cloud Functions | GKE | Cloud Run |
|---------|----------------|------------|-----------------|-----|-----------|
| **Management** | IaaS | PaaS | FaaS | CaaS | Serverless Containers |
| **Scaling** | Manual/Auto | Automatic | Automatic | Manual/Auto | Automatic |
| **Min instances** | 1 | 0 or 1 | 0 | 1+ | 0 |
| **Max runtime** | Unlimited | Unlimited | 60 min | Unlimited | 60 min |
| **Cold start** | None | Low | Medium | None | Low |
| **Billing** | Per second | Per instance-hour | Per 100ms | Per node | Per 100ms |
| **Containers** | Supported | Flex only | No | Yes | Yes |
| **Custom runtimes** | Full control | Flexible | Limited | Full | Full |

Choose based on your needs: Compute Engine for full control, App Engine for simple apps, Cloud Functions for event-driven, GKE for containers, Cloud Run for stateless containers.
