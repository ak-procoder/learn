---
id: advanced-17
title: CI/CD Pipelines
type: text
---

# CI/CD Pipelines

## Overview

Continuous Integration and Continuous Deployment (CI/CD) pipelines automate the journey from code commit to production deployment. This lesson covers advanced pipeline patterns, deployment strategies, and best practices.

## CI/CD Architecture

```
Developer → Version Control → CI Pipeline → CD Pipeline → Production
    │             │               │             │            │
 Commit      Webhook         Build/Test    Deploy/Monitor  Users
                                 │
                              Artifacts
                           (Docker, Packages)
```

## Advanced Pipeline Patterns

### Multi-Stage Pipeline

```yaml
# GitLab CI Pipeline
stages:
  - build
  - test
  - security
  - package
  - deploy

variables:
  DOCKER_DRIVER: overlay2
  DOCKER_TLS_CERTDIR: "/certs"

# Build Stage
build:
  stage: build
  image: node:18-alpine
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - dist/
    expire_in: 1 hour
  cache:
    key: ${CI_COMMIT_REF_SLUG}
    paths:
      - node_modules/
  only:
    - branches

# Unit Tests
test:unit:
  stage: test
  image: node:18-alpine
  script:
    - npm ci
    - npm run test:unit -- --coverage
  coverage: '/Statements\s*:\s*(\d+\.\d+)%/'
  artifacts:
    reports:
      junit: junit.xml
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura-coverage.xml

# Integration Tests
test:integration:
  stage: test
  services:
    - postgres:14
    - redis:7
  variables:
    POSTGRES_DB: testdb
    POSTGRES_USER: testuser
    POSTGRES_PASSWORD: testpass
  script:
    - npm ci
    - npm run test:integration
  only:
    - merge_requests
    - main

# Security Scanning
security:sast:
  stage: security
  image: returntocorp/semgrep
  script:
    - semgrep --config=auto --json -o sast-report.json
  artifacts:
    reports:
      sast: sast-report.json

security:dependency:
  stage: security
  image: aquasec/trivy
  script:
    - trivy fs --format json -o dependency-report.json .
  artifacts:
    reports:
      dependency_scanning: dependency-report.json

# Docker Build
package:docker:
  stage: package
  image: docker:latest
  services:
    - docker:dind
  before_script:
    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
  script:
    - docker build
        --cache-from $CI_REGISTRY_IMAGE:latest
        --tag $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
        --tag $CI_REGISTRY_IMAGE:latest
        .
    - docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
    - docker push $CI_REGISTRY_IMAGE:latest
  only:
    - main
    - tags

# Deploy to Staging
deploy:staging:
  stage: deploy
  image: alpine/helm:latest
  script:
    - helm upgrade --install myapp ./charts/myapp
        --namespace staging
        --set image.tag=$CI_COMMIT_SHA
        --values ./charts/myapp/values-staging.yaml
  environment:
    name: staging
    url: https://staging.example.com
    on_stop: stop:staging
  only:
    - main

# Deploy to Production
deploy:production:
  stage: deploy
  image: alpine/helm:latest
  script:
    - helm upgrade --install myapp ./charts/myapp
        --namespace production
        --set image.tag=$CI_COMMIT_SHA
        --values ./charts/myapp/values-production.yaml
  environment:
    name: production
    url: https://example.com
  when: manual
  only:
    - tags
```

### Parallel Pipeline Execution

```yaml
# Jenkins Pipeline (Jenkinsfile)
pipeline {
    agent any
    
    environment {
        DOCKER_REGISTRY = 'registry.example.com'
        APP_NAME = 'myapp'
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Parallel Tests') {
            parallel {
                stage('Unit Tests') {
                    agent {
                        docker {
                            image 'node:18-alpine'
                        }
                    }
                    steps {
                        sh 'npm ci'
                        sh 'npm run test:unit'
                    }
                    post {
                        always {
                            junit 'test-results/junit.xml'
                        }
                    }
                }
                
                stage('Lint') {
                    agent {
                        docker {
                            image 'node:18-alpine'
                        }
                    }
                    steps {
                        sh 'npm ci'
                        sh 'npm run lint'
                    }
                }
                
                stage('Security Scan') {
                    steps {
                        sh 'docker run --rm -v $(pwd):/src aquasec/trivy fs /src'
                    }
                }
            }
        }
        
        stage('Build') {
            steps {
                script {
                    docker.build("${DOCKER_REGISTRY}/${APP_NAME}:${BUILD_NUMBER}")
                }
            }
        }
        
        stage('Push') {
            steps {
                script {
                    docker.withRegistry("https://${DOCKER_REGISTRY}", 'registry-credentials') {
                        docker.image("${DOCKER_REGISTRY}/${APP_NAME}:${BUILD_NUMBER}").push()
                        docker.image("${DOCKER_REGISTRY}/${APP_NAME}:${BUILD_NUMBER}").push('latest')
                    }
                }
            }
        }
        
        stage('Deploy to Staging') {
            steps {
                kubernetesDeploy(
                    configs: 'k8s/staging/*.yaml',
                    kubeconfigId: 'staging-kubeconfig',
                    enableConfigSubstitution: true
                )
            }
        }
        
        stage('Smoke Tests') {
            steps {
                sh '''
                    curl -f https://staging.example.com/health || exit 1
                    npm run test:smoke -- --url=https://staging.example.com
                '''
            }
        }
        
        stage('Deploy to Production') {
            when {
                branch 'main'
            }
            input {
                message "Deploy to production?"
                ok "Deploy"
            }
            steps {
                kubernetesDeploy(
                    configs: 'k8s/production/*.yaml',
                    kubeconfigId: 'production-kubeconfig',
                    enableConfigSubstitution: true
                )
            }
        }
    }
    
    post {
        success {
            slackSend(
                color: 'good',
                message: "Pipeline succeeded: ${env.JOB_NAME} #${env.BUILD_NUMBER}"
            )
        }
        failure {
            slackSend(
                color: 'danger',
                message: "Pipeline failed: ${env.JOB_NAME} #${env.BUILD_NUMBER}"
            )
        }
    }
}
```

## Deployment Strategies

### Blue-Green Deployment

```yaml
# Kubernetes Blue-Green Deployment
---
# Blue deployment (current)
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp-blue
spec:
  replicas: 3
  selector:
    matchLabels:
      app: myapp
      version: blue
  template:
    metadata:
      labels:
        app: myapp
        version: blue
    spec:
      containers:
      - name: myapp
        image: myapp:1.0.0
---
# Green deployment (new)
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp-green
spec:
  replicas: 3
  selector:
    matchLabels:
      app: myapp
      version: green
  template:
    metadata:
      labels:
        app: myapp
        version: green
    spec:
      containers:
      - name: myapp
        image: myapp:2.0.0
---
# Service initially pointing to blue
apiVersion: v1
kind: Service
metadata:
  name: myapp
spec:
  selector:
    app: myapp
    version: blue  # Switch to 'green' after validation
  ports:
  - port: 80
    targetPort: 8080
```

**Automated Blue-Green Swap**
```python
from kubernetes import client, config

def blue_green_deploy(namespace, new_version):
    config.load_kube_config()
    apps_v1 = client.AppsV1Api()
    core_v1 = client.CoreV1Api()
    
    # Get current active version from service
    service = core_v1.read_namespaced_service('myapp', namespace)
    current_version = service.spec.selector.get('version', 'blue')
    new_color = 'green' if current_version == 'blue' else 'blue'
    
    print(f"Current: {current_version}, Deploying to: {new_color}")
    
    # Update inactive deployment with new version
    deployment = apps_v1.read_namespaced_deployment(f'myapp-{new_color}', namespace)
    deployment.spec.template.spec.containers[0].image = f'myapp:{new_version}'
    apps_v1.patch_namespaced_deployment(f'myapp-{new_color}', namespace, deployment)
    
    # Wait for deployment to be ready
    wait_for_deployment(apps_v1, namespace, f'myapp-{new_color}')
    
    # Run health checks
    if not health_check(f'myapp-{new_color}', namespace):
        print("Health check failed, rolling back")
        return False
    
    # Switch service to new deployment
    service.spec.selector['version'] = new_color
    core_v1.patch_namespaced_service('myapp', namespace, service)
    
    print(f"Successfully switched to {new_color}")
    return True
```

### Canary Deployment

```yaml
# Istio Virtual Service for Canary
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: myapp
spec:
  hosts:
  - myapp.example.com
  http:
  - match:
    - headers:
        x-canary:
          exact: "true"
    route:
    - destination:
        host: myapp
        subset: canary
  - route:
    - destination:
        host: myapp
        subset: stable
      weight: 90
    - destination:
        host: myapp
        subset: canary
      weight: 10  # 10% of traffic to canary
---
apiVersion: networking.istio.io/v1beta1
kind: DestinationRule
metadata:
  name: myapp
spec:
  host: myapp
  subsets:
  - name: stable
    labels:
      version: v1
  - name: canary
    labels:
      version: v2
```

**Progressive Canary with Flagger**
```yaml
apiVersion: flagger.app/v1beta1
kind: Canary
metadata:
  name: myapp
spec:
  targetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: myapp
  service:
    port: 80
  analysis:
    interval: 1m
    threshold: 5
    maxWeight: 50
    stepWeight: 10
    metrics:
    - name: request-success-rate
      thresholdRange:
        min: 99
      interval: 1m
    - name: request-duration
      thresholdRange:
        max: 500
      interval: 1m
    webhooks:
    - name: load-test
      url: http://flagger-loadtester/
      timeout: 5s
      metadata:
        cmd: "hey -z 1m -q 10 -c 2 http://myapp-canary/"
```

### Rolling Update

```yaml
# Kubernetes Rolling Update
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
spec:
  replicas: 10
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 2        # Create 2 extra pods during update
      maxUnavailable: 1  # Max 1 pod unavailable during update
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
    spec:
      containers:
      - name: myapp
        image: myapp:2.0.0
        readinessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 5
          periodSeconds: 5
        livenessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 15
          periodSeconds: 10
```

## AWS CodePipeline

```python
import boto3

codepipeline = boto3.client('codepipeline')

# Create pipeline
def create_pipeline():
    response = codepipeline.create_pipeline(
        pipeline={
            'name': 'myapp-pipeline',
            'roleArn': 'arn:aws:iam::ACCOUNT:role/CodePipelineRole',
            'artifactStore': {
                'type': 'S3',
                'location': 'my-pipeline-artifacts'
            },
            'stages': [
                {
                    'name': 'Source',
                    'actions': [
                        {
                            'name': 'SourceAction',
                            'actionTypeId': {
                                'category': 'Source',
                                'owner': 'AWS',
                                'provider': 'CodeCommit',
                                'version': '1'
                            },
                            'configuration': {
                                'RepositoryName': 'myapp',
                                'BranchName': 'main'
                            },
                            'outputArtifacts': [{'name': 'SourceOutput'}]
                        }
                    ]
                },
                {
                    'name': 'Build',
                    'actions': [
                        {
                            'name': 'BuildAction',
                            'actionTypeId': {
                                'category': 'Build',
                                'owner': 'AWS',
                                'provider': 'CodeBuild',
                                'version': '1'
                            },
                            'configuration': {
                                'ProjectName': 'myapp-build'
                            },
                            'inputArtifacts': [{'name': 'SourceOutput'}],
                            'outputArtifacts': [{'name': 'BuildOutput'}]
                        }
                    ]
                },
                {
                    'name': 'Deploy',
                    'actions': [
                        {
                            'name': 'DeployAction',
                            'actionTypeId': {
                                'category': 'Deploy',
                                'owner': 'AWS',
                                'provider': 'ECS',
                                'version': '1'
                            },
                            'configuration': {
                                'ClusterName': 'myapp-cluster',
                                'ServiceName': 'myapp-service',
                                'FileName': 'imagedefinitions.json'
                            },
                            'inputArtifacts': [{'name': 'BuildOutput'}]
                        }
                    ]
                }
            ]
        }
    )
    
    return response
```

## Pipeline Testing

### Smoke Tests

```python
import requests
import time

def run_smoke_tests(base_url, max_retries=5):
    """Basic health checks after deployment"""
    
    tests = [
        {'name': 'Health Check', 'path': '/health', 'expected_status': 200},
        {'name': 'API Endpoint', 'path': '/api/v1/status', 'expected_status': 200},
        {'name': 'Database Connection', 'path': '/api/v1/db-health', 'expected_status': 200}
    ]
    
    for test in tests:
        url = f"{base_url}{test['path']}"
        
        for attempt in range(max_retries):
            try:
                response = requests.get(url, timeout=5)
                
                if response.status_code == test['expected_status']:
                    print(f"✅ {test['name']}: PASSED")
                    break
                else:
                    print(f"❌ {test['name']}: FAILED (Status: {response.status_code})")
                    if attempt == max_retries - 1:
                        return False
            
            except requests.exceptions.RequestException as e:
                print(f"⚠️ {test['name']}: RETRY {attempt + 1}/{max_retries} ({e})")
                if attempt < max_retries - 1:
                    time.sleep(2 ** attempt)  # Exponential backoff
                else:
                    return False
    
    return True

# Run after deployment
if not run_smoke_tests('https://staging.example.com'):
    print("Smoke tests failed, rolling back deployment")
    exit(1)
```

### Load Testing in Pipeline

```javascript
// k6 load test script
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 20 },  // Ramp up
    { duration: '1m', target: 20 },   // Stay at 20 users
    { duration: '30s', target: 0 },   // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests under 500ms
    http_req_failed: ['rate<0.01'],   // Error rate < 1%
  },
};

export default function () {
  const response = http.get('https://staging.example.com/api/products');
  
  check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
  
  sleep(1);
}
```

## Pipeline Monitoring

```python
from datadog import initialize, api
import time

# Initialize Datadog
options = {
    'api_key': 'YOUR_API_KEY',
    'app_key': 'YOUR_APP_KEY'
}
initialize(**options)

def track_deployment(service, version, environment):
    """Track deployment in monitoring system"""
    
    api.Event.create(
        title=f'Deployment: {service} v{version}',
        text=f'Deployed {service} version {version} to {environment}',
        tags=[f'service:{service}', f'environment:{environment}', f'version:{version}'],
        alert_type='info'
    )

def monitor_deployment_health(service, environment, duration_minutes=5):
    """Monitor metrics after deployment"""
    
    end_time = int(time.time())
    start_time = end_time - (duration_minutes * 60)
    
    # Query error rate
    error_rate = api.Metric.query(
        start=start_time,
        end=end_time,
        query=f'avg:trace.web.request.errors{{service:{service},env:{environment}}}'
    )
    
    # Query latency
    latency = api.Metric.query(
        start=start_time,
        end=end_time,
        query=f'avg:trace.web.request.duration{{service:{service},env:{environment}}}.as_rate()'
    )
    
    # Check thresholds
    if error_rate['series'] and error_rate['series'][0]['pointlist'][-1][1] > 0.01:
        print("❌ High error rate detected!")
        return False
    
    if latency['series'] and latency['series'][0]['pointlist'][-1][1] > 500:
        print("❌ High latency detected!")
        return False
    
    print("✅ Deployment health check passed")
    return True

# Usage in pipeline
track_deployment('myapp', '2.0.0', 'production')
time.sleep(300)  # Wait 5 minutes
if not monitor_deployment_health('myapp', 'production'):
    # Rollback deployment
    print("Rolling back deployment")
```

## Key Takeaways

1. **CI/CD pipelines** automate build, test, and deployment
2. **Multi-stage pipelines** provide comprehensive validation
3. **Deployment strategies**: Blue-green, canary, rolling updates
4. **Testing in pipeline**: Unit, integration, smoke, load tests
5. **Monitoring** deployments ensures successful releases
6. **Rollback capability** is essential for production deployments

## Next Steps

- Learn Infrastructure as Code with Terraform
- Explore GitOps deployment patterns
- Study chaos engineering and resilience testing
