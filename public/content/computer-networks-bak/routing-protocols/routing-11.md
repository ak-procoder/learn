---
id: routing-11
title: Route Redistribution and Protocol Interaction
type: text
---


## Route Redistribution Overview

Exchanging routing information between different routing protocols in multi-protocol environments.

## Redistribution Concepts

- **Protocol Translation**: Converting between routing protocols
- **Administrative Distance**: Protocol trustworthiness ranking
- **Metric Translation**: Converting between different metrics
- **Route Filtering**: Controlling redistributed routes
- **Route Tagging**: Marking routes for identification

## Administrative Distance Values

- **Connected**: 0 (directly connected networks)
- **Static**: 1 (manually configured routes)
- **EIGRP**: 90 (internal), 170 (external)
- **OSPF**: 110 (intra-area and inter-area)
- **RIP**: 120 (all RIP routes)
- **External EIGRP**: 170
- **iBGP**: 200, **eBGP**: 20

## Redistribution Challenges

**Routing Loops:**
- Two-way redistribution loops
- Administrative distance conflicts
- Route feedback problems
- Suboptimal path selection

**Metric Incompatibility:**
- Different metric types
- Infinite metrics
- Metric scaling issues
- Default metric assignment

**Route Flapping:**
- Inconsistent route advertisements
- Protocol convergence differences
- Network instability
- Performance degradation

## Redistribution Methods

**One-Way Redistribution:**
- Single direction route sharing
- Simpler configuration
- Reduced loop potential
- Limited connectivity

**Two-Way Redistribution:**
- Bidirectional route sharing
- Complete connectivity
- Complex configuration
- Higher loop risk

**Mutual Redistribution:**
- Multiple redistribution points
- Redundancy and load sharing
- Sophisticated filtering required
- Advanced route control

## Route Filtering Techniques

**Prefix Lists:**
- IP address range filtering
- Exact and range matching
- Sequence-based processing
- Flexible configuration

**Route Maps:**
- Complex conditional filtering
- Attribute modification
- Policy-based routing
- Advanced route manipulation

**Distribute Lists:**
- Access list-based filtering
- Simple permit/deny logic
- Interface-specific application
- Basic route control

## Best Practices

- **Minimize Redistribution**: Use single protocol when possible
- **Default Routes**: Reduce routing table size
- **Route Filtering**: Control redistributed routes
- **Metric Assignment**: Consistent metric policies
- **Documentation**: Maintain redistribution policies