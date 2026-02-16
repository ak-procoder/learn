---
id: cmd-26
title: Command History
type: text
---

Managing command history in bash.

## Command History

Bash saves commands you've entered.

```bash
# View history
history

# View last 20 commands
history 20

# Search history
history | grep keyword

# Show history with timestamps (if enabled)
HISTTIMEFORMAT="%d/%m/%y %T " history
```

## History File

Commands stored in `~/.bash_history`

```bash
# View history file
cat ~/.bash_history

# Clear history
history -c

# Delete specific entry
history -d 123

# Append current session to history file
history -a
```

## History Navigation

**During typing:**
- `↑` / `Ctrl+P` - Previous command
- `↓` / `Ctrl+N` - Next command
- `Ctrl+R` - Reverse search
- `Ctrl+G` - Cancel search

## History Expansion

```bash
# Run last command
!!

# Run command number 123
!123

# Run last command starting with 'git'
!git

# Run last command containing 'file'
!?file

# Last argument of previous command
!$
Alt+.

# All arguments of previous command
!*
```

## Configuration

**In ~/.bashrc:**
```bash
# History size
HISTSIZE=10000
HISTFILESIZE=20000

# Don't save duplicates
HISTCONTROL=ignoredups

# Ignore specific commands
HISTIGNORE="ls:ps:history"

# Append instead of overwrite
shopt -s histappend
```

## Practical Tips

```bash
# Re-run and edit previous command
sudo !!         # Run last command with sudo

# Fix typo in previous command
^typo^correction^

# Search and run
Ctrl+R          # Then type search term
```