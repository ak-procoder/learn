---
id: provider-30
title: GCP - AI/ML and Data Analytics
type: text
---

# GCP - AI/ML and Data Analytics

GCP offers a comprehensive suite of AI, machine learning, and big data services, leveraging Google's expertise in data processing and artificial intelligence.

## Vertex AI

Unified platform for building, deploying, and managing ML models.

### Vertex AI Features

- **AutoML**: Train custom models without code
- **Custom Training**: Use your own ML framework
- **Prediction**: Deploy models for inference
- **Pipelines**: Orchestrate ML workflows
- **Feature Store**: Centralized feature  management
- **Model Monitoring**: Track model performance
- **Experiments**: Track and compare training runs

### AutoML Training

```python
from google.cloud import aiplatform

# Initialize
aiplatform.init(project='my-project', location='us-central1')

# Create dataset
dataset = aiplatform.TabularDataset.create(
    display_name="customer-churn",
    gcs_source=['gs://my-bucket/data/train.csv']
)

# Train AutoML model
job = aiplatform.AutoMLTabularTrainingJob(
    display_name="churn-prediction",
    optimization_prediction_type="classification",
    optimization_objective="minimize-log-loss"
)

model = job.run(
    dataset=dataset,
    target_column="churned",
    training_fraction_split=0.8,
    validation_fraction_split=0.1,
    test_fraction_split=0.1,
    budget_milli_node_hours=1000,
    model_display_name="churn-model-v1"
)
```

### Custom Training with TensorFlow

```python
from google.cloud import aiplatform
from google.cloud.aiplatform import gapic

# Define training script
training_script = """
import tensorflow as tf
from google.cloud import storage

def create_model():
    model = tf.keras.Sequential([
        tf.keras.layers.Dense(128, activation='relu', input_shape=(10,)),
        tf.keras.layers.Dropout(0.2),
        tf.keras.layers.Dense(64, activation='relu'),
        tf.keras.layers.Dense(1, activation='sigmoid')
    ])
    model.compile(
        optimizer='adam',
        loss='binary_crossentropy',
        metrics=['accuracy']
    )
    return model

def train_model(x_train, y_train):
    model = create_model()
    model.fit(x_train, y_train, epochs=50, batch_size=32, validation_split=0.2)
    return model

if __name__ == '__main__':
    # Load data, train model
    # Save to Cloud Storage
    pass
"""

# Create custom training job
job = aiplatform.CustomTrainingJob(
    display_name="custom-training",
    script_path="trainer/task.py",
    container_uri="gcr.io/cloud-aiplatform/training/tf-cpu.2-11:latest",
    requirements=["tensorflow==2.11.0", "pandas", "scikit-learn"],
    model_serving_container_image_uri="gcr.io/cloud-aiplatform/prediction/tf2-cpu.2-11:latest"
)

model = job.run(
    dataset=dataset,
    model_display_name="custom-model-v1",
    machine_type="n1-standard-4",
    accelerator_type="NVIDIA_TESLA_T4",
    accelerator_count=1,
    replica_count=1
)
```

### Model Deployment

```python
# Deploy model to endpoint
endpoint = aiplatform.Endpoint.create(display_name="churn-endpoint")

model.deploy(
    endpoint=endpoint,
    deployed_model_display_name="churn-v1",
    machine_type="n1-standard-2",
    min_replica_count=1,
    max_replica_count=10,
    traffic_percentage=100
)

# Make predictions
instances = [
    [0.5, 0.3, 0.8, 0.2, 0.1, 0.7, 0.4, 0.6, 0.9, 0.3],
    [0.2, 0.8, 0.1, 0.9, 0.4, 0.3, 0.7, 0.2, 0.5, 0.6]
]

predictions = endpoint.predict(instances=instances)
print(predictions.predictions)
```

### Vertex AI Pipelines

```python
from kfp.v2 import dsl
from kfp.v2.dsl import component, pipeline, Input, Output, Dataset, Model
from google.cloud import aiplatform

@component(
    packages_to_install=["pandas", "scikit-learn"]
)
def prepare_data(
    input_data: Input[Dataset],
    train_data: Output[Dataset],
    test_data: Output[Dataset]
):
    import pandas as pd
    from sklearn.model_selection import train_test_split
    
    df = pd.read_csv(input_data.path)
    train, test = train_test_split(df, test_size=0.2)
    
    train.to_csv(train_data.path, index=False)
    test.to_csv(test_data.path, index=False)

@component(
    packages_to_install=["pandas", "scikit-learn", "joblib"]
)
def train_model(
    train_data: Input[Dataset],
    model: Output[Model]
):
    import pandas as pd
    from sklearn.ensemble import RandomForestClassifier
    import joblib
    
    df = pd.read_csv(train_data.path)
    X = df.drop('target', axis=1)
    y = df['target']
    
    clf = RandomForestClassifier(n_estimators=100)
    clf.fit(X, y)
    
    joblib.dump(clf, model.path)

@pipeline(name="ml-pipeline")
def ml_pipeline(project: str, input_data_path: str):
    prepare_task = prepare_data(input_data=input_data_path)
    train_task = train_model(train_data=prepare_task.outputs['train_data'])

# Compile and run pipeline
from kfp.v2 import compiler

compiler.Compiler().compile(
    pipeline_func=ml_pipeline,
    package_path='pipeline.json'
)

# Run pipeline
job = aiplatform.PipelineJob(
    display_name="ml-pipeline-run",
    template_path="pipeline.json",
    parameter_values={
        'project': 'my-project',
        'input_data_path': 'gs://my-bucket/data/input.csv'
    }
)

job.run()
```

## Pre-trained AI APIs

### Vision API

```python
from google.cloud import vision

client = vision.ImageAnnotatorClient()

# Analyze image from Cloud Storage
image = vision.Image()
image.source.image_uri = 'gs://my-bucket/image.jpg'

# Label detection
response = client.label_detection(image=image)
labels = response.label_annotations

for label in labels:
    print(f'{label.description}: {label.score:.2%}')

# Text detection (OCR)
response = client.text_detection(image=image)
texts = response.text_annotations

if texts:
    print(f'Detected text: {texts[0].description}')

# Face detection
response = client.face_detection(image=image)
faces = response.face_annotations

for face in faces:
    print(f'Joy likelihood: {face.joy_likelihood.name}')
    print(f'Sorrow likelihood: {face.sorrow_likelihood.name}')

# Safe search detection
response = client.safe_search_detection(image=image)
safe = response.safe_search_annotation

print(f'Adult: {safe.adult.name}')
print(f'Violence: {safe.violence.name}')
```

### Natural Language API

```python
from google.cloud import language_v1

client = language_v1.LanguageServiceClient()

text = "Google Cloud Platform is an awesome cloud provider with great AI services!"

document = language_v1.Document(
    content=text,
    type_=language_v1.Document.Type.PLAIN_TEXT
)

# Sentiment analysis
sentiment = client.analyze_sentiment(
    request={'document': document}
).document_sentiment

print(f'Score: {sentiment.score}')  # -1.0 to 1.0
print(f'Magnitude: {sentiment.magnitude}')

# Entity analysis
response = client.analyze_entities(
    request={'document': document}
)

for entity in response.entities:
    print(f'Name: {entity.name}')
    print(f'Type: {entity.type_.name}')
    print(f'Salience: {entity.salience}')

# Syntax analysis
response = client.analyze_syntax(
    request={'document': document}
)

for token in response.tokens:
    print(f'{token.text.content}: {token.part_of_speech.tag.name}')
```

### Translation API

```python
from google.cloud import translate_v2 as translate

client = translate.Client()

# Translate text
text = "Hello, how are you?"
target = 'es'

result = client.translate(text, target_language=target)

print(f'Text: {result["input"]}')
print(f'Translation: {result["translatedText"]}')
print(f'Detected language: {result["detectedSourceLanguage"]}')

# Detect language
result = client.detect_language("Bonjour tout le monde")
print(f'Language: {result["language"]}')
print(f'Confidence: {result["confidence"]}')

# List supported languages
languages = client.get_languages()
for language in languages:
    print(f'{language["name"]}: {language["language"]}')
```

### Speech-to-Text API

```python
from google.cloud import speech

client = speech.SpeechClient()

# Audio from Cloud Storage
audio = speech.RecognitionAudio(
    uri='gs://my-bucket/audio.wav'
)

config = speech.RecognitionConfig(
    encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
    sample_rate_hertz=16000,
    language_code='en-US',
    enable_automatic_punctuation=True
)

# Synchronous recognition (< 1 minute)
response = client.recognize(config=config, audio=audio)

for result in response.results:
    print(f'Transcript: {result.alternatives[0].transcript}')
    print(f'Confidence: {result.alternatives[0].confidence}')

# Long audio recognition (> 1 minute)
operation = client.long_running_recognize(config=config, audio=audio)
response = operation.result(timeout=300)

for result in response.results:
    print(f'Transcript: {result.alternatives[0].transcript}')
```

## BigQuery

Serverless, highly scalable data warehouse.

### BigQuery Features

- **Petabyte-scale**: Handle massive datasets
- **Serverless**: No infrastructure management
- **SQL interface**: Standard SQL queries
- **Columnar storage**: Fast analytical queries
- **Real-time analysis**: Streaming inserts
- **ML integration**: BigQuery ML
- **Data sharing**: Analytics Hub

### Creating and Querying Tables

```bash
# Create dataset
bq mk --dataset --location=US my_dataset

# Create table from CSV
bq load \
  --source_format=CSV \
  --skip_leading_rows=1 \
  my_dataset.customers \
  gs://my-bucket/customers.csv \
  customer_id:INTEGER,name:STRING,email:STRING,country:STRING

# Query table
bq query --use_legacy_sql=false \
'SELECT country, COUNT(*) as customer_count
FROM `my-project.my_dataset.customers`
GROUP BY country
ORDER BY customer_count DESC
LIMIT 10'
```

### Python Client

```python
from google.cloud import bigquery

client = bigquery.Client()

# Run query
query = """
    SELECT
        name,
        COUNT(*) as count
    FROM `bigquery-public-data.usa_names.usa_1910_2013`
    WHERE state = 'TX'
    GROUP BY name
    ORDER BY count DESC
    LIMIT 20
"""

query_job = client.query(query)
results = query_job.result()

for row in results:
    print(f"{row.name}: {row.count}")

# Insert data
table_id = "my-project.my_dataset.my_table"
rows_to_insert = [
    {"name": "Alice", "age": 30, "city": "New York"},
    {"name": "Bob", "age": 25, "city": "San Francisco"}
]

errors = client.insert_rows_json(table_id, rows_to_insert)
if errors == []:
    print("New rows added.")
else:
    print(f"Errors: {errors}")

# Create table
schema = [
    bigquery.SchemaField("name", "STRING", mode="REQUIRED"),
    bigquery.SchemaField("age", "INTEGER", mode="REQUIRED"),
    bigquery.SchemaField("email", "STRING", mode="NULLABLE")
]

table = bigquery.Table(table_id, schema=schema)
table = client.create_table(table)

# Load from CSV
job_config = bigquery.LoadJobConfig(
    source_format=bigquery.SourceFormat.CSV,
    skip_leading_rows=1,
    autodetect=True
)

uri = "gs://my-bucket/data.csv"
load_job = client.load_table_from_uri(
    uri, table_id, job_config=job_config
)

load_job.result()  # Wait for completion
```

### BigQuery ML

```sql
-- Create model
CREATE OR REPLACE MODEL `my_dataset.churn_model`
OPTIONS(
  model_type='logistic_reg',
  input_label_cols=['churned']
) AS
SELECT
  age,
  tenure,
  monthly_charges,
  total_charges,
  churned
FROM
  `my_dataset.customers`;

-- Evaluate model
SELECT
  *
FROM
  ML.EVALUATE(MODEL `my_dataset.churn_model`,
    (
      SELECT
        age,
        tenure,
        monthly_charges,
        total_charges,
        churned
      FROM
        `my_dataset.test_data`
    )
  );

-- Make predictions
SELECT
  customer_id,
  predicted_churned,
  predicted_churned_probs
FROM
  ML.PREDICT(MODEL `my_dataset.churn_model`,
    (
      SELECT
        customer_id,
        age,
        tenure,
        monthly_charges,
        total_charges
      FROM
        `my_dataset.new_customers`
    )
  );
```

## Dataflow

Unified stream and batch data processing (Apache Beam).

```python
import apache_beam as beam
from apache_beam.options.pipeline_options import PipelineOptions

# Define pipeline
def run_pipeline():
    pipeline_options = PipelineOptions(
        project='my-project',
        runner='DataflowRunner',
        region='us-central1',
        staging_location='gs://my-bucket/staging',
        temp_location='gs://my-bucket/temp'
    )
    
    with beam.Pipeline(options=pipeline_options) as p:
        (p
         | 'Read' >> beam.io.ReadFromText('gs://my-bucket/input.txt')
         | 'Split' >> beam.FlatMap(lambda line: line.split())
         | 'PairWithOne' >> beam.Map(lambda word: (word, 1))
         | 'GroupAndSum' >> beam.CombinePerKey(sum)
         | 'Format' >> beam.Map(lambda kv: f'{kv[0]}: {kv[1]}')
         | 'Write' >> beam.io.WriteToText('gs://my-bucket/output.txt')
        )

run_pipeline()
```

## Pub/Sub

Real-time messaging service.

```python
from google.cloud import pubsub_v1
import json

# Publisher
publisher = pubsub_v1.PublisherClient()
topic_path = publisher.topic_path('my-project', 'my-topic')

data = json.dumps({"user_id": 123, "action": "login"})
future = publisher.publish(topic_path, data.encode('utf-8'), username='alice')
print(f'Published message ID: {future.result()}')

# Subscriber
from concurrent.futures import TimeoutError

subscriber = pubsub_v1.SubscriberClient()
subscription_path = subscriber.subscription_path('my-project', 'my-subscription')

def callback(message):
    print(f'Received: {message.data.decode()}')
    message.ack()

streaming_pull_future = subscriber.subscribe(subscription_path, callback=callback)

try:
    streaming_pull_future.result(timeout=60)
except TimeoutError:
    streaming_pull_future.cancel()
```

## Best Practices

1. **Use AutoML for quick prototyping**: Then optimize with custom training
2. **Monitor model performance**: Set up alerts for drift
3. **Version your models**: Track experiments and deployments
4. **Leverage pre-trained APIs**: Faster time to market
5. **Optimize BigQuery costs**: Partition and cluster tables
6. **Use streaming for real-time**: Pub/Sub + Dataflow
7. **Cache frequent queries**: Reduce costs and latency
8. **Implement data governance**: Access controls and auditing
9. **Test with representative data**: Ensure model generalization
10. **Automate ML pipelines**: Vertex AI Pipelines for reproducibility

GCP's AI/ML and data analytics services provide powerful tools for building intelligent applications and deriving insights from data at scale.
