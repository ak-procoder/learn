---
id: provider-14
title: Azure Compute Services
type: text
---

# Azure Compute Services

Azure offers a comprehensive range of compute services to meet diverse workload requirements, from traditional virtual machines to serverless computing and container orchestration. This slide covers Azure's compute offerings in detail.

## Azure Virtual Machines

Azure VMs provide on-demand, scalable computing resources with support for Windows and Linux.

### VM Series and Sizes

**General Purpose** (B, D, DC, DS series)
- Balanced CPU-to-memory ratio
- Ideal for testing, development, small-medium databases
- **B-series**: Burstable performance for variable workloads

**Compute Optimized** (F, FS series)
- High CPU-to-memory ratio
- Good for web servers, batch processing, application servers
- Up to 64 vCPUs

**Memory Optimized** (E, ES, M, MS series)
- High memory-to-CPU ratio
- In-memory databases, caching, analytics
- Up to 4 TB RAM (M-series)

**Storage Optimized** (L, LS series)
- High disk throughput and I/O
- Big data, SQL, NoSQL databases
- Local NVMe storage

**GPU** (NC, ND, NV series)
- Graphics rendering and acceleration
- Machine learning, AI workloads
- NVIDIA Tesla GPUs

**High Performance Compute** (H, HB, HC series)
- HPC workloads
- MPI support
- InfiniBand networking

### VM Availability Options

**Availability Sets**
```plaintext
Availability Set (99.95% SLA)
├── Fault Domain 1
│   └── VM 1
├── Fault Domain 2
│   └── VM 2
└── Fault Domain 3
    └── VM 3

Update Domains: Separate maintenance events
Fault Domains: Separate physical infrastructure
```

**Availability Zones**
- Physically separate data centers within region
- 99.99% SLA for multi-zone deployments
- Protection against data center failures

**Virtual Machine Scale Sets**
- Auto-scaling groups of VMs
- Up to 1,000 VM instances
- Load balancer integration
- Automatic OS updates

### Managed Disks

**Disk Types:**

**Ultra Disk**
- Highest performance
- Sub-millisecond latency
- Up to 160,000 IOPS
- Use with mission-critical workloads

**Premium SSD**
- High performance, low latency
- Production workloads
- Up to 20,000 IOPS
- 99.9% SLA

**Standard SSD**
- Cost-effective solid state
- Web servers, dev/test
- Up to 6,000 IOPS
- 99.9% SLA

**Standard HDD**
- Lowest cost
- Infrequent access
- Backup, non-critical workloads
- No SLA

### Azure CLI VM Management

```bash
# Create VM
az vm create \
  --resource-group myResourceGroup \
  --name myVM \
  --image UbuntuLTS \
  --size Standard_D2s_v3 \
  --admin-username azureuser \
  --generate-ssh-keys \
  --public-ip-sku Standard \
  --zone 1

# Start/Stop VMs
az vm start --resource-group myResourceGroup --name myVM
az vm stop --resource-group myResourceGroup --name myVM
az vm deallocate --resource-group myResourceGroup --name myVM

# Resize VM
az vm resize \
  --resource-group myResourceGroup \
  --name myVM \
  --size Standard_D4s_v3
```

## Azure App Service

Platform as a Service (PaaS) for hosting web applications and APIs.

### App Service Plans

**Pricing Tiers:**

| Tier | Use Case | Features |
|------|----------|----------|
| Free (F1) | Dev/Test | 1 GB RAM, 1 GB storage |
| Shared (D1) | Low traffic | Custom domains |
| Basic (B1-B3) | Small apps | Manual scaling, SSL |
| Standard (S1-S3) | Production | Auto-scaling, staging slots |
| Premium (P1v3-P3v3) | Enterprise | Enhanced performance, VNet |
| Isolated (I1-I3) | Mission-critical | Dedicated environment, ASE |

### Features

**Deployment Slots**
- Test changes before production
- Swap with zero downtime
- Automatic rollback capability
- Warm-up configuration

**Auto-scaling**
```plaintext
Scale Rules:
- CPU > 70% → Scale out +1 instance
- CPU < 30% → Scale in -1 instance
- Time-based: Scale out at 8 AM, scale in at 6 PM
```

**Continuous Deployment**
- GitHub, Azure DevOps, Bitbucket
- Docker containers
- Drop FTP/manual uploads

**Built-in Authentication**
- Azure AD
- Microsoft Account
- Google, Facebook, Twitter
- Custom providers

### Supported Platforms

- **.NET** (Core and Framework)
- **Java** (SE, Spring Boot, Tomcat)
- **Node.js**
- **Python**
- **PHP**
- **Ruby**
- **Containers** (Docker)

### Example: Deploy Node.js App

```bash
# Create App Service Plan
az appservice plan create \
  --name myPlan \
  --resource-group myResourceGroup \
  --sku B1 \
  --is-linux

# Create Web App
az webapp create \
  --name myUniqueAppName \
  --resource-group myResourceGroup \
  --plan myPlan \
  --runtime "NODE|14-lts"

# Deploy from GitHub
az webapp deployment source config \
  --name myUniqueAppName \
  --resource-group myResourceGroup \
  --repo-url https://github.com/user/repo \
  --branch main \
  --manual-integration
```

## Azure Functions

Serverless compute service for event-driven applications.

### Hosting Plans

**Consumption Plan**
- Pay per execution
- Automatic scaling
- 5-minute timeout (default)
- 10-minute maximum timeout

**Premium Plan**
- Pre-warmed instances (no cold start)
- VNet connectivity
- Unlimited execution duration
- Advanced scaling options

**Dedicated Plan**
- Run on App Service Plan
- Predictable billing
- Long-running functions

### Triggers and Bindings

**Common Triggers:**
- HTTP requests
- Timer (CRON schedule)
- Azure Storage (Blob, Queue, Table)
- Azure Cosmos DB
- Event Hub
- Service Bus
- Event Grid

**Example Function (C#):**
```csharp
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Extensions.Logging;

public static class HttpTriggerFunction
{
    [FunctionName("HttpTrigger")]
    public static IActionResult Run(
        [HttpTrigger(AuthorizationLevel.Function, "get", "post")] HttpRequest req,
        ILogger log)
    {
        log.LogInformation("C# HTTP trigger function processed a request.");
        
        string name = req.Query["name"];
        
        return new OkObjectResult($"Hello, {name}!");
    }
}
```

**Example Function (Python):**
```python
import azure.functions as func
import logging

def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')
    
    name = req.params.get('name')
    
    if not name:
        return func.HttpResponse(
            "Please pass a name on the query string",
            status_code=400
        )
    else:
        return func.HttpResponse(
            f"Hello, {name}!",
            status_code=200
        )
```

### Durable Functions

Stateful workflows in serverless environment.

**Patterns:**
- Function chaining
- Fan-out/fan-in
- Async HTTP APIs
- Monitoring
- Human interaction

```csharp
[FunctionName("OrderProcessing")]
public static async Task<object> Run(
    [OrchestrationTrigger] IDurableOrchestrationContext context)
{
    var orderId = context.GetInput<string>();
    
    await context.CallActivityAsync("ValidateOrder", orderId);
    await context.CallActivityAsync("ProcessPayment", orderId);
    await context.CallActivityAsync("ShipOrder", orderId);
    
    return new { status = "completed", orderId };
}
```

## Azure Container Instances (ACI)

Run containers without managing servers.

**Features:**
- Fastest way to run containers
- Per-second billing
- Public IP and DNS name
- Linux and Windows containers
- Persistent storage with Azure Files

```bash
# Run container
az container create \
  --resource-group myResourceGroup \
  --name mycontainer \
  --image mcr.microsoft.com/azuredocs/aci-helloworld \
  --dns-name-label aci-demo \
  --ports 80

# Check status
az container show \
  --resource-group myResourceGroup \
  --name mycontainer \
  --query instanceView.state
```

## Azure Kubernetes Service (AKS)

Managed Kubernetes orchestration service.

### Key Features

- **Managed Control Plane**: Free, Azure-managed
- **Automatic Updates**: Kubernetes version upgrades
- **Scaling**: Cluster and pod autoscaling
- **Integration**: Azure CNI, Azure Monitor, Azure Policy
- **Virtual Nodes**: ACI integration for burst scaling

### AKS Architecture

```plaintext
AKS Cluster
├── Control Plane (Azure Managed)
│   ├── API Server
│   ├── etcd
│   └── Scheduler
└── Node Pools
    ├── System Node Pool (required)
    │   └── System pods (CoreDNS, metrics-server)
    └── User Node Pools
        └── Application pods
```

### Create AKS Cluster

```bash
# Create AKS cluster
az aks create \
  --resource-group myResourceGroup \
  --name myAKSCluster \
  --node-count 3 \
  --enable-managed-identity \
  --generate-ssh-keys \
  --enable-addons monitoring \
  --network-plugin azure

# Get credentials
az aks get-credentials \
  --resource-group myResourceGroup \
  --name myAKSCluster

# Deploy application
kubectl apply -f deployment.yaml
```

## Azure Batch

Large-scale parallel and HPC job scheduling.

**Use Cases:**
- Image rendering
- Financial risk modeling
- Video transcoding
- Scientific simulations

**Components:**
- **Pool**: Collection of compute nodes
- **Job**: Collection of tasks
- **Task**: Unit of computation

## Azure Service Fabric

Distributed systems platform for microservices.

**Features:**
- Stateful and stateless services
- High availability and scalability
- Built-in health monitoring
- Rolling upgrades
- Supports .NET, Java, containers

## Comparison and Selection Guide

| Service | Use When | Billing Model |
|---------|----------|---------------|
| Virtual Machines | IaaS, full control | Per hour |
| App Service | PaaS web apps, APIs | Per hour (plan) |
| Functions | Event-driven, serverless | Per execution |
| Container Instances | Quick container deployment | Per second |
| AKS | Container orchestration | Per VM node |
| Batch | Parallel processing | Per compute hour |

## Best Practices

1. **Right-sizing**: Choose appropriate VM sizes
2. **Auto-scaling**: Enable for variable workloads
3. **Availability Zones**: Use for high availability
4. **Reserved Instances**: Save costs for steady workloads
5. **Monitoring**: Azure Monitor for all compute resources
6. **Managed Disks**: Use instead of unmanaged
7. **Deploy slots**: Test before production (App Service)
8. **Security**: NSGs, Azure Firewall, private endpoints
9. **Backup**: Azure Backup for VMs
10. **Tags**: Organize resources and track costs

Azure's diverse compute offerings provide flexibility to choose the right service for your workload, from infrastructure control with VMs to serverless simplicity with Functions.
