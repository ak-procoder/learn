---
id: fs-9
title: /dev - Device Files
type: text
---

## /dev - Device Files

The `/dev` directory contains special files that represent hardware devices and virtual devices.

## Types of Device Files

**Block Devices** (b):
- Storage devices accessed in blocks
- `/dev/sda` - First SATA disk
- `/dev/sda1` - First partition on first disk
- `/dev/nvme0n1` - NVMe SSD

**Character Devices** (c):
- Devices accessed character by character
- `/dev/tty` - Terminal devices
- `/dev/null` - Null device (data sink)
- `/dev/random` - Random number generator

## Common Device Files

**Storage:**
- `/dev/sda`, `/dev/sdb` - SATA/SCSI disks
- `/dev/nvme0n1` - NVMe drives
- `/dev/sr0` - CD/DVD drive

**Special Files:**
- `/dev/null` - Discard all data written to it
- `/dev/zero` - Provides null bytes
- `/dev/random` - Random data generator
- `/dev/urandom` - Faster random data

**Terminal:**
- `/dev/tty` - Current terminal
- `/dev/pts/` - Pseudo-terminals

## Using /dev/null

```bash
# Discard command output
command > /dev/null 2>&1

# Discard error output only
command 2> /dev/null
```

## Device Naming Convention

- `sd*` - SCSI/SATA disks
- `nvme*` - NVMe SSDs
- `hd*` - IDE disks (legacy)
- Numbers indicate partitions: `sda1`, `sda2`
