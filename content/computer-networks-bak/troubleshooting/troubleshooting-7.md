---
id: troubleshooting-7
title: Network Layer Troubleshooting
type: text
---

## Network Layer Fundamentals

The network layer handles routing and logical addressing using IP addresses. Problems at this layer affect end-to-end connectivity and routing between different networks.

## Common Network Layer Issues

### IP Configuration Problems

**Address Configuration Issues:**
- **IP address conflicts**: Multiple devices with same IP
- **Incorrect subnet masks**: Wrong network boundaries
- **Wrong default gateway**: Incorrect or missing gateway
- **DHCP problems**: DHCP server issues or conflicts
- **Static vs. DHCP conflicts**: Configuration mismatches

**Subnetting Problems:**
- **Incorrect subnet calculations**: Wrong network ranges
- **VLSM errors**: Variable Length Subnet Mask mistakes
- **Overlapping subnets**: Conflicting address ranges
- **Missing subnets**: Gaps in addressing scheme

### Routing Issues

**Routing Table Problems:**
- **Missing routes**: No path to destination networks
- **Incorrect routes**: Wrong next-hop addresses
- **Routing loops**: Circular routing paths
- **Asymmetric routing**: Different paths for forward/return
- **Route flapping**: Unstable routing table entries

**Dynamic Routing Protocol Issues:**
- **Neighbor adjacency problems**: Routers not forming neighbors
- **Authentication failures**: Mismatched routing passwords
- **Metric issues**: Suboptimal path selection
- **Convergence delays**: Slow routing updates

### DNS and Name Resolution

**DNS Configuration Problems:**
- **Wrong DNS servers**: Incorrect DNS server addresses
- **DNS server unreachable**: Network connectivity to DNS
- **Missing DNS records**: A, AAAA, CNAME, MX records
- **DNS cache issues**: Stale or corrupted cache entries
- **Reverse DNS problems**: PTR record issues

## Troubleshooting Techniques

### Connectivity Testing

**Basic Connectivity Tests:**
```bash
ping 127.0.0.1              # Loopback test
ping 192.168.1.1            # Default gateway
ping 8.8.8.8                # External connectivity
ping google.com             # DNS resolution test
```

**Advanced Connectivity Analysis:**
```bash
traceroute destination       # Path analysis
mtr destination             # Real-time path monitoring
pathping destination        # Windows path analysis
```

### IP Configuration Verification

**Windows Commands:**
```bash
ipconfig /all               # Complete IP configuration
ipconfig /release           # Release DHCP lease
ipconfig /renew            # Renew DHCP lease
ipconfig /flushdns         # Clear DNS cache
```

**Linux/Mac Commands:**
```bash
ip addr show               # Interface configuration
ip route show              # Routing table
dhclient -r eth0           # Release DHCP lease
dhclient eth0              # Renew DHCP lease
```

### Routing Analysis

**Routing Table Commands:**
```bash
route print                # Windows routing table
netstat -rn               # Unix/Linux routing table
ip route show             # Linux routing table
show ip route             # Cisco router command
```

**Key Routing Information:**
- **Destination networks**: Target network addresses
- **Next-hop addresses**: Where to forward packets
- **Interface**: Outgoing interface for packets
- **Metric/Cost**: Route preference values
- **Administrative distance**: Route trustworthiness

### DNS Troubleshooting

**DNS Query Tools:**
```bash
nslookup google.com        # Basic DNS lookup
dig google.com             # Detailed DNS query
dig @8.8.8.8 google.com    # Query specific server
host google.com            # Simple DNS lookup
```

**DNS Record Types:**
- **A records**: IPv4 address mappings
- **AAAA records**: IPv6 address mappings
- **CNAME records**: Canonical name aliases
- **MX records**: Mail exchange servers
- **PTR records**: Reverse DNS lookups

## Diagnostic Scenarios

### IP Address Conflicts

**Symptoms:**
- Intermittent connectivity
- Error messages about duplicate addresses
- Network performance issues

**Diagnosis Steps:**
1. Check for duplicate IP assignments
2. Verify DHCP scope configuration
3. Scan network for IP conflicts
4. Review static IP assignments

**Tools:**
```bash
arp -a                     # Check ARP table
arping 192.168.1.100      # Test for duplicate IPs
```

### Routing Problems

**Symptoms:**
- Cannot reach specific networks
- Asymmetric routing issues
- Suboptimal path selection

**Diagnosis Steps:**
1. Analyze routing tables
2. Trace packet paths
3. Check routing protocol status
4. Verify route advertisements

### DNS Resolution Failures

**Symptoms:**
- Cannot resolve hostnames
- Slow name resolution
- Intermittent DNS failures

**Diagnosis Steps:**
1. Test with different DNS servers
2. Check DNS server reachability
3. Verify DNS record existence
4. Clear DNS caches

**Common DNS Tests:**
```bash
dig google.com             # Test forward lookup
dig -x 8.8.8.8            # Test reverse lookup
dig google.com @8.8.8.8    # Test specific server
```