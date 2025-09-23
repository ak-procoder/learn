---
id: intro-18
title: Network Flow Control Mechanisms
type: text
---


## Flow control purpose

- Prevent buffer overflow at receiver
- Match sender rate to receiver capacity
- Optimize network utilization
- Ensure reliable data delivery

## Stop-and-wait protocol

- **Mechanism**: Send one frame, wait for acknowledgment
- **Advantages**: Simple implementation, guaranteed delivery
- **Disadvantages**: Inefficient for high-latency networks
- **Applications**: Simple systems, error-prone channels

## Sliding window protocol

- **Mechanism**: Multiple unacknowledged frames allowed
- **Window size**: Number of outstanding frames
- **Advantages**: Better channel utilization, pipelining
- **Variants**: Go-Back-N, Selective Repeat

## Congestion control

- **Purpose**: Prevent network overload and collapse
- **Symptoms**: Packet loss, increased latency, timeout
- **Techniques**: Rate limiting, traffic shaping, admission control
- **Examples**: TCP congestion control, QoS mechanisms

## Modern approaches

- **Credit-based flow control**: Explicit buffer management
- **Rate-based flow control**: Transmission rate regulation
- **Priority-based flow control**: Different treatment for traffic types
- **Adaptive algorithms**: Dynamic adjustment to network conditions