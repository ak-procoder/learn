---
id: provider-21
title: Azure AI/ML Services
type: text
---

# Azure AI/ML Services

Azure offers comprehensive AI and machine learning services that enable developers and data scientists to build intelligent applications and custom ML models. These services range from pre-built cognitive APIs to full machine learning platforms.

## Azure Machine Learning

Comprehensive platform for building, training, and deploying machine learning models.

### Key Components

**Azure ML Studio**
- Web-based IDE
- Visual designer (drag-and-drop)
- Notebook integration (Jupyter)
- Experiment tracking
- Model management

**Compute Targets**
- **Compute Instance**: Development workstation
- **Compute Cluster**: Scalable training clusters
- **Inference Cluster**: AKS for deployment
- **Attached Compute**: Link existing compute (HDInsight, VMs)

**Datasets and Datastores**
- Connect to data (Azure Storage, SQL, Data Lake)
- Version datasets
- Monitor data drift
- Create snapshots

### ML Workflow

```python
from azure ml.core import Workspace, Experiment, Dataset, ScriptRunConfig
from azureml.core.compute import ComputeTarget, AmlCompute

# Connect to workspace
ws = Workspace.from_config()

# Get/create compute target
compute_name = "ml-cluster"
if compute_name not in ws.compute_targets:
    compute_config = AmlCompute.provisioning_configuration(
        vm_size='STANDARD_D2_V2',
        max_nodes=4
    )
    compute = ComputeTarget.create(ws, compute_name, compute_config)
    compute.wait_for_completion(show_output=True)
else:
    compute = ws.compute_targets[compute_name]

# Get dataset
dataset = Dataset.get_by_name(ws, 'sales-data')

# Create experiment
experiment = Experiment(ws, 'sales-forecasting')

# Configure training run
config = ScriptRunConfig(
    source_directory='./src',
    script='train.py',
    arguments=['--data-path', dataset.as_named_input('input').as_mount()],
    compute_target=compute,
    environment=ws.environments['sklearn-env']
)

# Submit run
run = experiment.submit(config)
run.wait_for_completion(show_output=True)

# Register model
model = run.register_model(
    model_name='sales-forecast-model',
    model_path='outputs/model.pkl'
)
```

### Automated ML (AutoML)

Automatically try different algorithms and hyperparameters.

```python
from azureml.train.automl import AutoMLConfig

automl_config = AutoMLConfig(
    task='classification',
    training_data=train_dataset,
    label_column_name='target',
    primary_metric='AUC_weighted',
    n_cross_validations=5,
    enable_early_stopping=True,
    max_concurrent_iterations=4,
    experiment_timeout_hours=1,
    enable_onnx_compatible_models=True
)

# Submit AutoML run
automl_run = experiment.submit(automl_config)
best_run, fitted_model = automl_run.get_output()
```

### Model Deployment

```python
from azureml.core.model import InferenceConfig
from azureml.core.webservice import AciWebservice

# Create inference configuration
inference_config = InferenceConfig(
    entry_script='score.py',
    environment=ws.environments['sklearn-env']
)

# Configure deployment
deployment_config = AciWebservice.deploy_configuration(
    cpu_cores=1,
    memory_gb=1,
    auth_enabled=True
)

# Deploy model
service = Model.deploy(
    workspace=ws,
    name='sales-forecast-service',
    models=[model],
    inference_config=inference_config,
    deployment_config=deployment_config
)

service.wait_for_deployment(show_output=True)

# Test service
import json
test_data = json.dumps({'data': [[1, 2, 3, 4, 5]]})
result = service.run(test_data)
print(result)
```

### MLOps with Azure ML

**CI/CD for ML:**
- Version control (Git)
- Automated training pipelines
- Model validation
- Deployment automation
- Monitoring and retraining

```yaml
# Azure Pipeline for ML
trigger:
  branches:
    include:
    - main

pool:
  vmImage: 'ubuntu-latest'

steps:
- task: UsePythonVersion@0
  inputs:
    versionSpec: '3.8'

- script: pip install azureml-sdk
  displayName: 'Install Azure ML SDK'

- task: AzureCLI@2
  displayName: 'Train Model'
  inputs:
    azureSubscription: 'MySubscription'
    scriptType: 'bash'
    scriptLocation: 'inlineScript'
    inlineScript: |
      python train.py

- task: AzureCLI@2
  displayName: 'Deploy Model'
  inputs:
    azureSubscription: 'MySubscription'
    scriptType: 'bash'
    scriptLocation: 'inlineScript'
    inlineScript: |
      python deploy.py
```

## Azure Cognitive Services

Pre-built AI capabilities accessible via REST APIs.

### Vision Services

**Computer Vision**
```python
from azure.cognitiveservices.vision.computervision import ComputerVisionClient
from msrest.authentication import CognitiveServicesCredentials

# Initialize client
credentials = CognitiveServicesCredentials(subscription_key)
client = ComputerVisionClient(endpoint, credentials)

# Analyze image
image_url = "https://example.com/image.jpg"
features = ["categories", "description", "color", "tags", "objects"]

result = client.analyze_image(image_url, visual_features=features)

# Print results
print("Description:", result.description.captions[0].text)
print("Tags:", [tag.name for tag in result.tags])
print("Objects:", [obj.object_property for obj in result.objects])
```

**Face API**
- Detect faces
- Face verification
- Find similar faces
- Person identification
- Emotion detection

**Custom Vision**
- Train custom image classification models
- Object detection
- No ML expertise required

### Language Services

**Text Analytics**
```python
from azure.ai.textanalytics import TextAnalyticsClient
from azure.core.credentials import AzureKeyCredential

client = TextAnalyticsClient(endpoint, AzureKeyCredential(key))

documents = [
    "I love this product! It's amazing.",
    "This is terrible. Very disappointed.",
    "It's okay, nothing special."
]

# Sentiment analysis
result = client.analyze_sentiment(documents)
for doc in result:
    print(f"Sentiment: {doc.sentiment} (confidence: {doc.confidence_scores})")

# Key phrase extraction
result = client.extract_key_phrases(documents)
for doc in result:
    print(f"Key phrases: {doc.key_phrases}")

# Entity recognition
text = "Microsoft was founded by Bill Gates in Seattle."
result = client.recognize_entities([text])
for entity in result[0].entities:
    print(f"{entity.text} - {entity.category}")
```

**Translator**
```python
from azure.ai.translation.text import TextTranslationClient
from azure.core.credentials import AzureKeyCredential

client = TextTranslationClient(endpoint, AzureKeyCredential(key))

# Translate text
input_text = [{"text": "Hello, world!"}]
result = client.translate(
    content=input_text,
    to=["es", "fr", "de"]
)

for translation in result[0].translations:
    print(f"{translation.to}: {translation.text}")
```

**Language Understanding (LUIS)**
- Natural language understanding
- Intent recognition
- Entity extraction
- Conversational AI

### Speech Services

**Speech-to-Text**
```python
import azure.cognitiveservices.speech as speechsdk

# Configure speech service
speech_config = speechsdk.SpeechConfig(
    subscription=subscription_key,
    region=region
)

# Create recognizer
audio_config = speechsdk.audio.AudioConfig(filename="audio.wav")
recognizer = speechsdk.SpeechRecognizer(
    speech_config=speech_config,
    audio_config=audio_config
)

# Recognize speech
result = recognizer.recognize_once()

if result.reason == speechsdk.ResultReason.RecognizedSpeech:
    print(f"Recognized: {result.text}")
else:
    print(f"Error: {result.reason}")
```

**Text-to-Speech**
```python
speech_config = speechsdk.SpeechConfig(
    subscription=subscription_key,
    region=region
)
speech_config.speech_synthesis_voice_name = "en-US-AriaNeural"

synthesizer = speechsdk.SpeechSynthesizer(speech_config=speech_config)

text = "Hello, this is a test of Azure text to speech."
result = synthesizer.speak_text_async(text).get()

if result.reason == speechsdk.ResultReason.SynthesizingAudioCompleted:
    print("Speech synthesized successfully")
```

**Speech Translation**
- Real-time translation
- Multi-language support
- Custom models

### Decision Services

**Anomaly Detector**
- Univariate and multivariate anomaly detection
- Batch and streaming detection
- Automatic parameter selection

**Personalizer**
- Reinforcement learning
- Content personalization
- Real-time recommendations

**Content Moderator**
- Text, image, video moderation
- Custom moderation lists
- Human review workflows

## Azure OpenAI Service

Access OpenAI models including GPT-4, GPT-3.5, Codex, and DALL-E through Azure.

### Features

- **Enterprise-grade security**: Azure security and compliance
- **Private networking**: VNet integration
- **Managed identity**: Azure AD authentication
- **SLA**: Azure service level agreements
- **Regional availability**: Deploy in Azure regions

```python
import openai

openai.api_type = "azure"
openai.api_base = "https://myresource.openai.azure.com/"
openai.api_version = "2023-05-15"
openai.api_key = api_key

# Chat completion
response = openai.ChatCompletion.create(
    engine="gpt-4",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Explain quantum computing in simple terms."}
    ],
    temperature=0.7,
    max_tokens=500
)

print(response.choices[0].message.content)

# Image generation (DALL-E)
response = openai.Image.create(
    prompt="A futuristic city with flying cars",
    n=1,
    size="1024x1024"
)

image_url = response['data'][0]['url']
```

## Azure Bot Service

Build intelligent conversational bots.

### Bot Framework SDK

```csharp
using Microsoft.Bot.Builder;
using Microsoft.Bot.Schema;

public class EchoBot : ActivityHandler
{
    protected override async Task OnMessageActivityAsync(
        ITurnContext<IMessageActivity> turnContext,
        CancellationToken cancellationToken)
    {
        var userMessage = turnContext.Activity.Text;
        
        // Process message (integrate with LUIS, QnA Maker, etc.)
        var replyText = $"Echo: {userMessage}";
        
        await turnContext.SendActivityAsync(
            MessageFactory.Text(replyText),
            cancellationToken);
    }

    protected override async Task OnMembersAddedAsync(
        IList<ChannelAccount> membersAdded,
        ITurnContext<IConversationUpdateActivity> turnContext,
        CancellationToken cancellationToken)
    {
        foreach (var member in membersAdded)
        {
            if (member.Id != turnContext.Activity.Recipient.Id)
            {
                await turnContext.SendActivityAsync(
                    MessageFactory.Text("Welcome! How can I help you?"),
                    cancellationToken);
            }
        }
    }
}
```

### Channels

- Microsoft Teams
- Slack
- Facebook Messenger
- Telegram
- Web Chat
- Direct Line

## Azure Cognitive Search

AI-powered cloud search service.

**Features:**
- Full-text search
- AI enrichment
- Semantic ranking
- Vector search
- Faceted navigation

```python
from azure.search.documents import SearchClient
from azure.core.credentials import AzureKeyCredential

client = SearchClient(
    endpoint=endpoint,
    index_name="hotels",
    credential=AzureKeyCredential(api_key)
)

# Search documents
results = client.search(
    search_text="luxury hotel near beach",
    select=["Name", "Description", "Rating"],
    top=10,
    order_by=["Rating desc"]
)

for result in results:
    print(f"{result['Name']}: {result['Rating']}")
```

## Azure Databricks

Apache Spark-based analytics platform optimized for Azure.

**Features:**
- Collaborative notebooks
- Optimized Spark runtime
- MLflow integration
- Delta Lake
- AutoML

```python
# PySpark in Databricks
from pyspark.sql import SparkSession
from pyspark.ml.feature import VectorAssembler
from pyspark.ml.regression import RandomForestRegressor

# Load data
df = spark.read.format("delta").load("/mnt/data/sales")

# Feature engineering
assembler = VectorAssembler(
    inputCols=["feature1", "feature2", "feature3"],
    outputCol="features"
)

# Train model
rf = RandomForestRegressor(featuresCol="features", labelCol="target")
model = rf.fit(assembled_data)

# Save model
model.save("/mnt/models/sales_model")
```

## Best Practices

1. **Use managed services**: Start with Cognitive Services before custom models
2. **Version models**: Track model versions and experiments
3. **Monitor performance**: Data drift, model accuracy
4. **Secure endpoints**: Authentication and encryption
5. **Cost optimization**: Right-size compute, use spot instances
6. **Responsible AI**: Test for bias, ensure fairness
7. **A/B testing**: Compare model versions
8. **Automated retraining**: Keep models updated
9. **Explainability**: Use interpretability tools
10. **Compliance**: Meet regulatory requirements (GDPR, HIPAA)

Azure AI/ML services provide comprehensive tools for building intelligent applications, from simple API calls for common AI tasks to sophisticated custom machine learning platforms for data scientists.
