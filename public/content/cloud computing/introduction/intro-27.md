---
id: intro-27
title: Cloud Computing Networking Fundamentals
type: text
---

## Cloud Network Architecture

### Virtual Private Cloud (VPC)

**Definition**: Isolated virtual network in the cloud

**Components**:
- IP address range (CIDR block)
- Subnets
- Route tables
- Network gateways
- Security groups

**Example**:
```
VPC: 10.0.0.0/16
├── Public Subnet: 10.0.1.0/24 (Web servers)
├── Private Subnet: 10.0.2.0/24 (App servers)
└── Private Subnet: 10.0.3.0/24 (Databases)
```

### Subnets

**Public Subnet**:
- Has route to Internet Gateway
- Resources get public IPs
- Web servers, load balancers

**Private Subnet**:
- No direct internet access
- Application servers, databases
- Access internet via NAT Gateway

### Route Tables

**Purpose**: Direct network traffic

**Example Routes**:
```
Destination         Target
10.0.0.0/16        Local (VPC)
0.0.0.0/0          Internet Gateway (public)
0.0.0.0/0          NAT Gateway (private)
```

## Network Security

### Security Groups

**Function**: Virtual firewall for instances

**Characteristics**:
- Stateful (return traffic automatically allowed)
- Allow rules only (no deny rules)
- Applied to instances/network interfaces

**Example**:
```
Inbound Rules:
- Allow HTTP (80) from 0.0.0.0/0
- Allow HTTPS (443) from 0.0.0.0/0
- Allow SSH (22) from 203.0.113.0/24

Outbound Rules:
- Allow All traffic to 0.0.0.0/0
```

### Network ACLs (Access Control Lists)

**Function**: Subnet-level firewall

**Characteristics**:
- Stateless (must configure inbound and outbound)
- Support both allow and deny rules
- Numbered rules processed in order

### Private Connectivity

**VPN (Virtual Private Network)**:
- Encrypted connection over internet
- Lower cost
- Variable performance

**Direct Connect / ExpressRoute**:
- Dedicated private connection
- Consistent network performance
- Higher cost
- Higher bandwidth

## Load Balancing

### Application Load Balancer

**Layer**: Layer 7 (Application layer)

**Features**:
- HTTP/HTTPS traffic
- Path-based routing
- Host-based routing
- WebSocket support

**Use Case**: Modern web applications, microservices

### Network Load Balancer

**Layer**: Layer 4 (Transport layer)

**Features**:
- TCP/UDP traffic
- Ultra-high performance
- Static IP addresses
- Low latency

**Use Case**: Gaming, IoT, TCP/UDP applications

### Global Load Balancer

**Purpose**: Distribute traffic across regions

**Benefits**:
- Geographic routing
- Disaster recovery
- Improved performance
- Global availability

## Content Delivery Network (CDN)

**Purpose**: Distribute content globally

**Benefits**:
- Reduce latency
- Decrease load on origin
- Improve availability
- DDoS protection

**Use Cases**:
- Static content (images, CSS, JS)
- Video streaming
- Software distribution
- API acceleration

## DNS and Domain Management

**Cloud DNS Services**:
- Highly available
- Scalable
- Low latency
- Global anycast network

**Routing Policies**:
- Simple: Single resource
- Weighted: Percentage-based distribution
- Latency: Route to lowest latency region
- Failover: Primary and backup resources
- Geolocation: Based on user location

## Network Monitoring

**Key Metrics**:
- Network throughput
- Packet loss
- Latency
- Connection count
- Traffic patterns

**Tools**:
- Flow logs
- Network packet capture
- Performance monitoring
- DDoS protection services
