---
id: tcp-25
title: Advanced IPv6 and Dual-Stack Networks
type: text
---


## Description

Advanced IPv6 concepts and strategies for dual-stack network deployment.

## I Pv6 subnetting

- Typically use /64 for LAN segments
- **Interface ID**: 64 bits (EUI-64 or random)
- **Subnet ID**: Variable length
- No broadcast, uses multicast instead
- Neighbor Discovery Protocol (NDP)

## I Pv6 address types detail

- **Global Unicast**: 2000
- **Link-Local**: FE80
- **Unique Local**: FC00
- **Loopback**: 
- **Unspecified**: 

## I Pv6 configuration methods

- Static configuration
- SLAAC (Stateless Address Autoconfiguration)
- DHCPv6 (Stateful configuration)
- **Hybrid**: SLAAC + DHCPv6 for options

## Dual-stack deployment

- Run IPv4 and IPv6 simultaneously
- Applications choose preferred protocol
- Happy Eyeballs algorithm
- Gradual migration strategy
- Maintains backward compatibility

## Tunneling mechanisms

- **6to4**: Automatic tunneling over IPv4
- **Teredo**: Tunneling through NAT
- **6rd**: ISP-managed tunneling
- **ISATAP**: Intra-site tunneling
- **Manual tunnels**: Point-to-point

## I Pv6 migration strategies

- 1. Dual-stack deployment
- 2. IPv6-only internal networks
- 3. IPv4 as overlay service
- 4. Translation at borders
- 5. Full IPv6-only operation

## Practical considerations

- DNS AAAA records for IPv6
- Firewall rules for both protocols
- Monitoring both address families
- Training for network staff
- Application compatibility testing

## I Pv6 security

- Larger address space reduces scanning
- IPSec integration
- Privacy extensions
- Secure Neighbor Discovery
- First-hop security challenges