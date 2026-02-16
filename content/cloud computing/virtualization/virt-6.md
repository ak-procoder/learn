---
id: virt-6
title: Introduction to Kubernetes
type: text
---

## What is Kubernetes?

**Definition**: Open-source container orchestration platform for automating deployment, scaling, and management of containerized applications

**Also Called**: K8s (numeronym: K-8 letters-s)

**Origin**: Developed by Google, based on their internal Borg system, released 2014

**Maintained By**: Cloud Native Computing Foundation (CNCF)

## Why Kubernetes?

### Problems Kubernetes Solves

**Manual Container Management**:
- Deploying 100s-1000s of containers manually
- Scaling challenges
- Health monitoring
- Load distribution
- Service discovery

**High Availability**:
- Automatic failover
- Self-healing
- Zero downtime deployments

**Resource Optimization**:
- Efficient resource allocation
- Automatic scaling
- Multitenancy

### Key Benefits

**Automated Operations**:
- Self-healing
- Auto-scaling
- Auto-placement
- Rollback capabilities

**Portability**:
- Run anywhere: on-premises, cloud, hybrid
- Not locked to specific cloud provider
- Consistent across environments

**Declarative Configuration**:
- Describe desired state
- Kubernetes ensures actual state matches
- Infrastructure as Code

**Ecosystem**:
- Huge community
- Rich tooling
- Service mesh, monitoring, CI/CD integration

## Kubernetes Architecture

### Control Plane (Master)

**Components**:

**API Server (kube-apiserver)**:
- Front-end for Kubernetes
- RESTful API
- Authentication and authorization
- Validates and processes requests

**etcd**:
- Distributed key-value store
- Cluster state storage
- Configuration data
- Service discovery

**Scheduler (kube-scheduler)**:
- Assigns Pods to Nodes
- Resource requirements
- Constraints and policies
- Load balancing

**Controller Manager (kube-controller-manager)**:
- Runs controller processes
- Node controller
- Replication controller
- Endpoints controller
- Service account controller

**Cloud Controller Manager**:
- Cloud-specific control logic
- Load balancers
- Storage
- Routing

### Worker Nodes

**Components**:

**Kubelet**:
- Agent on each node
- Ensures containers running
- Communicates with control plane
- Reports node and pod status

**Container Runtime**:
- Runs containers
- Docker, containerd, CRI-O
- Pulls images
- Manages container lifecycle

**Kube-proxy**:
- Network proxy on each node
- Maintains network rules
- Load balancing traffic
- Service abstraction

**Architecture Diagram**:
```
[Control Plane]
  ├── API Server
  ├── etcd
  ├── Scheduler
  └── Controller Manager

[Worker Node 1]         [Worker Node 2]
  ├── Kubelet             ├── Kubelet
  ├── Kube-proxy          ├── Kube-proxy
  ├── Container Runtime   ├── Container Runtime
  └── Pods                └── Pods
```

## Core Concepts

### Pods

**Definition**: Smallest deployable unit in Kubernetes

**Characteristics**:
- One or more containers
- Share network namespace
- Share volumes
- Scheduled together
- Ephemeral (can be destroyed/recreated)

**Use Cases**:
- Single container (most common)
- Tightly coupled containers (sidecar pattern)

### Services

**Definition**: Abstraction to expose Pods

**Types**:

**ClusterIP** (default):
- Internal cluster access only
- Virtual IP for service

**NodePort**:
- Exposes service on each node's IP
- External access via <NodeIP>:<NodePort>

**LoadBalancer**:
- Cloud provider load balancer
- External IP address
- Routes traffic to service

**ExternalName**:
- Maps to DNS name

### Deployments

**Definition**: Declarative updates for Pods

**Features**:
- Desired state specification
- Rolling updates
- Rollback capability
- Scaling
- Self-healing

### Namespaces

**Definition**: Virtual clusters within physical cluster

**Use Cases**:
- Multi-tenancy
- Environment separation (dev, staging, prod)
- Resource isolation
- Team separation

**Default Namespaces**:
- `default`: Default namespace
- `kube-system`: Kubernetes system components
- `kube-public`: Public resources
- `kube-node-lease`: Node heartbeats

## Kubernetes Objects

All Kubernetes objects are defined using YAML (or JSON)

**Pod Example**:
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx-pod
  labels:
    app: nginx
spec:
  containers:
  - name: nginx
    image: nginx:1.21
    ports:
    - containerPort: 80
```

**Deployment Example**:
```yaml
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
```

## kubectl - Kubernetes CLI

**Basic Commands**:

```bash
# Get cluster info
kubectl cluster-info

# List nodes
kubectl get nodes

# List pods
kubectl get pods
kubectl get pods -n namespace

# Describe resource
kubectl describe pod <pod-name>

# Create resource from YAML
kubectl apply -f deployment.yaml

# Delete resource
kubectl delete -f deployment.yaml
kubectl delete pod <pod-name>

# View logs
kubectl logs <pod-name>

# Execute command in pod
kubectl exec -it <pod-name> -- /bin/bash

# Scale deployment
kubectl scale deployment <name> --replicas=5
```

## When to Use Kubernetes

**Good Fit**:
- Microservices architecture
- Cloud-native applications
- Need high availability
- Frequent deployments
- Variable workloads
- Multi-cloud strategy

**Might Be Overkill**:
- Simple monolithic applications
- Small-scale applications
- Limited team expertise
- Simple deployment needs

## Kubernetes Ecosystem

**Cloud Providers**:
- Amazon EKS
- Azure AKS
- Google GKE
- DigitalOcean Kubernetes

**Service Mesh**:
- Istio
- Linkerd
- Consul

**Monitoring**:
- Prometheus
- Grafana
- Datadog

**CI/CD**:
- Jenkins
- GitLab CI
- Argo CD
- Flux

**Package Management**:
- Helm
- Kustomize
