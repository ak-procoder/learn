---
id: virt-2
title: Hypervisors - The Foundation
type: text
---

## What is a Hypervisor?

**Definition**: Software that creates and runs virtual machines by sitting between hardware and operating system

**Also Called**: Virtual Machine Monitor (VMM)

**Role**: Manages allocation of physical resources to virtual machines

## Type 1 Hypervisors (Bare Metal)

**Architecture**: Runs directly on physical hardware

**Characteristics**:
- Better performance
- Lower overhead
- More efficient
- Enterprise-grade
- Higher security

**Examples**:

**VMware ESXi**:
- Industry leader
- Enterprise features
- vCenter management
- High availability

**Microsoft Hyper-V**:
- Built into Windows Server
- Azure integration
- Good performance
- Cost-effective

**KVM (Kernel-based Virtual Machine)**:
- Open source
- Built into Linux kernel
- Used by many cloud providers
- Excellent performance

**Citrix Hypervisor (XenServer)**:
- Open source
- Desktop virtualization focus
- Good scalability

**Oracle VM**:
- Oracle workload optimization
- Enterprise features

## Type 2 Hypervisors (Hosted)

**Architecture**: Runs on top of an existing operating system

**Characteristics**:
- Easier to set up
- Better for desktop use
- Lower performance
- Development/testing focus
- More overhead

**Examples**:

**VMware Workstation**:
- Professional development tool
- Snapshot and cloning
- Network simulation

**VMware Fusion** (macOS):
- Mac development
- Windows on Mac
- Good integration

**Oracle VirtualBox**:
- Free and open source
- Cross-platform
- Extension packs
- Good for learning

**Parallels Desktop** (macOS):
- Excellent Mac integration
- High performance
- Commercial product

## Type 1 vs Type 2 Comparison

| Feature | Type 1 (Bare Metal) | Type 2 (Hosted) |
|---------|-------------------|----------------|
| **Performance** | Excellent | Good |
| **Use Case** | Production, Enterprise | Development, Testing |
| **Resource Overhead** | Minimal | Higher |
| **Setup Complexity** | More complex | Easier |
| **Cost** | Often commercial | Often free |
| **Scalability** | High | Limited |
| **Security** | Better isolation | Depends on host OS |

## How Hypervisors Work

### Resource Allocation
- CPU scheduling
- Memory management
- Storage provisioning
- Network virtualization

### Hardware Abstraction
- Presents virtual hardware to VMs
- Translates VM requests to physical hardware
- Isolates VMs from each other

### Key Technologies

**Hardware-Assisted Virtualization**:
- Intel VT-x
- AMD-V
- Required for modern virtualization

**Memory Virtualization**:
- Intel EPT (Extended Page Tables)
- AMD RVI (Rapid Virtualization Indexing)

**I/O Virtualization**:
- SR-IOV (Single Root I/O Virtualization)
- Para-virtualized devices

## Choosing a Hypervisor

**Considerations**:
- Performance requirements
- Budget
- Existing skills and infrastructure
- Scalability needs
- Support requirements
- Feature requirements
- Integration with cloud

**Enterprise**: VMware ESXi, Hyper-V, KVM

**Development**: VirtualBox, VMware Workstation

**Cloud**: KVM (AWS, GCP), Hyper-V (Azure)
