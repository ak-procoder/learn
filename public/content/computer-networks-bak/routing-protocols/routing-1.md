---
id: routing-1
title: Routing Protocol Classification
type: text
---


## Distance vector protocols

Distance vector protocols share routing information with immediate neighbors based on distance metrics.

## Distance vector characteristics

- Share routing table with neighbors
- Use hop count or metrics
- Periodic updates
- Simple to configure

## Distance vector examples

- RIP (Routing Information Protocol)
- - Maximum 15 hops
- - Updates every 30 seconds
- - Simple metric (hop count)
- EIGRP (Enhanced Interior Gateway Routing Protocol)
- - Cisco proprietary
- - Composite metric
- - Fast convergence

## Link state protocols

Link state protocols maintain a complete topology database for intelligent path selection.

## Link state characteristics

- Maintain topology database
- Flood link state advertisements
- Calculate shortest path tree
- Fast convergence

## Link state examples

- OSPF (Open Shortest Path First)
- - Dijkstra algorithm
- - Area-based hierarchy
- - Cost-based metric
- IS-IS (Intermediate System to Intermediate System)
- - Similar to OSPF
- - Used in large service provider networks