---
id: arch-30
title: System Initialization and Services
type: text
---

## systemd boot targets

Boot targets define system states and dependencies:

```bash
# View default target
systemctl get-default

# Set default target
sudo systemctl set-default multi-user.target
sudo systemctl set-default graphical.target

# Switch to target
sudo systemctl isolate rescue.target

# List active target
systemctl list-units --type=target
```

## Service unit files

Located in:
- `/lib/systemd/system/` - System packages
- `/etc/systemd/system/` - Local customizations

Example service file:
```ini
[Unit]
Description=My Application
After=network.target

[Service]
Type=simple
User=myuser
ExecStart=/usr/bin/myapp
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
```

## Creating custom service

```bash
# Create service file
sudo nano /etc/systemd/system/myapp.service

# Reload systemd
sudo systemctl daemon-reload

# Enable and start
sudo systemctl enable myapp
sudo systemctl start myapp

# Check status
systemctl status myapp

# View logs
journalctl -u myapp -f
```

## System analysis

```bash
# Boot time analysis
systemd-analyze
systemd-analyze blame
systemd-analyze critical-chain

# List failed services
systemctl --failed

# Dependency tree
systemctl list-dependencies
```
