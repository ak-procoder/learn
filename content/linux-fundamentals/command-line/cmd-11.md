---
id: cmd-11
title: sort and uniq Commands
type: text
---

Sort and remove duplicate lines from files.

## sort - Sort Lines

```bash
# Sort file alphabetically
sort file.txt

# Sort numerically
sort -n numbers.txt

# Sort in reverse
sort -r file.txt

# Sort by column (field)
sort -k 2 file.txt

# Sort and remove duplicates
sort -u file.txt

# Ignore case
sort -f file.txt
```

## uniq - Remove Duplicates

**Note**: uniq only removes adjacent duplicates. Sort first!

```bash
# Remove adjacent duplicates  
uniq file.txt

# Count occurrences
uniq -c file.txt

# Show only duplicates
uniq -d file.txt

# Show only unique lines
uniq -u file.txt
```

## Practical Examples

```bash
# Sort and remove duplicates
sort file.txt | uniq

# Count word frequency
tr ' ' '\n' < file.txt | sort | uniq -c | sort -rn

# Find duplicate IPs in log
awk '{print $1}' access.log | sort | uniq -d
```