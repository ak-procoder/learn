---
id: provider-19
title: Azure Security and Identity
type: text
---

# Azure Security and Identity

Azure provides comprehensive security and identity management services to protect applications, data, and infrastructure. These services help organizations implement defense-in-depth strategies and maintain compliance with regulatory requirements.

## Azure Active Directory (Azure AD)

Cloud-based identity and access management service.

### Core Features

**User Management**
- Cloud-only identities
- Synchronized on-premises identities
- Guest users (B2B)
- Self-service password reset
- Multi-factor authentication

**Application Integration**
- Single sign-on (SSO)
- 4000+ pre-integrated SaaS applications
- Custom application integration
- OAuth 2.0, OpenID Connect, SAML support

### Azure AD Editions

| Feature | Free | Premium P1 | Premium P2 |
|---------|------|------------|------------|
| User/group management | ✓ | ✓ | ✓ |
| SSO (10 apps) | ✓ | ✓ | ✓ |
| MFA | ✓ | ✓ | ✓ |
| Conditional Access | | ✓ | ✓ |
| Identity Protection | | | ✓ |
| PIM | | | ✓ |
| Access Reviews | | | ✓ |

### Multi-Factor Authentication (MFA)

**Authentication Methods:**
- Microsoft Authenticator app
- SMS text message
- Phone call
- OATH hardware tokens
- FIDO2 security keys

```bash
# Enable MFA for a user
az ad user update \
  --id user@domain.com \
  --force-change-password-next-sign-in true

# Configure MFA settings (via portal)
```

### Conditional Access

Policy-based access control.

**Policy Components:**
- **Users**: Who the policy applies to
- **Cloud apps**: Which applications
- **Conditions**: When to enforce
- **Access controls**: What to enforce

**Example Policy:**
```plaintext
If:
  User: All users
  Cloud app: Office 365
  Condition: Sign-in from untrusted location
Then:
  Require: MFA + Compliant device
```

**Common Conditions:**
- Sign-in risk
- Device platform (iOS, Android, Windows)
- Location
- Client apps
- Device state

### Azure AD B2B (Business-to-Business)

Collaborate with external users.

**Features:**
- Invite external users
- Guest access to resources
- Self-service sign-up
- No separate directory needed

```bash
# Invite guest user
az ad user create \
  --display-name "John External" \
  --user-principal-name john@external.com \
  --user-type Guest \
  --invitation-message-text "Welcome to our tenant"
```

### Azure AD B2C (Business-to-Consumer)

Customer identity and access management.

**Features:**
- Support millions of users
- Social identity providers (Google, Facebook, Microsoft)
- Custom branding
- Self-service account management
- User journeys and policies

**User Flow Example:**
```plaintext
Sign-up Flow:
1. User enters email
2. Email verification code sent
3. User creates password
4. User provides profile info
5. Account created
```

### Azure AD Domain Services

Managed domain services (LDAP, Kerberos, NTLM).

**Features:**
- Compatible with Windows Server AD
- No domain controllers to manage
- Synchronizes from Azure AD
- Support legacy applications

**Use Cases:**
- Lift-and-shift of legacy apps
- LDAP-dependent applications
- Kerberos/NTLM authentication

### Managed Identities

Automatic identity management for Azure resources.

**System-Assigned Managed Identity**
```bash
# Enable for VM
az vm identity assign \
  --resource-group myResourceGroup \
  --name myVM

# Get access token (from within VM)
curl 'http://169.254.169.254/metadata/identity/oauth2/token?api-version=2018-02-01&resource=https://management.azure.com/' \
  -H Metadata:true
```

**User-Assigned Managed Identity**
```bash
# Create identity
az identity create \
  --resource-group myResourceGroup \
  --name myIdentity

# Assign to VM
az vm identity assign \
  --resource-group myResourceGroup \
  --name myVM \
  --identities myIdentity
```

**Code Example (C#):**
```csharp
using Azure.Identity;
using Azure.Security.KeyVault.Secrets;

var client = new SecretClient(
    new Uri("https://myvault.vault.azure.net/"),
    new DefaultAzureCredential());

KeyVaultSecret secret = await client.GetSecretAsync("MySecret");
Console.WriteLine(secret.Value);
```

## Azure Key Vault

Secure storage for secrets, keys, and certificates.

### Features

**Secrets Management**
- Store connection strings, passwords, API keys
- Versioning
- Soft delete and purge protection

**Key Management**
- Cryptographic keys for encryption/decryption
- Hardware Security Module (HSM) backed
- Key rotation

**Certificate Management**
- SSL/TLS certificates
- Automatic renewal
- Integration with CAs

### Key Vault Operations

```bash
# Create Key Vault
az keyvault create \
  --resource-group myResourceGroup \
  --name myKeyVault \
  --location eastus \
  --enable-soft-delete \
  --enable-purge-protection

# Set secret
az keyvault secret set \
  --vault-name myKeyVault \
  --name "DatabasePassword" \
  --value "P@ssw0rd123!"

# Get secret
az keyvault secret show \
  --vault-name myKeyVault \
  --name "DatabasePassword"

# Create key
az keyvault key create \
  --vault-name myKeyVault \
  --name "MyKey" \
  --protection software

# Import certificate
az keyvault certificate import \
  --vault-name myKeyVault \
  --name "MyCert" \
  --file certificate.pfx \
  --password "CertPassword"
```

### Access Policies

```bash
# Grant access to user
az keyvault set-policy \
  --name myKeyVault \
  --upn user@domain.com \
  --secret-permissions get list set delete

# Grant access to managed identity
az keyvault set-policy \
  --name myKeyVault \
  --object-id <managed-identity-id> \
  --secret-permissions get
```

## Azure Security Center

Unified security management and advanced threat protection.

### Features

**Secure Score**
- Security posture assessment
- Improvement recommendations
- Track over time

**Security Recommendations**
- Apply system updates
- Enable encryption
- Configure network security groups
- Enable MFA

**Advanced Threat Protection**
- Detect unusual activity
- Malware detection
- Network attack detection
- Integration with Microsoft Defender

### Security Tiers

**Free Tier**
- Continuous assessment
- Security recommendations
- Azure resources only

**Standard Tier** (now Defender plans)
- Advanced threat detection
- Just-in-time VM access
- Adaptive application controls
- File integrity monitoring
- Support for hybrid cloud

### Microsoft Defender for Cloud

Evolution of Security Center with multiple workload-specific plans:

- **Defender for Servers**: VM protection
- **Defender for App Service**: Web app protection
- **Defender for Storage**: Storage threat protection
- **Defender for SQL**: Database security
- **Defender for Kubernetes**: AKS security
- **Defender for Container Registries**: Image scanning
- **Defender for Key Vault**: Key vault monitoring

```bash
# Enable Defender for cloud subscription
az security pricing create \
  --name VirtualMachines \
  --tier Standard
```

## Azure Sentinel

Cloud-native Security Information and Event Management (SIEM).

### Key Capabilities

**Data Collection**
- Collect data from all users, devices, applications
- On-premises and multi-cloud
- 100+ built-in connectors

**Threat Detection**
- AI and machine learning
- Built-in analytics rules
- Custom detection rules

**Investigation**
- Investigation graph
- Entity behavior analytics
- Notebook integration (Jupyter)

**Response**
- Automated workflows (Logic Apps)
- Playbooks for remediation
- Integration with SOAR platforms

### Sentinel Architecture

```plaintext
Data Sources
  ├── Azure Services
  ├── Microsoft 365
  ├── Third-party services
  └── On-premises systems
        ↓
Azure Sentinel (Log Analytics Workspace)
  ├── Data Connectors
  ├── Analytics Rules
  ├── Workbooks
  ├── Hunting Queries
  └── Playbooks
```

### KQL Queries

```kusto
// Failed sign-in attempts
SigninLogs
| where ResultType != 0
| where TimeGenerated > ago(1h)
| summarize FailedAttempts=count() by UserDisplayName
| where FailedAttempts > 5
| order by FailedAttempts desc

// Suspicious file downloads
let SuspiciousExtensions = dynamic([".exe", ".dll", ".ps1", ".bat"]);
FileAccessEvent
| where ActionType == "Download"
| where FileName has_any (SuspiciousExtensions)
| where InitiatingProcessAccountName != "SYSTEM"
```

## Azure DDoS Protection

Defense against Distributed Denial of Service attacks.

### Tiers

**Basic**
- Automatically enabled
- Free for all Azure customers
- Always-on monitoring
- Real-time mitigation

**Standard**
- Additional mitigation features
- Adaptive tuning
- Attack analytics and metrics
- DDoS Rapid Response support
- Cost protection

```bash
# Create DDoS protection plan
az network ddos-protection create \
  --resource-group myResourceGroup \
  --name myDdosPlan

# Associate with VNet
az network vnet update \
  --resource-group myResourceGroup \
  --name myVNet \
  --ddos-protection-plan myDdosPlan \
  --enable-ddos-protection true
```

## Azure Firewall

Managed, cloud-based network security service.

### Features

**Stateful Firewall**
- Application and network-level filtering
- Built-in high availability
- Unrestricted cloud scalability

**Threat Intelligence**
- Microsoft Cyber Security feed
- Alert and deny traffic from malicious IPs/domains

**Rule Types:**

**Application Rules**
```plaintext
Allow access to:
- *.microsoft.com
- *.azure.com
From: 10.0.1.0/24
```

**Network Rules**
```plaintext
Source: 10.0.1.0/24
Destination: Any
Protocol: TCP, UDP
Port: 80, 443
Action: Allow
```

**NAT Rules**
```plaintext
Destination address: Public IP
Service port: 3389
Translate to: 10.0.1.4:3389
```

```bash
# Create Azure Firewall
az network firewall create \
  --resource-group myResourceGroup \
  --name myFirewall \
  --location eastus

# Create public IP for firewall
az network public-ip create \
  --resource-group myResourceGroup \
  --name myFirewallIP \
  --allocation-method Static \
  --sku Standard

# Configure firewall
az network firewall ip-config create \
  --firewall-name myFirewall \
  --resource-group myResourceGroup \
  --name myFirewallConfig \
  --public-ip-address myFirewallIP \
  --vnet-name myVNet
```

## Azure Information Protection

Classify and protect documents and emails.

### Classification Labels

**Sensitivity Labels:**
- Public
- Internal
- Confidential
- Highly Confidential

**Protection Actions:**
- Encryption
- Visual markings (watermarks)
- Access restrictions
- Tracking and revocation

## Best Practices

### Identity
1. **Enable MFA**: For all users, especially admins
2. **Use Conditional Access**: Risk-based access control
3. **Least privilege**: Grant minimum required permissions
4. **Managed identities**: Eliminate credentials in code
5. **Regular access reviews**: Review and revoke unused access

### Security
1. **Security Center**: Enable and monitor recommendations
2. **Just-in-time access**: Limit VM exposure
3. **Network segmentation**: Use NSGs and subnets
4. **Encrypt data**: At rest and in transit
5. **Key Vault**: Store all secrets centrally
6. **Regular updates**: Patch systems promptly
7. **Monitor and alert**: Azure Sentinel for threat detection
8. **Backup**: Regular backups with retention
9. **DDoS protection**: Enable for critical workloads
10. **Compliance**: Use Azure Policy for enforcement

Azure's comprehensive security and identity services provide the tools and capabilities needed to protect cloud resources, manage identities effectively, and maintain regulatory compliance across your organization.
