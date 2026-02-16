---
id: cmd-9
title: grep - Pattern Searching
type: text
---

## grep - Search Text Patterns

Search for patterns in files or output.

## Basic Usage

```bash
# Search for pattern in file
grep "pattern" file.txt

# Search in multiple files
grep "error" *.log

# Search recursively in directory
grep -r "TODO" project/

# Case-insensitive search
grep -i "error" log.txt
```

## Common Options

```bash
# Show line numbers
grep -n "pattern" file.txt

# Count matches
grep -c "error" log.txt

# Invert match (lines NOT containing pattern)
grep -v "debug" log.txt

# Show only matching part
grep -o "error.*" log.txt

# Show context (before/after lines)
grep -A 3 "error" log.txt  # 3 lines after
grep -B 2 "error" log.txt  # 2 lines before
grep -C 5 "error" log.txt  # 5 lines before and after
```

## Regular Expressions

```bash
# Beginning of line
grep "^Error" log.txt

# End of line
grep "failed$" log.txt

# Any character
grep "er.or" file.txt

# Multiple characters
grep "err*" file.txt

# Character range
grep "[0-9]" file.txt

# Extended regex
grep -E "error|warning|critical" log.txt
```

## Practical Examples

```bash
# Find IP addresses
grep -E "[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}" log.txt

# Find emails
grep -E "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}" file.txt

# Find errors in logs
grep -i "error\|fail\|critical" /var/log/syslog

# Search code for function
grep -rn "function myFunc" src/
```
