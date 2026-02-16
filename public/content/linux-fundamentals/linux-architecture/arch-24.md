---
id: arch-24
title: Hardware Interaction and I/O
type: text
---

## Hardware communication methods

Linux communicates with hardware through several mechanisms:

**Memory-mapped I/O (MMIO)**:
- Hardware registers mapped to memory addresses
- Read/write operations like normal memory
- Common in modern systems

**Port-mapped I/O (PMIO)**:
- Separate I/O address space
- Special CPU instructions (IN/OUT on x86)
- Legacy devices

**Direct Memory Access (DMA)**:
- Hardware accesses memory without CPU
- High-speed data transfers
- Reduces CPU overhead

**Interrupts**:
- Hardware signals to CPU
- Asynchronous event notification
- Efficient for sporadic events

## Interrupt handling

```bash
# View interrupt statistics
cat /proc/interrupts

# Monitor interrupt rate
watch -n1 'cat /proc/interrupts'

# Per-CPU interrupt distribution
mpstat -I SUM 1

# IRQ affinity (bind to CPUs)
echo 1 | sudo tee /proc/irq/IRQ_NUM/smp_affinity
```

## I/O scheduling

Linux provides multiple I/O schedulers for block devices:

```bash
# View current I/O scheduler
cat /sys/block/sda/queue/scheduler

# Available schedulers
# none, mq-deadline, bfq, kyber

# Change scheduler
echo mq-deadline | sudo tee /sys/block/sda/queue/scheduler
```
