---
id: intro-17
title: Network Error Detection and Correction
type: text
---


## Sources of errors

- **Thermal noise**: Random signal fluctuations
- **Crosstalk**: Interference between adjacent circuits
- **Impulse noise**: Sudden signal spikes
- **Attenuation**: Signal strength reduction over distance

## Error detection methods

- **Parity bits**: Simple odd/even bit counting
- **Checksums**: Mathematical sum verification
- **Cyclic Redundancy Check (CRC)**: Polynomial-based detection
- **Hash functions**: Message digest algorithms

## Error correction techniques

- **Automatic Repeat Request (ARQ)**: Retransmission on error
- **Forward Error Correction (FEC)**: Redundant data for correction
- **Hamming codes**: Single-bit error correction
- **Reed-Solomon codes**: Multiple-bit error correction

## Practical implementations

- **Ethernet**: CRC-32 for frame checking
- **TCP**: Checksums and sequence numbers
- **WiFi**: Multiple error detection/correction layers
- **Cellular**: Convolutional and turbo codes

## Trade-offs

- **Overhead vs reliability**: More bits for better protection
- **Speed vs accuracy**: Real-time vs error-free transmission
- **Complexity vs performance**: Simple checks vs sophisticated codes
- **Cost vs benefit**: Error rates vs correction costs