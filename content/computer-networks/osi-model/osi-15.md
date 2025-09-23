---
id: osi-15
title: "Layer 3: ICMP and Network Diagnostics"
type: text
---

## Internet  Control  Message  Protocol ( I C M P)

- **Purpose**: Error reporting and network diagnostics
- **Protocol number**: 1 (carried in IP packets)
- No reliability guarantees
- Used by network utilities and management tools

## I C M P message types

- **Echo Request/Reply**: Ping functionality
- **Destination Unreachable**: Network/host/port unreachable
- **Time Exceeded**: TTL expired, fragmentation timeout
- **Redirect**: Better route available
- **Parameter Problem**: IP header issues
- **Source Quench**: Congestion control (deprecated)

## Ping utility

- Sends ICMP Echo Request packets
- Measures round-trip time
- Tests basic connectivity
- **Options**: packet size, count, interval
- **Statistics**: min/max/average RTT, packet loss

## Traceroute utility

- Discovers path to destination
- Uses TTL field to reveal routers
- Shows hop-by-hop delays
- Useful for troubleshooting routing issues
- **Variations**: tracert (Windows), tracepath (Linux)

## Network troubleshooting methodology

- **Layer 1**: Check physical connectivity
- **Layer 2**: Verify switching and MAC tables
- **Layer 3**: Test IP connectivity and routing
- Use ping for basic connectivity
- Use traceroute for path analysis