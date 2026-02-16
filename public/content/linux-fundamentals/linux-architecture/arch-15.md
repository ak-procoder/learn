---
id: arch-15
title: Paging and Page Faults
type: text
---

## Paging mechanism

Linux divides memory into fixed-size pages (typically 4KB) and manages memory at the page granularity rather than byte-level.

## Page sizes

- **Standard pages**: 4KB (most common)
- **Huge pages**: 2MB (x86_64)
- **Gigantic pages**: 1GB (x86_64)
- **Transparent Huge Pages (THP)**: Automatic huge page allocation

## Page faults

A page fault occurs when a process accesses a virtual memory page not currently in physical RAM.

**Minor page fault**:
- Page in memory but not in page table
- Fast to resolve
- Common during lazy allocation

**Major page fault**:
- Page must be loaded from disk (swap or file)
- Expensive operation (disk I/O)
- Causes process to block

## Page fault handling

1. Process accesses unmapped address
2. CPU generates page fault exception
3. Kernel page fault handler invoked
4. Determine fault type (invalid, protection, not present)
5. Allocate physical page or load from disk
6. Update page tables
7. Resume process execution

## Monitoring page faults

```bash
# System-wide page fault statistics
vmstat 1

# Per-process page faults
ps -o min_flt,maj_flt,cmd -p PID

# Detailed memory events
perf stat -e page-faults command
```
