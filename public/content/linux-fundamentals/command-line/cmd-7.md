---
id: cmd-7
title: File Operations - touch, mkdir, rm
type: text
---

## touch - Create or Update Files

```bash
# Create empty file
touch newfile.txt

# Create multiple files
touch file1.txt file2.txt file3.txt

# Update timestamp
touch existing.txt
```

## mkdir - Create Directories

```bash
# Create directory
mkdir mydir

# Create multiple directories
mkdir dir1 dir2 dir3

# Create parent directories
mkdir -p path/to/deep/directory

# Set permissions while creating
mkdir -m 755 mydir
```

## rm - Remove Files/Directories

**Caution**: Deleted files cannot be recovered!

```bash
# Remove file
rm file.txt

# Remove multiple files
rm file1.txt file2.txt

# Interactive mode (confirm each)
rm -i file.txt

# Remove directory and contents
rm -r directory/

# Force remove (no confirmation)
rm -f file.txt

# Combine recursive + force
rm -rf directory/

# Remove empty directory only
rmdir emptydir
```

## Safe Practices

```bash
# ALWAYS check before removing
ls directory/
rm -r directory/

# Use -i for important files
rm -i *.txt

# Never use rm -rf / (destroys system!)
```
