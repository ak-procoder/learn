---
id: troubleshooting-12
title: Performance and Bandwidth Troubleshooting
type: text
---

## Network Performance Overview

Network performance issues affect user experience and business operations. Identifying and resolving performance problems requires systematic analysis of network capacity, utilization, and bottlenecks.

## Common Performance Issues

### Bandwidth-Related Problems

**Insufficient Bandwidth:**
- **Link saturation**: Utilization exceeding capacity
- **Burst traffic**: Temporary spikes in demand
- **Asymmetric bandwidth**: Unbalanced upload/download
- **Shared bandwidth**: Contention among users
- **Wrong speed negotiation**: Auto-negotiation failures

**Bandwidth Measurement:**
```bash
iperf3 -c server -t 30      # TCP throughput test
iperf3 -c server -u -b 100M # UDP bandwidth test
speedtest-cli               # Internet speed test
```

### Latency and Delay Issues

**Types of Network Delay:**
- **Propagation delay**: Signal travel time
- **Transmission delay**: Time to push bits onto wire
- **Processing delay**: Device processing time
- **Queuing delay**: Buffer and queue waiting time

**Latency Testing:**
```bash
ping -c 100 destination     # RTT measurement
mtr destination             # Real-time path analysis
traceroute destination      # Hop-by-hop latency
```

**Latency Expectations:**
- **LAN**: < 1ms typical
- **WAN**: 5-100ms depending on distance
- **Internet**: 20-200ms typical
- **Satellite**: 500-700ms

### Quality of Service (QoS) Issues

**QoS Configuration Problems:**
- **Missing policies**: No traffic prioritization
- **Incorrect classification**: Wrong traffic marking
- **Inadequate bandwidth allocation**: Insufficient guarantees
- **Policy conflicts**: Contradictory QoS rules

**Traffic Prioritization:**
- **Voice traffic**: Highest priority, low latency
- **Video traffic**: High priority, consistent bandwidth
- **Business applications**: Medium priority
- **Bulk data**: Lower priority, best effort

## Performance Monitoring Tools

### Bandwidth Monitoring

**SNMP-Based Monitoring:**
```bash
snmpwalk -v2c -c public device ifInOctets    # Input bytes
snmpwalk -v2c -c public device ifOutOctets   # Output bytes
snmpwalk -v2c -c public device ifSpeed       # Interface speed
```

**Network Monitoring Systems:**
- **MRTG**: Multi Router Traffic Grapher
- **Cacti**: Network graphing solution
- **Nagios**: Infrastructure monitoring
- **PRTG**: Comprehensive network monitoring

### Packet Analysis Tools

**Deep Packet Inspection:**
- **Wireshark**: Protocol analysis and troubleshooting
- **tcpdump**: Command-line packet capture
- **ntopng**: Real-time traffic analysis
- **SolarWinds**: Commercial network analysis

**Key Performance Metrics:**
- **Throughput**: Actual data transfer rate
- **Utilization**: Percentage of capacity used
- **Packet loss**: Percentage of lost packets
- **Jitter**: Variation in packet delay

### Flow-Based Monitoring

**NetFlow/sFlow Analysis:**
```bash
nfcapd -l /var/netflow      # NetFlow collector
nfdump -r file              # NetFlow analysis
```

**Flow Information:**
- **Source/destination**: IP addresses and ports
- **Protocol**: TCP, UDP, ICMP
- **Bytes/packets**: Volume metrics
- **Duration**: Flow lifetime

## Troubleshooting Methodology

### Performance Baseline Establishment

**Baseline Metrics:**
- **Normal traffic patterns**: Daily/weekly cycles
- **Peak utilization periods**: Busy hour traffic
- **Application response times**: Service level baselines
- **Error rates**: Normal vs. abnormal error levels

**Baseline Tools:**
```bash
# Continuous monitoring commands
while true; do
  date >> performance.log
  ping -c 5 server >> performance.log
  sleep 300
done
```

### Bottleneck Identification

**Common Bottleneck Locations:**
- **WAN links**: Internet or site-to-site connections
- **Server connections**: Database or application servers
- **Wireless networks**: Shared medium limitations
- **Switch uplinks**: Aggregation point congestion

**Bottleneck Analysis Steps:**
1. Identify traffic flows and patterns
2. Measure utilization at each network segment
3. Correlate high utilization with performance issues
4. Determine if bottleneck is bandwidth or processing

### Capacity Planning

**Growth Analysis:**
- **Historical trends**: Traffic growth patterns
- **Future requirements**: Business growth projections
- **Technology changes**: New applications or services
- **Peak capacity**: Maximum expected demand

**Capacity Planning Tools:**
- **Trending analysis**: Historical data analysis
- **What-if scenarios**: Modeling future requirements
- **Cost analysis**: Upgrade vs. performance trade-offs

## Common Performance Scenarios

### Slow Application Response

**Symptoms:**
- Increased response times
- Application timeouts
- User complaints about speed

**Diagnosis Steps:**
1. Measure end-to-end response time
2. Break down response time components
3. Identify network vs. application delays
4. Analyze traffic patterns and volume
5. Check for network congestion

### Intermittent Performance Issues

**Symptoms:**
- Performance varies throughout day
- Sporadic slowdowns
- Inconsistent user experience

**Diagnosis Steps:**
1. Correlate performance with time patterns
2. Identify peak usage periods
3. Monitor burst traffic patterns
4. Check for scheduled processes
5. Analyze competing traffic flows

### Video/Voice Quality Issues

**VoIP Quality Problems:**
- **Jitter**: Inconsistent packet arrival
- **Packet loss**: Missing audio/video
- **Latency**: Delayed conversations
- **Echo**: Audio feedback

**Quality Metrics:**
- **MOS (Mean Opinion Score)**: Voice quality rating
- **R-Factor**: Voice quality calculation
- **Packet loss**: < 1% for good quality
- **Jitter**: < 30ms for acceptable quality

### Bandwidth Exhaustion

**Symptoms:**
- Link utilization > 80%
- Increased packet loss
- Higher latency
- Application timeouts

**Resolution Options:**
1. **Upgrade bandwidth**: Increase link capacity
2. **Traffic shaping**: Limit bandwidth usage
3. **Compression**: Reduce data volume
4. **Caching**: Local content storage
5. **Load balancing**: Distribute traffic

## Advanced Performance Topics

### TCP Performance Optimization

**TCP Window Scaling:**
- **Bandwidth-delay product**: Optimal window size
- **Window size tuning**: Operating system optimization
- **Congestion control**: TCP algorithm selection

**TCP Optimization:**
```bash
# Linux TCP tuning examples
echo 'net.core.rmem_max = 134217728' >> /etc/sysctl.conf
echo 'net.core.wmem_max = 134217728' >> /etc/sysctl.conf
echo 'net.ipv4.tcp_window_scaling = 1' >> /etc/sysctl.conf
```

### Application Layer Optimization

**HTTP Performance:**
- **Keep-alive connections**: Reduce connection overhead
- **Compression**: Gzip content encoding
- **Caching**: Browser and proxy caching
- **Content delivery networks**: Geographic distribution