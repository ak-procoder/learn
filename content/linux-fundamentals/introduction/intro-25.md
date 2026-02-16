---
id: intro-25
title: Remote Access with SSH
type: text
---

## SSH (Secure Shell)

SSH provides encrypted remote access to Linux systems over the network.

## Basic SSH Usage

### Connecting to Remote System
```bash
# Basic connection
ssh username@hostname

# Connect to specific port
ssh -p 2222 username@hostname

# Run single command remotely
ssh username@hostname "ls -la"
```

### SSH Keys (Recommended)

#### Generate Key Pair
```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```

#### Copy Public Key to Server
```bash
ssh-copy-id username@hostname
```

#### Connect Without Password
```bash
ssh username@hostname
# No password needed!
```

## SSH Configuration

### Client Config (~/.ssh/config)
```
Host myserver
    HostName 192.168.1.100
    User admin
    Port 22
    IdentityFile ~/.ssh/id_ed25519
```

Then connect simply:
```bash
ssh myserver
```

### Server Config (/etc/ssh/sshd_config)
Security settings:
- Disable root login: `PermitRootLogin no`
- Disable password auth: `PasswordAuthentication no`
- Change default port: `Port 2222`

## File Transfer with SCP/SFTP

```bash
# Copy file to remote
scp file.txt username@hostname:/path/

# Copy from remote
scp username@hostname:/path/file.txt .

# Interactive file transfer
sftp username@hostname
```
