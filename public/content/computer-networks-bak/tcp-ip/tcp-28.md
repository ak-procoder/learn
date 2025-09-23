---
id: tcp-28
title: DNS (Domain Name System)
type: text
---


## Description

DNS translates human-readable domain names into IP addresses, enabling user-friendly internet navigation.

## D N S hierarchy

- **Root servers**: . (dot)
- **Top-level domains**: .com, .org, .country
- **Second-level domains**: example.com
- **Subdomains**: www.example.com
- Distributed database system

## D N S record types

- **A**: IPv4 address mapping
- **AAAA**: IPv6 address mapping
- **CNAME**: Canonical name (alias)
- **MX**: Mail exchange server
- **NS**: Name server
- **PTR**: Reverse lookup (IP to name)
- **SOA**: Start of authority
- **TXT**: Text information

## D N S resolution process

- 1. Client queries local DNS resolver
- 2. Resolver checks local cache
- 3. If not cached, queries root server
- 4. Root refers to TLD server
- 5. TLD refers to authoritative server
- 6. Authoritative server provides answer
- 7. Answer cached and returned to client

## D N S caching

- Reduces query load on servers
- Improves response time
- TTL (Time To Live) controls duration
- Cached at multiple levels
- Negative caching for non-existent records

## Reverse  D N S

- Maps IP addresses to domain names
- Uses in-addr.arpa domain
- **Example**: 192.0.2.1 → 1.2.0.192.in-addr.arpa
- Important for email servers
- Security and logging applications

## D N S security ( D N S S E C)

- Digital signatures for DNS records
- Prevents DNS spoofing attacks
- Chain of trust from root
- Resource Record Signatures (RRSIG)
- Delegation Signer (DS) records

## Common  D N S issues

- DNS server unreachable
- Incorrect record configuration
- Propagation delays
- Cache poisoning
- Split-brain DNS problems