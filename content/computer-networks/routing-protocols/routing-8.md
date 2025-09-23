---
id: routing-8
title: IPv6 Routing Protocols
type: text
---

## IPv6 Routing Overview

IPv6 routing protocols enable next-generation internet connectivity with enhanced addressing and features.

## IPv6 Address Structure

- **128-bit Addresses**: Vastly expanded address space
- **Hierarchical Addressing**: Efficient routing aggregation
- **Global Unicast**: Internet-routable addresses
- **Link-Local**: Neighbor discovery and local communication
- **Multicast**: Efficient one-to-many communication

## IPv6 Routing Protocols

**RIPng (RIP next generation):**
- IPv6 version of RIP
- 15-hop limitation remains
- Uses IPv6 multicast FF02::9
- Simple distance vector operation

**OSPFv3:**
- OSPF for IPv6 networks
- Per-link operation instead of per-subnet
- Separate IPv4 and IPv6 processes
- Authentication moved to IPsec

**EIGRP for IPv6:**
- Enhanced EIGRP with IPv6 support
- Maintains DUAL algorithm benefits
- Separate IPv6 routing process
- Fast convergence characteristics

**IS-IS for IPv6:**
- Multi-topology IS-IS (MT-ISIS)
- Single protocol for dual-stack
- IPv6 reachability TLVs
- Efficient resource utilization

## IPv6 BGP (MP-BGP)

**Multiprotocol BGP:**
- Address Family Identifier (AFI)
- Subsequent Address Family Identifier (SAFI)
- IPv6 unicast and multicast support
- Separate routing tables

## IPv6 Neighbor Discovery

**Neighbor Discovery Protocol (NDP):**
- Router discovery
- Address resolution
- Duplicate address detection
- Redirect functionality

## IPv6 Transition Mechanisms

**Dual Stack:**
- Simultaneous IPv4 and IPv6 operation
- Independent routing protocols
- Protocol selection based on destination

**Tunneling:**
- 6to4 tunneling
- Teredo tunneling
- ISATAP tunneling
- IPv6 over IPv4 encapsulation

## IPv6 Routing Benefits

- **Simplified Header**: Efficient packet processing
- **Auto-configuration**: Stateless address configuration
- **Built-in Security**: IPsec integration
- **Mobility Support**: Mobile IPv6 features
- **QoS Support**: Flow labeling capabilities