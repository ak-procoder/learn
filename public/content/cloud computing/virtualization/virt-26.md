---
id: virt-26
title: "Serverless Containers"
type: text
---

# Serverless Containers

Serverless containers combine the benefits of containerization with the simplicity of serverless computing.

## Serverless Container Platforms

**AWS Fargate**:
- Runs containers without managing servers
- Works with ECS and EKS
- Pay per vCPU and memory usage
- Automatic scaling

**Google Cloud Run**:
- Fully managed container platform
- Scales to zero
- Pay per request
- Supports any language/framework

**Azure Container Instances (ACI)**:
- Fast container startup
- Per-second billing
- No cluster management
- Integration with AKS

**AWS Lambda with containers**:
- Up to 10GB container images
- Same Lambda benefits
- Familiar container tooling

## Use Cases

- **Web applications**: Auto-scaling HTTP services
- **APIs**: RESTful and GraphQL endpoints
- **Batch processing**: Event-driven jobs
- **CI/CD**: Build and test runners
- **Data processing**: ETL pipelines

## Benefits vs Kubernetes

**Pros**:
- No cluster management
- Simpler operations
- Lower minimum cost
- Faster deployment

**Cons**:
- Less control
- Vendor lock-in
- Cold start latency
- Limited customization

Choose serverless containers for simpler workloads; Kubernetes for complex, custom requirements.
