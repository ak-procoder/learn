---
id: virt-20
title: "Kubernetes Logging"
type: text
---

# Kubernetes Logging

Centralized logging is crucial for debugging, auditing, and monitoring Kubernetes applications.

## Logging Levels

**Application Logs**: stdout/stderr from containers
**Node Logs**: System logs from nodes
**Cluster Logs**: Control plane component logs
**Audit Logs**: API server audit trail

## Logging Patterns

**Node-level Logging**:
- Logs stored on nodes
- Ephemeral, lost when pod deleted
- Use for development only

**Sidecar Container**:
- Dedicated logging container per pod
- Processes and forwards logs
- Higher resource usage

**Cluster-level Logging**:
- Centralized logging system
- Agent on each node (DaemonSet)
- Production recommended

## EFK Stack

**Elasticsearch**: Stores and indexes logs
**Fluentd/Fluent Bit**: Collects and forwards logs
**Kibana**: Visualizes and searches logs

## Fluentd Configuration Example

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: fluentd-config
data:
  fluent.conf: |
    <source>
      @type tail
      path /var/log/containers/*.log
      tag kubernetes.*
      format json
    </source>
    <match kubernetes.**>
      @type elasticsearch
      host elasticsearch
      port 9200
    </match>
```

Structured logging (JSON) makes log parsing and analysis more efficient.
