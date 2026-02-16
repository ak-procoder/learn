---
id: arch-6
title: Kernel Source Code Structure
type: text
---

## Linux kernel source tree

The kernel source code is organized into logical directories, each containing related functionality.

## Key directories

- **arch/**: Architecture-specific code (x86, ARM, etc.)
- **drivers/**: Device drivers for hardware
- **fs/**: File system implementations
- **kernel/**: Core kernel code (scheduler, signals)
- **mm/**: Memory management code
- **net/**: Networking subsystem
- **include/**: Header files
- **lib/**: Library routines and helper functions
- **init/**: Kernel initialization code
- **ipc/**: Inter-process communication

## Important subdirectories

```
drivers/
├── block/      # Block device drivers
├── char/       # Character device drivers
├── net/        # Network device drivers
├── gpu/        # Graphics drivers
├── usb/        # USB drivers
└── scsi/       # SCSI drivers
```

## Configuration files

- **Kconfig**: Menu configuration system
- **Makefile**: Build system rules
- **.config**: Current kernel configuration

## Exploring kernel source

```bash
# Download kernel source
apt-get source linux-image-$(uname -r)

# Or from kernel.org
wget https://cdn.kernel.org/pub/linux/kernel/v5.x/linux-5.15.tar.xz
```
