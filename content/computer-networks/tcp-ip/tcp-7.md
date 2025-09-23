---
id: tcp-7
title: IPv4 Addressing Fundamentals
type: text
---

## Description

IPv4 uses 32-bit addresses to uniquely identify devices on a network, written in dotted decimal notation.

## I Pv4 address structure

- 32 bits divided into 4 octets (8 bits each)
- Each octet ranges from 0-255 in decimal
- **Example**: 192.168.1.100 = 11000000.10101000.00000001.01100100
- **Total possible addresses**: 2^32 = 4,294,967,296

## Address components

- **Network portion**: Identifies the network/subnet
- **Host portion**: Identifies specific device on network
- **Subnet mask**: Determines network vs host bits
- **Default gateway**: Router interface for external communication

## Binary to decimal conversion

- 128 | 64 | 32 | 16 | 8 | 4 | 2 | 1
- **Example**: 11000000 = 128 + 64 = 192
- **Example**: 10101000 = 128 + 32 + 8 = 168
- **Practice**: 11110000 = 128 + 64 + 32 + 16 = 240

## Special addresses

- **0.0.0.0**: Default route (this network)
- **127.x.x.x**: Loopback addresses
- **255.255.255.255**: Limited broadcast
- **Network address**: All host bits = 0
- **Broadcast address**: All host bits = 1