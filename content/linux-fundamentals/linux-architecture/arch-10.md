---
id: arch-10
title: System Call Mechanism
type: text
---

## System call invocation process

When an application needs kernel services, it triggers a carefully orchestrated transition between user and kernel space.

## Step-by-step flow

1. **Application calls wrapper function** (e.g., `read()`)
2. **Wrapper loads syscall number** into CPU register
3. **Parameters placed** in designated registers
4. **Software interrupt triggered** (`int 0x80` or `syscall` instruction)
5. **CPU switches to kernel mode** and saves context
6. **Kernel dispatcher** routes to appropriate handler
7. **System call handler executes** in kernel space
8. **Result placed** in return register
9. **CPU switches back to user mode**
10. **Wrapper returns result** to application

## Register usage (x86-64)

```
System call number: %rax
Arguments (in order):
  arg1: %rdi
  arg2: %rsi
  arg3: %rdx
  arg4: %r10
  arg5: %r8
  arg6: %r9
Return value: %rax
```

## System call table

```c
// Simplified example
sys_call_table[__NR_read] = sys_read;
sys_call_table[__NR_write] = sys_write;
sys_call_table[__NR_open] = sys_open;
```

## Tracing system calls

```bash
# Trace system calls of a command
strace ls -l

# Trace specific syscalls
strace -e open,read cat file.txt

# Trace running process
strace -p <PID>
```
