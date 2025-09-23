---
id: tcp-3
title: Subnetting and VLSM
type: text
---


## Subnetting fundamentals

Subnetting involves dividing a network into smaller, more manageable subnetworks.

## Why subnet

- Efficient address utilization
- Improved network performance
- Enhanced security through segmentation
- Easier network management

## Subnetting process

- 1. Determine number of subnets needed
- 2. Determine hosts per subnet
- 3. Calculate subnet mask
- 4. Identify subnet ranges

## Example: 192.168.1.0/24 into 4 subnets

- Need 2 bits for 4 subnets (2² = 4)
- **New mask**: /26 (255.255.255.192)
- **192.168.1.0/26 (hosts**: 1-62)
- **192.168.1.64/26 (hosts**: 65-126)
- **192.168.1.128/26 (hosts**: 129-190)
- **192.168.1.192/26 (hosts**: 193-254)

## V L S M ( Variable  Length  Subnet  Masking)

- Different subnet sizes for different needs
- More efficient address utilization
- **Example**: /30 for point-to-point links (2 hosts)
- /28 for small departments (14 hosts)