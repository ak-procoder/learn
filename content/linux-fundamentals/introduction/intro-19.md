---
id: intro-19
title: Linux Security Model
type: text
---

## Security by Design

Linux inherits Unix's security-first architecture:

### Multi-User Isolation
- Each user has separate space
- Processes run with user's permissions
- Users can't access others' data without permission

### Privilege Separation
- Regular users have limited access
- Administrative tasks require elevation (sudo)
- Principle of least privilege

### File Permissions
- Granular control (owner, group, others)
- Execute permission prevents accidental code execution
- No concept of "file extension determines behavior"

## Security Features

### SELinux / AppArmor
- Mandatory Access Control (MAC)
- Confines programs to specific resources
- Additional layer beyond traditional permissions

### Firewall
- **iptables/nftables**: Kernel-level packet filtering
- **ufw**: User-friendly firewall interface
- **firewalld**: Dynamic firewall management

### SSH (Secure Shell)
- Encrypted remote access
- Key-based authentication
- Industry standard for server management

## Security Best Practices

- Keep system updated
- Use strong passwords
- Disable root SSH login
- Run only necessary services
- Regular backups
- Monitor logs for suspicious activity
