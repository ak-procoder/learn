---
id: arch-16
title: Swap Space and Memory Pressure
type: text
---

## What is swap space?

Swap is disk space used as an extension of RAM, allowing the system to move infrequently used memory pages to disk and free up physical RAM.

## Swap implementations

**Swap partition**:
- Dedicated disk partition
- Better performance
- Fixed size

**Swap file**:
- Regular file used as swap
- Flexible sizing
- Easier to resize

## Creating and managing swap

```bash
# Create swap file
sudo dd if=/dev/zero of=/swapfile bs=1G count=4
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Make permanent
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# View swap usage
swapon --show
free -h

# Adjust swappiness (0-100)
sudo sysctl vm.swappiness=10

# Clear swap
sudo swapoff -a
sudo swapon -a
```

## Memory pressure

When RAM is low, kernel uses page reclaim:
- **Anonymous pages**: Swapped to disk
- **File-backed pages**: Dropped if clean, written if dirty
- **Slab cache**: Kernel data structures shrunk

## OOM Killer

Out-Of-Memory killer terminates processes when memory is critically low based on oom_score.
