---
id: provider-13
title: Microsoft Azure - Overview
type: text
---

# Microsoft Azure - Overview

Microsoft Azure is a comprehensive cloud computing platform offering over 200 products and services for building, deploying, and managing applications across a global network of Microsoft-managed data centers.

## Azure Introduction

Azure was launched in 2010 as Windows Azure and rebranded to Microsoft Azure in 2014. It has become one of the leading cloud platforms alongside AWS and Google Cloud Platform.

### Key Strengths

- **Enterprise Integration**: Seamless integration with Microsoft products (Windows Server, SQL Server, Active Directory, Office 365)
- **Hybrid Cloud**: Strong hybrid cloud capabilities with Azure Arc and Azure Stack
- **Global Presence**: 60+ regions worldwide (more than any cloud provider)
- **Compliance**: 90+ compliance certifications
- **Developer Tools**: Integration with Visual Studio, GitHub, Azure DevOps

## Azure Global Infrastructure

### Regions and Geographies

**Geography**
- Discrete market preserving data residency and compliance boundaries
- Example: United States, Europe, Asia Pacific

**Region**
- Set of data centers within a geography
- Connected through low-latency network
- Example: East US, West Europe, Southeast Asia

**Availability Zones**
- Physically separate locations within a region
- Each zone has independent power, cooling, networking
- Minimum 3 zones in enabled regions
- 99.99% SLA for multi-zone deployments

**Region Pairs**
- Each region paired with another within same geography
- Minimum 300 miles separation
- Sequential updates (one at a time)
- Priority recovery in outages

```plaintext
Examples:
East US ↔ West US
North Europe ↔ West Europe
Southeast Asia ↔ East Asia
```

### Azure Edge Locations

- **Azure CDN**: Content delivery network with 130+ edge locations
- **Azure Front Door**: Global routing and load balancing
- **Azure Stack Edge**: Extend Azure to on-premises edge locations

## Azure Services Overview

### Compute Services

- **Virtual Machines**: IaaS compute on Windows/Linux
- **App Service**: PaaS for web apps and APIs
- **Azure Functions**: Serverless compute
- **Azure Kubernetes Service (AKS)**: Managed Kubernetes
- **Container Instances**: Serverless containers
- **Azure Batch**: Large-scale job scheduling
- **Virtual Machine Scale Sets**: Auto-scaling VM groups

### Storage Services

- **Azure Blob Storage**: Object storage for unstructured data
- **Azure Files**: Managed file shares (SMB, NFS)
- **Azure Queue Storage**: Message queuing
- **Azure Table Storage**: NoSQL key-value store
- **Azure Disk Storage**: Block storage for VMs
- **Azure Data Lake Storage**: Big data analytics storage

### Networking Services

- **Virtual Network (VNet)**: Isolated network in Azure
- **Load Balancer**: Layer 4 load balancing
- **Application Gateway**: Layer 7 load balancing with WAF
- **VPN Gateway**: Site-to-site and point-to-site VPN
- **ExpressRoute**: Dedicated private connection to Azure
- **Azure DNS**: Domain name system hosting
- **Traffic Manager**: DNS-based traffic routing
- **Azure Firewall**: Managed network security

### Database Services

- **Azure SQL Database**: Managed SQL Server
- **Azure Cosmos DB**: Globally distributed NoSQL
- **Azure Database for MySQL**: Managed MySQL
- **Azure Database for PostgreSQL**: Managed PostgreSQL
- **Azure Database for MariaDB**: Managed MariaDB
- **Azure Cache for Redis**: In-memory cache
- **Azure Synapse Analytics**: Data warehouse

### AI and Machine Learning

- **Azure Machine Learning**: End-to-end ML platform
- **Cognitive Services**: Pre-built AI APIs
- **Azure Bot Service**: Intelligent chatbots
- **Azure Databricks**: Apache Spark analytics
- **Azure Cognitive Search**: AI-powered search

### Identity and Security

- **Azure Active Directory**: Identity and access management
- **Azure Key Vault**: Secrets management
- **Azure Security Center**: Unified security management
- **Azure Sentinel**: Cloud-native SIEM
- **Azure DDoS Protection**: DDoS mitigation
- **Azure Bastion**: Secure RDP/SSH access

### Developer Tools

- **Azure DevOps**: CI/CD pipelines, repos, boards
- **GitHub Actions**: Workflow automation
- **Visual Studio Code**: Lightweight IDE
- **Azure CLI**: Command-line interface
- **Azure PowerShell**: PowerShell modules for Azure
- **Azure Cloud Shell**: Browser-based shell

### Management and Governance

- **Azure Portal**: Web-based management interface
- **Azure Resource Manager (ARM)**: Deployment and management
- **Azure Monitor**: Monitoring and diagnostics
- **Azure Policy**: Governance and compliance
- **Azure Blueprints**: Environment templates
- **Azure Cost Management**: Cost tracking and optimization

## Azure Account Structure

```plaintext
Azure Account Hierarchy:

Management Groups
    ├── Subscription 1
    │   ├── Resource Group A
    │   │   ├── Virtual Machine
    │   │   ├── Storage Account
    │   │   └── Virtual Network
    │   └── Resource Group B
    │       ├── Web App
    │       └── SQL Database
    └── Subscription 2
        └── Resource Group C
            └── Resources
```

### Management Groups

- Container for managing access, policy, and compliance
- Support up to 6 levels of depth
- Apply policies across multiple subscriptions

### Subscriptions

- Billing boundary
- Access control boundary
- Resource limits and quotas
- Types: Free, Pay-As-You-Go, Enterprise Agreement, CSP

### Resource Groups

- Logical container for resources
- All resources must be in a resource group
- Resources can interact across groups
- Lifecycle management (delete all resources together)
- RBAC at resource group level
- Cannot be nested

### Resources

- Manageable items in Azure
- Examples: VMs, storage accounts, web apps, databases

## Azure Resource Manager (ARM)

Deployment and management service for Azure.

### ARM Template Example

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "storageAccountName": {
      "type": "string",
      "metadata": {
        "description": "Name of the storage account"
      }
    }
  },
  "resources": [
    {
      "type": "Microsoft.Storage/storageAccounts",
      "apiVersion": "2021-04-01",
      "name": "[parameters('storageAccountName')]",
      "location": "[resourceGroup().location]",
      "sku": {
        "name": "Standard_LRS"
      },
      "kind": "StorageV2",
      "properties": {
        "supportsHttpsTrafficOnly": true
      }
    }
  ]
}
```

### Bicep

Declarative language for ARM templates (simpler syntax).

```bicep
param storageAccountName string
param location string = resourceGroup().location

resource storageAccount 'Microsoft.Storage/storageAccounts@2021-04-01' = {
  name: storageAccountName
  location: location
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'StorageV2'
  properties: {
    supportsHttpsTrafficOnly: true
  }
}
```

## Azure Active Directory (Azure AD)

Microsoft's cloud-based identity and access management service.

### Features

**Identity Management**
- User and group management
- Self-service password reset
- Multi-factor authentication
- Conditional access

**Application Integration**
- Single sign-on (SSO)
- Thousands of pre-integrated SaaS apps
- Custom application integration

**B2B and B2C**
- **Azure AD B2B**: Collaborate with external users
- **Azure AD B2C**: Customer identity management

**Hybrid Identity**
- Azure AD Connect: Sync on-premises AD
- Seamless SSO
- Password hash synchronization or federation

## Azure Pricing

### Pricing Models

**Pay-As-You-Go**
- No upfront costs
- Pay for what you use
- Cancel anytime

**Reserved Instances**
- 1 or 3-year commitment
- Up to 72% savings
- For VMs, SQL Database, Cosmos DB, etc.

**Azure Hybrid Benefit**
- Use existing Windows Server and SQL Server licenses
- Up to 40% savings on VMs
- Up to 55% savings on SQL Database

**Spot VMs**
- Use excess Azure capacity
- Up to 90% discount
- Can be evicted with 30-second notice

### Free Services

**Always Free**
- App Service (10 web apps)
- Functions (1 million requests/month)
- Cosmos DB (25 GB storage, 1000 RU/s)
- Event Grid (100,000 operations/month)

**12 Months Free**
- Virtual Machines (750 hours B1S Linux and Windows)
- Managed Disks (64 GB × 2)
- Blob Storage (5 GB)
- SQL Database (250 GB)

## Azure Support Plans

| Plan | Cost | Scope | Response Time |
|------|------|-------|---------------|
| Basic | Free | Billing support | N/A |
| Developer | $29/month | Dev/test | <8 hours |
| Standard | $100/month | Production | <1 hour (critical) |
| Professional Direct | $1,000/month | Business-critical | <1 hour + advisory |
| Premier | Custom | Enterprise | <15 minutes + TAM |

## Azure Tools and Interfaces

### Azure Portal
- Web-based GUI
- Customizable dashboards
- Resource management
- Monitoring and diagnostics

### Azure CLI
```bash
# Login
az login

# Create resource group
az group create --name myResourceGroup --location eastus

# Create VM
az vm create \
  --resource-group myResourceGroup \
  --name myVM \
  --image UbuntuLTS \
  --admin-username azureuser \
  --generate-ssh-keys
```

### Azure PowerShell
```powershell
# Connect
Connect-AzAccount

# Create resource group
New-AzResourceGroup -Name myResourceGroup -Location EastUS

# Create VM
New-AzVM `
  -ResourceGroupName myResourceGroup `
  -Name myVM `
  -Image UbuntuLTS `
  -Credential (Get-Credential)
```

### Azure Cloud Shell
- Browser-based shell (Bash or PowerShell)
- Pre-installed tools
- 5 GB persistent storage
- No local installation required

## Azure vs AWS Terminology

| Azure | AWS |
|-------|-----|
| Resource Group | Tag |
| Virtual Network | VPC |
| Virtual Machine | EC2 Instance |
| Azure Blob Storage | S3 |
| Azure Files | EFS |
| Azure SQL Database | RDS |
| Azure Cosmos DB | DynamoDB |
| Azure Functions | Lambda |
| Azure Kubernetes Service | EKS |
| App Service | Elastic Beanstalk |
| Application Gateway | ALB |
| Azure Active Directory | IAM |
| ExpressRoute | Direct Connect |

## Best Practices

1. **Use Resource Groups**: Organize resources logically
2. **Naming Convention**: Consistent, descriptive names
3. **Tagging Strategy**: Track costs and ownership
4. **RBAC**: Principle of least privilege
5. **Azure Policy**: Enforce organizational standards
6. **Cost Management**: Set budgets and alerts
7. **Security Center**: Enable for recommendations
8. **Backup Strategy**: Azure Backup for critical resources
9. **High Availability**: Use Availability Zones
10. **Monitoring**: Azure Monitor for all resources

Microsoft Azure offers a comprehensive cloud platform with strong enterprise integration, hybrid capabilities, and global reach, making it an excellent choice for organizations already invested in the Microsoft ecosystem or seeking robust hybrid cloud solutions.
