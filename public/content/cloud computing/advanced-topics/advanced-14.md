---
id: advanced-14
title: Data Lakes and Warehouses
type: text
---

# Data Lakes and Warehouses

## Overview

Data lakes store raw data in its native format, while data warehouses organize data for analytical queries. Modern cloud platforms are blurring these lines with lakehouse architectures that combine the best of both worlds.

## Data Lake vs Data Warehouse

| Aspect | Data Lake | Data Warehouse |
|--------|-----------|----------------|
| **Data Type** | Raw, unstructured, semi-structured | Structured, processed |
| **Schema** | Schema-on-read | Schema-on-write |
| **Users** | Data scientists, engineers | Business analysts |
| **Processing** | Big data analytics, ML | SQL queries, BI |
| **Storage Cost** | Lower (object storage) | Higher (optimized compute/storage) |
| **Query Performance** | Variable | Optimized |

## Data Lake Architecture

### AWS Data Lake

**S3-based Data Lake**
```python
import boto3
import json
from datetime import datetime

s3 = boto3.client('s3')
glue = boto3.client('glue')

class DataLake:
    def __init__(self, bucket_name, database_name):
        self.bucket = bucket_name
        self.database = database_name
    
    def ingest_data(self, data, data_type, partition_keys=None):
        """
        Ingest data into data lake with partitioning
        """
        # Create path structure
        year = datetime.now().year
        month = datetime.now().month
        day = datetime.now().day
        
        path = f"{data_type}/year={year}/month={month:02d}/day={day:02d}/"
        
        # Add custom partitions if provided
        if partition_keys:
            for key, value in partition_keys.items():
                path += f"{key}={value}/"
        
        # Generate filename
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        filename = f"{path}data_{timestamp}.json"
        
        # Upload to S3
        s3.put_object(
            Bucket=self.bucket,
            Key=filename,
            Body=json.dumps(data),
            Metadata={
                'ingestion_time': datetime.now().isoformat(),
                'data_type': data_type
            }
        )
        
        return filename
    
    def create_glue_table(self, table_name, schema, location):
        """
        Create Glue Data Catalog table for querying with Athena
        """
        response = glue.create_table(
            DatabaseName=self.database,
            TableInput={
                'Name': table_name,
                'StorageDescriptor': {
                    'Columns': schema,
                    'Location': f's3://{self.bucket}/{location}/',
                    'InputFormat': 'org.apache.hadoop.mapred.TextInputFormat',
                    'OutputFormat': 'org.apache.hadoop.hive.ql.io.HiveIgnoreKeyTextOutputFormat',
                    'SerdeInfo': {
                        'SerializationLibrary': 'org.openx.data.jsonserde.JsonSerDe'
                    }
                },
                'PartitionKeys': [
                    {'Name': 'year', 'Type': 'int'},
                    {'Name': 'month', 'Type': 'int'},
                    {'Name': 'day', 'Type': 'int'}
                ],
                'TableType': 'EXTERNAL_TABLE'
            }
        )
        
        return response
    
    def add_partition(self, table_name, year, month, day):
        """
        Add partition to Glue table
        """
        location = f's3://{self.bucket}/events/year={year}/month={month:02d}/day={day:02d}/'
        
        response = glue.create_partition(
            DatabaseName=self.database,
            TableName=table_name,
            PartitionInput={
                'Values': [str(year), str(month), str(day)],
                'StorageDescriptor': {
                    'Location': location,
                    'InputFormat': 'org.apache.hadoop.mapred.TextInputFormat',
                    'OutputFormat': 'org.apache.hadoop.hive.ql.io.HiveIgnoreKeyTextOutputFormat',
                    'SerdeInfo': {
                        'SerializationLibrary': 'org.openx.data.jsonserde.JsonSerDe'
                    }
                }
            }
        )
        
        return response

# Usage
lake = DataLake('my-data-lake', 'analytics_db')

# Ingest data
events = [
    {'user_id': 123, 'event': 'purchase', 'value': 99.99},
    {'user_id': 456, 'event': 'click', 'value': 0}
]

lake.ingest_data(events, 'events', {'region': 'us-east'})

# Create table for querying
schema = [
    {'Name': 'user_id', 'Type': 'int'},
    {'Name': 'event', 'Type': 'string'},
    {'Name': 'value', 'Type': 'double'}
]

lake.create_glue_table('events', schema, 'events')
```

**Query with Athena**
```python
import time

athena = boto3.client('athena')

def query_data_lake(query, database, output_location):
    """
    Query data lake using Athena
    """
    # Start query execution
    response = athena.start_query_execution(
        QueryString=query,
        QueryExecutionContext={'Database': database},
        ResultConfiguration={'OutputLocation': output_location}
    )
    
    query_execution_id = response['QueryExecutionId']
    
    # Wait for query to complete
    while True:
        result = athena.get_query_execution(
            QueryExecutionId=query_execution_id
        )
        
        state = result['QueryExecution']['Status']['State']
        
        if state in ['SUCCEEDED', 'FAILED', 'CANCELLED']:
            break
        
        time.sleep(1)
    
    if state == 'SUCCEEDED':
        # Get results
        results = athena.get_query_results(
            QueryExecutionId=query_execution_id
        )
        return results
    else:
        raise Exception(f"Query failed: {state}")

# Example query
sql = """
SELECT 
    user_id,
    COUNT(*) as event_count,
    SUM(value) as total_value
FROM events
WHERE year = 2024 AND month = 1
GROUP BY user_id
ORDER BY total_value DESC
LIMIT 100
"""

results = query_data_lake(
    sql,
    'analytics_db',
    's3://my-bucket/athena-results/'
)
```

### Azure Data Lake Storage (ADLS)

**ADLS Gen2 with Databricks**
```python
from pyspark.sql import SparkSession

# Configure Spark to access ADLS Gen2
spark = SparkSession.builder \
    .appName("DataLakeAnalysis") \
    .config("fs.azure.account.key.mystorageaccount.dfs.core.windows.net", 
            "storage-account-key") \
    .getOrCreate()

# Read data from ADLS
df = spark.read \
    .format("parquet") \
    .load("abfss://container@mystorageaccount.dfs.core.windows.net/data/events/")

# Data processing
from pyspark.sql.functions import *

processed = df \
    .filter(col("year") == 2024) \
    .groupBy("user_id") \
    .agg(
        count("*").alias("event_count"),
        sum("value").alias("total_value"),
        avg("value").alias("avg_value")
    ) \
    .orderBy(desc("total_value"))

# Write back to ADLS
processed.write \
    .mode("overwrite") \
    .partitionBy("year", "month") \
    .parquet("abfss://container@mystorageaccount.dfs.core.windows.net/analytics/user_summary/")

# Register as table for SQL queries
processed.createOrReplaceTempView("user_summary")

# SQL query
result = spark.sql("""
    SELECT *
    FROM user_summary
    WHERE total_value > 1000
    ORDER BY event_count DESC
""")

result.show()
```

**ADLS Access Control**
```python
from azure.storage.filedatalake import DataLakeServiceClient
from azure.identity import DefaultAzureCredential

# Authenticate using Azure AD
credential = DefaultAzureCredential()
service_client = DataLakeServiceClient(
    account_url="https://mystorageaccount.dfs.core.windows.net",
    credential=credential
)

# Set ACLs
file_system_client = service_client.get_file_system_client("container")
directory_client = file_system_client.get_directory_client("sensitive-data")

# Set access control list
acl = "user::rwx,group::r-x,other::---"
directory_client.set_access_control(acl=acl)

# Set ACL recursively
directory_client.set_access_control_recursive(acl=acl)
```

### Google Cloud Storage Data Lake

**GCS with BigQuery External Tables**
```python
from google.cloud import bigquery
from google.cloud import storage

# Create external table pointing to GCS
client = bigquery.Client()

# Define external data configuration
external_config = bigquery.ExternalConfig("PARQUET")
external_config.source_uris = [
    "gs://my-data-lake/events/year=2024/month=01/*"
]
external_config.autodetect = True

# Hive partitioning
hive_partitioning = bigquery.HivePartitioningOptions()
hive_partitioning.mode = "AUTO"
hive_partitioning.source_uri_prefix = "gs://my-data-lake/events/"
external_config.hive_partitioning = hive_partitioning

# Create table
table = bigquery.Table("my-project.analytics.events")
table.external_data_configuration = external_config

table = client.create_table(table)
print(f"Created external table {table.table_id}")

# Query the external table
query = """
    SELECT 
        user_id,
        COUNT(*) as event_count,
        SUM(value) as total_value
    FROM `my-project.analytics.events`
    WHERE year = 2024 AND month = 1
    GROUP BY user_id
    ORDER BY total_value DESC
    LIMIT 100
"""

query_job = client.query(query)
results = query_job.result()

for row in results:
    print(f"User {row.user_id}: {row.event_count} events, ${row.total_value}")
```

## Data Warehouse Architecture

### AWS Redshift

**Optimized Table Design**
```sql
-- Fact table with distribution and sort keys
CREATE TABLE sales_fact (
    sale_id BIGINT IDENTITY(1,1),
    product_id INTEGER,
    customer_id INTEGER,
    sale_date DATE,
    quantity INTEGER,
    amount DECIMAL(10,2)
)
DISTSTYLE KEY
DISTKEY (customer_id)  -- Distribute by customer for JOIN optimization
SORTKEY (sale_date);    -- Sort by date for time-series queries

-- Dimension table replicated to all nodes
CREATE TABLE customers (
    customer_id INTEGER,
    customer_name VARCHAR(100),
    region VARCHAR(50),
    tier VARCHAR(20)
)
DISTSTYLE ALL;  -- Small dimension table, replicate everywhere

-- Load data efficiently
COPY sales_fact
FROM 's3://my-bucket/sales/'
IAM_ROLE 'arn:aws:iam::account:role/RedshiftRole'
FORMAT AS PARQUET
COMPUPDATE ON
STATUPDATE ON;

-- Vacuum and analyze
VACUUM DELETE ONLY sales_fact;
ANALYZE sales_fact;

-- Materialized view for common aggregations
CREATE MATERIALIZED VIEW daily_sales AS
SELECT 
    sale_date,
    product_id,
    SUM(quantity) as total_quantity,
    SUM(amount) as total_amount
FROM sales_fact
GROUP BY sale_date, product_id;

-- Refresh materialized view
REFRESH MATERIALIZED VIEW daily_sales;
```

**Redshift Spectrum - Query S3 directly**
```sql
-- Create external schema
CREATE EXTERNAL SCHEMA spectrum_schema
FROM DATA CATALOG
DATABASE 'analytics_db'
IAM_ROLE 'arn:aws:iam::account:role/RedshiftSpectrumRole'
CREATE EXTERNAL DATABASE IF NOT EXISTS;

-- Create external table
CREATE EXTERNAL TABLE spectrum_schema.historical_sales (
    sale_id BIGINT,
    product_id INTEGER,
    amount DECIMAL(10,2)
)
PARTITIONED BY (year INTEGER, month INTEGER)
STORED AS PARQUET
LOCATION 's3://my-bucket/historical-sales/';

-- Add partitions
ALTER TABLE spectrum_schema.historical_sales
ADD PARTITION (year=2023, month=1)
LOCATION 's3://my-bucket/historical-sales/year=2023/month=01/';

-- Query combines Redshift and S3 data
SELECT 
    r.sale_date,
    r.product_id,
    SUM(r.amount) as recent_sales,
    SUM(h.amount) as historical_sales
FROM sales_fact r
LEFT JOIN spectrum_schema.historical_sales h
    ON r.product_id = h.product_id
WHERE r.sale_date >= '2024-01-01'
GROUP BY r.sale_date, r.product_id;
```

### Azure Synapse Analytics

**Dedicated SQL Pool**
```sql
-- Create table with hash distribution
CREATE TABLE [dbo].[FactSales]
(
    [SaleKey] BIGINT NOT NULL,
    [ProductKey] INT NOT NULL,
    [CustomerKey] INT NOT NULL,
    [OrderDateKey] INT NOT NULL,
    [Quantity] INT NOT NULL,
    [Amount] DECIMAL(10,2) NOT NULL
)
WITH
(
    DISTRIBUTION = HASH([CustomerKey]),
    CLUSTERED COLUMNSTORE INDEX
);

-- Round-robin distribution for staging
CREATE TABLE [dbo].[StageSales]
(
    [SaleData] NVARCHAR(MAX)
)
WITH
(
    DISTRIBUTION = ROUND_ROBIN,
    HEAP
);

-- Load from ADLS Gen2
COPY INTO [dbo].[FactSales]
FROM 'https://mystorageaccount.dfs.core.windows.net/data/sales/*.parquet'
WITH
(
    FILE_TYPE = 'PARQUET',
    CREDENTIAL = (IDENTITY = 'Managed Identity')
);

-- Create statistics
CREATE STATISTICS stats_customer ON [dbo].[FactSales] ([CustomerKey]);
CREATE STATISTICS stats_date ON [dbo].[FactSales] ([OrderDateKey]);

-- Materialized view
CREATE MATERIALIZED VIEW [dbo].[mv_DailySales]
WITH (DISTRIBUTION = HASH([OrderDateKey]))
AS
SELECT 
    OrderDateKey,
    ProductKey,
    SUM(Quantity) AS TotalQuantity,
    SUM(Amount) AS TotalAmount
FROM [dbo].[FactSales]
GROUP BY OrderDateKey, ProductKey;
```

**PolyBase - Query across systems**
```sql
-- Create external data source
CREATE EXTERNAL DATA SOURCE AzureDataLake
WITH (
    TYPE = HADOOP,
    LOCATION = 'abfss://container@mystorageaccount.dfs.core.windows.net',
    CREDENTIAL = AzureStorageCredential
);

-- Create external file format
CREATE EXTERNAL FILE FORMAT ParquetFormat
WITH (
    FORMAT_TYPE = PARQUET,
    DATA_COMPRESSION = 'org.apache.hadoop.io.compress.SnappyCodec'
);

-- Create external table
CREATE EXTERNAL TABLE [ext].[HistoricalSales]
(
    [SaleKey] BIGINT,
    [ProductKey] INT,
    [Amount] DECIMAL(10,2)
)
WITH (
    LOCATION = '/historical-sales/',
    DATA_SOURCE = AzureDataLake,
    FILE_FORMAT = ParquetFormat
);

-- Query combines SQL Pool and Data Lake
SELECT 
    f.OrderDateKey,
    f.ProductKey,
    SUM(f.Amount) AS CurrentSales,
    SUM(h.Amount) AS HistoricalSales
FROM [dbo].[FactSales] f
LEFT JOIN [ext].[HistoricalSales] h
    ON f.ProductKey = h.ProductKey
GROUP BY f.OrderDateKey, f.ProductKey;
```

### Google BigQuery

**Partitioned and Clustered Tables**
```sql
-- Create partitioned table
CREATE OR REPLACE TABLE `my-project.analytics.sales`
(
    sale_id INT64,
    product_id INT64,
    customer_id INT64,
    sale_timestamp TIMESTAMP,
    quantity INT64,
    amount NUMERIC
)
PARTITION BY DATE(sale_timestamp)
CLUSTER BY customer_id, product_id
OPTIONS(
    partition_expiration_days=365,
    require_partition_filter=true
);

-- Insert data
INSERT INTO `my-project.analytics.sales`
SELECT *
FROM `my-project.staging.sales_raw`
WHERE DATE(sale_timestamp) = CURRENT_DATE();

-- Efficient query using partition pruning
SELECT 
    DATE(sale_timestamp) as sale_date,
    product_id,
    SUM(quantity) as total_quantity,
    SUM(amount) as total_amount
FROM `my-project.analytics.sales`
WHERE DATE(sale_timestamp) BETWEEN '2024-01-01' AND '2024-01-31'
GROUP BY DATE(sale_timestamp), product_id;

-- Materialized view (automatically refreshed)
CREATE MATERIALIZED VIEW `my-project.analytics.daily_sales_summary`
AS
SELECT 
    DATE(sale_timestamp) as sale_date,
    product_id,
    customer_id,
    SUM(quantity) as total_quantity,
    SUM(amount) as total_amount
FROM `my-project.analytics.sales`
GROUP BY sale_date, product_id, customer_id;

-- Query federated data from GCS
SELECT *
FROM EXTERNAL_QUERY(
    'my-connection',
    '''SELECT * FROM historical_sales WHERE year = 2023'''
);
```

## Lakehouse Architecture (Delta Lake)

**Delta Lake on Databricks**
```python
from delta.tables import DeltaTable
from pyspark.sql.functions import *

# Create Delta table
df.write \
    .format("delta") \
    .partitionBy("year", "month") \
    .mode("overwrite") \
    .save("/mnt/delta/sales")

# Register as table
spark.sql("""
    CREATE TABLE sales
    USING DELTA
    LOCATION '/mnt/delta/sales'
""")

# ACID transactions - Upsert (Merge)
deltaTable = DeltaTable.forPath(spark, "/mnt/delta/sales")

deltaTable.alias("target").merge(
    updates.alias("source"),
    "target.sale_id = source.sale_id"
).whenMatchedUpdate(set={
    "quantity": "source.quantity",
    "amount": "source.amount"
}).whenNotMatchedInsert(values={
    "sale_id": "source.sale_id",
    "product_id": "source.product_id",
    "quantity": "source.quantity",
    "amount": "source.amount"
}).execute()

# Time travel
df_yesterday = spark.read \
    .format("delta") \
    .option("versionAsOf", 1) \
    .load("/mnt/delta/sales")

# Or by timestamp
df_yesterday = spark.read \
    .format("delta") \
    .option("timestampAsOf", "2024-01-01") \
    .load("/mnt/delta/sales")

# Vacuum old versions
deltaTable.vacuum(168)  # Keep 7 days of history

# Optimize (compaction)
deltaTable.optimize().executeCompaction()

# Z-ordering for better performance
deltaTable.optimize().executeZOrderBy("customer_id", "product_id")
```

## Best Practices

### Data Lake
1. **Organize by domain/subject area**
2. **Partition by date** for time-series data
3. **Use columnar formats** (Parquet, ORC) for better compression and query performance
4. **Implement data lifecycle policies** to archive/delete old data
5. **Catalog your data** (AWS Glue, Azure Purview, Google Data Catalog)

### Data Warehouse
1. **Choose appropriate distribution keys** to minimize data movement
2. **Use sort keys** for range-based queries
3. **Create statistics** for query optimization
4. **Leverage materialized views** for common aggregations
5. **Partition large tables** by date or other high-cardinality columns

## Key Takeaways

1. **Data lakes** store raw data cheaply, schema-on-read
2. **Data warehouses** optimize for analytical queries, schema-on-write
3. **Lakehouse** combines flexibility of lakes with performance of warehouses
4. **Cloud platforms** offer both options with seamless integration
5. **Consider**: query patterns, data volume, cost, governance needs
6. **Modern trend**: Lakehouse architecture (Delta Lake, Iceberg, Hudi)

## Next Steps

- Explore real-time stream processing
- Learn about data mesh architectures
- Study data governance and cataloging
