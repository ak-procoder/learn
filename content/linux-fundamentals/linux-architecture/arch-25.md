---
id: arch-25
title: udev and Device Management
type: text
---

## What is udev?

udev is the Linux device manager responsible for dynamically creating device nodes, handling hotplug events, and managing device permissions.

## udev responsibilities

- **Dynamic /dev**: Creates device files as hardware is detected
- **Persistent naming**: Consistent device names across reboots
- **Permission management**: Sets ownership and permissions
- **Event handling**: Runs scripts on device events
- **Symlink creation**: Friendly device names

## udev rules

Rules located in:
- `/lib/udev/rules.d/` - System rules
- `/etc/udev/rules.d/` - Custom rules (override system)

Example rule for USB device:
```
# /etc/udev/rules.d/99-usb-custom.rules
SUBSYSTEM=="usb", ATTR{idVendor}=="1234", ATTR{idProduct}=="5678", \
    SYMLINK+="mydevice", MODE="0666", GROUP="users"
```

## udev commands

```bash
# Monitor udev events in real-time
udevadm monitor

# Trigger udev events
sudo udevadm trigger

# Query device information
udevadm info /dev/sda

# Test rule matching
udevadm test /sys/class/net/eth0

# Reload udev rules
sudo udevadm control --reload-rules
```

## Device information

```bash
# List all block devices
lsblk

# PCI devices
lspci -v

# USB devices
lsusb -v

# Hardware info
sudo lshw
```
