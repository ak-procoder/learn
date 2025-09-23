---
id: troubleshoot-12
title: Performance Analysis and Optimization
type: text
---

## Network Performance Overview

Network performance analysis involves measuring, monitoring, and optimizing various network metrics to ensure optimal user experience and efficient resource utilization. Understanding performance characteristics is crucial for maintaining healthy network operations.

### Key Performance Metrics
- **Bandwidth**: Maximum data transfer rate capability
- **Throughput**: Actual data transfer rate achieved
- **Latency**: Time delay for packet transmission
- **Jitter**: Variation in packet arrival times
- **Packet Loss**: Percentage of packets lost during transmission
- **Availability**: Network uptime and reliability

### Performance Analysis Goals
- **Baseline Establishment**: Define normal operating parameters
- **Bottleneck Identification**: Find network constraints and limitations
- **Capacity Planning**: Predict future bandwidth requirements
- **QoS Optimization**: Ensure quality of service for critical applications
- **Cost Optimization**: Balance performance with infrastructure costs

## Bandwidth and Throughput Analysis

### Understanding Bandwidth vs Throughput
- **Bandwidth**: Theoretical maximum capacity of network link
- **Throughput**: Actual data transfer rate achieved in practice
- **Utilization**: Percentage of available bandwidth being used
- **Efficiency**: Ratio of useful data to total transmitted data

### Measuring Bandwidth and Throughput
```bash
# iperf3 - Network throughput testing
# Server side
iperf3 -s

# Client side
iperf3 -c server_ip
iperf3 -c server_ip -t 60        # Run for 60 seconds
iperf3 -c server_ip -P 4         # 4 parallel streams
iperf3 -c server_ip -u           # UDP test
iperf3 -c server_ip -R           # Reverse direction

# Bandwidth monitoring with nload
nload eth0

# Interface statistics
cat /proc/net/dev
watch -n 1 cat /proc/net/dev

# SNMP bandwidth monitoring
snmpwalk -v2c -c public 192.168.1.1 1.3.6.1.2.1.2.2.1.10  # Input octets
snmpwalk -v2c -c public 192.168.1.1 1.3.6.1.2.1.2.2.1.16  # Output octets
```

### Bandwidth Utilization Analysis
```bash
# Calculate bandwidth utilization
#!/bin/bash
INTERFACE="eth0"
INTERVAL=1

# Get initial counters
RX_BYTES_1=$(cat /sys/class/net/$INTERFACE/statistics/rx_bytes)
TX_BYTES_1=$(cat /sys/class/net/$INTERFACE/statistics/tx_bytes)

sleep $INTERVAL

# Get counters after interval
RX_BYTES_2=$(cat /sys/class/net/$INTERFACE/statistics/rx_bytes)
TX_BYTES_2=$(cat /sys/class/net/$INTERFACE/statistics/tx_bytes)

# Calculate rates (bits per second)
RX_RATE=$(( (RX_BYTES_2 - RX_BYTES_1) * 8 / INTERVAL ))
TX_RATE=$(( (TX_BYTES_2 - TX_BYTES_1) * 8 / INTERVAL ))

echo "RX Rate: $(( RX_RATE / 1000000 )) Mbps"
echo "TX Rate: $(( TX_RATE / 1000000 )) Mbps"
```

## Latency and Delay Analysis

### Types of Network Delay
- **Propagation Delay**: Time for signal to travel through medium
- **Transmission Delay**: Time to push packet onto link
- **Processing Delay**: Time for routers to process packet headers
- **Queueing Delay**: Time packet waits in router queues

### Measuring Latency
```bash
# Basic ping testing
ping -c 10 google.com
ping -c 100 -i 0.1 google.com    # High frequency testing

# Round-trip time statistics
ping -c 100 google.com | tail -1

# Timestamp ping (Linux)
ping -D google.com

# IPv6 latency testing
ping6 ipv6.google.com

# Continuous latency monitoring
#!/bin/bash
while true; do
    LATENCY=$(ping -c 1 google.com | grep 'time=' | cut -d'=' -f4 | cut -d' ' -f1)
    echo "$(date): ${LATENCY}ms"
    sleep 1
done
```

### One-Way Delay Measurement
```bash
# Using hping3 for timestamp analysis
hping3 -S -p 80 -c 1 google.com

# NTP time synchronization for accurate measurements
ntpdate -q pool.ntp.org

# PTP (Precision Time Protocol) for high-precision timing
ptp4l -i eth0 -m

# Network Time Protocol synchronization
chrony sources -v
```

### Jitter Analysis
```bash
# Measure jitter with ping
ping -c 100 google.com | grep 'time=' | cut -d'=' -f4 | cut -d' ' -f1 > latency.txt

# Calculate jitter statistics
awk '{
    sum += $1; 
    sumsq += ($1)^2
} 
END { 
    mean = sum/NR; 
    stddev = sqrt(sumsq/NR - mean^2); 
    print "Mean:", mean "ms"; 
    print "Std Dev (Jitter):", stddev "ms"
}' latency.txt
```

## Packet Loss Analysis

### Detecting Packet Loss
```bash
# Ping packet loss testing
ping -c 1000 google.com | grep 'packet loss'

# Extended ping testing with statistics
ping -c 1000 -i 0.1 google.com

# UDP packet loss testing with iperf3
iperf3 -c server_ip -u -b 100M -t 60

# Pathological packet loss testing
mtr --report --report-cycles 100 google.com
```

### Packet Loss Analysis with mtr
```bash
# My TraceRoute - combines ping and traceroute
mtr google.com
mtr --report --report-cycles 100 google.com
mtr --report --report-cycles 100 --show-ips google.com

# Continuous monitoring
mtr --interval 1 google.com

# JSON output for scripting
mtr --json google.com
```

### Interface Error Analysis
```bash
# Check interface error counters
ip -s link show eth0
cat /proc/net/dev

# Detailed interface statistics
ethtool -S eth0

# Error rate calculation
#!/bin/bash
INTERFACE="eth0"

# Get error counters
RX_ERRORS=$(cat /sys/class/net/$INTERFACE/statistics/rx_errors)
RX_PACKETS=$(cat /sys/class/net/$INTERFACE/statistics/rx_packets)
TX_ERRORS=$(cat /sys/class/net/$INTERFACE/statistics/tx_errors)
TX_PACKETS=$(cat /sys/class/net/$INTERFACE/statistics/tx_packets)

# Calculate error rates
if [ $RX_PACKETS -gt 0 ]; then
    RX_ERROR_RATE=$(echo "scale=4; $RX_ERRORS / $RX_PACKETS * 100" | bc)
    echo "RX Error Rate: $RX_ERROR_RATE%"
fi

if [ $TX_PACKETS -gt 0 ]; then
    TX_ERROR_RATE=$(echo "scale=4; $TX_ERRORS / $TX_PACKETS * 100" | bc)
    echo "TX Error Rate: $TX_ERROR_RATE%"
fi
```

## Application Performance Monitoring

### Web Application Performance
```bash
# HTTP response time testing
curl -w "@curl-format.txt" -o /dev/null -s http://example.com

# Create curl-format.txt
cat > curl-format.txt << EOF
     time_namelookup:  %{time_namelookup}\n
        time_connect:  %{time_connect}\n
     time_appconnect:  %{time_appconnect}\n
    time_pretransfer:  %{time_pretransfer}\n
       time_redirect:  %{time_redirect}\n
  time_starttransfer:  %{time_starttransfer}\n
                     ----------\n
          time_total:  %{time_total}\n
EOF

# HTTP load testing with ab (Apache Bench)
ab -n 1000 -c 10 http://example.com/

# Advanced HTTP testing with wrk
wrk -t12 -c400 -d30s http://example.com/
```

### Database Performance Analysis
```bash
# MySQL performance monitoring
mysql -e "SHOW PROCESSLIST;"
mysql -e "SHOW ENGINE INNODB STATUS;"

# PostgreSQL performance monitoring
psql -c "SELECT * FROM pg_stat_activity;"
psql -c "SELECT * FROM pg_stat_database;"

# Connection monitoring
netstat -an | grep :3306 | wc -l    # MySQL connections
netstat -an | grep :5432 | wc -l    # PostgreSQL connections
```

### DNS Performance Analysis
```bash
# DNS query time measurement
dig @8.8.8.8 google.com | grep 'Query time'

# DNS performance comparison
for server in 8.8.8.8 1.1.1.1 208.67.222.222; do
    echo "Testing $server:"
    dig @$server google.com | grep 'Query time'
done

# DNS cache hit analysis
dig google.com
dig google.com  # Second query should be faster if cached
```

## Quality of Service (QoS) Analysis

### Traffic Classification and Marking
```bash
# Check DSCP markings in packets
tcpdump -v -i eth0 | grep "tos"

# Display traffic classes
tc qdisc show dev eth0
tc class show dev eth0

# Monitor QoS statistics
tc -s qdisc show dev eth0
tc -s class show dev eth0
```

### Voice and Video Quality Analysis
```bash
# VoIP quality metrics (R-factor, MOS)
# Typically requires specialized tools like:
# - SolarWinds VoIP & Network Quality Manager
# - PRTG Network Monitor
# - Wireshark with VoIP analysis plugins

# Real-time transport protocol analysis
tshark -Y rtp -T fields -e rtp.seq -e rtp.timestamp -e rtp.marker

# Jitter buffer analysis for VoIP
tshark -Y rtp -q -z rtp,streams
```

## Performance Optimization Strategies

### Network Optimization Techniques

#### Bandwidth Optimization
- **Traffic Shaping**: Control bandwidth allocation per application
- **Compression**: Reduce data transmission requirements
- **Caching**: Store frequently accessed content locally
- **Content Delivery Networks**: Distribute content geographically

#### Latency Optimization
- **Route Optimization**: Choose shortest network paths
- **Local Processing**: Reduce round trips to remote servers
- **Connection Pooling**: Reuse existing connections
- **Protocol Optimization**: Use efficient protocols (HTTP/2, QUIC)

#### Buffer Management
```bash
# TCP buffer tuning (Linux)
echo 'net.core.rmem_max = 16777216' >> /etc/sysctl.conf
echo 'net.core.wmem_max = 16777216' >> /etc/sysctl.conf
echo 'net.ipv4.tcp_rmem = 4096 32768 16777216' >> /etc/sysctl.conf
echo 'net.ipv4.tcp_wmem = 4096 32768 16777216' >> /etc/sysctl.conf

# Apply changes
sysctl -p

# Monitor buffer usage
ss -m
```

### Switch and Router Optimization
```bash
# Interface optimization (Cisco)
interface GigabitEthernet0/1
 speed 1000
 duplex full
 no auto-negotiation
 
# Queue management
interface GigabitEthernet0/1
 service-policy output VOICE-DATA-POLICY

# Buffer size optimization
interface GigabitEthernet0/1
 hold-queue 150 out
```

## Performance Monitoring Automation

### Automated Performance Testing
```bash
#!/bin/bash
# Network performance monitoring script

LOG_FILE="/var/log/network_performance.log"
DATE=$(date '+%Y-%m-%d %H:%M:%S')

# Bandwidth test
BANDWIDTH=$(iperf3 -c performance-server -t 10 -f M | grep sender | awk '{print $7}')

# Latency test
LATENCY=$(ping -c 10 google.com | tail -1 | awk -F'/' '{print $5}')

# Packet loss test
PACKET_LOSS=$(ping -c 100 google.com | grep 'packet loss' | awk '{print $6}')

# Log results
echo "$DATE,Bandwidth,$BANDWIDTH,Latency,$LATENCY,PacketLoss,$PACKET_LOSS" >> $LOG_FILE

# Alert if performance degrades
if (( $(echo "$LATENCY > 100" | bc -l) )); then
    echo "High latency alert: ${LATENCY}ms" | mail -s "Network Alert" admin@example.com
fi
```

### Performance Dashboard Creation
```bash
# Grafana data source configuration for network metrics
# InfluxDB query examples:
# SELECT mean("value") FROM "bandwidth" WHERE time >= now() - 1h GROUP BY time(1m)
# SELECT mean("value") FROM "latency" WHERE time >= now() - 1h GROUP BY time(1m)

# Prometheus network exporter configuration
# node_exporter for system metrics
# snmp_exporter for network device metrics
```

## Capacity Planning

### Growth Prediction Analysis
```bash
# Historical data analysis for growth prediction
#!/bin/bash

# Extract bandwidth usage over time
awk -F',' '{print $1, $3}' /var/log/network_performance.log > bandwidth_history.txt

# Calculate growth rate (requires statistical tools)
# R script example:
cat > growth_analysis.R << EOF
data <- read.table("bandwidth_history.txt", header=FALSE)
names(data) <- c("date", "bandwidth")
data$date <- as.Date(data$date)

# Linear regression for trend analysis
model <- lm(bandwidth ~ as.numeric(date), data=data)
summary(model)

# Predict future bandwidth requirements
future_dates <- seq(max(data$date), by="month", length.out=12)
predictions <- predict(model, newdata=data.frame(date=as.numeric(future_dates)))
print(predictions)
EOF

Rscript growth_analysis.R
```

### Network Sizing Recommendations
- **95th Percentile Rule**: Plan for 95th percentile of traffic
- **Growth Factor**: Add 20-30% buffer for unexpected growth
- **Peak Hour Analysis**: Consider peak usage patterns
- **Application Requirements**: Factor in new application bandwidth needs

## Best Practices for Performance Analysis

### Monitoring Strategy
- **Continuous Monitoring**: Implement 24/7 performance monitoring
- **Baseline Maintenance**: Regularly update performance baselines
- **Proactive Alerting**: Set thresholds before problems occur
- **Historical Analysis**: Maintain long-term performance data

### Documentation and Reporting
- **Performance Reports**: Regular performance summary reports
- **Trend Analysis**: Identify long-term performance trends
- **Incident Correlation**: Link performance issues to network events
- **Optimization Tracking**: Document performance improvements

### Tool Selection and Integration
- **Comprehensive Coverage**: Monitor all network layers
- **Scalable Solutions**: Choose tools that grow with network
- **Integration Capabilities**: Ensure tools work together
- **Automation Support**: Automate routine monitoring tasks