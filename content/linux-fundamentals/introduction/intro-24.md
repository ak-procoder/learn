---
id: intro-24
title: Networking Basics
type: text
---

## Network Configuration

Linux provides various tools for network management.

## Viewing Network Information

### IP Address
```bash
# Modern command
ip addr show
ip a

# Older command (still common)
ifconfig
```

### Network Interfaces
- **lo**: Loopback (127.0.0.1)
- **eth0/ens33**: Ethernet
- **wlan0/wlp3s0**: WiFi

### Routing Table
```bash
ip route show
route -n
```

### DNS Configuration
```bash
# View DNS servers
cat /etc/resolv.conf

# Test DNS resolution
nslookup example.com
dig example.com
```

## Network Testing

### Connectivity
```bash
# Test reachability
ping google.com
ping -c 4 8.8.8.8

# Trace route
traceroute google.com
mtr google.com  # Better traceroute
```

### Port Testing
```bash
# Check open ports
netstat -tulpn
ss -tulpn

# Test specific port
telnet example.com 80
nc -zv example.com 80
```

## Network Managers

- **NetworkManager**: Desktop and laptop default
- **systemd-networkd**: Server and minimal systems
- **netplan**: Ubuntu configuration abstraction
