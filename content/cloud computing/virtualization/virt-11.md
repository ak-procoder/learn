---
id: virt-11
title: "Kubernetes Ingress"
type: text
---

# Kubernetes Ingress

Ingress manages external HTTP/HTTPS access to services, providing routing, SSL termination, and virtual hosting.

## Ingress Components

**Ingress Resource**:
- Defines routing rules
- Specifies hosts and paths
- Configures TLS/SSL

**Ingress Controller**:
- Implements the rules
- Popular controllers: NGINX, Traefik, HAProxy, Istio

## Ingress Example

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: app-ingress
spec:
  rules:
  - host: myapp.example.com
    http:
      paths:
      - path: /api
        pathType: Prefix
        backend:
          service:
            name: api-service
            port:
              number: 80
  tls:
  - hosts:
    - myapp.example.com
    secretName: tls-secret
```

## Benefits

- Centralized routing
- SSL/TLS termination
- Name-based virtual hosting
- Cost-effective (single load balancer)
