---
id: tcp-20
title: Subnetting Troubleshooting
type: text
---


## Description

Common subnetting problems and systematic troubleshooting approaches.

## Common subnet problems

- Incorrect subnet mask configuration
- IP address in wrong subnet
- Overlapping subnet ranges
- Missing or incorrect default gateway
- DHCP scope misconfiguration

## Connectivity symptoms

- Can ping within subnet but not outside
- Can reach some hosts but not others
- DHCP clients not getting addresses
- Intermittent connectivity issues
- Duplicate IP address conflicts

## Troubleshooting methodology

- 1. Verify IP configuration (ipconfig/ifconfig)
- 2. Check subnet mask and gateway
- 3. Test local subnet connectivity
- 4. Test gateway connectivity
- 5. Use ping and traceroute
- 6. Verify routing tables

## Diagnostic commands

- **Windows**: ipconfig /all, route print
- **Linux**: ip addr, ip route, netstat -rn
- **ping**: Test basic connectivity
- **traceroute/tracert**: Path analysis
- **arp -a**: Check ARP table
- netsh int ip show config (Windows)

## Example troubleshooting case

- **Problem**: Host 192.168.1.50/25 cannot reach internet
- **Check 1**: Gateway should be 192.168.1.1 (in same subnet)
- **Check 2**: Subnet range is .0-.127, host is valid
- **Check 3**: ping 192.168.1.1 (test gateway)
- **Check 4**: ping 8.8.8.8 (test external)
- **Check 5**: traceroute to identify hop failure

## Prevention strategies

- Use IPAM tools for address tracking
- Implement consistent naming conventions
- Document network topology
- Regular network audits
- Standardize configurations
- Automated testing and monitoring

## Tools and resources

- **Subnet calculators**: Online and apps
- Network documentation tools
- IP address management systems
- Network monitoring software
- Configuration management tools