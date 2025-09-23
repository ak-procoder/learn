---
id: routing-17
title: Quality of Service in Routing
type: text
---

## QoS Routing Overview

Integrating quality of service considerations into routing decisions for optimized application performance.

## QoS Concepts

**Service Requirements:**
- **Bandwidth**: Minimum guaranteed capacity
- **Latency**: Maximum acceptable delay
- **Jitter**: Delay variation tolerance
- **Packet Loss**: Maximum loss percentage
- **Availability**: Service uptime requirements

**Traffic Classification:**
- **Voice Traffic**: Low latency, low jitter critical
- **Video Traffic**: High bandwidth, moderate latency
- **Data Traffic**: Variable requirements
- **Control Traffic**: Network protocol overhead
- **Management Traffic**: Network administration

## QoS-Aware Routing

**Constraint-Based Routing:**
- **Multiple Metrics**: Bandwidth, delay, loss
- **Path Computation**: QoS-constrained shortest path
- **Admission Control**: Resource availability checking
- **Preemption**: Priority-based resource allocation
- **Alternative Paths**: QoS-compliant backup routes

**Traffic Engineering Integration:**
- **MPLS TE**: Explicit QoS paths
- **RSVP-TE**: Resource reservation
- **DiffServ TE**: Class-based engineering
- **Auto-bandwidth**: Dynamic capacity adjustment
- **Fast Reroute**: QoS-aware protection

## DiffServ Architecture

**Per-Hop Behaviors (PHBs):**
- **Expedited Forwarding (EF)**: Premium service
- **Assured Forwarding (AF)**: Guaranteed bandwidth
- **Best Effort (BE)**: Default service
- **Class Selector (CS)**: Backward compatibility

**DSCP Markings:**
- **Voice**: EF (46)
- **Video**: AF41 (34), AF42 (36), AF43 (38)
- **Critical Data**: AF31 (26), AF32 (28), AF33 (30)
- **Best Effort**: Default (0)

## IntServ Architecture

**Resource Reservation:**
- **RSVP Protocol**: Resource reservation setup
- **Flow Specifications**: QoS requirements
- **Admission Control**: Resource availability check
- **Path State**: Reservation maintenance
- **Scalability Limitations**: Per-flow state

## Routing Protocol QoS Extensions

**OSPF QoS Extensions:**
- **QoS Metrics**: Delay, bandwidth, loss
- **Traffic Engineering**: TE extensions
- **Opaque LSAs**: QoS information distribution
- **Multi-topology**: Separate QoS topologies

**IS-IS QoS Extensions:**
- **Extended Metrics**: 32-bit metric space
- **Sub-TLVs**: QoS attribute encoding
- **Multi-topology IS-IS**: Service-specific topologies
- **Traffic Engineering**: TE sub-TLVs

## QoS Routing Algorithms

**Widest Shortest Path:**
- **Primary**: Shortest path
- **Secondary**: Widest bandwidth
- **Suitable**: Bandwidth-constrained applications

**Shortest Widest Path:**
- **Primary**: Widest bandwidth
- **Secondary**: Shortest path
- **Suitable**: High-bandwidth applications

**Multi-Constrained Path:**
- **Multiple Metrics**: Simultaneous constraints
- **NP-Complete**: Computational complexity
- **Heuristics**: Practical approximations

## Implementation Challenges

- **Scalability**: State information overhead
- **Complexity**: Multi-metric optimization
- **Stability**: Routing oscillation prevention
- **Interoperability**: Vendor compatibility
- **Performance**: Real-time computation requirements