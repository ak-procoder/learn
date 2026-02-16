---
id: virt-15
title: "Kubernetes Horizontal Pod Autoscaling"
type: text
---

# Kubernetes Horizontal Pod Autoscaling (HPA)

HPA automatically scales the number of pods based on observed metrics like CPU utilization or custom metrics.

## How HPA Works

1. Metrics Server collects resource metrics
2. HPA controller queries metrics periodically (default: 15s)
3. Calculates desired replicas based on target metric
4. Scales deployment/replicaset up or down

## Basic HPA Example

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: app-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: myapp
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

## Custom Metrics

```yaml
metrics:
- type: Pods
  pods:
    metric:
      name: http_requests_per_second
    target:
      type: AverageValue
      averageValue: "1000"
```

## Prerequisites

- Metrics Server installed
- Resource requests defined in pods
- Appropriate monitoring infrastructure for custom metrics
