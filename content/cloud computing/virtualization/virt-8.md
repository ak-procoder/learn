---
id: virt-8
title: Kubernetes Storage
type: text
---

## Storage in Kubernetes

### Volumes

**Purpose**: Persist data beyond Pod lifecycle

**Problem**: Container filesystems are ephemeral

**Solution**: Volumes mount external storage into Pods

### Volume Types

**emptyDir**:
```yaml
volumes:
- name: cache
  emptyDir: {}
```
- Created when Pod starts
- Deleted when Pod removed
- Shared between containers in Pod
- Use: Temporary storage, cache

**hostPath**:
```yaml
volumes:
- name: logs
  hostPath:
    path: /var/log
    type: Directory
```
- Mounts node filesystem
- Persists beyond Pod lifecycle
- Node-specific (not portable)
- Use: Node logs, Docker socket access

**configMap**:
```yaml
volumes:
- name: config
  configMap:
    name: app-config
```
- Mount configuration data
- Key-value pairs as files
- Updates propagated

**secret**:
```yaml
volumes:
- name: secrets
  secret:
    secretName: db-credentials
```
- Mount sensitive data
- Base64 encoded
- Access control

**persistentVolumeClaim**:
```yaml
volumes:
- name: data
  persistentVolumeClaim:
    claimName: my-pvc
```
- Request persistent storage
- Decoupled from Pod lifecycle

### Persistent Volumes (PV)

**Definition**: Cluster-wide storage resource

**Characteristics**:
- Independent of Pod lifecycle
- Provisioned by administrator or dynamically
- Storage abstraction
- Various backends (NFS, cloud storage, etc.)

**Example PV**:
```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: pv-nfs
spec:
  capacity:
    storage: 10Gi
  accessModes:
    - ReadWriteMany
  persistentVolumeReclaimPolicy: Retain
  nfs:
    path: /exports/data
    server: nfs-server.example.com
```

### Persistent Volume Claims (PVC)

**Definition**: User request for storage

**Characteristics**:
- Requests specific size and access mode
- Binds to suitable PV
- Used by Pods

**Example PVC**:
```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: my-pvc
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 5Gi
  storageClassName: fast-ssd
```

**Using PVC in Pod**:
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: app
spec:
  containers:
  - name: app
    image: myapp:latest
    volumeMounts:
    - mountPath: /data
      name: storage
  volumes:
  - name: storage
    persistentVolumeClaim:
      claimName: my-pvc
```

### Access Modes

**ReadWriteOnce (RWO)**:
- Mounted read-write by single node
- Most common
- Block storage (EBS, Azure Disk)

**ReadOnlyMany (ROX)**:
- Mounted read-only by many nodes
- Shared configuration

**ReadWriteMany (RWX)**:
- Mounted read-write by many nodes
- Requires network filesystem (NFS, EFS)
- Shared data across Pods

### Reclaim Policies

**Retain**:
- PV kept when PVC deleted
- Manual cleanup required
- Data preserved

**Delete**:
- PV and storage deleted with PVC
- Automatic cleanup
- Common for cloud storage

**Recycle** (deprecated):
- Basic scrub (`rm -rf`)
- Reuse PV

### Storage Classes

**Purpose**: Define different storage tiers

**Features**:
- Dynamic provisioning
- Parameters for provisioner
- Different performance characteristics

**Example**:
```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: fast-ssd
provisioner: kubernetes.io/aws-ebs
parameters:
  type: gp3
  iopsPerGB: "100"
  fsType: ext4
```

**Cloud Storage Classes**:

**AWS**:
- gp3 (General Purpose SSD)
- io2 (Provisioned IOPS SSD)
- st1 (Throughput Optimized HDD)

**Azure**:
- Premium_LRS (Premium SSD)
- Standard_LRS (Standard HDD)
- StandardSSD_LRS (Standard SSD)

**GCP**:
- pd-standard (Standard persistent disk)
- pd-ssd (SSD persistent disk)
- pd-balanced (Balanced persistent disk)

### Dynamic Provisioning

**Automatic PV creation**:

1. Define StorageClass
2. PVC references StorageClass
3. Kubernetes creates PV automatically
4. PV bound to PVC

**Example**:
```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: auto-provisioned
spec:
  accessModes:
    - ReadWriteOnce
  storageClassName: fast-ssd
  resources:
    requests:
      storage: 20Gi
```

### ConfigMaps and Secrets

**ConfigMap**: Non-sensitive configuration

**Create from literal**:
```bash
kubectl create configmap app-config \
  --from-literal=database=mydb \
  --from-literal=host=db.example.com
```

**Create from file**:
```bash
kubectl create configmap app-config \
  --from-file=config.yaml
```

**Secret**: Sensitive data

**Types**:
- Opaque (generic)
- kubernetes.io/tls
- kubernetes.io/dockerconfigjson

**Create secret**:
```bash
kubectl create secret generic db-password \
  --from-literal=password=secretpass
```

**Use as environment variable**:
```yaml
env:
- name: DB_PASSWORD
  valueFrom:
    secretKeyRef:
      name: db-password
      key: password
```

**Use as volume**:
```yaml
volumes:
- name: config
  secret:
    secretName: db-password
```

### Storage Best Practices

- Use PVC for persistent data
- Choose appropriate access mode
- Use StorageClass for flexibility
- Don't use hostPath in production
- Backup important data
- Monitor storage usage
- Use Secrets for sensitive data
- Rotate secrets regularly
