---
id: advanced-9
title: IoT and Cloud Integration
type: text
---

# IoT and Cloud Integration

## Overview

The Internet of Things (IoT) connects billions of devices to the cloud, generating massive amounts of data requiring real-time processing, storage, and analysis. Cloud platforms provide the infrastructure needed to manage IoT at scale.

## IoT Architecture

### Complete IoT Stack

```
┌──────────────────────────────────────────┐
│         Cloud Layer                       │
│  - Data warehousing                      │
│  - ML/AI analytics                       │
│  - Long-term storage                     │
│  - Business intelligence                 │
└──────────────┬───────────────────────────┘
               │
┌──────────────▼───────────────────────────┐
│         Platform Layer                    │
│  - Device management                     │
│  - Rules engine                          │
│  - Stream processing                     │
│  - Device shadows                        │
└──────────────┬───────────────────────────┘
               │
┌──────────────▼───────────────────────────┐
│         Connectivity Layer                │
│  - MQTT, HTTP, CoAP                      │
│  - Security (TLS, certificates)          │
│  - Protocol translation                   │
└──────────────┬───────────────────────────┘
               │
┌──────────────▼───────────────────────────┐
│         Edge Layer                        │
│  - Edge gateways                         │
│  - Local processing                      │
│  - Offline capability                    │
└──────────────┬───────────────────────────┘
               │
┌──────────────▼───────────────────────────┐
│         Device Layer                      │
│  - Sensors                               │
│  - Actuators                             │
│  - Embedded systems                      │
└──────────────────────────────────────────┘
```

## IoT Communication Protocols

### 1. MQTT (Message Queuing Telemetry Transport)

**Python MQTT Client**
```python
import paho.mqtt.client as mqtt
import json
import time

class IoTDevice:
    def __init__(self, device_id, broker, port=1883):
        self.device_id = device_id
        self.client = mqtt.Client(device_id)
        self.broker = broker
        self.port = port
        
        # Set callbacks
        self.client.on_connect = self.on_connect
        self.client.on_message = self.on_message
        self.client.on_disconnect = self.on_disconnect
        
    def on_connect(self, client, userdata, flags, rc):
        print(f"Connected with result code {rc}")
        
        # Subscribe to command topics
        self.client.subscribe(f"devices/{self.device_id}/commands")
        self.client.subscribe(f"devices/{self.device_id}/config")
        
    def on_message(self, client, userdata, msg):
        """Handle incoming messages from cloud"""
        topic = msg.topic
        payload = json.loads(msg.payload.decode())
        
        if 'commands' in topic:
            self.handle_command(payload)
        elif 'config' in topic:
            self.update_config(payload)
    
    def on_disconnect(self, client, userdata, rc):
        print(f"Disconnected with result code {rc}")
        if rc != 0:
            print("Unexpected disconnection. Attempting to reconnect...")
            self.connect()
    
    def connect(self):
        """Connect to MQTT broker"""
        self.client.connect(self.broker, self.port, keepalive=60)
        self.client.loop_start()
    
    def publish_telemetry(self, sensor_data):
        """Publish sensor data to cloud"""
        topic = f"devices/{self.device_id}/telemetry"
        
        payload = {
            'deviceId': self.device_id,
            'timestamp': time.time(),
            'data': sensor_data
        }
        
        # QoS 1 = At least once delivery
        self.client.publish(topic, json.dumps(payload), qos=1)
    
    def handle_command(self, command):
        """Execute commands from cloud"""
        cmd_type = command.get('type')
        
        if cmd_type == 'reboot':
            print("Rebooting device...")
            self.reboot()
        elif cmd_type == 'update_firmware':
            print(f"Updating firmware to {command['version']}")
            self.update_firmware(command['url'])
    
    def update_config(self, config):
        """Update device configuration"""
        print(f"Updating configuration: {config}")
        # Save config and apply changes

# Usage
device = IoTDevice('sensor-001', 'mqtt.example.com')
device.connect()

# Publish sensor readings
while True:
    sensor_data = {
        'temperature': read_temperature(),
        'humidity': read_humidity(),
        'pressure': read_pressure()
    }
    device.publish_telemetry(sensor_data)
    time.sleep(60)  # Send every minute
```

### 2. HTTP/HTTPS REST APIs

**Arduino (ESP32) HTTP Client**
```cpp
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

const char* ssid = "YourWiFi";
const char* password = "YourPassword";
const char* serverUrl = "https://iot-api.example.com";
const char* deviceId = "esp32-001";
const char* apiKey = "your-api-key";

void setup() {
  Serial.begin(115200);
  
  // Connect to WiFi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    // Read sensors
    float temperature = readTemperature();
    float humidity = readHumidity();
    
    // Send data to cloud
    sendTelemetry(temperature, humidity);
  }
  
  delay(60000); // Send every 60 seconds
}

void sendTelemetry(float temp, float humidity) {
  HTTPClient http;
  
  // Build endpoint URL
  String url = String(serverUrl) + "/devices/" + deviceId + "/telemetry";
  
  http.begin(url);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Authorization", String("Bearer ") + apiKey);
  
  // Create JSON payload
  StaticJsonDocument<200> doc;
  doc["deviceId"] = deviceId;
  doc["timestamp"] = millis();
  doc["temperature"] = temp;
  doc["humidity"] = humidity;
  
  String payload;
  serializeJson(doc, payload);
  
  // Send POST request
  int httpCode = http.POST(payload);
  
  if (httpCode > 0) {
    String response = http.getString();
    Serial.println("Response: " + response);
  } else {
    Serial.println("Error: " + String(httpCode));
  }
  
  http.end();
}

float readTemperature() {
  // Read from DHT22 or similar
  return 25.5; // Example value
}

float readHumidity() {
  return 60.0; // Example value
}
```

### 3. CoAP (Constrained Application Protocol)

**MicroPython CoAP Client**
```python
# Lightweight protocol for constrained devices
from coapthon.client.helperclient import HelperClient
import json
import time

class CoAPDevice:
    def __init__(self, server_host, server_port=5683):
        self.client = HelperClient(server=(server_host, server_port))
        self.device_id = 'coap-device-001'
    
    def send_data(self, sensor_data):
        """Send data using CoAP POST"""
        path = f'/devices/{self.device_id}/data'
        
        payload = json.dumps({
            'deviceId': self.device_id,
            'timestamp': time.time(),
            'data': sensor_data
        })
        
        # CoAP POST request
        response = self.client.post(path, payload)
        return response

# Usage for resource-constrained device
device = CoAPDevice('coap.example.com')

while True:
    data = {'temp': 22.5, 'battery': 85}
    device.send_data(data)
    time.sleep(300)  # Every 5 minutes
```

## Device Management

### 1. Device Registration and Provisioning

```python
# Cloud-side device registration
from flask import Flask, request, jsonify
import uuid
import hashlib

app = Flask(__name__)

# In-memory device registry (use database in production)
device_registry = {}

@app.route('/api/devices/register', methods=['POST'])
def register_device():
    """Register a new IoT device"""
    data = request.json
    
    # Validate registration request
    required_fields = ['serialNumber', 'deviceType', 'manufacturerId']
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing required fields'}), 400
    
    # Generate device credentials
    device_id = str(uuid.uuid4())
    api_key = generate_api_key()
    
    # Store device info
    device_registry[device_id] = {
        'deviceId': device_id,
        'serialNumber': data['serialNumber'],
        'deviceType': data['deviceType'],
        'manufacturerId': data['manufacturerId'],
        'apiKey': hash_api_key(api_key),
        'registeredAt': datetime.utcnow(),
        'status': 'active'
    }
    
    # Return credentials to device (send only once!)
    return jsonify({
        'deviceId': device_id,
        'apiKey': api_key,  # Device stores this securely
        'mqttBroker': 'mqtt.example.com',
        'mqttPort': 8883
    }), 201

def generate_api_key():
    """Generate secure API key"""
    return secrets.token_urlsafe(32)

def hash_api_key(api_key):
    """Hash API key for storage"""
    return hashlib.sha256(api_key.encode()).hexdigest()

@app.route('/api/devices/<device_id>', methods=['GET'])
def get_device(device_id):
    """Get device information"""
    if device_id not in device_registry:
        return jsonify({'error': 'Device not found'}), 404
    
    device = device_registry[device_id].copy()
    device.pop('apiKey')  # Don't expose API key
    
    return jsonify(device)

@app.route('/api/devices/<device_id>/deactivate', methods=['POST'])
def deactivate_device(device_id):
    """Deactivate a device"""
    if device_id not in device_registry:
        return jsonify({'error': 'Device not found'}), 404
    
    device_registry[device_id]['status'] = 'inactive'
    device_registry[device_id]['deactivatedAt'] = datetime.utcnow()
    
    return jsonify({'message': 'Device deactivated'})
```

### 2. Device Shadows (Digital Twins)

```javascript
// Device Shadow pattern - maintain device state in cloud
class DeviceShadow {
  constructor(deviceId) {
    this.deviceId = deviceId;
    this.state = {
      reported: {},  // Last known state from device
      desired: {}    // Desired state from application
    };
    this.version = 0;
    this.lastUpdated = null;
  }
  
  updateReported(state) {
    /**
     * Device reports its current state
     */
    this.state.reported = { ...this.state.reported, ...state };
    this.version++;
    this.lastUpdated = new Date();
    
    // Check if device matches desired state
    const delta = this.calculateDelta();
    if (Object.keys(delta).length > 0) {
      // Send delta to device
      this.sendDeltaToDevice(delta);
    }
    
    return this.state;
  }
  
  updateDesired(state) {
    /**
     * Application sets desired state
     */
    this.state.desired = { ...this.state.desired, ...state };
    this.version++;
    this.lastUpdated = new Date();
    
    // Calculate what needs to change
    const delta = this.calculateDelta();
    
    // Notify device of desired changes
    if (Object.keys(delta).length > 0) {
      this.sendDeltaToDevice(delta);
    }
    
    return this.state;
  }
  
  calculateDelta() {
    /**
     * Calculate difference between desired and reported state
     */
    const delta = {};
    
    for (const [key, value] of Object.entries(this.state.desired)) {
      if (this.state.reported[key] !== value) {
        delta[key] = value;
      }
    }
    
    return delta;
  }
  
  sendDeltaToDevice(delta) {
    /**
     * Send state changes to device via MQTT
     */
    const topic = `devices/${this.deviceId}/shadow/update/delta`;
    mqttClient.publish(topic, JSON.stringify(delta));
  }
  
  getState() {
    return {
      state: this.state,
      metadata: {
        version: this.version,
        lastUpdated: this.lastUpdated
      }
    };
  }
}

// Usage example
const thermostatShadow = new DeviceShadow('thermostat-001');

// Device reports current temperature
thermostatShadow.updateReported({
  temperature: 22,
  targetTemperature: 20,
  mode: 'cooling'
});

// User changes target temperature via app
thermostatShadow.updateDesired({
  targetTemperature: 24,
  mode: 'heating'
});

// Device will receive delta: { targetTemperature: 24, mode: 'heating' }
```

## Data Processing Patterns

### 1. Stream Processing

```python
# AWS Kinesis stream processing
import json
import base64
from datetime import datetime

def lambda_handler(event, context):
    """Process IoT data stream in real-time"""
    
    for record in event['Records']:
        # Decode data from Kinesis
        payload = base64.b64decode(record['kinesis']['data'])
        data = json.loads(payload)
        
        # Validate data
        if not validate_telemetry(data):
            log_invalid_data(data)
            continue
        
        # Enrich data
        enriched = enrich_telemetry(data)
        
        # Apply business rules
        alerts = check_rules(enriched)
        
        # Store processed data
        store_telemetry(enriched)
        
        # Send alerts if needed
        for alert in alerts:
            send_alert(alert)
    
    return {'processedRecords': len(event['Records'])}

def validate_telemetry(data):
    """Validate telemetry data"""
    required_fields = ['deviceId', 'timestamp', 'data']
    return all(field in data for field in required_fields)

def enrich_telemetry(data):
    """Add metadata and context"""
    device_info = get_device_info(data['deviceId'])
    
    return {
        **data,
        'deviceType': device_info['type'],
        'location': device_info['location'],
        'processedAt': datetime.utcnow().isoformat()
    }

def check_rules(data):
    """Apply business rules"""
    alerts = []
    
    # Temperature alert
    if data['data'].get('temperature', 0) > 80:
        alerts.append({
            'type': 'HIGH_TEMPERATURE',
            'deviceId': data['deviceId'],
            'value': data['data']['temperature'],
            'severity': 'critical'
        })
    
    # Battery alert
    if data['data'].get('battery', 100) < 20:
        alerts.append({
            'type': 'LOW_BATTERY',
            'deviceId': data['deviceId'],
            'value': data['data']['battery'],
            'severity': 'warning'
        })
    
    return alerts
```

### 2. Time-Series Data Storage

```python
# Store IoT data in time-series database
from influxdb_client import InfluxDBClient, Point
from influxdb_client.client.write_api import SYNCHRONOUS

class IoTDataStore:
    def __init__(self, url, token, org, bucket):
        self.client = InfluxDBClient(url=url, token=token, org=org)
        self.write_api = self.client.write_api(write_options=SYNCHRONOUS)
        self.bucket = bucket
        self.org = org
    
    def write_telemetry(self, device_id, measurements):
        """Write device measurements to InfluxDB"""
        
        points = []
        for metric, value in measurements.items():
            point = Point("telemetry") \
                .tag("deviceId", device_id) \
                .tag("metric", metric) \
                .field("value", value) \
                .time(datetime.utcnow())
            
            points.append(point)
        
        self.write_api.write(bucket=self.bucket, org=self.org, record=points)
    
    def query_device_data(self, device_id, metric, start_time, end_time):
        """Query device data for specific time range"""
        
        query = f'''
            from(bucket: "{self.bucket}")
                |> range(start: {start_time}, stop: {end_time})
                |> filter(fn: (r) => r["_measurement"] == "telemetry")
                |> filter(fn: (r) => r["deviceId"] == "{device_id}")
                |> filter(fn: (r) => r["metric"] == "{metric}")
        '''
        
        query_api = self.client.query_api()
        result = query_api.query(org=self.org, query=query)
        
        values = []
        for table in result:
            for record in table.records:
                values.append({
                    'time': record.get_time(),
                    'value': record.get_value()
                })
        
        return values
    
    def aggregate_data(self, device_id, metric, window='1h'):
        """Aggregate data over time window"""
        
        query = f'''
            from(bucket: "{self.bucket}")
                |> range(start: -24h)
                |> filter(fn: (r) => r["deviceId"] == "{device_id}")
                |> filter(fn: (r) => r["metric"] == "{metric}")
                |> aggregateWindow(every: {window}, fn: mean)
        '''
        
        query_api = self.client.query_api()
        return query_api.query(org=self.org, query=query)

# Usage
db = IoTDataStore(
    url='http://localhost:8086',
    token='my-token',
    org='my-org',
    bucket='iot-data'
)

# Write data
db.write_telemetry('sensor-001', {
    'temperature': 25.5,
    'humidity': 60.2,
    'pressure': 1013.25
})

# Query data
data = db.query_device_data(
    'sensor-001',
    'temperature',
    '-1h',
    'now()'
)
```

## Security Best Practices

### 1. Device Authentication

```python
# Mutual TLS authentication
import ssl
import socket

def create_secure_client(device_cert, device_key, ca_cert):
    """Create TLS-secured client"""
    
    context = ssl.create_default_context(ssl.Purpose.SERVER_AUTH)
    context.load_cert_chain(certfile=device_cert, keyfile=device_key)
    context.load_verify_locations(cafile=ca_cert)
    
    # Require server certificate verification
    context.verify_mode = ssl.CERT_REQUIRED
    context.check_hostname = True
    
    return context

# Connect with mutual TLS
context = create_secure_client(
    '/path/to/device-cert.pem',
    '/path/to/device-key.pem',
    '/path/to/ca-cert.pem'
)

sock = socket.create_connection(('iot.example.com', 8883))
secure_sock = context.wrap_socket(sock, server_hostname='iot.example.com')
```

### 2. Data Encryption

```python
from cryptography.fernet import Fernet

class SecureDevice:
    def __init__(self, encryption_key):
        self.cipher = Fernet(encryption_key)
    
    def encrypt_payload(self, data):
        """Encrypt sensitive data before transmission"""
        json_data = json.dumps(data)
        encrypted = self.cipher.encrypt(json_data.encode())
        return encrypted
    
    def decrypt_payload(self, encrypted_data):
        """Decrypt received data"""
        decrypted = self.cipher.decrypt(encrypted_data)
        return json.loads(decrypted.decode())
```

## Key Takeaways

1. **IoT architecture** spans devices, connectivity, platform, and cloud layers
2. **Protocols**: MQTT for low-power, HTTP for simplicity, CoAP for constrained devices
3. **Device shadows** maintain state synchronization between device and cloud
4. **Stream processing** enables real-time data analysis and alerting
5. **Time-series databases** optimized for IoT telemetry storage
6. **Security**: Use TLS, device certificates, and encryption

## Next Steps

- Explore cloud-specific IoT platforms (AWS IoT, Azure IoT Hub, Google Cloud IoT)
- Learn about edge analytics and ML inference on devices
- Study IoT security in depth
