---
id: tcp-27
title: DHCP (Dynamic Host Configuration Protocol)
type: text
---

## Description

DHCP automatically assigns IP addresses and network configuration to devices on a network.

## D H C P purpose

- Automatic IP address assignment
- Centralized network configuration
- Reduces manual configuration errors
- Enables device mobility
- Efficient address pool management

## D H C P process ( D O R A)

- **1. Discover**: Client broadcasts DHCPDISCOVER
- **2. Offer**: Server responds with DHCPOFFER
- **3. Request**: Client sends DHCPREQUEST
- **4. Acknowledge**: Server sends DHCPACK
- Client now has valid IP configuration

## D H C P message types

- **DHCPDISCOVER**: Client seeks server
- **DHCPOFFER**: Server offers configuration
- **DHCPREQUEST**: Client requests specific config
- **DHCPACK**: Server acknowledges assignment
- **DHCPNAK**: Server denies request
- **DHCPRELEASE**: Client releases address
- **DHCPINFORM**: Client requests parameters only

## D H C P configuration options

- IP address and subnet mask
- Default gateway
- DNS servers
- Domain name
- NTP servers
- Boot filename (PXE)
- TFTP server address

## D H C P lease management

- **Lease time**: How long client keeps address
- **Renewal (T1)**: 50% of lease time
- **Rebinding (T2)**: 87.5% of lease time
- **Lease expiration**: Return to DHCP process
- **Reservation**: Permanent assignment to MAC

## D H C P relay

- Forwards DHCP traffic across subnets
- Router acts as DHCP relay agent
- ip helper-address command
- Enables centralized DHCP server
- Adds relay agent information

## D H C P security concerns

- Rogue DHCP servers
- DHCP starvation attacks
- Unauthorized network access
- DHCP snooping protection
- Port security integration