---
id: osi-12
title: "Layer 3: IP Addressing Fundamentals"
type: text
---


## I Pv4 address structure

- 32-bit addresses (4.3 billion total addresses)
- **Dotted decimal notation**: 192.168.1.1
- **Network portion**: Identifies the network
- **Host portion**: Identifies device within network
- **Subnet mask**: Separates network and host portions

## Classful addressing

- **Class A**: 1.0.0.0 to 126.255.255.255 (/8, 16M hosts)
- **Class B**: 128.0.0.0 to 191.255.255.255 (/16, 65K hosts)
- **Class C**: 192.0.0.0 to 223.255.255.255 (/24, 254 hosts)
- **Class D**: 224.0.0.0 to 239.255.255.255 (multicast)
- **Class E**: 240.0.0.0 to 255.255.255.255 (experimental)

## Classless addressing ( C I D R)

- Variable Length Subnet Masking (VLSM)
- **CIDR notation**: 192.168.1.0/24
- **Supernetting**: Combining smaller networks
- More efficient address allocation
- Reduced routing table size

## Special  I Pv4 addresses

- **Loopback**: 127.0.0.0/8 (127.0.0.1 = localhost)
- **Private addresses**: 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16
- **APIPA**: 169.254.0.0/16 (automatic private addressing)
- **Multicast**: 224.0.0.0/4
- **Broadcast**: Last address in subnet (e.g., 192.168.1.255)

## I Pv6 addressing

- 128-bit addresses (340 undecillion addresses)
- **Hexadecimal notation**: 2001
- **Address compression**: Remove leading zeros and consecutive zeros
- **Address types**: Unicast, multicast, anycast
- No broadcast addresses (replaced by multicast)