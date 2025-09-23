---
id: tcp-18
title: Advanced Subnetting Scenarios
type: text
---


## Description

Complex subnetting scenarios involving multiple requirements and constraints.

## Scenario 1:  Mixed subnet sizes

- **Given**: 192.168.100.0/24
- **Requirements**: 
- - 1 subnet with 100 hosts (Sales)
- - 2 subnets with 50 hosts each (Engineering)
- - 4 subnets with 10 hosts each (Management)

## Solution approach

- Start with largest requirement first
- **Sales**: Needs /25 (126 hosts available)
- **Engineering**: Needs /26 each (62 hosts available)
- **Management**: Needs /28 each (14 hosts available)
- Allocate in order of decreasing size

## Address allocation

- **Sales**: 192.168.100.0/25 (.0-.127)
- **Engineering A**: 192.168.100.128/26 (.128-.191)
- **Engineering B**: 192.168.100.192/26 (.192-.255)
- **Management subnets**: Need to subnet further

## Scenario 2:  Hierarchical design

- **Given**: 10.0.0.0/8 for entire organization
- 3 regions, each with multiple sites
- Each site has multiple departments
- Use hierarchical addressing scheme

## Hierarchical allocation

- **Region 1**: 10.1.0.0/16
- **Region 2**: 10.2.0.0/16
- **Region 3**: 10.3.0.0/16
- **Each region subdivides further**: 
- **Site A**: 10.1.1.0/24
- **Site B**: 10.1.2.0/24
- **Departments**: /26 or /27 subnets

## Growth considerations

- Leave room for expansion
- Use sparse allocation (not every address)
- Document addressing scheme
- Plan for future requirements
- Consider renumbering costs

## Common mistakes

- Not planning for growth
- Allocating non-contiguous blocks
- Ignoring summarization opportunities
- Over-subnetting small networks
- Poor documentation practices