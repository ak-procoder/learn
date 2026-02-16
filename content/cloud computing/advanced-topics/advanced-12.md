---
id: advanced-12
title: Machine Learning Services Comparison
type: text
---

# Machine Learning Services Comparison

## Overview

This lesson provides a detailed comparison of machine learning services across AWS, Azure, and Google Cloud Platform, helping you choose the right platform and services for your machine learning needs.

## Platform Overview

| Feature | AWS | Azure | Google Cloud |
|---------|-----|-------|--------------|
| **Primary ML Platform** | SageMaker | Azure Machine Learning | Vertex AI |
| **AutoML** | SageMaker Autopilot | Azure AutoML | AutoML (Vertex AI) |
| **Notebooks** | SageMaker Studio | Azure ML Studio | Vertex AI Workbench |
| **Model Registry** | SageMaker Model Registry | Azure ML Model Registry | Vertex AI Model Registry |
| **MLOps** | SageMaker Pipelines | Azure ML Pipelines | Vertex AI Pipelines |

## Managed ML Platforms

### AWS SageMaker

**Complete ML Workflow**
```python
import sagemaker
from sagemaker import get_execution_role
from sagemaker.estimator import Estimator

# Initialize
role = get_execution_role()
session = sagemaker.Session()

# 1. Data Preparation
from sagemaker.processing import ScriptProcessor

processor = ScriptProcessor(
    role=role,
    image_uri='683313688378.dkr.ecr.us-east-1.amazonaws.com/sagemaker-scikit-learn',
    command=['python3'],
    instance_type='ml.m5.xlarge',
    instance_count=1
)

processor.run(
    code='preprocessing.py',
    inputs=[
        sagemaker.processing.ProcessingInput(
            source='s3://my-bucket/raw-data/',
            destination='/opt/ml/processing/input'
        )
    ],
    outputs=[
        sagemaker.processing.ProcessingOutput(
            source='/opt/ml/processing/output',
            destination='s3://my-bucket/processed-data/'
        )
    ]
)

# 2. Model Training
estimator = Estimator(
    image_uri='683313688378.dkr.ecr.us-east-1.amazonaws.com/sagemaker-xgboost',
    role=role,
    instance_count=1,
    instance_type='ml.m5.xlarge',
    output_path='s3://my-bucket/models/'
)

estimator.set_hyperparameters(
    objective='binary:logistic',
    num_round=100,
    max_depth=5,
    eta=0.2
)

estimator.fit({'train': 's3://my-bucket/processed-data/train/'})

# 3. Hyperparameter Tuning
from sagemaker.tuner import HyperparameterTuner, IntegerParameter, ContinuousParameter

hyperparameter_ranges = {
    'max_depth': IntegerParameter(3, 10),
    'eta': ContinuousParameter(0.01, 0.3),
    'num_round': IntegerParameter(50, 200)
}

tuner = HyperparameterTuner(
    estimator=estimator,
    objective_metric_name='validation:auc',
    hyperparameter_ranges=hyperparameter_ranges,
    max_jobs=20,
    max_parallel_jobs=3
)

tuner.fit({'train': 's3://my-bucket/processed-data/train/'})

# 4. Model Deployment
predictor = estimator.deploy(
    initial_instance_count=1,
    instance_type='ml.m5.large',
    endpoint_name='my-model-endpoint'
)

# 5. Make Predictions
predictions = predictor.predict(test_data)

# 6. Monitor Model
from sagemaker.model_monitor import DefaultModelMonitor

monitor = DefaultModelMonitor(
    role=role,
    instance_count=1,
    instance_type='ml.m5.xlarge',
    max_runtime_in_seconds=1800
)

monitor.create_monitoring_schedule(
    endpoint_input=predictor.endpoint_name,
    output_s3_uri='s3://my-bucket/monitoring/',
    schedule_cron_expression='cron(0 * * * ? *)'  # Hourly
)
```

**SageMaker Features**
- **Built-in algorithms**: 17+ optimized algorithms
- **Bring your own container**: Full customization
- **Distributed training**: Automatic data/model parallelism
- **Spot training**: Save up to 90% on training costs
- **Multi-model endpoints**: Host multiple models on one endpoint

### Azure Machine Learning

**Complete ML Workflow**
```python
from azureml.core import Workspace, Experiment, Dataset
from azureml.core.compute import ComputeTarget, AmlCompute
from azureml.train.estimator import Estimator
from azureml.train.hyperdrive import GridParameterSampling, HyperDriveConfig
from azureml.core.model import Model

# Initialize workspace
ws = Workspace.from_config()

# 1. Data Preparation
datastore = ws.get_default_datastore()
dataset = Dataset.Tabular.from_delimited_files(
    path=(datastore, 'data/*.csv')
)

# Register dataset
dataset = dataset.register(
    workspace=ws,
    name='customer_data',
    description='Customer churn data'
)

# 2. Create/Get Compute Target
compute_config = AmlCompute.provisioning_configuration(
    vm_size='STANDARD_D3_V2',
    min_nodes=0,
    max_nodes=4
)

compute_target = ComputeTarget.create(
    ws, 
    'aml-compute', 
    compute_config
)

# 3. Create Experiment
experiment = Experiment(workspace=ws, name='churn-prediction')

# 4. Configure Training
from azureml.core import ScriptRunConfig

config = ScriptRunConfig(
    source_directory='./scripts',
    script='train.py',
    compute_target=compute_target,
    environment=Environment.from_pip_requirements(
        name='training-env',
        file_path='requirements.txt'
    )
)

# 5. Hyperparameter Tuning
from azureml.train.hyperdrive import uniform, choice

param_sampling = GridParameterSampling({
    '--learning-rate': uniform(0.001, 0.1),
    '--batch-size': choice(16, 32, 64),
    '--epochs': choice(10, 20, 30)
})

hyperdrive_config = HyperDriveConfig(
    run_config=config,
    hyperparameter_sampling=param_sampling,
    primary_metric_name='accuracy',
    primary_metric_goal=PrimaryMetricGoal.MAXIMIZE,
    max_total_runs=20,
    max_concurrent_runs=4
)

# 6. Submit Training
run = experiment.submit(hyperdrive_config)
run.wait_for_completion(show_output=True)

# 7. Register Model
best_run = run.get_best_run_by_primary_metric()
model = best_run.register_model(
    model_name='churn-model',
    model_path='outputs/model.pkl'
)

# 8. Deploy Model
from azureml.core.webservice import AciWebservice
from azureml.core.model import InferenceConfig

inference_config = InferenceConfig(
    entry_script='score.py',
    environment=environment
)

deployment_config = AciWebservice.deploy_configuration(
    cpu_cores=1,
    memory_gb=1
)

service = Model.deploy(
    workspace=ws,
    name='churn-service',
    models=[model],
    inference_config=inference_config,
    deployment_config=deployment_config
)

service.wait_for_deployment(show_output=True)

# 9. Test Endpoint
import requests
import json

scoring_uri = service.scoring_uri
headers = {'Content-Type': 'application/json'}

test_data = json.dumps({
    'data': [[35, 24, 79.99]]
})

response = requests.post(scoring_uri, data=test_data, headers=headers)
print(response.json())
```

**Azure ML Features**
- **Designer**: Visual ML pipeline builder
- **Automated ML**: AutoML with explainability
- **Responsible AI**: Model fairness and interpretability tools
- **MLflow integration**: Open-source MLOps
- **Azure Databricks integration**: Big data + ML

### Google Cloud Vertex AI

**Complete ML Workflow**
```python
from google.cloud import aiplatform

# Initialize
aiplatform.init(project='my-project', location='us-central1')

# 1. Create Dataset
dataset = aiplatform.TabularDataset.create(
    display_name='customer_churn_dataset',
    gcs_source='gs://my-bucket/data.csv'
)

# 2. AutoML Training
automl_job = aiplatform.AutoMLTabularTrainingJob(
    display_name='churn_automl_training',
    optimization_prediction_type='classification',
    optimization_objective='maximize-au-prc'
)

model = automl_job.run(
    dataset=dataset,
    target_column='churn',
    budget_milli_node_hours=1000,
    model_display_name='churn_model',
    disable_early_stopping=False
)

# 3. Custom Training (Alternative)
from google.cloud.aiplatform import CustomTrainingJob

job = CustomTrainingJob(
    display_name='custom_churn_training',
    script_path='trainer/task.py',
    container_uri='gcr.io/cloud-aiplatform/training/tf-cpu.2-8:latest',
    requirements=['pandas', 'scikit-learn'],
    model_serving_container_image_uri='gcr.io/cloud-aiplatform/prediction/tf2-cpu.2-8:latest'
)

model = job.run(
    dataset=dataset,
    replica_count=1,
    machine_type='n1-standard-4',
    args=['--epochs=50', '--batch-size=32']
)

# 4. Hyperparameter Tuning
from google.cloud.aiplatform import HyperparameterTuningJob

hp_job = HyperparameterTuningJob(
    display_name='hp_tuning',
    custom_job=job,
    metric_spec={
        'accuracy': 'maximize'
    },
    parameter_spec={
        'learning_rate': aiplatform.hyperparameter_tuning.DoubleParameterSpec(
            min=0.001, max=0.1, scale='log'
        ),
        'batch_size': aiplatform.hyperparameter_tuning.DiscreteParameterSpec(
            values=[16, 32, 64],
            scale='linear'
        )
    },
    max_trial_count=20,
    parallel_trial_count=3
)

hp_job.run()

# 5. Deploy Model
endpoint = aiplatform.Endpoint.create(display_name='churn_endpoint')

model.deploy(
    endpoint=endpoint,
    deployed_model_display_name='churn_v1',
    machine_type='n1-standard-2',
    min_replica_count=1,
    max_replica_count=5,
    traffic_percentage=100
)

# 6. Make Predictions
predictions = endpoint.predict(instances=[
    {'age': 35, 'tenure': 24, 'monthly_charges': 79.99}
])

# 7. Batch Predictions
batch_prediction_job = model.batch_predict(
    job_display_name='batch_prediction',
    gcs_source='gs://my-bucket/batch-input.csv',
    gcs_destination_prefix='gs://my-bucket/predictions/',
    machine_type='n1-standard-4',
    starting_replica_count=1,
    max_replica_count=5
)

# 8. Model Monitoring
from google.cloud.aiplatform import ModelDeploymentMonitoringJob

monitoring_job = ModelDeploymentMonitoringJob.create(
    display_name='churn_monitoring',
    endpoint=endpoint,
    logging_sampling_strategy=aiplatform.model_monitoring.RandomSampleConfig(
        sample_rate=0.1
    ),
    alert_config=aiplatform.model_monitoring.EmailAlertConfig(
        user_emails=['admin@example.com']
    )
)
```

**Vertex AI Features**
- **Unified platform**: Training, deployment, and management
- **Feature Store**: Centralized feature management
- **Explainable AI**: Model interpretability
- **Pipelines**: Kubeflow-based ML workflows
- **Matching Engine**: Vector similarity search

## Specialized ML Services

### Computer Vision

| Service | AWS | Azure | GCP |
|---------|-----|-------|-----|
| **Object Detection** | Rekognition | Computer Vision | Vision AI |
| **Face Recognition** | Rekognition | Face API | Vision AI |
| **OCR** | Textract | Computer Vision | Document AI |
| **Video Analysis** | Rekognition Video | Video Indexer | Video Intelligence |
| **Custom Vision** | Custom Labels | Custom Vision | AutoML Vision |

**Example: Custom Object Detection**
```python
# AWS Rekognition Custom Labels
import boto3

rekognition = boto3.client('rekognition')

# Train custom model
def create_project():
    response = rekognition.create_project(ProjectName='ProductDetection')
    return response['ProjectArn']

# Azure Custom Vision
from azure.cognitiveservices.vision.customvision.training import CustomVisionTrainingClient
from azure.cognitiveservices.vision.customvision.prediction import CustomVisionPredictionClient

training_client = CustomVisionTrainingClient(training_key, endpoint)
prediction_client = CustomVisionPredictionClient(prediction_key, endpoint)

# Create project
project = training_client.create_project('Product Detection')

# Add tags
tag1 = training_client.create_tag(project.id, 'laptop')
tag2 = training_client.create_tag(project.id, 'phone')

# Google AutoML Vision
from google.cloud import automl

client = automl.AutoMlClient()

project_location = f"projects/{project_id}/locations/us-central1"
dataset = automl.Dataset(
    display_name='product_detection',
    image_object_detection_dataset_metadata={}
)

created_dataset = client.create_dataset(
    parent=project_location,
    dataset=dataset
)
```

### Natural Language Processing

| Service | AWS | Azure | GCP |
|---------|-----|-------|-----|
| **Entity Recognition** | Comprehend | Text Analytics | Natural Language |
| **Sentiment Analysis** | Comprehend | Text Analytics | Natural Language |
| **Translation** | Translate | Translator | Translation |
| **Custom NLP** | Comprehend Custom | Language Understanding (LUIS) | AutoML Natural Language |

### Speech Services

| Service | AWS | Azure | GCP |
|---------|-----|-------|-----|
| **Speech-to-Text** | Transcribe | Speech-to-Text | Speech-to-Text |
| **Text-to-Speech** | Polly | Text-to-Speech | Text-to-Speech |
| **Custom Voice** | Polly Brand Voice | Custom Neural Voice | Custom Voice |

## Cost Comparison

### Training Costs (Approximate)

**AWS SageMaker**
```
ml.m5.xlarge:  $0.23/hour
ml.p3.2xlarge: $3.83/hour (GPU)
ml.p3.8xlarge: $14.69/hour (4 GPUs)
```

**Azure Machine Learning**
```
Standard_D3_v2:     $0.25/hour
Standard_NC6:        $0.90/hour (GPU)
Standard_NC24:       $3.60/hour (4 GPUs)
```

**Google Cloud Vertex AI**
```
n1-standard-4:   $0.19/hour
n1-highmem-64:   $3.05/hour
a2-highgpu-1g:   $3.67/hour (1 GPU)
```

### Inference Costs

**Real-time Predictions**
```
AWS:    $0.05/hour (ml.t2.medium)
Azure:  $0.11/hour (Standard_B1ms)
GCP:    $0.04/hour (n1-standard-1)
```

## Decision Matrix

### Choose AWS SageMaker If:
- ✅ Already using AWS ecosystem
- ✅ Need built-in algorithms
- ✅ Want spot training for cost savings
- ✅ Require edge deployment (SageMaker Edge)

### Choose Azure Machine Learning If:
- ✅ Already using Azure/Microsoft products
- ✅ Need AutoML with strong explainability
- ✅ Want visual ML designer
- ✅ Require tight integration with Azure Databricks

### Choose Google Cloud Vertex AI If:
- ✅ Already using GCP
- ✅ Need TensorFlow-focused platform
- ✅ Want unified ML platform
- ✅ Require strong BigQuery integration

## MLOps Comparison

| Feature | AWS | Azure | GCP |
|---------|-----|-------|-----|
| **Pipelines** | SageMaker Pipelines | Azure ML Pipelines | Vertex AI Pipelines |
| **Experiment Tracking** | SageMaker Experiments | Azure ML Experiments | Vertex AI Experiments |
| **Model Registry** | SageMaker Model Registry | Azure ML Model Registry | Vertex AI Model Registry |
| **CI/CD Integration** | CodePipeline | Azure DevOps | Cloud Build |
| **Feature Store** | SageMaker Feature Store | Azure Feature Store | Vertex AI Feature Store |

## Key Takeaways

1. **All three platforms** offer comprehensive ML capabilities
2. **SageMaker**: Best AWS integration, built-in algorithms, spot training
3. **Azure ML**: Strong AutoML, visual designer, MLflow support
4. **Vertex AI**: Unified platform, TensorFlow focus, BigQuery integration
5. **Cost**: Generally comparable, optimize with spot/preemptible instances
6. **Choose based on**: Existing cloud usage, specific features, team expertise

## Next Steps

- Explore Big Data services for ML at scale
- Learn about ML model deployment patterns
- Study MLOps best practices
