---
id: troubleshooting-14
title: Advanced Packet Analysis
type: text
---

## Deep Packet Inspection Fundamentals

Packet analysis provides detailed insight into network behavior and is essential for complex troubleshooting scenarios.

## Wireshark Advanced Features

### Capture Filters vs. Display Filters

**Capture Filters (BPF Syntax):**
```bash
host 192.168.1.1           # Specific host traffic
tcp port 80                # HTTP traffic only
not broadcast              # Exclude broadcast traffic
src net 10.0.0.0/8        # Source network filter
```

**Display Filters:**
```bash
ip.addr == 192.168.1.1     # IP address filter
tcp.flags.syn == 1         # TCP SYN packets
http.response.code == 404   # HTTP 404 errors
dns.qry.name contains "google"  # DNS queries
```

### Protocol Analysis Techniques

**TCP Stream Analysis:**
- **Follow TCP Stream**: Complete conversation view
- **Sequence analysis**: Packet ordering and retransmissions
- **Window scaling**: Flow control analysis
- **Connection establishment**: Three-way handshake analysis

**HTTP Transaction Analysis:**
- **Request/Response pairs**: Complete HTTP transactions
- **Header analysis**: HTTP headers and values
- **Performance metrics**: Time-to-first-byte analysis
- **Content analysis**: HTTP payload inspection

### Statistical Analysis

**Wireshark Statistics:**
- **Protocol hierarchy**: Traffic breakdown by protocol
- **Conversations**: Top talkers and listeners
- **Endpoints**: Individual host statistics
- **I/O graphs**: Time-based traffic analysis

## Advanced Troubleshooting Scenarios

### Application Performance Analysis

**Symptoms Requiring Packet Analysis:**
- Slow application response times
- Intermittent application failures
- Protocol-specific errors
- Security-related issues

**Analysis Methodology:**
1. **Identify application flows**: Filter relevant traffic
2. **Analyze timing**: Request/response delays
3. **Check for errors**: Protocol violations or failures
4. **Correlate with symptoms**: Match packet data to user reports

### Network Security Analysis

**Security Event Investigation:**
```bash
# Wireshark filters for security analysis
tcp.flags.reset == 1       # Connection resets
icmp.type == 3            # Destination unreachable
dns.flags.rcode == 3      # DNS NXDOMAIN responses
```

**Malware Traffic Analysis:**
- **Unusual protocols**: Non-standard protocol usage
- **Suspicious destinations**: Connections to known bad IPs
- **Data exfiltration**: Large outbound transfers
- **Command and control**: Periodic communication patterns

### Performance Troubleshooting

**Latency Analysis:**
- **Network latency**: Round-trip time measurement
- **Application latency**: Processing time analysis
- **Queuing delays**: Buffer and processing delays
- **Serialization delays**: Data transmission time

**Throughput Analysis:**
- **Bandwidth utilization**: Actual vs. available bandwidth
- **TCP window scaling**: Flow control effectiveness
- **Fragmentation**: Packet size optimization
- **Retransmission analysis**: Error recovery impact

## Packet Capture Best Practices

### Capture Strategy

**Capture Location Selection:**
- **Client-side capture**: End-user perspective
- **Server-side capture**: Application server view
- **Network tap**: Non-intrusive monitoring
- **Switch port mirroring**: Centralized capture point

**Capture Duration and Size:**
- **Ring buffer**: Continuous capture with size limits
- **Time-based capture**: Fixed duration captures
- **Event-triggered capture**: Start on specific conditions
- **Storage considerations**: Disk space and performance

### Capture Optimization

**Hardware Considerations:**
- **Network interface**: Gigabit or higher recommended
- **CPU performance**: Real-time packet processing
- **Memory capacity**: Packet buffer requirements
- **Storage speed**: High-speed disk for large captures

**Software Configuration:**
```bash
# tcpdump capture examples
tcpdump -i eth0 -w capture.pcap  # Basic capture
tcpdump -i eth0 -C 100 -W 10 -w rotating.pcap  # Rotating files
tcpdump -i eth0 -s 1500 host 10.1.1.1  # Snaplen and filter
```

## Specialized Analysis Tools

### Command-Line Tools

**tcpdump Advanced Usage:**
```bash
tcpdump -nn -i eth0 'tcp[tcpflags] & tcp-syn != 0'  # SYN packets
tcpdump -X -s 0 host 192.168.1.1  # Hex dump output
tcpdump -A port 80  # ASCII output for HTTP
```

**tshark (Wireshark CLI):**
```bash
tshark -f "tcp port 80" -T fields -e ip.src -e ip.dst
tshark -r capture.pcap -Y "http.response.code == 200"
tshark -i eth0 -q -z conv,tcp  # TCP conversation statistics
```

### Network Flow Analysis

**nfcapd and nfdump:**
```bash
nfcapd -l /var/netflow -p 9995  # NetFlow collector
nfdump -r file -s srcip/bytes   # Top source IPs by bytes
nfdump -r file -c 100 'proto tcp and port 80'  # HTTP flows
```

**Flow-based Troubleshooting:**
- **Traffic patterns**: Flow duration and volume analysis
- **Application identification**: Protocol and port analysis
- **Anomaly detection**: Unusual flow characteristics
- **Capacity planning**: Long-term traffic trends

## Automated Analysis Tools

### Scripted Analysis

**Python with Scapy:**
```python
from scapy.all import *
packets = rdpcap("capture.pcap")
for pkt in packets:
    if TCP in pkt and pkt[TCP].flags == 2:  # SYN packets
        print(f"SYN from {pkt[IP].src} to {pkt[IP].dst}")
```

**PowerShell Network Analysis:**
```powershell
Get-NetTCPConnection | Where-Object {$_.State -eq "Established"}
Test-NetConnection -ComputerName server -Port 80 -InformationLevel Detailed
```

### Machine Learning Integration

**Anomaly Detection:**
- **Baseline establishment**: Normal traffic patterns
- **Deviation detection**: Unusual network behavior
- **Automated alerting**: ML-driven notifications
- **Pattern recognition**: Complex attack identification