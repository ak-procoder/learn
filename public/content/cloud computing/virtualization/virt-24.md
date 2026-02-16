---
id: virt-24
title: "Pod Security Standards"
type: text
---

# Pod Security Standards

Kubernetes Pod Security Standards define different isolation levels for pods, replacing Pod Security Policies.

## Security Levels

**Privileged**:
- Unrestricted, allows all capabilities
- Use for trusted system workloads
- Default if not specified

**Baseline**:
- Minimally restrictive
- Prevents known privilege escalations
- Good for most applications

**Restricted**:
- Heavily restricted
- Follows pod hardening best practices
- For security-critical applications

## Pod Security Admission

Enforced at namespace level using labels:

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: production
  labels:
    pod-security.kubernetes.io/enforce: restricted
    pod-security.kubernetes.io/audit: restricted
    pod-security.kubernetes.io/warn: restricted
```

## Modes

**enforce**: Reject non-compliant pods
**audit**: Log violations but allow
**warn**: Warning to user but allow

## Restricted Profile Requirements

- No privileged containers
- No host namespaces (network, PID, IPC)
- No host ports
- Run as non-root
- Drop all capabilities
- Read-only root filesystem recommended
- Allowed volume types restricted
- No privilege escalation

Implementing Pod Security Standards is crucial for production Kubernetes clusters.
