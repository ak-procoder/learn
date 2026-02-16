---
id: intro-29
title: Cloud Computing Data Management
type: text
---

## Data Types in Cloud

### Structured Data

**Characteristics**:
- Organized in rows and columns
- Predefined schema
- Easy to query

**Examples**: Customer records, financial transactions, inventory

**Storage**: Relational databases (SQL)

### Semi-Structured Data

**Characteristics**:
- Self-describing structure
- Flexible schema
- Tags or markers for hierarchy

**Examples**: JSON, XML, log files

**Storage**: NoSQL databases, document stores

### Unstructured Data

**Characteristics**:
- No predefined structure
- Binary or text format
- Most common data type (80% of enterprise data)

**Examples**: Images, videos, documents, emails

**Storage**: Object storage, file storage

## Data Storage Patterns

### Data Lakes

**Definition**: Centralized repository for all data in native format

**Characteristics**:
- Store raw, unprocessed data
- Schema-on-read (define structure when reading)
- Scalable and cost-effective
- Support any data type

**Use Cases**:
- Big data analytics
- Machine learning
- Data science
- Long-term archival

### Data Warehouses

**Definition**: Centralized repository for structured, processed data

**Characteristics**:
- Schema-on-write (structure defined upfront)
- Optimized for queries and analysis
- Historical data storage
- Business intelligence

**Use Cases**:
- Business reporting
- Analytics dashboards
- Historical trend analysis

### Data Marts

**Definition**: Subset of data warehouse for specific business unit

**Benefits**:
- Focused on specific needs
- Faster queries
- Easier to manage

## Data Lifecycle Management

### Creation

**Considerations**:
- Data classification
- Metadata tagging
- Initial storage tier
- Encryption settings

### Storage

**Optimization**:
- Appropriate storage class
- Compression
- Deduplication
- Replication strategy

### Access and Use

**Controls**:
- Access permissions
- Encryption in transit
- Audit logging
- Data masking for sensitive information

### Archival

**Strategy**:
- Move inactive data to cheaper storage
- Lifecycle policies for automatic transition
- Compliance with retention requirements

### Deletion

**Process**:
- Secure deletion when no longer needed
- Compliance with data retention policies
- Verification of deletion
- Deletion of all copies and backups

## Data Protection

### Encryption

**At Rest**:
- Encrypt data stored in databases
- Encrypt files in object storage
- Use cloud-managed or customer-managed keys

**In Transit**:
- TLS/SSL for all communications
- VPN for private connections
- End-to-end encryption for sensitive data

### Backup and Recovery

**Strategy**:
- Automated regular backups
- Point-in-time recovery
- Cross-region backup for disaster recovery
- Regular restore testing

### Versioning

**Benefits**:
- Protect against accidental deletion
- Track changes over time
- Rollback to previous versions
- Compliance and audit trails

## Data Governance

### Data Classification

**Levels**:
- Public: No restrictions
- Internal: Internal use only
- Confidential: Limited access
- Restricted: Highly sensitive, strict controls

### Data Quality

**Dimensions**:
- Accuracy: Correct information
- Completeness: All required data present
- Consistency: Same data across systems
- Timeliness: Up-to-date information
- Validity: Conforms to business rules

### Metadata Management

**Importance**:
- Understand data meaning and context
- Data lineage tracking
- Impact analysis
- Discovery and cataloging

### Compliance

**Requirements**:
- GDPR: Data privacy for EU citizens
- HIPAA: Healthcare data protection
- PCI DSS: Payment card data security
- SOX: Financial record keeping
- Industry-specific regulations

## Data Migration to Cloud

### Strategies

**Online Migration**:
- Transfer over network
- Minimal downtime
- Good for smaller datasets

**Offline Migration**:
- Physical device shipping
- Petabyte-scale transfers
- Services like AWS Snowball, Azure Data Box

**Hybrid Approach**:
- Initial bulk transfer offline
- Ongoing sync online
- Minimal cutover time

### Migration Steps

1. **Assessment**: Inventory and classify data
2. **Planning**: Choose migration method
3. **Testing**: Pilot migration
4. **Execution**: Migrate data in phases
5. **Validation**: Verify data integrity
6. **Cutover**: Switch to cloud systems
7. **Decommission**: Shutdown old systems
