---
id: provider-22
title: Azure Pricing
type: text
---

# Azure Pricing

Understanding Azure pricing is essential for optimizing cloud costs and managing budgets effectively. Azure offers flexible pricing models, cost management tools, and various ways to reduce expenses while maintaining performance.

## Azure Pricing Models

### Pay-As-You-Go

**Characteristics:**
- No upfront costs
- No termination fees
- Pay by the minute or hour
- Ideal for unpredictable workloads

**When to Use:**
- Development and testing
- Variable workloads
- Short-term projects
- Proof of concepts

### Reserved Instances

Commit to 1 or 3-year terms for significant savings.

**Savings:**
- **1 Year:** Up to 40% off pay-as-you-go
- **3 Year:** Up to 72% off pay-as-you-go

**Payment Options:**
- All upfront
- Monthly payments
- No upfront

**Supported Services:**
- Virtual Machines
- SQL Database
- Cosmos DB
- Synapse Analytics
- App Service
- Azure VMware Solution

```plaintext
Example: Standard D2s v3 VM (East US)
Pay-As-You-Go: $0.096/hour = $840.96/year

Reserved Instance (1 year, all upfront):
$504.00/year (40% savings = $336.96)

Reserved Instance (3 year, all upfront):
$302.40/year (64% savings = $537.56)
```

### Azure Hybrid Benefit

Leverage existing on-premises licenses.

**Benefits:**
- Use existing Windows Server licenses
- Use existing SQL Server licenses
- Up to 85% savings on compute costs

**Requirements:**
- Active Software Assurance or equivalent subscription
- Windows Server Datacenter or Standard
- SQL Server Enterprise or Standard

```plaintext
Example: SQL Database (8 vCores, Business Critical)
Pay-As-You-Go: $2.90/hour

With Hybrid Benefit: $1.16/hour
Savings: 60% = $15,254/year
```

### Spot Virtual Machines

Use excess Azure capacity at significant discounts.

**Characteristics:**
- Up to 90% discount
- Can be evicted with 30-second notice
- Best for fault-tolerant workloads

**Use Cases:**
- Batch processing
- Dev/test environments
- Data analysis
- CI/CD workloads
- Rendering

```bash
# Create Spot VM
az vm create \
  --resource-group myResourceGroup \
  --name mySpotVM \
  --image UbuntuLTS \
  --priority Spot \
  --max-price 0.05 \
  --eviction-policy Deallocate
```

### Azure Savings Plans

Flexible pricing model with commitment to consistent usage.

**Types:**

**Compute Savings Plan:**
- Commitment: $/hour for 1 or 3 years
- Applies to: VM, App Service, Container Instances, Functions Premium
- Flexibility: Any instance family, region, OS
- Savings: Up to 65%

**Example:**
```plaintext
Hourly Commitment: $10/hour (1 year)
Annual Cost: $87,600
vs. Pay-As-You-Go: ~$146,000
Savings: ~ $58,400 (40%)
```

## Service-Specific Pricing

### Virtual Machines

**Pricing Components:**
- **Compute:** Based on VM size and usage time
- **Storage:** Managed disks attached
- **Networking:** Bandwidth egress
- **IP Address:** Public IP addresses

**Example Calculation:**
```plaintext
Standard D2s v3 (2 vCPU, 8 GB RAM) - East US
Compute: $0.096/hour × 730 hours = $70.08
OS Disk (128 GB Premium SSD): $19.71
Public IP: $3.65
Bandwidth (100 GB): $8.70

Monthly Total: $102.14
```

### Azure Storage

**Blob Storage Pricing (Hot tier, East US):**
```plaintext
Storage: $0.0184/GB/month
Write operations: $0.05 per 10,000
Read operations: $0.004 per 10,000
Data transfer (first 100 GB): Free
Data transfer (100 GB - 10 TB): $0.087/GB

Example (1 TB storage, 100K writes, 1M reads, 500 GB egress):
Storage: 1,024 × $0.0184 = $18.84
Writes: (100,000 / 10,000) × $0.05 = $0.50
Reads: (1,000,000 / 10,000) × $0.004 = $0.40
Transfer: 400 GB × $0.087 = $34.80

Monthly Total: $54.54
```

### Azure SQL Database

**vCore Model (General Purpose, 4 vCores, East US):**
```plaintext
Compute: $0.542/hour × 730 hours = $395.66
Storage: 100 GB × $0.115 = $11.50
Backup (50 GB): 50 GB × $0.095 = $4.75

Monthly Total: $411.91

With 1-year Reserved:
Compute: $0.325/hour × 730 = $237.25
Monthly Total: $253.50 (38% savings)
```

### Azure Kubernetes Service (AKS)

**Pricing:**
- Control plane: FREE
- Worker nodes: Standard VM pricing
- OS disks: Managed disk pricing
- Load balancer: Standard Load Balancer pricing

```plaintext
Example: 3-node cluster (Standard D2s v3)
Nodes: 3 × $70.08 = $210.24
OS Disks: 3 × $19.71 = $59.13
Load Balancer: $39.42

Monthly Total: $308.79
```

### Azure App Service

**Pricing Tiers:**

| Tier | vCPU | RAM | Price/month | Use Case |
|------|------|-----|-------------|----------|
| Free | Shared | 1 GB | Free | Dev/test |
| Basic B1 | 1 | 1.75 GB | $54.75 | Small apps |
| Standard S1 | 1 | 1.75 GB | $73 | Production |
| Premium P1v3 | 2 | 8 GB | $219 | Enterprise |

### Bandwidth Pricing

**Data Transfer:**

```plaintext
Inbound: FREE (data coming into Azure)

Outbound (Internet):
- First 100 GB/month: FREE
- 100 GB - 10 TB: $0.087/GB
- 10 TB - 50 TB: $0.083/GB
- 50 TB - 150 TB: $0.07/GB
- 150 TB - 500 TB: $0.05/GB
- Over 500 TB: Contact sales

Same Region: FREE
Between Regions: $0.02/GB
```

## Azure Cost Management

### Cost Analysis

View and analyze costs.

```bash
# Get current month costs
az costmanagement query \
  --type Usage \
  --dataset-granularity Daily \
  --timeframe MonthToDate \
  --dataset-aggregation "totalCost=sum(PreTaxCost)"
```

**Features:**
- Cost by service, resource group, tag
- Forecasting
- Historical trends
- Export data

### Budgets and Alerts

```bash
# Create budget
az consumption budget create \
  --resource-group myResourceGroup \
  --budget-name MonthlyBudget \
  --amount 1000 \
  --time-grain Monthly \
  --start-date 2026-01-01 \
  --end-date 2026-12-31 \
  --time-period Q1
```

**Alert Thresholds:**
- 80% of budget
- 100% of budget
- Forecasted to exceed budget

### Tags for Cost Tracking

```bash
# Apply tags to resources
az resource tag \
  --tags Environment=Production CostCenter=Engineering Project=WebApp \
  --ids /subscriptions/{subscription-id}/resourceGroups/{resource-group}/providers/Microsoft.Compute/virtualMachines/{vm-name}
```

**Common Tagging Strategy:**
- **Environment:** Production, Staging, Development
- **CostCenter:** Department or team
- **Project:** Project name
- **Owner:** Email of responsible person
- **BusinessUnit:** Business division

### Azure Advisor Cost Recommendations

**Common Recommendations:**
- Resize or shutdown underutilized VMs
- Delete unattached disks
- Reserve instances for steady workloads
- Use Standard HDD instead of Premium SSD
- Right-size databases
- Delete idle resources

```bash
# Get cost recommendations
az advisor recommendation list \
  --category Cost \
  --output table
```

## Azure Pricing Calculator

Web-based tool to estimate Azure costs:

**URL:** https://azure.microsoft.com/pricing/calculator/

**Features:**
- Add multiple services
- Configure settings
- See monthly estimates
- Save and share estimates
- Export to Excel

**Example Estimate:**
```plaintext
Services Added:
- 2 × Virtual Machines (D2s v3): $140.16
- Azure SQL Database (4 vCores): $395.66
- Azure Storage (500 GB): $27.27
- Application Gateway: $146.88

Estimated Monthly Cost: $709.97
With Reserved Instances: $504.32 (29% savings)
```

## Total Cost of Ownership (TCO) Calculator

Compare on-premises vs. Azure costs:

**URL:** https://azure.microsoft.com/pricing/tco/calculator/

**Inputs:**
- Current infrastructure (servers, storage, networking)
- Workload characteristics
- Labor costs
- Data center costs
- Electricity and cooling

**Outputs:**
- 5-year cost comparison
- Savings breakdown
- Detailed report

## Cost Optimization Strategies

### Compute Optimization

1. **Right-sizing:**
   - Monitor CPU/memory utilization
   - Resize VMs to match workload
   - Use Azure Advisor recommendations

2. **Auto-scaling:**
   - Scale out during peak hours
   - Scale in during off-hours
   - Use VM Scale Sets

3. **Dev/Test Pricing:**
   - Special discounted rates
   - Up to 55% off enterprise subscriptions
   - For non-production workloads

4. **Start/Stop Automation:**
   ```powershell
   # Start VMs during business hours
   $RG = "myResourceGroup"
   $VMs = Get-AzVM -ResourceGroupName $RG
   
   if ((Get-Date).Hour -eq 8) {
       foreach ($VM in $VMs) {
           Start-AzVM -ResourceGroupName $RG -Name $VM.Name
       }
   }
   
   # Stop VMs after hours
   if ((Get-Date).Hour -eq 18) {
       foreach ($VM in $VMs) {
           Stop-AzVM -ResourceGroupName $RG -Name $VM.Name -Force
       }
   }
   ```

### Storage Optimization

1. **Lifecycle Management:**
   - Move to cool tier after 30 days
   - Move to archive tier after 90 days
   - Delete after 365 days

2. **Delete Snapshots:**
   - Remove old snapshots
   - Keep only required retention

3. **Compression:**
   - Compress data before upload
   - Reduce storage costs

### Database Optimization

1. **Elastic Pools:**
   - Share resources among databases
   - Save up to 70%

2. **Serverless Tier:**
   - Auto-pause during inactivity
   - Pay only for compute used

3. **Reserved Capacity:**
   - Commit for savings
   - Up to 65% off

### Network Optimization

1. **Content Delivery Network (CDN):**
   - Reduce origin bandwidth
   - Cache static content

2. **ExpressRoute:**
   - Predictable data transfer costs
   - Can be cheaper at scale

3. **VNet Peering:**
   - Lower than VPN Gateway costs
   - Better performance

## Free Tier Services

**Always Free:**
- App Service (10 web apps)
- Functions (1M requests/month)
- Cosmos DB (25 GB, 1000 RU/s)
- Blob Storage (5 GB locally redundant)
- File Storage (5 GB)
- Managed Disks (2 × 64 GB)

**12 Months Free:**
- Virtual Machines (750 hours B1s Linux + Windows)
- Managed Disks (2 × 64 GB + 2 × 128 GB)
- Blob Storage (5 GB LRS hot)
- SQL Database (250 GB)
- Azure Cosmos DB (25 GB)

## Best Practices

1. **Monitor costs regularly**: Daily reviews in early stages
2. **Set budgets and alerts**: Prevent surprise bills
3. **Use tags consistently**: Track and allocate costs
4. **Leverage reservations**: For predictable workloads
5. **Delete unused resources**: Regular cleanup
6. **Use Azure Hybrid Benefit**: Maximize license value
7. **Optimize storage tiers**: Match to access patterns
8. **Review Advisor recommendations**: Weekly reviews
9. **Use Dev/Test subscriptions**: For non-production
10. **Scale appropriately**: Not too big, not too small
11. **Automate shutdowns**: For non-24/7 resources
12. **Choose the right region**: Prices vary by region
13. **Use serverless**: Pay only for what you use
14. **Monitor bandwidth**: Can be significant cost
15. **Regular architecture reviews**: Continuous optimization

Understanding Azure pricing and implementing cost optimization strategies can significantly reduce cloud expenses while maintaining performance and reliability.
