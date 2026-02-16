---
id: arch-3
title: Kernel Space vs User Space
type: text
---

## Memory space separation

Linux divides virtual memory into two distinct regions to ensure system stability and security.

## Kernel space

- **Privileged mode**: CPU operates with full hardware access
- **Memory region**: Typically upper 1GB on 32-bit systems
- **Code execution**: Kernel code, device drivers, modules
- **Access level**: Ring 0 (highest privilege)
- **Protected**: User processes cannot directly access

## User space

- **Unprivileged mode**: CPU operates with restricted access
- **Memory region**: Typically lower 3GB on 32-bit systems
- **Code execution**: User applications and processes
- **Access level**: Ring 3 (lowest privilege)
- **Isolated**: Each process has its own virtual address space

## Why separation matters

- **Stability**: Crashed user process doesn't affect kernel
- **Security**: Prevents malicious code from accessing hardware
- **Memory protection**: Processes cannot interfere with each other
- **Resource management**: Kernel mediates all hardware access

## Interaction mechanism

```c
// User space code makes system call
int fd = open("/etc/passwd", O_RDONLY);

// Transitions to kernel space
// Kernel validates and executes
// Returns to user space with result
```
