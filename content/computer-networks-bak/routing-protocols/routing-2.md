---
id: routing-2
title: OSPF - Open Shortest Path First
type: text
---


## O S P F overview

OSPF is a link-state routing protocol that provides fast convergence and scalable hierarchical design.

## Key features

- **Link State Protocol**: Maintains complete topology
- **Hierarchical Design**: Areas reduce complexity
- **Fast Convergence**: Rapid response to changes
- **Load Balancing**: Equal-cost path support
- **Authentication**: Secure routing updates

## O S P F areas

- **Area 0**: Backbone area (mandatory)
- **Standard Areas**: Connect to backbone
- **Stub Areas**: No external routes
- **NSSA**: Not-So-Stubby Areas

## L S A types

- **Type 1**: Router LSA
- **Type 2**: Network LSA
- **Type 3**: Summary LSA
- **Type 4**: ASBR Summary LSA
- **Type 5**: External LSA

## O S P F process

- **1. Neighbor Discovery**: Hello packets
- **2. Database Synchronization**: LSA exchange
- **3. SPF Calculation**: Dijkstra algorithm
- **4. Routing Table Update**: Install best paths

## Metric calculation

- Cost = Reference Bandwidth / Interface Bandwidth
- **Default reference**: 100 Mbps
- Lower cost = preferred path