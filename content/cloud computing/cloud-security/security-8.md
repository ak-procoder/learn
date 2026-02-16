---
id: security-8
title: "Security Groups and Firewalls"
type: text
---

# Security Groups and Firewalls

Security groups and firewall rules control traffic to and from cloud resources.

## AWS Security Groups

**Stateful Firewall**:
- Instance-level protection
- Allow rules only (implicit deny)
- Return traffic automatically allowed
- Up to 5 security groups per instance

**Example**:
```
Security Group: web-servers
Inbound Rules:
- HTTP (80) from 0.0.0.0/0
- HTTPS (443) from 0.0.0.0/0
- SSH (22) from 203.0.113.0/24

Outbound Rules:
- All traffic to 0.0.0.0/0
```

**Best Practices**:
- Default deny all inbound
- Least privilege
- Reference other security groups
- Descriptive names and tags
- Regular reviews

## Azure Network Security Groups (NSG)

**Features**:
- Subnet or NIC level
- Allow and deny rules
- Priority-based (100-4096)
- Default rules (can't delete)

**NSG Rule**:
```
Priority: 100
Name: AllowHTTP
Source: Internet
Destination: VirtualNetwork
Service: HTTP
Action: Allow
```

**Default Rules**:
- Allow VNet traffic
- Allow Azure Load Balancer
- Deny all other inbound

## Google Cloud Firewall Rules

**VPC-Level**:
- Apply to entire VPC
- Target instances by tags
- Priority-based (0-65535)
- Stateful

**Example**:
```bash
gcloud compute firewall-rules create allow-web \
  --allow tcp:80,tcp:443 \
  --source-ranges 0.0.0.0/0 \
  --target-tags web-server
```

**Firewall Rule Components**:
- Direction: Ingress or egress
- Priority: Lower number = higher priority
- Action: Allow or deny
- Target: Tags or service accounts
- Source/Destination: IP ranges, tags
- Protocols and ports

## Advanced Firewall Features

**Application-Layer Filtering**:
- Deep packet inspection
- Protocol-specific rules
- Content filtering

**Geo-Blocking**:
- Block/allow by country
- Compliance requirements
- Threat mitigation

**Rate Limiting**:
- Prevent DDoS
- API protection
- Resource protection

## Logging and Monitoring

**VPC Flow Logs**:
- Network traffic logs
- Security analysis
- Troubleshooting
- Compliance

**Firewall Logs**:
- Rule hit counts
- Denied traffic
- Security insights

## Common Mistakes

- Over-permissive rules (0.0.0.0/0)
- Unused rules accumulation
- No documentation
- Inconsistent naming
- Missing monitoring
- No regular audits

Properly configured security groups and firewalls are critical for network security.
