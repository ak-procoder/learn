---
id: arch-21
title: CPU Affinity and NUMA
type: text
---

## CPU affinity

CPU affinity allows binding processes to specific CPU cores, improving cache efficiency and reducing context switch overhead.

## Setting CPU affinity

```bash
# Run process on specific CPU cores
taskset -c 0,1,2 ./my_program

# Run on CPUs 0-3
taskset -c 0-3 ./my_program

# Set affinity for running process
taskset -cp 0,1 PID

# View current affinity
taskset -cp PID

# Using numactl
numactl --cpunodebind=0 --membind=0 ./program
```

## Benefits of CPU affinity

- **Cache locality**: Data stays in CPU cache
- **Predictable performance**: Reduces jitter
- **Interrupt handling**: Separate CPUs for I/O
- **Real-time tasks**: Dedicated cores

## NUMA (Non-Uniform Memory Access)

In multi-socket systems, memory access speed depends on CPU-memory proximity.

```bash
# View NUMA topology
numactl --hardware

# Check NUMA statistics
numastat

# Per-process NUMA info
numastat -p PID

# Bind process to NUMA node
numactl --cpunodebind=0 --membind=0 program
```

## NUMA best practices

- Keep memory and CPU on same node
- Use local memory allocation
- Consider NUMA when designing multi-threaded apps
