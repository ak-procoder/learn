---
id: cmd-12
title: cut and paste Commands
type: text
---

Extract and merge columns from files.

## cut - Extract Columns

```bash
# Extract characters 1-10
cut -c 1-10 file.txt

# Extract fields (default delimiter: TAB)
cut -f 1,3 file.txt

# Custom delimiter
cut -d ',' -f 2 file.csv

# Extract from position to end
cut -c 5- file.txt

# Multiple ranges
cut -d ':' -f 1,3-5 /etc/passwd
```

## paste - Merge Files

```bash
# Merge files side by side
paste file1.txt file2.txt

# Custom delimiter
paste -d ',' file1.txt file2.txt

# Serial mode (one file after another)
paste -s file.txt
```

## Examples

```bash
# Extract usernames from /etc/passwd
cut -d: -f1 /etc/passwd

# Combine columns from two files
paste -d ',' names.txt ages.txt
```