---
id: cmd-10
title: Text Processing - sed and awk
type: text
---

## sed - Stream Editor

Perform text transformations.

## Basic sed Usage

```bash
# Substitute first occurrence
sed 's/old/new/' file.txt

# Substitute all occurrences
sed 's/old/new/g' file.txt

# Edit file in-place
sed -i 's/old/new/g' file.txt

# Edit with backup
sed -i.bak 's/old/new/g' file.txt
```

## sed Examples

```bash
# Delete lines containing pattern
sed '/pattern/d' file.txt

# Delete lines 2-5
sed '2,5d' file.txt

# Print only matching lines
sed -n '/pattern/p' file.txt

# Replace only on specific line
sed '3s/old/new/' file.txt

# Multiple operations
sed -e 's/foo/bar/g' -e 's/hello/hi/g' file.txt
```

## awk - Pattern Scanning

Powerful text processing language.

## Basic awk Usage

```bash
# Print specific columns
awk '{print $1}' file.txt      # First column
awk '{print $1, $3}' file.txt  # First and third

# With field separator
awk -F: '{print $1}' /etc/passwd

# Print lines matching pattern
awk '/pattern/' file.txt

# Combination
awk '/error/ {print $1, $4}' log.txt
```

## awk Examples

```bash
# Sum column
awk '{sum += $1} END {print sum}' numbers.txt

# Calculate average
awk '{sum+=$1; count++} END {print sum/count}' data.txt

# Print if column value matches
awk '$3 > 100' file.txt

# Format output
awk '{printf "Name: %s, Age: %d\n", $1, $2}' file.txt

# Count lines
awk 'END {print NR}' file.txt
```
