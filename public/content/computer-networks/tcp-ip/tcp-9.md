---
id: tcp-9
title: Subnet Masks and Network Identification
type: text
---

## Description

Subnet masks determine which part of an IP address represents the network and which part represents the host.

## Subnet mask purpose

- Separates network and host portions of IP address
- Uses binary 1s for network bits, 0s for host bits
- Enables routers to determine packet destinations
- Allows creation of multiple subnets from one network

## Common subnet masks

- /8 = 255.0.0.0 (Class A default)
- /16 = 255.255.0.0 (Class B default)
- /24 = 255.255.255.0 (Class C default)
- /25 = 255.255.255.128 (half of /24)
- /26 = 255.255.255.192 (quarter of /24)
- /27 = 255.255.255.224 (eighth of /24)
- /28 = 255.255.255.240 (sixteenth of /24)
- /30 = 255.255.255.252 (point-to-point links)

## C I D R notation

- Classless Inter-Domain Routing
- /24 means first 24 bits are network
- Remaining 8 bits are for hosts
- 192.168.1.0/24 = 192.168.1.0 with mask 255.255.255.0

## Network calculation example

- **IP**: 192.168.1.150/26
- **Mask**: 255.255.255.192 (11111111.11111111.11111111.11000000)
- **Network**: 192.168.1.128 (network address)
- **Broadcast**: 192.168.1.191 (broadcast address)
- **Usable range**: 192.168.1.129 - 192.168.1.190
- **Total hosts**: 62 (2^6 - 2)