---
id: arch-2
title: The Linux Kernel Overview
type: text
---

## What is the kernel?

The kernel is the core component of Linux that acts as a bridge between applications and hardware, managing system resources and providing essential services.

## Kernel responsibilities

- **Process Management**: Creating, scheduling, and terminating processes
- **Memory Management**: Allocating and managing RAM
- **Device Drivers**: Interfacing with hardware devices
- **File System Management**: Organizing and accessing data on storage
- **Network Stack**: Handling network communications
- **Security**: Enforcing access control and permissions

## Monolithic kernel design

- All kernel services run in a single address space
- Components communicate directly without message passing
- Faster than microkernel due to direct function calls
- Modules can be loaded dynamically to extend functionality

## Kernel version numbering

```bash
# Check kernel version
uname -r
# Example output: 5.15.0-76-generic

# Format: MAJOR.MINOR.PATCH-BUILD-VARIANT
```

## Kernel types

- **Mainline**: Official kernel from kernel.org
- **Stable**: Bug fixes for current release
- **Long-term support (LTS)**: Extended maintenance period
- **Distribution kernels**: Modified by distros (Ubuntu, Red Hat, etc.)
