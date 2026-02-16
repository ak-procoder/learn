---
id: provider-6
title: AWS Databases - RDS, DynamoDB, Aurora
type: text
---

# AWS Databases - RDS, DynamoDB, Aurora

AWS offers a comprehensive portfolio of database services optimized for different use cases, from relational databases to NoSQL, in-memory, and graph databases. This slide covers the primary database services: RDS, DynamoDB, and Aurora.

## Amazon RDS (Relational Database Service)

RDS makes it easy to set up, operate, and scale relational databases in the cloud. It provides cost-efficient, resizable capacity while automating time-consuming administration tasks.

### Supported Database Engines

- **MySQL**: Popular open-source database
- **PostgreSQL**: Advanced open-source database
- **MariaDB**: MySQL-compatible database
- **Oracle**: Enterprise database
- **Microsoft SQL Server**: Microsoft's database platform
- **Amazon Aurora**: AWS's cloud-native database

### Key Features

**Automated Management**
- **Automated Backups**: Daily full backup with transaction logs
- **Snapshots**: Manual backups you can retain indefinitely
- **Automated Patching**: Security and database patches
- **Automated Failover**: Multi-AZ deployments

**High Availability**
```plaintext
Multi-AZ Deployment:
Primary AZ          Standby AZ
┌──────────┐       ┌──────────┐
│ Primary  │ sync  │ Standby  │
│ Instance │◄─────►│ Instance │
└──────────┘       └──────────┘
     │
     ▼
Application
```

- Synchronous replication to standby
- Automatic failover (60-120 seconds)
- Different AZ for disaster recovery

**Read Replicas**
- Asynchronous replication from source
- Up to 15 read replicas (Aurora up to 15)
- Can be in different regions
- Promote to standalone database
- Offload read traffic from primary

### Storage Options

**General Purpose SSD (gp3/gp2)**
- Cost-effective storage
- 3 IOPS per GB baseline
- Burstable to 3,000 IOPS

**Provisioned IOPS SSD (io1)**
- High-performance for I/O-intensive workloads
- Up to 64,000 IOPS
- Consistent performance

**Magnetic (Legacy)**
- Backward compatibility only
- Not recommended for new instances

### RDS Proxy

- Pooling and sharing database connections
- Reduces database memory and CPU load
- Serverless, autoscaling, highly available
- Improved security with IAM authentication
- Faster failover times (66% reduction)

## Amazon DynamoDB

DynamoDB is a fully managed NoSQL database service that provides fast and predictable performance with seamless scalability.

### Core Concepts

**Tables, Items, and Attributes**
```json
{
  "UserID": "12345",           // Partition Key
  "Timestamp": "2026-02-16",   // Sort Key
  "Name": "John Doe",
  "Email": "john@example.com",
  "Age": 30
}
```

**Primary Keys**
- **Partition Key**: Single attribute
- **Composite Key**: Partition key + Sort key
- Uniquely identifies each item

### Capacity Modes

**Provisioned Capacity**
- Specify RCUs (Read Capacity Units) and WCUs (Write Capacity Units)
- Predictable workloads
- Auto Scaling available
- More cost-effective for steady traffic

**On-Demand Capacity**
- Pay per request
- No capacity planning needed
- Ideal for unpredictable workloads
- Automatic scaling

### Features

**Global Tables**
- Multi-region, multi-active replication
- <1 second replication latency
- Read and write to any region
- Automatic conflict resolution

**DynamoDB Streams**
- Ordered stream of item modifications
- 24-hour retention
- Lambda triggers for event-driven processing
- Enable change data capture (CDC)

**Indexes**

**Global Secondary Index (GSI)**
- Different partition and sort keys
- Queries across entire table
- Eventually consistent
- Up to 20 GSIs per table

**Local Secondary Index (LSI)**
- Same partition key, different sort key
- Must be created at table creation
- Strongly or eventually consistent
- Up to 5 LSIs per table

**DynamoDB Accelerator (DAX)**
- In-memory cache for DynamoDB
- Microsecond response times
- Fully managed, highly available
- No application code changes needed
- 10x performance improvement

### Consistency Models

**Eventually Consistent Reads** (default)
- Maximum throughput
- Reads might not reflect immediately
- 50% cheaper than strongly consistent

**Strongly Consistent Reads**
- Returns most recent data
- Slower response time
- Consumes more RCUs

### Backup and Recovery

**On-Demand Backups**
- Full backups at any time
- No impact on performance
- Retained until explicitly deleted

**Point-in-Time Recovery (PITR)**
- Continuous backups
- Restore to any second in last 35 days
- No performance impact

## Amazon Aurora

Aurora is AWS's cloud-native relational database that combines the performance of high-end commercial databases with the simplicity and cost-effectiveness of open-source databases.

### Architecture

```plaintext
Application Layer
       │
   Aurora Cluster
   ┌─────────────────┐
   │ Primary Instance│ (Writer)
   └────────┬────────┘
            │
   ┌────────┴────────┬────────────┐
   │                 │            │
Read Replica   Read Replica   Read Replica
(Auto-scaling up to 15 replicas)
   │                 │            │
   └────────┬────────┴────────────┘
            │
    Storage Layer
(6 copies across 3 AZs)
```

### Key Features

**Performance**
- **5x faster** than MySQL
- **3x faster** than PostgreSQL
- Up to 128 TB per database instance
- Up to 64 TB with Aurora Serverless

**Availability and Durability**
- 6 copies of data across 3 AZs
- Continuous backup to S3
- Point-in-time recovery
- Automated failover (<30 seconds)
- Self-healing storage with peer-to-peer replication

**Aurora Serverless**
- Automatically starts, shuts down, and scales capacity
- Pay per second for database capacity used
- Ideal for intermittent, unpredictable workloads
- **Aurora Serverless v2**: Scales in finer increments

**Aurora Global Database**
- Single database spanning multiple regions
- <1 second replication lag
- Up to 5 secondary regions
- Recovery Point Objective (RPO) of 1 second
- Recovery Time Objective (RTO) of <1 minute

**Aurora Multi-Master**
- Multiple read-write instances
- Continuous availability
- Instant failover

### Compatibility

**Aurora MySQL**
- Compatible with MySQL 5.6, 5.7, 8.0
- Drop-in replacement
- Supports MySQL tools and drivers

**Aurora PostgreSQL**
- Compatible with PostgreSQL 11, 12, 13, 14, 15
- Supports PostgreSQL extensions
- PostGIS for geospatial data

## Other AWS Database Services

### Amazon ElastiCache
- In-memory caching
- **Redis**: Advanced data structures, persistence
- **Memcached**: Simple, multi-threaded

### Amazon Neptune
- Fully managed graph database
- Supports Gremlin and SPARQL
- Social networks, fraud detection, knowledge graphs

### Amazon DocumentDB
- MongoDB-compatible document database
- Fully managed, scalable
- Automatic backups and replication

### Amazon Keyspaces
- Apache Cassandra-compatible
- Serverless, scalable
- Single-digit millisecond latency

### Amazon Timestream
- Time series database
- IoT and operational applications
- Automatic data lifecycle management

### Amazon QLDB
- Quantum Ledger Database
- Immutable, transparent, cryptographically verifiable
- Track history of changes

## Database Selection Guide

| Use Case | Recommended Service |
|----------|-------------------|
| Traditional RDBMS | RDS, Aurora |
| High performance RDBMS | Aurora |
| NoSQL key-value | DynamoDB |
| In-memory cache | ElastiCache |
| Graph database | Neptune |
| Document database | DocumentDB |
| Time series data | Timestream |
| Ledger/blockchain | QLDB |
| Data warehouse | Redshift |

## Best Practices

1. **Choose the right database**: Match database type to workload
2. **Enable automatic backups**: Protect against data loss
3. **Use Multi-AZ**: For production workloads
4. **Read replicas**: Offload read traffic
5. **Monitor performance**: Use CloudWatch and Performance Insights
6. **Security**: Encryption at rest and in transit, VPC isolation
7. **Parameter groups**: Optimize database configuration
8. **Tags**: Organize and track costs
9. **Cost optimization**: Use Reserved Instances for predictable workloads
10. **Test failover**: Regularly test disaster recovery procedures

AWS database services provide fully managed, scalable, and reliable solutions for virtually any database workload, from traditional relational databases to modern NoSQL and specialized databases.
