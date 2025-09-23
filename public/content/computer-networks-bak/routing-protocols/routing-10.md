---
id: routing-10
title: Routing Security and Authentication
type: text
---


## Routing Security Overview

Protecting routing infrastructure from attacks and ensuring authentic routing information exchange.

## Routing Security Threats

**Route Hijacking:**
- Unauthorized route advertisement
- Traffic redirection attacks
- BGP prefix hijacking
- DNS manipulation

**Man-in-the-Middle Attacks:**
- Intercepting routing updates
- Modifying routing information
- False neighbor establishment
- Session hijacking

**Denial of Service:**
- Routing table overflow
- Convergence delay attacks
- Resource exhaustion
- Hello packet flooding

## Authentication Mechanisms

**Password Authentication:**
- Simple shared passwords
- Plain text transmission
- Limited security value
- Easy to compromise

**MD5 Authentication:**
- Hash-based authentication
- Shared secret keys
- Protection against modification
- Vulnerable to dictionary attacks

**SHA Authentication:**
- Stronger cryptographic hash
- Enhanced security over MD5
- Resistance to collision attacks
- Modern recommended approach

## Protocol-Specific Security

**OSPF Security:**
- Area authentication
- Interface authentication
- Cryptographic authentication
- LSA authentication

**BGP Security:**
- TCP MD5 signatures
- Route filtering
- AS path validation
- RPKI implementation

**EIGRP Security:**
- Named authentication
- Key chain management
- Automatic key rotation
- SHA-256 support

## Advanced Security Solutions

**Resource Public Key Infrastructure (RPKI):**
- ROA (Route Origin Authorization)
- Certificate-based validation
- AS number verification
- Prefix origin validation

**BGPsec:**
- Path validation protocol
- Cryptographic signatures
- AS path protection
- End-to-end security

**Route Filtering:**
- Prefix filtering
- AS path filtering
- Community-based filtering
- Maximum prefix limits

## Best Practices

- **Authentication**: Enable on all routing protocols
- **Key Management**: Regular key rotation
- **Monitoring**: Routing anomaly detection
- **Documentation**: Maintain security policies
- **Updates**: Keep software current