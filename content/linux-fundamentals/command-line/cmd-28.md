---
id: cmd-28
title: Input/Output Redirection
type: text
---

Redirect command input and output.

## Standard Streams

- **stdin (0)**: Standard input (keyboard)
- **stdout (1)**: Standard output (screen)
- **stderr (2)**: Standard error (screen)

## Output Redirection

```bash
# Redirect stdout to file (overwrite)
command > file.txt

# Redirect stdout to file (append)
command >> file.txt

# Redirect stderr to file
command 2> error.log

# Redirect both stdout and stderr
command > output.txt 2>&1
command &> output.txt        # Shortcut

# Redirect to nowhere (discard)
command > /dev/null
command 2> /dev/null
command &> /dev/null
```

## Input Redirection

```bash
# Read from file
command < input.txt

# Here document
cat <<EOF
Multiple lines
of text
EOF

# Here string
grep "pattern" <<< "text to search"
```

## Pipes

Connect output of one command to input of another:

```bash
# Basic pipe
ls -l | less

# Multiple pipes
cat file.txt | grep "error" | wc -l

# With tee (write to file AND stdout)
command | tee output.txt

# Append with tee
command | tee -a log.txt
```

## Practical Examples

```bash
# Save and view simultaneously
make 2>&1 | tee build.log

# Separate error and output
command 1> output.log 2> error.log

# Background job with output to file
long_command > output.txt 2>&1 &

# Count lines containing pattern
grep "ERROR" log.txt | wc -l

# Sort unique IPs from log
awk '{print $1}' access.log | sort | uniq
```