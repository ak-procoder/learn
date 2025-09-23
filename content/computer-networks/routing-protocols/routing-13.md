---
id: routing-13
title: Policy-Based Routing and Traffic Engineering
type: text
---

## Policy-Based Routing Overview

Controlling packet forwarding based on policies rather than just destination addresses.

## PBR Concepts

- **Route Maps**: Conditional packet forwarding
- **Match Criteria**: Source, destination, protocol, port
- **Set Actions**: Next hop, interface, metric modification
- **Policy Enforcement**: Business rule implementation
- **Traffic Control**: Granular forwarding decisions

## PBR Implementation

**Match Criteria:**
- **Source Address**: Specific hosts or networks
- **Destination Address**: Target destinations
- **Protocol Type**: TCP, UDP, ICMP
- **Port Numbers**: Application-specific ports
- **Packet Size**: MTU-based decisions

**Set Actions:**
- **Set IP Next-hop**: Specify next router
- **Set Interface**: Force exit interface
- **Set IP Default Next-hop**: Backup routing
- **Set Precedence**: QoS marking
- **Set DSCP**: DiffServ marking

## Traffic Engineering

**Objectives:**
- **Optimal Resource Utilization**: Efficient bandwidth usage
- **Load Distribution**: Balanced traffic flows
- **Performance Optimization**: Minimize latency and jitter
- **Service Differentiation**: QoS implementation
- **Fault Tolerance**: Redundant path planning

**Techniques:**
- **MPLS Traffic Engineering**: Explicit path control
- **Equal Cost Load Balancing**: Multiple path utilization
- **Unequal Cost Load Balancing**: Proportional sharing
- **Link Weight Manipulation**: OSPF/IS-IS optimization
- **Route Preference**: Administrative distance tuning

## MPLS Traffic Engineering

**Constraint-Based Routing:**
- **Bandwidth Requirements**: Guaranteed capacity
- **Administrative Groups**: Link affinity
- **Setup Priority**: Path establishment preference
- **Holding Priority**: Path maintenance preference
- **Explicit Route Objects**: Specific path definition

**RSVP-TE (Resource Reservation Protocol):**
- **Path Message**: Tunnel establishment
- **Resv Message**: Resource reservation
- **Label Binding**: MPLS label assignment
- **Fast Reroute**: Sub-50ms protection
- **Auto-bandwidth**: Dynamic capacity adjustment

## Quality of Service Integration

**Traffic Classification:**
- **DSCP Marking**: Differentiated Services
- **Traffic Classes**: Voice, video, data
- **Priority Queuing**: Critical traffic first
- **Bandwidth Allocation**: Guaranteed minimums
- **Congestion Management**: Traffic shaping

## Applications

- **Service Provider Networks**: Customer SLA enforcement
- **Enterprise Networks**: Application prioritization
- **Data Centers**: Load balancing and optimization
- **Branch Offices**: WAN optimization
- **Internet Exchange Points**: Peering policy enforcement