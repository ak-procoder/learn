---
id: tcp-14
title: Subnetting Calculations Step-by-Step
type: text
---

## Description

Master the mathematical process of subnetting with systematic calculation methods.

## Step-by-step process

- 1. Determine number of subnets needed
- **2. Calculate bits to borrow**: n = log2(subnets)
- 3. Determine new subnet mask
- 4. Calculate subnet increment
- 5. List all subnet ranges
- 6. Identify network, broadcast, and usable ranges

## Example: 192.168.10.0/24 into 8 subnets

- **Step 1**: Need 8 subnets
- **Step 2**: 2^3 = 8, so borrow 3 bits
- **Step 3**: /24 + 3 = /27 (255.255.255.224)
- **Step 4**: 256 - 224 = 32 (subnet increment)
- **Step 5**: Subnets

## Detailed subnet breakdown

- **Subnet 0**: 192.168.10.0/27
- **- Network**: 192.168.10.0
- **- Usable**: 192.168.10.1 - 192.168.10.30
- **- Broadcast**: 192.168.10.31
- **Subnet 1**: 192.168.10.32/27
- **- Network**: 192.168.10.32
- **- Usable**: 192.168.10.33 - 192.168.10.62
- **- Broadcast**: 192.168.10.63

## Quick calculation tricks

- Magic number = 256 - subnet mask value
- Subnets increment by magic number
- Host range = subnet to (next subnet - 1)
- Usable hosts = range - 2 (network + broadcast)

## Common subnet sizes

- **/30**: 4 addresses, 2 usable (point-to-point)
- **/29**: 8 addresses, 6 usable (small office)
- **/28**: 16 addresses, 14 usable (department)
- **/27**: 32 addresses, 30 usable (small network)
- **/26**: 64 addresses, 62 usable (medium network)
- **/25**: 128 addresses, 126 usable (large network)