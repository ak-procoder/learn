---
id: troubleshoot-11
title: Protocol Analyzers and Packet Capture
type: text
---

## Introduction to Packet Analysis

Packet analysis is the process of capturing, decoding, and analyzing network traffic to understand communication patterns, identify problems, and troubleshoot network issues. Protocol analyzers (packet sniffers) are essential tools for deep network troubleshooting.

### Why Packet Analysis Matters
- **Root Cause Analysis**: Identify exact cause of network problems
- **Performance Optimization**: Analyze traffic patterns and bottlenecks
- **Security Investigation**: Detect malicious activities and intrusions
- **Protocol Compliance**: Verify proper protocol implementation
- **Capacity Planning**: Understand bandwidth usage patterns

### Types of Packet Capture
- **Promiscuous Mode**: Capture all packets on network segment
- **Port Mirroring**: Copy traffic from specific switch ports
- **TAP (Test Access Point)**: Hardware device for traffic copying
- **Remote Capture**: Capture traffic from remote locations

## Wireshark - The Premier Protocol Analyzer

### Wireshark Overview
Wireshark is the world's most popular network protocol analyzer, providing comprehensive packet capture and analysis capabilities.

#### Key Features
- **Protocol Support**: Hundreds of protocol dissectors
- **Real-time Capture**: Live packet capture and analysis
- **Offline Analysis**: Analyze previously captured files
- **Filter Capabilities**: Powerful display and capture filters
- **Statistics**: Comprehensive traffic statistics and graphs

### Getting Started with Wireshark
```bash
# Install Wireshark (Ubuntu/Debian)
sudo apt update
sudo apt install wireshark

# Add user to wireshark group (for non-root capture)
sudo usermod -a -G wireshark $USER

# Start Wireshark
wireshark

# Command-line capture with tshark
tshark -i eth0 -w capture.pcap

# Display capture file
tshark -r capture.pcap

# Apply display filter
tshark -r capture.pcap -Y "http"
```

### Wireshark Interface Components
- **Packet List Pane**: Summary of captured packets
- **Packet Details Pane**: Detailed protocol breakdown
- **Packet Bytes Pane**: Raw packet data in hex and ASCII
- **Filter Toolbar**: Apply display filters
- **Status Bar**: Capture statistics and information

## Capture Filters

### Capture Filter Syntax
Capture filters determine which packets are captured during the capture process.

```bash
# Capture specific host traffic
host 192.168.1.100

# Capture traffic to/from specific network
net 192.168.1.0/24

# Capture specific protocol
tcp
udp
icmp

# Capture specific port
port 80
port 443

# Capture specific direction
src host 192.168.1.100
dst host 192.168.1.100

# Combine filters with logical operators
host 192.168.1.100 and port 80
tcp and port 80 or port 443
not broadcast and not multicast
```

### Advanced Capture Filters
```bash
# Capture HTTP traffic
tcp port 80 or tcp port 8080

# Capture DNS queries
udp port 53

# Capture SMTP traffic
tcp port 25

# Capture only TCP SYN packets
tcp[tcpflags] & tcp-syn != 0

# Capture packets larger than 1000 bytes
greater 1000

# Capture packets with specific TCP flags
tcp[13] = 2  # SYN packets
tcp[13] = 18 # SYN-ACK packets
tcp[13] = 4  # RST packets
```

## Display Filters

### Display Filter Syntax
Display filters determine which captured packets are shown in the packet list.

```bash
# Basic protocol filters
http
dns
tcp
udp
icmp

# IP address filters
ip.addr == 192.168.1.100
ip.src == 192.168.1.100
ip.dst == 192.168.1.100

# Port filters
tcp.port == 80
tcp.srcport == 80
tcp.dstport == 80

# Protocol-specific filters
http.request.method == "GET"
http.response.code == 404
dns.qry.name contains "google"
tcp.flags.syn == 1
tcp.flags.rst == 1
```

### Complex Display Filters
```bash
# HTTP errors
http.response.code >= 400

# Large packets
frame.len > 1500

# Retransmissions
tcp.analysis.retransmission

# Time-based filters
frame.time >= "2023-01-01 00:00:00"

# Multiple conditions
tcp.port == 80 and ip.addr == 192.168.1.100

# Regular expressions
http.host matches ".*google.*"

# Protocol hierarchy
tcp contains "password"
```

## Command-Line Packet Capture

### tcpdump - Unix Packet Capture
tcpdump is the command-line packet analyzer for Unix-like systems.

```bash
# Basic tcpdump usage
sudo tcpdump -i eth0

# Write to file
sudo tcpdump -i eth0 -w capture.pcap

# Read from file
tcpdump -r capture.pcap

# Capture specific host
sudo tcpdump -i eth0 host 192.168.1.100

# Capture specific port
sudo tcpdump -i eth0 port 80

# Capture with verbose output
sudo tcpdump -i eth0 -v

# Capture with timestamps
sudo tcpdump -i eth0 -tttt

# Capture specific number of packets
sudo tcpdump -i eth0 -c 100

# Capture with ASCII output
sudo tcpdump -i eth0 -A

# Capture with hex and ASCII output
sudo tcpdump -i eth0 -X
```

### Advanced tcpdump Examples
```bash
# Capture HTTP requests
sudo tcpdump -i eth0 -A -s 0 'tcp port 80 and (((ip[2:2] - ((ip[0]&0xf)<<2)) - ((tcp[12]&0xf0)>>2)) != 0)'

# Capture DNS queries
sudo tcpdump -i eth0 'udp port 53'

# Capture ICMP packets
sudo tcpdump -i eth0 'icmp'

# Capture packets from specific MAC address
sudo tcpdump -i eth0 'ether src 00:11:22:33:44:55'

# Capture packets larger than 500 bytes
sudo tcpdump -i eth0 'greater 500'

# Capture packets with specific TCP flags
sudo tcpdump -i eth0 'tcp[tcpflags] & (tcp-syn|tcp-fin) != 0'
```

### tshark - Wireshark Command Line
```bash
# Basic capture
tshark -i eth0

# Capture with filters
tshark -i eth0 -f "host 192.168.1.100"

# Display filter
tshark -r capture.pcap -Y "http"

# Output specific fields
tshark -r capture.pcap -T fields -e ip.src -e ip.dst -e tcp.port

# Statistics
tshark -r capture.pcap -q -z conv,ip
tshark -r capture.pcap -q -z proto,colinfo

# Export objects
tshark -r capture.pcap --export-objects http,/tmp/http_objects
```

## Analyzing Common Protocols

### HTTP Analysis
```bash
# HTTP request methods
http.request.method == "GET"
http.request.method == "POST"

# HTTP status codes
http.response.code == 200
http.response.code >= 400

# HTTP headers
http.request.uri contains "/admin"
http.user_agent contains "Chrome"
http.host == "example.com"

# HTTP payload
http contains "password"
```

### TCP Analysis
```bash
# TCP connection establishment
tcp.flags.syn == 1 and tcp.flags.ack == 0  # SYN
tcp.flags.syn == 1 and tcp.flags.ack == 1  # SYN-ACK
tcp.flags.syn == 0 and tcp.flags.ack == 1  # ACK

# TCP connection termination
tcp.flags.fin == 1
tcp.flags.rst == 1

# TCP issues
tcp.analysis.retransmission
tcp.analysis.duplicate_ack
tcp.analysis.zero_window
tcp.analysis.out_of_order
```

### DNS Analysis
```bash
# DNS queries
dns.flags.response == 0

# DNS responses
dns.flags.response == 1

# DNS query types
dns.qry.type == 1   # A record
dns.qry.type == 28  # AAAA record
dns.qry.type == 15  # MX record

# DNS response codes
dns.flags.rcode == 0  # No error
dns.flags.rcode == 3  # Name error (NXDOMAIN)

# Specific domains
dns.qry.name contains "google"
```

## Network Performance Analysis

### Throughput Analysis
```bash
# I/O Graph in Wireshark
Statistics → I/O Graph
# Configure Y Axis: Bytes/Tick
# Configure X Axis: Time intervals

# Protocol hierarchy
Statistics → Protocol Hierarchy

# Conversations
Statistics → Conversations → IPv4/TCP/UDP

# Endpoints
Statistics → Endpoints → IPv4/TCP/UDP
```

### Latency Analysis
```bash
# Round-trip time analysis
tcp.analysis.ack_rtt

# Expert information
Analyze → Expert Information

# Flow graphs
Statistics → Flow Graph

# TCP stream analysis
Follow → TCP Stream
```

### Identifying Performance Issues
- **High Retransmissions**: Network congestion or errors
- **Zero Windows**: Receiver buffer exhaustion
- **Large Round-Trip Times**: Network latency issues
- **Fragmentation**: MTU size problems
- **Duplicate ACKs**: Packet loss indication

## Packet Capture Best Practices

### Capture Planning
- **Define Objectives**: Know what you're looking for
- **Choose Capture Points**: Strategic placement for relevant traffic
- **Filter Appropriately**: Reduce capture size with filters
- **Time Boundaries**: Capture during problem periods

### Capture Optimization
```bash
# Ring buffer capture (continuous capture with size limit)
tcpdump -i eth0 -C 100 -W 10 -w capture.pcap

# Capture specific time period
tcpdump -i eth0 -G 3600 -w capture_%Y%m%d_%H%M%S.pcap

# Capture with snaplen (capture only headers)
tcpdump -i eth0 -s 96 -w headers.pcap
```

### Security and Legal Considerations
- **Privacy Protection**: Avoid capturing sensitive data unnecessarily
- **Legal Compliance**: Ensure packet capture complies with local laws
- **Data Encryption**: Protect captured data with encryption
- **Access Control**: Limit access to packet capture files

### Storage and Management
- **File Rotation**: Implement automatic file rotation
- **Compression**: Compress older capture files
- **Retention Policy**: Define how long to keep captures
- **Indexing**: Maintain index of capture files for quick access

## Remote Packet Capture

### SSH Tunneling for Remote Capture
```bash
# Capture on remote host via SSH
ssh user@remote_host 'tcpdump -i eth0 -w -' > local_capture.pcap

# Real-time analysis of remote capture
ssh user@remote_host 'tcpdump -i eth0 -w -' | wireshark -k -i -
```

### Network Monitoring Probes
- **Distributed Capture**: Deploy capture probes across network
- **Centralized Analysis**: Aggregate captures for analysis
- **Remote Management**: Configure probes remotely
- **Automated Reporting**: Generate automated analysis reports

## Troubleshooting with Packet Analysis

### Problem Identification Workflow
1. **Reproduce the Problem**: Capture during problem occurrence
2. **Apply Filters**: Focus on relevant traffic
3. **Analyze Patterns**: Look for anomalies and errors
4. **Correlate Events**: Match symptoms with packet evidence
5. **Document Findings**: Record analysis results

### Common Network Issues and Packet Signatures
- **DNS Problems**: Failed queries, timeouts, wrong responses
- **Connection Issues**: Failed TCP handshakes, resets
- **Performance Problems**: Retransmissions, window issues
- **Security Issues**: Unusual traffic patterns, suspicious protocols

### Reporting and Documentation
- **Screenshot Evidence**: Capture relevant packet analysis screens
- **Filter Documentation**: Record display filters used
- **Statistical Summary**: Provide traffic statistics
- **Recommendations**: Suggest solutions based on analysis