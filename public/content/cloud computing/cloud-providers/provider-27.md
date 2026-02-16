---
id: provider-27
title: Google Cloud Platform - Database Services
type: text
---

# Google Cloud Platform - Database Services

GCP offers a comprehensive portfolio of managed database services for relational, NoSQL, in-memory, and specialized workloads.

## Cloud SQL

Fully managed relational database service for MySQL, PostgreSQL, and SQL Server.

### Supported Engines

| Engine | Versions | Max Storage | Max RAM |
|--------|----------|-------------|---------|
| **MySQL** | 5.6, 5.7, 8.0 | 64 TB | 624 GB |
| **PostgreSQL** | 9.6, 10-15 | 64 TB | 624 GB |
| **SQL Server** | 2017, 2019, 2022 | 64 TB | 624 GB |

### Creating Cloud SQL Instance

```bash
# Create MySQL instance
gcloud sql instances create mysql-instance \
  --database-version=MYSQL_8_0 \
  --tier=db-n1-standard-2 \
  --region=us-central1 \
  --root-password=<PASSWORD> \
  --backup-start-time=03:00 \
  --enable-bin-log \
  --database-flags=max_connections=200

# Create PostgreSQL instance with HA
gcloud sql instances create postgres-instance \
  --database-version=POSTGRES_15 \
  --tier=db-custom-4-16384 \
  --region=us-central1 \
  --root-password=<PASSWORD> \
  --availability-type=REGIONAL \
  --enable-point-in-time-recovery

# Create database
gcloud sql databases create mydb --instance=mysql-instance

# Create user
gcloud sql users create appuser \
  --instance=mysql-instance \
  --password=<USER_PASSWORD>
```

### Connecting to Cloud SQL

**From Compute Engine:**

```bash
# Get connection name
gcloud sql instances describe mysql-instance --format="value(connectionName)"

# Download Cloud SQL Proxy
wget https://dl.google.com/cloudsql/cloud_sql_proxy.linux.amd64 -O cloud_sql_proxy
chmod +x cloud_sql_proxy

# Run proxy
./cloud_sql_proxy -instances=PROJECT:REGION:INSTANCE=tcp:3306
```

**Python Application:**

```python
import sqlalchemy
import pymysql

# Create connection pool
def create_pool():
    """Create connection pool for Cloud SQL."""
    pool = sqlalchemy.create_engine(
        sqlalchemy.engine.url.URL.create(
            drivername="mysql+pymysql",
            username="appuser",
            password="password",
            database="mydb",
            query={
                "unix_socket": "/cloudsql/{}".format(
                    "project:region:instance"
                )
            },
        ),
        pool_size=5,
        max_overflow=2,
        pool_timeout=30,
        pool_recycle=1800,
    )
    return pool

pool = create_pool()

# Query database
def get_users():
    """Get users from database."""
    with pool.connect() as conn:
        result = conn.execute(
            sqlalchemy.text("SELECT * FROM users")
        )
        return [dict(row) for row in result]

# Insert data
def insert_user(name, email):
    """Insert user into database."""
    with pool.connect() as conn:
        conn.execute(
            sqlalchemy.text(
                "INSERT INTO users (name, email) VALUES (:name, :email)"
            ),
            {"name": name, "email": email}
        )
        conn.commit()
```

### Backup and Recovery

```bash
# Create on-demand backup
gcloud sql backups create --instance=mysql-instance

# List backups
gcloud sql backups list --instance=mysql-instance

# Restore from backup
gcloud sql backups restore <BACKUP_ID> \
  --instance=mysql-instance

# Clone instance
gcloud sql instances clone mysql-instance mysql-clone
```

### High Availability

```bash
# Enable HA (requires restart)
gcloud sql instances patch mysql-instance \
  --availability-type=REGIONAL

# Failover to standby
gcloud sql instances failover mysql-instance
```

## Cloud Spanner

Globally distributed, horizontally scalable relational database.

### Features

- **Global strong consistency**: ACID transactions across regions
- **Horizontal scaling**: Auto-sharding
- **High availability**: 99.999% SLA (multi-region)
- **SQL support**: ANSI 2011 with extensions
- **No planned downtime**: For schema changes

### Creating Spanner Instance

```bash
# Create instance (regional)
gcloud spanner instances create my-spanner \
  --config=regional-us-central1 \
  --nodes=1 \
  --description="My Spanner instance"

# Create instance (multi-region)
gcloud spanner instances create global-spanner \
  --config=nam-eur-asia1 \
  --processing-units=100 \
  --description="Global Spanner"

# Create database
gcloud spanner databases create mydb \
  --instance=my-spanner \
  --ddl='CREATE TABLE Users (
    UserId INT64 NOT NULL,
    Name STRING(100),
    Email STRING(100),
    CreatedAt TIMESTAMP NOT NULL OPTIONS (allow_commit_timestamp=true)
  ) PRIMARY KEY (UserId)'

# Add table
gcloud spanner databases ddl update mydb \
  --instance=my-spanner \
  --ddl='CREATE TABLE Orders (
    OrderId INT64 NOT NULL,
    UserId INT64 NOT NULL,
    Amount FLOAT64,
    CreatedAt TIMESTAMP NOT NULL OPTIONS (allow_commit_timestamp=true),
    FOREIGN KEY (UserId) REFERENCES Users (UserId)
  ) PRIMARY KEY (OrderId)'
```

### Using Spanner with Python

```python
from google.cloud import spanner

# Create client
client = spanner.Client()
instance = client.instance('my-spanner')
database = instance.database('mydb')

# Insert data
def insert_users(users):
    """Insert users with transaction."""
    with database.batch() as batch:
        batch.insert(
            table='Users',
            columns=('UserId', 'Name', 'Email', 'CreatedAt'),
            values=users
        )

# Insert with commit timestamp
import datetime
insert_users([
    (1, 'Alice', 'alice@example.com', spanner.COMMIT_TIMESTAMP),
    (2, 'Bob', 'bob@example.com', spanner.COMMIT_TIMESTAMP),
])

# Query data
def get_users():
    """Query users."""
    with database.snapshot() as snapshot:
        results = snapshot.execute_sql(
            'SELECT UserId, Name, Email FROM Users ORDER BY Name'
        )
        return [(row[0], row[1], row[2]) for row in results]

# Transaction
def transfer_amount(from_user, to_user, amount):
    """Transfer amount between users."""
    def update_balances(transaction):
        # Read current balances
        rows = list(transaction.execute_sql(
            'SELECT UserId, Balance FROM Accounts WHERE UserId IN (@user1, @user2)',
            params={'user1': from_user, 'user2': to_user},
            param_types={'user1': spanner.param_types.INT64, 
                        'user2': spanner.param_types.INT64}
        ))
        
        # Update balances
        transaction.update(
            table='Accounts',
            columns=('UserId', 'Balance'),
            values=[
                (from_user, rows[0][1] - amount),
                (to_user, rows[1][1] + amount)
            ]
        )
    
    database.run_in_transaction(update_balances)

# Interleaved tables (parent-child)
ddl_interleaved = """
CREATE TABLE Albums (
  SingerId INT64 NOT NULL,
  AlbumId INT64 NOT NULL,
  AlbumTitle STRING(100)
) PRIMARY KEY (SingerId, AlbumId),
  INTERLEAVE IN PARENT Singers ON DELETE CASCADE
"""
```

## Cloud Bigtable

NoSQL wide-column database for large analytical and operational workloads.

### Features

- **Low latency**: Single-digit millisecond
- **High throughput**: Millions of ops/sec
- **Horizontal scaling**: Petabyte-scale
- **HBase API**: Compatible with Apache HBase
- **Integration**: BigQuery, Dataflow, Dataproc

### Creating Bigtable Instance

```bash
# Create instance
gcloud bigtable instances create my-bigtable \
  --cluster=my-cluster \
  --cluster-zone=us-central1-a \
  --cluster-num-nodes=3 \
  --display-name="My Bigtable"

# Create table with column family
cbt -project=myproject -instance=my-bigtable createtable users
cbt -project=myproject -instance=my-bigtable createfamily users profile
cbt -project=myproject -instance=my-bigtable createfamily users metrics
```

### Using Bigtable with Python

```python
from google.cloud import bigtable
from google.cloud.bigtable import column_family, row_filters

# Create client
client = bigtable.Client(project='myproject', admin=True)
instance = client.instance('my-bigtable')

# Create table
table_id = 'users'
table = instance.table(table_id)

# Create column families
max_versions_rule = column_family.MaxVersionsGCRule(2)
column_family_id = 'profile'
column_families = {column_family_id: max_versions_rule}

if not table.exists():
    table.create(column_families=column_families)

# Write data
def write_user(user_id, name, email):
    """Write user data."""
    row_key = f"user#{user_id}".encode()
    row = table.direct_row(row_key)
    
    row.set_cell('profile', 'name', name)
    row.set_cell('profile', 'email', email)
    row.set_cell('metrics', 'login_count', str(0))
    
    row.commit()

# Read data
def read_user(user_id):
    """Read user data."""
    row_key = f"user#{user_id}".encode()
    row = table.read_row(row_key)
    
    if row:
        name = row.cells['profile']['name'][0].value.decode()
        email = row.cells['profile']['email'][0].value.decode()
        return {'name': name, 'email': email}
    return None

# Scan rows
def scan_users(start_key='user#', end_key='user#~'):
    """Scan user rows."""
    rows = table.read_rows(
        start_key=start_key.encode(),
        end_key=end_key.encode()
    )
    
    users = []
    for row in rows:
        users.append({
            'id': row.row_key.decode(),
            'name': row.cells['profile']['name'][0].value.decode(),
            'email': row.cells['profile']['email'][0].value.decode()
        })
    return users

# Increment counter
def increment_login_count(user_id):
    """Increment login counter."""
    row_key = f"user#{user_id}".encode()
    row = table.direct_row(row_key)
    row.increment_cell_value('metrics', 'login_count', 1)
    row.commit()
```

## Firestore

Serverless NoSQL document database.

### Modes

**Native Mode:**
- Serverless, automatic scaling
- Real-time updates
- Strong consistency
- ACID transactions
- Mobile/web SDK

**Datastore Mode:**
- Backwards compatible with Datastore
- Server applications
- Strong consistency
- ACID transactions

### Using Firestore

```python
from google.cloud import firestore

# Create client
db = firestore.Client()

# Add document
def add_user(user_id, data):
    """Add user document."""
    doc_ref = db.collection('users').document(user_id)
    doc_ref.set(data)

add_user('user1', {
    'name': 'Alice',
    'email': 'alice@example.com',
    'age': 30,
    'created': firestore.SERVER_TIMESTAMP
})

# Get document
def get_user(user_id):
    """Get user document."""
    doc_ref = db.collection('users').document(user_id)
    doc = doc_ref.get()
    
    if doc.exists:
        return doc.to_dict()
    return None

# Query
def get_adult_users():
    """Query users over 18."""
    users_ref = db.collection('users')
    query = users_ref.where('age', '>=', 18).order_by('age')
    
    return [doc.to_dict() for doc in query.stream()]

# Transaction
@firestore.transactional
def update_balance(transaction, user_ref, amount):
    """Update user balance in transaction."""
    snapshot = user_ref.get(transaction=transaction)
    current_balance = snapshot.get('balance')
    
    transaction.update(user_ref, {
        'balance': current_balance + amount
    })

# Real-time listener
def listen_to_user(user_id, callback):
    """Listen to user document changes."""
    doc_ref = db.collection('users').document(user_id)
    
    def on_snapshot(doc_snapshot, changes, read_time):
        for doc in doc_snapshot:
            callback(doc.to_dict())
    
    doc_watch = doc_ref.on_snapshot(on_snapshot)
    return doc_watch  # Call doc_watch.unsubscribe() to stop listening
```

## Memorystore

Fully managed in-memory data store (Redis and Memcached).

### Redis

```bash
# Create Redis instance
gcloud redis instances create my-redis \
  --size=1 \
  --region=us-central1 \
  --tier=basic \
  --redis-version=redis_7_0

# Create HA instance
gcloud redis instances create redis-ha \
  --size=5 \
  --region=us-central1 \
  --tier=standard \
  --redis-version=redis_7_0 \
  --replica-count=1

# Get instance details
gcloud redis instances describe my-redis --region=us-central1
```

**Python with Redis:**

```python
import redis

# Connect to Memorystore Redis
r = redis.StrictRedis(
    host='<REDIS_HOST>',
    port=6379,
    decode_responses=True
)

# Set value
r.set('user:1:name', 'Alice')
r.setex('session:abc123', 3600, 'user_data')  # Expire in 1 hour

# Get value
name = r.get('user:1:name')

# Hash operations
r.hset('user:1', mapping={'name': 'Alice', 'email': 'alice@example.com'})
user = r.hgetall('user:1')

# Lists
r.lpush('queue:tasks', 'task1', 'task2')
task = r.rpop('queue:tasks')

# Pub/Sub
pubsub = r.pubsub()
pubsub.subscribe('notifications')

for message in pubsub.listen():
    if message['type'] == 'message':
        print(message['data'])
```

## Database Comparison

| Database | Type | Scale | Consistency | Use Case |
|----------|------|-------|-------------|----------|
| **Cloud SQL** | Relational | Vertical | Strong | Traditional apps, OLTP |
| **Cloud Spanner** | Relational | Horizontal | Strong | Global apps, mission-critical |
| **Bigtable** | Wide-column | Horizontal | Eventual | Time-series, analytics, IoT |
| **Firestore** | Document | Horizontal | Strong | Mobile/web apps, real-time |
| **Memorystore** | In-memory | Vertical | Strong | Caching, sessions, real-time |

## Best Practices

1. **Choose the right database**: Match to workload requirements
2. **Enable automated backups**: Cloud SQL, Spanner
3. **Use read replicas**: For read-heavy workloads
4. **Implement connection pooling**: Reduce overhead
5. **Monitor performance**: Cloud Monitoring metrics
6. **Secure access**: Private IP, IAM, VPC Service Controls
7. **Use indexes wisely**: Optimize query performance
8. **Plan schema carefully**: Especially for Spanner and Bigtable
9. **Use caching**: Memorystore for frequently accessed data
10. **Test disaster recovery**: Regular backup/restore testing

GCP's database services provide flexible, scalable, and fully managed solutions for diverse data storage and processing needs.
