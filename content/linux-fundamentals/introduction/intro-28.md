---
id: intro-28
title: Environment Variables
type: text
---

## What are Environment Variables?

Environment variables are dynamic values that affect running processes and programs.

## Viewing Variables

```bash
# View all environment variables
env
printenv

# View specific variable
echo $HOME
echo $PATH
printenv HOME
```

## Common Environment Variables

- **$HOME**: User's home directory
- **$USER**: Current username
- **$PATH**: Directories to search for commands
- **$SHELL**: Current shell program
- **$PWD**: Current working directory
- **$LANG**: System language/locale
- **$EDITOR**: Default text editor
- **$TERM**: Terminal type

## Setting Variables

### Temporary (Current Session)
```bash
# Set variable
MYVAR="Hello World"
echo $MYVAR

# Export for child processes
export MYVAR="Hello World"
```

### Permanent (Shell Configuration)

Add to `~/.bashrc` or `~/.bash_profile`:
```bash
export EDITOR=vim
export PATH="$HOME/bin:$PATH"
```

Then reload:
```bash
source ~/.bashrc
```

## PATH Variable

The most important variable - defines where to find commands:
```bash
# View current PATH
echo $PATH

# Add directory to PATH
export PATH="$HOME/scripts:$PATH"
```

Directories are separated by colons (:)
System searches left to right
