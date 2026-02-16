---
id: provider-20
title: Azure DevOps and Management
type: text
---

# Azure DevOps and Management

Azure provides comprehensive DevOps and management tools to automate software delivery, manage infrastructure, and monitor applications. These services enable continuous integration, continuous deployment, and efficient operations.

## Azure DevOps Services

Comprehensive suite of development tools for planning, developing, delivering, and maintaining software.

### Azure Boards

Agile project management with work item tracking.

**Features:**
- Kanban boards
- Backlogs and sprints
- Customizable work item types
- Dashboards and reporting
- Integration with GitHub

**Work Item Types:**
- Epic → Feature → User Story → Task
- Bug tracking
- Custom types

### Azure Repos

Git repositories for source control.

**Features:**
- Unlimited private Git repos
- Pull requests with code review
- Branch policies
- Git LFS support
- Integration with IDEs

**Branch Policies:**
```plaintext
Required reviewers: 2+ approvals
Build validation: Must pass CI
Comment resolution: All comments resolved
Work item linking: Must link to work item
```

### Azure Pipelines

CI/CD platform supporting any language, platform, and cloud.

**YAML Pipeline Example:**
```yaml
trigger:
  branches:
    include:
    - main
    - develop

pool:
  vmImage: 'ubuntu-latest'

variables:
  buildConfiguration: 'Release'

stages:
- stage: Build
  jobs:
  - job: BuildJob
    steps:
    - task: UseDotNet@2
      inputs:
        version: '6.x'
    
    - task: DotNetCoreCLI@2
      displayName: 'Restore packages'
      inputs:
        command: 'restore'
        projects: '**/*.csproj'
    
    - task: DotNetCoreCLI@2
      displayName: 'Build solution'
      inputs:
        command: 'build'
        projects: '**/*.csproj'
        arguments: '--configuration $(buildConfiguration)'
    
    - task: DotNetCoreCLI@2
      displayName: 'Run tests'
      inputs:
        command: 'test'
        projects: '**/*Tests.csproj'
        arguments: '--configuration $(buildConfiguration) --collect:"XPlat Code Coverage"'
    
    - task: PublishCodeCoverageResults@1
      inputs:
        codeCoverageTool: 'Cobertura'
        summaryFileLocation: '$(Agent.TempDirectory)/**/*coverage.cobertura.xml'

- stage: Deploy
  dependsOn: Build
  condition: and(succeeded(), eq(variables['Build.SourceBranch'], 'refs/heads/main'))
  jobs:
  - deployment: DeployToAzure
    environment: 'production'
    strategy:
      runOnce:
        deploy:
          steps:
          - task: AzureWebApp@1
            inputs:
              azureSubscription: 'MyAzureSubscription'
              appName: 'myWebApp'
              package: '$(Pipeline.Workspace)/**/*.zip'
```

**Pipeline Features:**
- Multi-stage pipelines
- Deployment gates and approvals
- Service connections
- Secret management
- Parallel jobs
- Matrix builds
- Container jobs

### Azure Test Plans

Manual and exploratory testing tools.

**Features:**
- Test case management
- Exploratory testing
- Test execution
- Progress tracking
- Traceability

### Azure Artifacts

Package management for NuGet, npm, Maven, Python, and Universal packages.

```bash
# Create feed
az artifacts universal publish \
  --organization https://dev.azure.com/myorg \
  --project myproject \
  --feed myfeed \
  --name mypackage \
  --version 1.0.0 \
  --path ./package

# Restore packages
az artifacts universal download \
  --organization https://dev.azure.com/myorg \
  --project myproject \
  --feed myfeed \
  --name mypackage \
  --version 1.0.0 \
  --path ./download
```

## GitHub Actions for Azure

Automate workflows directly from GitHub.

### Example Workflow

```yaml
name: Deploy to Azure

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

env:
  AZURE_WEBAPP_NAME: myapp
  AZURE_WEBAPP_PACKAGE_PATH: '.'
  NODE_VERSION: '16.x'

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Set up Node.js
      uses: actions/setup-node@v2
      with:
        node-version: ${{ env.NODE_VERSION }}
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build
      run: npm run build --if-present
    
    - name: Run tests
      run: npm test
    
    - name: Login to Azure
      uses: azure/login@v1
      with:
        creds: ${{ secrets.AZURE_CREDENTIALS }}
    
    - name: Deploy to Azure Web App
      uses: azure/webapps-deploy@v2
      with:
        app-name: ${{ env.AZURE_WEBAPP_NAME }}
        package: ${{ env.AZURE_WEBAPP_PACKAGE_PATH }}
    
    - name: Logout from Azure
      run: az logout
```

## Azure Resource Manager (ARM) Templates

Infrastructure as Code for Azure resources.

### ARM Template Structure

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "location": {
      "type": "string",
      "defaultValue": "[resourceGroup().location]"
    },
    "vmSize": {
      "type": "string",
      "defaultValue": "Standard_D2s_v3",
      "allowedValues": [
        "Standard_D2s_v3",
        "Standard_D4s_v3"
      ]
    }
  },
  "variables": {
    "vnetName": "myVNet",
    "subnetName": "mySubnet",
    "nicName": "myNIC",
    "vmName": "myVM"
  },
  "resources": [
    {
      "type": "Microsoft.Network/virtualNetworks",
      "apiVersion": "2021-02-01",
      "name": "[variables('vnetName')]",
      "location": "[parameters('location')]",
      "properties": {
        "addressSpace": {
          "addressPrefixes": [
            "10.0.0.0/16"
          ]
        },
        "subnets": [
          {
            "name": "[variables('subnetName')]",
            "properties": {
              "addressPrefix": "10.0.1.0/24"
            }
          }
        ]
      }
    }
  ],
  "outputs": {
    "vnetId": {
      "type": "string",
      "value": "[resourceId('Microsoft.Network/virtualNetworks', variables('vnetName'))]"
    }
  }
}
```

### Deploying ARM Templates

```bash
# Create deployment
az deployment group create \
  --resource-group myResourceGroup \
  --template-file azuredeploy.json \
  --parameters azuredeploy.parameters.json

# Validate template
az deployment group validate \
  --resource-group myResourceGroup \
  --template-file azuredeploy.json

# What-if deployment
az deployment group what-if \
  --resource-group myResourceGroup \
  --template-file azuredeploy.json
```

## Bicep

Domain-specific language for deploying Azure resources (simpler than ARM).

### Bicep Example

```bicep
@description('Location for all resources')
param location string = resourceGroup().location

@description('VM size')
@allowed([
  'Standard_D2s_v3'
  'Standard_D4s_v3'
])
param vmSize string = 'Standard_D2s_v3'

@description('Admin username')
param adminUsername string

@secure()
@description('Admin password')
param adminPassword string

var vnetName = 'myVNet'
var subnetName = 'mySubnet'
var nicName = 'myNIC'
var vmName = 'myVM'
var osDiskName = '${vmName}-osdisk'

resource vnet 'Microsoft.Network/virtualNetworks@2021-02-01' = {
  name: vnetName
  location: location
  properties: {
    addressSpace: {
      addressPrefixes: [
        '10.0.0.0/16'
      ]
    }
    subnets: [
      {
        name: subnetName
        properties: {
          addressPrefix: '10.0.1.0/24'
        }
      }
    ]
  }
}

resource nic 'Microsoft.Network/networkInterfaces@2021-02-01' = {
  name: nicName
  location: location
  properties: {
    ipConfigurations: [
      {
        name: 'ipconfig1'
        properties: {
          subnet: {
            id: vnet.properties.subnets[0].id
          }
          privateIPAllocationMethod: 'Dynamic'
        }
      }
    ]
  }
}

resource vm 'Microsoft.Compute/virtualMachines@2021-03-01' = {
  name: vmName
  location: location
  properties: {
    hardwareProfile: {
      vmSize: vmSize
    }
    osProfile: {
      computerName: vmName
      adminUsername: adminUsername
      adminPassword: adminPassword
    }
    storageProfile: {
      imageReference: {
        publisher: 'Canonical'
        offer: 'UbuntuServer'
        sku: '18.04-LTS'
        version: 'latest'
      }
      osDisk: {
        name: osDiskName
        createOption: 'FromImage'
        managedDisk: {
          storageAccountType: 'Premium_LRS'
        }
      }
    }
    networkProfile: {
      networkInterfaces: [
        {
          id: nic.id
        }
      ]
    }
  }
}

output vmId string = vm.id
output vnetId string = vnet.id
```

```bash
# Deploy Bicep
az deployment group create \
  --resource-group myResourceGroup \
  --template-file main.bicep \
  --parameters adminUsername=azureuser adminPassword='P@ssw0rd123!'
```

## Terraform on Azure

Popular third-party IaC tool.

### Terraform Configuration

```hcf
terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
  }
}

provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "example" {
  name     = "myResourceGroup"
  location = "East US"
}

resource "azurerm_virtual_network" "example" {
  name                = "myVNet"
  address_space       = ["10.0.0.0/16"]
  location            = azurerm_resource_group.example.location
  resource_group_name = azurerm_resource_group.example.name
}

resource "azurerm_subnet" "example" {
  name                 = "mySubnet"
  resource_group_name  = azurerm_resource_group.example.name
  virtual_network_name = azurerm_virtual_network.example.name
  address_prefixes     = ["10.0.1.0/24"]
}

resource "azurerm_network_interface" "example" {
  name                = "myNIC"
  location            = azurerm_resource_group.example.location
  resource_group_name = azurerm_resource_group.example.name

  ip_configuration {
    name                          = "internal"
    subnet_id                     = azurerm_subnet.example.id
    private_ip_address_allocation = "Dynamic"
  }
}

resource "azurerm_linux_virtual_machine" "example" {
  name                = "myVM"
  resource_group_name = azurerm_resource_group.example.name
  location            = azurerm_resource_group.example.location
  size                = "Standard_D2s_v3"
  admin_username      = "azureuser"

  network_interface_ids = [
    azurerm_network_interface.example.id,
  ]

  admin_ssh_key {
    username   = "azureuser"
    public_key = file("~/.ssh/id_rsa.pub")
  }

  os_disk {
    caching              = "ReadWrite"
    storage_account_type = "Premium_LRS"
  }

  source_image_reference {
    publisher = "Canonical"
    offer     = "UbuntuServer"
    sku       = "18.04-LTS"
    version   = "latest"
  }
}
```

## Azure Monitor

Comprehensive monitoring solution for applications and infrastructure.

### Components

**Metrics**
- Time-series data
- Near real-time
- Auto-collected for Azure resources
- Custom metrics

**Logs**
- Log Analytics workspace
- KQL (Kusto Query Language)
- Retention policies
- Cross-resource queries

**Application Insights**
- Application performance monitoring
- Distributed tracing
- Live metrics
- Availability tests
- Usage analytics

### KQL Query Examples

```kusto
// CPU usage over time
AzureMetrics
| where ResourceProvider == "MICROSOFT.COMPUTE"
| where MetricName == "Percentage CPU"
| summarize avg(Average) by bin(TimeGenerated, 5m)
| render timechart

// Failed requests
requests
| where success == false
| summarize FailedRequests=count() by operation_Name
| order by FailedRequests desc
| take 10

// Application exceptions
exceptions
| where timestamp > ago(1d)
| summarize ExceptionCount=count() by type
| order by ExceptionCount desc
```

### Alerts

```bash
# Create metric alert
az monitor metrics alert create \
  --name HighCPU \
  --resource-group myResourceGroup \
  --scopes /subscriptions/.../resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/myVM \
  --condition "avg Percentage CPU > 80" \
  --window-size 5m \
  --evaluation-frequency 1m \
  --action email user@example.com
```

### Application Insights Integration

```csharp
// .NET Core
using Microsoft.ApplicationInsights;

public class HomeController : Controller
{
    private readonly TelemetryClient _telemetry;

    public HomeController(TelemetryClient telemetry)
    {
        _telemetry = telemetry;
    }

    public IActionResult Index()
    {
        _telemetry.TrackEvent("PageView", new Dictionary<string, string>
        {
            { "Page", "Home" },
            { "User", User.Identity.Name }
        });

        return View();
    }
}
```

## Azure Automation

Automate frequent, time-consuming tasks.

### Runbooks

```powershell
# PowerShell Runbook
param(
    [Parameter(Mandatory=$true)]
    [string]$ResourceGroupName
)

try {
    # Authenticate with managed identity
    Connect-AzAccount -Identity

    # Get all stopped VMs
    $vms = Get-AzVM -ResourceGroupName $ResourceGroupName -Status | 
           Where-Object {$_.PowerState -eq 'VM deallocated'}

    foreach ($vm in $vms) {
        Write-Output "Starting VM: $($vm.Name)"
        Start-AzVM -ResourceGroupName $ResourceGroupName -Name $vm.Name
    }
}
catch {
    Write-Error "An error occurred: $_"
    throw
}
```

### Update Management

- Assess update compliance
- Schedule update deployments
- View deployment results
- Windows and Linux support

## Azure Policy

Governance tool for enforcing organizational standards.

### Policy Definition

```json
{
  "properties": {
    "displayName": "Require tag on resources",
    "policyType": "Custom",
    "mode": "Indexed",
    "description": "Enforces existence of a tag. Does not apply to resource groups.",
    "parameters": {
      "tagName": {
        "type": "String",
        "metadata": {
          "displayName": "Tag Name",
          "description": "Name of the tag, such as 'Environment'"
        }
      }
    },
    "policyRule": {
      "if": {
        "field": "[concat('tags[', parameters('tagName'), ']')]",
        "exists": "false"
      },
      "then": {
        "effect": "deny"
      }
    }
  }
}
```

## Best Practices

1. **CI/CD pipelines**: Automate builds and deployments
2. **Infrastructure as Code**: Version control infrastructure
3. **GitOps**: Git as single source of truth
4. **Automated testing**: Unit, integration, performance tests
5. **Blue-green deployments**: Zero-downtime deployments
6. **Feature flags**: Decouple deployment from release
7. **Monitoring**: Comprehensive observability
8. **Alerting**: Proactive issue detection
9. **Log aggregation**: Centralized logging
10. **Security scanning**: Automated vulnerability detection
11. **Cost management**: Track and optimize costs
12. **Documentation**: Keep infrastructure documented
13. **Backup automation**: Regular automated backups
14. **Disaster recovery**: Test DR procedures
15. **Policy enforcement**: Use Azure Policy for compliance

Azure DevOps and management tools provide end-to-end capabilities for modern software delivery, from planning and development to deployment and operations, enabling organizations to deliver value faster and more reliably.
