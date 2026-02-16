---
id: advanced-7
title: Edge Computing Fundamentals
type: text
---

# Edge Computing Fundamentals

## Overview

Edge computing brings computation and data storage closer to the location where it's needed, reducing latency and bandwidth usage. This paradigm shift is essential for IoT, real-time applications, and content delivery.

## What is Edge Computing?

### Core Concept

**Traditional Cloud Computing**
```
User → Internet → Cloud Data Center → Processing → Response
Latency: 50-200ms+
```

**Edge Computing**
```
User → Nearby Edge Location → Processing → Response
Latency: 1-50ms
```

### Key Characteristics

1. **Proximity**: Computing resources placed near data sources
2. **Low Latency**: Reduced round-trip time
3. **Bandwidth Efficiency**: Less data transmitted to central cloud
4. **Autonomy**: Can operate with intermittent connectivity
5. **Data Privacy**: Sensitive data processed locally

## Edge Computing Architecture

### Three-Tier Model

```
┌─────────────────────────────────┐
│      Cloud Core (Central)       │
│  - Heavy analytics               │
│  - ML model training             │
│  - Long-term storage             │
└──────────────┬──────────────────┘
               │
┌──────────────▼──────────────────┐
│      Edge (Regional)             │
│  - Aggregation                   │
│  - ML inference                  │
│  - Caching                       │
└──────────────┬──────────────────┘
               │
┌──────────────▼──────────────────┐
│      Device (Local)              │
│  - Data collection               │
│  - Basic processing              │
│  - Immediate response            │
└──────────────────────────────────┘
```

### Edge Computing Layers

**Device Layer**
```python
# Raspberry Pi - Edge Device Example
import time
import statistics
from sensor import read_temperature

# Local processing and filtering
temperature_buffer = []
BUFFER_SIZE = 10
THRESHOLD = 75.0

def process_locally():
    temp = read_temperature()
    temperature_buffer.append(temp)
    
    if len(temperature_buffer) >= BUFFER_SIZE:
        avg_temp = statistics.mean(temperature_buffer)
        
        # Only send to edge if threshold exceeded
        if avg_temp > THRESHOLD:
            send_to_edge({'avgTemp': avg_temp, 'alert': True})
        
        temperature_buffer.clear()
    
    return temp

while True:
    process_locally()
    time.sleep(1)
```

**Edge Layer**
```javascript
// Edge Gateway - Aggregation and Processing
const express = require('express');
const app = express();

// In-memory cache for recent data
const deviceDataCache = new Map();

app.post('/sensor-data', (req, res) => {
  const { deviceId, data } = req.body;
  
  // Store in local cache
  updateCache(deviceId, data);
  
  // Aggregate data from multiple devices
  if (shouldAggregate()) {
    const aggregated = aggregateDeviceData();
    
    // Send aggregated data to cloud
    sendToCloud(aggregated);
  }
  
  res.json({ received: true });
});

function shouldAggregate() {
  // Aggregate every 100 readings or every 60 seconds
  return deviceDataCache.size >= 100 || 
         timeSinceLastAggregation() > 60000;
}
```

**Cloud Layer**
```python
# Cloud - Long-term Analysis
from datetime import datetime
import pandas as pd
from ml_model import predict_failures

def analyze_edge_data(aggregated_data):
    """Process data from multiple edge locations"""
    
    # Store in data warehouse
    df = pd.DataFrame(aggregated_data)
    df.to_sql('sensor_readings', db_engine, if_exists='append')
    
    # Run ML models for pattern detection
    predictions = predict_failures(df)
    
    # Update edge configurations based on insights
    if predictions['failure_risk'] > 0.8:
        update_edge_thresholds(
            location=aggregated_data['location'],
            new_threshold=predictions['recommended_threshold']
        )
    
    return predictions
```

## Edge Computing Use Cases

### 1. IoT and Industrial Applications

**Smart Factory Example**
```python
import cv2
import numpy as np
from edge_ml import load_model

# Load model on edge device
defect_detector = load_model('quality_control_model')

def inspect_product(image_path):
    """Real-time quality inspection at edge"""
    
    # Read image from camera
    image = cv2.imread(image_path)
    
    # Run inference locally (no cloud latency)
    result = defect_detector.predict(image)
    
    if result['defect_probability'] > 0.85:
        # Immediate action
        trigger_alarm()
        stop_production_line()
        
        # Log to cloud for analysis
        log_to_cloud({
            'timestamp': datetime.now(),
            'defect_type': result['defect_type'],
            'confidence': result['defect_probability'],
            'image_id': image_path
        })
    
    return result

# Process images from production line camera
while True:
    image = capture_from_camera()
    inspect_product(image)
```

### 2. Autonomous Vehicles

**Edge Processing Pipeline**
```cpp
// C++ - Real-time vehicle processing
class VehicleEdgeProcessor {
private:
    SensorFusion sensorFusion;
    ObjectDetector objectDetector;
    PathPlanner pathPlanner;
    
public:
    void processFrame() {
        // Collect sensor data (LIDAR, cameras, radar)
        auto sensorData = sensorFusion.collectData();
        
        // Detect objects (must be < 50ms)
        auto objects = objectDetector.detect(sensorData);
        
        // Make immediate driving decisions
        auto decision = pathPlanner.plan(objects);
        
        // Execute (cannot wait for cloud)
        executeDecision(decision);
        
        // Send anonymized data to cloud for learning
        if (shouldUploadToCloud()) {
            cloudUploader.sendAsync(sensorData, objects);
        }
    }
    
    bool shouldUploadToCloud() {
        // Only upload interesting scenarios
        return hasUnusualEvent() || 
               isLowBandwidthPeriod() ||
               timeForScheduledUpdate();
    }
};
```

### 3. Smart Retail

**In-Store Analytics**
```java
// Java - Edge analytics in retail
public class RetailEdgeAnalytics {
    private VideoAnalyzer videoAnalyzer;
    private InventoryTracker inventoryTracker;
    
    public void analyzeStoreActivity() {
        // Process video streams locally
        VideoFrame frame = camera.getCurrentFrame();
        
        // Count customers in real-time
        int customerCount = videoAnalyzer.countPeople(frame);
        
        // Detect shelf inventory levels
        InventoryLevel inventory = videoAnalyzer.analyzeShelfStock(frame);
        
        // Immediate alerts for staff
        if (inventory.needsRestocking()) {
            notifyStaff("Aisle " + inventory.getAisle() + " needs restocking");
        }
        
        // Heat map analysis
        HeatMap heatMap = videoAnalyzer.generateHeatMap(frame);
        
        // Send summary to cloud (not raw video)
        cloudService.sendSummary(new StoreSummary(
            customerCount,
            inventory,
            heatMap.getHotSpots()
        ));
    }
}
```

### 4. Content Delivery and Gaming

**Edge CDN with Dynamic Content**
```javascript
// Node.js - Edge compute for personalization
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  
  // Parse user context from request
  const userContext = {
    country: request.cf.country,
    device: request.headers.get('User-Agent'),
    preferences: parseCooki(request.headers.get('Cookie'))
  };
  
  // Generate personalized content at edge
  if (url.pathname === '/api/recommendations') {
    const recommendations = await generateRecommendations(userContext);
    
    return new Response(JSON.stringify(recommendations), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'private, max-age=60'
      }
    });
  }
  
  // Serve static content from edge cache
  const cachedResponse = await caches.default.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // Fetch from origin if not cached
  const response = await fetch(request);
  
  // Cache at edge for future requests
  event.waitUntil(
    caches.default.put(request, response.clone())
  );
  
  return response;
}
```

## Edge Computing Technologies

### 1. Edge Devices

**Hardware Options**
```
Raspberry Pi 4
├── CPU: Quad-core ARM Cortex-A72
├── RAM: 2-8 GB
├── Use: IoT gateways, sensors
└── Cost: $35-$75

NVIDIA Jetson Nano
├── GPU: 128-core Maxwell
├── RAM: 4 GB
├── Use: AI inference, computer vision
└── Cost: $99

Intel NUC
├── CPU: Intel Core i3/i5/i7
├── RAM: Up to 64 GB
├── Use: Edge servers, gateways
└── Cost: $300-$1000
```

### 2. Edge Platforms

**AWS IoT Greengrass**
```python
# AWS IoT Greengrass Lambda function
import greengrasssdk
import json

# Create client for local communication
client = greengrasssdk.client('iot-data')

def lambda_handler(event, context):
    """Runs at the edge on Greengrass Core"""
    
    # Process data locally
    processed = process_sensor_data(event)
    
    # Publish to local MQTT broker (no internet needed)
    client.publish(
        topic='local/processed',
        payload=json.dumps(processed)
    )
    
    # Optionally sync to cloud when connected
    if should_sync_to_cloud(processed):
        client.publish(
            topic='cloud/analytics',
            payload=json.dumps(processed)
        )
    
    return processed
```

**Azure IoT Edge**
```csharp
// C# - Azure IoT Edge Module
using Microsoft.Azure.Devices.Client;
using Microsoft.Azure.Devices.Shared;

public class EdgeModule
{
    private ModuleClient moduleClient;
    
    public async Task InitAsync()
    {
        // Connect to IoT Edge runtime
        moduleClient = await ModuleClient.CreateFromEnvironmentAsync();
        
        // Register handler for input messages
        await moduleClient.SetInputMessageHandlerAsync(
            "input1", 
            ProcessMessageAsync, 
            moduleClient);
    }
    
    private async Task<MessageResponse> ProcessMessageAsync(
        Message message, 
        object userContext)
    {
        byte[] messageBytes = message.GetBytes();
        string data = Encoding.UTF8.GetString(messageBytes);
        
        // Process at edge
        var result = ProcessData(data);
        
        // Send to next module or cloud
        if (result.ShouldForward)
        {
            var outputMessage = new Message(
                Encoding.UTF8.GetBytes(result.Data));
            
            await moduleClient.SendEventAsync("output1", outputMessage);
        }
        
        return MessageResponse.Completed;
    }
}
```

## Edge Computing Challenges

### 1. Resource Constraints

```python
# Managing limited resources at edge
import psutil
import gc

class ResourceManager:
    def __init__(self, memory_threshold=0.8, cpu_threshold=0.9):
        self.memory_threshold = memory_threshold
        self.cpu_threshold = cpu_threshold
    
    def check_resources(self):
        """Monitor resource usage"""
        memory_percent = psutil.virtual_memory().percent / 100
        cpu_percent = psutil.cpu_percent(interval=1) / 100
        
        return {
            'memory_available': memory_percent < self.memory_threshold,
            'cpu_available': cpu_percent < self.cpu_threshold
        }
    
    def process_with_throttling(self, data_queue):
        """Process data with resource awareness"""
        while not data_queue.empty():
            resources = self.check_resources()
            
            if not resources['memory_available']:
                # Force garbage collection
                gc.collect()
                continue
            
            if not resources['cpu_available']:
                # Skip this cycle
                time.sleep(0.1)
                continue
            
            # Process next item
            item = data_queue.get()
            process_item(item)
```

### 2. Connectivity and Synchronization

```javascript
// Handling intermittent connectivity
class EdgeDataSync {
  constructor() {
    this.offlineQueue = [];
    this.isOnline = navigator.onLine;
    
    window.addEventListener('online', () => this.handleOnline());
    window.addEventListener('offline', () => this.handleOffline());
  }
  
  async sendData(data) {
    if (this.isOnline) {
      try {
        await this.sendToCloud(data);
      } catch (error) {
        // Queue for later if send fails
        this.offlineQueue.push(data);
      }
    } else {
      // Store locally
      this.offlineQueue.push(data);
      await this.saveToLocalDB(data);
    }
  }
  
  async handleOnline() {
    this.isOnline = true;
    console.log('Connection restored, syncing queued data...');
    
    // Sync queued data
    while (this.offlineQueue.length > 0) {
      const data = this.offlineQueue.shift();
      try {
        await this.sendToCloud(data);
      } catch (error) {
        // Re-queue if still failing
        this.offlineQueue.unshift(data);
        break;
      }
    }
  }
  
  handleOffline() {
    this.isOnline = false;
    console.log('Connection lost, entering offline mode');
  }
}
```

### 3. Security at the Edge

```python
# Securing edge devices
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2

class EdgeSecurity:
    def __init__(self):
        self.encryption_key = self.load_or_generate_key()
        self.cipher = Fernet(self.encryption_key)
    
    def encrypt_data(self, data):
        """Encrypt sensitive data before storage/transmission"""
        return self.cipher.encrypt(data.encode())
    
    def decrypt_data(self, encrypted_data):
        """Decrypt received data"""
        return self.cipher.decrypt(encrypted_data).decode()
    
    def validate_device(self, device_id, signature):
        """Ensure only authorized devices communicate"""
        expected_signature = self.generate_signature(device_id)
        return signature == expected_signature
    
    def secure_boot_check(self):
        """Verify device integrity on startup"""
        # Check firmware hash
        current_hash = self.calculate_firmware_hash()
        expected_hash = self.get_expected_hash()
        
        if current_hash != expected_hash:
            raise SecurityError("Firmware integrity check failed")
```

## Key Takeaways

1. **Edge computing reduces latency** by processing data near its source
2. **Three-tier architecture**: Device → Edge → Cloud for optimal data flow
3. **Use cases include IoT, autonomous vehicles, retail, and content delivery**
4. **Key challenges**: Resource constraints, connectivity, security
5. **Major platforms**: AWS Greengrass, Azure IoT Edge, Google Cloud IoT
6. **Benefits**: Lower latency, reduced bandwidth, improved privacy, offline capability

## Next Steps

- Explore specific edge computing platforms and CDNs
- Learn about edge AI and machine learning inference
- Study edge security best practices
