---
id: tcp-22
title: VLSM (Variable Length Subnet Masks)
type: text
---


## Description

VLSM allows different subnet masks within the same network, optimizing address space utilization.

## V L S M concept

- Different subnets can have different mask lengths
- Enabled by CIDR and classless routing protocols
- Subnets sized according to actual requirements
- Eliminates address space waste
- Supports hierarchical network design

## V L S M design process

- 1. List all subnet requirements by size
- 2. Sort requirements largest to smallest
- 3. Assign addresses starting with largest
- 4. Use appropriate mask for each subnet
- 5. Document all allocations

## V L S M example: 192.168.1.0/24

- **Sales**: 100 hosts → /25 (126 available)
- **Engineering**: 50 hosts → /26 (62 available)
- **Marketing**: 20 hosts → /27 (30 available)
- **IT**: 10 hosts → /28 (14 available)
- **Point-to-point**: 2 hosts → /30 (2 available)

## Address allocation

- **Sales**: 192.168.1.0/25 (.0-.127)
- **Engineering**: 192.168.1.128/26 (.128-.191)
- **Marketing**: 192.168.1.192/27 (.192-.223)
- **IT**: 192.168.1.224/28 (.224-.239)
- **P2P Links**: 192.168.1.240/30, .244/30, .248/30, .252/30

## Routing protocol requirements

- Must support classless routing
- RIPv2, OSPF, EIGRP, BGP support VLSM
- RIPv1 and IGRP do not support VLSM
- Route advertisements include subnet mask

## V L S M advantages

- Optimal address space utilization
- Flexible network design
- Scalable addressing scheme
- Reduced routing table size
- Better network organization

## V L S M challenges

- More complex planning required
- Careful documentation essential
- Routing protocol compatibility
- Potential for addressing errors
- Requires skilled network administrators