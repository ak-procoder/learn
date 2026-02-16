---
id: intro-29
title: Getting System Information
type: text
---

## Hardware Information

### CPU
```bash
lscpu                    # CPU details
cat /proc/cpuinfo        # Detailed CPU info
nproc                    # Number of cores
```

### Memory
```bash
free -h                  # RAM usage (human-readable)
cat /proc/meminfo        # Detailed memory info
vmstat                   # Virtual memory statistics
```

### Disk
```bash
lsblk                    # List block devices
df -h                    # Disk space by filesystem
du -sh directory/        # Directory size
sudo fdisk -l            # Partition information
```

### Hardware Devices
```bash
lspci                    # PCI devices
lsusb                    # USB devices
lshw                     # Detailed hardware list
```

## System Information

### Distribution/Version
```bash
cat /etc/os-release      # Distribution info
uname -a                 # Kernel and system info
uname -r                 # Kernel version
hostnamectl              # System hostname and details
```

### Uptime and Load
```bash
uptime                   # System uptime and load
w                        # Who is logged in
last                     # Login history
```

### Date and Time
```bash
date                     # Current date/time
timedatectl              # Time, timezone, NTP status
cal                      # Calendar
```

## Performance Monitoring

```bash
top                      # Real-time process monitor
htop                     # Enhanced interactive monitor
iotop                    # Disk I/O monitor
nethogs                  # Network bandwidth per process
```
