---
id: virt-23
title: "Container Security Best Practices"
type: text
---

# Container Security Best Practices

Security is critical in containerized environments. Follow these practices to secure your containers.

## Image Security

**Use Official Images**: Start with trusted base images
**Scan for Vulnerabilities**: Use tools like Trivy, Clair, Snyk
**Minimal Base Images**: Use Alpine, distroless, or scratch
**Update Regularly**: Keep images patched and current
**Sign Images**: Use Docker Content Trust or Sigstore

## Runtime Security

**Run as Non-Root**:
```dockerfile
RUN adduser -D appuser
USER appuser
```

**Read-Only Root Filesystem**:
```yaml
securityContext:
  readOnlyRootFilesystem: true
```

**Drop Capabilities**:
```yaml
securityContext:
  capabilities:
    drop:
    - ALL
    add:
    - NET_BIND_SERVICE
```

**Resource Limits**:
```yaml
resources:
  limits:
    cpu: "1"
    memory: 512Mi
```

## Network Security

- Use Network Policies
- Implement service mesh for mTLS
- Encrypt secrets at rest
- Use private registries
- Scan registry for vulnerabilities

## Kubernetes Security

- Enable RBAC
- Use Pod Security Standards
- Implement admission controllers
- Regular security audits
- Monitor for anomalies
