---
id: routing-3
title: BGP - Border Gateway Protocol
type: text
---


## B G P overview

BGP is the protocol that powers the internet, enabling routing between different autonomous systems.

## Purpose

- **Inter-domain routing**: Between different organizations
- **Policy-based routing**: Business relationships
- **Path vector protocol**: AS path information
- **Internet backbone**: Core internet routing

## B G P concepts

- **Autonomous System (AS)**: Administrative domain
- **AS Numbers**: 16-bit or 32-bit identifiers
- **BGP Sessions**: TCP connections between peers
- **Path Attributes**: Routing decision factors

## B G P peer types

- **eBGP**: External BGP (between different AS)
- **iBGP**: Internal BGP (within same AS)
- **Route Reflectors**: iBGP scalability
- **Confederations**: AS subdivision

## Path selection process

- **1. Weight**: Cisco proprietary (highest preferred)
- **2. Local Preference**: AS-wide preference
- **3. Origin**: IGP > EGP > Incomplete
- **4. AS Path Length**: Shorter preferred
- **5. MED**: Multi-Exit Discriminator
- **6. Neighbor Type**: eBGP > iBGP
- **7. IGP Metric**: Lowest to BGP next hop

## B G P applications

- Internet service providers
- Enterprise multi-homing
- Content delivery networks
- Cloud service providers