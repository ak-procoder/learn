---
id: advanced-15
title: Real-time Stream Processing
type: text
---

# Real-time Stream Processing

## Overview

Real-time stream processing enables immediate action on data as it arrives. This lesson covers stream processing concepts, architectures, and implementation across major cloud platforms.

## Stream Processing Concepts

### Key Characteristics

1. **Low Latency**: Process data within milliseconds to seconds
2. **Continuous Processing**: Handle unbounded data streams
3. **Fault Tolerance**: Recover from failures without data loss
4. **Scalability**: Handle varying data volumes
5. **Exactly-once Semantics**: Process each event exactly once

### Event Time vs Processing Time

```python
# Event time: When event actually occurred
event = {
    'user_id': 123,
    'event_type': 'click',
    'event_time': '2024-01-15T10:30:00Z',  # When user clicked
    'processing_time': '2024-01-15T10:30:05Z'  # When system processed
}

# Handling late-arriving data
class WatermarkStrategy:
    def __init__(self, max_out_of_orderness_ms=5000):
        self.max_delay = max_out_of_orderness_ms
    
    def get_watermark(self, current_max_timestamp):
        """
        Watermark = highest event time seen - max allowed delay
        Events older than watermark are considered late
        """
        return current_max_timestamp - self.max_delay
```

## Window Types

### 1. Tumbling Windows

```python
# Fixed, non-overlapping windows
# [0-5s] [5-10s] [10-15s]

from datetime import datetime, timedelta

class TumblingWindow:
    def __init__(self, window_size_seconds):
        self.window_size = timedelta(seconds=window_size_seconds)
        self.windows = {}
    
    def assign_window(self, event_time):
        """Assign event to a window"""
        window_start = event_time - timedelta(
            seconds=event_time.timestamp() % self.window_size.total_seconds()
        )
        window_end = window_start + self.window_size
        
        return (window_start, window_end)
    
    def process(self, event):
        event_time = datetime.fromisoformat(event['event_time'])
        window = self.assign_window(event_time)
        
        if window not in self.windows:
            self.windows[window] = []
        
        self.windows[window].append(event)
        
        return window

# Usage
window_processor = TumblingWindow(window_size_seconds=60)

events = [
    {'user_id': 1, 'value': 10, 'event_time': '2024-01-15T10:00:15Z'},
    {'user_id': 2, 'value': 20, 'event_time': '2024-01-15T10:00:45Z'},
    {'user_id': 3, 'value': 30, 'event_time': '2024-01-15T10:01:10Z'}
]

for event in events:
    window = window_processor.process(event)
    print(f"Event assigned to window: {window}")
```

### 2. Sliding Windows

```python
# Overlapping windows
# [0-5s] 
#   [2-7s]
#     [4-9s]

class SlidingWindow:
    def __init__(self, window_size_seconds, slide_interval_seconds):
        self.window_size = timedelta(seconds=window_size_seconds)
        self.slide = timedelta(seconds=slide_interval_seconds)
        self.windows = {}
    
    def get_windows(self, event_time):
        """Event can belong to multiple windows"""
        windows = []
        
        # Calculate all windows this event belongs to
        current_window_start = event_time - self.window_size
        
        while current_window_start <= event_time:
            window_end = current_window_start + self.window_size
            
            if current_window_start <= event_time < window_end:
                windows.append((current_window_start, window_end))
            
            current_window_start += self.slide
        
        return windows
```

### 3. Session Windows

```python
# Dynamic windows based on inactivity gaps
class SessionWindow:
    def __init__(self, gap_seconds):
        self.gap = timedelta(seconds=gap_seconds)
        self.sessions = {}
    
    def process(self, user_id, event_time):
        """Create session window with gap timeout"""
        
        if user_id not in self.sessions:
            # New session
            self.sessions[user_id] = {
                'start': event_time,
                'end': event_time,
                'events': []
            }
        else:
            session = self.sessions[user_id]
            
            # Check if within gap
            if event_time - session['end'] <= self.gap:
                # Extend existing session
                session['end'] = event_time
            else:
                # Start new session
                self.close_session(user_id)
                self.sessions[user_id] = {
                    'start': event_time,
                    'end': event_time,
                    'events': []
                }
        
        self.sessions[user_id]['events'].append(event_time)
        return self.sessions[user_id]
    
    def close_session(self, user_id):
        """Emit closed session"""
        if user_id in self.sessions:
            session = self.sessions.pop(user_id)
            # Emit session for processing
            return session
```

## Apache Kafka

### Producer

```python
from kafka import KafkaProducer
from kafka.errors import KafkaError
import json

class EventProducer:
    def __init__(self, bootstrap_servers):
        self.producer = KafkaProducer(
            bootstrap_servers=bootstrap_servers,
            value_serializer=lambda v: json.dumps(v).encode('utf-8'),
            key_serializer=lambda k: k.encode('utf-8') if k else None,
            acks='all',  # Wait for all replicas
            retries=3,
            max_in_flight_requests_per_connection=1  # Ensure ordering
        )
    
    def send_event(self, topic, key, value):
        """Send event to Kafka topic"""
        try:
            future = self.producer.send(
                topic=topic,
                key=key,
                value=value,
                partition=None  # Let Kafka decide based on key
            )
            
            # Block for metadata
            metadata = future.get(timeout=10)
            
            print(f"Message sent to {metadata.topic} "
                  f"partition {metadata.partition} "
                  f"offset {metadata.offset}")
            
            return metadata
        
        except KafkaError as e:
            print(f"Failed to send message: {e}")
            raise
    
    def close(self):
        self.producer.flush()
        self.producer.close()

# Usage
producer = EventProducer(['localhost:9092'])

event = {
    'user_id': 123,
    'event_type': 'purchase',
    'amount': 99.99,
    'timestamp': datetime.now().isoformat()
}

producer.send_event('user-events', key='123', value=event)
producer.close()
```

### Consumer

```python
from kafka import KafkaConsumer
import json

class EventConsumer:
    def __init__(self, bootstrap_servers, group_id, topics):
        self.consumer = KafkaConsumer(
            *topics,
            bootstrap_servers=bootstrap_servers,
            group_id=group_id,
            auto_offset_reset='earliest',
            enable_auto_commit=False,  # Manual commit for exactly-once
            value_deserializer=lambda m: json.loads(m.decode('utf-8'))
        )
    
    def process_events(self, processor_fn):
        """Process events with exactly-once semantics"""
        try:
            for message in self.consumer:
                try:
                    # Process message
                    result = processor_fn(message.value)
                    
                    # Commit offset only after successful processing
                    self.consumer.commit()
                    
                    print(f"Processed message from {message.topic} "
                          f"partition {message.partition} "
                          f"offset {message.offset}")
                
                except Exception as e:
                    print(f"Error processing message: {e}")
                    # Don't commit - will reprocess on restart
                    break
        
        finally:
            self.consumer.close()

# Usage
def process_event(event):
    print(f"Processing: {event}")
    # Business logic here
    return f"Processed {event['event_type']}"

consumer = EventConsumer(
    ['localhost:9092'],
    group_id='analytics-group',
    topics=['user-events']
)

consumer.process_events(process_event)
```

## Apache Flink

### Streaming Application

```python
from pyflink.datastream import StreamExecutionEnvironment
from pyflink.datastream.functions import MapFunction, KeyedProcessFunction
from pyflink.common.typeinfo import Types
from pyflink.common.watermark_strategy import WatermarkStrategy
from pyflink.common.time import Time

# Create execution environment
env = StreamExecutionEnvironment.get_execution_environment()
env.set_parallelism(4)

# Enable checkpointing for fault tolerance
env.enable_checkpointing(60000)  # Every 60 seconds

# Define data stream from Kafka
kafka_props = {
    'bootstrap.servers': 'localhost:9092',
    'group.id': 'flink-consumer'
}

stream = env.add_source(
    FlinkKafkaConsumer(
        topics='user-events',
        deserialization_schema=SimpleStringSchema(),
        properties=kafka_props
    )
)

# Parse JSON
class ParseEvent(MapFunction):
    def map(self, value):
        import json
        event = json.loads(value)
        return (
            event['user_id'],
            event['event_type'],
            event['amount'],
            event['timestamp']
        )

parsed = stream.map(ParseEvent(), output_type=Types.TUPLE([
    Types.STRING(),  # user_id
    Types.STRING(),  # event_type
    Types.FLOAT(),   # amount
    Types.STRING()   # timestamp
]))

# Assign timestamps and watermarks
watermark_strategy = WatermarkStrategy \
    .for_bounded_out_of_orderness(Time.seconds(5)) \
    .with_timestamp_assigner(lambda event, ts: parse_timestamp(event[3]))

watermarked = parsed.assign_timestamps_and_watermarks(watermark_strategy)

# Windowed aggregation
class AggregateFunction(KeyedProcessFunction):
    def process_element(self, value, ctx):
        user_id = value[0]
        amount = value[2]
        
        # Get or create state
        count_state = ctx.get_state(ValueStateDescriptor(
            "count", Types.INT()
        ))
        sum_state = ctx.get_state(ValueStateDescriptor(
            "sum", Types.FLOAT()
        ))
        
        count = count_state.value() or 0
        total = sum_state.value() or 0.0
        
        # Update state
        count_state.update(count + 1)
        sum_state.update(total + amount)
        
        # Emit result
        yield (user_id, count + 1, total + amount)

result = watermarked \
    .key_by(lambda x: x[0]) \
    .window(TumblingEventTimeWindows.of(Time.minutes(5))) \
    .process(AggregateFunction())

# Sink to Kafka
result.add_sink(
    FlinkKafkaProducer(
        topic='aggregated-events',
        serialization_schema=SimpleStringSchema(),
        producer_config=kafka_props
    )
)

# Execute
env.execute("User Event Aggregation")
```

## AWS Kinesis Data Analytics

### SQL-based Stream Processing

```sql
-- Create input stream
CREATE OR REPLACE STREAM "SOURCE_SQL_STREAM_001" (
    user_id INTEGER,
    event_type VARCHAR(50),
    amount DECIMAL(10,2),
    event_time TIMESTAMP
);

-- Tumbling window aggregation
CREATE OR REPLACE STREAM "DEST_SQL_STREAM_001" (
    user_id INTEGER,
    event_count BIGINT,
    total_amount DECIMAL(10,2),
    window_start TIMESTAMP,
    window_end TIMESTAMP
);

CREATE OR REPLACE PUMP "STREAM_PUMP_001" AS 
INSERT INTO "DEST_SQL_STREAM_001"
SELECT STREAM 
    user_id,
    COUNT(*) as event_count,
    SUM(amount) as total_amount,
    STEP("SOURCE_SQL_STREAM_001".ROWTIME BY INTERVAL '1' MINUTE) as window_start,
    STEP("SOURCE_SQL_STREAM_001".ROWTIME BY INTERVAL '1' MINUTE) + INTERVAL '1' MINUTE as window_end
FROM "SOURCE_SQL_STREAM_001"
GROUP BY 
    user_id,
    STEP("SOURCE_SQL_STREAM_001".ROWTIME BY INTERVAL '1' MINUTE);

-- Anomaly detection
CREATE OR REPLACE STREAM "ANOMALY_STREAM" (
    user_id INTEGER,
    amount DECIMAL(10,2),
    anomaly_score DOUBLE
);

CREATE OR REPLACE PUMP "ANOMALY_PUMP" AS
INSERT INTO "ANOMALY_STREAM"
SELECT STREAM 
    user_id,
    amount,
    ANOMALY_SCORE
FROM TABLE(
    RANDOM_CUT_FOREST(
        CURSOR(SELECT STREAM * FROM "SOURCE_SQL_STREAM_001")
    )
)
WHERE ANOMALY_SCORE > 2.0;
```

### Managed Apache Flink (Kinesis Data Analytics)

```python
import boto3

kda = boto3.client('kinesisanalyticsv2')

# Create Flink application
response = kda.create_application(
    ApplicationName='user-event-processor',
    RuntimeEnvironment='FLINK-1_15',
    ServiceExecutionRole='arn:aws:iam::ACCOUNT:role/KDARole',
    ApplicationConfiguration={
        'ApplicationCodeConfiguration': {
            'CodeContent': {
                'S3ContentLocation': {
                    'BucketARN': 'arn:aws:s3:::my-bucket',
                    'FileKey': 'flink-app.jar'
                }
            },
            'CodeContentType': 'ZIPFILE'
        },
        'EnvironmentProperties': {
            'PropertyGroups': [
                {
                    'PropertyGroupId': 'ConsumerConfigProperties',
                    'PropertyMap': {
                        'input.stream.name': 'user-events',
                        'aws.region': 'us-east-1'
                    }
                }
            ]
        },
        'FlinkApplicationConfiguration': {
            'CheckpointConfiguration': {
                'ConfigurationType': 'CUSTOM',
                'CheckpointingEnabled': True,
                'CheckpointInterval': 60000,
                'MinPauseBetweenCheckpoints': 5000
            },
            'ParallelismConfiguration': {
                'ConfigurationType': 'CUSTOM',
                'Parallelism': 4,
                'ParallelismPerKPU': 1,
                'AutoScalingEnabled': True
            }
        }
    }
)
```

## Change Data Capture (CDC)

```python
# Debezium connector for MySQL CDC
connector_config = {
    "name": "mysql-connector",
    "config": {
        "connector.class": "io.debezium.connector.mysql.MySqlConnector",
        "database.hostname": "mysql.example.com",
        "database.port": "3306",
        "database.user": "debezium",
        "database.password": "password",
        "database.server.id": "184054",
        "database.server.name": "mysql-server",
        "database.include.list": "inventory",
        "table.include.list": "inventory.customers,inventory.orders",
        "database.history.kafka.bootstrap.servers": "localhost:9092",
        "database.history.kafka.topic": "schema-changes"
    }
}

# Process CDC events
class CDCProcessor:
    def process_change(self, change_event):
        """Process database change event"""
        
        payload = change_event['payload']
        
        if payload['op'] == 'c':  # Create
            self.handle_insert(payload['after'])
        elif payload['op'] == 'u':  # Update
            self.handle_update(payload['before'], payload['after'])
        elif payload['op'] == 'd':  # Delete
            self.handle_delete(payload['before'])
    
    def handle_insert(self, record):
        print(f"New record: {record}")
        # Update cache, search index, etc.
    
    def handle_update(self, before, after):
        print(f"Updated: {before} -> {after}")
        # Invalidate cache, update denormalized data
    
    def handle_delete(self, record):
        print(f"Deleted: {record}")
        # Remove from cache, update aggregates
```

## Stream Processing Best Practices

### 1. Handle Late Data

```python
class LateDataHandler:
    def __init__(self, allowed_lateness_seconds):
        self.allowed_lateness = timedelta(seconds=allowed_lateness_seconds)
        self.closed_windows = {}
    
    def process(self, event, window):
        """Process event considering late arrival"""
        
        current_watermark = self.get_watermark()
        window_end = window[1]
        
        if current_watermark - window_end > self.allowed_lateness:
            # Too late - window already closed and emitted
            print(f"Discarding late event: {event}")
            self.emit_to_side_output(event)
        else:
            # Still within allowed lateness
            self.add_to_window(event, window)
            
            if window not in self.closed_windows:
                # Re-emit updated results
                self.emit_window_results(window)
```

### 2. Exactly-Once Processing

```python
class ExactlyOnceProcessor:
    def __init__(self):
        self.processed_ids = set()
        self.transaction_state = {}
    
    def process_with_deduplication(self, event):
        """Ensure exactly-once processing"""
        
        event_id = event['id']
        
        # Check if already processed
        if event_id in self.processed_ids:
            print(f"Skipping duplicate event: {event_id}")
            return
        
        # Start transaction
        transaction_id = self.begin_transaction()
        
        try:
            # Process event
            result = self.process_event(event)
            
            # Store result
            self.store_result(result, transaction_id)
            
            # Mark as processed
            self.processed_ids.add(event_id)
            
            # Commit transaction
            self.commit_transaction(transaction_id)
            
        except Exception as e:
            # Rollback on error
            self.rollback_transaction(transaction_id)
            raise
```

### 3. Backpressure Handling

```python
class BackpressureHandler:
    def __init__(self, buffer_size=1000, batch_size=100):
        self.buffer = []
        self.buffer_size = buffer_size
        self.batch_size = batch_size
    
    def add_event(self, event):
        """Add event with backpressure"""
        
        if len(self.buffer) >= self.buffer_size:
            # Buffer full - apply backpressure
            print("Buffer full, applying backpressure")
            self.process_batch(force=True)
        
        self.buffer.append(event)
        
        if len(self.buffer) >= self.batch_size:
            self.process_batch()
    
    def process_batch(self, force=False):
        """Process buffered events in batch"""
        
        if not self.buffer:
            return
        
        batch = self.buffer[:self.batch_size]
        
        try:
            # Process batch
            results = self.batch_process(batch)
            
            # Remove processed events
            self.buffer = self.buffer[self.batch_size:]
            
        except Exception as e:
            print(f"Batch processing failed: {e}")
            if force:
                # Discard to prevent indefinite blocking
                self.buffer = self.buffer[self.batch_size:]
```

## Key Takeaways

1. **Stream processing** enables real-time insights and immediate action
2. **Windowing** aggregates unbounded streams into bounded computations
3. **Watermarks** handle out-of-order and late data
4. **Exactly-once** semantics prevent duplicate processing
5. **Backpressure** prevents system overload
6. **Choose platform** based on: latency requirements, scale, ecosystem integration

## Next Steps

- Explore DevOps practices in cloud
- Learn about CI/CD pipelines
- Study infrastructure as code
