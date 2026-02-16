---
id: intro-14
title: File Permissions Introduction
type: text
---

## Permission Model

Every file and directory has three types of permissions for three categories of users.

## Permission Types

- **r (read)**: View file contents or list directory
- **w (write)**: Modify file or add/remove files in directory
- **x (execute)**: Run file as program or enter directory

## User Categories

- **Owner (u)**: The user who owns the file
- **Group (g)**: Users in the file's group
- **Others (o)**: Everyone else

## Reading Permissions

```bash
ls -l file.txt
-rw-r--r-- 1 user group 1234 Jan 15 10:30 file.txt
```

Breaking down: `-rw-r--r--`
- First `-`: File type (- = regular file, d = directory)
- `rw-`: Owner can read and write
- `r--`: Group can only read
- `r--`: Others can only read

## Common Permission Patterns

- **644** (`rw-r--r--`): Regular files (owner writes, others read)
- **755** (`rwxr-xr-x`): Executable files, directories
- **700** (`rwx------`): Private files (owner only)
- **777** (`rwxrwxrwx`): Everyone can do everything (dangerous!)
