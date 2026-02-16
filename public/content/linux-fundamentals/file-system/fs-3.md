---
id: fs-3
title: /bin and /sbin Directories
type: text
---

## /bin - Essential User Binaries

Contains essential command-line programs needed for basic system operations.

**Common files:**
- `ls` - List directory contents
- `cp` - Copy files
- `mv` - Move/rename files
- `rm` - Remove files
- `cat` - Display file contents
- `bash` - Bash shell
- `pwd` - Print working directory

## /sbin - System Binaries

Contains essential system administration commands, typically used by root user.

**Common files:**
- `fsck` - File system check/repair
- `ifconfig` - Network configuration
- `iptables` - Firewall configuration
- `reboot` - Reboot system
- `shutdown` - Shutdown system
- `fdisk` - Disk partitioning

## Key Differences

| /bin | /sbin |
|------|-------|
| For all users | For system admins |
| Basic commands | System commands |
| e.g., ls, cat | e.g., reboot, fdisk |

## Modern Linux Note

In many modern distributions, `/bin` and `/sbin` are symbolic links to `/usr/bin` and `/usr/sbin`.
