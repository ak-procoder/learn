---
id: tcp-29
title: TCP/IP Routing Fundamentals
type: text
---

## Description

Understanding how routers forward packets between networks using routing tables and protocols.

## Routing basics

- Routers connect different networks
- Forward packets based on destination IP
- Maintain routing tables
- Longest prefix match algorithm
- Default route for unknown destinations

## Routing table components

- Destination network
- Subnet mask/prefix length
- Next hop IP address
- Interface/port
- Metric/cost
- Administrative distance

## Types of routing

- **Static routing**: Manually configured
- **Dynamic routing**: Automatically learned
- **Default routing**: Route of last resort
- **Connected routes**: Directly attached networks
- **Host routes**: /32 specific host routes

## Routing protocols overview

- **Interior Gateway Protocols (IGP)**: 
- **- RIP**: Distance vector, hop count metric
- **- OSPF**: Link state, cost metric
- **- EIGRP**: Hybrid, composite metric
- **Exterior Gateway Protocols (EGP)**: 
- **- BGP**: Path vector, policy-based

## Route selection process

- 1. Administrative distance (protocol preference)
- 2. Metric (within same protocol)
- 3. Longest prefix match
- 4. Load balancing if equal paths
- Lower values preferred for both AD and metric

## Administrative distances

- **Connected**: 0
- **Static**: 1
- **EIGRP**: 90
- **OSPF**: 110
- **RIP**: 120
- **External EIGRP**: 170
- **iBGP**: 200
- **Unknown**: 255

## Routing loop prevention

- **Split horizon**: Don't advertise back
- **Route poisoning**: Advertise unreachable
- **Hold-down timers**: Ignore updates
- **TTL field**: Packets expire
- **Maximum hop counts**: Limit distance