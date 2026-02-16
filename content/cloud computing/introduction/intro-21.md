---
id: intro-21
title: Cloud Computing Shared Responsibility Model
type: text
---

## Understanding Shared Responsibility

**Definition**: Security and compliance is a shared responsibility between cloud provider and customer.

**Key Principle**: Provider secures the cloud infrastructure; customer secures what's in the cloud.

## Provider Responsibilities

### Security OF the Cloud

**Physical Infrastructure**:
- Data center security
- Physical server protection
- Network infrastructure
- Power and cooling systems

**Platform Security**:
- Hypervisor security
- Host operating systems
- Physical network controls
- Service infrastructure

**Compliance**:
- Infrastructure certifications
- Physical security audits
- Network security compliance

## Customer Responsibilities

### Security IN the Cloud

**Data Protection**:
- Data classification
- Encryption management
- Access controls
- Data backup and retention

**Application Security**:
- Application code security
- Application configuration
- Patch management for applications
- Security testing

**Platform Management**:
- Operating system patches (if using IaaS)
- Network configuration
- Firewall configuration
- Identity and access management

**Compliance**:
- Meeting regulatory requirements
- Data residency compliance
- Industry-specific standards

## Varies by Service Model

### IaaS (Infrastructure as a Service)

**Customer Manages**:
- Operating systems
- Applications
- Data
- Runtime
- Middleware

**Provider Manages**:
- Virtualization
- Servers
- Storage
- Networking

### PaaS (Platform as a Service)

**Customer Manages**:
- Applications
- Data

**Provider Manages**:
- Runtime
- Middleware
- Operating system
- Virtualization
- Infrastructure

### SaaS (Software as a Service)

**Customer Manages**:
- Data (limited)
- User access
- Basic configurations

**Provider Manages**:
- Applications
- Data infrastructure
- Runtime
- Complete infrastructure stack

## Best Practices

- **Understand Your Responsibilities**: Know what you're responsible for based on service model
- **Implement Defense in Depth**: Don't rely solely on provider's security
- **Regular Audits**: Verify both parties are meeting responsibilities
- **Documentation**: Maintain clear records of security implementations
- **Communication**: Establish clear channels with provider for security issues
