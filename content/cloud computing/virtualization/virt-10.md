---
id: virt-10
title: "Kubernetes Services"
type: text
---

# Kubernetes Services

Services provide stable networking endpoints for accessing pods.

## Service Types

**ClusterIP** (default):
- Internal cluster access only
- Assigned a virtual IP
- Use for internal microservices

**NodePort**:
- Exposes service on each node's IP
- Port range: 30000-32767
- Use for development/testing

**LoadBalancer**:
- Creates external load balancer
- Requires cloud provider support
- Use for production external access

**ExternalName**:
- Maps service to external DNS name
- No proxying involved

## Service Discovery

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  selector:
    app: myapp
  ports:
  - port: 80
    targetPort: 8080
  type: LoadBalancer
```

Services use selectors to find pods and provide load balancing automatically.
