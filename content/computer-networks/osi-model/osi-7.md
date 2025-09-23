---
id: osi-7
title: "Layer 2: MAC Addressing and ARP"
type: text
---

## M A C address structure

- 48-bit (6 bytes) hexadecimal address
- **Format**: XX
- **First 24 bits**: Organizationally Unique Identifier (OUI)
- **Last 24 bits**: Network Interface Controller specific

## M A C address characteristics

- **Burned-in Address (BIA)**: Permanently assigned by manufacturer
- **Locally administered**: Can be modified by software
- **Universal/Local bit**: Indicates if globally unique
- **Individual/Group bit**: Unicast vs multicast addressing

## Special  M A C addresses

- **Broadcast**: FF
- **Multicast**: First bit of first byte = 1
- **Unicast**: First bit of first byte = 0
- **Null address**: 00

## Address  Resolution  Protocol ( A R P)

- **Purpose**: Map IP addresses to MAC addresses
- **Operation**: Broadcast ARP request, receive ARP reply
- **ARP table**: Cache of IP-to-MAC mappings
- **ARP types**: ARP request, ARP reply, RARP, Proxy ARP

## A R P process

- Host needs to send packet to known IP address
- Check ARP table for MAC address mapping
- If not found, broadcast ARP request
- Target host responds with ARP reply containing MAC
- Sender caches mapping and transmits original packet