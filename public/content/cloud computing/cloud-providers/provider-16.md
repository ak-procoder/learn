---
id: provider-16
title: Azure Networking
type: text
---

# Azure Networking

Azure provides comprehensive networking services to connect cloud resources, on-premises infrastructures, and end users. These services enable secure, reliable, and high-performance network connectivity.

## Azure Virtual Network (VNet)

VNet is the fundamental building block for your private network in Azure, providing isolation, segmentation, and communication between Azure resources.

### VNet Components

**Address Space**
- Private IP address range (RFC 1918)
- CIDR notation
- Example: 10.0.0.0/16 (65,536 addresses)

**Subnets**
- Logical subdivisions of VNet
- Segment address space
- Apply security policies per subnet
- Example: 10.0.1.0/24 (256 addresses)

```plaintext
VNet: 10.0.0.0/16
├── Subnet 1 (Web): 10.0.1.0/24
├── Subnet 2 (App): 10.0.2.0/24
├── Subnet 3 (Data): 10.0.3.0/24
└── Subnet 4 (Management): 10.0.4.0/24
```

### Reserved IP Addresses

Azure reserves first 4 and last 1 IP in each subnet:

```plaintext
Subnet: 10.0.1.0/24
- 10.0.1.0: Network address
- 10.0.1.1: Default gateway
- 10.0.1.2: Azure DNS
- 10.0.1.3: Azure DNS
- 10.0.1.255: Broadcast
Usable: 10.0.1.4 to 10.0.1.254 (251 addresses)
```

### Creating VNet

```bash
# Create Virtual Network
az network vnet create \
  --resource-group myResourceGroup \
  --name myVNet \
  --address-prefixes 10.0.0.0/16 \
  --subnet-name mySubnet \
  --subnet-prefixes 10.0.1.0/24
```

```powershell
# PowerShell
New-AzVirtualNetwork `
  -ResourceGroupName myResourceGroup `
  -Location EastUS `
  -Name myVNet `
  -AddressPrefix 10.0.0.0/16
```

## Network Security Groups (NSGs)

Filter network traffic to and from Azure resources.

### NSG Rules

```plaintext
Priority: 100-4096 (lower = higher priority)
Action: Allow or Deny
Protocol: TCP, UDP, ICMP, Any
Source/Destination: IP address, CIDR, Service Tag, ASG
Port: Single port, range, or *
```

**Example NSG Rules:**

| Priority | Name | Direction | Action | Protocol | Source | Destination | Port |
|----------|------|-----------|--------|----------|--------|-------------|------|
| 100 | AllowHTTP | Inbound | Allow | TCP | Internet | Any | 80 |
| 110 | AllowHTTPS | Inbound | Allow | TCP | Internet | Any | 443 |
| 120 | AllowSSH | Inbound | Allow | TCP | MyIP | Any | 22 |
| 1000 | DenyAll | Inbound | Deny | Any | Any | Any | Any |

**Service Tags:**
- **Internet**: Public internet
- **VirtualNetwork**: All VNet addresses
- **AzureLoadBalancer**: Azure infrastructure
- **Storage**: Azure Storage service
- **Sql**: Azure SQL service

**Application Security Groups (ASG):**
```plaintext
ASG-WebServers
├── VM-Web1
└── VM-Web2

ASG-DatabaseServers
├── VM-DB1
└── VM-DB2

NSG Rule: Allow ASG-WebServers → ASG-DatabaseServers on port 1433
```

```bash
# Create NSG
az network nsg create \
  --resource-group myResourceGroup \
  --name myNSG

# Add rule
az network nsg rule create \
  --resource-group myResourceGroup \
  --nsg-name myNSG \
  --name AllowHTTP \
  --priority 100 \
  --direction Inbound \
  --access Allow \
  --protocol Tcp \
  --destination-port-ranges 80
```

## Azure Load Balancer

Distribute network traffic across multiple resources.

### Load Balancer Types

**Public Load Balancer**
- Internet-facing
- Distribute incoming internet traffic
- Public IP address

**Internal Load Balancer**
- Within VNet only
- Distribute traffic between VMs in VNet
- Private IP address

### SKUs

| Feature | Basic | Standard |
|---------|-------|----------|
| Price | Free | Paid |
| Backend pool size | 300 | 1000 |
| Health probes | HTTP, TCP | HTTP, HTTPS, TCP |
| Availability Zones | No | Yes |
| SLA | No | 99.99% |
| Secure by default | No | Yes (closed to inbound) |

### Load Balancer Components

```plaintext
Internet/VNet
      ↓
Frontend IP Configuration
      ↓
Load Balancing Rules
      ↓
Backend Pool
  ↓   ↓   ↓
VM1 VM2 VM3
```

**Health Probes**
- Monitor backend pool health
- HTTP, HTTPS, TCP
- Unhealthy instances removed from rotation

**Load Balancing Rules**
- Define traffic distribution
- Port mapping
- Session persistence (source IP, source IP + protocol)

```bash
# Create public load balancer
az network lb create \
  --resource-group myResourceGroup \
  --name myLoadBalancer \
  --sku Standard \
  --public-ip-address myPublicIP \
  --frontend-ip-name myFrontEnd \
  --backend-pool-name myBackEndPool

# Create health probe
az network lb probe create \
  --resource-group myResourceGroup \
  --lb-name myLoadBalancer \
  --name myHealthProbe \
  --protocol tcp \
  --port 80

# Create load balancing rule
az network lb rule create \
  --resource-group myResourceGroup \
  --lb-name myLoadBalancer \
  --name myHTTPRule \
  --protocol tcp \
  --frontend-port 80 \
  --backend-port 80 \
  --frontend-ip-name myFrontEnd \
  --backend-pool-name myBackEndPool \
  --probe-name myHealthProbe
```

## Azure Application Gateway

Layer 7 (HTTP/HTTPS) load balancer with web application firewall.

### Features

**URL-based Routing**
```plaintext
example.com/images/* → Image Server Pool
example.com/video/* → Video Server Pool
example.com/api/* → API Server Pool
```

**Multi-site Hosting**
```plaintext
site1.com → Pool 1
site2.com → Pool 2
site3.com → Pool 3
```

**SSL/TLS Termination**
- Offload encryption/decryption
- End-to-end SSL (re-encrypt to backend)
- Centralized certificate management

**Web Application Firewall (WAF)**
- OWASP Core Rule Set
- SQL injection protection
- Cross-site scripting prevention
- Custom rules
- Bot protection

**Autoscaling**
- Scale based on traffic
- Minimum and maximum instances

**Session Affinity**
- Cookie-based affinity
- Route user to same backend server

### Application Gateway Components

```plaintext
Client
  ↓
Frontend IP (Public/Private)
  ↓
Listener (Port 80, 443)
  ↓
Routing Rules
  ↓
Backend Pools
  ↓
Backend Servers
```

## Azure VPN Gateway

Establish encrypted connections between Azure and on-premises networks.

### VPN Types

**Site-to-Site (S2S)**
- Connect on-premises network to Azure VNet
- IPsec/IKE VPN tunnel
- Requires VPN device on-premises

**Point-to-Site (P2S)**
- Individual client to Azure VNet
- SSTP, IKEv2, or OpenVPN
- Remote workers, mobile users

**VNet-to-VNet**
- Connect Azure VNets
- Different regions or subscriptions
- Encrypted over Microsoft backbone

### VPN Gateway SKUs

| SKU | S2S Tunnels | P2S Connections | Bandwidth |
|-----|-------------|-----------------|-----------|
| Basic | 10 | 128 | 100 Mbps |
| VpnGw1 | 30 | 250 | 650 Mbps |
| VpnGw2 | 30 | 500 | 1 Gbps |
| VpnGw3 | 30 | 1000 | 1.25 Gbps |

### Creating VPN Gateway

```bash
# Create VPN Gateway (takes 30-45 minutes)
az network vnet-gateway create \
  --resource-group myResourceGroup \
  --name myVPNGateway \
  --vnet myVNet \
  --gateway-type Vpn \
  --vpn-type RouteBased \
  --sku VpnGw1 \
  --public-ip-address myGatewayIP

# Create local network gateway (on-premises)
az network local-gateway create \
  --resource-group myResourceGroup \
  --name myLocalGateway \
  --gateway-ip-address 203.0.113.1 \
  --local-address-prefixes 192.168.0.0/16

# Create connection
az network vpn-connection create \
  --resource-group myResourceGroup \
  --name myConnection \
  --vnet-gateway1 myVPNGateway \
  --local-gateway2 myLocalGateway \
  --shared-key "MySharedKey123"
```

## Azure ExpressRoute

Dedicated private connection to Azure.

### Features

- **Not over public internet**
- **Predictable performance**
- **Higher bandwidth** (50 Mbps to 100 Gbps)
- **Lower latency**
- **SLA available**

### ExpressRoute Models

**CloudExchange Co-location**
- Facility with ExpressRoute exchange
- Virtual cross-connections to Azure

**Point-to-Point Ethernet**
- Dedicated connection to Azure
- Telecommunications provider

**Any-to-Any (IPVPN)**
- Integrate Azure with WAN
- MPLS VPN

### ExpressRoute Peering

**Private Peering**
- Connect to VNets
- Azure VMs, cloud services

**Microsoft Peering**
- Connect to Microsoft services
- Office 365, Dynamics 365, public Azure services

## Azure Traffic Manager

DNS-based global load balancer.

### Routing Methods

**Priority**
- Failover routing
- Primary with backup endpoints

**Weighted**
- Distribute traffic by weight
- A/B testing, gradual migrations

**Performance**
- Route to closest endpoint
- Based on DNS resolver location

**Geographic**
- Route based on user's location
- Data sovereignty, localization

**Multivalue**
- Return multiple healthy endpoints
- Client chooses

**Subnet**
- Route based on client subnet
- IP address range mapping

```bash
# Create Traffic Manager profile
az network traffic-manager profile create \
  --resource-group myResourceGroup \
  --name myProfile \
  --routing-method Performance \
  --unique-dns-name myapp-tm \
  --ttl 30

# Add endpoint
az network traffic-manager endpoint create \
  --resource-group myResourceGroup \
  --profile-name myProfile \
  --name myEndpoint \
  --type azureEndpoints \
  --target-resource-id /subscriptions/.../resourceGroups/.../providers/Microsoft.Network/publicIPAddresses/myIP
```

## Azure Front Door

Global, scalable entry point using Microsoft's global network.

### Features

- **Global HTTP load balancing**
- **SSL offload**
- **URL-based routing**
- **Session affinity**
- **Caching**
- **Web Application Firewall**
- **DDoS protection**

### Architecture

```plaintext
Users Worldwide
       ↓
Azure Front Door (Edge Locations)
       ↓
Backend Pools (Multi-region)
  ├── Region 1: Web App
  ├── Region 2: Web App
  └── Region 3: Web App
```

## Azure DNS

Reliable, secure DNS hosting using Azure infrastructure.

### Features

- **Anycast network**: Fast resolution
- **RBAC**: Role-based access control
- **Activity logs**: Audit DNS changes
- **Private DNS zones**: Internal name resolution

### DNS Zone Example

```bash
# Create public DNS zone
az network dns zone create \
  --resource-group myResourceGroup \
  --name example.com

# Add A record
az network dns record-set a add-record \
  --resource-group myResourceGroup \
  --zone-name example.com \
  --record-set-name www \
  --ipv4-address 203.0.113.10

# Create private DNS zone
az network private-dns zone create \
  --resource-group myResourceGroup \
  --name internal.example.com

# Link to VNet
az network private-dns link vnet create \
  --resource-group myResourceGroup \
  --zone-name internal.example.com \
  --name myDNSLink \
  --virtual-network myVNet \
  --registration-enabled true
```

## VNet Peering

Connect VNets directly.

### Features

- **Low latency**: Private Microsoft backbone
- **No downtime**: No gateway required
- **Cross-region**: Global VNet peering
- **Cross-subscription**: Different subscriptions

```bash
# Create peering from VNet1 to VNet2
az network vnet peering create \
  --resource-group myResourceGroup \
  --name VNet1-to-VNet2 \
  --vnet-name VNet1 \
  --remote-vnet /subscriptions/.../resourceGroups/.../providers/Microsoft.Network/virtualNetworks/VNet2 \
  --allow-vnet-access

# Create reverse peering
az network vnet peering create \
  --resource-group myResourceGroup \
  --name VNet2-to-VNet1 \
  --vnet-name VNet2 \
  --remote-vnet /subscriptions/.../resourceGroups/.../providers/Microsoft.Network/virtualNetworks/VNet1 \
  --allow-vnet-access
```

## Best Practices

1. **Plan address space**: Avoid overlapping with on-premises
2. **Use NSGs**: Implement defense in depth
3. **Service endpoints**: Direct access to Azure services
4. **Private endpoints**: Keep traffic on Microsoft network
5. **DDoS protection**: Enable standard for critical resources
6. **Monitor network**: Network Watcher, flow logs
7. **Hub-spoke topology**: Centralized connectivity
8. **ExpressRoute for production**: Dedicated, reliable connection
9. **Use Traffic Manager**: Multi-region resilience
10. **Tag resources**: Organization and cost tracking

Azure networking services provide comprehensive connectivity, security, and performance optimization capabilities for building robust cloud architectures.
