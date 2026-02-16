---
id: arch-9
title: System Calls Introduction
type: text
---

## What are system calls?

System calls are the interface between user-space applications and the kernel, providing controlled access to system resources and services.

## Purpose of system calls

- **Hardware abstraction**: Uniform interface regardless of hardware
- **Security enforcement**: Validate requests and check permissions
- **Resource management**: Coordinate access to shared resources
- **Stability**: Prevent direct hardware manipulation by applications

## System call categories

- **Process control**: fork(), exec(), exit(), wait()
- **File management**: open(), read(), write(), close()
- **Device management**: ioctl(), read(), write()
- **Information maintenance**: getpid(), alarm(), time()
- **Communication**: pipe(), shmget(), mmap()
- **Protection**: chmod(), umask(), chown()

## How system calls work

```c
// User space application
int fd = open("/etc/passwd", O_RDONLY);

// 1. Invokes system call wrapper (libc)
// 2. Places syscall number in register
// 3. Triggers software interrupt (int 0x80 or syscall)
// 4. CPU switches to kernel mode
// 5. Kernel executes sys_open()
// 6. Returns result to user space
```

## System call overhead

- Context switch from user to kernel mode
- Parameter validation and copying
- Execution of kernel code
- Context switch back to user mode
