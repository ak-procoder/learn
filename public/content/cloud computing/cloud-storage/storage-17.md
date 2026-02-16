---
id: storage-17
title: "Backup and Disaster Recovery"
type: text
---

# Backup and Disaster Recovery

Implementing robust backup and disaster recovery strategies protects against data loss and ensures business continuity.

## Backup Strategies

**3-2-1 Rule**:
- 3 copies of data
- 2 different media types
- 1 copy off-site

**Backup Types**:
- **Full**: Complete copy of all data
- **Incremental**: Only changed data since last backup
- **Differential**: Changed data since last full backup
- **Snapshot**: Point-in-time copy

## Recovery Objectives

**RTO (Recovery Time Objective)**:
- Maximum acceptable downtime
- How quickly must systems be restored?

**RPO (Recovery Point Objective)**:
- Maximum acceptable data loss
- How much data can you afford to lose?

Example:
- RTO: 4 hours (system must be up within 4 hours)
- RPO: 1 hour (lose maximum 1 hour of data)

## Cloud Backup Services

**AWS Backup**:
- Centralized backup management
- Automated backup policies
- Cross-region backup
- Supports multiple services (EBS, RDS, DynamoDB, etc.)

**Azure Backup**:
- Azure Recovery Services Vault
- VM backup and restore
- SQL Server backup
- File and folder backup

**Google Cloud Backup**:
- Persistent disk snapshots
- Cloud SQL backups
- Filestore backups
- Backup and DR service

## Disaster Recovery Strategies

**Backup and Restore**: Lowest cost, highest RTO
**Pilot Light**: Minimal version always running
**Warm Standby**: Scaled-down version running
**Multi-Site Active-Active**: Zero downtime, highest cost

## Best Practices

- Automate backup processes
- Test restore procedures regularly
- Encrypt backups
- Implement versioning
- Use cross-region replication
- Monitor backup success
- Document recovery procedures
- Regular DR drills

Never assume backups work until you've tested a restore!
