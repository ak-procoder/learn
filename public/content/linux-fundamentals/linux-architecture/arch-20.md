---
id: arch-20
title: Real-Time Scheduling
type: text
---

## Real-time scheduling policies

Linux provides real-time scheduling policies for time-critical tasks that need guaranteed CPU access.

## Real-time policies

**SCHED_FIFO (First-In-First-Out)**:
- Highest priority scheduler
- Runs until completion or yields
- Priority levels: 1-99 (99 = highest)
- No time slicing among same priority

**SCHED_RR (Round-Robin)**:
- Similar to FIFO with time slicing
- Shares CPU among equal priority tasks
- Fixed time quantum per process
- More fair than FIFO

**SCHED_DEADLINE**:
- Earliest Deadline First (EDF) algorithm
- Specify runtime, deadline, period
- Guaranteed scheduling if schedulable
- Most sophisticated RT policy

## Setting scheduling policies

```bash
# View process scheduling info
chrt -p PID

# Run with FIFO policy (priority 50)
sudo chrt -f 50 ./realtime_app

# Run with RR policy (priority 30)
sudo chrt -r 30 ./realtime_app

# Change existing process
sudo chrt -f -p 80 PID

# View all real-time processes
ps -eo pid,cls,pri,comm | grep -E 'FF|RR'
```

## Important considerations

- Real-time processes can starve system
- Use carefully, can freeze system
- Requires CAP_SYS_NICE capability
- Test thoroughly before production use
