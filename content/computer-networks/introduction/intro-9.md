---
id: intro-9
title: Network Performance Metrics
type: text
---

## Bandwidth

- **Definition**: Maximum data transfer rate of a network path
- **Units**: bits per second (bps), bytes per second (Bps)
- **Types**: Theoretical vs actual, upstream vs downstream
- **Factors**: Physical medium, protocol overhead, congestion

## Throughput

- **Definition**: Actual data transfer rate achieved
- **Relationship**: Always less than or equal to bandwidth
- **Measurement**: Application layer data successfully transferred
- **Factors**: Network congestion, protocol efficiency, errors

## Latency

- **Definition**: Time delay for data to travel from source to destination
- **Components**: Propagation, transmission, processing, queuing
- **Units**: Milliseconds (ms) or microseconds (μs)
- **Impact**: Critical for real-time applications

## Jitter

- **Definition**: Variation in latency over time
- **Causes**: Network congestion, routing changes, buffering
- **Impact**: Affects quality of voice and video communications
- **Solutions**: Quality of Service (QoS), traffic shaping

## Packet loss

- **Definition**: Percentage of packets that fail to reach destination
- **Causes**: Network congestion, errors, equipment failure
- **Impact**: Reduces throughput, triggers retransmissions
- **Acceptable levels**: <1% for most applications, <0.1% for voice