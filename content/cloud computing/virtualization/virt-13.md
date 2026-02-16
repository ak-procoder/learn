---
id: virt-13
title: "Kubernetes ConfigMaps"
type: text
---

# Kubernetes ConfigMaps

ConfigMaps store non-confidential configuration data as key-value pairs, separating configuration from container images.

## Creating ConfigMaps

**From literal values**:
```bash
kubectl create configmap app-config \
  --from-literal=database_url=postgres://db:5432 \
  --from-literal=cache_enabled=true
```

**From files**:
```bash
kubectl create configmap app-config \
  --from-file=config.json
```

**From YAML**:
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  database_url: "postgres://db:5432"
  cache_enabled: "true"
  config.json: |
    {
      "timeout": 30,
      "retries": 3
    }
```

## Using ConfigMaps

**Environment variables**:
```yaml
envFrom:
- configMapRef:
    name: app-config
```

**Volume mounts**:
```yaml
volumes:
- name: config
  configMap:
    name: app-config
```

ConfigMaps enable flexible, environment-specific configuration without rebuilding images.
