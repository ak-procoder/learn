---
id: arch-7
title: Kernel Configuration and Compilation
type: text
---

## Kernel configuration

Before compiling, the kernel must be configured to include desired features and drivers.

## Configuration methods

```bash
# Text-based menu interface
make menuconfig

# Graphical configuration (Qt)
make xconfig

# Older graphical interface (GTK)
make gconfig

# Use current system config
cp /boot/config-$(uname -r) .config
make oldconfig
```

## Configuration options

- **Built-in (Y)**: Compiled into kernel image
- **Module (M)**: Compiled as loadable module
- **Excluded (N)**: Not included in build

## Compilation process

```bash
# Configure kernel
make menuconfig

# Compile kernel (use all CPU cores)
make -j$(nproc)

# Compile modules
make modules

# Install modules
sudo make modules_install

# Install kernel
sudo make install

# Update bootloader
sudo update-grub
```

## Optimization flags

- **Processor type**: Optimize for specific CPU
- **Preemption model**: Desktop, server, or real-time
- **Timer frequency**: 100Hz, 250Hz, 1000Hz
- **Debug options**: Enable or disable debugging
