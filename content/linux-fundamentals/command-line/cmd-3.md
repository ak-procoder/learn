---
id: cmd-3
title: The Bash Shell
type: text
---

## What is Bash?

Bash (Bourne Again Shell) is the default command-line interpreter on most Linux distributions.

## Shell Prompt

The prompt shows information and waits for input:

```bash
user@hostname:~$
```

Components:
- `user` - Current username
- `hostname` - Computer name
- `~` - Current directory (~ means home)
- `$` - Regular user (`#` for root)

## Environment Variables

**Common variables:**
```bash
# View variable
echo $HOME        # Your home directory
echo $USER        # Your username
echo $PATH        # Command search paths
echo $SHELL       # Current shell

# Set variable
MYVAR="Hello"
echo $MYVAR

# Export for subprocesses
export MYVAR="Hello"
```

## PATH Variable

Directories where shell looks for commands:

```bash
# View PATH
echo $PATH
# Output: /usr/local/bin:/usr/bin:/bin

# Add to PATH temporarily
export PATH=$PATH:/new/directory

# Add permanently (in ~/.bashrc)
echo 'export PATH=$PATH:/new/directory' >> ~/.bashrc
```

## Shell Configuration Files

**Login shells:**
- `/etc/profile` - System-wide
- `~/.bash_profile` - User-specific
- `~/.profile` - Alternative

**Interactive shells:**
- `/etc/bash.bashrc` - System-wide
- `~/.bashrc` - User-specific (most common)

## Useful Bash Features

**Tab completion:**
- Press Tab to autocomplete
- Double Tab to see options

**Command history:**
- ↑/↓ arrows to navigate history
- `history` - View command history
- `!n` - Run command number n
- `!!` - Run last command

**Keyboard shortcuts:**
- `Ctrl+C` - Cancel current command
- `Ctrl+D` - Exit shell
- `Ctrl+L` - Clear screen
- `Ctrl+A` - Move to line start
- `Ctrl+E` - Move to line end
