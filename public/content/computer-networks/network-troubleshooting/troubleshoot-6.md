---
id: troubleshoot-6
title: Network Layer Routing Problems
type: text
---

## Network Layer Fundamentals

The Network Layer (Layer 3) is responsible for routing packets between different networks. It provides logical addressing through IP addresses and determines the best path for data transmission across interconnected networks.

### Key Network Layer Functions
- **Logical Addressing**: Using IP addresses to identify devices
- **Routing**: Determining paths between source and destination networks
- **Packet Forwarding**: Moving packets toward their destinations
- **Path Selection**: Choosing optimal routes based on metrics

### Common Network Layer Protocols
- **IPv4**: Internet Protocol version 4 (32-bit addresses)
- **IPv6**: Internet Protocol version 6 (128-bit addresses)
- **ICMP**: Internet Control Message Protocol for error reporting
- **ARP**: Address Resolution Protocol for MAC address resolution

## IP Addressing Issues

### IP Address Configuration Problems
- **Duplicate IP Addresses**: Multiple devices with same IP address
- **Wrong Subnet**: Device configured for incorrect network
- **Incorrect Subnet Mask**: Wrong network boundary definition
- **Invalid IP Range**: Using reserved or non-routable addresses

### IP Address Conflict Detection
```bash
# Windows: Check for IP conflicts
ipconfig /all
arp -a

# Linux: Display IP configuration
ip addr show
ip route show

# Test for duplicate IPs
ping -c 4 192.168.1.100
arp -n | grep 192.168.1.100
```

### Subnet Mask Issues
- **Incorrect Mask Length**: Wrong CIDR notation or subnet mask
- **Subnet Overlap**: Overlapping IP address ranges
- **Host vs Network Bits**: Confusion about host and network portions
- **Variable Length Subnet Masks (VLSM)**: Complex subnetting errors

### Subnet Troubleshooting
```bash
# Calculate network and broadcast addresses
ipcalc 192.168.1.100/24

# Verify subnet membership
ping -c 1 192.168.1.255   # Broadcast ping
ping -c 1 192.168.1.1     # Gateway ping

# Check routing for specific subnet
ip route get 192.168.2.100
```

## Routing Table Problems

### Missing Routes
- **No Default Route**: Missing 0.0.0.0/0 route for internet access
- **Missing Static Routes**: Required static routes not configured
- **Routing Protocol Issues**: Dynamic routes not being learned
- **Administrative Distance**: Incorrect route preferences

### Routing Table Analysis
```bash
# Display routing table (Linux)
ip route show

# Windows routing table
route print

# Cisco router routing table
show ip route

# Check specific route
show ip route 192.168.1.0
```

### Incorrect Routes
- **Wrong Next Hop**: Packets sent to incorrect gateway
- **Route Loops**: Circular routing causing packets to loop
- **Suboptimal Paths**: Routes taking longer than necessary paths
- **Metric Issues**: Incorrect cost calculations affecting path selection

### Route Verification
```bash
# Trace route to destination
traceroute 8.8.8.8        # Linux/Mac
tracert 8.8.8.8           # Windows

# Check specific route details
ip route get 8.8.8.8

# Verify next hop connectivity
ping 192.168.1.1          # Gateway ping
```

## Default Gateway Problems

### Gateway Configuration Issues
- **Missing Default Gateway**: No route to external networks
- **Wrong Gateway Address**: Incorrect default route configuration
- **Gateway Not Responding**: Default gateway device offline or unreachable
- **Multiple Gateways**: Conflicting default route entries

### Gateway Troubleshooting
```bash
# Check default gateway configuration
ip route | grep default

# Test gateway connectivity
ping -c 4 192.168.1.1

# Verify gateway MAC address
arp -n | grep 192.168.1.1

# Check gateway response time
ping -c 10 192.168.1.1 | grep avg
```

### Gateway Failover Issues
- **Redundant Gateway Protocols**: HSRP, VRRP, GLBP configuration issues
- **Priority Settings**: Incorrect priority values affecting master selection
- **Preemption Problems**: Backup gateways not taking over properly
- **Virtual IP Conflicts**: Duplicate virtual IP addresses

## Routing Protocol Issues

### OSPF Problems
- **Area Misconfigurations**: Devices in wrong OSPF areas
- **Authentication Failures**: Mismatched authentication keys
- **LSA Flooding**: Link State Advertisement propagation issues
- **DR/BDR Election**: Designated Router election problems

### OSPF Troubleshooting
```bash
# Check OSPF neighbors
show ip ospf neighbor

# Display OSPF database
show ip ospf database

# Verify OSPF interfaces
show ip ospf interface

# Check OSPF area configuration
show ip ospf
```

### EIGRP Issues
- **AS Number Mismatches**: Different Autonomous System numbers
- **K-Value Mismatches**: Different metric calculation parameters
- **Stuck in Active (SIA)**: Routes stuck in active state
- **Split Horizon Issues**: Route advertisement problems

### BGP Problems
- **Peering Issues**: BGP neighbor establishment failures
- **AS Path Problems**: Incorrect autonomous system path information
- **Route Advertisement**: Routes not being advertised or received
- **Policy Misconfigurations**: Incorrect route filtering or manipulation

## Address Resolution Issues

### ARP Problems
- **ARP Cache Corruption**: Incorrect MAC address mappings
- **ARP Timeouts**: Entries expiring too quickly
- **Gratuitous ARP Issues**: Duplicate IP detection problems
- **ARP Spoofing**: Security attacks affecting address resolution

### ARP Troubleshooting
```bash
# Display ARP cache
arp -a                    # All entries
arp -n                    # Numeric addresses only

# Clear ARP cache
sudo arp -d 192.168.1.100 # Delete specific entry
sudo ip -s -s neigh flush all # Clear all (Linux)

# Monitor ARP activity
tcpdump -i eth0 arp

# Check for ARP conflicts
arping 192.168.1.100
```

### IPv6 Neighbor Discovery Issues
- **Neighbor Advertisement Problems**: ICMPv6 NA message issues
- **Router Advertisement Failures**: RA messages not received
- **Duplicate Address Detection**: DAD process failures
- **Neighbor Cache Problems**: Incorrect neighbor cache entries

## MTU and Fragmentation Issues

### Maximum Transmission Unit Problems
- **MTU Mismatches**: Different MTU sizes on network path
- **Path MTU Discovery**: PMTU discovery failures
- **Fragmentation Issues**: Packets being fragmented unnecessarily
- **DF Bit Problems**: Don't Fragment bit causing packet drops

### MTU Troubleshooting
```bash
# Test maximum packet size
ping -s 1472 -M do 8.8.8.8  # Linux (1472 + 28 = 1500)
ping -f -l 1472 8.8.8.8     # Windows

# Check interface MTU
ip link show eth0 | grep mtu

# Set interface MTU
sudo ip link set dev eth0 mtu 1500

# Path MTU discovery
tracepath 8.8.8.8
```

## Network Layer Troubleshooting Tools

### Ping Utilities
- **Basic Connectivity**: Simple reachability testing
- **Packet Size Testing**: MTU and fragmentation testing
- **Flood Ping**: High-volume testing for performance
- **Record Route**: IP option to record packet path

### Traceroute Analysis
- **Path Discovery**: Identify routing path to destination
- **Hop-by-Hop Analysis**: Examine each router in path
- **Latency Measurement**: Measure delay at each hop
- **Route Changes**: Detect routing instability

### Advanced Tools
- **Looking Glass**: Web-based route testing from remote locations
- **Route Servers**: Test routing from different perspectives
- **Network Scanners**: Discover devices and routing information
- **Performance Monitors**: Continuous monitoring of routing metrics

## Troubleshooting Methodology

### Systematic Approach
1. **Verify Physical/Data Link**: Ensure lower layers are functional
2. **Check IP Configuration**: Verify addresses, masks, and gateways
3. **Test Local Connectivity**: Ping devices on same subnet
4. **Test Gateway**: Verify default gateway accessibility
5. **Test Remote Connectivity**: Check paths to remote networks
6. **Analyze Routing**: Examine routing tables and protocols

### Common Commands Sequence
```bash
# Step 1: Check local configuration
ip addr show
ip route show

# Step 2: Test local connectivity
ping -c 4 192.168.1.1

# Step 3: Test external connectivity
ping -c 4 8.8.8.8

# Step 4: Trace routing path
traceroute 8.8.8.8

# Step 5: Check DNS resolution
nslookup google.com
```

### Documentation and Prevention
- **Network Diagrams**: Maintain current topology documentation
- **IP Address Management**: Use IPAM tools for address tracking
- **Change Control**: Document routing changes and rollback procedures
- **Monitoring**: Implement continuous monitoring of routing metrics