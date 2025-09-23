---
id: osi-13
title: "Layer 3: Subnetting and VLSM"
type: text
---

## Subnetting purpose

- Efficient IP address utilization
- Logical network segmentation
- Improved security through isolation
- Reduced broadcast traffic
- Better network management

## Subnetting process

- Determine number of subnets needed
- Determine hosts per subnet required
- Calculate subnet mask (borrow host bits)
- Calculate network addresses
- Assign IP ranges to subnets

## Subnetting example

- **Network**: 192.168.1.0/24 (254 hosts)
- **Requirement**: 4 subnets with 60 hosts each
- **Solution**: Use /26 mask (255.255.255.192)
- **Subnets**: .0/26, .64/26, .128/26, .192/26
- **Each subnet**: 62 usable host addresses

## Variable  Length  Subnet  Masking ( V L S M)

- Different subnet sizes within same major network
- Maximizes address utilization efficiency
- Requires classless routing protocols
- Enables hierarchical network design

## V L S M example

- **Network**: 172.16.0.0/16
- **Large subnet**: 172.16.1.0/24 (254 hosts)
- **Medium subnet**: 172.16.2.0/25 (126 hosts)
- **Small subnet**: 172.16.2.128/26 (62 hosts)
- **Point-to-point**: 172.16.2.192/30 (2 hosts)