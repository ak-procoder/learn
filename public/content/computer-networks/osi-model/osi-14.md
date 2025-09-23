---
id: osi-14
title: "Layer 3: Routing Protocols Overview"
type: text
---

## Static vs dynamic routing

- **Static**: Manually configured routes
- **Dynamic**: Automatically learned routes
- **Static advantages**: Secure, no bandwidth overhead
- **Dynamic advantages**: Automatic adaptation, scalability

## Routing protocol categories

- **Interior Gateway Protocols (IGP)**: Within autonomous system
- **Exterior Gateway Protocols (EGP)**: Between autonomous systems
- **Distance Vector**: RIP, EIGRP
- **Link State**: OSPF, IS-IS
- **Path Vector**: BGP

## Distance vector characteristics

- Share routing tables with neighbors
- Use hop count or composite metrics
- Slower convergence
- Prone to routing loops
- **Examples**: RIP, EIGRP

## Link state characteristics

- Share topology information
- Calculate shortest path tree
- Faster convergence
- More CPU and memory intensive
- **Examples**: OSPF, IS-IS

## Routing metrics

- **Hop count**: Number of routers in path
- **Bandwidth**: Link capacity
- **Delay**: Time to traverse link
- **Reliability**: Link error rate
- **Load**: Link utilization
- **Cost**: Administrative weight