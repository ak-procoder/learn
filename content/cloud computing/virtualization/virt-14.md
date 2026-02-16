---
id: virt-14
title: "Kubernetes Secrets"
type: text
---

# Kubernetes Secrets

Secrets store sensitive information like passwords, tokens, and keys, providing better security than ConfigMaps.

## Secret Types

- **Opaque**: Arbitrary user-defined data (default)
- **kubernetes.io/service-account-token**: Service account token
- **kubernetes.io/dockerconfigjson**: Docker registry credentials
- **kubernetes.io/tls**: TLS certificate and key

## Creating Secrets

```bash
# From literal
kubectl create secret generic db-secret \
  --from-literal=username=admin \
  --from-literal=password=secretpass

# From file
kubectl create secret generic tls-secret \
  --from-file=tls.crt=./cert.crt \
  --from-file=tls.key=./cert.key
```

## Using Secrets

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: app
spec:
  containers:
  - name: app
    image: myapp:1.0
    env:
    - name: DB_PASSWORD
      valueFrom:
        secretKeyRef:
          name: db-secret
          key: password
```

## Best Practices

- Enable encryption at rest
- Use RBAC to restrict access
- Rotate secrets regularly
- Consider external secret management (Vault, AWS Secrets Manager)
