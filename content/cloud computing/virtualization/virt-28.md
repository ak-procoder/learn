---
id: virt-28
title: "Istio Service Mesh"
type: text
---

# Istio Service Mesh

Istio is a powerful, feature-rich service mesh that provides traffic management, security, and observability for microservices.

## Core Components

**Istiod**: Control plane combining Pilot, Citadel, and Galley
**Envoy Proxy**: Data plane sidecar for each service
**Ingress/Egress Gateways**: Entry and exit points

## Traffic Management

**Virtual Service**:
```yaml
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: reviews
spec:
  hosts:
  - reviews
  http:
  - match:
    - headers:
        user:
          exact: "jason"
    route:
    - destination:
        host: reviews
        subset: v2
  - route:
    - destination:
        host: reviews
        subset: v1
```

**Destination Rule**:
```yaml
apiVersion: networking.istio.io/v1beta1
kind: DestinationRule
metadata:
  name: reviews
spec:
  host: reviews
  trafficPolicy:
    loadBalancer:
      simple: ROUND_ROBIN
  subsets:
  - name: v1
    labels:
      version: v1
  - name: v2
    labels:
      version: v2
```

## Security Features

- Automatic mTLS
- Certificate rotation
- Authorization policies
- Request authentication

## Observability

- Automatic metrics (Prometheus)
- Distributed tracing (Jaeger)
- Service graph (Kiali)
- Access logs

Istio enables sophisticated traffic management and security without changing application code.
