---
id: osi-2
title: OSI Layer Overview and Interaction
type: text
---

## Seven layers summary

- **7. Application**: User interface and network services
- **6. Presentation**: Data formatting, encryption, compression
- **5. Session**: Dialog control and session management
- **4. Transport**: End-to-end communication and reliability
- **3. Network**: Routing and logical addressing
- **2. Data Link**: Node-to-node communication and error detection
- **1. Physical**: Bit transmission over physical medium

## Peer communication

- Each layer communicates with corresponding layer on remote system
- Logical communication between peer layers
- Actual communication flows down local stack, across network, up remote stack
- Headers contain control information for peer layer

## Encapsulation process

- Data flows down stack from application to physical
- Each layer adds header (and sometimes trailer)
- Process called encapsulation or data wrapping
- Headers contain control and addressing information

## Decapsulation process

- Data flows up stack from physical to application
- Each layer removes and processes its header
- Process called decapsulation or data unwrapping
- Headers provide instructions for layer processing

## Protocol data units ( P D Us)

- **Application/Presentation/Session**: Data
- **Transport**: Segments (TCP) or Datagrams (UDP)
- **Network**: Packets
- **Data Link**: Frames
- **Physical**: Bits