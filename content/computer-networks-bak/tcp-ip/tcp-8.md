---
id: tcp-8
title: IPv4 Address Classes
type: text
---


## Description

Traditional IPv4 addressing divides addresses into classes based on the first octet value.

## Class  A addresses

- **Range**: 1.0.0.0 to 126.255.255.255
- **First bit**: 0xxxxxxx
- **Default mask**: 255.0.0.0 (/8)
- **Networks**: 126 (2^7 - 2)
- **Hosts per network**: 16,777,214 (2^24 - 2)
- **Used for**: Very large organizations

## Class  B addresses

- **Range**: 128.0.0.0 to 191.255.255.255
- **First bits**: 10xxxxxx
- **Default mask**: 255.255.0.0 (/16)
- **Networks**: 16,384 (2^14)
- **Hosts per network**: 65,534 (2^16 - 2)
- **Used for**: Medium-sized organizations

## Class  C addresses

- **Range**: 192.0.0.0 to 223.255.255.255
- **First bits**: 110xxxxx
- **Default mask**: 255.255.255.0 (/24)
- **Networks**: 2,097,152 (2^21)
- **Hosts per network**: 254 (2^8 - 2)
- **Used for**: Small organizations

## Special classes

- **Class D (224-239)**: Multicast addresses
- **Class E (240-255)**: Reserved for research
- **127.x.x.x**: Loopback (localhost)

## Private address ranges

- **Class A**: 10.0.0.0/8 (10.0.0.0 - 10.255.255.255)
- **Class B**: 172.16.0.0/12 (172.16.0.0 - 172.31.255.255)
- **Class C**: 192.168.0.0/16 (192.168.0.0 - 192.168.255.255)
- Not routed on public internet (RFC 1918)