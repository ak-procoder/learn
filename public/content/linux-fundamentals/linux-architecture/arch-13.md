---
id: arch-13
title: Memory Management Overview
type: text
---

## Linux memory management

The memory management subsystem handles physical RAM allocation, virtual memory, paging, and swapping to provide efficient and isolated memory access.

## Key responsibilities

- **Physical memory allocation**: Managing RAM pages
- **Virtual memory**: Process address space abstraction
- **Memory mapping**: Virtual to physical translation
- **Caching**: Buffer cache and page cache
- **Swapping**: Moving data to/from disk
- **Memory protection**: Isolating process memory

## Memory hierarchy

```
CPU Registers (< 1ns)
    ↓
L1 Cache (1-2ns)
    ↓
L2 Cache (4-10ns)
    ↓
L3 Cache (20-40ns)
    ↓
Main Memory / RAM (100ns)
    ↓
SSD Storage (10-100μs)
    ↓
HDD Storage (1-10ms)
```

## Memory zones

- **ZONE_DMA**: < 16MB for legacy DMA devices
- **ZONE_NORMAL**: 16MB - 896MB (32-bit) or all (64-bit)
- **ZONE_HIGHMEM**: > 896MB (32-bit only)
- **ZONE_MOVABLE**: For memory hotplug

## Viewing memory usage

```bash
# Overall memory statistics
free -h

# Detailed memory info
cat /proc/meminfo

# Per-process memory
ps aux --sort=-rss
top -o %MEM
```
