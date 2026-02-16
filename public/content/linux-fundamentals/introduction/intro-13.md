---
id: intro-13
title: Root vs Regular Users
type: text
---

## User Types

### Regular User
- Limited permissions
- Can only modify own files
- Cannot install system-wide software
- Cannot change system settings
- Prompt: `$`

### Root (Superuser)
- Complete system control
- Can modify any file
- Can install/remove any software
- Can access all processes
- Prompt: `#`
- **Dangerous**: One wrong command can break system

## Security Model

Linux uses a strict permission system:
- Every file has an owner
- Every process runs as a user
- Users can only affect their own resources
- Root can override all permissions

## Gaining Root Privileges

### sudo (Recommended)
```bash
sudo command_name
```
- Runs single command as root
- Requires user password
- Logged for auditing
- User must be in sudo/wheel group

### su (Switch User)
```bash
su -
```
- Switches to root account
- Requires root password
- Opens root shell (dangerous)

## Best Practices

- Don't run as root normally
- Use sudo for administrative tasks
- Disable root login on servers
- Grant sudo access carefully
