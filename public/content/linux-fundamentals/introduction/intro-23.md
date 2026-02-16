---
id: intro-23
title: Logging and Troubleshooting
type: text
---

## System Logging

Linux maintains detailed logs for troubleshooting and monitoring.

## Log Locations

### Traditional Logs (/var/log/)
- **/var/log/syslog**: Main system log (Debian/Ubuntu)
- **/var/log/messages**: Main system log (RHEL/CentOS)
- **/var/log/auth.log**: Authentication attempts
- **/var/log/kern.log**: Kernel messages
- **/var/log/dmesg**: Boot and hardware messages
- **/var/log/apache2/**: Web server logs
- **/var/log/nginx/**: Nginx logs

### systemd Journal
Modern systems use journalctl:
```bash
# View all logs
journalctl

# Follow logs in real-time
journalctl -f

# Logs since boot
journalctl -b

# Logs for specific service
journalctl -u sshd

# Logs from last hour
journalctl --since "1 hour ago"

# Priority filtering
journalctl -p err
```

## Basic Troubleshooting Steps

1. **Check logs** for error messages
2. **Verify service status**: `systemctl status`
3. **Check disk space**: `df -h`
4. **Check memory**: `free -h`
5. **Review recent changes**: What was installed/configured?
6. **Search online**: Include distribution and error message
