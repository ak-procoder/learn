---
id: tcp-21
title: CIDR (Classless Inter-Domain Routing)
type: text
---

## Description

CIDR eliminates address class limitations and enables more flexible addressing and routing.

## C I D R fundamentals

- **Classless addressing**: No Class A/B/C restrictions
- Variable Length Subnet Masks (VLSM)
- **Notation**: network/prefix-length (e.g., 192.168.0.0/24)
- Efficient address space utilization
- Hierarchical addressing structure

## C I D R benefits

- Reduces routing table size through aggregation
- More efficient use of IP address space
- Flexible subnet sizes to match requirements
- Supports hierarchical network design
- Essential for internet scaling

## C I D R notation examples

- **/8**: 255.0.0.0 (16,777,214 hosts)
- **/16**: 255.255.0.0 (65,534 hosts)
- **/20**: 255.255.240.0 (4,094 hosts)
- **/22**: 255.255.252.0 (1,022 hosts)
- **/24**: 255.255.255.0 (254 hosts)
- **/26**: 255.255.255.192 (62 hosts)
- **/28**: 255.255.255.240 (14 hosts)
- **/30**: 255.255.255.252 (2 hosts)

## Address allocation efficiency

- **Pre-CIDR**: Class B for 500 hosts (waste 65,000)
- **With CIDR**: /23 for 500 hosts (perfect fit)
- ISPs allocate appropriate sized blocks
- Organizations can grow incrementally

## C I D R and routing

- Longest prefix match rule
- More specific routes preferred
- Route aggregation reduces table size
- Enables provider-based addressing

## Practical  C I D R example

- **ISP allocated**: 203.0.113.0/24
- **Customer A needs 100 hosts**: 203.0.113.0/25
- **Customer B needs 50 hosts**: 203.0.113.128/26
- **Customer C needs 20 hosts**: 203.0.113.192/27
- **Remaining**: 203.0.113.224/27 for future use