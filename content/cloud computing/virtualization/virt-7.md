---
id: virt-7
title: Kubernetes Workloads and Controllers
type: text
---

## Kubernetes Workload Resources

### ReplicaSet

**Purpose**: Maintain stable set of replica Pods

**Features**:
- Ensures specified number of Pods running
- Selects Pods via labels
- Self-healing
- Usually managed by Deployment

**Example**:
```yaml
apiVersion: apps/v1
kind: ReplicaSet
metadata:
  name: frontend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: frontend
  template:
    metadata:
      labels:
        app: frontend
    spec:
      containers:
      - name: nginx
        image: nginx:1.21
```

### Deployment

**Purpose**: Declarative updates for Pods and ReplicaSets

**Key Features**:

**Rolling Updates**:
- Gradual replacement of Pods
- Zero downtime
- Configurable update strategy

**Rollback**:
- View revision history
- Rollback to previous version
- Quick recovery

**Scaling**:
- Horizontal scaling
- Manual or automated
- Update replicas count

**Update Strategies**:

**RollingUpdate** (default):
- MaxSurge: Extra Pods during update
- MaxUnavailable: Pods unavailable during update

**Recreate**:
- Terminate all Pods first
- Then create new ones
- Brief downtime

**Commands**:
```bash
# Create deployment
kubectl create deployment nginx --image=nginx:1.21

# Scale
kubectl scale deployment nginx --replicas=5

# Update image
kubectl set image deployment/nginx nginx=nginx:1.22

# Rollout status
kubectl rollout status deployment/nginx

# Rollback
kubectl rollout undo deployment/nginx

# Rollout history
kubectl rollout history deployment/nginx
```

### StatefulSet

**Purpose**: Manage stateful applications

**Characteristics**:
- Stable, unique network identifiers
- Stable, persistent storage
- Ordered, graceful deployment and scaling
- Ordered, automated rolling updates

**Use Cases**:
- Databases
- Distributed systems
- Applications requiring stable identity

**Differences from Deployment**:
- Ordered Pod creation (0, 1, 2...)
- Stable pod names
- Persistent volumes per Pod

**Example**:
```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: mongodb
spec:
  serviceName: mongodb
  replicas: 3
  selector:
    matchLabels:
      app: mongodb
  template:
    metadata:
      labels:
        app: mongodb
    spec:
      containers:
      - name: mongodb
        image: mongo:5.0
        volumeMounts:
        - name: data
          mountPath: /data/db
  volumeClaimTemplates:
  - metadata:
      name: data
    spec:
      accessModes: ["ReadWriteOnce"]
      resources:
        requests:
          storage: 10Gi
```

### DaemonSet

**Purpose**: Ensure a Pod runs on all (or some) nodes

**Use Cases**:
- Log collection (Fluentd, Logstash)
- Monitoring agents (Node Exporter, Datadog)
- Network plugins
- Storage daemons

**Characteristics**:
- One Pod per node
- Automatically added to new nodes
- Removed when nodes deleted

### Job

**Purpose**: Run tasks to completion

**Characteristics**:
- Creates one or more Pods
- Ensures successful completion
- Retries on failure
- Runs to completion then stops

**Use Cases**:
- Batch processing
- Data migrations
- Backups
- One-time tasks

**Example**:
```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: data-migration
spec:
  template:
    spec:
      containers:
      - name: migration
        image: migration-tool:latest
        command: ["./migrate"]
      restartPolicy: OnFailure
  backoffLimit: 3
```

### CronJob

**Purpose**: Run Jobs on a schedule

**Characteristics**:
- Cron syntax for scheduling
- Creates Jobs on schedule
- Configurable concurrency

**Use Cases**:
- Scheduled backups
- Report generation
- Cleanup tasks
- Periodic data processing

**Example**:
```yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: backup
spec:
  schedule: "0 2 * * *"  # 2 AM daily
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: backup
            image: backup-tool:latest
            command: ["./backup.sh"]
          restartPolicy: OnFailure
```

## Choosing the Right Workload

**Deployment**: Stateless applications (web servers, APIs)

**StatefulSet**: Stateful applications (databases, message queues)

**DaemonSet**: Node-level services (monitoring, logging)

**Job**: One-time tasks

**CronJob**: Scheduled recurring tasks
