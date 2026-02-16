---
id: intro-22
title: System Services and Daemons
type: text
---

## What are Daemons?

Daemons are background processes that run continuously, providing services without user interaction.

### Common Characteristics
- Start at boot
- Run in background
- Often end with 'd' (sshd, httpd, systemd)
- No controlling terminal
- Respond to events or requests

## Service Management (systemd)

### Managing Services
```bash
# Start a service
systemctl start service_name

# Stop a service
systemctl stop service_name

# Restart a service
systemctl restart service_name

# Enable at boot
systemctl enable service_name

# Disable at boot
systemctl disable service_name

# Check status
systemctl status service_name
```

### Viewing Services
```bash
# List all services
systemctl list-units --type=service

# List enabled services
systemctl list-unit-files --type=service --state=enabled

# View logs
journalctl -u service_name
```

## Common System Daemons

- **sshd**: Secure Shell daemon
- **cron**: Scheduled task daemon
- **systemd-networkd**: Network configuration
- **rsyslog**: System logging
- **dbus**: Inter-process communication
