---
id: virt-19
title: "Prometheus and Kubernetes"
type: text
---

# Prometheus and Kubernetes

Prometheus is the de facto standard for Kubernetes monitoring, providing powerful metrics collection and querying.

## Prometheus Architecture

**Prometheus Server**: Scrapes and stores metrics
**Exporters**: Expose metrics from applications
**Pushgateway**: For short-lived jobs
**Alertmanager**: Handles alerts

## Service Discovery

Prometheus automatically discovers Kubernetes resources:

```yaml
scrape_configs:
- job_name: 'kubernetes-pods'
  kubernetes_sd_configs:
  - role: pod
  relabel_configs:
  - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
    action: keep
    regex: true
  - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_path]
    action: replace
    target_label: __metrics_path__
    regex: (.+)
```

## Common Queries (PromQL)

```promql
# CPU usage by pod
rate(container_cpu_usage_seconds_total[5m])

# Memory usage
container_memory_usage_bytes

# Pod restart count
kube_pod_container_status_restarts_total

# Request rate
rate(http_requests_total[5m])
```

## Kubernetes Monitoring

- **kube-state-metrics**: Cluster state metrics
- **node-exporter**: Node hardware and OS metrics
- **cAdvisor**: Container resource metrics (built into kubelet)
