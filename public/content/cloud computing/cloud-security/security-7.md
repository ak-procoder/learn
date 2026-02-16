---
id: security-7
title: "Network Security Fundamentals"
type: text
---

# Network Security Fundamentals

Network security in the cloud controls traffic flow and isolates resources.

## Cloud Network Security Layers

**Perimeter Security**:
- DDoS protection
- Web application firewall
- CDN security

**Network Isolation**:
- Virtual Private Cloud (VPC)
- Subnets
- Network segmentation

**Traffic Control**:
- Security groups
- Network ACLs
- Firewall rules

**Connectivity Security**:
- VPN connections
- Private links
- Service endpoints

## Virtual Private Cloud (VPC)

**Characteristics**:
- Logically isolated network
- IP address range (CIDR block)
- Subnets across availability zones
- Route tables and gateways

**Public vs Private Subnets**:
- **Public**: Route to internet gateway
- **Private**: No direct internet access
- NAT for outbound from private

## Network Segmentation

**Purpose**:
- Isolate workloads
- Limit blast radius
- Compliance requirements
- Defense in depth

**Patterns**:
```
VPC
├── Public Subnet (Web Tier)
│   ├── Load Balancer
│   └── Web Servers
├── Private Subnet (App Tier)
│   └── Application Servers
└── Private Subnet (Data Tier)
    └── Databases
```

## Security Groups vs Network ACLs

**Security Groups** (Stateful):
- Instance-level
- Allow rules only
- Stateful (return traffic automatic)
- Evaluate all rules

**Network ACLs** (Stateless):
- Subnet-level
- Allow and deny rules
- Stateless (explicit inbound/outbound)
- Processed in order

## VPN and Private Connectivity

**Site-to-Site VPN**:
- Connect on-premises to cloud
- Encrypted tunnel over internet
- Lower cost, variable bandwidth

**Direct Connect/ExpressRoute/Interconnect**:
- Dedicated physical connection
- Consistent bandwidth
- Lower latency
- Higher cost

**VPC Peering**:
- Connect VPCs privately
- Same or different accounts
- No transit routing
- Non-overlapping CIDR blocks

Network security is foundational for protecting cloud resources.
