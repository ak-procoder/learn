---
id: cmd-15
title: zip and unzip Commands
type: text
---

Working with ZIP archives.

## zip - Create ZIP Archives

```bash
# Create zip file
zip archive.zip file1.txt file2.txt

# Zip directory recursively
zip -r archive.zip directory/

# Add to existing archive
zip -u archive.zip newfile.txt

# Encrypt with password
zip -e secure.zip sensitive.txt

# Compression level (0-9)
zip -9 archive.zip file.txt      # Maximum compression

# Exclude files
zip -r archive.zip dir/ -x "*.tmp"
```

## unzip - Extract ZIP Files

```bash
# Extract all files
unzip archive.zip

# Extract to directory
unzip archive.zip -d /destination/

# List contents without extracting
unzip -l archive.zip

# Extract specific file
unzip archive.zip path/to/file.txt

# Overwrite without prompting
unzip -o archive.zip

# Extract quietly
unzip -q archive.zip
```

## Practical Examples

```bash
# Backup logs to zip
zip -r logs-backup.zip /var/log/

# Extract with timestamp preservation
unzip -X archive.zip

# Test zip integrity
unzip -t archive.zip
```