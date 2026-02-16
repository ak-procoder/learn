---
id: cmd-21
title: Network Commands - ping
type: text
---

Test network connectivity.

## ping - Test Network Connection

```bash
# Ping host
ping google.com

# Limit number of packets
ping -c 4 google.com

# Ping interval (seconds)
ping -i 2 google.com

# Flood ping (requires root) 
sudo ping -f google.com

# Set packet size
ping -s 1000 google.com

# IPv4 only
ping -4 google.com

# IPv6 only
ping -6 google.com
```

## Understanding ping Output

```
64 bytes from 142.250.185.46: icmp_seq=1 ttl=117 time=15.3 ms
```

- **bytes**: Packet size
- **from**: Responding IP
- **icmp_seq**: Sequence number
- **ttl**: Time To Live (hops remaining)
- **time**: Round-trip time (latency)

## Troubleshooting with ping

**Test sequence:**
```bash
# Test localhost
ping 127.0.0.1

# Test default gateway
ping $(ip route | grep default | awk '{print $3}')

# Test external IP
ping 8.8.8.8

# Test DNS
ping google.com
```

## traceroute - Trace Network Path

```bash
# Trace route to host
traceroute google.com

# Use ICMP instead of UDP
traceroute -I google.com

# Don't resolve hostnames
traceroute -n google.com
```