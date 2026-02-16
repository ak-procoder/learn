---
id: arch-5
title: Loadable Kernel Modules (LKM)
type: text
---

## What are kernel modules?

Loadable Kernel Modules are pieces of code that can be loaded into or unloaded from the kernel at runtime without rebooting the system.

## Module advantages

- **Dynamic loading**: Add functionality without recompilation
- **Memory efficiency**: Load only needed drivers
- **Easy development**: Test drivers without rebooting
- **Flexibility**: Enable/disable features on demand

## Common module types

- **Device drivers**: Hardware interface modules
- **File systems**: Support for different FS types
- **Network protocols**: Additional networking features
- **Security modules**: SELinux, AppArmor
- **Cryptographic modules**: Encryption algorithms

## Working with modules

```bash
# List loaded modules
lsmod

# Load a module
sudo modprobe module_name

# Remove a module
sudo modprobe -r module_name

# Get module information
modinfo module_name

# Show module parameters
systool -v -m module_name
```

## Module dependencies

- Modules can depend on other modules
- `modprobe` automatically loads dependencies
- Configuration in `/etc/modprobe.d/`
- Module files located in `/lib/modules/$(uname -r)/`
