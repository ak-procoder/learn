---
id: cmd-20
title: System Status - uptime and free
type: text
---

Check system uptime and memory .

## uptime - System Uptime

```bash
# Show uptime and load average
uptime

# Pretty format
uptime -p

# Since when system is up
uptime -s
```

**Output explanation:**
```
14:30:25 up 5 days, 3:45, 2 users, load average: 0.15, 0.20, 0.18
```

- Current time: 14:30:25
- Uptime: 5 days, 3 hours, 45 minutes
- Logged in users: 2
- Load average: 1, 5, 15 minute averages

## free - Memory Usage

```bash
# Show memory in megabytes
free -m

# Human-readable format
free -h

# Show total
free -h --total

# Continuous updates
free -h -s 2       # Every 2 seconds

# Wide output
free -w
```

**Output columns:**
```
              total        used        free      shared  buff/cache   available
Mem:           7.7G        2.1G        3.2G        186M        2.4G        5.1G
Swap:          2.0G          0B        2.0G
```

- **total**: Total installed
- **used**: Used by processes
- **free**: Completely unused
- **shared**: Shared memory
- **buff/cache**: Cache and buffers
- **available**: Available for new processes

## Disk Space

```bash
# Disk usage (human-readable)
df -h

# Disk usage of directory
du -sh /var/log

# Show only specific filesystem
df -h /home
```