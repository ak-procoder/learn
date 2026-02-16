---
id: fs-8
title: /tmp - Temporary Files
type: text
---

## /tmp - Temporary Storage

The `/tmp` directory stores temporary files created by users and applications.

## Key Characteristics

**Automatic Cleanup:**
- Files may be deleted on reboot
- System may clean old files automatically
- Not suitable for long-term storage

**Permissions:**
- World-writable (any user can write)
- Sticky bit set (users can only delete own files)
- Permission: `drwxrwxrwt` (note the `t`)

**Use Cases:**
- Temporary download files
- Application working files
- Script intermediate data
- Build artifacts

## Best Practices

**DO:**
- Use for truly temporary data
- Clean up your own temporary files
- Use unique filenames to avoid conflicts

**DON'T:**
- Store important data
- Assume files will persist
- Store sensitive data without encryption

## tmpfs - Temporary File System

Many modern systems mount `/tmp` as `tmpfs` (in RAM):
- Extremely fast
- Cleared on reboot
- Limited by available RAM
- Check with: `df -h /tmp`

## Example Usage

```bash
# Create temporary file
mktemp /tmp/myfile.XXXXXX

# Work with temp directory
cd /tmp
ls -la

# Manual cleanup
rm /tmp/myfile*
```
