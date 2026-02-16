---
id: arch-23
title: Device Drivers Overview
type: text
---

## What are device drivers?

Device drivers are kernel modules that enable the operating system to communicate with hardware devices, abstracting hardware-specific details.

## Driver types

**Character drivers**:
- Serial data streams
- Examples: terminals, serial ports, mice, keyboards
- Read/write byte by byte
- No buffering in kernel

**Block drivers**:
- Random access to data blocks
- Examples: hard drives, SSDs, USB drives, SD cards
- Read/write in blocks (512B, 4KB)
- Buffered and cached by kernel

**Network drivers**:
- Network interfaces
- Examples: Ethernet, WiFi, Bluetooth
- Packet-based communication
- Asynchronous I/O

## Device files

Located in /dev directory, device files provide user space interface:

```bash
# List block devices
ls -l /dev/sd* /dev/nvme*

# List character devices
ls -l /dev/tty* /dev/input/*

# View device type (b=block, c=character)
ls -l /dev/sda
brw-rw---- 1 root disk 8, 0 Feb 16 /dev/sda
#  ^                    ^  ^
#  |                    |  |
# type            major_num minor_num

# Create device file (rarely needed)
sudo mknod /dev/mydevice c 250 0
```
