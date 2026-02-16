---
id: cmd-24
title: Text Editors - nano
type: text
---

Simple text editor for beginners.

## nano - User-Friendly Editor

```bash
# Open file
nano file.txt

# Open at specific line
nano +25 file.txt

# Open read-only
nano -v file.txt

# Create backup when saving
nano -B file.txt
```

## nano Basic Commands

**Shown at bottom of screen** (^ = Ctrl):

- `Ctrl+O` - Save (Write Out)
- `Ctrl+X` - Exit
- `Ctrl+G` - Help
- `Ctrl+K` - Cut line
- `Ctrl+U` - Paste (Uncut)
- `Ctrl+W` - Search
- `Ctrl+C` - Show position
- `Ctrl+T` - Spell check
- `Alt+U` - Undo
- `Alt+E` - Redo

## Navigation

- Arrow keys - Move cursor
- `Ctrl+A` - Beginning of line
- `Ctrl+E` - End of line
- `Ctrl+Y` - Page up
- `Ctrl+V` - Page down
- `Alt+\` - Top of file
- `Alt+/` - End of file

## Editing

```bash
# Cut and paste
Ctrl+K  # Cut current line
Ctrl+U  # Paste

# Search and replace
Ctrl+W  # Search
Alt+W   # Search next
Ctrl+\  # Replace

# Select text
Alt+A   # Start selection
Move cursor to extend
Ctrl+K  # Cut selection
```

## Saving in nano

1. `Ctrl+O` (Write Out)
2. Confirm or change filename
3. Press Enter
4. `Ctrl+X` to exit

**Save as different file:**
1. `Ctrl+O`
2. Type new filename
3. Press Enter
```