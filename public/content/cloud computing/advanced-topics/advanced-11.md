---
id: advanced-11
title: AI/ML in Cloud - Overview
type: text
---

# AI/ML in Cloud - Overview

## Overview

Cloud platforms provide comprehensive AI and machine learning services that democratize access to advanced capabilities. From pre-trained models to custom ML workflows, cloud providers offer tools for every use case and skill level.

## AI/ML Service Tiers

### Three Levels of ML Services

```
┌─────────────────────────────────────────┐
│  Pre-trained AI APIs (Highest Level)   │
│  - Vision, Speech, Language, Translation│
│  - No ML expertise required             │
│  - Ready-to-use via API calls           │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│  AutoML (Medium Level)                  │
│  - Custom models with minimal coding    │
│  - Transfer learning                    │
│  - Some ML knowledge helpful            │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│  Custom ML (Lowest Level)               │
│  - Full control over models             │
│  - Requires ML expertise                │
│  - Frameworks: TensorFlow, PyTorch      │
└─────────────────────────────────────────┘
```

## Pre-trained AI Services

### 1. Computer Vision

**AWS Rekognition Example**
```python
import boto3
from PIL import Image
import io

rekognition = boto3.client('rekognition')

def analyze_image(image_path):
    """Detect objects, faces, and text in images"""
    
    with open(image_path, 'rb') as image_file:
        image_bytes = image_file.read()
    
    # Detect labels (objects, scenes, activities)
    labels_response = rekognition.detect_labels(
        Image={'Bytes': image_bytes},
        MaxLabels=10,
        MinConfidence=80
    )
    
    print("Detected labels:")
    for label in labels_response['Labels']:
        print(f"  {label['Name']}: {label['Confidence']:.2f}%")
    
    # Detect faces
    faces_response = rekognition.detect_faces(
        Image={'Bytes': image_bytes},
        Attributes=['ALL']
    )
    
    print("\nDetected faces:")
    for face in faces_response['FaceDetails']:
        print(f"  Age range: {face['AgeRange']['Low']}-{face['AgeRange']['High']}")
        print(f"  Gender: {face['Gender']['Value']} ({face['Gender']['Confidence']:.2f}%)")
        print(f"  Emotions: {face['Emotions'][0]['Type']} ({face['Emotions'][0]['Confidence']:.2f}%)")
    
    # Detect text
    text_response = rekognition.detect_text(
        Image={'Bytes': image_bytes}
    )
    
    print("\nDetected text:")
    for text in text_response['TextDetections']:
        if text['Type'] == 'LINE':
            print(f"  {text['DetectedText']} ({text['Confidence']:.2f}%)")
    
    return {
        'labels': labels_response['Labels'],
        'faces': faces_response['FaceDetails'],
        'text': text_response['TextDetections']
    }

# Usage
results = analyze_image('photo.jpg')
```

**Azure Computer Vision Example**
```python
from azure.cognitiveservices.vision.computervision import ComputerVisionClient
from azure.cognitiveservices.vision.computervision.models import VisualFeatureTypes
from msrest.authentication import CognitiveServicesCredentials

subscription_key = "YOUR_SUBSCRIPTION_KEY"
endpoint = "https://YOUR_RESOURCE.cognitiveservices.azure.com/"

credentials = CognitiveServicesCredentials(subscription_key)
client = ComputerVisionClient(endpoint, credentials)

def analyze_image_azure(image_url):
    """Analyze image using Azure Computer Vision"""
    
    # Specify features to extract
    features = [
        VisualFeatureTypes.categories,
        VisualFeatureTypes.description,
        VisualFeatureTypes.faces,
        VisualFeatureTypes.objects,
        VisualFeatureTypes.tags,
        VisualFeatureTypes.brands
    ]
    
    # Analyze image
    results = client.analyze_image(image_url, visual_features=features)
    
    # Print description
    print("Image description:")
    for caption in results.description.captions:
        print(f"  {caption.text} (confidence: {caption.confidence:.2f})")
    
    # Print detected objects
    print("\nDetected objects:")
    for obj in results.objects:
        print(f"  {obj.object_property} at ({obj.rectangle.x}, {obj.rectangle.y})")
    
    # Print tags
    print("\nTags:")
    for tag in results.tags:
        print(f"  {tag.name}: {tag.confidence:.2f}")
    
    return results

# Usage
results = analyze_image_azure('https://example.com/image.jpg')
```

### 2. Natural Language Processing

**Google Cloud Natural Language API**
```python
from google.cloud import language_v1

def analyze_text(text):
    """Analyze text for entities, sentiment, and syntax"""
    
    client = language_v1.LanguageServiceClient()
    document = language_v1.Document(
        content=text,
        type_=language_v1.Document.Type.PLAIN_TEXT
    )
    
    # Analyze sentiment
    sentiment = client.analyze_sentiment(
        request={'document': document}
    ).document_sentiment
    
    print(f"Sentiment: {sentiment.score:.2f} (magnitude: {sentiment.magnitude:.2f})")
    
    # Extract entities
    entities_response = client.analyze_entities(
        request={'document': document}
    )
    
    print("\nEntities:")
    for entity in entities_response.entities:
        print(f"  {entity.name} ({entity.type_.name}): {entity.salience:.2f}")
    
    # Analyze syntax
    syntax_response = client.analyze_syntax(
        request={'document': document}
    )
    
    print("\nSyntax analysis:")
    for token in syntax_response.tokens[:5]:  # First 5 tokens
        print(f"  {token.text.content}: {token.part_of_speech.tag.name}")
    
    # Classify content
    categories = client.classify_text(
        request={'document': document}
    ).categories
    
    print("\nCategories:")
    for category in categories:
        print(f"  {category.name}: {category.confidence:.2f}")

# Usage
text = """
Google Cloud Platform is a suite of cloud computing services that runs on 
the same infrastructure that Google uses internally for its end-user products. 
It provides computing, storage, networking, and machine learning capabilities.
"""

analyze_text(text)
```

**AWS Comprehend Example**
```python
import boto3
import json

comprehend = boto3.client('comprehend')

def analyze_text_aws(text):
    """Analyze text using AWS Comprehend"""
    
    # Detect language
    language = comprehend.detect_dominant_language(Text=text)
    lang_code = language['Languages'][0]['LanguageCode']
    
    print(f"Language: {lang_code}")
    
    # Detect sentiment
    sentiment = comprehend.detect_sentiment(
        Text=text,
        LanguageCode=lang_code
    )
    
    print(f"\nSentiment: {sentiment['Sentiment']}")
    print(f"Scores: {json.dumps(sentiment['SentimentScore'], indent=2)}")
    
    # Extract entities
    entities = comprehend.detect_entities(
        Text=text,
        LanguageCode=lang_code
    )
    
    print("\nEntities:")
    for entity in entities['Entities']:
        print(f"  {entity['Text']} ({entity['Type']}): {entity['Score']:.2f}")
    
    # Extract key phrases
    phrases = comprehend.detect_key_phrases(
        Text=text,
        LanguageCode=lang_code
    )
    
    print("\nKey Phrases:")
    for phrase in phrases['KeyPhrases']:
        print(f"  {phrase['Text']}: {phrase['Score']:.2f}")
    
    return {
        'language': lang_code,
        'sentiment': sentiment,
        'entities': entities['Entities'],
        'phrases': phrases['KeyPhrases']
    }
```

### 3. Speech Services

**Azure Speech Services**
```python
import azure.cognitiveservices.speech as speechsdk

def speech_to_text(audio_file):
    """Convert speech to text"""
    
    speech_config = speechsdk.SpeechConfig(
        subscription="YOUR_KEY",
        region="eastus"
    )
    
    audio_config = speechsdk.audio.AudioConfig(filename=audio_file)
    
    speech_recognizer = speechsdk.SpeechRecognizer(
        speech_config=speech_config,
        audio_config=audio_config
    )
    
    result = speech_recognizer.recognize_once()
    
    if result.reason == speechsdk.ResultReason.RecognizedSpeech:
        print(f"Recognized: {result.text}")
        return result.text
    elif result.reason == speechsdk.ResultReason.NoMatch:
        print("No speech could be recognized")
    elif result.reason == speechsdk.ResultReason.Canceled:
        print(f"Canceled: {result.cancellation_details.reason}")

def text_to_speech(text, output_file):
    """Convert text to speech"""
    
    speech_config = speechsdk.SpeechConfig(
        subscription="YOUR_KEY",
        region="eastus"
    )
    
    # Set voice
    speech_config.speech_synthesis_voice_name = "en-US-AriaNeural"
    
    audio_config = speechsdk.audio.AudioOutputConfig(filename=output_file)
    
    synthesizer = speechsdk.SpeechSynthesizer(
        speech_config=speech_config,
        audio_config=audio_config
    )
    
    result = synthesizer.speak_text_async(text).get()
    
    if result.reason == speechsdk.ResultReason.SynthesizingAudioCompleted:
        print(f"Speech synthesized to {output_file}")
    else:
        print(f"Error: {result.cancellation_details.reason}")

# Usage
transcription = speech_to_text("recording.wav")
text_to_speech("Hello, this is a test.", "output.wav")
```

## AutoML Services

### 1. AWS SageMaker Autopilot

```python
import boto3
import sagemaker
from sagemaker import AutoML

session = sagemaker.Session()
role = 'arn:aws:iam::ACCOUNT:role/SageMakerRole'

def train_automl_model(s3_input_data, target_column):
    """Automatically train and tune a model"""
    
    automl = AutoML(
        role=role,
        target_attribute_name=target_column,
        sagemaker_session=session,
        max_candidates=10
    )
    
    # Start AutoML job
    automl.fit(
        s3_input_data,
        job_name='customer-churn-automl',
        wait=False,
        logs=False
    )
    
    print(f"AutoML job started: {automl.current_job_name}")
    
    return automl

def deploy_best_model(automl):
    """Deploy the best candidate model"""
    
    # Wait for job completion
    automl.wait()
    
    # Get best candidate
    best_candidate = automl.describe_auto_ml_job()['BestCandidate']
    
    print(f"Best model: {best_candidate['CandidateName']}")
    print(f"Objective metric: {best_candidate['FinalAutoMLJobObjectiveMetric']}")
    
    # Deploy model
    predictor = automl.deploy(
        initial_instance_count=1,
        instance_type='ml.m5.xlarge',
        endpoint_name='churn-prediction-endpoint'
    )
    
    return predictor

# Usage
automl = train_automl_model(
    's3://my-bucket/training-data/',
    target_column='churn'
)

# Later, after training completes
predictor = deploy_best_model(automl)

# Make predictions
predictions = predictor.predict({
    'age': 35,
    'tenure': 24,
    'monthly_charges': 79.99
})
```

### 2. Google Cloud AutoML

```python
from google.cloud import automl

def create_dataset(project_id, dataset_name):
    """Create AutoML dataset"""
    
    client = automl.AutoMlClient()
    project_location = f"projects/{project_id}/locations/us-central1"
    
    # Create dataset
    dataset = automl.Dataset(
        display_name=dataset_name,
        tables_dataset_metadata={}
    )
    
    response = client.create_dataset(
        parent=project_location,
        dataset=dataset
    )
    
    print(f"Dataset created: {response.name}")
    return response

def train_automl_model(project_id, dataset_id, target_column):
    """Train AutoML Tables model"""
    
    client = automl.AutoMlClient()
    project_location = f"projects/{project_id}/locations/us-central1"
    
    # Configure training
    model = automl.Model(
        display_name="customer_churn_model",
        dataset_id=dataset_id,
        tables_model_metadata={
            "target_column_spec": {"name": target_column},
            "train_budget_milli_node_hours": 1000
        }
    )
    
    # Start training
    response = client.create_model(
        parent=project_location,
        model=model
    )
    
    print("Training started...")
    result = response.result()  # Wait for completion
    
    print(f"Model trained: {result.name}")
    return result

def predict_automl(project_id, model_id, inputs):
    """Make predictions using AutoML model"""
    
    client = automl.PredictionServiceClient()
    model_path = f"projects/{project_id}/locations/us-central1/models/{model_id}"
    
    # Prepare payload
    payload = {
        "row": {
            "values": inputs
        }
    }
    
    response = client.predict(
        name=model_path,
        payload=payload
    )
    
    for result in response.payload:
        print(f"Prediction: {result.tables.value}")
        print(f"Confidence: {result.tables.score}")
    
    return response

# Usage
dataset = create_dataset('my-project', 'customer-churn-dataset')
model = train_automl_model('my-project', dataset.name.split('/')[-1], 'churn')
predictions = predict_automl('my-project', model.name.split('/')[-1], 
                             [35, 24, 79.99])
```

## Custom ML Training

### 1. TensorFlow on Cloud

```python
import tensorflow as tf
from google.cloud import storage

def build_model():
    """Build custom neural network"""
    
    model = tf.keras.Sequential([
        tf.keras.layers.Dense(128, activation='relu', input_shape=(10,)),
        tf.keras.layers.Dropout(0.2),
        tf.keras.layers.Dense(64, activation='relu'),
        tf.keras.layers.Dropout(0.2),
        tf.keras.layers.Dense(1, activation='sigmoid')
    ])
    
    model.compile(
        optimizer='adam',
        loss='binary_crossentropy',
        metrics=['accuracy']
    )
    
    return model

def train_on_cloud(train_data, train_labels):
    """Train model on cloud infrastructure"""
    
    model = build_model()
    
    # TensorBoard callback
    tensorboard_cb = tf.keras.callbacks.TensorBoard(
        log_dir='gs://my-bucket/logs',
        histogram_freq=1
    )
    
    # Early stopping
    early_stopping_cb = tf.keras.callbacks.EarlyStopping(
        monitor='val_loss',
        patience=5,
        restore_best_weights=True
    )
    
    # Model checkpoint
    checkpoint_cb = tf.keras.callbacks.ModelCheckpoint(
        'gs://my-bucket/models/model_{epoch:02d}.h5',
        save_best_only=True
    )
    
    # Train
    history = model.fit(
        train_data,
        train_labels,
        epochs=50,
        batch_size=32,
        validation_split=0.2,
        callbacks=[tensorboard_cb, early_stopping_cb, checkpoint_cb]
    )
    
    # Save final model
    model.save('gs://my-bucket/models/final_model')
    
    return model, history

# Upload model for serving
def deploy_model(model_path, model_name):
    """Deploy model to AI Platform"""
    
    from google.cloud import aiplatform
    
    aiplatform.init(project='my-project', location='us-central1')
    
    model = aiplatform.Model.upload(
        display_name=model_name,
        artifact_uri=model_path,
        serving_container_image_uri='us-docker.pkg.dev/vertex-ai/prediction/tf2-cpu.2-8:latest'
    )
    
    endpoint = model.deploy(
        machine_type='n1-standard-4',
        min_replica_count=1,
        max_replica_count=5
    )
    
    return endpoint
```

### 2. PyTorch on AWS SageMaker

```python
import torch
import torch.nn as nn
from sagemaker.pytorch import PyTorch

class CustomModel(nn.Module):
    def __init__(self, input_dim, hidden_dim, output_dim):
        super(CustomModel, self).__init__()
        self.fc1 = nn.Linear(input_dim, hidden_dim)
        self.relu = nn.ReLU()
        self.fc2 = nn.Linear(hidden_dim, output_dim)
        self.sigmoid = nn.Sigmoid()
    
    def forward(self, x):
        x = self.fc1(x)
        x = self.relu(x)
        x = self.fc2(x)
        x = self.sigmoid(x)
        return x

# Training script (train.py)
def train_model():
    # Load data
    train_loader = get_train_loader()
    
    # Initialize model
    model = CustomModel(input_dim=10, hidden_dim=64, output_dim=1)
    criterion = nn.BCELoss()
    optimizer = torch.optim.Adam(model.parameters(), lr=0.001)
    
    # Training loop
    for epoch in range(50):
        for batch_idx, (data, target) in enumerate(train_loader):
            optimizer.zero_grad()
            output = model(data)
            loss = criterion(output, target)
            loss.backward()
            optimizer.step()
    
    # Save model
    torch.save(model.state_dict(), '/opt/ml/model/model.pth')

# SageMaker training job
estimator = PyTorch(
    entry_point='train.py',
    role='arn:aws:iam::ACCOUNT:role/SageMakerRole',
    framework_version='1.8.0',
    py_version='py3',
    instance_count=1,
    instance_type='ml.p3.2xlarge',
    hyperparameters={
        'epochs': 50,
        'batch-size': 32,
        'learning-rate': 0.001
    }
)

estimator.fit('s3://my-bucket/training-data/')
```

## Key Takeaways

1. **Three service tiers**: Pre-trained APIs, AutoML, Custom ML
2. **Pre-trained APIs**: Quick implementation for common tasks (vision, NLP, speech)
3. **AutoML**: Custom models with minimal coding expertise
4. **Custom ML**: Full control for specialized use cases
5. **All platforms** support major frameworks (TensorFlow, PyTorch, Scikit-learn)
6. **Choose based on**: Use case complexity, available expertise, time constraints

## Next Steps

- Compare specific ML services across providers
- Learn about ML model deployment and monitoring
- Explore MLOps practices
