---
id: cmd-16
title: Process Viewing - ps
type: text
---

View and manage running processes.

## ps - Process Status

```bash
# Show your processes
ps

# Show all processes
ps aux

# Show process tree
ps auxf

# Show by user
ps aux | grep username

# Custom format
ps -eo pid,user,cmd,%mem,%cpu --sort=-%mem

# Show threads
ps -eLf
```

## Understanding ps aux Output

```
USER  PID %CPU %MEM    VSZ   RSS TTY STAT START TIME COMMAND
root    1  0.0  0.1 225680  9156 ?   Ss   00:00 0:01 /sbin/init
```

**Columns:**
- USER - Process owner
- PID - Process ID
- %CPU - CPU usage
- %MEM - Memory usage
- VSZ - Virtual memory size
- RSS - Resident set size (actual RAM)
- TTY - Terminal
- STAT - State (R=running, S=sleeping, Z=zombie)
- START - Start time
- TIME - CPU time used
- COMMAND - Command name

## Useful ps Commands

```bash
# Top memory consumers
ps aux --sort=-%mem | head

# Top CPU consumers
ps aux --sort=-%cpu | head

# Find specific process
ps aux | grep nginx

# Process by PID
ps -p 1234 -o pid,user,cmd
```