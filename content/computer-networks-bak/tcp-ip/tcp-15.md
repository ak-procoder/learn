---
id: tcp-15
title: Subnetting Practice Examples
type: text
---


## Description

Practice subnetting with real-world scenarios and various network requirements.

## Example 1:  Office with 4 departments

- **Given**: 172.16.0.0/16
- **Need**: 4 subnets, ~16,000 hosts each
- **Solution**: Borrow 2 bits → /18
- **Mask**: 255.255.192.0
- **Increment**: 256 - 192 = 64 (in 3rd octet)

## Example 1 subnets

- **Dept A**: 172.16.0.0/18 (0.0 - 63.255)
- **Dept B**: 172.16.64.0/18 (64.0 - 127.255)
- **Dept C**: 172.16.128.0/18 (128.0 - 191.255)
- **Dept D**: 172.16.192.0/18 (192.0 - 255.255)
- **Each subnet**: 16,382 usable hosts

## Example 2:  Small business branches

- **Given**: 10.0.0.0/8
- **Need**: 200 subnets, ~500 hosts each
- **Solution**: Borrow 8 bits → /16
- **Mask**: 255.255.0.0
- **Available**: 256 subnets (10.0.0.0 - 10.255.0.0)

## Example 3:  Point-to-point links

- **Given**: 203.0.113.0/24
- **Need**: 64 point-to-point links (2 hosts each)
- **Solution**: /30 subnets (4 addresses, 2 usable)
- 64 subnets possible from /24 network

## Example 3 first few links

- **Link 1**: 203.0.113.0/30 (.1-.2 usable)
- **Link 2**: 203.0.113.4/30 (.5-.6 usable)
- **Link 3**: 203.0.113.8/30 (.9-.10 usable)
- **Link 4**: 203.0.113.12/30 (.13-.14 usable)

## Validation checklist

- ✓ Enough subnets for requirements?
- ✓ Enough hosts per subnet?
- ✓ No overlapping address ranges?
- ✓ Proper network and broadcast addresses?
- ✓ Room for future growth?