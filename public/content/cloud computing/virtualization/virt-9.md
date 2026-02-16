---
id: virt-9
title: "Kubernetes Networking Fundamentals"
type: text
---

# Kubernetes Networking Fundamentals

Kubernetes networking enables communication between containers, pods, and external services.

## Networking Model

Kubernetes implements a flat networking model with these requirements:

- **Pod-to-Pod**: All pods can communicate with each other without NAT
- **Node-to-Pod**: Nodes can communicate with all pods without NAT
- **Pod IP Address**: Each pod gets its own IP address
- **Container Network Interface (CNI)**: Plugins implement the networking model

## Network Types

1. **Container-to-Container**: Within a pod via localhost
2. **Pod-to-Pod**: Across nodes via pod network
3. **Pod-to-Service**: Via cluster IP and DNS
4. **External-to-Service**: Via LoadBalancer or Ingress

## CNI Plugins

Popular CNI plugins include:
- **Calico**: Network policies and security
- **Flannel**: Simple overlay network
- **Weave**: Encrypted mesh network
- **Cilium**: eBPF-based networking

Understanding Kubernetes networking is essential for designing distributed applications.
