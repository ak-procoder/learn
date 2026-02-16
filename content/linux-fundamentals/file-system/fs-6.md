---
id: fs-6
title: /var - Variable Data
type: text
---

## /var - Variable Files

The `/var` directory contains files that are expected to grow or change during system operation.

## Key Subdirectories

**Logs:**
- `/var/log/` - System and application logs
- `/var/log/syslog` - General system log
- `/var/log/auth.log` - Authentication log
- `/var/log/apache2/` - Web server logs

**Cache:**
- `/var/cache/` - Application cache data
- `/var/cache/apt/` - Package manager cache

**Mail:**
- `/var/mail/` or `/var/spool/mail/` - User mail

**Web Server:**
- `/var/www/` - Web server content (Apache, Nginx)
- `/var/www/html/` - Default website root

**Temporary Files:**
- `/var/tmp/` - Temporary files preserved between reboots

**Packages:**
- `/var/lib/` - State information for packages
- `/var/lib/dpkg/` - Debian package database

## Why /var Matters

- **Troubleshooting**: Logs help diagnose problems
- **Monitoring**: Track system and application activity
- **Growth**: Can grow large, may need separate partition
- **Maintenance**: Regular cleanup may be needed

## Example Usage

```bash
# View recent system logs
tail -f /var/log/syslog

# Check web server logs
ls /var/log/apache2/
```
