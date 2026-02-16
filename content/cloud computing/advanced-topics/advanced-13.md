---
id: advanced-13
title: Big Data in Cloud
type: text
---

# Big Data in Cloud

## Overview

Cloud platforms provide scalable infrastructure and managed services for processing massive datasets. From batch processing to real-time streaming, cloud big data services enable organizations to extract insights from petabytes of data.

## Big Data Architecture Patterns

### Lambda Architecture

```
Data Sources
    │
    ├─────────────┬──────────────┐
    │             │              │
Batch Layer   Speed Layer   Serving Layer
    │             │              │
    ▼             ▼              ▼
Historical    Real-time     Query Results
Processing    Processing    
    │             │              
    └──────┬──────┘
           ▼
    Combined Views
```

### Kappa Architecture

```
Data Sources → Stream Processing → Serving Layer
                      │
                      ▼
                Data Storage
```

## Batch Processing Services

### AWS EMR (Elastic MapReduce)

**Cluster Setup and Spark Job**
```python
import boto3

emr = boto3.client('emr', region_name='us-east-1')

# Create EMR cluster
def create_cluster():
    response = emr.run_job_flow(
        Name='analysis-cluster',
        ReleaseLabel='emr-6.9.0',
        Applications=[
            {'Name': 'Spark'},
            {'Name': 'Hadoop'},
            {'Name': 'Hive'},
            {'Name': 'Presto'}
        ],
        Instances={
            'InstanceGroups': [
                {
                    'Name': 'Master',
                    'Market': 'ON_DEMAND',
                    'InstanceRole': 'MASTER',
                    'InstanceType': 'm5.xlarge',
                    'InstanceCount': 1
                },
                {
                    'Name': 'Core',
                    'Market': 'ON_DEMAND',
                    'InstanceRole': 'CORE',
                    'InstanceType': 'm5.xlarge',
                    'InstanceCount': 2
                },
                {
                    'Name': 'Task',
                    'Market': 'SPOT',  # Save costs with spot instances
                    'InstanceRole': 'TASK',
                    'InstanceType': 'm5.xlarge',
                    'InstanceCount': 3,
                    'BidPrice': '0.10'
                }
            ],
            'Ec2KeyName': 'my-key',
            'KeepJobFlowAliveWhenNoSteps': True,
            'TerminationProtected': False,
            'Ec2SubnetId': 'subnet-xxxxx'
        },
        JobFlowRole='EMR_EC2_DefaultRole',
        ServiceRole='EMR_DefaultRole',
        BootstrapActions=[
            {
                'Name': 'Install dependencies',
                'ScriptBootstrapAction': {
                    'Path': 's3://my-bucket/bootstrap.sh'
                }
            }
        ],
        Configurations=[
            {
                'Classification': 'spark-defaults',
                'Properties': {
                    'spark.executor.memory': '8g',
                    'spark.executor.cores': '4',
                    'spark.driver.memory': '4g'
                }
            }
        ]
    )
    
    return response['JobFlowId']

# Submit Spark job
def submit_spark_job(cluster_id):
    response = emr.add_job_flow_steps(
        JobFlowId=cluster_id,
        Steps=[
            {
                'Name': 'Process logs',
                'ActionOnFailure': 'CONTINUE',
                'HadoopJarStep': {
                    'Jar': 'command-runner.jar',
                    'Args': [
                        'spark-submit',
                        '--deploy-mode', 'cluster',
                        '--master', 'yarn',
                        '--conf', 'spark.sql.shuffle.partitions=200',
                        's3://my-bucket/jobs/process_logs.py',
                        '--input', 's3://my-bucket/logs/',
                        '--output', 's3://my-bucket/processed/'
                    ]
                }
            }
        ]
    )
    
    return response['StepIds']

# PySpark job (process_logs.py)
from pyspark.sql import SparkSession
from pyspark.sql.functions import *

spark = SparkSession.builder.appName("LogProcessing").getOrCreate()

# Read data
df = spark.read.json("s3://my-bucket/logs/*.json")

# Process data
processed = df \
    .filter(col("status") == 200) \
    .groupBy("user_id", window(col("timestamp"), "1 hour")) \
    .agg(
        count("*").alias("request_count"),
        avg("response_time").alias("avg_response_time"),
        max("response_time").alias("max_response_time")
    )

# Write results
processed.write \
    .partitionBy("window") \
    .parquet("s3://my-bucket/processed/")

spark.stop()
```

### Azure HDInsight

**Create HDInsight Cluster**
```python
from azure.mgmt.hdinsight import HDInsightManagementClient
from azure.mgmt.hdinsight.models import *

hdinsight_client = HDInsightManagementClient(credentials, subscription_id)

# Define cluster configuration
cluster_params = ClusterCreateParametersExtended(
    location='East US',
    tags={'environment': 'production'},
    properties=ClusterCreateProperties(
        cluster_version='4.0',
        os_type=OSType.linux,
        tier=Tier.standard,
        cluster_definition=ClusterDefinition(
            kind='Spark',
            configurations={
                'gateway': {
                    'restAuthCredential.isEnabled': True,
                    'restAuthCredential.username': 'admin',
                    'restAuthCredential.password': 'Password123!'
                }
            }
        ),
        compute_profile=ComputeProfile(
            roles=[
                Role(
                    name='headnode',
                    target_instance_count=2,
                    hardware_profile=HardwareProfile(
                        vm_size='Standard_D12_v2'
                    ),
                    os_profile=OsProfile(
                        linux_operating_system_profile=LinuxOperatingSystemProfile(
                            username='sshuser',
                            password='Password123!'
                        )
                    )
                ),
                Role(
                    name='workernode',
                    target_instance_count=4,
                    hardware_profile=HardwareProfile(
                        vm_size='Standard_D13_v2'
                    ),
                    os_profile=OsProfile(
                        linux_operating_system_profile=LinuxOperatingSystemProfile(
                            username='sshuser',
                            password='Password123!'
                        )
                    )
                )
            ]
        ),
        storage_profile=StorageProfile(
            storageaccounts=[
                StorageAccount(
                    name='mystorageaccount.blob.core.windows.net',
                    is_default=True,
                    container='hdinsight',
                    key='storage-account-key'
                )
            ]
        )
    )
)

# Create cluster
cluster = hdinsight_client.clusters.begin_create(
    resource_group_name='my-rg',
    cluster_name='my-spark-cluster',
    parameters=cluster_params
).result()
```

### Google Cloud Dataproc

**Create and Manage Dataproc Cluster**
```python
from google.cloud import dataproc_v1

# Initialize clients
cluster_client = dataproc_v1.ClusterControllerClient(
    client_options={'api_endpoint': 'us-central1-dataproc.googleapis.com:443'}
)

job_client = dataproc_v1.JobControllerClient(
    client_options={'api_endpoint': 'us-central1-dataproc.googleapis.com:443'}
)

# Create cluster
def create_dataproc_cluster(project_id, region, cluster_name):
    cluster = {
        'project_id': project_id,
        'cluster_name': cluster_name,
        'config': {
            'master_config': {
                'num_instances': 1,
                'machine_type_uri': 'n1-standard-4',
                'disk_config': {
                    'boot_disk_size_gb': 500
                }
            },
            'worker_config': {
                'num_instances': 2,
                'machine_type_uri': 'n1-standard-4',
                'disk_config': {
                    'boot_disk_size_gb': 500
                }
            },
            'secondary_worker_config': {
                'num_instances': 2,
                'is_preemptible': True  # Save costs
            },
            'software_config': {
                'image_version': '2.0-debian10',
                'properties': {
                    'spark:spark.executor.memory': '8g',
                    'spark:spark.executor.cores': '4'
                }
            },
            'initialization_actions': [
                {
                    'executable_file': 'gs://my-bucket/init.sh'
                }
            ],
            'lifecycle_config': {
                'idle_delete_ttl': {'seconds': 1800}  # Auto-delete after 30 min idle
            }
        }
    }
    
    operation = cluster_client.create_cluster(
        request={
            'project_id': project_id,
            'region': region,
            'cluster': cluster
        }
    )
    
    result = operation.result()
    print(f'Cluster created: {result.cluster_name}')
    return result

# Submit Spark job
def submit_pyspark_job(project_id, region, cluster_name):
    job = {
        'placement': {
            'cluster_name': cluster_name
        },
        'pyspark_job': {
            'main_python_file_uri': 'gs://my-bucket/jobs/process_data.py',
            'args': [
                '--input', 'gs://my-bucket/input/',
                '--output', 'gs://my-bucket/output/'
            ],
            'jar_file_uris': ['gs://spark-lib/bigquery/spark-bigquery-latest.jar'],
            'properties': {
                'spark.executor.instances': '4',
                'spark.executor.memory': '8g'
            }
        }
    }
    
    operation = job_client.submit_job_as_operation(
        request={
            'project_id': project_id,
            'region': region,
            'job': job
        }
    )
    
    response = operation.result()
    print(f'Job finished: {response.status.state.name}')
    return response

# Usage
cluster = create_dataproc_cluster('my-project', 'us-central1', 'analytics-cluster')
job = submit_pyspark_job('my-project', 'us-central1', 'analytics-cluster')
```

## Stream Processing

### AWS Kinesis

**Complete Streaming Pipeline**
```python
import boto3
import json
from datetime import datetime

kinesis = boto3.client('kinesis')
firehose = boto3.client('firehose')

# 1. Produce to Kinesis Stream
def put_record(stream_name, data):
    """Put record into Kinesis stream"""
    response = kinesis.put_record(
        StreamName=stream_name,
        Data=json.dumps(data),
        PartitionKey=str(data.get('user_id', 'default'))
    )
    return response

# 2. Batch put records
def put_records_batch(stream_name, records):
    """Put multiple records efficiently"""
    kinesis_records = [
        {
            'Data': json.dumps(record),
            'PartitionKey': str(record.get('user_id', 'default'))
        }
        for record in records
    ]
    
    response = kinesis.put_records(
        StreamName=stream_name,
        Records=kinesis_records
    )
    
    return response

# 3. Consumer using Lambda
def lambda_handler(event, context):
    """Process Kinesis records in Lambda"""
    
    for record in event['Records']:
        # Decode data
        payload = json.loads(
            base64.b64decode(record['kinesis']['data']).decode('utf-8')
        )
        
        # Process data
        processed = process_event(payload)
        
        # Store in DynamoDB
        dynamodb = boto3.resource('dynamodb')
        table = dynamodb.Table('ProcessedEvents')
        table.put_item(Item=processed)
    
    return {'statusCode': 200}

# 4. Kinesis Analytics Application
analytics_sql = """
CREATE OR REPLACE STREAM "DESTINATION_STREAM" (
    user_id INTEGER,
    event_count BIGINT,
    window_start TIMESTAMP,
    window_end TIMESTAMP
);

CREATE OR REPLACE PUMP "STREAM_PUMP" AS 
INSERT INTO "DESTINATION_STREAM"
SELECT STREAM 
    user_id,
    COUNT(*) as event_count,
    STEP("SOURCE_STREAM".ROWTIME BY INTERVAL '1' MINUTE) as window_start,
    STEP("SOURCE_STREAM".ROWTIME BY INTERVAL '1' MINUTE) + INTERVAL '1' MINUTE as window_end
FROM "SOURCE_STREAM"
GROUP BY 
    user_id,
    STEP("SOURCE_STREAM".ROWTIME BY INTERVAL '1' MINUTE);
"""

# 5. Kinesis Firehose for S3/Redshift
def create_delivery_stream():
    """Create Firehose delivery stream"""
    response = firehose.create_delivery_stream(
        DeliveryStreamName='events-to-s3',
        DeliveryStreamType='KinesisStreamAsSource',
        KinesisStreamSourceConfiguration={
            'KinesisStreamARN': 'arn:aws:kinesis:region:account:stream/events',
            'RoleARN': 'arn:aws:iam::account:role/FirehoseRole'
        },
        ExtendedS3DestinationConfiguration={
            'RoleARN': 'arn:aws:iam::account:role/FirehoseRole',
            'BucketARN': 'arn:aws:s3:::my-bucket',
            'Prefix': 'events/',
            'BufferingHints': {
                'SizeInMBs': 5,
                'IntervalInSeconds': 300
            },
            'CompressionFormat': 'GZIP',
            'DataFormatConversionConfiguration': {
                'Enabled': True,
                'SchemaConfiguration': {
                    'DatabaseName': 'events_db',
                    'TableName': 'events',
                    'Region': 'us-east-1',
                    'RoleARN': 'arn:aws:iam::account:role/FirehoseRole'
                },
                'OutputFormatConfiguration': {
                    'Serializer': {
                        'ParquetSerDe': {}
                    }
                }
            }
        }
    )
    return response
```

### Azure Event Hubs + Stream Analytics

**Event Hub Producer** ```csharp
using Azure.Messaging.EventHubs;
using Azure.Messaging.EventHubs.Producer;

public class EventHubProducer
{
    private EventHubProducerClient producerClient;
    
    public EventHubProducer(string connectionString, string eventHubName)
    {
        producerClient = new EventHubProducerClient(
            connectionString,
            eventHubName
        );
    }
    
    public async Task SendEventsAsync(IEnumerable<object> events)
    {
        using EventDataBatch eventBatch = await producerClient.CreateBatchAsync();
        
        foreach (var eventData in events)
        {
            string json = JsonSerializer.Serialize(eventData);
            
            if (!eventBatch.TryAdd(new EventData(Encoding.UTF8.GetBytes(json))))
            {
                // Batch is full, send and create new batch
                await producerClient.SendAsync(eventBatch);
                eventBatch.Clear();
                eventBatch.TryAdd(new EventData(Encoding.UTF8.GetBytes(json)));
            }
        }
        
        if (eventBatch.Count > 0)
        {
            await producerClient.SendAsync(eventBatch);
        }
    }
}
```

**Stream Analytics Query**
```sql
-- Real-time aggregation
SELECT
    UserId,
    EventType,
    COUNT(*) AS EventCount,
    AVG(Value) AS AvgValue,
    System.Timestamp() AS WindowEnd
INTO
    [OutputPowerBI]
FROM
    [InputEventHub]
TIMESTAMP BY EventTime
GROUP BY
    UserId,
    EventType,
    TumblingWindow(minute, 5)

-- Anomaly detection
SELECT
    UserId,
    Value,
    AnomalyDetection_SpikeAndDip(Value, 95, 120, 'spikesanddips')
        OVER(LIMIT DURATION(hour, 1)) AS AnomalyScore
INTO
    [OutputAlerts]
FROM
    [InputEventHub]
TIMESTAMP BY EventTime
WHERE
    AnomalyDetection_SpikeAndDip(Value, 95, 120, 'spikesanddips')
        OVER(LIMIT DURATION(hour, 1)) IS NOT NULL

-- Join with reference data
SELECT
    e.UserId,
    e.EventType,
    r.UserTier,
    r.Region
INTO
    [OutputEnriched]
FROM
    [InputEventHub] e
TIMESTAMP BY EventTime
JOIN
    [RefDataBlob] r
ON
    e.UserId = r.UserId
```

### Google Cloud Pub/Sub + Dataflow

**Pub/Sub Publisher**
```python
from google.cloud import pubsub_v1
import json

publisher = pubsub_v1.PublisherClient()
topic_path = publisher.topic_path('my-project', 'events')

def publish_message(data):
    """Publish message to Pub/Sub"""
    message_bytes = json.dumps(data).encode('utf-8')
    
    # Publish with attributes
    future = publisher.publish(
        topic_path,
        message_bytes,
        event_type=data.get('type'),
        source='app'
    )
    
    message_id = future.result()
    return message_id

def publish_batch(messages):
    """Publish messages in batch"""
    futures = []
    
    for message in messages:
        message_bytes = json.dumps(message).encode('utf-8')
        future = publisher.publish(topic_path, message_bytes)
        futures.append(future)
    
    # Wait for all to complete
    message_ids = [future.result() for future in futures]
    return message_ids
```

**Dataflow Pipeline (Apache Beam)**
```python
import apache_beam as beam
from apache_beam.options.pipeline_options import PipelineOptions
from apache_beam.io.gcp.pubsub import ReadFromPubSub
from apache_beam.io.gcp.bigquery import WriteToBigQuery

class ParseEvent(beam.DoFn):
    def process(self, element):
        import json
        data = json.loads(element.decode('utf-8'))
        
        # Add processing time
        data['processing_time'] = beam.utils.timestamp.Timestamp.now().to_utc_datetime()
        
        yield data

class CalculateMetrics(beam.DoFn):
    def process(self, element):
        user_id = element[0]
        events = element[1]
        
        metrics = {
            'user_id': user_id,
            'event_count': len(events),
            'total_value': sum(e.get('value', 0) for e in events),
            'avg_value': sum(e.get('value', 0) for e in events) / len(events)
        }
        
        yield metrics

def run():
    options = PipelineOptions(
        streaming=True,
        project='my-project',
        region='us-central1',
        runner='DataflowRunner'
    )
    
    with beam.Pipeline(options=options) as pipeline:
        # Read from Pub/Sub
        events = (
            pipeline
            | 'Read from Pub/Sub' >> ReadFromPubSub(
                subscription='projects/my-project/subscriptions/events-sub'
            )
            | 'Parse' >> beam.ParDo(ParseEvent())
        )
        
        # Windowing and aggregation
        windowed_metrics = (
            events
            | 'Window' >> beam.WindowInto(
                beam.window.FixedWindows(60)  # 1-minute windows
            )
            | 'Key by User' >> beam.Map(lambda x: (x['user_id'], x))
            | 'Group' >> beam.GroupByKey()
            | 'Calculate Metrics' >> beam.ParDo(CalculateMetrics())
        )
        
        # Write to BigQuery
        windowed_metrics | 'Write to BigQuery' >> WriteToBigQuery(
            table='my-project:analytics.user_metrics',
            schema='user_id:STRING,event_count:INTEGER,total_value:FLOAT,avg_value:FLOAT',
            write_disposition=beam.io.BigQueryDisposition.WRITE_APPEND
        )
        
        # Side output for alerts
        (events
            | 'Filter High Value' >> beam.Filter(lambda x: x.get('value', 0) > 1000)
            | 'Write Alerts' >> beam.io.WriteToPubSub(
                'projects/my-project/topics/high-value-alerts'
            )
        )

if __name__ == '__main__':
    run()
```

## Data Warehousing

### AWS Redshift

```python
import psycopg2

# Connect to Redshift
conn = psycopg2.connect(
    host='redshift-cluster.xxx.us-east-1.redshift.amazonaws.com',
    port=5439,
    database='analytics',
    user='admin',
    password='password'
)

cursor = conn.cursor()

# Create table optimized for analytics
cursor.execute("""
    CREATE TABLE IF NOT EXISTS user_events (
        event_id BIGINT IDENTITY(1,1),
        user_id INTEGER,
        event_type VARCHAR(50),
        event_time TIMESTAMP,
        value DECIMAL(10,2)
    )
    DISTKEY(user_id)
    SORTKEY(event_time);
""")

# Load data from S3
cursor.execute("""
    COPY user_events
    FROM 's3://my-bucket/events/'
    IAM_ROLE 'arn:aws:iam::account:role/RedshiftRole'
    FORMAT AS PARQUET;
""")

# Analytical query
cursor.execute("""
    SELECT 
        user_id,
        DATE_TRUNC('day', event_time) as day,
        COUNT(*) as event_count,
        SUM(value) as total_value
    FROM user_events
    WHERE event_time >= DATEADD(day, -30, GETDATE())
    GROUP BY user_id, DATE_TRUNC('day', event_time)
    ORDER BY day DESC, total_value DESC;
""")

results = cursor.fetchall()
conn.close()
```

### Google BigQuery

```python
from google.cloud import bigquery

client = bigquery.Client()

# Query with  SQL
query = """
    SELECT
        user_id,
        DATE(event_time) as day,
        COUNT(*) as event_count,
        SUM(value) as total_value
    FROM `my-project.analytics.user_events`
    WHERE event_time >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 30 DAY)
    GROUP BY user_id, day
    ORDER BY day DESC, total_value DESC
    LIMIT 100
"""

query_job = client.query(query)

for row in query_job:
    print(f"{row.user_id}: {row.event_count} events, ${row.total_value}")

# Stream inserts
rows_to_insert = [
    {"user_id": 123, "event_type": "purchase", "value": 99.99},
    {"user_id": 456, "event_type": "click", "value": 0}
]

errors = client.insert_rows_json(
    'my-project.analytics.user_events',
    rows_to_insert
)

if errors:
    print(f"Errors: {errors}")
```

## Key Takeaways

1. **Batch processing**: EMR, HDInsight, Dataproc for large-scale data processing
2. **Stream processing**: Kinesis, Event Hubs, Pub/Sub for real-time data
3. **Data warehousing**: Redshift, Synapse, BigQuery for analytics
4. **Choose based on**: Data volume, latency requirements, existing infrastructure
5. **Cost optimization**: Use spot/preemptible instances, auto-scaling, data lifecycle policies
6. **Integration**: All platforms integrate with their respective cloud ecosystems

## Next Steps

- Explore data lakes and lakehouse architectures
- Learn about real-time stream processing patterns
- Study data pipeline orchestration
