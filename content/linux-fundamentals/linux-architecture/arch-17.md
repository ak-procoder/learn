---
id: arch-17
title: Memory Caching and Buffers
type: text
---

## Linux caching philosophy

Linux aggressively uses free RAM for caching to improve performance. Cached memory is freed immediately when applications need it.

## Cache types

**Page cache**:
- Caches file data from disk
- Speeds up file I/O operations
- Read-ahead optimization
- Write-back for dirty pages

**Buffer cache**:
- Caches disk block metadata
- File system structures and inodes
- Directory information

**Slab cache**:
- Kernel object caching
- Pre-allocated data structures
- Reduces allocation overhead

## Understanding memory usage

```bash
# Detailed memory breakdown
free -h
              total    used    free   shared  buff/cache   available
Mem:           16Gi    4.5Gi   3.2Gi    500Mi        8.3Gi      10.5Gi

# Page cache statistics
cat /proc/meminfo | grep -i cache

# Drop caches (requires root)
# 1: pagecache, 2: dentries/inodes, 3: both
echo 3 | sudo tee /proc/sys/vm/drop_caches
```

## Cache effectiveness

- **Cache hit**: Data found in cache (fast)
- **Cache miss**: Data must be read from disk (slow)
- **Working set**: Frequently accessed data kept in cache

## Performance impact

Cached data can be read orders of magnitude faster:
- RAM access: ~100ns
- SSD access: ~100μs (1000x slower)
- HDD access: ~10ms (100,000x slower)
