---
id: provider-5
title: AWS Networking - VPC, Route 53, CloudFront
type: text
---

# AWS Networking - VPC, Route 53, CloudFront

AWS provides a comprehensive suite of networking services that enable you to build secure, scalable, and highly available applications. The core services include VPC for network isolation, Route 53 for DNS management, and CloudFront for content delivery.

## Amazon VPC (Virtual Private Cloud)

VPC lets you provision a logically isolated section of the AWS Cloud where you can launch resources in a virtual network that you define.

### VPC Components

**Subnets**
- Subdivisions of VPC CIDR block
- **Public Subnet**: Has route to Internet Gateway
- **Private Subnet**: No direct internet access
- Distributed across Availability Zones

**Route Tables**
- Control traffic routing within VPC
- Each subnet associated with a route table
- Routes define destination and target

**Internet Gateway (IGW)**
- Horizontally scaled, redundant, highly available
- Allows communication between VPC and internet
- One IGW per VPC

**NAT Gateway/Instance**
- Enables private subnet instances to access internet
- Prevents inbound connections from internet
- NAT Gateway is managed service (preferred)

### VPC Architecture Example

```plaintext
VPC (10.0.0.0/16)
├── Public Subnet 1 (10.0.1.0/24) - AZ 1
│   ├── Web Server
│   └── NAT Gateway
├── Public Subnet 2 (10.0.2.0/24) - AZ 2
│   ├── Web Server
│   └── NAT Gateway
├── Private Subnet 1 (10.0.10.0/24) - AZ 1
│   └── Application Server
└── Private Subnet 2 (10.0.20.0/24) - AZ 2
    └── Database Server
```

### Security in VPC

**Security Groups**
- Virtual firewalls for instances
- Stateful (return traffic automatically allowed)
- Support allow rules only
- Can reference other security groups

**Network ACLs (NACLs)**
- Subnet-level firewalls
- Stateless (must explicitly allow return traffic)
- Support allow and deny rules
- Numbered rules processed in order

**Comparison Table**

| Feature | Security Group | Network ACL |
|---------|---------------|-------------|
| Level | Instance | Subnet |
| State | Stateful | Stateless |
| Rules | Allow only | Allow & Deny |
| Processing | All rules evaluated | Rules in order |
| Assignment | Multiple per instance | One per subnet |

### VPC Connectivity Options

**VPC Peering**
- Direct network connection between two VPCs
- Non-transitive (must peer each VPC directly)
- Can peer across regions and accounts
- No single point of failure

**AWS Transit Gateway**
- Central hub connecting VPCs and on-premises networks
- Simplifies network topology
- Scales to thousands of VPCs
- Regional resource with cross-region peering

**VPN Connection**
- Encrypted connection over internet
- **Site-to-Site VPN**: Connect on-premises to VPC
- **Client VPN**: Remote user access
- Uses IPsec protocol

**AWS Direct Connect**
- Dedicated network connection from premises to AWS
- More consistent network performance
- Reduce bandwidth costs
- Available in 1 Gbps and 10 Gbps
- Private and public virtual interfaces

### VPC Endpoints

Enable private connectivity to AWS services without internet gateway.

**Interface Endpoints (PrivateLink)**
- Powered by AWS PrivateLink
- Elastic Network Interface with private IP
- Supports many AWS services
- Charged per hour and per GB processed

**Gateway Endpoints**
- Target for route table
- Free to use
- Supports S3 and DynamoDB only

## Amazon Route 53

Route 53 is AWS's highly available and scalable DNS web service.

### Key Features

- **Domain Registration**: Register new domains
- **DNS Routing**: Route internet traffic to resources
- **Health Checking**: Monitor endpoint health
- **99.100% availability SLA**
- **Global service** (not region-specific)

### Routing Policies

**Simple Routing**
- Single resource for domain
- No health checks
- Multiple IP addresses returned randomly

**Weighted Routing**
- Distribute traffic across resources
- Assign weights (0-255)
- Useful for A/B testing, gradual migrations

**Latency-Based Routing**
- Route to region with lowest latency
- Based on user location
- Improved user experience globally

**Failover Routing**
- Active-passive failover
- Primary and secondary resources
- Health checks determine failover

**Geolocation Routing**
- Route based on user's geographic location
- Content localization
- Restrict content distribution

**Geoproximity Routing**
- Route based on geographic location of resources
- Bias values shift traffic toward/away from resource

**Multi-Value Answer Routing**
- Return multiple healthy values
- Like simple routing with health checks
- Up to 8 healthy records

### Health Checks

```plaintext
Health Check → Endpoint
- HTTP/HTTPS/TCP
- Monitor every 30s or 10s
- Healthy threshold: 3 consecutive successes
- Unhealthy threshold: 3 consecutive failures
- Can monitor CloudWatch alarms
```

## Amazon CloudFront

CloudFront is AWS's Content Delivery Network (CDN) service that securely delivers data, videos, applications, and APIs globally with low latency.

### Architecture

```plaintext
User Request
    ↓
Edge Location (Cache Check)
    ↓ (Cache Miss)
Origin (S3, EC2, ALB, Custom)
    ↓
Edge Location (Cache)
    ↓
User (Faster subsequent requests)
```

### Key Components

**Edge Locations**
- 400+ Points of Presence globally
- Cache content closer to users
- Can also handle PUT/POST requests

**Regional Edge Caches**
- Sit between origin and edge locations
- Larger cache for less popular content
- Reduce load on origin

**Distributions**
- Collection of edge locations
- **Web Distribution**: Websites, APIs
- **RTMP Distribution**: Media streaming (deprecated)

### Features

**Origin Types**
- S3 buckets (with Origin Access Identity)
- EC2 instances
- Elastic Load Balancers
- Custom origins (any HTTP server)

**Caching Behavior**
- TTL (Time To Live) controls cache duration
- Cache based on query strings, cookies, headers
- Invalidation to remove cached objects
- Lambda@Edge for customization

**Security**
- HTTPS support (SNI and dedicated IP)
- AWS Shield Standard (DDoS protection)
- AWS WAF integration
- Field-level encryption
- Geo-restriction (whitelist/blacklist countries)
- Signed URLs and cookies for private content

**Performance Optimizations**
- Gzip/Brotli compression
- HTTP/2 and HTTP/3 support
- WebSocket support
- Origin connection reuse

### Use Cases

1. **Static Website Hosting**: Serve from S3 with CloudFront
2. **Video Streaming**: On-demand and live streaming
3. **API Acceleration**: Cache API responses
4. **Software Distribution**: Distribute downloads globally
5. **Dynamic Content**: Accelerate with optimized routing

## Best Practices

### VPC
1. **Plan CIDR blocks**: Avoid overlapping with other networks
2. **Multi-AZ deployment**: Distribute resources across AZs
3. **Use private subnets**: Keep sensitive resources private
4. **Security groups over NACLs**: Easier to manage
5. **VPC Flow Logs**: Enable for troubleshooting and security

### Route 53
1. **Alias records**: Use for AWS resources (no charge)
2. **Health checks**: Monitor critical endpoints
3. **TTL management**: Balance between freshness and cost
4. **Use traffic flow**: Visualize complex routing
5. **Enable query logging**: Troubleshoot DNS issues

### CloudFront
1. **Use compression**: Enable for faster delivery
2. **Optimize caching**: Set appropriate TTLs
3. **Origin shield**: Additional caching layer
4. **Monitor metrics**: Use CloudWatch and CloudFront reports
5. **Secure content**: Use HTTPS and origin access identity

These networking services form the foundation of AWS's global infrastructure, enabling secure, fast, and reliable application delivery.
