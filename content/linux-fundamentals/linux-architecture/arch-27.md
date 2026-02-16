---
id: arch-27
title: Boot Process - BIOS to Kernel
type: text
---

## Linux boot sequence

The boot process involves several stages from power-on to running system.

## Boot stages overview

```
Power On
    ↓
BIOS/UEFI (Firmware)
    ↓
Bootloader (GRUB2)
    ↓
Kernel Loading
    ↓
initramfs
    ↓
Init System (systemd)
    ↓
User Space
```

## Stage 1: BIOS/UEFI

**BIOS (Legacy)**:
- Power-On Self Test (POST)
- Initialize hardware
- Load MBR (Master Boot Record) from disk
- Execute bootloader from MBR (512 bytes)

**UEFI (Modern)**:
- More features than BIOS
- Secure Boot capability
- Loads bootloader from EFI System Partition (ESP)
- Supports larger disks (GPT)

## Stage 2: Bootloader (GRUB2)

GRUB (GRand Unified Bootloader) responsibilities:
- Display boot menu
- Load kernel image into memory
- Pass boot parameters to kernel
- Load initial RAM disk (initramfs/initrd)

```bash
# View GRUB configuration
cat /boot/grub/grub.cfg

# Edit GRUB defaults
sudo nano /etc/default/grub
sudo update-grub

# Common boot parameters
quiet splash acpi=off nomodeset
```
