---
id: arch-19
title: Completely Fair Scheduler (CFS)
type: text
---

## What is CFS?

The Completely Fair Scheduler is Linux's default scheduler since 2.6.23, designed to provide fair CPU time to all processes based on their priority.

## CFS core concepts

**Virtual runtime (vruntime)**:
- Tracks how much CPU time a process has used
- Weighted by process priority (nice value)
- Lower vruntime = higher priority for scheduling

**Red-black tree**:
- Runnable processes organized in balanced tree
- Sorted by vruntime
- O(log n) insertion/removal
- Leftmost node = next process to run

## Scheduling decision

1. Select process with lowest vruntime
2. Run for time slice (typically 6-24ms)
3. Update vruntime based on actual runtime
4. Re-insert into red-black tree
5. Repeat

## Process priority (nice values)

```bash
# View process priorities
ps -el

# Run with lower priority (nice 10)
nice -n 10 command

# Adjust running process priority
renice -n 5 -p PID

# Requires privileges for negative nice
sudo nice -n -10 high_priority_task

# Nice range: -20 (highest) to +19 (lowest)
```

## Weight calculation

Weight = 1024 / (1.25 ^ nice_value)
- Nice -20: ~88 times more CPU than nice 0
- Nice +19: ~1/88 CPU compared to nice 0
