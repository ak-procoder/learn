---
id: cmd-5
title: Viewing Files - less and more
type: text
---

## less - View Files Page by Page

Interactive file viewer, better than `more`.

## Basic Usage

```bash
# View file
less file.txt

# View command output
command | less
```

## Navigation in less

**Moving:**
- `Space` or `f` - Forward one page
- `b` - Backward one page
- `Down arrow` or `Enter` - Forward one line
- `Up arrow` - Backward one line
- `g` - Go to beginning
- `G` - Go to end

**Searching:**
- `/pattern` - Search forward
- `?pattern` - Search backward
- `n` - Next match
- `N` - Previous match

**Other:**
- `q` - Quit
- `h` - Help
- `=` - Show file info

## Useful Options

```bash
# Show line numbers
less -N file.txt

# Don't clear screen on exit
less -X file.txt

# Ignore case in searches
less -i file.txt

# Combine options
less -NiX file.txt
```

## more - Simpler Pager

Older pager, less feature-rich than `less`.

```bash
# View file
more file.txt

# Space - next page
# Enter - next line
# q - quit
```

## When to Use Each

- **less**: Interactive viewing, large files, searching
- **cat**: Quick viewing, small files, piping
- **more**: Basic paging (use less instead)

**Remember**: "less is more than more"
