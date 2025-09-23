---
id: osi-16
title: "Layer 4: Transport Layer - Fundamentals"
type: text
---


## Layer 4 definition

Transport Layer - Provides end-to-end communication services and ensures reliable data delivery between applications.

## Primary functions

- **End-to-end communication**: Application to application
- **Segmentation**: Breaking data into manageable pieces
- **Reassembly**: Reconstructing original data stream
- **Flow control**: Managing transmission rate
- **Error detection and correction**: Ensuring data integrity
- **Multiplexing**: Multiple applications using same network

## Port addressing

- **Port numbers**: 16-bit identifiers (0-65535)
- **Well-known ports**: 0-1023 (system services)
- **Registered ports**: 1024-49151 (user applications)
- **Dynamic/private ports**: 49152-65535 (temporary use)
- **Socket**: IP address + port number combination

## Transport protocols

- **TCP**: Transmission Control Protocol (reliable)
- **UDP**: User Datagram Protocol (unreliable but fast)
- **SCTP**: Stream Control Transmission Protocol
- **DCCP**: Datagram Congestion Control Protocol

## Service types

- **Connection-oriented**: Establish session before data transfer
- **Connectionless**: Send data without session establishment
- **Reliable**: Guarantee delivery and order
- **Unreliable**: Best-effort delivery without guarantees