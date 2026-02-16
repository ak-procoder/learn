---
id: arch-28
title: Boot Process - Kernel and initramfs
type: text
---

## Stage 3: Kernel initialization

After bootloader loads kernel into memory:

1. **Decompress kernel**: Kernel is compressed (bzImage)
2. **CPU initialization**: Set up CPU mode, memory
3. **Memory setup**: Initialize memory management
4. **Interrupt handlers**: Set up interrupt descriptor table
5. **Device detection**: Probe for hardware
6. **Mount root**: Temporary root filesystem

## Kernel boot messages

```bash
# View kernel boot messages
dmesg | less

# Boot log since last boot
journalctl -b

# Kernel ring buffer
cat /proc/kmsg

# Boot time
systemd-analyze

# Critical path analysis
systemd-analyze critical-chain
```

## Stage 4: initramfs

Initial RAM filesystem provides:
- **Minimal root filesystem**: Temporary environment
- **Essential drivers**: Storage, filesystem modules
- **Device detection**: Find root partition
- **Root mounting**: Mount actual root filesystem
- **Pivot root**: Switch to real root

```bash
# List initramfs contents
lsinitramfs /boot/initrd.img-$(uname -r)

# Rebuild initramfs
sudo update-initramfs -u

# Create new initramfs
sudo mkinitramfs -o /boot/initrd.img-$(uname -r)
```

## Kernel command line

```bash
# View boot parameters
cat /proc/cmdline

# Example parameters
# root=/dev/sda1 ro quiet splash
```
