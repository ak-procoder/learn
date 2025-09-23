---
id: devices-4
title: Network Switches - Advanced Layer 2 Intelligence
type: text
---

## What is a Network Switch?



Routers operate at the Network Layer (Layer 3) and connect different networks by making forwarding decisions based on IP addresses.A switch is an advanced Layer 2 device that creates a separate collision domain for each port while maintaining intelligent frame forwarding based on MAC addresses.



### Primary Router Operations## Switch Advantages over Hubs

- **Packet Forwarding**: Route packets between different networks

- **Path Determination**: Select best path using routing protocols### Performance Benefits

- **Network Interconnection**: Connect different network types and technologies- **Dedicated Bandwidth**: Each port receives full bandwidth

- **Broadcast Domain Separation**: Each interface creates separate broadcast domain- **Full-Duplex**: Simultaneous send and receive on each port

- **Zero Collisions**: Eliminates collision domains per port

## Routing Table Structure- **Higher Aggregate Throughput**: Sum of all port speeds



### Essential Components### Intelligence Features

- **Destination Network**: Target network address and subnet mask- **MAC Address Learning**: Automatically builds forwarding table

- **Next Hop**: IP address of next router in path- **Selective Forwarding**: Sends frames only where needed

- **Interface**: Local interface used to reach destination- **Broadcast Control**: Manages broadcast traffic efficiently

- **Metric**: Cost associated with the route- **Error Detection**: Can detect and handle frame errors

- **Administrative Distance**: Trustworthiness of routing source

## Switch Operation Details

### Route Types

- **Connected Routes**: Directly attached networks### MAC Address Table (CAM Table)

- **Static Routes**: Manually configured by administrator- **Content Addressable Memory**: High-speed lookup table

- **Dynamic Routes**: Learned through routing protocols- **Dynamic Learning**: Learns addresses from source fields

- **Default Route**: Used when no specific route exists- **Aging Process**: Removes stale entries automatically

- **Table Size**: Typically 8K-128K entries depending on switch

## Packet Forwarding Process

### Frame Processing Methods

### Step-by-Step Process1. **Store-and-Forward**: Complete frame verification before forwarding

1. **Packet Reception**: Router receives packet on an interface   - Checks frame integrity and CRC

2. **Destination Analysis**: Extract destination IP address from packet header   - Higher latency but error-free transmission

3. **Routing Table Lookup**: Find longest prefix match in routing table   - Best for mixed-speed environments

4. **TTL Decrement**: Decrease Time-to-Live field by 1

5. **Frame Encapsulation**: Encapsulate packet in appropriate frame format2. **Cut-Through**: Immediate forwarding after destination address

6. **Interface Transmission**: Forward packet through selected interface   - Lowest latency switching method

   - No error checking at switch level

### Longest Prefix Match   - Best for high-performance applications

The router selects the route with the most specific (longest) subnet mask:

- **0.0.0.0/0**: Default route (least specific)3. **Fragment-Free**: Forward after first 64 bytes received

- **192.168.1.0/24**: More specific than /16   - Compromise between latency and error checking

- **192.168.1.128/25**: Most specific route   - Catches most collision fragments

   - Good balance for most environments

## Router Types and Classifications

## Types of Switches

### By Function

- **Edge Routers**: Connect enterprise networks to ISPs### Unmanaged Switches

- **Core Routers**: High-capacity devices in ISP backbones- **Plug-and-Play**: No configuration required

- **Distribution Routers**: Aggregate traffic from access layer- **Basic Functionality**: Standard switching only

- **Access Routers**: Provide connectivity to end users- **Fixed Features**: No customization options

- **Low Cost**: Ideal for small networks

### By Deployment- **Limited Monitoring**: No management interface

- **Enterprise Routers**: Internal corporate networks

- **Service Provider Routers**: ISP and carrier networks### Managed Switches

- **Home/SOHO Routers**: Small office/home office environments- **Configuration Interface**: Web, CLI, or SNMP management

- **VLAN Support**: Virtual LAN segmentation

## Advanced Router Features- **Quality of Service**: Traffic prioritization

- **Port Security**: Access control features

### Quality of Service (QoS)- **Monitoring**: Traffic statistics and diagnostics

- **Traffic Classification**: Identify different traffic types

- **Queue Management**: Prioritize important traffic### Layer 3 Switches

- **Bandwidth Allocation**: Guarantee minimum bandwidth- **Routing Capability**: Inter-VLAN routing functions

- **Congestion Control**: Manage network overload- **Hardware-Based**: ASIC-based routing for high performance

- **VLAN Routing**: Route between VLANs at wire speed

### Network Address Translation (NAT)- **Hybrid Functionality**: Combines switching and routing

- **Private-to-Public Translation**: Enable internet access for private networks-  switchport access vlan 10
- **Port Address Translation (PAT)**: Multiple private addresses to single public
- **Static NAT**: One-to-one permanent mapping
- **Dynamic NAT**: Pool-based address translation

### Access Control Lists (ACLs)
- **Traffic Filtering**: Permit or deny specific traffic
- **Security Implementation**: Enforce network policies
- **Standard ACLs**: Source IP address filtering
- **Extended ACLs**: Detailed traffic criteria