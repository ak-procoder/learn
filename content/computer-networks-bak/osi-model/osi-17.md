---
id: osi-17
title: "Layer 4: TCP (Transmission Control Protocol)"
type: text
---


## T C P characteristics

- **Connection-oriented**: Three-way handshake before data transfer
- **Reliable**: Guarantees delivery and correct order
- **Flow control**: Prevents receiver buffer overflow
- **Congestion control**: Prevents network overload
- **Full-duplex**: Simultaneous bidirectional communication
- **Stream-oriented**: Treats data as continuous byte stream

## T C P header structure

- **Source Port**: 16 bits (sending application)
- **Destination Port**: 16 bits (receiving application)
- **Sequence Number**: 32 bits (byte position)
- **Acknowledgment Number**: 32 bits (next expected byte)
- **Window Size**: 16 bits (flow control)
- **Flags**: 8 bits (SYN, ACK, FIN, RST, PSH, URG, ECE, CWR)
- **Checksum**: 16 bits (error detection)
- **Options**: Variable length (up to 40 bytes)

## Three-way handshake

- **Step 1**: Client sends SYN with initial sequence number
- **Step 2**: Server responds with SYN-ACK
- **Step 3**: Client sends ACK to complete connection
- **Purpose**: Synchronize sequence numbers and establish connection

## T C P flow control

- **Window-based**: Receiver advertises available buffer space
- **Sliding window**: Continuous data transmission
- **Zero window**: Receiver requests sender to stop
- **Window scaling**: Support for large windows (>64KB)

## T C P congestion control

- **Slow start**: Exponential window growth
- **Congestion avoidance**: Linear window growth
- **Fast retransmit**: Retransmit on duplicate ACKs
- **Fast recovery**: Avoid slow start after fast retransmit