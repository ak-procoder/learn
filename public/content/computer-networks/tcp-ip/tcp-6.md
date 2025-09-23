---
id: tcp-6
title: UDP and Other Transport Protocols
type: text
---

## U D P ( User  Datagram  Protocol)

UDP provides fast, connectionless communication with minimal overhead.

## U D P characteristics

- **Connectionless**: No session establishment
- **Unreliable**: No delivery guarantee
- **Fast**: Minimal overhead
- **Simple**: Basic error detection only

## U D P header (8 bytes)

- Source port (2 bytes)
- Destination port (2 bytes)
- Length (2 bytes)
- Checksum (2 bytes)

## When to use  U D P

- Real-time applications (video, audio)
- Simple request-response (DNS)
- Broadcast/multicast traffic
- Applications handling their own reliability

## U D P applications

- **DNS**: Domain name resolution
- **DHCP**: IP address assignment
- **SNMP**: Network management
- **VoIP**: Voice communication
- **Gaming**: Real-time multiplayer
- **Video Streaming**: Live broadcasts

## Other transport protocols

- **SCTP**: Stream Control Transmission Protocol
- - Multi-homing support
- - Multiple streams
- - Message-oriented
- **DCCP**: Datagram Congestion Control Protocol
- - Unreliable but congestion-controlled
- **QUIC**: Quick UDP Internet Connections
- - Google-developed
- - HTTP/3 foundation
- - Reduced latency