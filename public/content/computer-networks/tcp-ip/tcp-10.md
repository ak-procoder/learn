---
id: tcp-10
title: IPv6 Addressing Overview
type: text
---

## Description

IPv6 uses 128-bit addresses to solve IPv4 address exhaustion, providing virtually unlimited address space.

## I Pv6 characteristics

- 128-bit addresses (vs 32-bit IPv4)
- Hexadecimal notation with colons
- **Total addresses**: 2^128 ≈ 340 undecillion
- No need for NAT or private addresses
- Built-in security with IPSec

## I Pv6 address format

- 8 groups of 4 hexadecimal digits
- **Example**: 2001
- **Shortened**: 2001
- Leading zeros can be omitted
- ****: 

## I Pv6 address types

- **Unicast**: One-to-one communication
- **- Global unicast**: Internet routable (2000
- **- Link-local**: Local segment only (FE80
- **- Unique local**: Private networks (FC00
- **Multicast**: One-to-many (FF00
- **Anycast**: One-to-nearest

## I Pv6 benefits

- Larger address space eliminates NAT
- Simplified header structure
- Better support for mobile devices
- Improved security features
- Efficient routing with aggregation
- Auto-configuration capabilities

## Transition mechanisms

- **Dual stack**: Run IPv4 and IPv6 simultaneously
- **Tunneling**: IPv6 over IPv4 infrastructure
- **Translation**: Convert between protocols
- **6to4**: Automatic IPv6 tunneling