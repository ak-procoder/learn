---
id: cmd-14
title: Compression - tar and gzip
type: text
---

Archiving and compressing files.

## tar - Archive Files

```bash
# Create archive
tar -cvf archive.tar directory/

# Extract archive
tar -xvf archive.tar

# List contents
tar -tvf archive.tar

# Create compressed (.tar.gz)
tar -czvf archive.tar.gz directory/

# Extract compressed
tar -xzvf archive.tar.gz

# Extract to specific directory
tar -xzvf archive.tar.gz -C /destination/
```

## gzip / gunzip - Compress Files

```bash
# Compress file (replaces original)
gzip file.txt           # Creates file.txt.gz

# Decompress
gunzip file.txt.gz

# Keep original
gzip -c file.txt > file.txt.gz

# Compress recursively
gzip -r directory/

# View compressed without extracting
zcat file.txt.gz
zless file.txt.gz
```

## Common Tasks

```bash
# Backup directory
tar -czvf backup-$(date +%Y%m%d).tar.gz ~/Documents/

# Extract single file
tar -xzvf archive.tar.gz path/to/file

# Compress multiple directories
tar -czvf backup.tar.gz dir1/ dir2/ dir3/
```