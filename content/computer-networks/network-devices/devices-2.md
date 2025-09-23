---
id: devices-2
title: Physical Layer Devices - Hubs and Repeaters
type: text
---

## Network Hubs



Hubs are multi-port repeaters that operate at the Physical Layer (Layer 1) of the OSI model. They create a single collision domain for all connected devices.Hubs are multi-port repeaters that operate at the Physical Layer (Layer 1) of the OSI model. They create a single collision domain for all connected devices.



### Hub Characteristics### Hub Characteristics

- **Half-Duplex Communication**: Can either send or receive data, but not both simultaneously- **Half-Duplex Communication**: Can either send or receive data, but not both simultaneously

- **Shared Bandwidth**: All connected devices share the total bandwidth- **Shared Bandwidth**: All connected devices share the total bandwidth

- **Single Collision Domain**: All ports belong to one collision domain- **Single Collision Domain**: All ports belong to one collision domain

- **No Intelligence**: Simply repeats electrical signals without any processing- **No Intelligence**: Simply repeats electrical signals without any processing



### Types of Hubs### Types of Hubs

- **Passive Hubs**: Simple connection points without signal amplification- **Passive Hubs**: Simple connection points without signal amplification

- **Active Hubs**: Amplify and regenerate signals before forwarding- **Active Hubs**: Amplify and regenerate signals before forwarding

- **Intelligent Hubs**: Basic management capabilities and port status monitoring- **Intelligent Hubs**: Basic management capabilities and port status monitoring



## Repeaters## Repeaters



Repeaters amplify and regenerate signals to extend network reach beyond physical medium limitations.Repeaters amplify and regenerate signals to extend network reach beyond physical medium limitations.



### Repeater Functions### Repeater Functions

- **Signal Amplification**: Boost weak signals to original strength- **Signal Amplification**: Boost weak signals to original strength

- **Signal Regeneration**: Clean up distorted signals and timing- **Signal Regeneration**: Clean up distorted signals and timing

- **Distance Extension**: Overcome cable length limitations- **Distance Extension**: Overcome cable length limitations

- **Collision Domain Extension**: Maintain single collision domain across segments- **Collision Domain Extension**: Maintain single collision domain across segments



### Repeater Limitations### Repeater Limitations

- **5-4-3 Rule**: Maximum 5 segments, 4 repeaters, 3 populated segments- **5-4-3 Rule**: Maximum 5 segments, 4 repeaters, 3 populated segments

- **Latency Introduction**: Each repeater adds processing delay- **Latency Introduction**: Each repeater adds processing delay

- **No Collision Isolation**: Cannot separate collision domains- **No Collision Isolation**: Cannot separate collision domains



## Hub vs Switch Comparison## Hub vs Switch Comparison



| Feature | Hub | Switch || Feature | Hub | Switch |

|---------|-----|--------||---------|-----|--------|

| OSI Layer | Layer 1 | Layer 2 || OSI Layer | Layer 1 | Layer 2 |

| Collision Domains | Single | Multiple || Collision Domains | Single | Multiple |

| Bandwidth | Shared | Dedicated per port || Bandwidth | Shared | Dedicated per port |

| Communication | Half-duplex | Full-duplex || Communication | Half-duplex | Full-duplex |

| Intelligence | None | MAC learning || Intelligence | None | MAC learning |



## Modern Relevance## Modern Relevance



While largely obsolete in modern networks, understanding hubs and repeaters is crucial for:While largely obsolete in modern networks, understanding hubs and repeaters is crucial for:

- **Historical Context**: Foundation of Ethernet networking- **Historical Context**: Foundation of Ethernet networking

- **Troubleshooting**: Legacy system maintenance- **Troubleshooting**: Legacy system maintenance

- **Collision Domain Concepts**: Understanding broadcast and collision domains- **Collision Domain Concepts**: Understanding broadcast and collision domains

## M A C address learning

- 1. Receive frame on a port
- 2. Learn source MAC address
- 3. Add MAC-to-port mapping to table
- 4. Forward frame based on destination MAC

## Forwarding decisions

- **Known Unicast**: Forward to specific port
- **Unknown Unicast**: Flood to all ports except source
- **Broadcast**: Forward to all ports except source
- **Multicast**: Forward to registered ports

## Switch types

- **Unmanaged**: Basic plug-and-play operation
- **Managed**: Configuration, VLANs, monitoring
- **Layer 3**: Routing capabilities added

## Advanced features

- **VLANs**: Virtual network segmentation
- **STP**: Spanning Tree Protocol (loop prevention)
- **Port Mirroring**: Traffic analysis
- **QoS**: Quality of Service prioritization
- **PoE**: Power over Ethernet

## Performance metrics

- **Switching Capacity**: Total throughput
- **Forwarding Rate**: Packets per second
- **MAC Address Table Size**: Learning capacity