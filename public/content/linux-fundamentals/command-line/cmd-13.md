---
id: cmd-13
title: find Command - Advanced
type: text
---

Advanced file finding techniques.

## Find by Multiple Criteria

```bash
# .txt files larger than 1MB
find . -name "*.txt" -size +1M

# Modified in last 7 days, owned by user
find /home -mtime -7 -user alice

# Files with specific permissions
find . -type f -perm 644

# Executable files
find /usr/bin -type f -executable
```

## Execute Actions on Results

```bash
# Delete found files
find . -name "*.tmp" -delete

# Execute command on each file
find . -name "*.log" -exec gzip {} \;

# Confirm before executing
find . -name "*.bak" -ok rm {} \;

# Use with xargs (more efficient)
find . -name "*.txt" | xargs wc -l
```

## Complex Searches

```bash
# OR condition
find . \( -name "*.txt" -o -name "*.md" \)

# AND with NOT
find . -name "*.log" ! -path "*/archive/*"

# By inode number
find . -inum 12345
```