---
id: cmd-6
title: head and tail Commands
type: text
---

## head - View File Beginning

Display the first lines of a file.

## Basic Usage

```bash
# First 10 lines (default)
head file.txt

# First 5 lines
head -n 5 file.txt
head -5 file.txt

# First 20 bytes
head -c 20 file.txt

# Multiple files
head file1.txt file2.txt
```

## tail - View File End

Display the last lines of a file.

## Basic Usage

```bash
# Last 10 lines (default)
tail file.txt

# Last 20 lines
tail -n 20 file.txt
tail -20 file.txt

# Last 50 bytes
tail -c 50 file.txt
```

## Following Files (tail -f)

Monitor files in real-time (great for logs):

```bash
# Follow file (watch for new lines)
tail -f /var/log/syslog

# Follow with line count
tail -n 50 -f /var/log/syslog

# Follow multiple files
tail -f /var/log/*.log
```

Press `Ctrl+C` to stop following.

## Practical Examples

```bash
# First 100 lines of log
head -100 /var/log/syslog

# Last 50 lines of log
tail -50 /var/log/syslog

# Watch live log
tail -f /var/log/apache2/access.log

# Show last 20 lines, then follow
tail -20 -f app.log

# Skip first 10 lines, show rest
tail -n +11 file.txt
```

## Combining head and tail

```bash
# Lines 11-20 (skip 10, show next 10)
tail -n +11 file.txt | head -10

# Middle section of large file
head -100 file.txt | tail -50
```
