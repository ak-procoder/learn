---
id: provider-8
title: AWS Containers - ECS, EKS, Fargate
type: text
---

# AWS Containers - ECS, EKS, Fargate

AWS provides comprehensive container orchestration services that enable you to run, scale, and manage containerized applications. The primary services include ECS (Elastic Container Service), EKS (Elastic Kubernetes Service), and Fargate for serverless container execution.

## Container Fundamentals on AWS

Containers package application code with dependencies, enabling consistent deployment across environments. AWS offers multiple ways to run containers based on your orchestration needs.

### AWS Container Service Comparison

| Feature | ECS | EKS | Fargate |
|---------|-----|-----|---------|
| Orchestration | AWS proprietary | Kubernetes | Serverless (ECS/EKS) |
| Learning Curve | Lower | Higher | Lowest |
| Control Plane Cost | Free | $0.10/hour/cluster | Free |
| Kubernetes API | No | Yes | Yes (with EKS) |
| Flexibility | AWS-specific | Portable | Limited control |

## Amazon ECR (Elastic Container Registry)

Before discussing orchestration, let's cover container storage.

**Features:**
- Fully managed Docker container registry
- Integrated with ECS and EKS
- Encrypted at rest
- Vulnerability scanning
- Lifecycle policies for image cleanup
- Cross-region and cross-account replication

```bash
# ECR workflow
aws ecr create-repository --repository-name my-app
aws ecr get-login-password | docker login --username AWS --password-stdin <account-id>.dkr.ecr.<region>.amazonaws.com
docker build -t my-app .
docker tag my-app:latest <account-id>.dkr.ecr.<region>.amazonaws.com/my-app:latest
docker push <account-id>.dkr.ecr.<region>.amazonaws.com/my-app:latest
```

## Amazon ECS (Elastic Container Service)

ECS is AWS's fully managed container orchestration service that makes it easy to run, stop, and manage Docker containers.

### ECS Architecture

```plaintext
ECS Cluster
├── ECS Service (maintains desired count)
│   └── Task Definition (blueprint)
│       └── Container Definitions
├── EC2 Launch Type
│   └── EC2 Instances (you manage)
└── Fargate Launch Type
    └── Serverless (AWS manages)
```

### Key Components

**Cluster**
- Logical grouping of tasks or services
- Can span multiple AZs
- Mix of EC2 and Fargate launch types

**Task Definition**
```json
{
  "family": "web-app",
  "containerDefinitions": [{
    "name": "web",
    "image": "nginx:latest",
    "memory": 512,
    "cpu": 256,
    "portMappings": [{
      "containerPort": 80,
      "protocol": "tcp"
    }],
    "environment": [{
      "name": "ENV",
      "value": "production"
    }]
  }],
  "requiresCompatibilities": ["FARGATE"],
  "networkMode": "awsvpc",
  "cpu": "256",
  "memory": "512"
}
```

**Task**
- Running instance of task definition
- Containers run on same host
- Share resources and networking

**Service**
- Maintains desired number of tasks
- Integrated with load balancers
- Auto scaling support
- Rolling deployments

### Launch Types

**EC2 Launch Type**
- You manage EC2 instances
- More control over infrastructure
- Use Reserved Instances or Spot for cost savings
- Install ECS agent on instances

**Fargate Launch Type**
- Serverless compute for containers
- No infrastructure management
- Pay for vCPU and memory resources
- Simplified operations

### ECS Service Auto Scaling

**Target Tracking**
- Scale based on CloudWatch metrics
- Example: CPU utilization > 70%

**Step Scaling**
- Scale in steps based on alarm
- Different scaling increments

**Scheduled Scaling**
- Predictable load patterns
- Time-based scaling

### Networking Modes

**awsvpc (recommended)**
- Each task gets its own ENI
- Task-level security groups
- Required for Fargate

**bridge**
- Default Docker bridge
- Port mapping required
- Multiple containers share host port space

**host**
- Container uses host's network
- Better performance
- Port conflicts possible

## Amazon EKS (Elastic Kubernetes Service)

EKS is a fully managed Kubernetes service that makes it easy to run Kubernetes on AWS without managing the control plane.

### EKS Architecture

```plaintext
EKS Cluster
├── Control Plane (AWS managed)
│   ├── API Server
│   ├── etcd
│   └── Controller Manager
└── Data Plane (Worker Nodes)
    ├── Managed Node Groups
    ├── Self-Managed Nodes
    └── Fargate Pods
```

### Key Components

**Control Plane**
- Fully managed by AWS
- Multi-AZ for high availability
- Automatic updates and patching
- $0.10 per hour per cluster

**Worker Nodes**

**Managed Node Groups**
- AWS manages EC2 instance provisioning
- Automated updates with one click
- Based on EKS-optimized AMIs
- Auto Scaling group integration

**Self-Managed Nodes**
- Full control over EC2 instances
- Custom AMIs and configurations
- More operational overhead

**Fargate for EKS**
- Serverless compute for pods
- No node management
- Define which pods run on Fargate via profiles

### Kubernetes on EKS

```yaml
# Example Deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.21
        ports:
        - containerPort: 80
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
---
# Service
apiVersion: v1
kind: Service
metadata:
  name: nginx-service
spec:
  type: LoadBalancer
  selector:
    app: nginx
  ports:
  - port: 80
    targetPort: 80
```

### EKS Add-ons

**AWS Load Balancer Controller**
- Manage ALB and NLB from Kubernetes
- Ingress and Service resources

**Amazon EBS CSI Driver**
- Persistent volumes with EBS
- Dynamic volume provisioning

**Amazon EFS CSI Driver**
- Shared file storage
- ReadWriteMany volumes

**CoreDNS**
- Service discovery
- DNS-based service resolution

**kube-proxy**
- Network proxy
- Service abstraction

**VPC CNI**
- Native VPC networking
- Each pod gets VPC IP address

### EKS Best Practices

1. **Use managed node groups**: Simplified operations
2. **IRSA (IAM Roles for Service Accounts)**: Fine-grained permissions
3. **Cluster Autoscaler**: Automatic node scaling
4. **Horizontal Pod Autoscaler**: Scale pods based on metrics
5. **Network policies**: Secure pod-to-pod communication
6. **Secrets management**: AWS Secrets Manager or Parameter Store
7. **Monitoring**: Container Insights, Prometheus, Grafana

## AWS Fargate

Fargate is a serverless compute engine for containers that works with both ECS and EKS.

### Benefits

**No Server Management**
- No EC2 instances to provision
- No patching or scaling infrastructure
- Focus on applications, not infrastructure

**Right-Sized Resources**
- Specify exact CPU and memory
- Granular pricing
- No over-provisioning

**Secure Isolation**
- Each task/pod runs in its own kernel
- Enhanced security boundary
- No shared resources with other customers

**Integrated with AWS**
- VPC networking
- IAM for authentication
- CloudWatch for monitoring
- Application Load Balancer integration

### Fargate Task Sizing

**CPU Options:** 0.25 vCPU, 0.5 vCPU, 1 vCPU, 2 vCPU, 4 vCPU, 8 vCPU, 16 vCPU

**Memory Options:** Based on CPU selection
- 0.25 vCPU: 0.5 GB to 2 GB
- 0.5 vCPU: 1 GB to 4 GB
- 1 vCPU: 2 GB to 8 GB
- 2 vCPU: 4 GB to 16 GB
- 4 vCPU: 8 GB to 30 GB

### Fargate Pricing

```plaintext
Price = (CPU hours × CPU price) + (Memory hours × Memory price)

Example (us-east-1):
- CPU: $0.04048 per vCPU per hour
- Memory: $0.004445 per GB per hour

Task: 1 vCPU, 2 GB, running 1 hour
= (1 × $0.04048) + (2 × $0.004445)
= $0.04048 + $0.00889
= $0.04937 per hour
```

## Container Deployment Strategies

### Blue/Green Deployment
```plaintext
Blue (Current)        Green (New)
    v1.0                 v2.0
     ↓                    ↓
Load Balancer switches traffic
```

- Deploy new version alongside old
- Test before switching traffic
- Quick rollback

### Rolling Deployment
```plaintext
Update instances gradually:
v1.0  v1.0  v1.0  v1.0
  ↓
v2.0  v1.0  v1.0  v1.0
  ↓
v2.0  v2.0  v1.0  v1.0
  ↓
v2.0  v2.0  v2.0  v2.0
```

- Gradual replacement
- No downtime
- Slower rollback

### Canary Deployment
```plaintext
90% traffic → v1.0
10% traffic → v2.0 (test)

If successful:
100% traffic → v2.0
```

- Test with small traffic percentage
- Monitor metrics
- Gradual rollout

## Monitoring and Logging

**CloudWatch Container Insights**
- Cluster, service, task metrics
- CPU, memory, network utilization
- Performance monitoring dashboard

**AWS X-Ray**
- Distributed tracing
- Request flow visualization
- Performance bottleneck identification

**AWS App Mesh**
- Service mesh for microservices
- Traffic management
- Observability and debugging

## Use Cases

- **Microservices**: Independently deployable services
- **Batch Processing**: Parallel job execution
- **CI/CD**: Build and test environments
- **Machine Learning**: Training and inference workloads
- **Web Applications**: Scalable web hosting
- **Data Processing**: ETL and analytics pipelines

## Best Practices

1. **Right-size containers**: Match resources to workload
2. **Use health checks**: Ensure container reliability
3. **Implement logging**: Centralized log aggregation
4. **Security scanning**: Scan images for vulnerabilities
5. **Use secrets management**: Never hardcode credentials
6. **Tag resources**: Cost allocation and organization
7. **Multi-AZ deployment**: High availability
8. **Auto scaling**: Handle variable load
9. **CI/CD integration**: Automate deployments
10. **Monitor costs**: Track and optimize spending

AWS container services provide flexible, scalable, and managed solutions for running containerized applications, from simple workloads on ECS to complex Kubernetes deployments on EKS, with Fargate offering serverless simplicity for both.
