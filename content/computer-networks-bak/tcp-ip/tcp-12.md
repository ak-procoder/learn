---
id: tcp-12
title: ICMP and Network Diagnostics
type: text
---


## Description

Internet Control Message Protocol (ICMP) provides error reporting and diagnostic functions for IP networks.

## I C M P purpose

- Error reporting for IP protocol
- Network diagnostic capabilities
- Path MTU discovery
- Router advertisement and discovery

## Common  I C M P message types

- **Type 0**: Echo Reply (ping response)
- **Type 3**: Destination Unreachable
- **Type 8**: Echo Request (ping)
- **Type 11**: Time Exceeded (traceroute)
- **Type 12**: Parameter Problem
- **Type 5**: Redirect Message

## Destination unreachable codes

- **Code 0**: Network unreachable
- **Code 1**: Host unreachable
- **Code 2**: Protocol unreachable
- **Code 3**: Port unreachable
- **Code 4**: Fragmentation needed but DF set
- **Code 6**: Destination network unknown

## Ping utility

- Uses ICMP Echo Request/Reply
- Tests basic connectivity
- Measures round-trip time (RTT)
- **Example**: ping -c 4 8.8.8.8
- **Options**: count, interval, packet size

## Traceroute utility

- Maps network path to destination
- Uses TTL/hop limit manipulation
- ICMP Time Exceeded responses
- Shows each router hop
- Identifies network bottlenecks

## I C M P security considerations

- Can reveal network topology
- Used in reconnaissance attacks
- DDoS amplification potential
- Often filtered by firewalls
- Rate limiting recommended