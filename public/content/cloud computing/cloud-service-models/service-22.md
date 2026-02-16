---
id: service-22
title: Service Model Disaster Recovery
type: text
---

## DR Strategies Across Service Models

Disaster recovery requirements vary by service model.

## IaaS Disaster Recovery

**Full Control, Full Responsibility**:

**Strategies**:
- Backup and restore (lowest cost, longest RTO)
- Pilot light (minimal version always running)
- Warm standby (scaled-down version running)
- Multi-site (active-active across regions)

**Implementation**:
- Regular snapshots
- Cross-region replication
- Automated failover scripts
- Regular DR testing

**Tooling**:
- AWS Backup, Azure Backup
- Site Recovery services
- Third-party solutions (Veeam, Commvault)

## PaaS Disaster Recovery

**Shared Responsibility**:

**Platform Resilience**:
- Provider handles infrastructure DR
- Built-in redundancy
- Automated backups

**Application Responsibilities**:
- Application-level backups
- Database replication across regions
- Disaster recovery testing
- Failover procedures

**Approaches**:
- Multi-region deployment
- Database geo-replication
- Traffic manager for failover
- Stateless applications for easier recovery

## SaaS Disaster Recovery

**Provider Managed**:

**Built-in Protection**:
- Automatic backups
- Geographic redundancy
- High availability SLAs
- Provider handles all DR

**Customer Responsibilities**:
- Regular data exports  
- Understand provider's DR capabilities
- Have backup SaaS option
- Document business continuity procedures

**Data Protection**:
- Export data regularly
- Store exports separately
- Validate export integrity
- Test data restoration

## Cross-Model DR Best Practices

**Comprehensive Planning**:
- Document dependencies between services
- Define RTO and RPO for each service
- Regular testing of DR procedures
- Communication plans
- Alternative access methods

**Data Considerations**:
- Understand data locations
- Cross-region data residency compliance
- Backup verification
- Encryption in backups

**Testing Requirements**:
- Annual full DR tests
- Quarterly table-top exercises
- Document lessons learned
- Update procedures based on findings

## Business Continuity Planning

Beyond technical DR:
- Alternative work locations
- Communication procedures
- Key contact lists
- Decision-making authority
- Vendor contact information
- Service dependencies documented
