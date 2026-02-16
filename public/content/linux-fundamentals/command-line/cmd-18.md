---
id: cmd-18
title: Process Management - kill
type: text
---

Terminate and signal processes.

## kill - Send Signals to Processes

```bash
# Terminate process (SIGTERM)
kill 1234

# Force kill (SIGKILL)
kill -9 1234
kill -KILL 1234

# Reload configuration (SIGHUP)
kill -HUP 1234

# List available signals
kill -l
```

## Common Signals

| Signal | Number | Meaning |
|--------|--------|---------|
| SIGHUP | 1 | Hangup, reload config |
| SIGINT | 2 | Interrupt (Ctrl+C) |
| SIGKILL | 9 | Force kill (cannot be caught) |
| SIGTERM | 15 | Terminate gracefully (default) |
| SIGSTOP | 19 | Stop (pause) process |
| SIGCONT | 18 | Continue stopped process |

## killall - Kill by Name

```bash
# Kill all processes by name
killall firefox

# Force kill by name
killall -9 nginx

# Interactive mode
killall -i process_name
```

## pkill - Advanced Process Killing

```bash
# Kill by pattern
pkill -f "python.*script.py"

# Kill by user
pkill -u username

# Kill by terminal
pkill -t pts/0

# Combine criteria
pkill -u bob -f firefox
```

## Practical Examples

```bash
# Kill frozen application
killall -9 frozen_app

# Gracefully restart service
kill -HUP $(cat /var/run/nginx.pid)

# Kill all user processes
pkill -u username
```