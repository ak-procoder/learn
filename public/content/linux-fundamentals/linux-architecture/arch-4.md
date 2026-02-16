---
id: arch-4
title: Kernel Components Overview
type: text
---

## Major kernel subsystems

The Linux kernel consists of several interconnected subsystems, each responsible for specific functionality.

## Process scheduler

- Decides which process runs when
- Implements various scheduling algorithms (CFS, real-time)
- Manages CPU time allocation
- Handles process priorities and nice values

## Memory manager

- Virtual memory management
- Page allocation and deallocation
- Swap space management
- Memory mapping and protection

## Virtual File System (VFS)

- Abstraction layer for different file systems
- Provides common interface for file operations
- Supports ext4, XFS, Btrfs, FAT, NTFS, and more
- Manages inodes, dentries, and file descriptors

## Network subsystem

- Protocol stack implementation (TCP/IP)
- Socket interface
- Network device drivers
- Packet filtering and routing

## Inter-Process Communication (IPC)

- Signals, pipes, message queues
- Shared memory
- Semaphores
- Unix domain sockets
