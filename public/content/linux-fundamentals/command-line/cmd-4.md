---
id: cmd-4
title: Viewing File Contents - cat
type: text
---

## cat - Concatenate and Display Files

Display file contents or combine multiple files.

## Basic Usage

```bash
# Display file
cat file.txt

# Display multiple files
cat file1.txt file2.txt

# Display with line numbers
cat -n file.txt

# Display non-printing characters
cat -A file.txt
```

## Common Options

**Line numbers:**
```bash
cat -n file.txt        # Number all lines
cat -b file.txt        # Number non-blank lines
```

**Show special characters:**
```bash
cat -A file.txt        # Show all
cat -v file.txt        # Show non-printing
cat -e file.txt        # Show line ends with $
cat -t file.txt        # Show tabs as ^I
```

## Combining Files

```bash
# Concatenate files into new file
cat file1.txt file2.txt > combined.txt

# Append to existing file
cat file3.txt >> combined.txt

# Concatenate with separator
cat file1.txt <(echo "---") file2.txt
```

## Creating Files

```bash
# Create file with content
cat > newfile.txt
Type content here
Press Ctrl+D to save

# Here document
cat > config.txt << EOF
Setting1=value1
Setting2=value2
