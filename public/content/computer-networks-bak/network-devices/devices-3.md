---
id: devices-3
title: Network Bridges - Intelligent Segmentation
type: text
---

## What is a Network Bridge?



Switches operate at the Data Link Layer (Layer 2) and are the backbone of modern LANs. They make forwarding decisions based on MAC addresses.A bridge is a Layer 2 device that connects two or more network segments, creating separate collision domains while maintaining a single broadcast domain.



### Key Switch Functions## Bridge Operation Principles

- **MAC Address Learning**: Dynamically build and maintain MAC address tables

- **Frame Forwarding**: Forward frames to appropriate ports based on destination MAC### Learning Process

- **Collision Domain Separation**: Each port creates its own collision domain1. **Initial State**: Empty MAC address table

- **Full-Duplex Communication**: Simultaneous sending and receiving on each port2. **Frame Reception**: Examine source MAC address

3. **Learning**: Record MAC address and port association

## MAC Address Table Operations4. **Table Building**: Gradually build forwarding database

5. **Aging**: Remove old entries to keep table current

### Learning Process

1. **Frame Reception**: Switch receives frame on a port### Forwarding Decisions

2. **Source Learning**: Records source MAC address and ingress port- **Known Destination**: Forward to specific port

3. **Destination Lookup**: Searches table for destination MAC address- **Unknown Destination**: Flood to all ports except source

4. **Forwarding Decision**: Forward, flood, or filter the frame- **Same Segment**: Filter (don't forward)

- **Broadcast/Multicast**: Forward to all ports except source

### Table Management

- **Aging Timer**: Removes inactive entries (default 300 seconds)## Types of Bridges

- **Table Size**: Limited by hardware memory

- **Dynamic Entries**: Learned automatically from traffic### Transparent Bridge

- **Static Entries**: Manually configured permanent entries- **Automatic Operation**: No configuration required

- **IEEE 802.1D Standard**: Standardized bridge operation

## Frame Forwarding Methods- **Backward Learning**: Learns by observing source addresses

- **Plug-and-Play**: Automatic network integration

### Store-and-Forward

- **Complete Frame Receipt**: Entire frame received before forwarding### Source Route Bridge

- **Error Checking**: CRC verification before forwarding- **Token Ring Networks**: Primarily used in IBM Token Ring

- **Latency**: Higher but ensures frame integrity- **Route Discovery**: Source determines complete path

- **Use Case**: Critical applications requiring error-free transmission- **Route Information**: Carried in frame header

- **Manual Route Selection**: Host chooses optimal path

### Cut-Through

- **Immediate Forwarding**: Begin forwarding after reading destination MAC### Translational Bridge

- **No Error Checking**: Forwards damaged frames- **Protocol Conversion**: Connects different network types

- **Low Latency**: Minimal processing delay- **Frame Format Translation**: Ethernet ↔ Token Ring ↔ FDDI

- **Use Case**: Real-time applications prioritizing speed- **Speed Matching**: Handle different transmission rates

- **MTU Handling**: Manage different Maximum Transmission Units

### Fragment-Free

- **Collision Window Check**: Examines first 64 bytes for collisions## Spanning Tree Protocol (STP)

- **Partial Error Detection**: Catches most common errors

- **Balanced Approach**: Compromise between speed and reliability### Problem: Bridge Loops

- **Redundant Paths**: Multiple bridges create loops

## VLAN Capabilities- **Broadcast Storms**: Frames circulate indefinitely

- **MAC Table Instability**: Confusion about device locations

### Virtual LAN Benefits

- **Broadcast Domain Segmentation**: Isolate broadcast traffic### STP Solution

- **Security Enhancement**: Logical separation of sensitive traffic- **Loop Prevention**: Blocks redundant paths

- **Flexible Network Design**: Group users by function, not location- **Single Active Path**: Ensures loop-free topology

- **Bandwidth Management**: Control traffic flow between VLANs- **Automatic Recovery**: Activates backup paths when needed

- **Root Bridge Selection**: Establishes hierarchical structure

### VLAN Types

- **Port-Based VLANs**: Assign ports to specific VLANs### STP States

- **MAC-Based VLANs**: Dynamic assignment based on MAC addresses- **Blocking**: Port blocked to prevent loops

- **Protocol-Based VLANs**: Assignment based on protocol type- **Listening**: Preparing to forward, learning topology

- **Learning**: Building MAC address table

## Switch Port States- **Forwarding**: Normal operation, forwarding frames

- **Disabled**: Port administratively shut down

Understanding port states is crucial for network troubleshooting:

## Bridge vs Hub vs Switch

### Operational States

- **Forwarding**: Normal operation, learning and forwarding frames| Feature | Hub | Bridge | Switch |

- **Learning**: Building MAC table but not forwarding frames|---------|-----|--------|--------|

- **Listening**: Preparing to participate in network topology| Collision Domains | 1 | Multiple | Per Port |

- **Blocking**: Receiving BPDUs but not forwarding frames| Broadcast Domains | 1 | 1 | 1 (per VLAN) |

- **Disabled**: Port administratively shut down| MAC Learning | No | Yes | Yes |
| Port Density | Low | Low | High |
| Performance | Shared | Improved | Dedicated |