---
id: cmd-25
title: Text Editors - vim Basics
type: text
---

Powerful modal text editor.

## vim - Vi Improved

```bash
# Open file
vim file.txt

# Open at specific line
vim +25 file.txt

# Open multiple files
vim file1.txt file2.txt

# Open read-only
vim -R file.txt
```

## vim Modes

**Normal mode** - Navigate and execute commands (default)
**Insert mode** - Type text (press `i`, `a`, `o`)
**Visual mode** - Select text (press `v`)
**Command mode** - Enter commands (press `:`)

## Basic vim Commands

**Entering insert mode:**
- `i` - Insert before cursor
- `a` - Insert after cursor
- `o` - New line below
- `O` - New line above
- `I` - Insert at line start
- `A` - Insert at line end

**Exiting insert mode:**
- `Esc` - Return to normal mode

**Saving and quitting:**
- `:w` - Save
- `:q` - Quit
- `:wq` or `:x` - Save and quit
- `:q!` - Quit without saving

## Navigation in Normal Mode

- `h` - Left
- `j` - Down
- `k` - Up
- `l` - Right
- `w` - Next word
- `b` - Previous word
- `0` - Line start
- `$` - Line end
- `gg` - File start
- `G` - File end

## Editing Commands

- `x` - Delete character
- `dd` - Delete line
- `yy` - Copy (yank) line
- `p` - Paste after cursor
- `u` - Undo
- `Ctrl+r` - Redo
- `/pattern` - Search forward
- `n` - Next search result

**Remember**: Press `Esc` to return to normal mode!
