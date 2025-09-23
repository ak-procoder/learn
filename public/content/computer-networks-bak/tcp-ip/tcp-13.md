---
id: tcp-13
title: Introduction to Subnetting
type: text
---


## Description

Subnetting divides a large network into smaller, more manageable subnetworks for better organization and security.

## Why subnet?

- Improve network performance by reducing broadcast traffic
- Enhance security through network segmentation
- Better organization of network resources
- More efficient use of IP address space
- Easier network management and troubleshooting

## Subnetting basics

- Borrowing bits from host portion for network
- Each borrowed bit doubles the number of subnets
- Each borrowed bit halves the number of hosts
- **Formula**: Subnets = 2^n (n = borrowed bits)
- **Formula**: Hosts = 2^h - 2 (h = remaining host bits)

## Subnet mask changes

- **Default /24**: 255.255.255.0 (8 host bits)
- **Borrow 1 bit**: /25 = 255.255.255.128 (7 host bits)
- **Borrow 2 bits**: /26 = 255.255.255.192 (6 host bits)
- **Borrow 3 bits**: /27 = 255.255.255.224 (5 host bits)
- **Borrow 4 bits**: /28 = 255.255.255.240 (4 host bits)

## Subnetting example

- **Network**: 192.168.1.0/24 (254 hosts)
- **Need**: 4 subnets
- **Borrow**: 2 bits (2^2 = 4 subnets)
- **New mask**: /26 (255.255.255.192)
- **Hosts per subnet**: 2^6 - 2 = 62

## Subnet boundaries

- **Subnet 0**: 192.168.1.0/26 (0-63)
- **Subnet 1**: 192.168.1.64/26 (64-127)
- **Subnet 2**: 192.168.1.128/26 (128-191)
- **Subnet 3**: 192.168.1.192/26 (192-255)