---
id: arch-14
title: Virtual Memory and Address Translation
type: text
---

## Virtual memory concept

Virtual memory provides each process with its own virtual address space, creating the illusion of having more memory than physically available.

## Benefits of virtual memory

- **Process isolation**: Processes can't access each other's memory
- **Memory abstraction**: Uniform address space regardless of physical RAM
- **Efficient allocation**: Share physical pages, allocate on demand
- **Memory protection**: Read/write/execute permissions per page
- **Overcommitment**: Allocate more virtual than physical memory

## Address translation

Virtual addresses are translated to physical addresses using page tables:

```
Virtual Address (64-bit)
    ↓
TLB (Translation Lookaside Buffer) - Fast cache
    ↓ (miss)
Page Table Walk
    ↓
PGD → PUD → PMD → PTE
    ↓
Physical Address
```

## Page table entries

Each entry contains:
- **Physical page number**: Where data actually resides
- **Present bit**: Page in memory or swapped out
- **Dirty bit**: Page modified since loaded
- **Accessed bit**: Page recently accessed
- **Permission bits**: Read, write, execute flags

## Memory allocation

```c
// Example: mmap system call
void *addr = mmap(NULL, size, 
                  PROT_READ | PROT_WRITE,
                  MAP_PRIVATE | MAP_ANONYMOUS,
                  -1, 0);
```
