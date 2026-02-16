---
id: intro-21
title: System Boot Process
type: text
---

## Boot Sequence Overview

Understanding how Linux starts helps troubleshoot boot issues.

## Boot Stages

### 1. BIOS/UEFI
- Power-on self-test (POST)
- Initialize hardware
- Load boot loader from disk

### 2. Boot Loader (GRUB)
- GRUB (Grand Unified Bootloader) is most common
- Displays boot menu
- Loads Linux kernel into memory
- Passes kernel parameters

### 3. Kernel Initialization
- Decompresses itself
- Initializes hardware
- Mounts initial RAM filesystem (initramfs)
- Starts init system

### 4. Init System (systemd)
- First process (PID 1)
- Starts system services
- Mounts filesystems
- Configures network
- Reaches target state (multi-user, graphical)

### 5. Login
- Display manager (graphical) or getty (text)
- User authentication
- Start user session

## Boot Targets/Runlevels

- **multi-user.target**: Text mode, full system
- **graphical.target**: GUI desktop
- **rescue.target**: Single-user maintenance mode
- **emergency.target**: Minimal emergency shell
