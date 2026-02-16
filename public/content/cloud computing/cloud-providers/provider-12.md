---
id: provider-12
title: AWS Pricing and Billing
type: text
---

# AWS Pricing and Billing

Understanding AWS pricing and billing is crucial for optimizing costs and managing cloud expenses effectively. AWS offers flexible pricing models, detailed billing tools, and cost optimization services.

## AWS Pricing Principles

### Pay-As-You-Go
- No upfront costs or long-term contracts
- Pay only for what you use
- Stop using, stop paying
- Ideal for unpredictable workloads

### Save When You Commit
- Reserved Instances (1 or 3-year terms)
- Savings Plans (flexible commitment)
- Up to 75% savings compared to On-Demand

### Pay Less by Using More
- Volume-based discounts
- Tiered pricing (S3, data transfer)
- More usage = lower per-unit cost

### Free Tier
- Always Free (DynamoDB 25GB, Lambda 1M requests/month)
- 12 Months Free (EC2 750 hours/month t2.micro)
- Trials (SageMaker, Redshift)

## Service Pricing Models

### EC2 Pricing

**On-Demand Instances**
```plaintext
t3.medium in us-east-1:
- Linux: $0.0416/hour
- Windows: $0.0834/hour

Annual cost (24/7):
- Linux: $0.0416 × 24 × 365 = $364.42
- Windows: $0.0834 × 24 × 365 = $730.58
```

**Reserved Instances**
| Term | Payment | Discount |
|------|---------|----------|
| 1 Year | All Upfront | 40% |
| 1 Year | Partial Upfront | 38% |
| 1 Year | No Upfront | 35% |
| 3 Year | All Upfront | 60% |
| 3 Year | Partial Upfront | 58% |
| 3 Year | No Upfront | 54% |

**Spot Instances**
- Up to 90% discount
- Variable pricing based on supply/demand
- Can be interrupted with 2-minute notice
- Best for fault-tolerant workloads

**Savings Plans**
```plaintext
Compute Savings Plans:
- Commitment: $10/hour for 1 or 3 years
- Flexibility: Any instance, region, OS
- Discount: Up to 66%

EC2 Instance Savings Plans:
- Commitment: Specific instance family in region
- Discount: Up to 72%
- Less flexible than Compute
```

### S3 Pricing

**Storage Costs (us-east-1)**
| Storage Class | First 50 TB/month |
|---------------|-------------------|
| S3 Standard | $0.023/GB |
| S3 Standard-IA | $0.0125/GB |
| S3 One Zone-IA | $0.01/GB |
| S3 Glacier Instant Retrieval | $0.004/GB |
| S3 Glacier Flexible Retrieval | $0.0036/GB |
| S3 Glacier Deep Archive | $0.00099/GB |

**Additional Costs**
- **Requests**: PUT/COPY/POST/LIST $0.005/1,000 requests
- **Data Retrieval**: Varies by storage class
- **Data Transfer Out**: $0.09/GB (first 10 TB/month)

**Example Calculation**
```plaintext
Scenario: 100 GB in S3 Standard
- Storage: 100 GB × $0.023 = $2.30/month
- PUT requests: 10,000 × $0.005/1,000 = $0.05
- GET requests: 100,000 × $0.0004/1,000 = $0.04
- Data transfer out: 50 GB × $0.09 = $4.50

Total: $8.89/month
```

### RDS Pricing

**Components:**
- **Instance hours**: Based on instance type
- **Database storage**: Per GB per month
- **Backup storage**: Exceeding database size
- **Data transfer**: Inter-region and internet
- **IOPS**: For provisioned IOPS

**Example: db.t3.medium MySQL**
```plaintext
- Instance: $0.068/hour × 730 hours = $49.64/month
- Storage: 100 GB × $0.115 = $11.50/month
- Backup: 50 GB × $0.095 = $4.75/month
- Total: $65.89/month

With 1-year Reserved Instance (all upfront):
- Instance: $0.041/hour × 730 = $29.93/month
- 40% savings on compute
```

### Lambda Pricing

**Request Pricing**
- First 1 million requests/month: Free
- $0.20 per 1 million requests thereafter

**Duration Pricing**
- $0.0000166667 per GB-second
- 400,000 GB-seconds free per month

**Example Calculation**
```plaintext
Function: 512 MB memory, 100ms execution
Monthly invocations: 10 million

Requests: (10M - 1M free) × $0.20/1M = $1.80
Duration: 
- GB-seconds: 10M × 0.1s × 0.5GB = 500,000 GB-seconds
- Cost: (500,000 - 400,000) × $0.0000166667 = $1.67
Total: $3.47/month
```

### Data Transfer Pricing

**General Rules:**
- **Inbound**: Free (data into AWS)
- **Within same region**: Free (most cases)
- **Between regions**: $0.01-0.02/GB
- **Outbound to internet**: Tiered pricing

**Internet Data Transfer Out**
| Volume | Price/GB |
|--------|----------|
| First 10 TB | $0.09 |
| Next 40 TB | $0.085 |
| Next 100 TB | $0.07 |
| Next 350 TB | $0.05 |
| Over 500 TB | $0.05 |

**CloudFront reduces costs**: $0.085/GB for first 10 TB

## Cost Management Tools

### AWS Cost Explorer

**Features:**
- Visualize spending patterns
- Forecast future costs
- Filter by service, region, tag
- Monthly and daily granularity
- Custom reports

**Use Cases:**
- Identify cost anomalies
- Track Reserved Instance utilization
- Analyze spending trends
- Create cost allocation reports

**API Access:**
```python
import boto3
from datetime import datetime, timedelta

ce = boto3.client('ce')

end = datetime.now().date()
start = end - timedelta(days=30)

response = ce.get_cost_and_usage(
    TimePeriod={
        'Start': str(start),
        'End': str(end)
    },
    Granularity='DAILY',
    Metrics=['UnblendedCost'],
    GroupBy=[
        {'Type': 'DIMENSION', 'Key': 'SERVICE'}
    ]
)
```

### AWS Budgets

Set custom cost and usage budgets with alerts.

**Budget Types:**
1. **Cost Budget**: Track spending
2. **Usage Budget**: Track service usage
3. **Reservation Budget**: RI utilization
4. **Savings Plans Budget**: SP utilization

**Budget Actions:**
```plaintext
Alert Thresholds:
- 80% of budget → Email notification
- 100% of budget → SNS notification
- 120% of budget → Apply IAM policy (restrict actions)
```

**Example Budget:**
```json
{
  "BudgetName": "Monthly-EC2-Budget",
  "BudgetLimit": {
    "Amount": "1000",
    "Unit": "USD"
  },
  "TimeUnit": "MONTHLY",
  "BudgetType": "COST",
  "CostFilters": {
    "Service": ["Amazon Elastic Compute Cloud - Compute"]
  }
}
```

### Cost Allocation Tags

Organize and track costs by project, department, or environment.

**Tag Types:**
- **User-Defined Tags**: Custom tags you create
- **AWS-Generated Tags**: Automatically applied

**Best Practices:**
```plaintext
Tagging Strategy:
- Environment: Production, Staging, Development
- Project: ProjectName
- CostCenter: Finance, Engineering, Marketing
- Owner: TeamName or Email
- Application: AppName
```

**Cost Allocation Report:**
```csv
Service,Environment,Project,Cost
EC2,Production,WebApp,$500
RDS,Production,WebApp,$200
S3,Development,DataPipeline,$50
```

### AWS Cost Anomaly Detection

AI-powered anomaly detection for unusual spending.

**Features:**
- Machine learning analysis
- Automatic anomaly detection
- Root cause analysis
- Custom monitors
- Alert configuration

```plaintext
Anomaly Detected:
Service: Amazon EC2
Expected: $100/day
Actual: $500/day
Impact: $400 over expected
Potential Cause: New t3.large instances launched
```

## Reserved Instances and Savings Plans

### Reserved Instance Marketplace

- Sell unused Reserved Instances
- Buy third-party RIs at lower prices
- Flexibility for changing needs

### Convertible Reserved Instances

- Exchange for different instance types
- Maintain discount benefits
- Adapt to changing requirements

### Savings Plans Flexibility

**Compute Savings Plans:**
```plaintext
Commitment: $10/hour

Can be used for:
- EC2 (any instance, any region, any OS)
- Fargate
- Lambda

Automatically applies to lowest cost usage first
```

## Billing and Payment

### Consolidated Billing

**AWS Organizations Feature:**
- Single payment method
- Combined usage for volume discounts
- Detailed cost reports per account
- Cost allocation by account or OU

**Volume Discount Example:**
```plaintext
Account A: 8 TB S3 transfer = $0.09/GB
Account B: 5 TB S3 transfer = $0.09/GB
Combined: 13 TB = First 10 TB @ $0.09, Next 3 TB @ $0.085

Savings from volume discount
```

### AWS Billing Dashboard

**Features:**
- Month-to-date spending
- Forecast for month-end
- Previous month comparison
- Service breakdown
- Free tier usage tracking

### AWS Cost and Usage Report

Most detailed billing report available.

**Features:**
- Hourly, daily, or monthly data
- Line-item detail
- Resource IDs
- Reserved Instance details
- Savings Plans information
- Delivered to S3

**Use Cases:**
- Custom analytics
- Showback/chargeback
- Integration with third-party tools
- Detailed audit trail

## Cost Optimization Strategies

### Compute Optimization

1. **Right-sizing**: Match instance size to workload
2. **Auto Scaling**: Scale based on demand
3. **Spot Instances**: Fault-tolerant workloads
4. **Graviton Instances**: ARM-based, 40% better price-performance
5. **Lambda**: Serverless for intermittent workloads

### Storage Optimization

1. **S3 Lifecycle Policies**: Transition to cheaper storage classes
2. **S3 Intelligent-Tiering**: Automatic optimization
3. **Delete unused snapshots**: Regular cleanup
4. **EBS optimization**: Delete unattached volumes
5. **Compression**: Reduce storage requirements

### Database Optimization

1. **Reserved Instances**: For production databases
2. **Aurora Serverless**: Variable workloads
3. **Read Replicas**: Offload read traffic
4. **Right-sizing**: Adjust instance size
5. **Backup retention**: Optimize retention policies

### Network Optimization

1. **CloudFront**: Cache content, reduce data transfer
2. **S3 Transfer Acceleration**: Optimize long-distance transfers
3. **VPC Endpoints**: Avoid internet gateway charges
4. **Regional deployments**: Minimize cross-region traffic
5. **Direct Connect**: Predictable, consistent data transfer

### AWS Cost Optimization Tools

**AWS Compute Optimizer**
- ML-powered recommendations
- Right-sizing for EC2, Auto Scaling, EBS, Lambda
- Historical resource usage analysis

**AWS Trusted Advisor**
- Idle and underutilized resources
- Reserved Instance recommendations
- Savings opportunities

## Best Practices

1. **Track spending regularly**: Use Cost Explorer daily
2. **Set budgets**: Create alerts for overspending
3. **Tag everything**: Consistent tagging strategy
4. **Use Reserved Instances**: For steady-state workloads
5. **Monitor unused resources**: Regular cleanup
6. **Leverage the free tier**: Maximize free tier usage
7. **Choose the right region**: Consider pricing differences
8. **Optimize data transfer**: Minimize cross-region and internet transfers
9. **Review monthly**: Regular cost reviews and optimization
10. **Educate team**: Ensure team understands cost implications

## Common Pitfalls

1. **Leaving resources running**: Unused EC2 instances, databases
2. **Ignoring data transfer costs**: Can be significant
3. **Not using Reserved Instances**: Missing 40-75% savings
4. **Unattached EBS volumes**: Paying for unused storage
5. **Old snapshots**: Accumulating storage costs
6. **Development in production**: Using expensive resources for dev/test
7. **No budget alerts**: Surprise bills
8. **Missing tags**: Unable to track costs by project
9. **Ignoring recommendations**: Trusted Advisor, Compute Optimizer
10. **One-size-fits-all**: Not right-sizing resources

Understanding AWS pricing and implementing cost management practices is essential for running cost-effective cloud operations. Regular monitoring, optimization, and leveraging AWS cost tools can significantly reduce your cloud expenses.
