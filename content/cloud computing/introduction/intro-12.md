---
id: intro-12
title: Cloud Service Level Agreements (SLAs)
type: text
---

## What is an SLA?

**Definition**: A formal agreement between cloud provider and customer defining service expectations and commitments.

**Purpose**:
- Define service availability guarantees
- Establish performance metrics
- Specify compensation for service failures

## Key SLA Metrics

### Availability (Uptime)

**Measurement**: Percentage of time service is operational

**Common Levels**:
- 99.9% (Three nines) = 43.8 minutes downtime/month
- 99.95% = 21.9 minutes downtime/month
- 99.99% (Four nines) = 4.38 minutes downtime/month
- 99.999% (Five nines) = 26.3 seconds downtime/month

### Performance

**Metrics**:
- Response time
- Throughput
- Latency

### Reliability

**Measurements**:
- Mean Time Between Failures (MTBF)
- Mean Time To Recovery (MTTR)

## SLA Components

**Service Description**: Clear definition of covered services

**Availability Commitments**: Guaranteed uptime percentages

**Performance Metrics**: Specific performance targets

**Exclusions**: Circumstances not covered by SLA

**Service Credits**: Compensation for SLA breaches

**Support Response Times**: Time to acknowledge and resolve issues

## Understanding SLA Implications

**Composite SLAs**: When using multiple services, overall availability is multiplied
- Service A (99.9%) × Service B (99.9%) = 99.8% combined

**Planned Maintenance**: Usually excluded from availability calculations

**Customer Responsibilities**: Actions required to maintain SLA coverage

## Best Practices

- Read and understand SLAs before committing
- Design for failure, don't rely solely on SLAs
- Architect for higher availability than SLA guarantees
- Monitor services to verify SLA compliance
- Understand compensation process for SLA breaches
