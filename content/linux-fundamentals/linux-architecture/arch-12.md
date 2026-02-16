---
id: arch-12
title: Virtual System Calls and Performance
type: text
---

## Virtual Dynamic Shared Object (vDSO)

A mechanism to execute certain system calls entirely in user space for improved performance.

## How vDSO works

- Kernel maps small shared library into each process
- Contains implementations of frequently-used syscalls
- Executes without kernel transition overhead
- Transparent to applications

## vDSO-accelerated calls

```c
// These can avoid kernel transition
gettimeofday()  // Get current time
clock_gettime() // High-resolution time
getcpu()        // Which CPU am I on?
time()          // Get Unix timestamp
```

## Performance comparison

```
Traditional syscall:  ~50-200 CPU cycles
vDSO syscall:         ~10-30 CPU cycles
Regular function:     ~5 CPU cycles
```

## Viewing vDSO

```bash
# Check process memory map
cat /proc/self/maps | grep vdso
# Output: 7ffff7ffa000-7ffff7ffc000 r-xp [vdso]

# Examine with ldd
ldd /bin/ls
# Shows: linux-vdso.so.1
```

## Other optimization techniques

- **System call batching**: Combine multiple operations
- **Memory mapping**: Use mmap() instead of read()/write()
- **Asynchronous I/O**: io_submit(), io_getevents()
- **Direct I/O**: Bypass page cache (O_DIRECT flag)

## Minimizing syscall overhead

```c
// Instead of multiple write() calls
write(fd, data1, size1);
write(fd, data2, size2);

// Use writev() for vectored I/O
struct iovec iov[2];
iov[0].iov_base = data1;
iov[0].iov_len = size1;
iov[1].iov_base = data2;
iov[1].iov_len = size2;
writev(fd, iov, 2);
```
