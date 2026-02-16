---
id: advanced-10
title: IoT Platforms - AWS IoT, Azure IoT, GCP IoT
type: text
---

# IoT Platforms: AWS IoT, Azure IoT, and Google Cloud IoT

## Overview

Major cloud providers offer comprehensive IoT platforms with device management, messaging, analytics, and integration capabilities. This lesson compares AWS IoT Core, Azure IoT Hub, and Google Cloud IoT Core.

## AWS IoT Core

### Architecture

```
Device → AWS IoT Core → Rules Engine → AWS Services
                  ↓
            Device Shadow
                  ↓
           IoT Analytics
```

### Device Connection

**Python Device SDK**
```python
from AWSIoTPythonSDK.MQTTLib import AWSIoTMQTTClient
import json
import time

class AWSIoTDevice:
    def __init__(self, client_id, endpoint, cert_path, key_path, ca_path):
        # Initialize MQTT client
        self.client = AWSIoTMQTTClient(client_id)
        self.client.configureEndpoint(endpoint, 8883)
        self.client.configureCredentials(ca_path, key_path, cert_path)
        
        # Configure connection
        self.client.configureAutoReconnectBackoffTime(1, 32, 20)
        self.client.configureOfflinePublishQueueing(-1)
        self.client.configureDrainingFrequency(2)
        self.client.configureConnectDisconnectTimeout(10)
        self.client.configureMQTTOperationTimeout(5)
    
    def connect(self):
        """Connect to AWS IoT Core"""
        self.client.connect()
        print("Connected to AWS IoT Core")
    
    def publish_telemetry(self, device_id, data):
        """Publish sensor data"""
        topic = f"devices/{device_id}/telemetry"
        
        payload = {
            "deviceId": device_id,
            "timestamp": int(time.time() * 1000),
            "temperature": data['temperature'],
            "humidity": data['humidity'],
            "pressure": data['pressure']
        }
        
        self.client.publish(topic, json.dumps(payload), 1)
    
    def subscribe_commands(self, device_id, callback):
        """Subscribe to device commands"""
        topic = f"devices/{device_id}/commands"
        self.client.subscribe(topic, 1, callback)
    
    def update_shadow(self, device_id, state):
        """Update device shadow"""
        topic = f"$aws/things/{device_id}/shadow/update"
        
        payload = {
            "state": {
                "reported": state
            }
        }
        
        self.client.publish(topic, json.dumps(payload), 1)

# Custom callback for commands
def command_callback(client, userdata, message):
    payload = json.loads(message.payload)
    print(f"Received command: {payload}")
    
    # Execute command
    if payload['action'] == 'reboot':
        print("Rebooting device...")

# Usage
device = AWSIoTDevice(
    client_id="sensor-001",
    endpoint="your-endpoint.iot.us-east-1.amazonaws.com",
    cert_path="/path/to/certificate.pem.crt",
    key_path="/path/to/private.pem.key",
    ca_path="/path/to/AmazonRootCA1.pem"
)

device.connect()
device.subscribe_commands("sensor-001", command_callback)

# Publish telemetry
while True:
    telemetry = {
        'temperature': 25.5,
        'humidity': 60.0,
        'pressure': 1013.25
    }
    device.publish_telemetry("sensor-001", telemetry)
    time.sleep(60)
```

### AWS IoT Rules Engine

**Rules for Data Processing**
```json
{
  "sql": "SELECT * FROM 'devices/+/telemetry' WHERE temperature > 30",
  "actions": [
    {
      "lambda": {
        "functionArn": "arn:aws:lambda:us-east-1:123456789012:function:ProcessHighTemp"
      }
    },
    {
      "dynamoDBv2": {
        "roleArn": "arn:aws:iam::123456789012:role/IoTDynamoDBRole",
        "putItem": {
          "tableName": "TemperatureAlerts"
        }
      }
    },
    {
      "sns": {
        "targetArn": "arn:aws:sns:us-east-1:123456789012:HighTempAlert",
        "roleArn": "arn:aws:iam::123456789012:role/IoTSNSRole"
      }
    }
  ]
}
```

**CloudFormation Template**
```yaml
AWSTemplateFormatVersion: '2010-09-09'
Resources:
  # IoT Thing
  MyIoTThing:
    Type: AWS::IoT::Thing
    Properties:
      ThingName: sensor-001
      AttributePayload:
        Attributes:
          location: "Building-A"
          type: "temperature-sensor"
  
  # IoT Policy
  MyIoTPolicy:
    Type: AWS::IoT::Policy
    Properties:
      PolicyName: SensorPolicy
      PolicyDocument:
        Version: '2012-10-17'
        Statement:
          - Effect: Allow
            Action:
              - iot:Connect
            Resource:
              - !Sub 'arn:aws:iot:${AWS::Region}:${AWS::AccountId}:client/sensor-*'
          - Effect: Allow
            Action:
              - iot:Publish
            Resource:
              - !Sub 'arn:aws:iot:${AWS::Region}:${AWS::AccountId}:topic/devices/*/telemetry'
          - Effect: Allow
            Action:
              - iot:Subscribe
            Resource:
              - !Sub 'arn:aws:iot:${AWS::Region}:${AWS::AccountId}:topicfilter/devices/*/commands'
  
  # IoT Rule
  TemperatureRule:
    Type: AWS::IoT::TopicRule
    Properties:
      RuleName: HighTemperatureAlert
      TopicRulePayload:
        Sql: "SELECT * FROM 'devices/+/telemetry' WHERE temperature > 30"
        Actions:
          - Lambda:
              FunctionArn: !GetAtt ProcessFunction.Arn
          - DynamoDBv2:
              RoleArn: !GetAtt IoTDynamoDBRole.Arn
              PutItem:
                TableName: !Ref AlertsTable
```

### AWS IoT Device Shadow
```python
# Working with Device Shadows
import json

def update_device_shadow(iot_client, thing_name, desired_state):
    """Update shadow desired state"""
    shadow_update = {
        "state": {
            "desired": desired_state
        }
    }
    
    response = iot_client.update_thing_shadow(
        thingName=thing_name,
        payload=json.dumps(shadow_update)
    )
    
    return json.loads(response['payload'].read())

def get_device_shadow(iot_client, thing_name):
    """Get current shadow state"""
    response = iot_client.get_thing_shadow(thingName=thing_name)
    shadow = json.loads(response['payload'].read())
    
    return {
        'reported': shadow['state'].get('reported', {}),
        'desired': shadow['state'].get('desired', {}),
        'delta': shadow['state'].get('delta', {})
    }

# Usage
import boto3

iot_data = boto3.client('iot-data')

# Set desired temperature
update_device_shadow(iot_data, 'thermostat-001', {
    'targetTemperature': 22,
    'mode': 'cooling'
})

# Get shadow state
shadow = get_device_shadow(iot_data, 'thermostat-001')
print(f"Current: {shadow['reported']}")
print(f"Desired: {shadow['desired']}")
print(f"Delta: {shadow['delta']}")
```

## Azure IoT Hub

### Architecture

```
Device → IoT Hub → Event Hub → Stream Analytics → Storage/PowerBI
              ↓
        Device Twins
              ↓
        IoT Hub Routes
```

### Device Connection

**C# Device SDK**
```csharp
using Microsoft.Azure.Devices.Client;
using Newtonsoft.Json;
using System;
using System.Text;
using System.Threading.Tasks;

public class AzureIoTDevice
{
    private DeviceClient deviceClient;
    private string deviceId;
    
    public AzureIoTDevice(string connectionString, string deviceId)
    {
        this.deviceId = deviceId;
        this.deviceClient = DeviceClient.CreateFromConnectionString(
            connectionString, 
            TransportType.Mqtt);
    }
    
    public async Task ConnectAsync()
    {
        await deviceClient.OpenAsync();
        Console.WriteLine("Connected to Azure IoT Hub");
        
        // Set up method handlers
        await deviceClient.SetMethodDefaultHandlerAsync(
            DefaultMethodHandler, 
            null);
        
        // Set up desired property change handler
        await deviceClient.SetDesiredPropertyUpdateCallbackAsync(
            OnDesiredPropertyChanged, 
            null);
    }
    
    public async Task SendTelemetryAsync(object data)
    {
        var json = JsonConvert.SerializeObject(new
        {
            deviceId = deviceId,
            timestamp = DateTime.UtcNow,
            data = data
        });
        
        var message = new Message(Encoding.UTF8.GetBytes(json))
        {
            ContentType = "application/json",
            ContentEncoding = "utf-8"
        };
        
        // Add custom properties
        message.Properties.Add("messageType", "telemetry");
        message.Properties.Add("temperatureAlert", 
            data.temperature > 30 ? "true" : "false");
        
        await deviceClient.SendEventAsync(message);
        Console.WriteLine($"Sent: {json}");
    }
    
    public async Task UpdateReportedPropertiesAsync(object properties)
    {
        var reportedProperties = new TwinCollection();
        
        foreach (var prop in properties.GetType().GetProperties())
        {
            reportedProperties[prop.Name] = prop.GetValue(properties);
        }
        
        await deviceClient.UpdateReportedPropertiesAsync(reportedProperties);
    }
    
    private Task<MethodResponse> DefaultMethodHandler(
        MethodRequest methodRequest, 
        object userContext)
    {
        Console.WriteLine($"Direct method called: {methodRequest.Name}");
        
        // Parse method request
        var data = JsonConvert.DeserializeObject<dynamic>(
            methodRequest.DataAsJson);
        
        // Execute method
        switch (methodRequest.Name)
        {
            case "Reboot":
                Console.WriteLine("Rebooting device...");
                break;
            case "FirmwareUpdate":
                Console.WriteLine($"Updating to version {data.version}");
                break;
        }
        
        // Return response
        var result = new { result = "Success" };
        return Task.FromResult(
            new MethodResponse(
                Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(result)),
                200));
    }
    
    private Task OnDesiredPropertyChanged(
        TwinCollection desiredProperties, 
        object userContext)
    {
        Console.WriteLine("Desired properties updated:");
        Console.WriteLine(JsonConvert.SerializeObject(desiredProperties));
        
        // Apply desired properties
        if (desiredProperties.Contains("targetTemperature"))
        {
            var targetTemp = desiredProperties["targetTemperature"];
            Console.WriteLine($"Setting target temperature to {targetTemp}");
        }
        
        return Task.CompletedTask;
    }
}

// Usage
class Program
{
    static async Task Main(string[] args)
    {
        var connectionString = "HostName=your-hub.azure-devices.net;DeviceId=sensor-001;SharedAccessKey=...";
        var device = new AzureIoTDevice(connectionString, "sensor-001");
        
        await device.ConnectAsync();
        
        // Send telemetry every 10 seconds
        while (true)
        {
            var telemetry = new
            {
                temperature = 25.5 + (new Random().NextDouble() * 10),
                humidity = 60.0,
                pressure = 1013.25
            };
            
            await device.SendTelemetryAsync(telemetry);
            await Task.Delay(10000);
        }
    }
}
```

### Azure IoT Hub Message Routing

**Route Configuration**
```json
{
  "routes": [
    {
      "name": "HighTemperatureRoute",
      "source": "DeviceMessages",
      "condition": "temperature > 30",
      "endpointNames": ["HighTempQueue"],
      "isEnabled": true
    },
    {
      "name": "TelemetryRoute",
      "source": "DeviceMessages",
      "condition": "true",
      "endpointNames": ["TelemetryEventHub"],
      "isEnabled": true
    }
  ],
  "endpoints": [
    {
      "type": "EventHub",
      "name": "TelemetryEventHub",
      "connectionString": "Endpoint=sb://...",
      "subscriptionId": "...",
      "resourceGroup": "..."
    },
    {
      "type": "ServiceBusQueue",
      "name": "HighTempQueue",
      "connectionString": "Endpoint=sb://...",
      "subscriptionId": "...",
      "resourceGroup": "..."
    }
  ]
}
```

### Azure Stream Analytics

**Query for Real-Time Processing**
```sql
-- Process IoT Hub messages
SELECT
    deviceId,
    System.Timestamp AS windowEnd,
    AVG(temperature) AS avgTemperature,
    MAX(temperature) AS maxTemperature,
    MIN(temperature) AS minTemperature,
    COUNT(*) AS messageCount
INTO
    [OutputBlobStorage]
FROM
    [IoTHubInput]
TIMESTAMP BY
    timestamp
GROUP BY
    deviceId,
    TumblingWindow(minute, 5)

-- Detect anomalies
SELECT
    deviceId,
    temperature,
    AnomalyDetection_SpikeAndDip(temperature, 95, 120, 'spikesanddips')
        OVER(LIMIT DURATION(minute, 5)) AS anomaly
INTO
    [AlertsOutput]
FROM
    [IoTHubInput]
TIMESTAMP BY timestamp
```

## Google Cloud IoT Core

### Architecture

```
Device → Cloud IoT Core → Pub/Sub → Dataflow → BigQuery
                     ↓
              Device Config
                     ↓
              Device State
```

### Device Connection

**Python Device SDK**
```python
import jwt
import datetime
import ssl
import paho.mqtt.client as mqtt

class GCPIoTDevice:
    def __init__(self, project_id, cloud_region, registry_id, device_id, 
                 private_key_file):
        self.project_id = project_id
        self.cloud_region = cloud_region
        self.registry_id = registry_id
        self.device_id = device_id
        self.private_key_file = private_key_file
        
        # MQTT client
        self.client = mqtt.Client(
            client_id=f'projects/{project_id}/locations/{cloud_region}/'
                     f'registries/{registry_id}/devices/{device_id}')
        
        # Set callback handlers
        self.client.on_connect = self.on_connect
        self.client.on_publish = self.on_publish
        self.client.on_message = self.on_message
        
    def create_jwt(self):
        """Create JSON Web Token for authentication"""
        token = {
            'iat': datetime.datetime.utcnow(),
            'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=60),
            'aud': self.project_id
        }
        
        with open(self.private_key_file, 'r') as f:
            private_key = f.read()
        
        return jwt.encode(token, private_key, algorithm='RS256')
    
    def connect(self):
        """Connect to Google Cloud IoT Core"""
        # Set username and password
        self.client.username_pw_set(
            username='unused',
            password=self.create_jwt())
        
        # Enable SSL/TLS
        self.client.tls_set(ca_certs='/path/to/roots.pem',
                           tls_version=ssl.PROTOCOL_TLSv1_2)
        
        # Connect
        self.client.connect('mqtt.googleapis.com', 8883)
        self.client.loop_start()
    
    def on_connect(self, client, userdata, flags, rc):
        print(f'Connected with result code {rc}')
        
        # Subscribe to configuration topic
        config_topic = f'/devices/{self.device_id}/config'
        self.client.subscribe(config_topic, qos=1)
        
        # Subscribe to commands topic
        commands_topic = f'/devices/{self.device_id}/commands/#'
        self.client.subscribe(commands_topic, qos=0)
    
    def on_publish(self, client, userdata, mid):
        print(f'Message {mid} published')
    
    def on_message(self, client, userdata, message):
        """Handle configuration and command messages"""
        payload = message.payload.decode('utf-8')
        
        if '/config' in message.topic:
            print(f'Received configuration: {payload}')
            self.apply_config(payload)
        elif '/commands' in message.topic:
            print(f'Received command: {payload}')
            self.execute_command(payload)
    
    def publish_telemetry(self, data):
        """Publish telemetry to Cloud IoT Core"""
        topic = f'/devices/{self.device_id}/events'
        
        payload = json.dumps({
            'deviceId': self.device_id,
            'timestamp': datetime.datetime.utcnow().isoformat(),
            'data': data
        })
        
        self.client.publish(topic, payload, qos=1)
    
    def publish_state(self, state):
        """Update device state"""
        topic = f'/devices/{self.device_id}/state'
        
        payload = json.dumps(state)
        self.client.publish(topic, payload, qos=1)
    
    def apply_config(self, config):
        """Apply configuration from cloud"""
        config_data = json.loads(config)
        # Apply configuration...
        print(f'Applied config: {config_data}')
    
    def execute_command(self, command):
        """Execute command from cloud"""
        # Execute command...
        print(f'Executed command: {command}')

# Usage
device = GCPIoTDevice(
    project_id='my-project',
    cloud_region='us-central1',
    registry_id='my-registry',
    device_id='sensor-001',
    private_key_file='/path/to/rsa_private.pem'
)

device.connect()

# Publish telemetry
while True:
    telemetry = {
        'temperature': 25.5,
        'humidity': 60.0
    }
    device.publish_telemetry(telemetry)
    time.sleep(60)
```

### Google Cloud Dataflow Processing

**Apache Beam Pipeline**
```python
import apache_beam as beam
from apache_beam.options.pipeline_options import PipelineOptions
from apache_beam.io import ReadFromPubSub
from apache_beam.io.gcp.bigquery import WriteToBigQuery
import json

class ParseTelemetry(beam.DoFn):
    def process(self, element):
        """Parse and enrich telemetry data"""
        data = json.loads(element.decode('utf-8'))
        
        # Add processing timestamp
        data['processedAt'] = datetime.datetime.utcnow().isoformat()
        
        # Calculate derived metrics
        if 'temperature' in data['data']:
            temp_f = (data['data']['temperature'] * 9/5) + 32
            data['data']['temperatureFahrenheit'] = temp_f
        
        yield data

class DetectAnomalies(beam.DoFn):
    def process(self, element):
        """Detect anomalous readings"""
        if element['data'].get('temperature', 0) > 50:
            yield {
                'deviceId': element['deviceId'],
                'timestamp': element['timestamp'],
                'anomalyType': 'HIGH_TEMPERATURE',
                'value': element['data']['temperature']
            }

def run_pipeline():
    options = PipelineOptions()
    
    with beam.Pipeline(options=options) as pipeline:
        # Read from Pub/Sub
        telemetry = (pipeline
            | 'Read from Pub/Sub' >> ReadFromPubSub(
                subscription='projects/my-project/subscriptions/telemetry-sub')
            | 'Parse' >> beam.ParDo(ParseTelemetry())
        )
        
        # Write all data to BigQuery
        telemetry | 'Write to BigQuery' >> WriteToBigQuery(
            table='my-project:iot_data.telemetry',
            schema='deviceId:STRING,timestamp:TIMESTAMP,data:RECORD'
        )
        
        # Detect and handle anomalies
        anomalies = telemetry | 'Detect Anomalies' >> beam.ParDo(DetectAnomalies())
        
        # Send alerts
        anomalies | 'Send Alerts' >> beam.Map(send_alert)

if __name__ == '__main__':
    run_pipeline()
```

## Platform Comparison

| Feature | AWS IoT Core | Azure IoT Hub | Google Cloud IoT |
|---------|-------------|---------------|------------------|
| **Protocol Support** | MQTT, HTTPS, WebSocket | MQTT, AMQP, HTTPS | MQTT, HTTP |
| **Device Management** | Thing Registry, Jobs | Device Registry, Twins | Device Registry |
| **Rules/Routing** | Rules Engine | Message Routes | Pub/Sub |
| **Edge Computing** | Greengrass | IoT Edge | Edge TPU |
| **Security** | X.509, Custom Auth | X.509, SAS, TPM | RS256/ES256 JWT |
| **Pricing Model** | Messages + connections | Messages + operations | MB data |
| **Integration** | 20+ AWS services | Azure services | GCP services |

## Key Takeaways

1. **AWS IoT Core**: Strongest integration with AWS ecosystem, powerful Rules Engine
2. **Azure IoT Hub**: Enterprise-focused, excellent Device Twins, Stream Analytics
3. **Google Cloud IoT**: Strong data analytics with BigQuery and Dataflow
4. **All platforms** support MQTT, device management, and cloud integration
5. **Choose based on**: Existing cloud provider, specific features needed, pricing
6. **Security**: All support certificate-based authentication and encryption

## Next Steps

- Explore edge computing with AWS Greengrass, Azure IoT Edge
- Learn about IoT analytics and machine learning
- Study device provisioning at scale
