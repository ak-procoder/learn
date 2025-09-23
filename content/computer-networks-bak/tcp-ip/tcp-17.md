---
id: tcp-17
title: Supernetting and Route Summarization
type: text
---


## Description

Supernetting combines multiple networks into a single larger network for efficient routing.

## Supernetting concept

- Opposite of subnetting
- Combines smaller networks into larger one
- Reduces routing table size
- Also called route aggregation or summarization
- Uses longer prefix to represent multiple routes

## Supernetting example

- **Individual networks**: 
- 192.168.0.0/24
- 192.168.1.0/24
- 192.168.2.0/24
- 192.168.3.0/24
- **Supernet**: 192.168.0.0/22 (covers all four)

## Binary analysis of supernet

- 192.168.0.0 = 11000000.10101000.00000000.00000000
- 192.168.1.0 = 11000000.10101000.00000001.00000000
- 192.168.2.0 = 11000000.10101000.00000010.00000000
- 192.168.3.0 = 11000000.10101000.00000011.00000000
- **Common bits**: First 22 bits match
- **Summary**: 192.168.0.0/22

## C I D R and supernetting

- CIDR enables efficient address allocation
- ISPs assign contiguous blocks
- Organizations can summarize their routes
- Reduces global routing table size
- Essential for internet scalability

## Summarization rules

- Networks must be contiguous
- Must be powers of 2 in count
- All networks must have same prefix length
- Summary covers exact range needed

## Practical applications

- ISP route advertisements
- Corporate network design
- Internal routing optimization
- BGP route aggregation
- Reducing OSPF LSA count

## Summarization examples

- 8 x /24 networks → /21 summary
- 4 x /26 networks → /24 summary
- 2 x /25 networks → /24 summary
- 16 x /28 networks → /24 summary