---
id: virt-12
title: "Kubernetes Network Policies"
type: text
---

# Kubernetes Network Policies

Network Policies control traffic flow between pods, providing security at the network layer.

## Policy Types

**Ingress Policies**: Control incoming traffic to pods
**Egress Policies**: Control outgoing traffic from pods

## Example Network Policy

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: api-policy
spec:
  podSelector:
    matchLabels:
      app: api
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: frontend
    ports:
    - protocol: TCP
      port: 8080
  egress:
  - to:
    - podSelector:
        matchLabels:
          app: database
    ports:
    - protocol: TCP
      port: 5432
```

## Use Cases

- Zero-trust networking
- Microsegmentation
- Compliance requirements
- Attack surface reduction

Network policies require CNI plugin support (Calico, Cilium, Weave).
