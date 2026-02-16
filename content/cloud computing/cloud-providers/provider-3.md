---
id: provider-3
title: AWS EC2 - Elastic Compute Cloud
type: text
---

# AWS EC2 - Elastic Compute Cloud

Amazon Elastic Compute Cloud (EC2) is one of the foundational services of AWS, providing scalable virtual computing resources in the cloud. EC2 allows users to launch and manage virtual servers, known as instances, with complete control over the computing environment.

## What is EC2?

EC2 is a web service that provides secure, resizable compute capacity in the cloud. It is designed to make web-scale cloud computing easier for developers by offering:

- **Virtual Machines**: Launch instances from Amazon Machine Images (AMIs)
- **Scalability**: Scale capacity up or down within minutes
- **Complete Control**: Root access to each instance
- **Flexible Configuration**: Choose instance types, operating systems, and network settings
- **Pay-as-You-Go**: Only pay for compute capacity you actually use

## Instance Types

EC2 offers various instance types optimized for different use cases:

### General Purpose
- **T-Series (T3, T4g)**: Burstable performance for variable workloads
- **M-Series (M6i, M7g)**: Balanced compute, memory, and networking

### Compute Optimized
- **C-Series (C6i, C7g)**: High-performance processors for compute-intensive tasks
- Ideal for batch processing, gaming servers, high-performance web servers

### Memory Optimized
- **R-Series (R6i, R7g)**: Large memory for memory-intensive applications
- **X-Series (X2idn)**: Lowest cost per GiB of memory
- Perfect for databases, in-memory caches, real-time analytics

### Storage Optimized
- **I-Series (I4i)**: High IOPS and storage throughput
- **D-Series (D3)**: Dense storage for data warehousing

### Accelerated Computing
- **P-Series (P4)**: GPU instances for machine learning and HPC
- **Inf-Series (Inf2)**: AWS Inferentia for ML inference
- **G-Series (G5)**: Graphics-intensive applications

## Instance Lifecycle

```plaintext
Pending → Running → Stopping → Stopped → Terminating → Terminated
                ↓
            Rebooting
```

**States Explained**:
- **Pending**: Instance is launching
- **Running**: Instance is operational and billable
- **Stopping**: Instance is shutting down
- **Stopped**: Instance is shut down (not billable for compute, but storage charges apply)
- **Terminated**: Instance is permanently deleted

## Pricing Models

### On-Demand Instances
- Pay by the hour or second
- No long-term commitments
- Ideal for unpredictable workloads

### Reserved Instances
- 1 or 3-year commitment
- Up to 75% discount compared to On-Demand
- Standard, Convertible, and Scheduled Reserved Instances

### Spot Instances
- Bid on spare EC2 capacity
- Up to 90% discount
- Can be interrupted with 2-minute notice
- Perfect for fault-tolerant, flexible applications

### Savings Plans
- Flexible pricing model
- Commitment to consistent usage ($/hour)
- Up to 72% savings

### Dedicated Hosts
- Physical servers dedicated to your use
- Helps meet compliance requirements
- Bring your own licenses (BYOL)

## AMI - Amazon Machine Images

AMIs are pre-configured templates for EC2 instances containing:
- Operating system
- Application server
- Applications and configurations

**AMI Types**:
- **AWS Marketplace AMIs**: Third-party software
- **Community AMIs**: Shared by AWS users
- **Custom AMIs**: Create your own for consistent deployments

## Security Features

### Security Groups
- Virtual firewalls controlling inbound and outbound traffic
- Stateful (return traffic automatically allowed)
- Support for allow rules only

### Key Pairs
- Secure SSH access to Linux instances
- RDP access to Windows instances
- Public-private key cryptography

### IAM Roles
- Assign permissions to EC2 instances
- Secure way to grant access to AWS resources
- No hard-coded credentials needed

## Best Practices

1. **Right-sizing**: Choose appropriate instance types for your workload
2. **Auto Scaling**: Automatically adjust capacity based on demand
3. **Use Latest Generation**: Newer instances offer better price-performance
4. **Regular Backups**: Create AMIs and snapshots regularly
5. **Monitoring**: Use CloudWatch for performance metrics
6. **Security**: Keep security groups restrictive and update regularly
7. **Cost Optimization**: Use Reserved Instances, Spot Instances, or Savings Plans
8. **Tag Resources**: Use tags for organization and cost allocation

## Common Use Cases

- **Web Hosting**: Host websites and web applications
- **Batch Processing**: Process large datasets
- **Development/Testing**: Create temporary environments
- **Gaming Servers**: Host multiplayer game servers
- **Machine Learning**: Train and deploy ML models
- **High-Performance Computing**: Scientific simulations and research

EC2 forms the backbone of many cloud architectures, providing the fundamental compute power needed for virtually any application in the cloud.
