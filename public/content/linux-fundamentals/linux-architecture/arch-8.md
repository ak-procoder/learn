---
id: arch-8
title: Kernel Parameters and Tuning
type: text
---

## Kernel parameters

Runtime parameters that control kernel behavior without recompilation.

## Viewing parameters

```bash
# View all kernel parameters
sysctl -a

# View specific parameter
sysctl kernel.hostname

# Kernel parameters via /proc
cat /proc/sys/kernel/hostname

# Boot parameters
cat /proc/cmdline
```

## Setting parameters

```bash
# Temporary (until reboot)
sudo sysctl -w net.ipv4.ip_forward=1

# Persistent configuration
sudo nano /etc/sysctl.conf
# Add: net.ipv4.ip_forward = 1

# Apply changes
sudo sysctl -p
```

## Important parameter categories

- **kernel.***: Core kernel settings (panic, threads-max)
- **vm.***: Virtual memory tuning (swappiness, dirty_ratio)
- **net.***: Network stack configuration
- **fs.***: File system limits (file-max, inode-max)

## Common tuning examples

```bash
# Increase file descriptors
fs.file-max = 2097152

# Reduce swap usage
vm.swappiness = 10

# Enable IP forwarding
net.ipv4.ip_forward = 1

# Increase network buffer sizes
net.core.rmem_max = 134217728
net.core.wmem_max = 134217728
```
