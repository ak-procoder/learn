---
id: fs-4
title: /etc - Configuration Files
type: text
---

## /etc - System Configuration

The `/etc` directory contains system-wide configuration files and shell scripts.

## Important Files

**User/Group Management:**
- `/etc/passwd` - User account information
- `/etc/shadow` - Encrypted passwords
- `/etc/group` - Group information

**System Configuration:**
- `/etc/hostname` - System hostname
- `/etc/hosts` - Static hostname-to-IP mappings
- `/etc/fstab` - File system mount information
- `/etc/resolv.conf` - DNS resolver configuration

**Network:**
- `/etc/network/` - Network configuration
- `/etc/ssh/` - SSH server configuration

**Services:**
- `/etc/cron.d/` - Scheduled tasks
- `/etc/init.d/` - System V init scripts
- `/etc/systemd/` - Systemd configuration

## Key Principles

- Text-based configuration (human-readable)
- Requires root privileges to modify
- Always backup before editing!
- Many files have `.conf` extension

## Example Usage

```bash
# View hostname
cat /etc/hostname

# View user accounts
cat /etc/passwd
```
