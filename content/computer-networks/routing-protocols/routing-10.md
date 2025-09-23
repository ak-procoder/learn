---
id: routing-10
title: Multicast Routing Protocols
type: text
---

## Multicast Routing Overview

Multicast routing enables efficient one-to-many communication across networks.

## Multicast Concepts

- **Multicast Groups**: Set of receivers for same content
- **Multicast Addresses**: Class D addresses (224.0.0.0/4)
- **Source Trees**: Shortest path from source to receivers
- **Shared Trees**: Common tree for all sources
- **Reverse Path Forwarding**: Loop prevention mechanism

## IGMP - Internet Group Management Protocol

**IGMP Functions:**
- Host-to-router multicast membership
- Join and leave group operations
- Periodic membership queries
- Host membership reports

**IGMP Versions:**
- **IGMPv1**: Basic join/leave functionality
- **IGMPv2**: Leave group messages
- **IGMPv3**: Source-specific multicast support

## PIM - Protocol Independent Multicast

**PIM Dense Mode:**
- Flood and prune mechanism
- Assumes receivers everywhere
- Periodic flooding
- Suitable for dense receiver distribution

**PIM Sparse Mode:**
- Explicit join model
- Rendezvous Point (RP) based
- Shared and source trees
- Efficient for sparse receivers

**PIM Source-Specific Multicast:**
- (S,G) state only
- No shared trees
- Source-specific joins
- Enhanced security

## MSDP - Multicast Source Discovery Protocol

- **Inter-domain Multicast**: Connects PIM domains
- **RP Peering**: Sharing active sources
- **Source Advertisement**: SA messages
- **Anycast RP**: RP redundancy

## Multicast Routing Benefits

- **Bandwidth Efficiency**: Single transmission to multiple receivers
- **Scalability**: Reduces network traffic
- **Application Support**: Video streaming, conferencing
- **Network Optimization**: Efficient resource utilization

## Multicast Applications

- **IPTV**: Television over IP networks
- **Video Conferencing**: Multi-party communications
- **Software Distribution**: Efficient updates
- **Financial Data**: Market data distribution
- **Gaming**: Multiplayer game networks