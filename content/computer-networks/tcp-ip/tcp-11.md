---
id: tcp-11
title: ARP and Address Resolution
type: text
---

## Description

Address Resolution Protocol (ARP) maps IP addresses to MAC addresses for local network communication.

## A R P purpose

- Resolves IP addresses to MAC addresses
- Required for Layer 2 frame delivery
- Operates only within broadcast domain
- Maintains ARP cache for efficiency

## A R P process

- 1. Host needs to send packet to IP address
- 2. Checks ARP cache for MAC address
- 3. If not found, broadcasts ARP request
- 4. Target host responds with ARP reply
- 5. Requesting host caches the mapping
- 6. Frame can now be sent to MAC address

## A R P message types

- **ARP Request**: 'Who has IP X.X.X.X?'
- **- Broadcast to FF**: FF
- - Contains sender's IP and MAC
- **ARP Reply**: 'I have IP X.X.X.X'
- - Unicast response to requester
- - Contains target's IP and MAC

## A R P table management

- **Dynamic entries**: Learned automatically
- **Static entries**: Manually configured
- **Timeout**: Entries expire (typically 2-20 minutes)
- **Gratuitous ARP**: Announces own mapping

## Related protocols

- **RARP**: Reverse ARP (obsolete, replaced by DHCP)
- **Proxy ARP**: Router responds for other hosts
- **GARP**: Gratuitous ARP for duplicate detection
- IPv6 uses Neighbor Discovery Protocol (NDP)

## A R P security concerns

- ARP spoofing/poisoning attacks
- No authentication in basic ARP
- Can redirect traffic to attacker
- **Mitigation**: Static ARP entries, DAI