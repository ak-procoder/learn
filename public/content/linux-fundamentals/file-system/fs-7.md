---
id: fs-7
title: /usr - User Programs
type: text
---

## /usr - Unix System Resources

The `/usr` directory contains user utilities and applications. Despite the name, it's not for user files.

## Major Subdirectories

**Binaries:**
- `/usr/bin/` - Most user commands and applications
- `/usr/sbin/` - Non-essential system binaries
- `/usr/local/bin/` - Locally installed software

**Libraries:**
- `/usr/lib/` - Libraries for binaries in /usr/bin and /usr/sbin
- `/usr/local/lib/` - Libraries for local software

**Documentation:**
- `/usr/share/doc/` - Documentation for installed packages
- `/usr/share/man/` - Manual pages
- `/usr/share/info/` - GNU Info documents

**Source Code:**
- `/usr/src/` - Source code (kernel sources, headers)

**Shared Data:**
- `/usr/share/` - Architecture-independent data
- `/usr/share/applications/` - Desktop application entries
- `/usr/share/icons/` - Icons
- `/usr/share/fonts/` - Fonts

## /usr/local - Locally Installed Software

Software compiled from source or installed manually typically goes here:
```
/usr/local/
├── bin/
├── lib/
├── share/
└── src/
```

## Size Consideration

`/usr` is typically the largest directory, containing most programs and shared files.
