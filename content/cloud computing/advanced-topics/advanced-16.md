---
id: advanced-16
title: DevOps Fundamentals in Cloud
type: text
---

# DevOps Fundamentals in Cloud

## Overview

DevOps combines development and operations practices to deliver applications faster and more reliably. Cloud platforms provide comprehensive tools and services to implement DevOps workflows at scale.

## DevOps Core Principles

### 1. Culture and Collaboration

```yaml
# Teams working together
Development Team:
  - Write code
  - Unit tests
  - Feature development
  
Operations Team:
  - Infrastructure management
  - Monitoring and alerts
  - Incident response

DevOps Team (Combined):
  - Shared responsibility
  - Automated pipelines
  - Infrastructure as code
  - Continuous feedback
```

### 2. Automation

**Everything as Code**
```python
# Application Code
def process_order(order):
    validate(order)
    charge_payment(order.payment_info)
    create_shipment(order)
    return order_confirmation

# Infrastructure Code (Terraform)
resource "aws_instance" "web" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t2.micro"
}

# Configuration Code (Ansible)
- name: Configure web server
  hosts: webservers
  tasks:
    - name: Install nginx
      apt:
        name: nginx
        state: present

# Pipeline Code (GitHub Actions)
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: npm install
      - run: npm tests
```

### 3. Measurement and Monitoring

**Key Metrics (DORA Metrics)**
```python
class DevOpsMetrics:
    def __init__(self):
        self.deployments = []
        self.incidents = []
    
    def deployment_frequency(self):
        """How often deploying to production"""
        # Elite: Multiple times per day
        # High: Once per day to once per week
        # Medium: Once per week to once per month
        # Low: Once per month to once per six months
        
        recent_deployments = [
            d for d in self.deployments 
            if d.timestamp > datetime.now() - timedelta(days=7)
        ]
        
        return len(recent_deployments) / 7  # Per day
    
    def lead_time_for_changes(self):
        """Time from commit to production"""
        # Elite: Less than one hour
        # High: One day to one week
        # Medium: One week to one month
        # Low: One month to six months
        
        lead_times = [
            (d.deployed_at - d.committed_at).total_seconds() / 3600
            for d in self.deployments
        ]
        
        return sum(lead_times) / len(lead_times)  # Avg hours
    
    def mean_time_to_restore(self):
        """Time to recover from failures"""
        # Elite: Less than one hour
        # High: Less than one day
        # Medium: One day to one week
        # Low: One week to one month
        
        restore_times = [
            (i.resolved_at - i.detected_at).total_seconds() / 3600
            for i in self.incidents
        ]
        
        return sum(restore_times) / len(restore_times)  # Avg hours
    
    def change_failure_rate(self):
        """Percentage of deployments causing failures"""
        # Elite: 0-15%
        # High: 16-30%
        # Medium: 31-45%
        # Low: 46-60%
        
        failed = [d for d in self.deployments if d.caused_incident]
        
        return len(failed) / len(self.deployments) * 100
```

## Version Control

### Git Workflows

**Trunk-Based Development**
```bash
# Main branch always deployable
git checkout main
git pull origin main

# Create short-lived feature branch
git checkout -b feature/user-authentication

# Make small, frequent commits
git add auth.py
git commit -m "Add user authentication endpoint"

# Push and create PR
git push origin feature/user-authentication

# After review, merge to main
git checkout main
git merge feature/user-authentication

# Deploy from main
git tag v1.0.1
git push origin v1.0.1
```

**GitFlow (for release-based)**
```bash
# Long-lived branches
main      # Production
develop   # Integration

# Create feature branch from develop
git checkout develop
git checkout -b feature/new-feature

# Work on feature
git commit -m "Implement new feature"

# Merge back to develop
git checkout develop
git merge feature/new-feature

# Create release branch
git checkout -b release/1.0.0 develop

# Fix any release issues
git commit -m "Fix release bug"

# Merge to main and develop
git checkout main
git merge release/1.0.0
git tag -a v1.0.0

git checkout develop
git merge release/1.0.0
```

## Continuous Integration

### GitHub Actions

```yaml
# .github/workflows/ci.yml
name: CI Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

env:
  NODE_VERSION: '18'
  REGISTRY: ghcr.io

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linter
        run: npm run lint
      
      - name: Run unit tests
        run: npm test -- --coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
  
  security-scan:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Run security scan
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: 'fs'
          scan-ref: '.'
          format: 'sarif'
          output: 'trivy-results.sarif'
      
      - name: Upload scan results
        uses: github/codeql-action/upload-sarif@v2
        with:
          sarif_file: 'trivy-results.sarif'
  
  build:
    needs: [test, security-scan]
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2
      
      - name: Login to Container Registry
        uses: docker/login-action@v2
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      
      - name: Build and push Docker image
        uses: docker/build-push-action@v4
        with:
          context: .
          push: true
          tags: |
            ${{ env.REGISTRY }}/${{ github.repository }}:latest
            ${{ env.REGISTRY }}/${{ github.repository }}:${{ github.sha }}
          cache-from: type=registry,ref=${{ env.REGISTRY }}/${{ github.repository }}:buildcache
          cache-to: type=registry,ref=${{ env.REGISTRY }}/${{ github.repository }}:buildcache,mode=max
```

### AWS CodeBuild

```yaml
# buildspec.yml
version: 0.2

phases:
  pre_build:
    commands:
      - echo Logging in to Amazon ECR...
      - aws ecr get-login-password --region $AWS_DEFAULT_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com
      - COMMIT_HASH=$(echo $CODEBUILD_RESOLVED_SOURCE_VERSION | cut -c 1-7)
      - IMAGE_TAG=${COMMIT_HASH:=latest}
  
  build:
    commands:
      - echo Build started on `date`
      - echo Building the Docker image...
      - docker build -t $IMAGE_REPO_NAME:$IMAGE_TAG .
      - docker tag $IMAGE_REPO_NAME:$IMAGE_TAG $AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/$IMAGE_REPO_NAME:$IMAGE_TAG
  
  post_build:
    commands:
      - echo Build completed on `date`
      - echo Pushing the Docker images...
      - docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/$IMAGE_REPO_NAME:$IMAGE_TAG
      - echo Writing image definitions file...
      - printf '[{"name":"%s","imageUri":"%s"}]' $CONTAINER_NAME $AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/$IMAGE_REPO_NAME:$IMAGE_TAG > imagedefinitions.json

artifacts:
  files:
    - imagedefinitions.json
    - appspec.yml
    - taskdef.json
```

### Azure Pipelines

```yaml
# azure-pipelines.yml
trigger:
  branches:
    include:
      - main
      - develop

pool:
  vmImage: 'ubuntu-latest'

variables:
  - group: production-variables
  - name: buildConfiguration
    value: 'Release'

stages:
  - stage: Build
    jobs:
      - job: BuildAndTest
        steps:
          - task: UseDotNet@2
            inputs:
              version: '7.x'
          
          - task: DotNetCoreCLI@2
            displayName: 'Restore packages'
            inputs:
              command: 'restore'
              projects: '**/*.csproj'
          
          - task: DotNetCoreCLI@2
            displayName: 'Build solution'
            inputs:
              command: 'build'
              arguments: '--configuration $(buildConfiguration) --no-restore'
          
          - task: DotNetCoreCLI@2
            displayName: 'Run tests'
            inputs:
              command: 'test'
              arguments: '--configuration $(buildConfiguration) --no-build --collect:"XPlat Code Coverage"'
          
          - task: PublishCodeCoverageResults@1
            inputs:
              codeCoverageTool: 'Cobertura'
              summaryFileLocation: '$(Agent.TempDirectory)/**/*coverage.cobertura.xml'
          
          - task: Docker@2
            displayName: 'Build and push image'
            inputs:
              containerRegistry: 'ACR Connection'
              repository: 'myapp'
              command: 'buildAndPush'
              Dockerfile: '**/Dockerfile'
              tags: |
                $(Build.BuildId)
                latest

  - stage: Deploy
    dependsOn: Build
    condition: and(succeeded(), eq(variables['Build.SourceBranch'], 'refs/heads/main'))
    jobs:
      - deployment: DeployToProd
        environment: 'production'
        strategy:
          runOnce:
            deploy:
              steps:
                - task: AzureWebAppContainer@1
                  inputs:
                    azureSubscription: 'Azure Subscription'
                    appName: 'myapp-prod'
                    containers: 'myregistry.azurecr.io/myapp:$(Build.BuildId)'
```

## Testing in DevOps

### Test Pyramid

```python
# Unit Tests (70%)
import unittest

class TestOrderProcessing(unittest.TestCase):
    def test_validate_order(self):
        order = {'items': [], 'total': 0}
        self.assertFalse(validate_order(order))
    
    def test_calculate_total(self):
        order = {
            'items': [
                {'price': 10.00, 'quantity': 2},
                {'price': 5.00, 'quantity': 1}
            ]
        }
        self.assertEqual(calculate_total(order), 25.00)

# Integration Tests (20%)
import pytest

@pytest.fixture
def test_database():
    db = Database('test.db')
    db.create_tables()
    yield db
    db.cleanup()

def test_order_creation(test_database):
    order_service = OrderService(test_database)
    order = order_service.create_order({
        'customer_id': 123,
        'items': [{'product_id': 1, 'quantity': 2}]
    })
    assert order.id is not None
    assert order.status == 'pending'

# E2E Tests (10%)
from selenium import webdriver

class TestCheckoutFlow:
    def setup_method(self):
        self.driver = webdriver.Chrome()
    
    def test_complete_checkout(self):
        # Navigate to product page
        self.driver.get('https://example.com/products/123')
        
        # Add to cart
        add_button = self.driver.find_element_by_id('add-to-cart')
        add_button.click()
        
        # Proceed to checkout
        checkout_button = self.driver.find_element_by_id('checkout')
        checkout_button.click()
        
        # Fill form and submit
        # ... assertions ...
        
        assert 'Order Confirmed' in self.driver.page_source
    
    def teardown_method(self):
        self.driver.quit()
```

### Contract Testing

```python
# Provider (API) contract
from pact import Provider

provider = Provider('OrderAPI')

@provider.state('order 123 exists')
def order_exists():
    # Setup test data
    db.insert({'id': 123, 'status': 'pending'})

@provider.verify('/orders/123')
def verify_order_endpoint():
    # Test that provider matches contract
    response = test_client.get('/orders/123')
    return response.json()

# Consumer contract
from pact import Consumer

consumer = Consumer('WebApp').has_pact_with(Provider('OrderAPI'))

with consumer:
    consumer \
        .given('order 123 exists') \
        .upon_receiving('a request for order 123') \
        .with_request('GET', '/orders/123') \
        .will_respond_with(200, body={
            'id': 123,
            'status': 'pending'
        })
```

## Artifact Management

### Container Registry

```bash
# Build image
docker build -t myapp:1.0.0 .

# Tag for registry
docker tag myapp:1.0.0 myregistry.azurecr.io/myapp:1.0.0
docker tag myapp:1.0.0 myregistry.azurecr.io/myapp:latest

# Push to registry
az acr login --name myregistry
docker push myregistry.azurecr.io/myapp:1.0.0
docker push myregistry.azurecr.io/myapp:latest

# Scan for vulnerabilities
az acr task create \
  --registry myregistry \
  --name scan-on-push \
  --image myapp:{{.Run.ID}} \
  --context /dev/null \
  --commit-trigger-enabled false \
  --scan-on-push true
```

### Package Management

```yaml
# GitHub Packages
name: Publish Package

on:
  release:
    types: [created]

jobs:
  publish:
    runs-on: ubuntu-latest
    permissions:
      packages: write
      contents: read
    
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          registry-url: 'https://npm.pkg.github.com'
      
      - run: npm ci
      - run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## Configuration Management

### Ansible

```yaml
# playbook.yml
---
- name: Configure web servers
  hosts: webservers
  become: yes
  
  vars:
    app_user: webapp
    app_port: 3000
  
  tasks:
    - name: Update apt cache
      apt:
        update_cache: yes
    
    - name: Install Node.js
      apt:
        name: nodejs
        state: present
    
    - name: Create app user
      user:
        name: "{{ app_user }}"
        system: yes
        shell: /bin/bash
    
    - name: Deploy application
      copy:
        src: /local/path/app/
        dest: /opt/webapp/
        owner: "{{ app_user }}"
        group: "{{ app_user }}"
      notify: Restart app
    
    - name: Configure systemd service
      template:
        src: webapp.service.j2
        dest: /etc/systemd/system/webapp.service
      notify: Restart app
    
    - name: Enable and start service
      systemd:
        name: webapp
        enabled: yes
        state: started
  
  handlers:
    - name: Restart app
      systemd:
        name: webapp
        state: restarted
```

## Secrets Management

### AWS Secrets Manager

```python
import boto3
import json

secrets = boto3.client('secretsmanager')

# Store secret
def create_secret(name, secret_value):
    response = secrets.create_secret(
        Name=name,
        SecretString=json.dumps(secret_value),
        Tags=[
            {'Key': 'Environment', 'Value': 'production'},
            {'Key': 'Application', 'Value': 'myapp'}
        ]
    )
    return response

# Retrieve secret
def get_secret(name):
    response = secrets.get_secret_value(SecretId=name)
    return json.loads(response['SecretString'])

# Rotate secret
def rotate_secret(name):
    response = secrets.rotate_secret(
        SecretId=name,
        RotationLambdaARN='arn:aws:lambda:region:account:function:rotation',
        RotationRules={'AutomaticallyAfterDays': 30}
    )
    return response

# Usage in application
db_credentials = get_secret('prod/database/credentials')
connection = connect_to_db(
    host=db_credentials['host'],
    user=db_credentials['username'],
    password=db_credentials['password']
)
```

### HashiCorp Vault

```python
import hvac

# Initialize client
client = hvac.Client(
    url='https://vault.example.com:8200',
    token='s.XXXXXXXXXXXXXXXX'
)

# Write secret
client.secrets.kv.v2.create_or_update_secret(
    path='myapp/database',
    secret={
        'username': 'dbuser',
        'password': 'secure-password'
    }
)

# Read secret
secret = client.secrets.kv.v2.read_secret_version(
    path='myapp/database'
)

db_creds = secret['data']['data']

# Dynamic secrets (database credentials)
creds = client.secrets.database.generate_credentials(
    name='myapp-role'
)

# Credentials automatically expire
username = creds['data']['username']
password = creds['data']['password']
```

## Key Takeaways

1. **DevOps culture** emphasizes collaboration and shared responsibility
2. **Automation** is fundamental: code, infrastructure, pipelines, testing
3. **DORA metrics** measure DevOps performance
4. **CI/CD pipelines** automate build, test, and deployment
5. **Test pyramid**: Many unit tests, some integration tests, few E2E tests
6. **Secrets management** keeps credentials secure and rotated

## Next Steps

- Deep dive into CI/CD pipeline patterns
- Learn Infrastructure as Code with Terraform
- Explore container orchestration with Kubernetes
