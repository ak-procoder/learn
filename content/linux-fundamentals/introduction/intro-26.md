---
id: intro-26
title: Essential Linux Commands
type: text
---

## File Operations

### Navigation
```bash
pwd                 # Print working directory
cd /path/to/dir     # Change directory
cd ..               # Parent directory
cd ~                # Home directory
cd -                # Previous directory
```

### Listing Files
```bash
ls                  # List files
ls -l               # Long format with details
ls -la              # Include hidden files
ls -lh              # Human-readable sizes
```

### File Manipulation
```bash
touch file.txt      # Create empty file
cp source dest      # Copy file
cp -r dir1 dir2     # Copy directory recursively
mv old new          # Move/rename file
rm file.txt         # Remove file
rm -r directory     # Remove directory recursively
rm -rf dir          # Force remove (dangerous!)
```

### Directory Operations
```bash
mkdir directory     # Create directory
mkdir -p a/b/c      # Create nested directories
rmdir directory     # Remove empty directory
```

## File Viewing

```bash
cat file.txt        # Display entire file
less file.txt       # Page through file
head file.txt       # First 10 lines
head -n 20 file.txt # First 20 lines
tail file.txt       # Last 10 lines
tail -f log.txt     # Follow file (real-time)
```

## Searching

```bash
grep "pattern" file.txt         # Search in file
grep -r "pattern" directory/    # Search recursively
find /path -name "*.txt"        # Find files by name
locate filename                 # Fast file search (needs database)
```
