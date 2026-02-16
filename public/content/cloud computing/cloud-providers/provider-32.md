---
id: provider-32
title: GCP - Pricing and Cost Optimization
type: text
---

# GCP - Pricing and Cost Optimization

Understanding GCP pricing models and implementing cost optimization strategies can significantly reduce your cloud spending while maintaining performance.

## Pricing Models

### Pay-As-You-Go

**Per-Second Billing:**
- Most GCP services bill per second (minimum 1 minute)
- No upfront costs
- No termination fees
- Pay only for what you use

**Example Compute Engine pricing (us-central1):**
- e2-standard-2: $0.067/hour (~$48.91/month)
- n2-standard-4: $0.194/hour (~$141.62/month)
- c2-standard-8: $0.358/hour (~$261.34/month)

### Committed Use Discounts (CUDs)

Commit to minimum usage for 1 or 3 years:

| Resource Type | 1-Year Discount | 3-Year Discount |
|---------------|-----------------|-----------------|
| **General Purpose VMs** | 37% | 55% |
| **Compute-Optimized VMs** | 37% | 55% |
| **Memory-Optimized VMs** | 37% | 55% |
| **GPU** | 36% | 52% |

```bash
# Create commitment
gcloud compute commitments create my-commitment \
  --region=us-central1 \
  --plan=twelve-month \
  --resources=vcpu=100,memory=400GB

# List commitments
gcloud compute commitments list
```

### Sustained Use Discounts (SUDs)

**Automatic discounts** for running VMs:
- No commitment required
- Applied automatically
- Up to 30% discount
- Based on monthly usage

| Usage Level | Discount |
|-------------|----------|
| 25% of month | 0% |
| 50% of month | 10% |
| 75% of month | 20% |
| 100% of month | 30% |

### Preemptible and Spot VMs

**Preemptible VMs:**
- Up to 80% discount
- Maximum 24-hour runtime
- Can be terminated anytime
- 30-second shutdown warning

**Spot VMs** (newer):
- Similar to Preemptible
- No maximum runtime
- Dynamic pricing

```bash
# Create Spot VM
gcloud compute instances create spot-instance \
  --zone=us-central1-a \
  --machine-type=e2-medium \
  --provisioning-model=SPOT \
  --instance-termination-action=DELETE
```

**Use cases:**
- Batch processing
- Data analysis
- Rendering
- CI/CD workloads
- Fault-tolerant applications

## Service-Specific Pricing

### Compute Engine

**Machine types:**
```plaintext
e2-micro: $0.0084/hour (~$6.11/month)
e2-small: $0.0168/hour (~$12.26/month)
e2-medium: $0.0335/hour (~$24.45/month)
e2-standard-2: $0.067/hour (~$48.91/month)
n2-standard-4: $0.194/hour (~$141.62/month)
c2-standard-8: $0.358/hour (~$261.34/month)
m2-ultramem-208: $41.436/hour (~$30,248/month)
```

**Storage:**
- Standard Persistent Disk: $0.040/GB/month
- Balanced Persistent Disk: $0.100/GB/month
- SSD Persistent Disk: $0.170/GB/month
- Local SSD: $0.080/GB/month

**Network:**
- Ingress: Free
- Egress same zone: Free
- Egress same region: $0.01/GB
- Egress to US/Canada: $0.085-$0.23/GB
- Egress worldwide: $0.085-$0.23/GB

### Cloud Storage

| Storage Class | Price/GB/Month | Retrieval Fee | Minimum Storage |
|---------------|----------------|---------------|-----------------|
| **Standard** | $0.020-$0.023 | $0 | None |
| **Nearline** | $0.010 | $0.01/GB | 30 days |
| **Coldline** | $0.004 | $0.02/GB | 90 days |
| **Archive** | $0.0012 | $0.05/GB | 365 days |

**Operations:**
- Class A (write): $0.05/10,000 ops
- Class B (read): $0.004/10,000 ops

**Network egress:**
- To Compute Engine (same region): Free
- To internet: $0.085-$0.23/GB

### Cloud SQL

**PostgreSQL/MySQL instance pricing (us-central1):**
```plaintext
db-f1-micro (0.6 GB RAM): $9.37/month
db-g1-small (1.7 GB RAM): $25.13/month
db-n1-standard-1 (3.75 GB RAM): $51.55/month
db-n1-standard-2 (7.5 GB RAM): $103.11/month
db-n1-standard-4 (15 GB RAM): $206.22/month
```

**Storage:**
- SSD: $0.17/GB/month
- HDD: $0.09/GB/month
- Backups: $0.08/GB/month

**HA instances:** 2x compute price

### BigQuery

**Analysis pricing:**
- **On-demand**: $5/ TB processed (first 1 TB/month free)
- **Flat-rate**: $2,000/month for 100 slots (reserved capacity)
- **Flex slots**: $0.04/slot/hour (minimum 100 slots)

**Storage pricing:**
- **Active**: $0.020/GB/month (first 10 GB free)
- **Long-term** (90+ days): $0.010/GB/month

**Streaming inserts:** $0.01/200 MB

**Best practices to reduce costs:**
1. Use partitioned tables
2. Cluster frequently filtered columns
3. Select only needed columns
4. Use query cost estimator before running
5. Materialize large, frequently used queries

### Cloud Functions

**Invocations:**
- First 2 million/month: Free
- Additional: $0.40/million

**Compute time:**
| Memory | Price/100ms |
|--------|-------------|
| 128 MB | $0.000000231 |
| 256 MB | $0.000000463 |
| 512 MB | $0.000000925 |
| 1024 MB | $0.000001650 |
| 2048 MB | $0.000002900 |

**Free tier monthly:**
- 2M invocations
- 400,000 GB-seconds compute
- 200,000 GHz-seconds compute
- 5 GB egress

### Cloud Run

**CPU and Memory:**
- vCPU: $0.00002400/vCPU-second
- Memory: $0.00000250/GB-second

**Requests:**
- Free: 2 million requests/month
- Additional: $0.40/million

**Example cost calculation:**
```
Service: 100,000 requests/day
Duration: 200ms average
Memory: 512 MB
CPU: 1 vCPU (allocated during request)

Monthly cost:
- Requests: 3M × $0.40/M = $1.20
- CPU: (3M × 0.2s × 1 vCPU × $0.000024) = $14.40
- Memory: (3M × 0.2s × 0.5 GB × $0.0000025) = $0.75
Total: ~$16.35/month
```

### GKE

**Cluster management:**
- **Autopilot**: No cluster management fee
- **Standard**: $0.10/cluster/hour (~$73/month)

**Compute:**
- Billed per node (same as Compute Engine)
- Pay for actual node instances

**Autopilot** pricing example:
- 4 vCPU, 16 GB RAM: ~$116/month
- includes pod bin-packing
- No wasted capacity

## Cost Management Tools

### Budgets and Alerts

```bash
# Create budget
cat > budget.json << EOF
{
  "displayName": "Monthly Budget",
  "budgetFilter": {
    "projects": ["projects/PROJECT_NUMBER"]
  },
  "amount": {
    "specifiedAmount": {
      "currencyCode": "USD",
      "units": "1000"
    }
  },
  "thresholdRules": [
    {
      "thresholdPercent": 0.5,
      "spendBasis": "CURRENT_SPEND"
    },
    {
      "thresholdPercent": 0.9,
      "spendBasis": "CURRENT_SPEND"
    },
    {
      "thresholdPercent": 1.0,
      "spendBasis": "CURRENT_SPEND"
    }
  ]
}
EOF

gcloud billing budgets create --billing-account=BILLING_ACCOUNT_ID \
  --display-name="Monthly Budget" \
  --budget-amount=1000USD \
  --threshold-rule=percent=0.5 \
  --threshold-rule=percent=0.9 \
  --threshold-rule=percent=1.0
```

### Billing Export

```bash
# Export to BigQuery
gcloud beta billing accounts get-aggregated-usage \
  --billing-account=BILLING_ACCOUNT_ID \
  --format=json | \
  bq load --source_format=NEWLINE_DELIMITED_JSON \
  my_dataset.billing_export -
```

### Pricing Calculator

Online tool: https://cloud.google.com/products/calculator

**Example calculation for web application:**
```
Components:
- 3 × n2-standard-2 VMs (load balanced)
- 1 × Cloud SQL db-n1-standard-1
- 100 GB Cloud Storage
- 1 TB BigQuery analysis
- 500 GB egress

Estimated monthly cost: ~$350-400
```

### Recommender

AI-powered cost optimization recommendations:

```bash
# List recommendations
gcloud recommender recommendations list \
  --project=PROJECT_ID \
  --location=global \
  --recommender=google.compute.commitment.UsageCommitmentRecommender

# Apply recommendation
gcloud recommender recommendations mark-claimed RECOMMENDATION_ID \
  --project=PROJECT_ID \
  --location=global \
  --recommender=google.compute.commitment.UsageCommitmentRecommender
```

**Recommendation types:**
- Idle VM instances
- Overprovisioned VM instances
- Committed use discounts
- Idle persistent disks
- Snapshot retention
- IP address usage

## Cost Optimization Strategies

### Compute Optimization

1. **Right-size VMs:**
```bash
# Check VM recommendations
gcloud recommender recommendations list \
  --project=PROJECT_ID \
  --location=us-central1 \
  --recommender=google.compute.instance.MachineTypeRecommender
```

2. **Use Spot/Preemptible VMs** for fault-tolerant workloads

3. **Implement autoscaling:**
```bash
gcloud compute instance-groups managed set-autoscaling web-group \
  --max-num-replicas=10 \
  --min-num-replicas=2 \
  --target-cpu-utilization=0.75
```

4. **Schedule VMs** for dev/test environments:
```bash
# Stop VMs during off-hours
gcloud scheduler jobs create http stop-dev-vms \
  --schedule="0 18 * * 1-5" \
  --uri="https://compute.googleapis.com/compute/v1/projects/PROJECT/zones/ZONE/instances/INSTANCE/stop" \
  --http-method=POST
```

### Storage Optimization

1. **Use lifecycle policies:**
```bash
gsutil lifecycle set lifecycle-policy.json gs://my-bucket
```

2. **Enable Autoclass:**
```bash
gsutil autoclass set on gs://my-bucket
```

3. **Delete old snapshots:**
```bash
# Delete snapshots older than 30 days
gcloud compute snapshots list --format="value(name,creationTimestamp)" | \
  awk '{if ($2 < "TIMEDATE") print $1}' | \
  xargs -I {} gcloud compute snapshots delete {} --quiet
```

### Network Optimization

1. **Use Cloud CDN** for static content
2. **Keep traffic within same region** when possible
3. **Use Premium Tier** only when needed
4. **Implement Cloud NAT** to reduce external IPs

### Database Optimization

1. **Use appropriate instance size**
2. **Enable automated backups only if needed**
3. **Delete old backups**
4. **Use read replicas** instead of larger instances
5. **Consider Cloud Spanner** only for global requirements

### BigQuery Optimization

1. **Partition tables** by date:
```sql
CREATE TABLE dataset.table
PARTITION BY DATE(timestamp)
AS SELECT * FROM source_table;
```

2. **Cluster tables:**
```sql
CREATE TABLE dataset.table
PARTITION BY DATE(timestamp)
CLUSTER BY customer_id, product_id
AS SELECT * FROM source_table;
```

3. **Preview query costs:**
```bash
bq query --dry_run --use_legacy_sql=false 'SELECT * FROM dataset.table'
```

### Label Everything

```bash
# Add labels to resources
gcloud compute instances add-labels my-vm \
  --labels=environment=production,team=backend,cost-center=engineering

# Filter billing by labels
# View in Cloud Console → Billing → Reports → Filter by labels
```

## Free Tier

**Always Free** (within limits):
- 1 f1-micro VM instance/month (US regions)
- 30 GB HDD persistent disk
- 5 GB Cloud Storage
- 1 GB Cloud Functions invocations
- 1 GB BigQuery analysis
- 10 GB BigQuery storage
- 2M Cloud Run requests

**12-month $300 credit** for new customers

## Best Practices

1. **Use committed use discounts** for steady-state workloads
2. **Implement resource labels** for cost tracking
3. **Set up budgets and alerts** proactively
4. **Export billing to BigQuery** for analysis
5. **Review Recommender suggestions** monthly
6. **Right-size resources** continuously
7. **Use Spot VMs** for batch workloads
8. **Enable autoscaling** to match demand
9. **Clean up unused resources** regularly
10. **Monitor costs daily** in Cloud Console

Understanding and optimizing GCP costs requires ongoing monitoring and adjustment. Use the available tools and follow best practices to maximize value from your cloud investment.
