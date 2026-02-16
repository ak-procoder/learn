---
id: cmd-29
title: Command Chaining and Substitution
type: text
---

Combine and nest commands.

## Command Chaining

**Semicolon (;)** - Run commands sequentially:
```bash
cd /tmp ; ls ; pwd
```

**AND (&&)** - Run next only if previous succeeds:
```bash
mkdir newdir && cd newdir && touch file.txt
```

**OR (||)** - Run next only if previous fails:
```bash
command || echo "Command failed"
```

**Combine && and ||:**
```bash
make && echo "Success" || echo "Failed"
```

## Command Grouping

**Subshell ( )** - Run in subprocess:
```bash
(cd /tmp && ls)     # Returns to original directory after
pwd                 # Still in original directory
```

**Group { }** - Run in current shell:
```bash
{ cd /tmp && ls; }  # Stays in /tmp
pwd                 # Now in /tmp
```

## Command Substitution

**Backticks or $( )** - Use command output as input:

```bash
# Modern syntax (preferred)
echo "Today is $(date)"
files=$(ls *.txt)

# Old syntax (backticks)
echo "Today is `date`"
files=`ls *.txt`
```

## Practical Examples

```bash
# Create dated backup
cp file.txt file-$(date +%Y%m%d).txt

# Count files
echo "Found $(ls -1 | wc -l) files"

# Install if missing
command -v htop &> /dev/null || sudo apt install htop

# Nested substitution
grep "error" $(find . -name "*.log")

# Process substitution
diff <(ls dir1) <(ls dir2)

# Multiple commands with status check
cd /var/log && grep ERROR *.log > /tmp/errors.txt &&     echo "Found $(wc -l < /tmp/errors.txt) errors"
```