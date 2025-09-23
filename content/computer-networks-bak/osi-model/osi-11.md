---
id: osi-11
title: "Layer 3: Network Layer - Fundamentals"
type: text
---


## Layer 3 definition

Network Layer - Responsible for routing packets between different networks and providing logical addressing.

## Primary functions

- **Logical addressing**: IP address assignment and management
- **Routing**: Path determination through internetwork
- **Packet forwarding**: Moving packets toward destination
- **Fragmentation**: Breaking large packets into smaller pieces
- **Reassembly**: Reconstructing original packets
- **Quality of Service**: Traffic prioritization and management

## Routing concepts

- **Next hop**: Next router in path to destination
- **Routing table**: Database of network destinations and paths
- **Administrative distance**: Trustworthiness of routing information
- **Metric**: Cost measurement for path selection
- **Convergence**: Time for all routers to agree on topology

## Packet forwarding process

- Examine destination IP address
- Consult routing table for best match
- Determine next hop router
- Decrement TTL (Time To Live)
- Forward packet to next hop
- Update routing statistics

## Fragmentation and reassembly

- **MTU**: Maximum Transmission Unit of network path
- **Path MTU Discovery**: Finding smallest MTU in path
- **Fragment offset**: Position of fragment in original packet
- **More Fragments flag**: Indicates more fragments follow
- **Don't Fragment flag**: Prohibits fragmentation