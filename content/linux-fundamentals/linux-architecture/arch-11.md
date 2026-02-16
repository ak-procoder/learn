---
id: arch-11
title: Common System Calls
type: text
---

## File operations

System calls for working with files and directories.

```c
// Open file
int fd = open("/path/to/file", O_RDONLY);

// Read data
ssize_t bytes_read = read(fd, buffer, sizeof(buffer));

// Write data
ssize_t bytes_written = write(fd, data, strlen(data));

// Close file
close(fd);

// File information
struct stat st;
stat("/path/to/file", &st);

// Create directory
mkdir("/path/to/dir", 0755);
```

## Process management

```c
// Create new process
pid_t pid = fork();

if (pid == 0) {
    // Child process
    execve("/bin/ls", argv, envp);
} else {
    // Parent process
    wait(&status);
}

// Get process ID
pid_t my_pid = getpid();
pid_t parent_pid = getppid();

// Exit process
exit(0);
```

## Memory operations

```c
// Allocate memory
void *ptr = mmap(NULL, size, PROT_READ|PROT_WRITE,
                 MAP_PRIVATE|MAP_ANONYMOUS, -1, 0);

// Expand heap
void *new_brk = brk(current_brk + 4096);

// Free mapped memory
munmap(ptr, size);
```

## Signal handling

```c
// Send signal
kill(pid, SIGTERM);

// Install signal handler
signal(SIGINT, handler_function);
```
