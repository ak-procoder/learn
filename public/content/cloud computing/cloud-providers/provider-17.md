---
id: provider-17
title: Azure Databases
type: text
---

# Azure Databases

Azure offers a comprehensive portfolio of fully managed database services supporting relational, NoSQL, in-memory, and analytical workloads. These services eliminate the complexity of database management while providing enterprise-grade performance, security, and availability.

## Azure SQL Database

Fully managed relational database service based on Microsoft SQL Server.

### Service Tiers

**DTU-Based (Database Transaction Units)**

| Tier | Use Case | Max DTUs | Max Storage |
|------|----------|----------|-------------|
| Basic | Development, small apps | 5 | 2 GB |
| Standard | Most workloads | 3000 | 1 TB |
| Premium | IO-intensive | 4000 | 4 TB |

**vCore-Based (Virtual Cores)**

*General Purpose*
- Balanced compute and memory
- Remote storage
- 99.99% SLA
- 2-80 vCores
- Up to 4 TB

*Business Critical*
- High IOPS requirements
- Local SSD storage
- 99.99% SLA with failover
- Built-in read replicas
- 2-80 vCores
- Up to 4 TB

*Hyperscale*
- Highly scalable storage
- Up to 100 TB
- Fast backup and restore
- Multiple read replicas
- Rapid scale up/down

### Deployment Options

**Single Database**
- Isolated database
- Dedicated resources
- Individual management

**Elastic Pool**
- Share resources among multiple databases
- Variable workloads
- Cost-effective for many databases

**Managed Instance**
- Near 100% SQL Server compatibility
- Native VNet integration
- Instance-scoped features
- Lift-and-shift migrations

### High Availability

**Geo-Replication**
```plaintext
Primary Database (Read-Write)
    ├── Secondary 1 (Read-Only) - Region 1
    ├── Secondary 2 (Read-Only) - Region 2
    └── Secondary 3 (Read-Only) - Region 3

Up to 4 readable secondaries
Asynchronous replication
Manual or automatic failover
```

**Auto-Failover Groups**
- Multiple databases failover together
- Read-write and read-only listener endpoints
- Automatic failover policies

### Creating SQL Database

```bash
# Create SQL Server
az sql server create \
  --resource-group myResourceGroup \
  --name myserver \
  --location eastus \
  --admin-user sqladmin \
  --admin-password P@ssw0rd123!

# Create database
az sql db create \
  --resource-group myResourceGroup \
  --server myserver \
  --name myDatabase \
  --service-objective S0 \
  --zone-redundant false

# Configure firewall
az sql server firewall-rule create \
  --resource-group myResourceGroup \
  --server myserver \
  --name AllowMyIP \
  --start-ip-address 203.0.113.1 \
  --end-ip-address 203.0.113.1
```

### Connection String

```csharp
Server=tcp:myserver.database.windows.net,1433;
Database=myDatabase;
User ID=sqladmin;
Password={your_password};
Encrypt=True;
TrustServerCertificate=False;
Connection Timeout=30;
```

## Azure Cosmos DB

Globally distributed, multi-model NoSQL database.

### API Options

**Core (SQL) API**
- Document database
- SQL-like query syntax
- JSON documents

**MongoDB API**
- MongoDB wire protocol compatibility
- Use existing MongoDB tools and drivers

**Cassandra API**
- Column-family storage
- CQL query language

**Gremlin API**
- Graph database
- Gremlin query language

**Table API**
- Azure Table Storage evolution
- Premium features

### Key Features

**Global Distribution**
```plaintext
Write Region: East US
Read Regions:
  ├── West US
  ├── North Europe
  ├── Southeast Asia
  └── Australia East

Multi-region writes (for specific consistency levels)
```

**Turnkey global distribution**
- Add/remove regions with button click
- Automatic multi-master replication
- <10ms read latency (P99)
- <10ms write latency (P99)

### Consistency Levels

```plaintext
Strong ←→→→→→→→→→→→→→→→→→ Eventual
  ↓
Bounded Staleness
  ↓
Session (default)
  ↓
Consistent Prefix
  ↓
Eventual
```

1. **Strong**: Linearizability guarantee
2. **Bounded Staleness**: Reads lag behind writes by K versions or T time
3. **Session**: Consistent within a client session
4. **Consistent Prefix**: Reads never see out-of-order writes
5. **Eventual**: No ordering guarantee

### Request Units (RUs)

Normalized measure of cost for database operations.

```plaintext
Examples:
- Read 1 KB document: 1 RU
- Write 1 KB document: ~5 RUs
- Query complexity affects RU consumption

Provisioned Throughput:
- 400 RU/s minimum
- Autoscale: 400 to 100,000 RU/s
- Serverless: Pay per request (preview)
```

### Creating Cosmos DB

```bash
# Create Cosmos DB account
az cosmosdb create \
  --resource-group myResourceGroup \
  --name mycosmosdb \
  --kind GlobalDocumentDB \
  --locations regionName=eastus failoverPriority=0 \
  --locations regionName=westus failoverPriority=1 \
  --default-consistency-level Session

# Create database
az cosmosdb sql database create \
  --account-name mycosmosdb \
  --resource-group myResourceGroup \
  --name myDatabase

# Create container
az cosmosdb sql container create \
  --account-name mycosmosdb \
  --database-name myDatabase \
  --resource-group myResourceGroup \
  --name myContainer \
  --partition-key-path "/userId" \
  --throughput 400
```

### Code Example (SQL API)

```python
from azure.cosmos import CosmosClient

# Connect
client = CosmosClient(url, credential=key)
database = client.get_database_client("myDatabase")
container = database.get_container_client("myContainer")

# Create item
item = {
    'id': '1',
    'userId': 'user123',
    'name': 'John Doe',
    'email': 'john@example.com'
}
container.create_item(body=item)

# Query items
query = "SELECT * FROM c WHERE c.userId = 'user123'"
items = list(container.query_items(
    query=query,
    enable_cross_partition_query=True
))
```

## Azure Database for MySQL

Fully managed MySQL database service.

### Service Tiers

**Basic**
- Development and testing
- Up to 2 vCores
- Up to 1 TB storage

**General Purpose**
- Most workloads
- Up to 64 vCores
- Up to 16 TB storage
- Geo-redundant backup

**Memory Optimized**
- High-performance databases
- Up to 32 vCores
- Memory-intensive workloads

### High Availability

**Zone-Redundant HA**
- Synchronous replication
- Automatic failover
- Different availability zones
- 99.99% SLA

### MySQL Flexible Server

Next-generation deployment option with:
- Same-zone and zone-redundant HA
- Configurable maintenance windows
- Burstable SKUs for dev/test
- Better price-performance

```bash
# Create MySQL server
az mysql server create \
  --resource-group myResourceGroup \
  --name mymysqlserver \
  --location eastus \
  --admin-user myadmin \
  --admin-password P@ssw0rd123! \
  --sku-name GP_Gen5_2 \
  --version 5.7
```

## Azure Database for PostgreSQL

Fully managed PostgreSQL database service.

### Deployment Options

**Single Server**
- Basic, General Purpose, Memory Optimized tiers
- PostgreSQL 9.6, 10, 11
- Built-in HA
- Automated backups

**Flexible Server**
- Zone-redundant HA
- Custom maintenance windows
- PostgreSQL 11, 12, 13
- Better performance and flexibility

**Hyperscale (Citus)**
- Distributed PostgreSQL
- Horizontal scaling
- Multi-tenant applications
- Real-time analytics

```plaintext
Hyperscale Architecture:
Coordinator Node
    ├── Worker Node 1 (Shard 1, 2)
    ├── Worker Node 2 (Shard 3, 4)
    └── Worker Node 3 (Shard 5, 6)
```

```bash
# Create PostgreSQL server
az postgres server create \
  --resource-group myResourceGroup \
  --name mypostgresserver \
  --location eastus \
  --admin-user myadmin \
  --admin-password P@ssw0rd123! \
  --sku-name GP_Gen5_2 \
  --version 11
```

## Azure Cache for Redis

Fully managed, in-memory data store based on Redis.

### Tiers

| Tier | Use Case | Features |
|------|----------|----------|
| Basic | Dev/test | Single node, no SLA |
| Standard | Production | 2 nodes, 99.9% SLA |
| Premium | Enterprise | Clustering, persistence, VNet |
| Enterprise | Mission-critical | Redis Enterprise, 99.999% SLA |

### Features

**Data Persistence**
- RDB snapshots
- AOF (Append-Only File)
- Premium tier only

**Clustering**
- Horizontal scaling
- Up to 10 shards
- Premium tier only

**Geo-Replication**
- Active replication
- Disaster recovery
- Premium tier only

```bash
# Create Redis cache
az redis create \
  --resource-group myResourceGroup \
  --name myrediscache \
  --location eastus \
  --sku Standard \
  --vm-size c1

# Get connection string
az redis list-keys \
  --resource-group myResourceGroup \
  --name myrediscache
```

```python
import redis

# Connect to Redis
r = redis.StrictRedis(
    host='myrediscache.redis.cache.windows.net',
    port=6380,
    password='your_access_key',
    ssl=True
)

# Set value
r.set('mykey', 'Hello, Redis!')

# Get value
value = r.get('mykey')
print(value.decode('utf-8'))
```

## Azure Synapse Analytics

Unified analytics platform (formerly SQL Data Warehouse).

### Components

**Synapse SQL**
- Serverless SQL pool (on-demand)
- Dedicated SQL pool (data warehouse)
- T-SQL queries

**Apache Spark**
- Spark pools
- Support for Python, Scala, .NET, R
- Integration with notebooks

**Synapse Pipelines**
- Data integration (ETL/ELT)
- Similar to Azure Data Factory

**Synapse Studio**
- Unified web interface
- Develop, manage, monitor

### Use Cases

- Enterprise data warehousing
- Big data analytics
- Real-time analytics
- Data lake exploration

## Azure Database Migration Service

Facilitate database migrations to Azure.

### Supported Sources

- SQL Server (on-premises, Azure VM, RDS)
- MySQL
- PostgreSQL
- MongoDB
- Oracle (preview)

### Migration Types

**Offline Migration**
- Downtime required
- Full data copy
- Simpler process

**Online Migration**
- Minimal downtime
- Continuous replication
- Cutover at convenient time

```bash
# Create DMS instance
az dms create \
  --resource-group myResourceGroup \
  --name myDMS \
  --location eastus \
  --sku-name Premium_4vCores \
  --subnet /subscriptions/.../subnets/default
```

## Database Security

### Network Security

**Firewall Rules**
- IP-based access control
- VNet rules
- Private endpoints

**Service Endpoints**
- Direct access from VNet
- Traffic stays on Microsoft backbone

**Private Link**
- Private IP in your VNet
- No public internet exposure

### Data Encryption

**Encryption at Rest**
- Transparent Data Encryption (TDE)
- Automatic for Azure SQL, PostgreSQL, MySQL
- Customer-managed keys option

**Encryption in Transit**
- TLS/SSL connections
- Enforce encrypted connections

### Authentication & Authorization

**Azure AD Authentication**
- Centralized identity management
- Managed identities for applications
- Conditional access policies

**Dynamic Data Masking**
- Hide sensitive data from non-privileged users
- Email, credit card patterns

**Row-Level Security (SQL)**
- Control access to rows in table
- Based on user identity

**Advanced Threat Protection**
- Detect anomalous activities
- Potential SQL injection
- Unusual access patterns

## Best Practices

1. **Choose the right service**: Match database to workload
2. **Use managed instances**: Reduce operational overhead
3. **Enable high availability**: Multi-zone or geo-replication
4. **Optimize costs**: Right-size resources, use reservations
5. **Implement security**: Private endpoints, Azure AD auth
6. **Regular backups**: Automated backups, test restores
7. **Monitor performance**: Query Performance Insight, metrics
8. **Connection pooling**: Efficient connection management
9. **Index optimization**: Improve query performance
10. **Scaling strategy**: Plan for growth, use elastic pools

Azure database services provide robust, scalable, and fully managed solutions for diverse data storage and processing needs, from traditional relational databases to modern NoSQL and analytical platforms.
