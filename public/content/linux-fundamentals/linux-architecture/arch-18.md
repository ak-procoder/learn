---
id: arch-18
title: Process Scheduling Introduction
type: text
---

## Process scheduler role

The process scheduler decides which process/thread runs on the CPU at any given moment, ensuring fair resource distribution and system responsiveness.

## Scheduling objectives

- **Fairness**: Equal CPU time for similar priority processes
- **Responsiveness**: Quick response to user interaction
- **Throughput**: Maximum work completion
- **Efficiency**: Minimize context switch overhead
- **Priority**: Honor process importance levels

## Process states

```
           fork()
             ↓
         NEW/CREATED
             ↓
         READY (Runnable)
         ↗   ↓   ↖
    RUNNING  ←---→  WAITING (Blocked)
         ↓              I/O, Event
     TERMINATED
```

- **Running**: Executing on CPU
- **Ready**: Waiting for CPU time
- **Sleeping**: Waiting for event (interruptible/uninterruptible)
- **Stopped**: Suspended by signal
- **Zombie**: Terminated but not reaped

## Viewing process states

```bash
# Process status
ps aux

# Real-time process viewer
top
htop

# Specific process state
cat /proc/PID/status | grep State
```
