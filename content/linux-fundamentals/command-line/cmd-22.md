---
id: cmd-22
title: Network Commands - netstat and ss
type: text
---

View network connections.

## netstat - Network Statistics (deprecated)

```bash
# Show all connections
netstat -a

# TCP connections only
netstat -t

# UDP connections only
netstat -u

# Listening ports
netstat -l

# Show PID and program
netstat -p

# Show numerical addresses
netstat -n

# Common combination
netstat -tuln        # TCP/UDP listening, numerical
```

## ss - Socket Statistics (modern replacement)

```bash
# Show all sockets
ss -a

# TCP sockets
ss -t

# Listening sockets
ss -l

# Established connections
ss -o state established

# Show process using socket
ss -p

# Comprehensive view
ss -tulpn
```

## Practical Examples

```bash
# Find process on port 80
ss -tulpn | grep :80

# Show all listening ports
ss -tuln

# Count connections by state
ss -s

# Watch connections in real-time
watch -n 1 'ss -tuln'
```