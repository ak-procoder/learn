---
id: osi-10
title: "Layer 2: Wireless Data Link Technologies"
type: text
---


## Wi Fi ( I E E E 802.11)

- **CSMA/CA**: Collision Avoidance instead of detection
- **Hidden node problem**: Stations can't hear each other
- **RTS/CTS**: Request to Send/Clear to Send mechanism
- **Frame types**: Management, control, data frames

## Wi Fi frame structure

- **Frame Control**: 2 bytes with frame type and flags
- **Duration**: 2 bytes for virtual carrier sensing
- **Address fields**: Up to 4 addresses (source, destination, AP, etc.)
- **Sequence Control**: 2 bytes for fragmentation and ordering
- **Data**: Variable length payload
- **FCS**: 4 bytes frame check sequence

## Wi Fi security

- **WEP**: Wired Equivalent Privacy (deprecated, insecure)
- **WPA**: WiFi Protected Access with TKIP
- **WPA2**: Strong security with AES encryption
- **WPA3**: Latest security with enhanced protection
- **Authentication**: Open, shared key, 802.1X

## Other wireless technologies

- **Bluetooth**: Personal Area Network (PAN) technology
- **ZigBee**: Low-power mesh networking for IoT
- **LoRaWAN**: Long-range, low-power WAN technology
- **Cellular**: 3G, 4G LTE, 5G mobile technologies