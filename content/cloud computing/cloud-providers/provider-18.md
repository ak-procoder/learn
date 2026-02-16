---
id: provider-18
title: Azure Serverless and Containers
type: text
---

# Azure Serverless and Containers

Azure provides comprehensive serverless and container services that enable developers to build and deploy applications without managing infrastructure. These services range from event-driven serverless functions to full container orchestration platforms.

## Azure Functions (Revisited)

Serverless compute service for event-driven applications.

### Advanced Features

**Durable Functions**
- Stateful workflows in serverless
- Function chaining
- Fan-out/fan-in patterns
- Long-running orchestrations

**Durable Patterns:**

```csharp
// Function Chaining
[FunctionName("Chaining")]
public static async Task<object> Run(
    [OrchestrationTrigger] IDurableOrchestrationContext context)
{
    var result1 = await context.CallActivityAsync<string>("Step1", null);
    var result2 = await context.CallActivityAsync<string>("Step2", result1);
    var result3 = await context.CallActivityAsync<string>("Step3", result2);
    
    return result3;
}

// Fan-out/Fan-in
[FunctionName("FanOut")]
public static async Task Run(
    [OrchestrationTrigger] IDurableOrchestrationContext context)
{
    var parallelTasks = new List<Task<int>>();
    
    for (int i = 0; i < 10; i++)
    {
        Task<int> task = context.CallActivityAsync<int>("ProcessItem", i);
        parallelTasks.Add(task);
    }
    
    await Task.WhenAll(parallelTasks);
    
    var sum = parallelTasks.Sum(t => t.Result);
    return sum;
}
```

### Function App Configuration

**Application Settings**
```bash
# Set application setting
az functionapp config appsettings set \
  --name myFunctionApp \
  --resource-group myResourceGroup \
  --settings "MyKey=MyValue"

# Enable managed identity
az functionapp identity assign \
  --name myFunctionApp \
  --resource-group myResourceGroup
```

**Deployment**
```bash
# Deploy from local directory
func azure functionapp publish myFunctionApp

# Deploy from ZIP
az functionapp deployment source config-zip \
  --resource-group myResourceGroup \
  --name myFunctionApp \
  --src app.zip
```

### Function Bindings

**Input Bindings:**
- Azure Storage (Blob, Queue, Table)
- Cosmos DB
- Event Hubs
- Service Bus
- HTTP

**Output Bindings:**
- Same as input bindings
- Multiple output bindings per function

```csharp
[FunctionName("ProcessOrder")]
public static async Task Run(
    [QueueTrigger("orders")] string orderJson,
    [CosmosDB(
        databaseName: "OrderDB",
        collectionName: "Orders",
        ConnectionStringSetting = "CosmosDBConnection")] out dynamic document,
    [SendGrid(ApiKey = "SendGridKey")] IAsyncCollector<SendGridMessage> messages,
    ILogger log)
{
    var order = JsonConvert.DeserializeObject<Order>(orderJson);
    
    // Save to Cosmos DB
    document = new {
        id = order.Id,
        customerId = order.CustomerId,
        total = order.Total
    };
    
    // Send email
    var message = new SendGridMessage();
    message.AddTo(order.CustomerEmail);
    message.SetSubject("Order Confirmation");
    message.AddContent("text/plain", $"Your order {order.Id} has been received.");
    await messages.AddAsync(message);
}
```

## Azure Logic Apps

Serverless workflow orchestration service.

### Key Features

- **Visual Designer**: Low-code/no-code development
- **400+ Connectors**: SaaS apps, Azure services, on-premises systems
- **Built-in Triggers**: Schedule, HTTP, events
- **Control Flow**: Conditions, loops, switch, scope
- **Enterprise Integration**: B2B messaging, EDI

### Logic App Components

```plaintext
Trigger (When something happens)
    ↓
Actions (Do something)
    ├── Condition
    ├── Loop (For Each)
    ├── HTTP Request
    ├── Send Email
    └── Create Database Record
```

### Example Logic App (JSON)

```json
{
  "definition": {
    "$schema": "https://schema.management.azure.com/providers/Microsoft.Logic/schemas/2016-06-01/workflowdefinition.json#",
    "triggers": {
      "When_a_new_email_arrives": {
        "type": "ApiConnection",
        "inputs": {
          "host": {
            "connection": {
              "name": "@parameters('$connections')['office365']['connectionId']"
            }
          },
          "method": "get",
          "path": "/Mail/OnNewEmail"
        }
      }
    },
    "actions": {
      "Parse_JSON": {
        "type": "ParseJson",
        "inputs": {
          "content": "@triggerBody()",
          "schema": {}
        }
      },
      "Condition": {
        "type": "If",
        "expression": {
          "contains": ["@body('Parse_JSON')?['subject']", "urgent"]
        },
        "actions": {
          "Send_notification": {
            "type": "ApiConnection",
            "inputs": {
              "host": {
                "connection": {
                  "name": "@parameters('$connections')['teams']['connectionId']"
                }
              },
              "method": "post",
              "path": "/v3/teams/@{encodeURIComponent('teamId')}/channels/@{encodeURIComponent('channelId')}/messages"
            }
          }
        }
      }
    }
  }
}
```

### Use Cases

- **Email Processing**: Parse, route, archive emails
- **Social Media Monitoring**: Track mentions, sentiment
- **File Processing**: Move, convert, analyze files
- **Business Processes**: Approval workflows, notifications
- **Integration**: Connect cloud and on-premises systems

## Azure Container Registry (ACR)

Managed Docker registry service for storing and managing container images.

### Features

**Image Storage**
- Docker images
- Helm charts
- OCI artifacts
- Unlimited storage (pay per GB)

**Geo-Replication**
- Replicate to multiple regions
- Low-latency local pulls
- Single management interface

**Security**
- Azure AD integration
- RBAC
- Content trust
- Image vulnerability scanning

**Tiering:**
| Tier | Features | Webhooks | Geo-replication |
|------|----------|----------|-----------------|
| Basic | 10 GB storage | 2 | No |
| Standard | 100 GB storage | 10 | No |
| Premium | 500 GB storage | 500 | Yes |

### ACR Operations

```bash
# Create container registry
az acr create \
  --resource-group myResourceGroup \
  --name myContainerRegistry \
  --sku Standard \
  --location eastus

# Login to ACR
az acr login --name myContainerRegistry

# Tag image
docker tag myapp:latest mycontainerregistry.azurecr.io/myapp:v1

# Push image
docker push mycontainerregistry.azurecr.io/myapp:v1

# List images
az acr repository list \
  --name myContainerRegistry \
  --output table

# Enable admin account (for development only)
az acr update \
  --name myContainerRegistry \
  --admin-enabled true

# Get credentials
az acr credential show \
  --name myContainerRegistry
```

### ACR Tasks

Build, test, and push images in the cloud.

```bash
# Quick build
az acr build \
  --registry myContainerRegistry \
  --image myapp:v1 \
  --file Dockerfile \
  .

# Create task for automated builds
az acr task create \
  --registry myContainerRegistry \
  --name buildTask \
  --image myapp:{{.Run.ID}} \
  --context https://github.com/user/repo.git \
  --file Dockerfile \
  --git-access-token <token>

# Trigger task on git commit
az acr taskrun create \
  --registry myContainerRegistry \
  --task buildTask
```

## Azure Container Instances (ACI) (Revisited)

### Multi-Container Groups

Deploy multiple containers together (pod-like).

```yaml
apiVersion: 2019-12-01
location: eastus
name: myContainerGroup
properties:
  containers:
  - name: web
    properties:
      image: myregistry.azurecr.io/web:latest
      resources:
        requests:
          cpu: 1
          memoryInGb: 1.5
      ports:
      - port: 80
        protocol: TCP
  - name: sidecar
    properties:
      image: myregistry.azurecr.io/logger:latest
      resources:
        requests:
          cpu: 0.5
          memoryInGb: 0.5
  osType: Linux
  ipAddress:
    type: Public
    ports:
    - protocol: TCP
      port: 80
  imageRegistryCredentials:
  - server: myregistry.azurecr.io
    username: myregistry
    password: <password>
type: Microsoft.ContainerInstance/containerGroups
```

### Volume Mounting

```bash
# Create file share
az storage share create \
  --name myshare \
  --account-name mystorageaccount

# Deploy container with volume
az container create \
  --resource-group myResourceGroup \
  --name mycontainer \
  --image nginx \
  --azure-file-volume-account-name mystorageaccount \
  --azure-file-volume-account-key <key> \
  --azure-file-volume-share-name myshare \
  --azure-file-volume-mount-path /data
```

## Azure Kubernetes Service (AKS) (Revisited)

### Advanced AKS Features

**Virtual Nodes**
- Serverless Kubernetes
- Powered by Azure Container Instances
- Burst capacity
- Second-scale startup

```bash
# Enable virtual nodes
az aks enable-addons \
  --resource-group myResourceGroup \
  --name myAKSCluster \
  --addons virtual-node \
  --subnet-name mySubnet
```

**Azure Policy for AKS**
- Enforce organizational standards
- Pod security policies
- Resource limits
- Image sources

**GitOps with Flux**
```bash
# Enable GitOps
az k8s-configuration create \
  --cluster-name myAKSCluster \
  --resource-group myResourceGroup \
  --name cluster-config \
  --operator-instance-name cluster-config \
  --operator-namespace cluster-config \
  --repository-url https://github.com/user/gitops-repo \
  --scope cluster \
  --cluster-type managedClusters
```

**Azure Monitor for Containers**
- Container insights
- Live log streaming
- Performance metrics
- Prometheus integration

### AKS Networking

**kubenet (Basic)**
- Azure assigns IP from subnet to nodes
- Pods use different address space
- NAT for pod traffic

**Azure CNI (Advanced)**
- Pods get IP from VNet
- Direct connectivity
- More IP address consumption

```bash
# Create AKS with Azure CNI
az aks create \
  --resource-group myResourceGroup \
  --name myAKSCluster \
  --network-plugin azure \
  --vnet-subnet-id <subnet-id> \
  --docker-bridge-address 172.17.0.1/16 \
  --dns-service-ip 10.2.0.10 \
  --service-cidr 10.2.0.0/24
```

### AKS Authentication

**Azure AD Integration**
```bash
# Create AKS with Azure AD
az aks create \
  --resource-group myResourceGroup \
  --name myAKSCluster \
  --enable-aad \
  --aad-admin-group-object-ids <admin-group-id>
```

**Kubernetes RBAC**
```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: dev-user-binding
  namespace: development
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: edit
subjects:
- kind: Group
  name: <azure-ad-group-id>
  apiGroup: rbac.authorization.k8s.io
```

## Azure Service Fabric

Distributed systems platform for packaging, deploying, and managing microservices.

### Features

- **Stateful and Stateless Services**
- **Built-in Health Monitoring**
- **Automatic Scaling**
- **Rolling Upgrades**
- **Self-Healing**

### Programming Models

**Reliable Services**
- Stateless or stateful
- .NET Core or Java

**Reliable Actors**
- Virtual actor pattern
- Automatic lifecycle management

**Guest Executables**
- Any executable
- Node.js, Python, etc.

**Containers**
- Windows and Linux containers
- Docker Compose support

## Comparison Table

| Service | Use Case | Abstraction Level | Pricing |
|---------|----------|-------------------|---------|
| Functions | Event-driven tasks | Function | Per execution |
| Logic Apps | Workflow orchestration | Workflow | Per action |
| ACI | Quick container deployment | Container | Per second |
| AKS | Container orchestration | Pod | Per VM node |
| Service Fabric | Microservices platform | Service | Per VM node |

## Best Practices

### Serverless
1. **Idempotent functions**: Handle retries gracefully
2. **Stateless design**: Store state externally
3. **Optimize cold starts**: Keep functions lightweight
4. **Use managed identities**: Secure authentication
5. **Monitor and alert**: Application Insights integration

### Containers
1. **Multi-stage builds**: Smaller images
2. **Non-root users**: Security best practice
3. **Health checks**: Liveness and readiness probes
4. **Resource limits**: CPU and memory constraints
5. **Image scanning**: Vulnerability detection
6. **Secrets management**: Azure Key Vault
7. **Network policies**: Restrict pod communication
8. **Auto-scaling**: HPA and cluster autoscaler
9. **Regular updates**: Keep images updated
10. **Monitoring**: Container insights, logs

Azure's serverless and container services provide flexible deployment options for modern applications, from simple event-driven functions to complex orchestrated microservices architectures.
