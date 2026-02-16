---
id: cmd-27
title: Aliases and Functions
type: text
---

Create shortcuts for commands.

## Aliases - Command Shortcuts

```bash
# Create alias (temporary)
alias ll='ls -la'
alias gs='git status'

# List all aliases
alias

# Remove alias
unalias ll

# Make alias permanent (add to ~/.bashrc)
echo "alias ll='ls -la'" >> ~/.bashrc
source ~/.bashrc
```

## Common Useful Aliases

```bash
# Safety aliases
alias rm='rm -i'
alias cp='cp -i'
alias mv='mv -i'

# Shortcuts
alias c='clear'
alias h='history'
alias ..='cd ..'
alias ...='cd ../..'

# ls variations
alias ll='ls -alF'
alias la='ls -A'
alias l='ls -CF'

# System
alias update='sudo apt update && sudo apt upgrade'
alias ports='netstat -tulanp'

# Git shortcuts
alias gs='git status'
alias ga='git add'
alias gc='git commit'
alias gp='git push'
```

## Shell Functions

More powerful than aliases:

```bash
# Define function
mcd() {
    mkdir -p "$1"
    cd "$1"
}

# Function with multiple commands
extract() {
    if [ -f "$1" ]; then
        case "$1" in
            *.tar.bz2)   tar xjf "$1"   ;;
            *.tar.gz)    tar xzf "$1"   ;;
            *.bz2)       bunzip2 "$1"   ;;
            *.gz)        gunzip "$1"    ;;
            *.zip)       unzip "$1"     ;;
            *)           echo "Unknown format" ;;
        esac
    fi
}

# Add to ~/.bashrc for permanence
```

## Practical Functions

```bash
# Backup file
bu() {
    cp "$1" "$1.backup-$(date +%Y%m%d)"
}

# Find and grep
fgrep() {
    find . -type f -exec grep -l "$1" {} \;
}

# Quick note
note() {
    echo "$(date): $*" >> ~/notes.txt
}
```