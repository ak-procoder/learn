---
id: tcp-5
title: TCP - Reliable Transport
type: text
---


## T C P characteristics

TCP provides reliable, connection-oriented communication with comprehensive error recovery.

## Connection-oriented

- Three-way handshake establishment
- Four-way handshake termination
- Maintains connection state

## Reliability features

- **Sequence Numbers**: Order packets correctly
- **Acknowledgments**: Confirm receipt
- **Retransmission**: Resend lost packets
- **Checksums**: Detect corruption

## Flow control

- **Window Size**: Controls data flow rate
- **Sliding Window**: Efficient data transfer
- **Zero Window**: Stop transmission when buffer full

## Congestion control

- **Slow Start**: Gradually increase sending rate
- **Congestion Avoidance**: Linear increase
- **Fast Retransmit**: Quick loss detection
- **Fast Recovery**: Efficient recovery

## T C P header fields

- Source/Destination ports (16 bits each)
- Sequence number (32 bits)
- Acknowledgment number (32 bits)
- Window size (16 bits)
- **Flags**: SYN, ACK, FIN, RST, PSH, URG

## Common  T C P applications

- HTTP/HTTPS (web browsing)
- FTP (file transfer)
- SMTP (email)
- SSH (secure shell)
- Telnet (remote terminal)