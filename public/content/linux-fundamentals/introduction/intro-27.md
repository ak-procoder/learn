---
id: intro-27
title: Working with Archives
type: text
---

## Archive and Compression

Linux uses tar for archiving and various tools for compression.

## tar (Tape Archive)

### Creating Archives
```bash
# Create tar archive
tar -cvf archive.tar directory/

# Create compressed tar.gz (gzip)
tar -czvf archive.tar.gz directory/

# Create compressed tar.bz2 (bzip2, better compression)
tar -cjvf archive.tar.bz2 directory/

# Create tar.xz (best compression)
tar -cJvf archive.tar.xz directory/
```

### Extracting Archives
```bash
# Extract tar
tar -xvf archive.tar

# Extract tar.gz
tar -xzvf archive.tar.gz

# Extract to specific directory
tar -xzvf archive.tar.gz -C /path/to/dir

# List contents without extracting
tar -tzvf archive.tar.gz
```

### tar Options Explained
- **c**: Create archive
- **x**: Extract archive
- **t**: List contents
- **v**: Verbose output
- **f**: File (specify filename)
- **z**: gzip compression
- **j**: bzip2 compression
- **J**: xz compression

## Other Compression Tools

```bash
# gzip
gzip file.txt       # Creates file.txt.gz
gunzip file.txt.gz  # Extracts file.txt

# zip/unzip
zip archive.zip files*
unzip archive.zip
```
