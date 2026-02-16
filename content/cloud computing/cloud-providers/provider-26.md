---
id: provider-26
title: Google Cloud Platform - Networking
type: text
---

# Google Cloud Platform - Networking

GCP's networking services leverage Google's premium global network infrastructure, providing low-latency, highly available connectivity for your cloud resources.

## Virtual Private Cloud (VPC)

Software-defined networking for GCP resources.

### VPC Characteristics

- **Global resource**: Single VPC spans all regions
- **Subnets are regional**: Can span multiple zones in a region
- **No cross-region charges**: Free traffic between regions in same VPC
- **Shared VPC**: Share network across multiple projects
- **VPC Peering**: Connect VPCs privately

### Creating VPC Networks

**Auto Mode VPC:**
Automatically creates one subnet per region.

```bash
# Create auto mode VPC
gcloud compute networks create my-auto-vpc --subnet-mode auto
```

**Custom Mode VPC:**
You define subnets manually.

```bash
# Create custom VPC
gcloud compute networks create my-custom-vpc \
  --subnet-mode custom

# Create subnets
gcloud compute networks subnets create subnet-us-central \
  --network my-custom-vpc \
  --region us-central1 \
  --range 10.0.1.0/24

gcloud compute networks subnets create subnet-us-east \
  --network my-custom-vpc \
  --region us-east1 \
  --range 10.0.2.0/24

gcloud compute networks subnets create subnet-europe \
  --network my-custom-vpc \
  --region europe-west1 \
  --range 10.0.3.0/24
```

### Subnet Expansion

```bash
# Expand subnet CIDR
gcloud compute networks subnets expand-ip-range subnet-us-central \
  --region us-central1 \
  --prefix-length 20
```

### Secondary IP Ranges

For GKE pods and services:

```bash
# Create subnet with secondary ranges
gcloud compute networks subnets create gke-subnet \
  --network my-vpc \
  --region us-central1 \
  --range 10.0.0.0/20 \
  --secondary-range pods=10.4.0.0/14 \
  --secondary-range services=10.8.0.0/20
```

## Firewall Rules

### Default Firewall Rules

Every VPC has implicit rules:
- **Egress**: All outbound traffic allowed
- **Ingress**: All inbound traffic denied (except from same VPC)

### Creating Firewall Rules

```bash
# Allow SSH
gcloud compute firewall-rules create allow-ssh \
  --network my-vpc \
  --allow tcp:22 \
  --source-ranges 0.0.0.0/0 \
  --description "Allow SSH from anywhere"

# Allow HTTP/HTTPS for tagged instances
gcloud compute firewall-rules create allow-web \
  --network my-vpc \
  --allow tcp:80,tcp:443 \
  --source-ranges 0.0.0.0/0 \
  --target-tags web-server

# Allow internal traffic
gcloud compute firewall-rules create allow-internal \
  --network my-vpc \
  --allow tcp:1-65535,udp:1-65535,icmp \
  --source-ranges 10.0.0.0/8

# Deny specific traffic (higher priority)
gcloud compute firewall-rules create deny-database \
  --network my-vpc \
  --action deny \
  --rules tcp:3306 \
  --source-ranges 10.0.1.0/24 \
  --priority 900

# Allow from service account
gcloud compute firewall-rules create allow-from-sa \
  --network my-vpc \
  --allow tcp:443 \
  --source-service-accounts app@myproject.iam.gserviceaccount.com
```

### Firewall Priorities

- **Lower number = higher priority** (0-65535)
- Default priority: 1000
- Rules are evaluated by priority
- If match, action taken (allow/deny)
- If no match, implicit deny

## Cloud Load Balancing

Global load balancing with single anycast IP.

### Load Balancer Types

| Type | Layer | Scope | Use Case |
|------|-------|-------|----------|
| **HTTP(S) Load Balancer** | L7 | Global | Web apps, content-based routing |
| **SSL Proxy Load Balancer** | L4 | Global | Non-HTTP(S) SSL traffic |
| **TCP Proxy Load Balancer** | L4 | Global | Non-SSL TCP traffic |
| **Network Load Balancer** | L4 | Regional | High-performance TCP/UDP |
| **Internal HTTP(S) Load Balancer** | L7 | Regional | Internal microservices |
| **Internal TCP/UDP Load Balancer** | L4 | Regional | Internal apps |

### Creating HTTP(S) Load Balancer

```bash
# Create instance template
gcloud compute instance-templates create web-template \
  --machine-type e2-medium \
  --tags web-server \
  --metadata startup-script='#!/bin/bash
    apt-get update
    apt-get install -y nginx
    echo "Hello from $(hostname)" > /var/www/html/index.html'

# Create managed instance group
gcloud compute instance-groups managed create web-group \
  --base-instance-name web \
  --template web-template \
  --size 3 \
  --zones us-central1-a,us-central1-b,us-central1-c

# Configure autoscaling
gcloud compute instance-groups managed set-autoscaling web-group \
  --max-num-replicas 10 \
  --target-cpu-utilization 0.75 \
  --cool-down-period 60 \
  --region us-central1

# Create health check
gcloud compute health-checks create http web-health \
  --port 80 \
  --check-interval 10s \
  --timeout 5s \
  --healthy-threshold 2 \
  --unhealthy-threshold 3

# Create backend service
gcloud compute backend-services create web-backend \
  --protocol HTTP \
  --health-checks web-health \
  --global

# Add instance group to backend
gcloud compute backend-services add-backend web-backend \
  --instance-group web-group \
  --instance-group-region us-central1 \
  --balancing-mode UTILIZATION \
  --max-utilization 0.8 \
  --global

# Create URL map
gcloud compute url-maps create web-url-map \
  --default-service web-backend

# Create target HTTP proxy
gcloud compute target-http-proxies create web-proxy \
  --url-map web-url-map

# Create forwarding rule (gets the external IP)
gcloud compute forwarding-rules create web-lb \
  --global \
  --target-http-proxy web-proxy \
  --ports 80

# Get load balancer IP
gcloud compute forwarding-rules describe web-lb --global --format="value(IPAddress)"
```

### HTTPS Load Balancer with SSL

```bash
# Create SSL certificate
gcloud compute ssl-certificates create my-cert \
  --certificate=/path/to/cert.pem \
  --private-key=/path/to/key.pem \
  --global

# Or use Google-managed certificate
gcloud compute ssl-certificates create my-managed-cert \
  --domains=example.com,www.example.com \
  --global

# Create target HTTPS proxy
gcloud compute target-https-proxies create web-https-proxy \
  --url-map web-url-map \
  --ssl-certificates my-cert

# Create HTTPS forwarding rule
gcloud compute forwarding-rules create web-https-lb \
  --global \
  --target-https-proxy web-https-proxy \
  --ports 443
```

### Content-Based Routing

```python
# URL map with path-based routing
gcloud compute url-maps create advanced-map \
  --default-service=default-backend

gcloud compute url-maps add-path-matcher advanced-map \
  --path-matcher-name=api-matcher \
  --default-service=default-backend \
  --backend-service-path-rules='/api/*=api-backend,/static/*=static-backend'
```

## Cloud CDN

Content Delivery Network integrated with HTTP(S) Load Balancer.

```bash
# Enable Cloud CDN on backend service
gcloud compute backend-services update web-backend \
  --enable-cdn \
  --cache-mode CACHE_ALL_STATIC \
  --default-ttl 3600 \
  --max-ttl 86400 \
  --global

# Invalidate cache
gcloud compute url-maps invalidate-cdn-cache web-url-map \
  --path "/*"
```

## Cloud DNS

Managed DNS service.

```bash
# Create DNS zone
gcloud dns managed-zones create my-zone \
  --dns-name="example.com." \
  --description="My domain"

# Add A record
gcloud dns record-sets create www.example.com. \
  --zone=my-zone \
  --type=A \
  --ttl=300 \
  --rrdatas=203.0.113.1

# Add CNAME record
gcloud dns record-sets create blog.example.com. \
  --zone=my-zone \
  --type=CNAME \
  --ttl=300 \
  --rrdatas=www.example.com.

# View nameservers
gcloud dns managed-zones describe my-zone --format="value(nameServers)"
```

## Cloud VPN

Secure connection between your network and GCP.

### HA VPN (Recommended)

```bash
# Create HA VPN gateway
gcloud compute vpn-gateways create my-vpn-gateway \
  --network my-vpc \
  --region us-central1

# Create Cloud Router
gcloud compute routers create my-router \
  --region us-central1 \
  --network my-vpc \
  --asn 65001

# Create peer VPN gateway (for on-prem side)
gcloud compute external-vpn-gateways create on-prem-gateway \
  --interfaces 0=<ON_PREM_IP_1>,1=<ON_PREM_IP_2>

# Create VPN tunnels
gcloud compute vpn-tunnels create tunnel-1 \
  --peer-gcp-gateway my-vpn-gateway \
  --region us-central1 \
  --ike-version 2 \
  --shared-secret <SHARED_SECRET> \
  --router my-router \
  --vpn-gateway my-vpn-gateway \
  --interface 0

# Configure BGP
gcloud compute routers add-interface my-router \
  --interface-name if-tunnel-1 \
  --vpn-tunnel tunnel-1 \
  --region us-central1

gcloud compute routers add-bgp-peer my-router \
  --peer-name bgp-peer-1 \
  --interface if-tunnel-1 \
  --peer-ip-address 169.254.1.1 \
  --peer-asn 65002 \
  --region us-central1
```

## Cloud Interconnect

Dedicated physical connection to GCP.

**Types:**
- **Dedicated Interconnect**: 10 Gbps or 100 Gbps direct connection
- **Partner Interconnect**: Connect through service provider

**Use cases:**
- High-bandwidth requirements (>1 Gbps)
- Low-latency needs
- Hybrid cloud architectures
- Regulatory compliance

## VPC Peering

Connect two VPC networks privately.

```bash
# Create peering from VPC-A to VPC-B
gcloud compute networks peerings create vpc-a-to-vpc-b \
  --network vpc-a \
  --peer-project project-b \
  --peer-network vpc-b \
  --auto-create-routes

# Create reverse peering from VPC-B to VPC-A
gcloud compute networks peerings create vpc-b-to-vpc-a \
  --network vpc-b \
  --peer-project project-a \
  --peer-network vpc-a \
  --auto-create-routes
```

## Shared VPC

Share VPC network across multiple projects in an organization.

```bash
# Enable host project
gcloud compute shared-vpc enable host-project

# Attach service project
gcloud compute shared-vpc associated-projects add service-project \
  --host-project host-project

# Grant permissions
gcloud projects add-iam-policy-binding host-project \
  --member=serviceAccount:service-account@service-project.iam.gserviceaccount.com \
  --role=roles/compute.networkUser
```

## Private Google Access

Allow VMs without external IPs to access Google APIs.

```bash
# Enable Private Google Access on subnet
gcloud compute networks subnets update subnet-us-central \
  --region us-central1 \
  --enable-private-ip-google-access
```

## Cloud NAT

Network Address Translation for instances without external IPs.

```bash
# Create Cloud Router (if not exists)
gcloud compute routers create nat-router \
  --network my-vpc \
  --region us-central1

# Create Cloud NAT
gcloud compute routers nats create my-nat \
  --router nat-router \
  --region us-central1 \
  --nat-all-subnet-ip-ranges \
  --auto-allocate-nat-external-ips
```

## Network Tiers

**Premium Tier** (Default):
- Google's global network
- Lower latency
- Single global IP
- Higher cost

**Standard Tier**:
- Public internet routing
- Regional IPs
- Lower cost

```bash
# Create address with Standard tier
gcloud compute addresses create my-standard-ip \
  --region us-central1 \
  --network-tier STANDARD
```

## Cloud Armor

DDoS protection and Web Application Firewall.

```bash
# Create security policy
gcloud compute security-policies create my-policy \
  --description "Security policy for web app"

# Add rule to block specific IP range
gcloud compute security-policies rules create 1000 \
  --security-policy my-policy \
  --expression "origin.ip == '203.0.113.0/24'" \
  --action "deny-403"

# Rate limiting rule
gcloud compute security-policies rules create 2000 \
  --security-policy my-policy \
  --expression "true" \
  --action "rate-based-ban" \
  --rate-limit-threshold-count 100 \
  --rate-limit-threshold-interval-sec 60

# Attach to backend service
gcloud compute backend-services update web-backend \
  --security-policy my-policy \
  --global
```

## Network Best Practices

1. **Use custom VPC mode**: Better control over IP ranges
2. **Plan IP addressing**: Avoid overlapping ranges
3. **Use firewall tags**: Instead of IP-based rules
4. **Enable VPC Flow Logs**: For network troubleshooting
5. **Use Cloud NAT**: For outbound internet without external IPs
6. **Implement Cloud Armor**: For DDoS protection
7. **Use Premium Tier**: For latency-sensitive apps
8. **Enable Private Google Access**: Reduce external IPs
9. **Use Cloud CDN**: For static content delivery
10. **Monitor with Cloud Monitoring**: Track network metrics

GCP's networking services provide robust, global, and highly performant connectivity for your cloud infrastructure, with advanced features like content-based routing, Cloud CDN, and integrated security.
