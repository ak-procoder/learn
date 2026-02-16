---
id: intro-16
title: Process Management Basics
type: text
---

## What is a Process?

A process is a running instance of a program with:
- Unique Process ID (PID)
- Allocated memory
- System resources (CPU time, file handles)
- Owner (user who started it)

## Process States

- **Running**: Currently executing on CPU
- **Sleeping**: Waiting for event (I/O, timer)
- **Stopped**: Suspended (Ctrl+Z)
- **Zombie**: Finished but not cleaned up

## Viewing Processes

### ps (Process Status)
```bash
ps aux          # All processes, detailed
ps -ef          # All processes, different format
ps -u username  # Processes for specific user
```

### top (Interactive Monitor)
```bash
top
```
- Real-time process viewer
- Shows CPU and memory usage
- Interactive commands (k=kill, r=renice)

### htop (Enhanced top)
```bash
htop
```
- Colored, user-friendly interface
- Mouse support
- Tree view of processes

## Process Control

- **Foreground**: Process occupies terminal
- **Background**: Process runs independently (append `&`)
- **Jobs**: Manage background processes in current shell
