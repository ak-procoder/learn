---
id: cmd-19
title: System Information - uname and hostname
type: text
---

Display system information.

## uname - System Information

```bash
# Kernel name
uname

# All information
uname -a

# Kernel release
uname -r

# Kernel version
uname -v

# Machine hardware name
uname -m

# Processor type
uname -p

# Operating system
uname -o

# Hostname
uname -n
```

## hostname - Get/Set Hostname

```bash
# Display hostname
hostname

# Display FQDN (Fully Qualified Domain Name)
hostname -f

# Display IP address
hostname -I

# Set hostname (temporary)
sudo hostname newhostname

# Set permanently (Ubuntu/Debian)
sudo hostnamectl set-hostname newhostname
```

## hostnamectl - Modern Hostname Management

```bash
# Show all hostname info
hostnamectl

# Set hostname
sudo hostnamectl set-hostname server01

# Set pretty hostname
sudo hostnamectl set-hostname "My Web Server" --pretty
```

## System Information Files

```bash
# OS release information
cat /etc/os-release

# OS version
cat /etc/issue

# System info
cat /proc/version

# CPU information
cat /proc/cpuinfo

# Memory information
cat /proc/meminfo
```