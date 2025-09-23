---
id: tcp-16
title: Binary Subnetting and Bit Manipulation
type: text
---


## Description

Understanding subnetting at the binary level provides deeper insight into address manipulation.

## Binary subnet mask patterns

- **/24**: 11111111.11111111.11111111.00000000
- **/25**: 11111111.11111111.11111111.10000000
- **/26**: 11111111.11111111.11111111.11000000
- **/27**: 11111111.11111111.11111111.11100000
- **/28**: 11111111.11111111.11111111.11110000
- **/29**: 11111111.11111111.11111111.11111000
- **/30**: 11111111.11111111.11111111.11111100

## Binary example: 192.168.1.0/25

- **IP**: 192.168.1.0 = 11000000.10101000.00000001.00000000
- **Mask**: /25 = 11111111.11111111.11111111.10000000
- **Network bits**: First 25 bits
- **Host bits**: Last 7 bits
- **Two subnets possible**: 

## Subnet 0 analysis

- **Range**: 192.168.1.0 - 192.168.1.127
- **Binary start**: ...00000001.00000000
- **Binary end**: ...00000001.01111111
- **Network**: 192.168.1.0
- **Broadcast**: 192.168.1.127
- **Usable**: 192.168.1.1 - 192.168.1.126

## Subnet 1 analysis

- **Range**: 192.168.1.128 - 192.168.1.255
- **Binary start**: ...00000001.10000000
- **Binary end**: ...00000001.11111111
- **Network**: 192.168.1.128
- **Broadcast**: 192.168.1.255
- **Usable**: 192.168.1.129 - 192.168.1.254

## Bit pattern recognition

- Host portion all 0s = Network address
- Host portion all 1s = Broadcast address
- First borrowed bit determines subnet
- Remaining bits determine host within subnet

## Practical binary tips

- Convert only the changing octet to binary
- Focus on borrowed bits for subnet identification
- Use powers of 2 for quick calculations
- Practice with different mask lengths