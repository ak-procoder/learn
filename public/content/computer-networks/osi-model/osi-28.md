---
id: osi-28
title: Quality of Service (QoS) and OSI Layers
type: text
---

## Qo S overview

- Managing network resources to provide different service levels
- Ensuring critical applications receive adequate bandwidth
- Controlling latency, jitter, and packet loss
- Implemented across multiple OSI layers

## Layer 2  Qo S

- **IEEE 802.1p**: Frame priority marking (3 bits)
- 8 priority levels (0-7) in Ethernet frames
- Switch queue management based on priorities
- VLAN tags carry priority information

## Layer 3  Qo S

- **IP ToS (Type of Service)**: 8-bit field in IP header
- **DSCP (Differentiated Services)**: 6-bit marking
- Traffic classification and marking
- Router queue management and scheduling

## Layer 4  Qo S

- Port-based traffic classification
- Application identification by port numbers
- Connection-specific QoS policies
- Flow-based traffic management

## Qo S mechanisms

- **Classification**: Identifying traffic types
- **Marking**: Adding QoS tags to packets
- **Queuing**: Managing transmission order
- **Shaping**: Controlling transmission rate
- **Policing**: Enforcing traffic contracts