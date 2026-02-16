---
id: cmd-8
title: Copying and Moving - cp, mv
type: text
---

## cp - Copy Files

```bash
# Copy file
cp source.txt destination.txt

# Copy to directory
cp file.txt /backup/

# Copy multiple files
cp file1.txt file2.txt /backup/

# Copy directory recursively
cp -r sourcedir/ destdir/

# Preserve attributes (permissions, timestamps)
cp -p file.txt backup.txt

# Copy with confirmation
cp -i file.txt existing.txt

# Verbose output
cp -v file.txt /backup/
```

## mv - Move/Rename Files

```bash
# Rename file
mv oldname.txt newname.txt

# Move file
mv file.txt /new/location/

# Move multiple files
mv file1.txt file2.txt /destination/

# Move directory
mv olddir/ newdir/

# Confirm before overwriting
mv -i source.txt dest.txt

# Don't overwrite existing
mv -n files* /destination/
```

## Practical Examples

```bash
# Backup file before editing
cp important.txt important.txt.bak

# Copy with date
cp file.txt file.txt.$(date +%Y%m%d)

# Move all .txt files
mv *.txt documents/

# Rename with pattern
for file in *.jpeg; do mv "$file" "${file%.jpeg}.jpg"; done
```
