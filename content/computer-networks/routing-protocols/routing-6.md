---
id: routing-6
title: EIGRP - Enhanced Interior Gateway Routing Protocol
type: text
---

## EIGRP Overview

EIGRP is Cisco's advanced distance vector routing protocol with enhanced features and fast convergence.

## EIGRP Characteristics

- **Advanced Distance Vector**: Hybrid routing protocol
- **Cisco Proprietary**: Now open standard (RFC 7868)
- **Fast Convergence**: Sub-second convergence times
- **Unequal Cost Load Balancing**: Multiple path utilization
- **VLSM Support**: Variable Length Subnet Masking

## EIGRP Components

**Neighbor Discovery and Recovery:**
- Hello packets for neighbor detection
- Reliable Transport Protocol (RTP)
- Neighbor adjacency maintenance

**Reliable Transport Protocol:**
- Guaranteed packet delivery
- Sequence numbers for ordering
- Acknowledgment mechanisms

**DUAL Algorithm:**
- Diffusing Update Algorithm
- Loop-free path calculation
- Feasible successor identification

## EIGRP Metrics

**Composite Metric Calculation:**
- **Bandwidth**: Slowest link in path
- **Delay**: Cumulative delay
- **Reliability**: Link reliability factor
- **Load**: Link utilization
- **MTU**: Maximum Transmission Unit

**Default K Values:**
- K1 = 1 (Bandwidth)
- K2 = 0 (Load)
- K3 = 1 (Delay)
- K4 = 0 (Reliability)
- K5 = 0 (MTU)

## EIGRP Tables

**Neighbor Table:**
- Adjacent router information
- Hello interval and hold time
- Interface and IP addresses

**Topology Table:**
- All learned routes
- Successor and feasible successor
- Metric calculations

**Routing Table:**
- Best paths to destinations
- Successor routes only
- Administrative distance of 90

## EIGRP Packet Types

- **Hello**: Neighbor discovery and keepalive
- **Update**: Routing information exchange
- **Query**: Route computation requests
- **Reply**: Response to queries
- **ACK**: Acknowledgment packets

## EIGRP Benefits

- **Rapid Convergence**: DUAL algorithm efficiency
- **Bandwidth Efficiency**: Incremental updates only
- **Scalability**: Hierarchical design support
- **Load Balancing**: Unequal cost path utilization
- **Authentication**: MD5 and SHA authentication