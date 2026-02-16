---
id: fs-5
title: /home - User Home Directories
type: text
---

## /home - User Space

The `/home` directory contains home directories for all regular users.

## Structure

```
/home/
├── alice/
│   ├── Documents/
│   ├── Downloads/
│   ├── .bashrc
│   └── .ssh/
├── bob/
│   ├── Desktop/
│   └── Pictures/
└── charlie/
    └── Music/
```

## User Home Directory

Each user has their own directory: `/home/username`

**Special Environment Variable:**
- `$HOME` or `~` represents current user's home
- `~alice` represents alice's home directory

## What's in a Home Directory?

**Visible Directories:**
- Desktop, Documents, Downloads, Pictures, Music, Videos

**Hidden Configuration Files** (start with `.`):
- `.bashrc` - Bash configuration
- `.bash_history` - Command history
- `.ssh/` - SSH keys and config
- `.vimrc` - Vim editor config
- `.profile` - User profile settings

## Permissions

- Users have full control over their home directory
- Other users typically cannot access it
- Root can always access any home directory

## Navigation

```bash
cd ~        # Go to your home
cd          # Also goes to home (shortcut)
cd ~bob     # Go to bob's home (if permitted)
```
