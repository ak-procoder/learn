---
id: security-2
title: Common Network Threats
type: text
---


Passive Attacks:

Eavesdropping/Sniffing:
• Capture and analyze network traffic
• Tools: Wireshark, tcpdump
• Mitigation: Encryption, switched networks

Traffic Analysis:
• Study communication patterns
• Infer sensitive information
• Mitigation: VPNs, traffic padding

Active Attacks:

Man-in-the-Middle (MITM):
• Intercept and modify communications
• ARP spoofing, DNS hijacking
• Mitigation: Certificate validation, encrypted channels

Denial of Service (DoS):
• Volumetric: Bandwidth exhaustion
• Protocol: TCP SYN flood, ping of death
• Application: Slowloris, HTTP flood
• Distributed (DDoS): Botnet-based attacks

Spoofing Attacks:
• IP Spoofing: Fake source addresses
• MAC Spoofing: Duplicate MAC addresses
• DNS Spoofing: Redirect domain queries
• Email Spoofing: Fake sender addresses

Injection Attacks:
• SQL injection
• Command injection
• Cross-site scripting (XSS)