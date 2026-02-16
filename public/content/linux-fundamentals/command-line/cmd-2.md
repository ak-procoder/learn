---
id: cmd-2
title: Command Structure and Syntax
type: text
---

## Basic Command Structure

```bash
command [options] [arguments]
```

**Components:**
- **command**: The program to run
- **options**: Modify command behavior (optional)
- **arguments**: What the command acts on (optional)

## Examples

```bash
# Command only
ls

# Command with argument
ls /home

# Command with option
ls -l

# Command with option and argument
ls -l /home

# Multiple options
ls -la /home

# Long format options
ls --all --human-readable
```

## Option Formats

**Short options:**
- Single dash `-` followed by single letter
- Can be combined: `-la` = `-l -a`
- Example: `ls -l`, `rm -rf`

**Long options:**
- Double dash `--` followed by word
- Cannot be combined
- Example: `ls --all`, `grep --ignore-case`

## Arguments

**Single argument:**
```bash
cat file.txt
```

**Multiple arguments:**
```bash
cp file1.txt file2.txt /backup/
```

**Wildcards:**
```bash
rm *.txt
ls file?.txt
```

## Getting Help

```bash
# Manual page
man command

# Built-in help
command --help

# Short description
whatis command

# Search man pages
apropos keyword
```
