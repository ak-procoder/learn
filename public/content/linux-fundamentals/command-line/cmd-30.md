---
id: cmd-30
title: Command Line Tips and Tricks
type: text
---

Productivity boosters for the command line.

## Keyboard Shortcuts

**Navigation:**
- `Ctrl+A` - Beginning of line
- `Ctrl+E` - End of line
- `Ctrl+B` - Back one character
- `Ctrl+F` - Forward one character
- `Alt+B` - Back one word
- `Alt+F` - Forward one word

**Editing:**
- `Ctrl+U` - Cut to line start
- `Ctrl+K` - Cut to line end
- `Ctrl+W` - Cut previous word
- `Ctrl+Y` - Paste (yank)
- `Ctrl+L` - Clear screen
- `Ctrl+C` - Cancel command
- `Ctrl+D` - Exit shell

**History:**
- `Ctrl+R` - Reverse search
- `Ctrl+P` / `↑` - Previous command
- `Ctrl+N` / `↓` - Next command

## Command Line Tricks

```bash
# Use !! for last command
sudo !!                  # Run last command with sudo

# Use !$ for last argument
mkdir /path/to/dir
cd !$                    # cd /path/to/dir

# Quick backup
cp file.txt{,.bak}       # Creates file.txt.bak

# Range expansion
mkdir test{1..5}         # Creates test1 to test5
touch file{a..e}.txt     # Creates filea.txt to filee.txt

# Multiple extensions
cp file.{txt,md,pdf} /backup/

# Quick rename
mv filename.{old,new}
```

## Auto-Completion

- `Tab` - Complete filename/command
- `Tab Tab` - Show all possibilities
- `Alt+?` - List possible completions
- `Alt+*` - Insert all completions

## Quick Directory Navigation

```bash
cd -             # Go to previous directory
pushd /path      # Push onto directory stack
popd             # Pop from directory stack
dirs             # Show directory stack

# Create bookmark function
bookmark() {
    export $1=$(pwd)
}
go() {
    cd ${!1}
}
# Usage: bookmark work, then: go work
```

## Useful One-Liners

```bash
# Find large files
find / -type f -size +100M 2>/dev/null

# Show directory sizes
du -sh */ | sort -hr

# Monitor file changes
watch -n 1 'ls -lh file.txt'

# Quick HTTP server
python3 -m http.server 8000

# Generate random password
openssl rand -base64 12

# Check which binary is executed
type -a python
```

## Best Practices

1. Always use quotes around variables: `"$VAR"`
2. Use `shellcheck` to validate scripts
3. Test destructive commands with `echo` first
4. Use `#` for comments
5. Make scripts executable: `chmod +x script.sh`
6. Start scripts with shebang: `#!/bin/bash`
7. Enable error handling: `set -e` (exit on error)
8. Practice in safe environments first!
