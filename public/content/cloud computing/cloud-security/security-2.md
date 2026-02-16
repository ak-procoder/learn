---
id: security-2
title: "Shared Responsibility Model"
type: text
---

# Shared Responsibility Model

The shared responsibility model defines security obligations between cloud providers and customers.

## What is Shared Responsibility?

Security is split between:
- **Provider**: Security OF the cloud
- **Customer**: Security IN the cloud

## Provider Responsibilities

**Physical Security**:
- Data center access control
- Environmental controls
- Hardware disposal

**Infrastructure Security**:
- Network infrastructure
- Hypervisor security
- Physical servers and storage

**Managed Services**:
- Patching managed services
- Service availability
- Infrastructure resilience

## Customer Responsibilities

**Data Security**:
- Data encryption
- Data classification
- Backup and recovery

**Access Management**:
- User authentication
- Authorization policies
- Key management

**Application Security**:
- Application code
- Security configurations
- Patch management for apps

**Network Configuration**:
- Security groups
- Network ACLs
- VPC configuration

## Service Model Variations

**IaaS** (Infrastructure as a Service):
- Customer: OS, applications, data
- Provider: Hardware, hypervisor, network

**PaaS** (Platform as a Service):
- Customer: Applications, data
- Provider: OS, runtime, platform

**SaaS** (Software as a Service):
- Customer: Data, access management
- Provider: Everything else

## Visualization

```
             IaaS      PaaS      SaaS
Data          👤        👤        👤
Application   👤        👤        ☁️
Runtime       👤        ☁️        ☁️
OS            👤        ☁️        ☁️
Virtualization ☁️        ☁️        ☁️
Servers       ☁️        ☁️        ☁️
Storage       ☁️        ☁️        ☁️
Network       ☁️        ☁️        ☁️

👤 = Customer    ☁️ = Provider
```

Understanding this model prevents security gaps and overlaps.
