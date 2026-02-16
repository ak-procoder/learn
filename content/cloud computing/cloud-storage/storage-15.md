---
id: storage-15
title: "Storage Tiers and Classes"
type: text
---

# Storage Tiers and Classes

Cloud storage providers offer multiple tiers optimized for different access patterns and cost requirements.

## Tiering Strategy

**Hot/Frequent Access**:
- Highest storage cost
- Lowest access cost
- Millisecond access
- Active data

**Cool/Infrequent Access**:
- Lower storage cost
- Higher access cost
- 30-day minimum retention
- Backups, older data

**Archive/Cold**:
- Lowest storage cost
- Highest access cost
- Long-term retention
- Compliance data

## AWS S3 Storage Classes

**Standard**: $0.023/GB
**Standard-IA**: $0.0125/GB (30-day min)
**Intelligent-Tiering**: Auto-optimization
**Glacier Instant**: $0.004/GB, instant retrieval
**Glacier Flexible**: $0.0036/GB, 1-5 min retrieval
**Glacier Deep Archive**: $0.00099/GB, 12-hour retrieval

## Azure Blob Storage Tiers

**Hot**: $0.0184/GB
**Cool**: $0.01/GB (30-day min)
**Archive**: $0.002/GB (180-day min, hours to rehydrate)

## Google Cloud Storage Classes

**Standard**: $0.020/GB
**Nearline**: $0.010/GB (30-day min)
**Coldline**: $0.004/GB (90-day min)
**Archive**: $0.0012/GB (365-day min)

## Choosing the Right Tier

Consider:
- **Access Frequency**: How often is data accessed?
- **Access Latency**: How quickly is data needed?
- **Retention Period**: How long is data stored?
- **Cost Sensitivity**: Storage vs. retrieval costs
- **Compliance**: Regulatory requirements

## Automatic Tiering

**S3 Intelligent-Tiering**: Automatically moves objects
**Lifecycle Policies**: Rule-based transitions
**Azure Lifecycle Management**: Automated tiering

Strategic use of storage tiers can reduce costs by 70% or more.
