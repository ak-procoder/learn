---
id: security-15
title: "Compliance and Governance"
type: text
---

# Compliance and Governance

Cloud compliance ensures organizations meet regulatory, legal, and industry-specific requirements.

## Major Compliance Frameworks

**HIPAA (Health Insurance Portability and Accountability Act)**:
- Healthcare data protection
- US regulation
- ePHI (Electronic Protected Health Information)
- Business Associate Agreement (BAA) required

**PCI DSS (Payment Card Industry Data Security Standard)**:
- Credit card data protection
- 12 requirements, 6 goals
- Annual audits required
- Applies to all card transactions

**GDPR (General Data Protection Regulation)**:
- EU data protection law
- Personal data rights
- Data breach notification (72 hours)
- Fines up to 4% of revenue

**SOC 2 (Service Organization Control 2)**:
- Service provider audits
- Trust principles (Security, Availability, Processing Integrity, Confidentiality, Privacy)
- Type I (point in time) or Type II (period of time)

**ISO 27001**:
- Information security management
- International standard
- Risk-based approach
- Certification process

**FedRAMP (Federal Risk and Authorization Management Program)**:
- US government cloud services
- Security assessment framework
- Three impact levels (Low, Moderate, High)

## Cloud Provider Compliance

**Shared Compliance**:
- Provider: Infrastructure compliance
- Customer: Data and application compliance

**AWS Compliance**:
- Compliance programs supported: 90+
- Artifact: Compliance reports access
- Audits and certifications
- Regional compliance

**Azure Compliance**:
- 90+ compliance offerings
- Compliance Manager
- Service Trust Portal
- Regional and industry specific

**GCP Compliance**:
- Compliance resource center
- Compliance reports manager
- 20+ certifications
- Industry solutions

## Governance Tools

### AWS

**AWS Organizations**:
- Centralized management
- Service Control Policies (SCPs)
- Consolidated billing
- Account grouping

**AWS Config**:
- Resource inventory
- Configuration history
- Compliance checking
- Remediation

**AWS Control Tower**:
- Multi-account governance
- Guardrails (preventive and detective)
- Account Factory
- Dashboard

### Azure

**Azure Policy**:
- Define and enforce standards
- Compliance assessment
- Remediation tasks
- Built-in policy definitions

**Management Groups**:
- Organize subscriptions
- Inherit policies
- RBAC inheritance
- Enterprise-scale governance

**Azure Blueprints**:
- Repeatable environment
- Compliance templates
- Resource deployment
- Policy assignment

### Google Cloud

**Organization Policy Service**:
- Centralized constraints
- Resource hierarchy
- Compliance enforcement

**Resource Manager**:
- Hierarchical organization
- Folders and projects
- Policy inheritance

**Forseti Security**:
- Open-source security toolkit
- Policy enforcement
- Compliance scanning

## Data Residency

**Requirements**:
- Store data in specific countries
- GDPR, CCPA considerations
- Government regulations
- Regional restrictions

**Implementation**:
- Choose regions carefully
- Restrict cross-region replication
- Use organization policies
- Document data flows

## Audit and Reporting

**Compliance Audits**:
- Regular assessments
- Third-party audits
- Internal reviews
- Gap analysis

**Compliance Reports**:
- Automated generation
- Evidence collection
- Audit trail maintenance
- Stakeholder communication

## Best Practices

**Governance Framework**:
- Define policies and standards
- Implement controls
- Regular monitoring
- Continuous improvement

**Compliance Program**:
- Inventory regulated data
- Map compliance requirements
- Implement controls
- Regular assessments
- Training and awareness

**Documentation**:
- Policy documents
- Procedures and runbooks
- Evidence collection
- Audit trails
- Incident reports

**Automation**:
- Policy as code
- Automated compliance checks
- Remediation automation
- Compliance dashboards

**Responsibility Matrix**:
```
Control              Provider  Customer
─────────────────────────────────────
Physical Security       ✓
Network Infrastructure  ✓
Hypervisor              ✓
OS Patching                      ✓
Application Security             ✓
Data Encryption         ✓        ✓
Access Control                   ✓
Data Classification              ✓
```

## Compliance as Code

**Infrastructure as Code**:
- Version-controlled compliance
- Automated enforcement
- Repeatable deployments
- Audit trail

**Example - AWS Config Rule**:
```json
{
  "ConfigRuleName": "encrypted-volumes",
  "Description": "Checks EBS volumes are encrypted",
  "Source": {
    "Owner": "AWS",
    "SourceIdentifier": "ENCRYPTED_VOLUMES"
  }
}
```

Compliance and governance are ongoing processes requiring continuous attention and improvement.
