---
id: cmd-23
title: Network Commands - ip and curl
type: text
---

Network configuration and web requests.

## ip - Network Configuration

```bash
# Show all interfaces
ip addr
ip addr show

# Show specific interface
ip addr show eth0

# Show routing table
ip route

# Show ARP cache
ip neigh

# Add IP address
sudo ip addr add 192.168.1.100/24 dev eth0

# Delete IP address
sudo ip addr del 192.168.1.100/24 dev eth0

# Bring interface up/down
sudo ip link set eth0 up
sudo ip link set eth0 down
```

## curl - Transfer Data

```bash
# Download file
curl -O https://example.com/file.txt

# Save with custom name
curl -o myfile.txt https://example.com/file.txt

# Follow redirects
curl -L https://example.com

# Show headers only
curl -I https://example.com

# POST data
curl -X POST -d "param=value" https://api.example.com

# Include headers in output
curl -i https://example.com

# Silent mode (no progress)
curl -s https://example.com

# Basic authentication
curl -u username:password https://example.com
```

## wget - File Downloader

```bash
# Download file
wget https://example.com/file.txt

# Resume interrupted download
wget -c https://example.com/largefile.iso

# Download recursively
wget -r https://example.com

# Background download
wget -b https://example.com/file.txt

# Limit speed
wget --limit-rate=100k https://example.com/file.txt
```