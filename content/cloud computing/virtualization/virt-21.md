---
id: virt-21
title: "Helm - Kubernetes Package Manager"
type: text
---

# Helm - Kubernetes Package Manager

Helm simplifies deploying and managing Kubernetes applications by packaging them as charts.

## Helm Concepts

**Chart**: Package containing Kubernetes manifests
**Release**: Instance of a chart running in cluster
**Repository**: Collection of charts
**Values**: Configuration parameters for charts

## Chart Structure

```
mychart/
  Chart.yaml          # Chart metadata
  values.yaml         # Default configuration
  charts/             # Dependency charts
  templates/          # Kubernetes manifests
    deployment.yaml
    service.yaml
    _helpers.tpl      # Template helpers
```

## Using Helm

```bash
# Add repository
helm repo add bitnami https://charts.bitnami.com/bitnami

# Search for charts
helm search repo nginx

# Install chart
helm install my-nginx bitnami/nginx

# Custom values
helm install my-nginx bitnami/nginx \
  --set replicaCount=3 \
  --set service.type=LoadBalancer

# Upgrade release
helm upgrade my-nginx bitnami/nginx \
  --values custom-values.yaml

# Rollback
helm rollback my-nginx 1
```

## Benefits

- Reusable application packages
- Version management
- Easy rollbacks
- Configuration templating
- Dependency management

Helm is essential for managing complex Kubernetes applications.
