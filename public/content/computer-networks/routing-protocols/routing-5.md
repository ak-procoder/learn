---
id: routing-5
title: RIP - Routing Information Protocol
type: text
---

## RIP Overview

RIP is one of the oldest and simplest distance vector routing protocols used in computer networks.

## RIP Characteristics

- **Distance Vector Protocol**: Uses hop count as metric
- **Maximum Hop Count**: 15 hops (16 = unreachable)
- **Periodic Updates**: Every 30 seconds
- **Split Horizon**: Prevents routing loops
- **Simple Configuration**: Easy to implement and troubleshoot

## RIP Versions

**RIP Version 1 (RIPv1):**
- Classful routing protocol
- No subnet mask support
- Broadcast updates (255.255.255.255)
- No authentication support
- Limited scalability

**RIP Version 2 (RIPv2):**
- Classless routing protocol
- Variable Length Subnet Mask (VLSM) support
- Multicast updates (224.0.0.9)
- Authentication support (plain text and MD5)
- Route tagging for external routes

## RIP Timers

- **Update Timer**: 30 seconds (regular updates)
- **Invalid Timer**: 180 seconds (route marked invalid)
- **Hold-down Timer**: 180 seconds (prevents loops)
- **Flush Timer**: 240 seconds (route removed)

## RIP Operation

- **Route Advertisement**: Send routing table to neighbors
- **Route Learning**: Receive updates from neighbors
- **Metric Calculation**: Hop count + 1
- **Best Path Selection**: Lowest hop count
- **Loop Prevention**: Split horizon, poison reverse

## RIP Limitations

- **Scalability**: 15-hop limit restricts network size
- **Slow Convergence**: Up to 3 minutes for convergence
- **Bandwidth Usage**: Periodic full table updates
- **Limited Metrics**: Only hop count consideration
- **Security**: Limited authentication options

## RIP Use Cases

- **Small Networks**: Simple topology requirements
- **Educational**: Learning routing concepts
- **Legacy Systems**: Maintaining older implementations
- **Branch Offices**: Simple connectivity needs