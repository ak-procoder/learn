---
id: intro-12
title: Linux Directory Structure
type: text
---

## Filesystem Hierarchy Standard (FHS)

Linux uses a hierarchical directory structure starting from root (/)

## Top-Level Directories

### Essential Directories
- **/**: Root directory, top of the hierarchy
- **/bin**: Essential user command binaries
- **/boot**: Boot loader files, kernel
- **/etc**: System configuration files
- **/home**: User home directories
- **/root**: Root user's home directory

### System Directories
- **/dev**: Device files (hardware representations)
- **/proc**: Process and kernel information
- **/sys**: System and device information
- **/tmp**: Temporary files (cleared on reboot)

### Program Directories
- **/usr**: User programs and data (largest directory)
- **/usr/bin**: User commands
- **/usr/lib**: Libraries for programs
- **/usr/share**: Shared data (documentation, icons)
- **/opt**: Optional/third-party software

### Variable Data
- **/var**: Variable data (logs, caches, databases)
- **/var/log**: System and application logs

## Key Concepts

Everything starts from / (no drive letters like C: or D:)
