---
id: osi-9
title: "Layer 2: Switching and VLANs"
type: text
---

## Ethernet switching

- **Store-and-forward**: Receive entire frame before forwarding
- **Cut-through**: Start forwarding as soon as destination known
- **Fragment-free**: Check first 64 bytes for collision fragments
- **MAC address learning**: Build forwarding table dynamically

## Switch operation

- **Learning**: Record source MAC addresses and ports
- **Flooding**: Forward unknown destinations to all ports
- **Forwarding**: Send frames to known destination ports
- **Filtering**: Drop frames destined for same segment
- **Aging**: Remove old entries from MAC address table

## Spanning tree protocol ( S T P)

- **Purpose**: Prevent loops in redundant switched networks
- **Root bridge**: Central reference point for tree calculation
- **Bridge Protocol Data Units (BPDUs)**: STP control messages
- **Port states**: Blocking, listening, learning, forwarding
- **Variants**: STP, RSTP, MSTP

## Virtual  L A Ns ( V L A Ns)

- **Purpose**: Logical segmentation of physical networks
- **Benefits**: Security isolation, broadcast domain control
- **Types**: Port-based, MAC-based, protocol-based
- **VLAN tagging**: IEEE 802.1Q standard

## V L A N implementation

- **Access ports**: Belong to single VLAN (untagged)
- **Trunk ports**: Carry multiple VLANs (tagged)
- **Native VLAN**: Default VLAN for untagged frames
- **Inter-VLAN routing**: Router or layer 3 switch required