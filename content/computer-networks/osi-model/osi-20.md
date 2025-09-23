---
id: osi-20
title: "Layer 5: Session Layer - Dialog Control"
type: text
---

## Session layer definition

Session Layer - Manages dialog control between applications and provides services for organizing and synchronizing data exchange.

## Primary functions

- **Dialog control**: Half-duplex or full-duplex communication
- **Session establishment**: Creating communication sessions
- **Session maintenance**: Managing ongoing sessions
- **Session termination**: Properly closing sessions
- **Synchronization**: Adding checkpoints in data stream
- **Activity management**: Grouping related activities

## Dialog control modes

- **Simplex**: One-way communication only
- **Half-duplex**: Two-way communication, one direction at a time
- **Full-duplex**: Simultaneous two-way communication
- **Dialog separation**: Controlling who can send when

## Synchronization services

- **Minor synchronization**: Regular checkpoints in data
- **Major synchronization**: Activity boundaries
- **Dialog tokens**: Control which party can send
- **Recovery**: Return to last synchronization point

## Session layer examples

- **NetBIOS**: Network Basic Input/Output System
- **RPC**: Remote Procedure Call
- **SQL sessions**: Database connection management
- **SMB**: Server Message Block sessions
- **SSH sessions**: Secure Shell connections

## Modern implementations

- Often combined with application layer
- **Web sessions**: HTTP cookies and session IDs
- **TLS sessions**: Secure communication sessions
- **Database connections**: Connection pooling
- **Video conferencing**: Call establishment and management