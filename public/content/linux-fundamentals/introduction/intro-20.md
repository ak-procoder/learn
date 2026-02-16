---
id: intro-20
title: The Linux Kernel
type: text
---

## What is the Kernel?

The kernel is the core of the operating system that manages:
- Hardware resources (CPU, memory, devices)
- Process scheduling
- Memory management
- Device drivers
- System calls

## Kernel Architecture

### Monolithic Design
- All core services in kernel space
- Device drivers run in kernel
- Fast performance
- One crash can affect whole system

### Key Components

#### Process Scheduler
- Decides which processes run when
- Manages CPU time allocation
- Supports multi-core scheduling

#### Memory Manager
- Virtual memory management
- Page cache for file system
- Swap management

#### Device Drivers
- Interface between hardware and software
- Block devices (disks)
- Character devices (keyboards, mice)
- Network devices

#### File Systems
- VFS (Virtual File System) layer
- Supports: ext4, XFS, Btrfs, NFS, etc.

#### Networking Stack
- TCP/IP implementation
- Socket interface
- Netfilter (firewall)

## Kernel Versions

Format: `major.minor.patch`
- Example: 6.5.7
- LTS (Long Term Support) versions for stability
- Mainline for latest features
