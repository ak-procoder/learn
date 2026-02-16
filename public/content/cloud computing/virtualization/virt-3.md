---
id: virt-3
title: Virtual Machines - Deep Dive
type: text
---

## Virtual Machine Architecture

**Definition**: Software emulation of a physical computer

**Components**:

### Virtual Hardware
- **Virtual CPU (vCPU)**: Scheduled on physical CPUs
- **Virtual Memory (vRAM)**: Allocated from physical RAM
- **Virtual Disk**: Files on physical storage
- **Virtual Network Interface**: Software network adapter
- **Virtual Peripherals**: CD/DVD, USB, etc.

### Guest Operating System
- Full OS installation
- Runs independently
- Unaware it's virtualized
- Windows, Linux, or other OS

### Applications
- Run normally on guest OS
- Isolated from host and other VMs
- Standard application installation

## VM Lifecycle

### Creation
1. Define VM specifications
2. Allocate resources
3. Install operating system
4. Configure network
5. Install applications

### Operations
- **Start/Stop**: Power on/off VM
- **Pause/Resume**: Suspend execution
- **Snapshot**: Save VM state
- **Clone**: Create copy
- **Migrate**: Move to another host

### Maintenance
- Resource adjustments
- Updates and patches
- Backup
- Monitoring

### Decommissioning
- Shutdown
- Data backup
- Resource reclamation
- Deletion

## VM Resource Management

### CPU Allocation

**Oversubscription**:
- More vCPUs than physical cores
- Safe if not all VMs at max usage
- Typical ratio: 4:1 to 8:1

**CPU Shares/Reservations**:
- Guarantee minimum CPU
- Set maximum CPU
- Prioritize critical VMs

### Memory Management

**Techniques**:

**Memory Overcommitment**:
- Allocate more total vRAM than physical
- Works if VMs don't use all allocated memory

**Memory Ballooning**:
- Reclaim unused memory from VMs
- Driver in guest OS
- Dynamic adjustment

**Memory Compression**:
- Compress RAM pages
- Reduce memory pressure

**Memory Sharing**:
- Deduplicate identical pages
- Common for many similar VMs

**Memory Swapping**:
- Swap to disk (last resort)
- Performance impact

### Storage

**Virtual Disk Formats**:
- **VMDK** (VMware)
- **VHD/VHDX** (Hyper-V)
- **QCOW2** (KVM/QEMU)
- **VDI** (VirtualBox)

**Storage Types**:

**Thick Provisioned**:
- Full space allocated upfront
- Better performance
- No risk of running out

**Thin Provisioned**:
- Grows as needed
- Better space efficiency
- Risk of storage exhaustion

**Storage Features**:
- Snapshots
- Linked clones
- Storage vMotion (VMware)

### Networking

**Virtual Switch**:
- Software network switch
- Connects VMs to physical network
- VLAN support

**Network Modes**:

**Bridged**:
- VM on same network as host
- Gets own IP address
- Full network access

**NAT**:
- VM shares host's IP
- Outbound access
- Limited inbound access

**Host-Only**:
- VMs communicate with host only
- Isolated network
- Testing scenarios

**Internal**:
- VMs communicate with each other
- No host access

## Advanced VM Features

### Snapshots
- Point-in-time state
- Quick rollback
- Before updates/changes
- Not a backup solution

### Templates
- Pre-configured VM image
- Rapid deployment
- Consistency
- Clone from template

### High Availability
- Automatic restart on failure
- Host failure detection
- VM-level redundancy

### Live Migration
- Move running VM between hosts
- Zero downtime
- Load balancing
- Maintenance flexibility

### Resource Pools
- Group VMs
- Shared resource allocation
- Hierarchical structure
- Priority management

## Performance Optimization

**Best Practices**:
- Right-size VMs (don't over-allocate)
- Use VM tools/guest additions
- Enable hardware virtualization
- Use para-virtualized drivers
- Regular monitoring
- Avoid overcommitment of critical resources
