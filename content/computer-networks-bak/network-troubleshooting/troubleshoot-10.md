---
id: troubleshoot-10
title: Network Monitoring and Analysis Tools
type: text
---

## Network Monitoring Overview

Network monitoring involves continuous observation of network infrastructure to detect problems, analyze performance, and ensure optimal operation. Modern networks require sophisticated monitoring tools to handle complex topologies and high-speed connections.

### Types of Network Monitoring
- **Real-time Monitoring**: Live observation of network status and performance
- **Historical Analysis**: Trending and pattern analysis over time
- **Alerting Systems**: Automated notification of problems and thresholds
- **Performance Baseline**: Establishing normal operational parameters

### Monitoring Approaches
- **SNMP-based Monitoring**: Using Simple Network Management Protocol
- **Flow-based Analysis**: Analyzing network flows (NetFlow, sFlow)
- **Packet-level Monitoring**: Deep packet inspection and analysis
- **Synthetic Monitoring**: Proactive testing with synthetic transactions

## SNMP-Based Monitoring Tools

### SNMP Fundamentals
Simple Network Management Protocol enables centralized monitoring and management of network devices.

#### SNMP Versions
- **SNMPv1**: Original version with limited security
- **SNMPv2c**: Community-based with enhanced operations
- **SNMPv3**: Secure version with authentication and encryption

#### SNMP Operations
- **GET**: Retrieve specific MIB values
- **GETNEXT**: Retrieve next MIB object in tree
- **GETBULK**: Retrieve multiple MIB objects efficiently
- **SET**: Modify MIB values (configuration changes)
- **TRAP**: Asynchronous notifications from devices

### SNMP Command-Line Tools
```bash
# SNMPwalk - traverse MIB tree
snmpwalk -v2c -c public 192.168.1.1

# Get specific OID
snmpget -v2c -c public 192.168.1.1 1.3.6.1.2.1.1.5.0

# Get interface statistics
snmpwalk -v2c -c public 192.168.1.1 1.3.6.1.2.1.2.2.1.10

# SNMPv3 with authentication
snmpget -v3 -u username -a SHA -A authpass -x AES -X privpass 192.168.1.1 1.3.6.1.2.1.1.5.0

# Monitor interface counters
snmpwalk -v2c -c public 192.168.1.1 1.3.6.1.2.1.2.2.1.10 | while read line; do
    echo "$(date): $line"
    sleep 5
done
```

### Popular SNMP Monitoring Solutions

#### Nagios
Open-source monitoring system with extensive plugin support.
```bash
# Example Nagios check command
/usr/lib/nagios/plugins/check_snmp -H 192.168.1.1 -C public -o 1.3.6.1.2.1.2.2.1.8.1 -w 1 -c 1

# Check interface utilization
/usr/lib/nagios/plugins/check_snmp_int.pl -H 192.168.1.1 -C public -n eth0 -w 80 -c 95
```

#### Zabbix
Enterprise monitoring platform with web interface.
- **Auto-discovery**: Automatic device and service discovery
- **Templates**: Pre-configured monitoring templates
- **Graphing**: Built-in trending and visualization
- **Alerting**: Flexible notification system

#### LibreNMS
Community-driven network monitoring platform.
- **Auto-discovery**: Automatic device detection and monitoring
- **Alerting**: Customizable alert rules and notifications
- **API Access**: RESTful API for integration
- **Mobile App**: Mobile application for monitoring

## Performance Monitoring Tools

### Bandwidth Monitoring

#### MRTG (Multi Router Traffic Grapher)
```bash
# MRTG configuration example
Target[router.1]: 2:public@192.168.1.1:161
MaxBytes[router.1]: 12500000
Title[router.1]: Router Interface 1
PageTop[router.1]: <h1>Router Interface 1</h1>
```

#### Cacti
Web-based graphing solution built on RRDTool.
- **Data Collection**: SNMP polling and script-based collection
- **Graphing**: Customizable graphs and templates
- **User Management**: Role-based access control
- **Plugin Architecture**: Extensible with plugins

### Network Flow Analysis

#### NetFlow/sFlow Concepts
- **NetFlow**: Cisco's flow monitoring technology
- **sFlow**: Industry-standard flow sampling
- **IPFIX**: Internet Protocol Flow Information Export standard
- **Flow Record**: Information about network flows (source, destination, ports, protocols)

#### ntopng
High-speed web-based flow analysis tool.
```bash
# Start ntopng
ntopng -d /var/lib/ntopng/ntopng.db -P /var/lib/ntopng/ntopng.pid

# Configuration options
ntopng -i eth0 -P /tmp/ntopng.pid -d /tmp -w 3000

# With NetFlow collection
ntopng -i eth0 -P /tmp/ntopng.pid -P /tmp/ntopng.pid --netflow=2055
```

#### nfcapd (NetFlow Capture Daemon)
```bash
# Start NetFlow collector
nfcapd -w -D -p 2055 -l /var/cache/nfcapd

# Analyze collected flows
nfdump -R /var/cache/nfcapd -s ip/flows -n 10

# Top talkers
nfdump -R /var/cache/nfcapd -s srcip/bytes -n 10

# Protocol distribution
nfdump -R /var/cache/nfcapd -s proto/bytes -n 10
```

## Real-Time Monitoring Tools

### iftop
Real-time bandwidth usage by connection.
```bash
# Monitor specific interface
sudo iftop -i eth0

# Show ports
sudo iftop -P

# Show bandwidth in bytes
sudo iftop -B

# Filter specific host
sudo iftop -f "host 192.168.1.100"
```

### nload
Real-time network interface monitoring.
```bash
# Monitor all interfaces
nload

# Monitor specific interface
nload eth0

# Set refresh interval
nload -t 1000 eth0

# Show multiple interfaces
nload eth0 eth1
```

### vnstat
Network statistics monitoring.
```bash
# View interface statistics
vnstat -i eth0

# Hourly statistics
vnstat -h -i eth0

# Daily statistics
vnstat -d -i eth0

# Monthly statistics
vnstat -m -i eth0

# Real-time monitoring
vnstat -l -i eth0
```

## Log Analysis and SIEM

### System Log Analysis
```bash
# Monitor system logs
tail -f /var/log/syslog
tail -f /var/log/messages

# Search for network-related entries
grep -i "network\|eth0\|dhcp" /var/log/syslog

# Analyze authentication logs
grep -i "failed\|invalid" /var/log/auth.log

# Monitor firewall logs
tail -f /var/log/ufw.log
```

### Centralized Logging

#### ELK Stack (Elasticsearch, Logstash, Kibana)
```bash
# Logstash configuration for network logs
input {
  file {
    path => "/var/log/syslog"
    start_position => "beginning"
  }
}

filter {
  if [message] =~ /DPT=/ {
    grok {
      match => { "message" => "SRC=%{IP:src_ip} DST=%{IP:dst_ip} .*DPT=%{INT:dst_port}" }
    }
  }
}

output {
  elasticsearch {
    hosts => ["localhost:9200"]
    index => "network-logs-%{+YYYY.MM.dd}"
  }
}
```

#### Splunk
Commercial log analysis platform.
```splunk
# Search for failed connections
index=network "failed" OR "denied" | stats count by src_ip | sort -count

# Network traffic analysis
index=firewall | stats sum(bytes_out) as total_bytes by dest_ip | sort -total_bytes

# Time-based analysis
index=network earliest=-1h | timechart count by action
```

## Cloud and Container Monitoring

### Docker Network Monitoring
```bash
# Monitor container network usage
docker stats --format "table {{.Container}}\t{{.NetIO}}"

# Inspect container network configuration
docker network ls
docker network inspect bridge

# Monitor container logs
docker logs -f container_name

# Check container network connectivity
docker exec container_name ping google.com
```

### Kubernetes Network Monitoring
```bash
# Check pod network status
kubectl get pods -o wide

# Monitor service endpoints
kubectl get endpoints

# Check network policies
kubectl get networkpolicies

# Monitor ingress controllers
kubectl logs -f deployment/nginx-ingress-controller -n ingress-nginx
```

### AWS CloudWatch
```bash
# AWS CLI monitoring commands
aws cloudwatch get-metric-statistics --namespace AWS/EC2 --metric-name NetworkIn --dimensions Name=InstanceId,Value=i-1234567890abcdef0 --statistics Sum --start-time 2023-01-01T00:00:00Z --end-time 2023-01-01T01:00:00Z --period 3600

# VPC Flow Logs
aws ec2 describe-flow-logs
aws logs describe-log-groups --log-group-name-prefix "/aws/vpc/flowlogs"
```

## Network Discovery and Mapping

### Nmap for Network Discovery
```bash
# Discover hosts on network
nmap -sn 192.168.1.0/24

# Port scanning
nmap -sS 192.168.1.1-100

# Service detection
nmap -sV 192.168.1.1

# Operating system detection
nmap -O 192.168.1.1

# Comprehensive scan
nmap -A 192.168.1.1

# Script scanning
nmap --script=default 192.168.1.1
```

### Network Topology Discovery
```bash
# CDP/LLDP discovery (if supported)
lldpctl
lldpctl show neighbors

# SNMP-based discovery
snmpwalk -v2c -c public 192.168.1.1 1.3.6.1.2.1.1.1.0
snmpwalk -v2c -c public 192.168.1.1 1.3.6.1.4.1.9.2.1.3.0  # Cisco neighbors
```

## Alerting and Notification Systems

### Threshold-Based Alerting
```bash
# Simple bandwidth monitoring script
#!/bin/bash
INTERFACE="eth0"
THRESHOLD=80  # 80% utilization

while true; do
    RX_BYTES=$(cat /sys/class/net/$INTERFACE/statistics/rx_bytes)
    TX_BYTES=$(cat /sys/class/net/$INTERFACE/statistics/tx_bytes)
    
    sleep 1
    
    RX_BYTES_NEW=$(cat /sys/class/net/$INTERFACE/statistics/rx_bytes)
    TX_BYTES_NEW=$(cat /sys/class/net/$INTERFACE/statistics/tx_bytes)
    
    RX_RATE=$(( ($RX_BYTES_NEW - $RX_BYTES) * 8 / 1000000 ))  # Mbps
    TX_RATE=$(( ($TX_BYTES_NEW - $TX_BYTES) * 8 / 1000000 ))  # Mbps
    
    if [ $RX_RATE -gt $THRESHOLD ] || [ $TX_RATE -gt $THRESHOLD ]; then
        echo "Alert: High bandwidth usage - RX: ${RX_RATE}Mbps, TX: ${TX_RATE}Mbps"
        # Send notification (email, SMS, webhook, etc.)
    fi
done
```

### Integration with Notification Services
```bash
# Slack webhook notification
curl -X POST -H 'Content-type: application/json' \
  --data '{"text":"Network Alert: High bandwidth usage detected"}' \
  https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK

# Email notification
echo "Network alert: High CPU usage" | mail -s "Network Alert" admin@example.com

# PagerDuty integration
curl -X POST https://events.pagerduty.com/v2/enqueue \
  -H 'Content-Type: application/json' \
  -d '{
    "routing_key": "YOUR_ROUTING_KEY",
    "event_action": "trigger",
    "payload": {
      "summary": "Network performance degradation",
      "severity": "critical"
    }
  }'
```

## Best Practices for Network Monitoring

### Monitoring Strategy
- **Baseline Establishment**: Understand normal network behavior
- **Proactive Monitoring**: Detect issues before users report them
- **Layered Approach**: Monitor at multiple network layers
- **Scalable Solutions**: Choose tools that grow with network size

### Data Management
- **Storage Planning**: Plan for log and metric data storage requirements
- **Data Retention**: Implement appropriate data retention policies
- **Performance Impact**: Minimize monitoring overhead on production systems
- **Security Considerations**: Protect monitoring data and access credentials

### Tool Selection Criteria
- **Scalability**: Ability to handle network growth
- **Integration**: Compatibility with existing systems
- **Automation**: Support for automated responses and reporting
- **Cost-Effectiveness**: Balance between features and budget constraints