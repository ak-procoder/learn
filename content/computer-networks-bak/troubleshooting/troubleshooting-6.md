---
id: troubleshooting-6
title: Data Link Layer Troubleshooting
type: text
---

## Data Link Layer Overview

The data link layer handles frame delivery between directly connected devices and manages access to the physical medium. Issues at this layer affect local network connectivity and switching operations.

## Common Data Link Layer Issues

### Switch-Related Problems

**Port Configuration Issues:**
- **Duplex mismatches**: Half vs. full duplex conflicts
- **Speed mismatches**: 10/100/1000 Mbps conflicts
- **VLAN misconfigurations**: Wrong VLAN assignments
- **Port security violations**: MAC address violations
- **Disabled ports**: Administrative shutdown

**Spanning Tree Protocol (STP) Issues:**
- **Root bridge problems**: Suboptimal root selection
- **Blocked ports**: Unnecessary port blocking
- **Convergence delays**: Slow STP convergence
- **Loop detection**: False positive loop detection

### VLAN Problems

**VLAN Configuration Errors:**
- **Trunk configuration**: Missing VLANs on trunks
- **Native VLAN mismatches**: Different native VLANs
- **Access port assignments**: Wrong VLAN membership
- **Inter-VLAN routing**: Missing or incorrect routing

**Common VLAN Issues:**
- Users cannot communicate across VLANs
- Broadcast storms in misconfigured VLANs
- Security violations due to wrong VLAN placement
- DHCP issues across VLAN boundaries

### MAC Address Problems

**MAC Address Table Issues:**
- **Table overflow**: Too many MAC addresses
- **Aging time problems**: Incorrect aging settings
- **Duplicate MAC addresses**: MAC address conflicts
- **Static entries**: Incorrect static MAC entries

## Troubleshooting Techniques

### Switch Port Analysis

**Port Status Commands:**
```bash
show interface status          # Port status overview
show interface gi0/1          # Detailed interface info
show interface gi0/1 counters # Error statistics
show mac address-table        # MAC address table
```

**Key Metrics to Monitor:**
- **Input/Output errors**: Frame corruption
- **CRC errors**: Cyclic redundancy check failures
- **Collisions**: Half-duplex collision detection
- **Runts**: Frames smaller than 64 bytes
- **Giants**: Frames larger than maximum size

### VLAN Troubleshooting

**VLAN Verification Commands:**
```bash
show vlan brief              # VLAN summary
show interface trunk         # Trunk configuration
show spanning-tree           # STP status
show vtp status             # VTP configuration
```

**Common VLAN Tests:**
- Verify VLAN membership
- Check trunk allowed VLANs
- Test inter-VLAN routing
- Validate native VLAN configuration

### STP Troubleshooting

**STP Analysis Commands:**
```bash
show spanning-tree           # Overall STP status
show spanning-tree vlan 10   # Specific VLAN STP
show spanning-tree summary   # STP summary
show spanning-tree root      # Root bridge info
```

**STP Problem Indicators:**
- **Frequent topology changes**: Unstable network
- **Suboptimal paths**: Wrong root bridge selection
- **Blocked productive ports**: Inefficient topology
- **Slow convergence**: Extended outage times

## Diagnostic Scenarios

### Duplex Mismatch

**Symptoms:**
- High collision counts
- Poor performance
- Intermittent connectivity

**Diagnosis:**
```bash
show interface gi0/1         # Check duplex settings
show interface gi0/1 counters # Monitor collisions
```

**Resolution:**
- Configure matching duplex settings
- Use auto-negotiation when possible
- Verify cable integrity

### VLAN Communication Issues

**Symptoms:**
- Cannot reach devices in other VLANs
- DHCP not working across VLANs
- Broadcast traffic not contained

**Diagnosis:**
1. Verify VLAN assignments
2. Check trunk configurations
3. Test inter-VLAN routing
4. Validate DHCP helper addresses

### STP Convergence Problems

**Symptoms:**
- Extended network outages during topology changes
- Loops causing broadcast storms
- Inconsistent connectivity

**Diagnosis:**
1. Analyze STP topology
2. Check root bridge placement
3. Review port costs and priorities
4. Monitor topology change frequency