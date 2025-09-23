---
id: tcp-19
title: Subnet Design Best Practices
type: text
---

## Description

Industry best practices for designing efficient and scalable subnet architectures.

## Design principles

- **Plan for growth**: Allocate more addresses than currently needed
- **Use hierarchical addressing**: Logical structure mirrors physical
- **Standardize subnet sizes**: Consistent /24, /26, etc.
- **Document everything**: IP address management (IPAM)
- **Consider security**: Separate sensitive networks

## Subnet sizing guidelines

- **/30**: Point-to-point links (2 hosts)
- **/29**: Very small networks (6 hosts)
- **/28**: Small departments (14 hosts)
- **/27**: Medium departments (30 hosts)
- **/26**: Large departments (62 hosts)
- **/25**: Large networks (126 hosts)
- **/24**: Standard LAN segment (254 hosts)

## Security considerations

- **DMZ networks**: Separate public-facing servers
- **Management networks**: Network device access
- **User networks**: Workstation segments
- **Server networks**: Backend infrastructure
- **Guest networks**: Visitor access

## V L A N integration

- One subnet per VLAN typically
- VLAN ID often matches subnet
- **Example**: VLAN 10 → 10.1.10.0/24
- Simplifies troubleshooting
- Enables inter-VLAN routing

## Addressing scheme examples

- **Site-based**: 10.{site}.{vlan}.0/24
- **Function-based**: 192.168.{function}.0/24
- **Geographic**: 172.16.{region}.{subnet}/24
- **Hierarchical**: 10.{region}.{site}.{subnet}/24

## Documentation requirements

- IP address allocation table
- Subnet purpose and ownership
- DHCP pool definitions
- Reserved address ranges
- Contact information
- Change management procedures

## Monitoring and maintenance

- Track IP address utilization
- Monitor for address conflicts
- Regular audits of allocations
- Plan for IPv6 transition
- Automate where possible