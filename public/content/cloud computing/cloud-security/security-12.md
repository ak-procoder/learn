---
id: security-12
title: "Encryption in Transit"
type: text
---

# Encryption in Transit

Encryption in transit protects data as it moves between locations, preventing interception and tampering.

## Why Encrypt in Transit?

**Prevent Eavesdropping**: Network sniffing attacks
**Ensure Integrity**: Detect tampering
**Authentication**: Verify endpoints
**Compliance**: Required by regulations

## TLS/SSL Fundamentals

**TLS (Transport Layer Security)**:
- Successor to SSL
- Current versions: TLS 1.2, TLS 1.3
- Encrypts application data
- Provides authentication

**How TLS Works**:
1. Client initiates connection
2. Server presents certificate
3. Client validates certificate
4. Symmetric key exchange
5. Encrypted communication begins

## HTTPS for Web Traffic

**Configuration**:
- TLS certificate required
- Port 443 (standard)
- Redirects from HTTP
- HSTS headers

**Certificate Options**:
- **DV (Domain Validated)**: Basic, fast
- **OV (Organization Validated)**: Business verification
- **EV (Extended Validation)**: Highest assurance

**Free Certificates**:
- Let's Encrypt
- AWS Certificate Manager
- Azure App Service Managed Certificates

## Cloud Service Encryption

**AWS**:
```
Service          Encryption in Transit
─────────────────────────────────────
S3               HTTPS (SSL/TLS)
RDS              SSL/TLS connections
ELB              SSL/TLS termination
CloudFront       HTTPS to origin
VPN              IPsec encryption
```

**Azure**:
- Storage: HTTPS required option
- SQL Database: Encrypt=True in connection
- VPN Gateway: IPsec/IKE
- ExpressRoute: MACsec encryption

**Google Cloud**:
- Default encryption in transit within GCP
- External: TLS required
- Private Google Access: Encrypted

## VPN Encryption

**Site-to-Site VPN**:
- IPsec protocol
- Tunnel mode encryption
- Perfect Forward Secrecy (PFS)

**Client VPN**:
- OpenVPN
- IKEv2
- WireGuard

## API and Service Communication

**Microservices**:
- mTLS (mutual TLS)
- Service mesh (Istio, Linkerd)
- Certificate-based authentication

**Example (enforce HTTPS)**:
```yaml
# AWS S3 bucket policy
{
  "Effect": "Deny",
  "Action": "s3:*",
  "Resource": "arn:aws:s3:::my-bucket/*",
  "Condition": {
    "Bool": {
      "aws:SecureTransport": "false"
    }
  }
}
```

## Database Connections

**Enforce SSL**:
```sql
-- PostgreSQL
ALTER SYSTEM SET ssl = on;

-- MySQL
REQUIRE SSL;
```

**Connection Strings**:
```
# PostgreSQL
postgresql://user:pass@host/db?sslmode=require

# MySQL
jdbc:mysql://host:3306/db?useSSL=true

# SQL Server
Server=host;Encrypt=True;TrustServerCertificate=False;
```

## mTLS (Mutual TLS)

**Two-Way Authentication**:
- Client authenticates server
- Server authenticates client
- Both present certificates

**Use Cases**:
- Service-to-service communication
- API security
- Zero trust networks
- Kubernetes service mesh

## Best Practices

**Protocol Versions**:
- Use TLS 1.2 minimum
- Prefer TLS 1.3
- Disable SSLv3, TLS 1.0, TLS 1.1

**Cipher Suites**:
- Strong ciphers only
- Disable weak ciphers (RC4, DES)
- Forward secrecy support

**Certificate Management**:
- Use trusted Certificate Authorities
- Automated renewal (Let's Encrypt)
- Short-lived certificates
- Monitor expiration

**Implementation**:
- Enforce HTTPS for all external traffic
- Use HSTS headers
- Certificate pinning for mobile apps
- Enable Perfect Forward Secrecy

**Monitoring**:
- Track TLS versions in use
- Monitor certificate expirations
- Alert on weak cipher usage
- Audit unencrypted connections

## Common Mistakes

- Mixed content (HTTPS loading HTTP resources)
- Self-signed certificates in production
- Weak cipher suites
- Expired certificates
- Missing certificate validation
- Allowing fallback to HTTP

Encryption in transit is critical for protecting data during transmission.
