---
id: arch-26
title: /proc and /sys Filesystems
type: text
---

## Virtual filesystems

/proc and /sys are virtual filesystems providing interfaces to kernel data structures and hardware information.

## /proc filesystem

Provides process and system information:

```bash
# Process information
ls /proc/PID/
cat /proc/PID/cmdline    # Command line
cat /proc/PID/status     # Process status
cat /proc/PID/maps       # Memory mappings
cat /proc/PID/fd/        # Open file descriptors

# System information
cat /proc/cpuinfo        # CPU details
cat /proc/meminfo        # Memory statistics
cat /proc/uptime         # System uptime
cat /proc/loadavg        # Load average
cat /proc/version        # Kernel version
cat /proc/mounts         # Mounted filesystems

# Kernel parameters
cat /proc/sys/net/ipv4/ip_forward
echo 1 > /proc/sys/net/ipv4/ip_forward
```

## /sys filesystem

Unified device and driver interface:

```bash
# Block device information
ls /sys/block/sda/
cat /sys/block/sda/size
cat /sys/block/sda/queue/scheduler

# Network interfaces
ls /sys/class/net/
cat /sys/class/net/eth0/address
cat /sys/class/net/eth0/statistics/rx_bytes

# Power management
cat /sys/class/power_supply/BAT0/capacity

# CPU frequency
cat /sys/devices/system/cpu/cpu0/cpufreq/scaling_governor
```

## Differences

- **/proc**: Process-centric, legacy sysctl interface
- **/sys**: Structured device/driver hierarchy
