---
id: devices-5
title: Network Routers - Layer 3 Intelligence
type: text
---

## What is a Network Router?



Access Points bridge wireless and wired networks, enabling wireless devices to connect to the network infrastructure.A router is a Layer 3 device that connects different networks and makes intelligent forwarding decisions based on IP addresses and routing protocols.



### Core WAP Functions## Primary Router Functions

- **Radio Frequency Management**: Transmit and receive RF signals

- **Authentication**: Verify wireless client credentials### Network Interconnection

- **Association Management**: Maintain client connection state- **Multiple Networks**: Connect LANs, WANs, and Internet

- **Frame Translation**: Convert between 802.11 and 802.3 frames- **Different Technologies**: Bridge various network types

- **Protocol Translation**: Handle different Layer 2 protocols

## Wireless Standards and Frequencies- **Scalability**: Support network growth and expansion



### IEEE 802.11 Evolution### Packet Forwarding Process

- **802.11a**: 5 GHz, 54 Mbps, OFDM modulation1. **Receive Packet**: Accept packet on input interface

- **802.11b**: 2.4 GHz, 11 Mbps, DSSS modulation2. **Examine Header**: Check destination IP address

- **802.11g**: 2.4 GHz, 54 Mbps, backward compatible with 802.11b3. **Routing Table Lookup**: Find best path to destination

- **802.11n**: Dual-band, 600 Mbps, MIMO technology4. **TTL Decrement**: Reduce Time To Live by 1

- **802.11ac**: 5 GHz, Gigabit speeds, advanced MIMO5. **Forward Packet**: Send via appropriate output interface

- **802.11ax (Wi-Fi 6)**: Both bands, multi-gigabit, OFDMA6. **Update Headers**: Modify Layer 2 addressing



### Frequency Bands## Routing Table Components

- **2.4 GHz Band**: Longer range, more interference, 3 non-overlapping channels

- **5 GHz Band**: Shorter range, less congested, 25+ non-overlapping channels### Essential Elements

- **6 GHz Band**: Wi-Fi 6E, ultra-wide spectrum, minimal interference- **Destination Network**: Target network address/subnet

- **Subnet Mask**: Network portion identifier

## Access Point Types- **Next Hop**: IP address of next router in path

- **Outgoing Interface**: Physical port for packet exit

### Autonomous Access Points- **Administrative Distance**: Route source reliability

- **Standalone Operation**: Independent configuration and management- **Metric**: Path cost or preference value

- **Local Intelligence**: All processing performed locally

- **Distributed Control**: Each AP operates independently### Route Types

- **Use Case**: Small deployments, simple networks- **Directly Connected**: Networks on router interfaces

- **Static Routes**: Manually configured paths

### Lightweight Access Points- **Dynamic Routes**: Learned via routing protocols

- **Centralized Control**: Managed by wireless controller- **Default Route**: Catch-all for unknown destinations

- **Minimal Local Processing**: Basic radio functions only

- **CAPWAP Protocol**: Control and Provisioning of Wireless Access Points## Routing Protocols Categories

- **Scalable Management**: Hundreds of APs per controller

### Interior Gateway Protocols (IGPs)

## Wireless Controllers- **RIP** (Routing Information Protocol)

  - Distance vector protocol

### Controller Functions  - Hop count metric (max 15)

- **Centralized Management**: Configure and monitor multiple APs  - Periodic updates every 30 seconds

- **RF Management**: Optimize channel assignment and power levels  - Simple but limited scalability

- **Security Enforcement**: Implement unified security policies

- **Mobility Management**: Handle client roaming between APs- **OSPF** (Open Shortest Path First)

  - Link state protocol

### Controller Deployment Models  - Cost-based metrics

- **Hardware Controllers**: Dedicated appliances for large deployments  - Hierarchical design with areas

- **Virtual Controllers**: Software-based controllers in data centers  - Fast convergence and loop-free

- **Cloud Controllers**: Managed services with remote control

- **Embedded Controllers**: Built into switches or routers- **EIGRP** (Enhanced Interior Gateway Routing Protocol)

  - Cisco proprietary (now open standard)

## Wireless Security Mechanisms  - Advanced distance vector

  - Composite metric calculation

### Authentication Methods  - Efficient updates and scalability

- **Open System**: No authentication required

- **WEP**: Deprecated, weak 40/104-bit encryption### Exterior Gateway Protocols (EGPs)

- **WPA**: TKIP encryption, pre-shared key or 802.1X- **BGP** (Border Gateway Protocol)

- **WPA2**: AES encryption, most widely deployed  - Internet routing protocol

- **WPA3**: Enhanced security, protection against offline attacks  - Path vector algorithm

  - Policy-based routing decisions

### Enterprise Security  - Autonomous System connectivity

- **802.1X Authentication**: Username/password or certificate-based

- **RADIUS Integration**: Centralized authentication, authorization, accounting## Router Types and Classifications

- **Dynamic VLAN Assignment**: Automatic VLAN based on user credentials

- **Guest Network Isolation**: Separate network for visitor access### By Network Scope

- **Edge Routers**: Connect to external networks

## RF Planning and Design- **Core Routers**: High-speed backbone forwarding

- **Distribution Routers**: Intermediate network aggregation

### Coverage Planning- **Access Routers**: End-user network connectivity

- **Site Survey**: Measure RF conditions and identify requirements

- **Heat Map Analysis**: Visualize coverage areas and signal strength### By Functionality

- **Capacity Planning**: Determine user density and bandwidth needs- **Branch Routers**: Small office connectivity

- **Interference Analysis**: Identify and mitigate RF interference sources- **Service Provider Routers**: ISP and carrier networks

- **Wireless Routers**: Combined router/AP/switch

### Channel Planning- **Virtual Routers**: Software-based routing instances
- **Non-overlapping Channels**: Prevent co-channel interference
- **Channel Reuse**: Strategic placement for frequency reuse
- **Dynamic Channel Assignment**: Automatic optimization based on conditions
- **Power Management**: Adjust transmit power for optimal coverage