---
id: fs-1
title: Linux File System Overview
type: text
---

## What is a File System?

A file system is a method of organizing and storing files on storage devices. Linux uses a hierarchical file system structure.

## Key Characteristics

- **Everything is a file**: Devices, directories, processes appear as files
- **Single root directory**: All files branch from `/` (root)
- **Case-sensitive**: `File.txt` and `file.txt` are different
- **No drive letters**: Unlike Windows (C:, D:), Linux has one unified tree

## File System Types

- **ext4**: Most common Linux file system
- **XFS**: High-performance file system
- **Btrfs**: Modern copy-on-write file system
- **FAT32/NTFS**: For compatibility with Windows
- **tmpfs**: Temporary file system in RAM

## Hierarchical Structure

```
/
├── bin/
├── etc/
├── home/
├── usr/
└── var/
```
