---
id: routing-6
title: IS-IS - Intermediate System to Intermediate System
type: text
---


## IS-IS Overview

IS-IS is a link-state routing protocol designed for large-scale networks and service provider environments.

## IS-IS Characteristics

- **Link-State Protocol**: Complete topology awareness
- **ISO Standard**: Originally for OSI protocol stack
- **Dual Stack**: Supports both IPv4 and IPv6
- **Scalable Design**: Two-level hierarchical structure
- **Fast Convergence**: Rapid topology change adaptation

## IS-IS vs OSPF Comparison

**Similarities:**
- Link-state algorithms
- Shortest path first calculation
- Hierarchical design
- Fast convergence

**Differences:**
- **Protocol Stack**: IS-IS operates at Layer 2, OSPF at Layer 3
- **Addressing**: IS-IS uses NET addresses, OSPF uses IP
- **Areas**: IS-IS routers belong to one area, OSPF multiple
- **Deployment**: IS-IS common in ISPs, OSPF in enterprises

## IS-IS Hierarchy

**Level 1 (L1) Routers:**
- Intra-area routing
- Knowledge of own area only
- Forward inter-area traffic to Level 1-2 routers

**Level 2 (L2) Routers:**
- Inter-area routing
- Area backbone connectivity
- Maintain Level 2 topology database

**Level 1-2 Routers:**
- Both intra-area and inter-area routing
- Connect Level 1 areas to backbone
- Maintain both L1 and L2 databases

## IS-IS Addressing

**Network Entity Title (NET):**
- Area ID: Identifies the routing area
- System ID: Unique router identifier (6 bytes)
- NSEL: Network Service Access Point (always 00)

**Example NET**: 49.0001.1921.6800.1001.00
- Area: 49.0001
- System ID: 1921.6800.1001
- NSEL: 00

## IS-IS Packet Types

- **Hello PDUs**: Neighbor discovery and adjacency
- **LSP**: Link State PDU for topology information
- **CSNP**: Complete Sequence Number PDU
- **PSNP**: Partial Sequence Number PDU

## IS-IS Benefits

- **Vendor Neutral**: Open standard implementation
- **Scalability**: Large network support
- **Efficiency**: Minimal overhead
- **Flexibility**: Easy network expansion
- **Reliability**: Robust protocol design

## IS-IS Deployment

- **Service Providers**: ISP backbone networks
- **Large Enterprises**: Campus and WAN networks
- **Data Centers**: Modern data center fabrics
- **Government**: Critical infrastructure networks