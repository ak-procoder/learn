---
id: fs-2
title: The Root Directory (/)
type: text
---

## The Root of Everything

The `/` (root) directory is the top-level directory in Linux. All other directories and files branch from here.

## Important Distinction

- **Root directory** `/`: Top of file system
- **Root user's home** `/root`: Home directory for root user
- **Regular user's home** `/home/username`: Home for regular users

## Visualizing the Root

```
/                    ← Root directory
├── bin/            ← Essential binaries
├── boot/           ← Boot loader files
├── dev/            ← Device files
├── etc/            ← Configuration files
├── home/           ← User home directories
├── lib/            ← System libraries
├── mnt/            ← Mount points
├── opt/            ← Optional software
├── proc/           ← Process information
├── root/           ← Root user home
├── sbin/           ← System binaries
├── tmp/            ← Temporary files
├── usr/            ← User programs
└── var/            ← Variable data
```

## Navigation

- Use `cd /` to go to root directory
- Use `ls /` to list root contents
