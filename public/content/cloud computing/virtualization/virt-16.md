---
id: virt-16
title: "Kubernetes Vertical Pod Autoscaling"
type: text
---

# Kubernetes Vertical Pod Autoscaling (VPA)

VPA automatically adjusts CPU and memory requests/limits for containers based on usage patterns.

## VPA Components

**Recommender**: Monitors resource usage and provides recommendations
**Updater**: Evicts pods that need to be updated with new resources
**Admission Controller**: Sets resource requests on new pods

## VPA Modes

**Off**: Only provides recommendations
**Initial**: Sets resources on pod creation only
**Recreate**: Updates running pods by recreating them
**Auto**: Automatically applies recommendations (future)

## VPA Example

```yaml
apiVersion: autoscaling.k8s.io/v1
kind: VerticalPodAutoscaler
metadata:
  name: app-vpa
spec:
  targetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: myapp
  updatePolicy:
    updateMode: "Recreate"
  resourcePolicy:
    containerPolicies:
    - containerName: "*"
      minAllowed:
        cpu: 100m
        memory: 128Mi
      maxAllowed:
        cpu: 2
        memory: 2Gi
```

## Use Cases

- Right-sizing applications
- Optimizing resource utilization
- Reducing costs
- Handling unpredictable workloads

**Note**: Do not use VPA with HPA on CPU/memory metrics (use custom metrics for HPA instead).
