---
id: arch-22
title: Multiprocessing and Multithreading
type: text
---

## Processes vs threads

**Process**:
- Independent execution unit
- Separate memory space
- Heavyweight context switches
- IPC required for communication
- Created with fork()

**Thread**:
- Lightweight execution unit within process
- Shared memory space
- Fast context switches
- Direct memory communication
- Created with pthread_create() or clone()

## Process creation

```c
#include <unistd.h>
#include <sys/types.h>

pid_t pid = fork();

if (pid == 0) {
    // Child process
    execl("/bin/ls", "ls", "-l", NULL);
} else if (pid > 0) {
    // Parent process
    wait(NULL); // Wait for child
} else {
    // Fork failed
    perror("fork");
}
```

## Thread creation

```c
#include <pthread.h>

void* thread_function(void* arg) {
    // Thread code
    return NULL;
}

pthread_t thread;
pthread_create(&thread, NULL, thread_function, NULL);
pthread_join(thread, NULL);
```

## Viewing processes and threads

```bash
# All processes
ps aux

# Process tree
pstree

# Threads of a process
ps -L -p PID

# Thread count
ps -o nlwp PID

# Detailed thread info
top -H -p PID
```
