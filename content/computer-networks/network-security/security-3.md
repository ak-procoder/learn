---
id: security-3
title: Firewalls and Access Control
type: text
---

## Firewall Types:

### Packet Filtering Firewalls:
• Examine packet headers
• Filter based on source/destination IP, ports
• Stateless operation
• Fast but limited inspection

### Stateful Inspection Firewalls:
• Track connection states
• Maintain session tables
• More secure than packet filtering
• Moderate performance impact

### Application Layer Firewalls:
• Deep packet inspection
• Application-aware filtering
• Protocol validation
• Higher security, lower performance

### Next-Generation Firewalls (NGFW):
• Integrated IPS/IDS
• Application identification
• User awareness
• SSL inspection

### Firewall Deployment:
• Perimeter: Network edge protection
• Internal: Network segmentation
• Host-based: Individual system protection
• Distributed: Multiple enforcement points

### Access Control Lists (ACLs):
• Standard ACLs: Source IP only
• Extended ACLs: Source, destination, protocol, ports
• Named ACLs: Descriptive names
• Time-based ACLs: Schedule-based rules