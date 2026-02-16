---
id: security-17
title: "Container and Kubernetes Security"
type: text
---

# Container and Kubernetes Security

Containers and Kubernetes introduce unique security challenges requiring specialized approaches.

## Container Security Layers

**Image Security**:
- Base image selection
- Vulnerability scanning
- Signing and verification
- Registry security

**Runtime Security**:
- Container isolation
- Resource limits
- Security policies
- Runtime monitoring

**Host Security**:
- Host hardening
- Kernel security
- Access control
- Patching

**Orchestration Security**:
- Kubernetes RBAC
- Network policies
- Pod security
- Secrets management

## Image Security

**Base Images**:
- Use official images
- Minimal images (Alpine, distroless)
- Regular updates
- Known provenance

**Scanning**:
```bash
# Trivy
trivy image nginx:latest

# Clair
clairctl report nginx:latest

# Snyk
snyk container test nginx:latest
```

**Image Signing**:
- Docker Content Trust
- Cosign (Sigstore)
- Notary
- Verify before deployment

**Best Practices**:
```dockerfile
# Run as non-root
FROM alpine:3.19
RUN adduser -D appuser
USER appuser

# Read-only root filesystem
# (configured in Kubernetes pod spec)

# No secrets in images
# Use secret management instead
```

## Kubernetes Security

**API Server Security**:
- TLS for all communication
- Authentication (certificates, tokens)
- Authorization (RBAC)
- Admission controllers

**RBAC Configuration**:
```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: pod-reader
rules:
- apiGroups: [""]
  resources: ["pods"]
  verbs: ["get", "list"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: read-pods
subjects:
- kind: ServiceAccount
  name: myapp
roleRef:
  kind: Role
  name: pod-reader
  apiGroup: rbac.authorization.k8s.io
```

**Pod Security Standards**:

Restricted profile:
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: secure-pod
spec:
  securityContext:
    runAsNonRoot: true
    runAsUser: 1000
    fsGroup: 2000
    seccompProfile:
      type: RuntimeDefault
  containers:
  - name: app
    image: myapp:1.0
    securityContext:
      allowPrivilegeEscalation: false
      readOnlyRootFilesystem: true
      capabilities:
        drop:
        - ALL
```

## Network Security

**Network Policies**:
```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: app-policy
spec:
  podSelector:
    matchLabels:
      app: backend
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: frontend
  egress:
  - to:
    - podSelector:
        matchLabels:
          app: database
```

**Service Mesh**:
- mTLS between services
- Traffic encryption
- Access policies
- Observability

## Secrets Management

**Kubernetes Secrets**:
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: db-credentials
type: Opaque
data:
  username: YWRtaW4=  # base64 encoded
  password: cGFzc3dvcmQ=
```

**External Secrets**:
- AWS Secrets Manager
- Azure Key Vault
- Google Secret Manager
- HashiCorp Vault

**External Secrets Operator**:
```yaml
apiVersion: external-secrets.io/v1beta1
kind: ExternalSecret
metadata:
  name: db-secret
spec:
  secretStoreRef:
    name: aws-secrets-manager
  target:
    name: db-credentials
  data:
  - secretKey: password
    remoteRef:
      key: prod/db/password
```

## Runtime Security

**Falco**:
- Runtime threat detection
- Kernel-level monitoring
- Custom rules

**eBPF-based Security**:
- Cilium
- Deep visibility
- Kernel-level enforcement

## Vulnerability Management

**Scan Running Containers**:
- Continuous scanning
- Runtime vulnerabilities
- Drift detection

**Patch Management**:
- Update base images
- Rebuild containers
- Rolling updates

## Compliance

**CIS Kubernetes Benchmark**:
- Security configuration baseline
- Automated scanning
- Compliance reports

**Tools**:
- kube-bench
- kube-hunter
- kubeaudit

## Best Practices

**Image Security**:
- Scan all images
- Use minimal base images
- Sign images
- Private registry only

**Runtime Security**:
- Run as non-root
- Read-only root filesystem
- Drop capabilities
- Resource limits

**Access Control**:
- Enable RBAC
- Service accounts for workloads
- Least privilege
- Regular audits

**Network Security**:
- Network policies
- Service mesh
- Private clusters
- Restrict public access

**Monitoring**:
- Audit logs
- Runtime monitoring
- Anomaly detection
- Centralized logging

Container and Kubernetes security requires a defense-in-depth approach across all layers.
