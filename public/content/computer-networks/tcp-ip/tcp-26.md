---
id: tcp-26
title: NAT (Network Address Translation)
type: text
---

## Description

NAT translates private IP addresses to public addresses, enabling internet connectivity for private networks.

## N A T types

- **Static NAT**: One-to-one permanent mapping
- **Dynamic NAT**: One-to-one from address pool
- **PAT/NAPT**: Many-to-one using port numbers
- **Twice NAT**: Translation on both sides

## P A T ( Port  Address  Translation)

- Most common NAT implementation
- Uses port numbers to track sessions
- Many internal hosts share one public IP
- Maintains translation table
- Also called NAT overload

## N A T translation process

- 1. Internal host sends packet
- 2. NAT device intercepts packet
- 3. Replaces source IP and port
- 4. Records translation in table
- 5. Forwards packet to internet
- 6. Return traffic translated back

## N A T translation table example

- Inside Local | Inside Global | Outside Global
- **192.168.1.10**: 1024 | 203.0.113.1
- **192.168.1.20**: 1025 | 203.0.113.1
- Tracks active sessions for translation

## N A T benefits

- Conserves public IP addresses
- Provides security through obscurity
- Allows private network addressing
- Enables internet connectivity
- Centralized internet access control

## N A T limitations

- Breaks end-to-end connectivity
- Complicates peer-to-peer applications
- Issues with some protocols (FTP, SIP)
- Single point of failure
- Performance bottleneck

## N A T traversal techniques

- **UPnP**: Automatic port mapping
- **STUN**: Session Traversal Utilities
- **TURN**: Traversal Using Relays
- **ICE**: Interactive Connectivity Establishment
- Application Layer Gateways (ALG)