---
id: osi-19
title: "Layer 4: Port Numbers and Well-Known Services"
type: text
---

## Well-known ports (0-1023)

- **HTTP**: 80 (HyperText Transfer Protocol)
- **HTTPS**: 443 (HTTP Secure)
- **FTP**: 20 (data), 21 (control)
- **SSH**: 22 (Secure Shell)
- **Telnet**: 23 (Terminal Protocol)
- **SMTP**: 25 (Simple Mail Transfer Protocol)
- **DNS**: 53 (Domain Name System)
- **DHCP**: 67 (server), 68 (client)
- **TFTP**: 69 (Trivial File Transfer Protocol)
- **POP3**: 110 (Post Office Protocol)
- **IMAP**: 143 (Internet Message Access Protocol)
- **SNMP**: 161 (Simple Network Management Protocol)

## Registered ports (1024-49151)

- Used by user applications and services
- Assigned by IANA to specific applications
- **Examples**: MySQL (3306), Remote Desktop (3389)
- Available for custom application use

## Dynamic/private ports (49152-65535)

- Used for temporary client connections
- Assigned automatically by operating system
- Also called ephemeral ports
- Released when connection closes

## Port scanning

- Technique to discover open ports on systems
- Security assessment and penetration testing
- **Tools**: Nmap, Netcat, port scanners
- Ethical considerations and legal implications

## Firewall port management

- Allow/deny specific ports and protocols
- Stateful inspection of connections
- Application-layer gateway filtering
- Security through port closure