---
id: provider-31
title: GCP - Management, Monitoring, and DevOps
type: text
---

# GCP - Management, Monitoring, and DevOps

GCP provides comprehensive tools for managing, monitoring, and operating cloud infrastructure and applications efficiently.

## Cloud Console

Web-based management interface for GCP resources.

**Key Features:**
- Visual resource management
- Integrated Cloud Shell
- Performance dashboards
- Cost management
- API Explorer
- Mobile app available

**Customization:**
```bash
# Pin projects to dashboard
# Create custom dashboards
# Set up budgets and alerts
# Configure notifications
```

## gcloud CLI

Command-line tool for managing GCP resources.

### Configuration

```bash
# Initialize gcloud
gcloud init

# List configurations
gcloud config configurations list

# Create new configuration
gcloud config configurations create production
gcloud config set project prod-project
gcloud config set compute/region us-central1
gcloud config set compute/zone us-central1-a

# Switch configurations
gcloud config configurations activate production

# View current configuration
gcloud config list

# Set default values
gcloud config set core/project my-project
gcloud config set compute/region us-east1
gcloud config set core/verbosity debug
```

### Useful Commands

```bash
# Interactive mode
gcloud interactive

# Filter and format output
gcloud compute instances list \
  --filter="zone:us-central1-a AND status:RUNNING" \
  --format="table(name,machineType,status)"

# JSON output
gcloud compute instances describe myvm \
  --zone us-central1-a \
  --format=json

# Get specific field
gcloud compute instances describe myvm \
  --zone us-central1-a \
  --format="value(networkInterfaces[0].accessConfigs[0].natIP)"

# Bulk operations
gcloud compute instances list --format="value(name)" | \
  xargs -I {} gcloud compute instances stop {} --zone us-central1-a
```

## Cloud Monitoring (formerly Stackdriver)

Monitor infrastructure and application performance.

### Metrics

```python
from google.cloud import monitoring_v3
import time

# Create client
client = monitoring_v3.MetricServiceClient()
project_name = f"projects/{project_id}"

# Write custom metric
series = monitoring_v3.TimeSeries()
series.metric.type = "custom.googleapis.com/my_metric"
series.resource.type = "global"

point = series.points.add()
point.value.int64_value = 42
point.interval.end_time.seconds = int(time.time())

client.create_time_series(name=project_name, time_series=[series])

# Read metrics
interval = monitoring_v3.TimeInterval()
now = time.time()
interval.end_time.seconds = int(now)
interval.start_time.seconds = int(now - 3600)

results = client.list_time_series(
    request={
        "name": project_name,
        "filter": 'metric.type="compute.googleapis.com/instance/cpu/utilization"',
        "interval": interval,
        "view": monitoring_v3.ListTimeSeriesRequest.TimeSeriesView.FULL
    }
)

for result in results:
    print(f"Instance: {result.resource.labels['instance_id']}")
    for point in result.points:
        print(f"  Value: {point.value.double_value}")
```

### Creating Alerts

```bash
# Create alert policy using gcloud
cat > alert-policy.json << EOF
{
  "displayName": "High CPU Usage",
  "conditions": [{
    "displayName": "CPU usage above 80%",
    "conditionThreshold": {
      "filter": "metric.type=\"compute.googleapis.com/instance/cpu/utilization\" resource.type=\"gce_instance\"",
      "comparison": "COMPARISON_GT",
      "thresholdValue": 0.8,
      "duration": "300s",
      "aggregations": [{
        "alignmentPeriod": "60s",
        "perSeriesAligner": "ALIGN_MEAN"
      }]
    }
  }],
  "combiner": "OR",
  "enabled": true,
  "notificationChannels": ["projects/PROJECT/notificationChannels/CHANNEL_ID"],
  "alertStrategy": {
    "autoClose": "1800s"
  }
}
EOF

gcloud alpha monitoring policies create --policy-from-file=alert-policy.json
```

### Uptime Checks

```python
from google.cloud import monitoring_v3

client = monitoring_v3.UptimeCheckServiceClient()
project_name = f"projects/{project_id}"

config = monitoring_v3.UptimeCheckConfig()
config.display_name = "Website Check"
config.monitored_resource.type = "uptime_url"
config.monitored_resource.labels["host"] = "example.com"

config.http_check.path = "/health"
config.http_check.port = 443
config.http_check.use_ssl = True
config.timeout.seconds = 10
config.period.seconds = 300

response = client.create_uptime_check_config(
    parent=project_name,
    uptime_check_config=config
)
```

## Cloud Logging

Centralized logging service.

### Writing Logs

```python
from google.cloud import logging
import json

# Create client
client = logging.Client()
logger = client.logger("my-application")

# Simple log
logger.log_text("Application started")

# Structured log
logger.log_struct({
    "message": "User login",
    "user_id": 12345,
    "ip_address": "203.0.113.1",
    "success": True
})

# Log with severity
logger.log_text("Critical error occurred", severity="ERROR")

# Log with labels
logger.log_struct(
    {"message": "Payment processed", "amount": 99.99},
    severity="INFO",
    labels={"environment": "production"}
)
```

### Querying Logs

```bash
# View recent logs
gcloud logging read "resource.type=gce_instance" \
  --limit 50 \
  --format json

# Filter by severity
gcloud logging read "severity>=ERROR" --limit 20

# Filter by timestamp
gcloud logging read \
  'timestamp>="2025-01-01T00:00:00Z" AND timestamp<="2025-01-02T00:00:00Z"' \
  --limit 100

# Complex filter
gcloud logging read \
  'resource.type="gce_instance" AND 
   resource.labels.instance_id="my-instance" AND
   severity>=WARNING AND
   jsonPayload.user_id="12345"' \
  --limit 50

# Stream logs in real-time
gcloud logging tail "resource.type=cloud_function"
```

### Log Exports

```bash
# Export to BigQuery
gcloud logging sinks create my-bq-sink \
  bigquery.googleapis.com/projects/PROJECT/datasets/logs_dataset \
  --log-filter='resource.type="gce_instance"'

# Export to Cloud Storage
gcloud logging sinks create my-gcs-sink \
  storage.googleapis.com/my-logs-bucket \
  --log-filter='severity>=ERROR'

# Export to Pub/Sub
gcloud logging sinks create my-pubsub-sink \
  pubsub.googleapis.com/projects/PROJECT/topics/logs-topic \
  --log-filter='resource.type="cloud_function"'
```

## Cloud Trace

Distributed tracing for applications.

```python
from google.cloud import trace_v2
import time

client = trace_v2.TraceServiceClient()
project_name = f"projects/{project_id}"

# Create trace
trace_id = "1234567890abcdef1234567890abcdef"
span_id = "1234567890abcdef"

span = trace_v2.types.Span()
span.name = f"{project_name}/traces/{trace_id}/spans/{span_id}"
span.span_id = span_id
span.display_name.value = "my-span"
span.start_time.FromSeconds(int(time.time()))
span.end_time.FromSeconds(int(time.time() + 1))

client.create_span(name=span.name, span=span)

# Flask integration
from opencensus.ext.flask.flask_middleware import FlaskMiddleware
from opencensus.ext.stackdriver.trace_exporter import StackdriverExporter
from flask import Flask

app = Flask(__name__)

middleware = FlaskMiddleware(
    app,
    exporter=StackdriverExporter(project_id=project_id)
)

@app.route('/')
def index():
    return 'Hello World'
```

## Cloud Profiler

Continuous CPU and memory profiling.

```python
# Python profiler
import googlecloudprofiler

googlecloudprofiler.start(
    service='my-service',
    service_version='1.0.0',
    verbose=3
)

# Application code
def process_data(data):
    # This function will be profiled
    result = expensive_computation(data)
    return result
```

```go
// Go profiler
package main

import (
    "cloud.google.com/go/profiler"
    "log"
)

func main() {
    if err := profiler.Start(profiler.Config{
        Service:        "my-service",
        ServiceVersion: "1.0.0",
    }); err != nil {
        log.Fatalf("Failed to start profiler: %v", err)
    }
    
    // Application code
}
```

## Cloud Debugger

Debug production code without stopping it.

```python
# Enable Cloud Debugger
import googleclouddebugger

googleclouddebugger.enable(
    module='my-module',
    version='1.0.0'
)

# Set breakpoints in Cloud Console
# View variables and stack traces
# Add logpoints without redeploying
```

## Error Reporting

Aggregate and display errors from applications.

```python
from google.cloud import error_reporting

client = error_reporting.Client()

try:
    raise ValueError("Something went wrong!")
except Exception:
    client.report_exception()
```

## Cloud Deployment Manager

Infrastructure as Code for GCP.

```yaml
# deployment.yaml
resources:
- name: my-vm
  type: compute.v1.instance
  properties:
    zone: us-central1-a
    machineType: zones/us-central1-a/machineTypes/n1-standard-1
    disks:
    - deviceName: boot
      boot: true
      autoDelete: true
      initializeParams:
        sourceImage: projects/debian-cloud/global/images/family/debian-11
    networkInterfaces:
    - network: global/networks/default
      accessConfigs:
      - name: External NAT
        type: ONE_TO_ONE_NAT

- name: my-bucket
  type: storage.v1.bucket
  properties:
    location: US
    storageClass: STANDARD
```

```bash
# Create deployment
gcloud deployment-manager deployments create my-deployment \
  --config deployment.yaml

# Update deployment
gcloud deployment-manager deployments update my-deployment \
  --config deployment.yaml

# Delete deployment
gcloud deployment-manager deployments delete my-deployment
```

## Terraform on GCP

```hcl
# main.tf
provider "google" {
  project = "my-project"
  region  = "us-central1"
}

resource "google_compute_instance" "vm" {
  name         = "my-vm"
  machine_type = "n1-standard-1"
  zone         = "us-central1-a"

  boot_disk {
    initialize_params {
      image = "debian-cloud/debian-11"
    }
  }

  network_interface {
    network = "default"
    access_config {}
  }

  metadata_startup_script = <<-EOF
    #! /bin/bash
    apt-get update
    apt-get install -y nginx
  EOF

  tags = ["web-server"]
}

resource "google_compute_firewall" "allow-http" {
  name    = "allow-http"
  network = "default"

  allow {
    protocol = "tcp"
    ports    = ["80", "443"]
  }

  source_ranges = ["0.0.0.0/0"]
  target_tags   = ["web-server"]
}

resource "google_storage_bucket" "static" {
  name     = "my-static-assets"
  location = "US"

  website {
    main_page_suffix = "index.html"
    not_found_page   = "404.html"
  }
}

output "vm_ip" {
  value = google_compute_instance.vm.network_interface[0].access_config[0].nat_ip
}
```

```bash
# Initialize Terraform
terraform init

# Plan changes
terraform plan

# Apply changes
terraform apply

# Destroy resources
terraform destroy
```

## Cloud Scheduler

Cron job scheduler for GCP.

```bash
# Create HTTP job
gcloud scheduler jobs create http my-job \
  --schedule="0 2 * * *" \
  --uri="https://example.com/api/process" \
  --http-method=POST \
  --message-body='{"task":"daily-report"}' \
  --headers="Content-Type=application/json" \
  --time-zone="America/New_York"

# Create Pub/Sub job
gcloud scheduler jobs create pubsub my-pubsub-job \
  --schedule="*/5 * * * *" \
  --topic=my-topic \
  --message-body='{"type":"heartbeat"}'

# Create App Engine job
gcloud scheduler jobs create app-engine my-app-job \
  --schedule="0 0 * * 0" \
  --relative-url="/tasks/weekly-cleanup" \
  --http-method=GET
```

## Cloud Tasks

Asynchronous task execution.

```python
from google.cloud import tasks_v2
import json

client = tasks_v2.CloudTasksClient()
project = 'my-project'
queue = 'my-queue'
location = 'us-central1'

parent = client.queue_path(project, location, queue)

task = {
    'http_request': {
        'http_method': tasks_v2.HttpMethod.POST,
        'url': 'https://example.com/api/process',
        'headers': {'Content-Type': 'application/json'},
        'body': json.dumps({'user_id': 12345}).encode()
    }
}

# Schedule task for 10 minutes from now
import datetime
from google.protobuf import timestamp_pb2

d = datetime.datetime.utcnow() + datetime.timedelta(minutes=10)
timestamp = timestamp_pb2.Timestamp()
timestamp.FromDatetime(d)
task['schedule_time'] = timestamp

response = client.create_task(parent=parent, task=task)
print(f'Created task {response.name}')
```

## Best Practices

1. **Use organizational policies**: Enforce constraints
2. **Implement least privilege**: Grant minimum permissions
3. **Enable audit logging**: Track all changes
4. **Set up monitoring and alerts**: Proactive issue detection
5. **Use labels consistently**: Resource organization and billing
6. **Automate with IaC**: Terraform or Deployment Manager
7. **Implement CI/CD**: Cloud Build for automation
8. **Use Cloud Scheduler**: For recurring tasks
9. **Monitor costs**: Set budgets and alerts
10. **Implement disaster recovery**: Regular backups and testing

GCP's management and monitoring tools provide comprehensive visibility and control over your cloud infrastructure and applications, enabling efficient operations and rapid troubleshooting.
