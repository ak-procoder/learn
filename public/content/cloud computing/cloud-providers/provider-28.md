---
id: provider-28
title: GCP - Serverless, Containers, and DevOps
type: text
---

# GCP - Serverless, Containers, and DevOps

GCP provides comprehensive serverless and container orchestration services, along with robust DevOps tools for building, deploying, and managing applications.

## Serverless Services Overview

### Comparison Matrix

| Service | Runtime | Max Duration | Concurrency | Scaling | State |
|---------|---------|--------------|-------------|---------|-------|
| **Cloud Functions** | Functions | 60 min | Per instance | Automatic | Stateless |
| **Cloud Run** | Containers | 60 min | 1-1000/instance | Automatic | Stateless |
| **App Engine** | App framework | Unlimited | Multiple | Automatic | Can be stateful |

## Cloud Functions Deep Dive

### Function Types

**HTTP Functions:**
```python
import functions_framework
from flask import Request, jsonify

@functions_framework.http
def api_endpoint(request: Request):
    """HTTP endpoint."""
    if request.method == 'POST':
        data = request.get_json()
        return jsonify({
            'status': 'success',
            'data': data
        }), 200
    
    return jsonify({'error': 'Method not allowed'}), 405
```

**Cloud Event Functions:**
```python
import functions_framework
from cloudevents.http import CloudEvent

@functions_framework.cloud_event
def process_storage(cloud_event: CloudEvent):
    """Triggered by Cloud Storage upload."""
    data = cloud_event.data
    
    bucket = data['bucket']
    name = data['name']
    
    print(f"File {name} uploaded to {bucket}")
    
    # Process file
    from google.cloud import storage
    client = storage.Client()
    bucket = client.bucket(bucket)
    blob = bucket.blob(name)
    content = blob.download_as_text()
    
    # Do something with content
    processed = content.upper()
    
    # Save result
    output_blob = bucket.blob(f"processed/{name}")
    output_blob.upload_from_string(processed)
```

**Pub/Sub Functions:**
```python
import base64
import json
import functions_framework

@functions_framework.cloud_event
def process_message(cloud_event):
    """Process Pub/Sub message."""
    # Decode message
    message_data = base64.b64decode(cloud_event.data["message"]["data"])
    message_dict = json.loads(message_data)
    
    print(f"Processing: {message_dict}")
    
    # Process message
    process_order(message_dict)

def process_order(order):
    """Process order data."""
    # Implementation
    pass
```

### Deployment Options

```bash
# Deploy HTTP function
gcloud functions deploy my-function \
  --gen2 \
  --runtime=python311 \
  --region=us-central1 \
  --source=. \
  --entry-point=api_endpoint \
  --trigger-http \
  --allow-unauthenticated \
  --max-instances=100 \
  --memory=512MB \
  --timeout=300s \
  --set-env-vars=ENV=production,DEBUG=false

# Deploy Storage trigger
gcloud functions deploy process-upload \
  --gen2 \
  --runtime=python311 \
  --region=us-central1 \
  --source=. \
  --entry-point=process_storage \
  --trigger-bucket=my-upload-bucket \
  --service-account=processor@project.iam.gserviceaccount.com

# Deploy Pub/Sub trigger
gcloud functions deploy process-messages \
  --gen2 \
  --runtime=python311 \
  --region=us-central1 \
  --source=. \
  --entry-point=process_message \
  --trigger-topic=orders \
  --retry
```

## Cloud Run Advanced

### Service Configuration

```yaml
# service.yaml
apiVersion: serving.knative.dev/v1
kind: Service
metadata:
  name: my-service
spec:
  template:
    metadata:
      annotations:
        autoscaling.knative.dev/minScale: "1"
        autoscaling.knative.dev/maxScale: "100"
        autoscaling.knative.dev/target: "70"
    spec:
      containerConcurrency: 80
      timeoutSeconds: 300
      serviceAccountName: my-service-sa@project.iam.gserviceaccount.com
      containers:
      - image: gcr.io/project/my-service:v1
        ports:
        - containerPort: 8080
        resources:
          limits:
            memory: 1Gi
            cpu: "2"
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: db-credentials
              key: url
```

### Cloud Run with FastAPI

```python
# main.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import uvicorn
import os

app = FastAPI()

class Item(BaseModel):
    id: int
    name: str
    price: float

@app.get("/")
def read_root():
    return {"Hello": "Cloud Run"}

@app.get("/items/{item_id}")
def read_item(item_id: int):
    # Fetch from database
    return {"item_id": item_id, "name": "Sample Item"}

@app.post("/items/")
def create_item(item: Item):
    # Save to database
    return item

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    uvicorn.run(app, host="0.0.0.0", port=port)
```

```dockerfile
# Dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD exec uvicorn main:app --host 0.0.0.0 --port $PORT
```

```bash
# Deploy to Cloud Run
gcloud run deploy my-api \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --cpu 2 \
  --memory 1Gi \
  --min-instances 1 \
  --max-instances 10 \
  --concurrency 80 \
  --set-env-vars "ENV=production" \
  --set-secrets "DB_PASSWORD=db-password:latest" \
  --vpc-connector my-connector \
  --ingress all
```

### Cloud Run Jobs

Batch processing workflows:

```bash
# Deploy job
gcloud run jobs create data-processor \
  --image gcr.io/project/processor:v1 \
  --region us-central1 \
  --memory 2Gi \
  --cpu 2 \
  --max-retries 3 \
  --task-timeout 1h \
  --set-env-vars "MODE=batch"

# Execute job
gcloud run jobs execute data-processor --region us-central1

# Schedule with Cloud Scheduler
gcloud scheduler jobs create http process-daily \
  --location us-central1 \
  --schedule "0 2 * * *" \
  --uri "https://us-central1-run.googleapis.com/apis/run.googleapis.com/v1/namespaces/PROJECT_ID/jobs/data-processor:run" \
  --http-method POST \
  --oauth-service-account-email invoker@project.iam.gserviceaccount.com
```

## Google Kubernetes Engine (GKE) Advanced

### Autopilot vs Standard

**Autopilot:**
- Fully managed node and cluster operations
- Optimized resource allocation
- Per-pod billing
- Pre-configured best practices
- Limited node customization

**Standard:**
- Full control over nodes
- Custom machine types
- Node pools with different configs
- Per-node billing
- More flexibility

### Creating Production GKE Cluster

```bash
# Standard cluster with multiple node pools
gcloud container clusters create production-cluster \
  --region us-central1 \
  --num-nodes 1 \
  --machine-type n2-standard-4 \
  --disk-size 100 \
  --disk-type pd-ssd \
  --enable-autoscaling \
  --min-nodes 1 \
  --max-nodes 10 \
  --enable-autorepair \
  --enable-autoupgrade \
  --maintenance-window-start "2023-01-01T00:00:00Z" \
  --maintenance-window-duration 4h \
  --maintenance-window-recurrence "FREQ=WEEKLY;BYDAY=SU" \
  --enable-stackdriver-kubernetes \
  --enable-ip-alias \
  --network my-vpc \
  --subnetwork my-subnet \
  --cluster-secondary-range-name pods \
  --services-secondary-range-name services \
  --enable-shielded-nodes \
  --shielded-secure-boot \
  --shielded-integrity-monitoring \
  --workload-pool=PROJECT.svc.id.goog \
  --enable-network-policy \
  --addons HorizontalPodAutoscaling,HttpLoadBalancing,GcePersistentDiskCsiDriver

# Add GPU node pool
gcloud container node-pools create gpu-pool \
  --cluster production-cluster \
  --region us-central1 \
  --machine-type n1-standard-4 \
  --accelerator type=nvidia-tesla-t4,count=1 \
  --num-nodes 0 \
  --min-nodes 0 \
  --max-nodes 5 \
  --enable-autoscaling \
  --node-taints nvidia.com/gpu=present:NoSchedule
```

### Deploying Application on GKE

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-app
  labels:
    app: web
spec:
  replicas: 3
  selector:
    matchLabels:
      app: web
  template:
    metadata:
      labels:
        app: web
    spec:
      serviceAccountName: web-app-sa
      containers:
      - name: web
        image: gcr.io/project/web-app:v1
        ports:
        - containerPort: 8080
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 8080
          initialDelaySeconds: 5
          periodSeconds: 5
        env:
        - name: ENV
          value: "production"
        - name: DB_HOST
          valueFrom:
            configMapKeyRef:
              name: app-config
              key: db_host
        - name: DB_PASSWORD
          valueFrom:
            secretKeyRef:
              name: db-credentials
              key: password
---
apiVersion: v1
kind: Service
metadata:
  name: web-service
spec:
  type: LoadBalancer
  selector:
    app: web
  ports:
  - port: 80
    targetPort: 8080
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: web-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: web-app
  minReplicas: 3
  maxReplicas: 100
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

```bash
# Apply configuration
kubectl apply -f deployment.yaml
```

### GKE Workload Identity

Link Kubernetes service accounts to GCP service accounts:

```bash
# Create GCP service account
gcloud iam service-accounts create web-app-sa \
  --display-name "Web App Service Account"

# Grant permissions
gcloud projects add-iam-policy-binding PROJECT_ID \
  --member "serviceAccount:web-app-sa@PROJECT_ID.iam.gserviceaccount.com" \
  --role "roles/storage.objectViewer"

# Allow Kubernetes SA to impersonate GCP SA
gcloud iam service-accounts add-iam-policy-binding \
  web-app-sa@PROJECT_ID.iam.gserviceaccount.com \
  --role roles/iam.workloadIdentityUser \
  --member "serviceAccount:PROJECT_ID.svc.id.goog[default/web-app-sa]"

# Annotate Kubernetes service account
kubectl annotate serviceaccount web-app-sa \
  iam.gke.io/gcp-service-account=web-app-sa@PROJECT_ID.iam.gserviceaccount.com
```

## Cloud Build

CI/CD service for building containers and deploying applications.

### Cloud Build Configuration

```yaml
# cloudbuild.yaml
steps:
# Build container
- name: 'gcr.io/cloud-builders/docker'
  args: ['build', '-t', 'gcr.io/$PROJECT_ID/myapp:$SHORT_SHA', '.']

# Run tests
- name: 'gcr.io/$PROJECT_ID/myapp:$SHORT_SHA'
  entrypoint: 'python'
  args: ['-m', 'pytest', 'tests/']

# Push to registry
- name: 'gcr.io/cloud-builders/docker'
  args: ['push', 'gcr.io/$PROJECT_ID/myapp:$SHORT_SHA']

# Deploy to Cloud Run
- name: 'gcr.io/cloud-builders/gcloud'
  args:
  - 'run'
  - 'deploy'
  - 'myapp'
  - '--image=gcr.io/$PROJECT_ID/myapp:$SHORT_SHA'
  - '--region=us-central1'
  - '--platform=managed'
  - '--allow-unauthenticated'

# Deploy to GKE
- name: 'gcr.io/cloud-builders/kubectl'
  args:
  - 'set'
  - 'image'
  - 'deployment/myapp'
  - 'myapp=gcr.io/$PROJECT_ID/myapp:$SHORT_SHA'
  env:
  - 'CLOUDSDK_COMPUTE_REGION=us-central1'
  - 'CLOUDSDK_CONTAINER_CLUSTER=production-cluster'

images:
- 'gcr.io/$PROJECT_ID/myapp:$SHORT_SHA'
- 'gcr.io/$PROJECT_ID/myapp:latest'

options:
  machineType: 'N1_HIGHCPU_8'
  logging: CLOUD_LOGGING_ONLY

timeout: 1200s
```

```bash
# Trigger build manually
gcloud builds submit --config cloudbuild.yaml

# Create trigger from GitHub
gcloud builds triggers create github \
  --name=myapp-trigger \
  --repo-name=myrepo \
  --repo-owner=myorg \
  --branch-pattern="^main$" \
  --build-config=cloudbuild.yaml
```

## Artifact Registry

Store and manage container images and artifacts.

```bash
# Create repository
gcloud artifacts repositories create my-repo \
  --repository-format=docker \
  --location=us-central1 \
  --description="Docker repository"

# Configure docker authentication
gcloud auth configure-docker us-central1-docker.pkg.dev

# Tag and push image
docker tag myapp:v1 us-central1-docker.pkg.dev/PROJECT/my-repo/myapp:v1
docker push us-central1-docker.pkg.dev/PROJECT/my-repo/myapp:v1
```

## Binary Authorization

Enforce deployment policies for container images.

```bash
# Create policy
cat > policy.yaml << EOF
admissionWhitelistPatterns:
- namePattern: gcr.io/google_containers/*
- namePattern: gcr.io/google-containers/*
defaultAdmissionRule:
  requireAttestationsBy:
  - projects/PROJECT/attestors/prod-attestor
  enforcementMode: ENFORCED_BLOCK_AND_AUDIT_LOG
name: projects/PROJECT/policy
EOF

# Apply policy
gcloud container binauthz policy import policy.yaml
```

## Best Practices

### Serverless
1. **Design for statelessness**: Store state externally
2. **Use environment variables**: For configuration
3. **Implement health checks**: Readiness and liveness
4. **Set appropriate timeouts**: Balance cost and functionality
5. **Use concurrency wisely**: Optimize for your workload

### Containers
1. **Use minimal base images**: Reduce attack surface
2. **Scan for vulnerabilities**: Use Container Analysis
3. **Implement resource limits**: Prevent resource exhaustion
4. **Use health and readiness probes**: Ensure availability
5. **Enable autoscaling**: Handle traffic variations

### DevOps
1. **Automate everything**: Build, test, deploy
2. **version control configuration**: GitOps approach
3. **Implement blue-green deployments**: Zero-downtime updates
4. **Monitor and alert**: Track key metrics
5. **Practice disaster recovery**: Regular backup and restore testing

GCP's serverless and container services provide powerful, flexible options for deploying modern cloud applications with robust DevOps tooling for automation and management.
