---
id: troubleshoot-9
title: Command Line Tools and Utilities
type: text
---

## Essential Network Troubleshooting Tools

Command-line tools are fundamental for network troubleshooting, providing direct access to network functions and detailed diagnostic information. These tools are available across different operating systems and form the backbone of network diagnostics.

### Core Diagnostic Tools
- **ping**: Test basic connectivity and measure latency
- **traceroute/tracert**: Trace packet paths through networks
- **netstat**: Display network connections and statistics
- **nslookup/dig**: DNS troubleshooting and queries
- **arp**: View and manipulate ARP cache
- **route**: Display and modify routing tables

## Connectivity Testing Tools

### Ping Command
Ping sends ICMP Echo Request packets to test basic connectivity and measure round-trip time.

#### Basic Ping Usage
```bash
# Basic connectivity test
ping google.com
ping 8.8.8.8

# Linux/Mac specific options
ping -c 4 google.com          # Send 4 packets
ping -i 0.5 google.com        # 0.5 second interval
ping -s 1000 google.com       # 1000 byte packets
ping -W 2 google.com          # 2 second timeout

# Windows specific options
ping -n 4 google.com          # Send 4 packets
ping -l 1000 google.com       # 1000 byte packets
ping -w 2000 google.com       # 2 second timeout
```

#### Advanced Ping Techniques
```bash
# Continuous ping with timestamp
ping google.com | while read pong; do echo "$(date): $pong"; done

# Flood ping for stress testing (Linux, requires root)
sudo ping -f google.com

# Ping with record route option
ping -R google.com

# Test specific interface (Linux)
ping -I eth0 google.com

# IPv6 ping
ping6 ipv6.google.com
```

### Traceroute/Tracert
Traceroute shows the path packets take through networks and identifies where delays or failures occur.

#### Traceroute Usage
```bash
# Basic traceroute (Linux/Mac)
traceroute google.com
traceroute -n google.com      # Numeric output (no DNS resolution)
traceroute -m 15 google.com   # Maximum 15 hops

# Windows tracert
tracert google.com
tracert -d google.com         # Don't resolve hostnames
tracert -h 15 google.com      # Maximum 15 hops

# UDP traceroute (Linux)
traceroute -U google.com

# ICMP traceroute (Linux)
traceroute -I google.com

# TCP traceroute (Linux)
traceroute -T -p 80 google.com
```

#### Interpreting Traceroute Output
```
 1  192.168.1.1 (192.168.1.1)  1.234 ms  1.123 ms  1.098 ms
 2  10.0.0.1 (10.0.0.1)  15.456 ms  14.789 ms  15.123 ms
 3  * * *
 4  8.8.8.8 (8.8.8.8)  25.678 ms  24.567 ms  25.123 ms
```
- Line 1: Local gateway, normal response times
- Line 2: ISP router, expected increase in latency
- Line 3: Asterisks indicate timeout or blocked ICMP
- Line 4: Destination reached successfully

## Network Connection Analysis

### Netstat Command
Netstat displays network connections, routing tables, and network statistics.

#### Connection Monitoring
```bash
# Display all connections
netstat -a

# Show listening ports only
netstat -l          # Linux
netstat -an | grep LISTEN    # All platforms

# Display with process information
netstat -p          # Linux
netstat -b          # Windows (requires admin)

# Show specific protocol
netstat -t          # TCP connections only
netstat -u          # UDP connections only

# Continuous monitoring
netstat -c 1        # Update every second (Linux)
```

#### Network Statistics
```bash
# Display protocol statistics
netstat -s          # All protocols
netstat -st         # TCP statistics only
netstat -su         # UDP statistics only

# Show routing table
netstat -r          # Routing table
netstat -rn         # Numeric routing table

# Interface statistics
netstat -i          # Interface statistics
```

### SS Command (Modern Linux Alternative)
SS is the modern replacement for netstat with more features and better performance.

```bash
# Basic usage
ss -a               # All connections
ss -l               # Listening ports
ss -t               # TCP connections
ss -u               # UDP connections

# Advanced options
ss -tulpn           # TCP/UDP listening ports with process info
ss -o state established    # Show established connections with options
ss -i               # Show internal TCP information
ss -s               # Show summary statistics

# Filter by state
ss -o state syn-sent
ss -o state time-wait
ss -o state close-wait

# Filter by port
ss dst :80          # Connections to port 80
ss src :22          # Connections from port 22
```

## DNS Troubleshooting Tools

### Nslookup Command
Interactive DNS lookup tool for testing DNS resolution.

```bash
# Basic DNS lookup
nslookup google.com

# Specify DNS server
nslookup google.com 8.8.8.8

# Interactive mode
nslookup
> set type=MX
> google.com
> set type=NS
> google.com
> exit

# Reverse DNS lookup
nslookup 8.8.8.8

# Check specific record types
nslookup -type=A google.com
nslookup -type=AAAA google.com
nslookup -type=MX google.com
nslookup -type=NS google.com
nslookup -type=TXT google.com
```

### Dig Command (Linux/Mac)
More powerful and flexible DNS lookup tool.

```bash
# Basic lookup
dig google.com

# Query specific record types
dig google.com A
dig google.com AAAA
dig google.com MX
dig google.com NS
dig google.com TXT

# Use specific DNS server
dig @8.8.8.8 google.com

# Reverse DNS lookup
dig -x 8.8.8.8

# Trace DNS resolution path
dig +trace google.com

# Short output format
dig +short google.com A

# Query all record types
dig google.com ANY
```

## Network Interface Management

### IP Command (Linux)
Modern tool for network interface configuration and monitoring.

```bash
# Display interfaces
ip addr show
ip link show

# Show specific interface
ip addr show eth0

# Display routing table
ip route show
ip route get 8.8.8.8

# Show ARP table
ip neigh show

# Monitor changes
ip monitor addr
ip monitor route

# Interface statistics
ip -s link show eth0
```

### Ifconfig Command (Legacy)
Traditional interface configuration tool.

```bash
# Display all interfaces
ifconfig

# Show specific interface
ifconfig eth0

# Interface statistics
ifconfig eth0 | grep -E "(RX|TX)"

# Enable/disable interface (requires root)
sudo ifconfig eth0 up
sudo ifconfig eth0 down
```

## ARP and MAC Address Tools

### ARP Command
Manage and display ARP cache entries.

```bash
# Display ARP cache
arp -a
arp -n              # Numeric addresses only

# Add static ARP entry (requires root)
sudo arp -s 192.168.1.100 00:11:22:33:44:55

# Delete ARP entry (requires root)
sudo arp -d 192.168.1.100

# Clear entire ARP cache (Linux)
sudo ip -s -s neigh flush all
```

### MAC Address Investigation
```bash
# Find interface MAC address
ip link show eth0 | grep ether
ifconfig eth0 | grep ether

# Change MAC address (requires root)
sudo ip link set dev eth0 down
sudo ip link set dev eth0 address 00:11:22:33:44:55
sudo ip link set dev eth0 up

# Wake-on-LAN
wakeonlan 00:11:22:33:44:55
```

## Port and Service Testing

### Telnet for Port Testing
```bash
# Test TCP port connectivity
telnet google.com 80
telnet 192.168.1.1 22

# Test SMTP
telnet mail.example.com 25

# Test HTTP manually
telnet google.com 80
GET / HTTP/1.1
Host: google.com

```

### Netcat (nc) - Swiss Army Knife
```bash
# Port scanning
nc -zv google.com 80-443
nc -zvu google.com 53        # UDP port scan

# Banner grabbing
nc google.com 80

# Listen on port
nc -l 1234                   # Listen on port 1234

# File transfer
# Receiver:
nc -l 1234 > received_file
# Sender:
nc target_ip 1234 < file_to_send

# Chat/messaging
# Server:
nc -l 1234
# Client:
nc server_ip 1234
```

### Curl for HTTP Testing
```bash
# Basic HTTP test
curl http://google.com
curl -I http://google.com    # Headers only

# HTTPS testing
curl https://google.com
curl -k https://self-signed.example.com  # Ignore cert errors

# Timing information
curl -w "@curl-format.txt" http://google.com

# Follow redirects
curl -L http://google.com

# POST data
curl -X POST -d "param1=value1" http://example.com/api
```

## System Resource Monitoring

### Process and Resource Tools
```bash
# Monitor processes
top
htop                         # Enhanced version
ps aux | grep process_name

# Memory usage
free -h
cat /proc/meminfo

# Disk usage
df -h
du -sh /var/log

# Network interface statistics
cat /proc/net/dev
watch -n 1 cat /proc/net/dev

# System load
uptime
w
```

## Scripting and Automation

### Basic Troubleshooting Scripts
```bash
#!/bin/bash
# Network connectivity check script

echo "=== Network Connectivity Check ==="
echo "Date: $(date)"
echo

# Check interface status
echo "Interface Status:"
ip addr show | grep -E "(inet|state)"
echo

# Check default gateway
echo "Default Gateway:"
ip route | grep default
echo

# Test DNS resolution
echo "DNS Test:"
nslookup google.com
echo

# Test external connectivity
echo "External Connectivity:"
ping -c 3 8.8.8.8
echo

# Test HTTP connectivity
echo "HTTP Test:"
curl -I http://google.com
```

### Performance Monitoring Script
```bash
#!/bin/bash
# Simple network performance monitor

while true; do
    echo "$(date): $(ping -c 1 8.8.8.8 | grep 'time=' | cut -d'=' -f4)"
    sleep 1
done
```

## Best Practices

### Tool Selection Strategy
- **Start Simple**: Use basic tools like ping before advanced analysis
- **Layer by Layer**: Progress through OSI layers systematically
- **Document Results**: Keep records of commands and outputs
- **Automate Repetitive Tasks**: Create scripts for common procedures

### Safety Considerations
- **Read-Only First**: Use monitoring tools before making changes
- **Test Environment**: Practice on non-production systems
- **Backup Configurations**: Save current settings before changes
- **Change Windows**: Perform testing during maintenance windows