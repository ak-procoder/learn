---
id: routing-8
title: MPLS and Label Distribution Protocol
type: text
---


## MPLS Overview

MPLS provides efficient packet forwarding using labels instead of IP addresses for routing decisions.

## MPLS Fundamentals

- **Label Switching**: Fast forwarding based on labels
- **Traffic Engineering**: Explicit path control
- **Quality of Service**: Service differentiation
- **VPN Support**: Layer 3 and Layer 2 VPNs
- **Protocol Independent**: Works with any Layer 3 protocol

## MPLS Components

**Label Switch Router (LSR):**
- Forwards packets based on labels
- Maintains Label Forwarding Information Base (LFIB)
- Performs label operations (push, pop, swap)

**Label Edge Router (LER):**
- Ingress and egress points
- Maps IP packets to MPLS labels
- Provides MPLS domain interfaces

**Forwarding Equivalence Class (FEC):**
- Group of packets with same forwarding treatment
- Similar destination or QoS requirements
- Basis for label assignment

## Label Distribution Protocol (LDP)

**LDP Functions:**
- Label distribution between LSRs
- FEC-to-label binding
- Label advertisement and withdrawal
- Neighbor discovery and maintenance

**LDP Messages:**
- **Discovery**: Hello messages for neighbor detection
- **Session**: Establishment and maintenance
- **Advertisement**: Label binding distribution
- **Notification**: Error and status information

## MPLS Label Structure

**20-bit Label**: Identifies FEC
**3-bit Traffic Class**: QoS and congestion notification
**1-bit Bottom of Stack**: Last label indicator
**8-bit TTL**: Time to Live field

## MPLS Benefits

- **Performance**: Hardware-based label switching
- **Traffic Engineering**: Optimized path selection
- **VPN Services**: Secure connectivity options
- **Scalability**: Efficient core network operation
- **Service Integration**: Multiple services on single infrastructure

## MPLS Applications

- **Service Provider Networks**: Backbone infrastructure
- **Enterprise VPNs**: Site-to-site connectivity
- **Traffic Engineering**: Bandwidth optimization
- **Quality of Service**: Guaranteed service levels
- **Fast Reroute**: Sub-50ms failover protection