---
id: arch-29
title: systemd - System and Service Manager
type: text
---

## What is systemd?

systemd is the modern init system and service manager for Linux, responsible for bootstrapping user space and managing system services.

## systemd responsibilities

- **Process 1 (init)**: First user space process
- **Service management**: Start, stop, restart services
- **Dependency resolution**: Manage service dependencies
- **Parallel startup**: Speed up boot process
- **Socket activation**: On-demand service starting
- **Device management**: Integrate with udev
- **Logging**: Centralized logging (journald)

## systemd concepts

**Units**: Configuration objects
- **Service units** (.service): Daemons and processes
- **Target units** (.target): Groups of units
- **Mount units** (.mount): Filesystem mounts
- **Socket units** (.socket): IPC sockets
- **Timer units** (.timer): Scheduled tasks

**Targets**: System states
- `multi-user.target`: Multi-user text mode
- `graphical.target`: Graphical interface
- `rescue.target`: Single-user recovery mode
- `emergency.target`: Minimal emergency mode

## Basic systemd commands

```bash
# Service management
systemctl start service_name
systemctl stop service_name
systemctl restart service_name
systemctl status service_name

# Enable/disable services
systemctl enable service_name   # Start at boot
systemctl disable service_name

# List units
systemctl list-units
systemctl list-unit-files
```
