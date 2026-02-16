---
id: cmd-17
title: Process Monitoring - top and htop
type: text
---

Interactive process monitoring.

## top - Process Monitor

```bash
# Launch top
top

# Refresh every 2 seconds
top -d 2

# Show specific user's processes
top -u username

# Batch mode (for logging)
top -b -n 1
```

## top Interactive Commands

**While running:**
- `q` - Quit
- `k` - Kill process (enter PID)
- `r` - Renice (change priority)
- `M` - Sort by memory
- `P` - Sort by CPU
- `1` - Show individual CPUs
- `h` - Help
- `spacespace` - Refresh now

## htop - Better top

More user-friendly alternative (install separately):

```bash
# Install htop
sudo apt install htop

# Run htop
htop
```

**htop features:**
- Mouse support
- Color-coded
- Easy kill/renice
- Tree view (F5)
- Filter (F4)
- Search (F3)

## Practical Monitoring

```bash
# Watch specific process
top -p 1234

# Save top output to file
top -b -n 10 > top-log.txt

# Monitor every 1 second
top -d 1
```