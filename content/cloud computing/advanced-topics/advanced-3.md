---
id: advanced-3
title: Azure Functions Deep Dive
type: text
---

# Azure Functions Deep Dive

Azure Functions is Microsoft's serverless compute platform that enables event-driven code execution without managing infrastructure. This deep dive explores advanced concepts, patterns, and best practices.

## Function Anatomy

### Function Structure

```csharp
using Microsoft.Azure.WebJobs;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

public static class MyFunctions
{
    [FunctionName("HttpTrigger")]
    public static async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Function, "get", "post")] HttpRequest req,
        ILogger log)
    {
        log.LogInformation("C# HTTP trigger function processed a request.");
        
        string name = req.Query["name"];
        string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
        dynamic data = JsonConvert.DeserializeObject(requestBody);
        name = name ?? data?.name;
        
        return name != null
            ? (ActionResult)new OkObjectResult($"Hello, {name}")
            : new BadRequestObjectResult("Please pass a name");
    }
}
```

### Python Function

```python
import azure.functions as func
import logging
import json

app = func.FunctionApp()

@app.function_name(name="HttpTrigger")
@app.route(route="hello", auth_level=func.AuthLevel.FUNCTION)
def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')
    
    name = req.params.get('name')
    if not name:
        try:
            req_body = req.get_json()
        except ValueError:
            pass
        else:
            name = req_body.get('name')
    
    if name:
        return func.HttpResponse(f"Hello, {name}!")
    else:
        return func.HttpResponse(
            "Pass a name in the query string or request body",
            status_code=400
        )
```

## Triggers and Bindings

### Trigger Types

**HTTP Trigger:**
```csharp
[FunctionName("HttpExample")]
public static async Task<IActionResult> Run(
    [HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = "products/{id}")] 
    HttpRequest req,
    string id,
    ILogger log)
{
    log.LogInformation($"Getting product {id}");
    return new OkObjectResult(new { ProductId = id });
}
```

**Timer Trigger (Cron):**
```csharp
[FunctionName("TimerTrigger")]
public static void Run(
    [TimerTrigger("0 */5 * * * *")] TimerInfo myTimer,
    ILogger log)
{
    log.LogInformation($"Timer triggered at: {DateTime.Now}");
}
```

**Queue Trigger:**
```csharp
[FunctionName("QueueTrigger")]
public static void Run(
    [QueueTrigger("myqueue")] string myQueueItem,
    ILogger log)
{
    log.LogInformation($"Processing queue item: {myQueueItem}");
}
```

**Blob Trigger:**
```csharp
[FunctionName("BlobTrigger")]
public static void Run(
    [BlobTrigger("samples/{name}", Connection = "AzureWebJobsStorage")] Stream myBlob,
    string name,
    ILogger log)
{
    log.LogInformation($"Blob trigger function processed blob\n Name:{name} \n Size: {myBlob.Length} Bytes");
}
```

**Event Grid Trigger:**
```csharp
[FunctionName("EventGridTrigger")]
public static void Run(
    [EventGridTrigger] EventGridEvent eventGridEvent,
    ILogger log)
{
    log.LogInformation(eventGridEvent.Data.ToString());
}
```

**Cosmos DB Trigger:**
```csharp
[FunctionName("CosmosDBTrigger")]
public static void Run(
    [CosmosDBTrigger(
        databaseName: "mydb",
        collectionName: "items",
        ConnectionStringSetting = "CosmosDBConnection",
        LeaseCollectionName = "leases",
        CreateLeaseCollectionIfNotExists = true)] IReadOnlyList<Document> documents,
    ILogger log)
{
    foreach (var doc in documents)
    {
        log.LogInformation($"Document Id: {doc.Id}");
    }
}
```

### Output Bindings

**Multiple Bindings:**
```csharp
[FunctionName("MultipleBindings")]
public static async Task Run(
    [HttpTrigger(AuthorizationLevel.Function, "post")] HttpRequest req,
    [Queue("output-queue")] IAsyncCollector<string> queueOutput,
    [Blob("output-container/{rand-guid}.txt")] TextWriter blobOutput,
    [CosmosDB(
        databaseName: "mydb",
        collectionName: "items",
        ConnectionStringSetting = "CosmosDBConnection")] IAsyncCollector<dynamic> cosmosOutput,
    ILogger log)
{
    string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
    
    // Write to queue
    await queueOutput.AddAsync(requestBody);
    
    // Write to blob
    await blobOutput.WriteAsync(requestBody);
    
    // Write to Cosmos DB
    await cosmosOutput.AddAsync(new { data = requestBody, timestamp = DateTime.UtcNow });
}
```

## Durable Functions

Stateful functions for complex orchestrations.

### Function Chaining

```csharp
[FunctionName("ChainOrchestrator")]
public static async Task<object> RunOrchestrator(
    [OrchestrationTrigger] IDurableOrchestrationContext context)
{
    var x = await context.CallActivityAsync<object>("F1", null);
    var y = await context.CallActivityAsync<object>("F2", x);
    var z = await context.CallActivityAsync<object>("F3", y);
    return z;
}

[FunctionName("F1")]
public static string Activity1([ActivityTrigger] string input)
{
    return "Step 1 completed";
}
```

### Fan-Out/Fan-In

```csharp
[FunctionName("FanOutFanIn")]
public static async Task<long> Run(
    [OrchestrationTrigger] IDurableOrchestrationContext context)
{
    var parallelTasks = new List<Task<int>>();
    
    // Fan out
    for (int i = 0; i < 10; i++)
    {
        Task<int> task = context.CallActivityAsync<int>("ProcessItem", i);
        parallelTasks.Add(task);
    }
    
    // Fan in
    await Task.WhenAll(parallelTasks);
    
    // Aggregate results
    var sum = parallelTasks.Sum(t => t.Result);
    return sum;
}

[FunctionName("ProcessItem")]
public static int ProcessItem([ActivityTrigger] int itemNumber, ILogger log)
{
    log.LogInformation($"Processing item {itemNumber}");
    return itemNumber * 2;
}
```

### Human Interaction Pattern

```csharp
[FunctionName("ApprovalWorkflow")]
public static async Task Run(
    [OrchestrationTrigger] IDurableOrchestrationContext context)
{
    var request = context.GetInput<ApprovalRequest>();
    
    // Send approval request
    await context.CallActivityAsync("SendApprovalRequest", request);
    
    // Wait for approval (with timeout)
    using (var timeoutCts = new CancellationTokenSource())
    {
        DateTime expiration = context.CurrentUtcDateTime.AddHours(72);
        Task timeoutTask = context.CreateTimer(expiration, timeoutCts.Token);
        Task<bool> approvalTask = context.WaitForExternalEvent<bool>("ApprovalEvent");
        
        Task winner = await Task.WhenAny(approvalTask, timeoutTask);
        
        if (winner == approvalTask)
        {
            timeoutCts.Cancel();
            bool approved = approvalTask.Result;
            
            if (approved)
            {
                await context.CallActivityAsync("ProcessApproval", request);
            }
            else
            {
                await context.CallActivityAsync("SendRejectionNotification", request);
            }
        }
        else
        {
            await context.CallActivityAsync("EscalateApproval", request);
        }
    }
}
```

## Performance Optimization

### Connection Pooling

```csharp
// ❌ Don't create new instances per invocation
public static async Task BadExample([TimerTrigger("0 */5 * * * *")] TimerInfo timer)
{
    using (var client = new HttpClient())  // Bad: creates new connection
    {
        await client.GetAsync("https://api.example.com");
    }
}

// ✅ Use static client
private static readonly HttpClient httpClient = new HttpClient();

public static async Task GoodExample([TimerTrigger("0 */5 * * * *")] TimerInfo timer)
{
    await httpClient.GetAsync("https://api.example.com");  // Good: reuses connection
}
```

### Async/Await Properly

```csharp
// ✅ Good: Proper async
[FunctionName("AsyncFunction")]
public static async Task<IActionResult> Run(
    [HttpTrigger(AuthorizationLevel.Function, "get")] HttpRequest req,
    [Blob("container/file.txt")] string blobContent,
    [CosmosDB("db", "collection", Connection = "CosmosDB")] IAsyncCollector<dynamic> output)
{
    var data = JsonConvert.DeserializeObject<MyData>(blobContent);
    await output.AddAsync(data);
    return new OkResult();
}
```

### Batch Processing

```csharp
[FunctionName("BatchProcessor")]
public static async Task Run(
    [QueueTrigger("batch-queue", Connection = "Storage")] string[] messages,
    ILogger log)
{
    log.LogInformation($"Processing batch of {messages.Length} messages");
    
    var tasks = messages.Select(async msg =>
    {
        await ProcessMessageAsync(msg);
    });
    
    await Task.WhenAll(tasks);
}
```

## Security Best Practices

### Using Managed Identity

```csharp
[FunctionName("ManagedIdentityExample")]
public static async Task Run(
    [HttpTrigger(AuthorizationLevel.Function)] HttpRequest req,
    ILogger log)
{
    var credential = new DefaultAzureCredential();
    
    // Access Key Vault
    var keyVaultClient = new SecretClient(
        new Uri("https://myvault.vault.azure.net/"),
        credential
    );
    
    var secret = await keyVaultClient.GetSecretAsync("my-secret");
    
    // Access Blob Storage
    var blobServiceClient = new BlobServiceClient(
        new Uri("https://mystorage.blob.core.windows.net/"),
        credential
    );
}
```

### API Key Validation

```csharp
[FunctionName("SecureFunction")]
public static async Task<IActionResult> Run(
    [HttpTrigger(AuthorizationLevel.Function, "get", "post")] HttpRequest req,
    ILogger log)
{
    // Validate API key from header
    if (!req.Headers.TryGetValue("X-API-Key", out var apiKey) ||
        apiKey != Environment.GetEnvironmentVariable("VALID_API_KEY"))
    {
        return new UnauthorizedResult();
    }
    
    // Process request
    return new OkObjectResult("Authorized");
}
```

## Monitoring and Debugging

### Application Insights Integration

```csharp
[FunctionName("TrackedFunction")]
public static async Task Run(
    [HttpTrigger(AuthorizationLevel.Function)] HttpRequest req,
    ILogger log)
{
    var telemetryClient = new TelemetryClient();
    
    using (var operation = telemetryClient.StartOperation<RequestTelemetry>("CustomOperation"))
    {
        telemetryClient.TrackEvent("CustomEvent", new Dictionary<string, string>
        {
            { "userId", req.Query["userId"] },
            { "timestamp", DateTime.UtcNow.ToString() }
        });
        
        try
        {
            await ProcessRequestAsync(req);
            operation.Telemetry.Success = true;
        }
        catch (Exception ex)
        {
            telemetryClient.TrackException(ex);
            operation.Telemetry.Success = false;
            throw;
        }
    }
}
```

### Structured Logging

```csharp
[FunctionName("StructuredLogging")]
public static void Run(
    [QueueTrigger("myqueue")] string message,
    ILogger log)
{
    log.LogInformation("Processing message {MessageId} at {Timestamp}", 
        message, DateTime.UtcNow);
    
    log.LogMetric("MessageLength", message.Length);
    
    using (log.BeginScope(new Dictionary<string, object>
    {
        ["MessageId"] = message,
        ["ProcessingTime"] = DateTime.UtcNow
    }))
    {
        log.LogInformation("Message processed successfully");
    }
}
```

## Cost Optimization

### Cold Start Mitigation

```json
{
  "version": "2.0",
  "extensions": {
    "http": {
      "routePrefix": "api"
    }
  },
  "functionTimeout": "00:10:00",
  "healthMonitor": {
    "enabled": true,
    "healthCheckInterval": "00:00:10",
    "healthCheckThreshold": 6
  }
}
```

### Execution Plan Selection

| Plan | Use When | Pricing |
|------|----------|---------|
| **Consumption** | Variable load, cost-sensitive | Pay per execution |
| **Premium** | Avoid cold starts, VNet integration | Always-on, higher cost |
| **Dedicated** | Predictable load, existing App Service | App Service plan cost |

## Best Practices

1. **Use dependency injection** for better testability
2. **Implement idempotency** for queue/event triggers
3. **Set appropriate timeouts** (default 5 min, max 10 min)
4. **Use async/await** properly
5. **Leverage static clients** for connections
6. **Monitor with Application Insights**
7. **Use managed identities** instead of connection strings
8. **Implement proper error handling**
9. **Use Durable Functions** for complex workflows
10. **Test locally** with Azure Functions Core Tools

Azure Functions provides powerful serverless capabilities for building event-driven applications with enterprise-grade features and extensive Azure service integration.
