---
id: osi-26
title: OSI Model Security Considerations
type: text
---


## Security framework

- **Defense in depth**: Multiple security layers
- Each OSI layer has specific security concerns
- Layer-specific threats and countermeasures
- Comprehensive security requires all-layer approach

## Physical layer security

- Physical access controls to network equipment
- Cable protection and secure conduits
- Electromagnetic emission controls (TEMPEST)
- Environmental monitoring and protection
- **Threats**: Cable tapping, equipment theft, interference

## Data link layer security

- MAC address filtering and port security
- 802.1X authentication for network access
- VLAN segmentation for traffic isolation
- Switch security features and monitoring
- **Threats**: MAC spoofing, ARP poisoning, VLAN hopping

## Network layer security

- IP access control lists (ACLs)
- IPSec for encrypted communications
- Network address translation (NAT)
- Intrusion detection systems (IDS)
- **Threats**: IP spoofing, routing attacks, DoS

## Transport layer security

- SSL/TLS for encrypted communications
- Firewall rules based on ports and protocols
- Connection state monitoring
- Rate limiting and traffic shaping
- **Threats**: Port scanning, TCP hijacking, SYN floods

## Application layer security

- Application-specific authentication
- Input validation and sanitization
- Web application firewalls (WAF)
- Content filtering and malware detection
- **Threats**: SQL injection, XSS, application exploits