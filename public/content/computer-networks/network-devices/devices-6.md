---
id: devices-6
title: VLANs and Inter-VLAN Routing
type: text
---

## Virtual Local Area Networks (VLANs)

VLANs provide logical network segmentation within physical network infrastructure, enabling better security, traffic management, and network organization.

## VLAN Fundamentals

### What are VLANs?

**VLAN Definition:**
- **Virtual segmentation**: Logical separation of network traffic
- **Broadcast domain isolation**: Separate broadcast domains per VLAN
- **Flexible design**: Networks not limited by physical switch ports
- **Security enhancement**: Traffic isolation between departments
- **Simplified management**: Centralized VLAN configuration

### VLAN Benefits

**Administrative Benefits:**
- **Simplified moves and changes**: Users can change locations without recabling
- **Centralized management**: Single point of VLAN administration
- **Scalable design**: Easy addition of new users and departments
- **Reduced infrastructure costs**: Better utilization of existing equipment

**Security Benefits:**
- **Traffic isolation**: Sensitive data separated from general traffic
- **Access control**: Granular control over inter-VLAN communication
- **Broadcast containment**: Limits broadcast storm impact
- **Compliance support**: Easier regulatory compliance implementation

## VLAN Types and Implementation

### VLAN Types

**Port-Based VLANs (Untagged):**
- **Access ports**: Single VLAN assignment per port
- **Default VLAN**: Native VLAN for untagged traffic
- **Simple configuration**: Easiest VLAN implementation
- **End device compatibility**: Works with non-VLAN aware devices

**Tagged VLANs (802.1Q):**
- **Trunk ports**: Multiple VLANs on single physical link
- **VLAN tagging**: 802.1Q header insertion
- **Inter-switch communication**: VLAN extension across switches
- **Native VLAN**: Untagged traffic handling on trunks

### VLAN Configuration Examples

**Basic VLAN Setup:**
```bash
# Cisco switch VLAN configuration
vlan 10
 name SALES
vlan 20
 name ENGINEERING
vlan 30
 name GUEST

# Port assignment
interface FastEthernet0/1
 switchport mode access
 switchport access vlan 10

# Trunk configuration
interface GigabitEthernet0/1
 switchport mode trunk
 switchport trunk allowed vlan 10,20,30
 switchport trunk native vlan 1
```

**Advanced VLAN Features:**
- **Voice VLANs**: Separate VLAN for VoIP traffic
- **Private VLANs**: Additional isolation within VLANs
- **Dynamic VLANs**: Automatic VLAN assignment based on criteria
- **VLAN pruning**: Efficient trunk utilization

## Inter-VLAN Routing

### Router-on-a-Stick

**Single Physical Interface:**
- **Subinterfaces**: Logical interfaces for each VLAN
- **802.1Q encapsulation**: VLAN tag processing
- **Cost-effective**: Single router interface required
- **Performance limitation**: All traffic through one interface

**Configuration Example:**
```bash
# Router subinterface configuration
interface GigabitEthernet0/0.10
 encapsulation dot1Q 10
 ip address 192.168.10.1 255.255.255.0

interface GigabitEthernet0/0.20
 encapsulation dot1Q 20
 ip address 192.168.20.1 255.255.255.0
```

### Layer 3 Switches

**Integrated Routing and Switching:**
- **Switched Virtual Interfaces (SVIs)**: VLAN interfaces for routing
- **Hardware-based routing**: ASIC-based forwarding
- **High performance**: Wire-speed inter-VLAN routing
- **Scalability**: Multiple high-speed interfaces

**SVI Configuration:**
```bash
# Layer 3 switch configuration
ip routing

interface vlan 10
 ip address 192.168.10.1 255.255.255.0
 no shutdown

interface vlan 20
 ip address 192.168.20.1 255.255.255.0
 no shutdown
```

### Multi-Layer Switch Architecture

**Distributed Processing:**
- **Control plane**: Routing protocol processing
- **Data plane**: Packet forwarding decisions
- **Management plane**: Configuration and monitoring
- **Hardware acceleration**: Dedicated forwarding ASICs

## VLAN Security and Best Practices

### VLAN Security Considerations

**Common Vulnerabilities:**
- **VLAN hopping**: Unauthorized access to other VLANs
- **Double tagging**: Exploiting native VLAN configuration
- **Switch spoofing**: Mimicking trunk port behavior
- **CAM table overflow**: MAC address table exhaustion attacks

**Security Mitigation:**
```bash
# VLAN security hardening
# Disable unused ports
interface range FastEthernet0/5-24
 shutdown
 switchport mode access
 switchport access vlan 999

# Secure trunk ports
interface GigabitEthernet0/1
 switchport trunk encapsulation dot1q
 switchport mode trunk
 switchport nonegotiate
 switchport trunk native vlan 999
```

### VLAN Design Best Practices

**Planning Considerations:**
- **Numbering scheme**: Consistent VLAN ID allocation
- **VLAN naming**: Descriptive and standardized names
- **Subnet correlation**: VLAN-to-subnet mapping
- **Documentation**: Comprehensive VLAN documentation

**Performance Optimization:**
- **Traffic patterns**: Analyze communication requirements
- **Broadcast minimization**: Appropriate VLAN sizing
- **Load distribution**: Balance traffic across infrastructure
- **Monitoring**: Regular VLAN utilization analysis

## Advanced VLAN Technologies

### Virtual Routing and Forwarding (VRF)

**VRF Benefits:**
- **Multiple routing tables**: Separate routing instances
- **Customer isolation**: Service provider implementations
- **Enhanced security**: Complete traffic separation
- **Flexible design**: Multiple virtual networks on single infrastructure

### VLAN Trunking Protocol (VTP)

**VTP Features:**
- **Centralized VLAN management**: Domain-wide VLAN synchronization
- **Automatic propagation**: VLAN database distribution
- **Consistency enforcement**: Uniform VLAN configuration
- **Administrative efficiency**: Reduced manual configuration

**VTP Modes:**
- **Server mode**: Can create, modify, and delete VLANs
- **Client mode**: Receives VLAN information from servers
- **Transparent mode**: Forwards VTP advertisements without processing

### Private VLANs

**Additional Segmentation:**
- **Primary VLAN**: Contains secondary VLANs
- **Community VLANs**: Limited inter-communication
- **Isolated VLANs**: No lateral communication
- **Promiscuous ports**: Access to all secondary VLANs

**Use Cases:**
- **Service provider networks**: Customer isolation
- **DMZ implementations**: Security zone separation
- **Guest networks**: Limited access environments
- **Compliance requirements**: Regulatory separation needs