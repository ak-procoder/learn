import { CourseContent } from '../types/course-types'

export const computerNetworksContent: CourseContent = {
  courseId: 'computer-networks',
  topics: [
    {
      id: 'introduction',
      title: 'Introduction to Computer Networks',
      description: 'Comprehensive overview of computer networking fundamentals',
      duration: '45 min',
      slides: [
        {
          id: 'intro-1',
          title: 'What is a Computer Network?',
          content: {
            "description": "A computer network is a collection of interconnected computing devices that can communicate and share resources. These devices (nodes) include:",
            "device types": [
              "Computers: Desktops, laptops, servers",
              "Mobile Devices: Smartphones, tablets",
              "Network Equipment: Routers, switches, hubs",
              "IoT Devices: Smart sensors, cameras, appliances"
            ],
            "key characteristics": [
              "Shared communication medium",
              "Protocol-based communication",
              "Resource sharing capabilities",
              "Distributed processing power"
            ]
          },
          type: 'text'
        },
        {
          id: 'intro-2',
          title: 'Evolution of Computer Networks',
          content: {
            "1960s - ARPANET": [
              "First packet-switching network",
              "Funded by US Department of Defense",
              "Connected universities and research institutions",
              "Foundation for modern internet"
            ],
            "1970s - Ethernet": [
              "Local area networking",
              "Developed by Xerox",
              "Collision detection protocol",
              "Still widely used today"
            ],
            "1980s - TCP/IP": [
              "Standardized protocols",
              "Transmission Control Protocol",
              "Internet Protocol suite",
              "Enabled global internetworking"
            ],
            "1990s - World Wide Web": [
              "User-friendly internet",
              "HTTP protocol",
              "Web browsers",
              "Commercial internet adoption"
            ]
          },
          type: 'text'
        },
        {
          id: 'intro-3',
          title: 'Network Classifications by Scale',
          content: {
            "Personal Area Network (PAN)": [
              "Range: 1-10 meters",
              "Examples: Bluetooth, USB connections",
              "Use: Personal device connectivity"
            ],
            "Local Area Network (LAN)": [
              "Range: Building or campus",
              "Examples: Office networks, WiFi",
              "High speed, low latency"
            ],
            "Metropolitan Area Network (MAN)": [
              "Range: City-wide coverage",
              "Examples: Cable TV networks, city WiFi",
              "Moderate speed and latency"
            ],
            "Wide Area Network (WAN)": [
              "Range: Country/continent-wide",
              "Examples: Internet, corporate networks",
              "Variable speed, higher latency"
            ],
            "Global Area Network (GAN)": [
              "Range: Worldwide coverage",
              "Examples: Satellite networks",
              "Lower speed, highest latency"
            ]
          },
          type: 'text'
        },
        {
          id: 'intro-4',
          title: 'Network Topologies',
          content: {
            "Physical vs Logical Topology": [
              "Physical: How devices are physically connected",
              "Logical: How data flows through the network"
            ],
            "Bus Topology": [
              "Single cable backbone",
              "All devices connected to main cable",
              "Pros: Simple, cost-effective",
              "Cons: Single point of failure"
            ],
            "Star Topology": [
              "Central hub/switch",
              "All devices connected to center",
              "Pros: Easy to manage, fault tolerant",
              "Cons: Central point dependency"
            ],
            "Ring Topology": [
              "Devices connected in circular fashion",
              "Data travels in one direction",
              "Pros: Equal access, predictable performance",
              "Cons: Single break affects entire network"
            ],
            "Mesh Topology": [
              "Multiple paths between devices",
              "Full mesh: Every device connected to every other",
              "Partial mesh: Some devices have multiple connections",
              "Pros: Highly fault tolerant",
              "Cons: Complex, expensive"
            ]
          },
          type: 'text'
        },
        {
          id: 'intro-5',
          title: 'Network Services and Applications',
          content: {
            "File Sharing": [
              "Network File System (NFS)",
              "Server Message Block (SMB)",
              "File Transfer Protocol (FTP)"
            ],
            "Print Services": [
              "Shared printer access",
              "Print queue management",
              "Remote printing capabilities"
            ],
            "Email Services": [
              "Simple Mail Transfer Protocol (SMTP)",
              "Post Office Protocol (POP3)",
              "Internet Message Access Protocol (IMAP)"
            ],
            "Web Services": [
              "HyperText Transfer Protocol (HTTP/HTTPS)",
              "Web server hosting",
              "Content delivery networks"
            ],
            "Database Services": [
              "Distributed database access",
              "Client-server database architecture",
              "Database replication and synchronization"
            ],
            "Communication Services": [
              "Voice over IP (VoIP)",
              "Video conferencing",
              "Instant messaging",
              "Social networking platforms"
            ]
          },
          type: 'text'
        }
      ]
    },
    {
      id: 'osi-model',
      title: 'OSI Reference Model',
      description: 'Deep dive into the 7-layer OSI model with practical examples',
      duration: '60 min',
      slides: [
        {
          id: 'osi-1',
          title: 'Introduction to the OSI Model',
          content: {
            "overview": "Open Systems Interconnection (OSI) Model - Developed by the International Organization for Standardization (ISO) in 1984 to standardize network communication.",
            "purpose": [
              "Provide a framework for network protocol design",
              "Enable interoperability between different vendors",
              "Simplify network troubleshooting",
              "Facilitate network education and understanding"
            ],
            "key principles": [
              "Layered Architecture: Each layer has specific responsibilities",
              "Abstraction: Upper layers don't need to know lower layer details",
              "Modularity: Changes in one layer don't affect others",
              "Standardization: Common protocols at each layer"
            ],
            "benefits": [
              "Reduces complexity",
              "Enables vendor independence",
              "Promotes innovation",
              "Simplifies troubleshooting"
            ]
          },
          type: 'text'
        },
        {
          id: 'osi-2',
          title: 'Layer 1: Physical Layer',
          content: {
            "description": "Physical Layer - The Foundation",
            "primary functions": [
              "Transmission of raw bit streams",
              "Physical medium specifications",
              "Electrical and mechanical interfaces",
              "Signal encoding and timing"
            ],
            "key concepts": [
              "Bits: Binary data (0s and 1s)",
              "Signaling: How bits are represented physically",
              "Synchronization: Timing coordination",
              "Medium: The physical path for data"
            ],
            "physical media types": [
              "Copper Cables: Twisted pair, coaxial",
              "Fiber Optic: Single-mode, multi-mode",
              "Wireless: Radio waves, microwaves, infrared"
            ],
            "examples": [
              "Ethernet cables (Cat5e, Cat6)",
              "USB ports",
              "WiFi radio signals",
              "Bluetooth connections"
            ],
            "devices": [
              "Hubs, repeaters, cables, connectors"
            ]
          },
          type: 'text'
        },
        {
          id: 'osi-3',
          title: 'Layer 2: Data Link Layer',
          content: {
            "description": "Data Link Layer - Node-to-Node Communication",
            "primary functions": [
              "Frame formation and detection",
              "Error detection and correction",
              "Flow control",
              "Media Access Control (MAC)"
            ],
            "key concepts": [
              "Frames: Data units at this layer",
              "MAC Addresses: Physical device identifiers",
              "Error Detection: CRC, checksums",
              "Flow Control: Preventing buffer overflow"
            ],
            "sub-layers": [
              "LLC (Logical Link Control): Interface with network layer",
              "MAC (Media Access Control): Controls access to medium"
            ],
            "protocols": [
              "Ethernet: Most common LAN protocol",
              "WiFi (802.11): Wireless LAN protocol",
              "PPP: Point-to-Point Protocol",
              "HDLC: High-level Data Link Control"
            ],
            "error detection methods": [
              "Parity bits",
              "Cyclic Redundancy Check (CRC)",
              "Checksums"
            ],
            "devices": [
              "Switches, bridges, network interface cards (NICs)"
            ]
          },
          type: 'text'
        },
        {
          id: 'osi-4',
          title: 'Layer 3: Network Layer',
          content: {
            "description": "Network Layer - End-to-End Routing",
            "primary functions": [
              "Logical addressing (IP addresses)",
              "Path determination and routing",
              "Packet forwarding",
              "Fragmentation and reassembly"
            ],
            "key concepts": [
              "IP Addresses: Logical network identifiers",
              "Routing: Finding best path to destination",
              "Packets: Data units at this layer",
              "Subnetting: Dividing networks into smaller segments"
            ],
            "Internet Protocol (IP)": [
              "IPv4: 32-bit addresses (4.3 billion addresses)",
              "IPv6: 128-bit addresses (virtually unlimited)",
              "Address Classes: A, B, C, D, E",
              "Private vs Public: RFC 1918 private ranges"
            ],
            "routing protocols": [
              "Static Routing: Manually configured routes",
              "RIP: Routing Information Protocol",
              "OSPF: Open Shortest Path First",
              "BGP: Border Gateway Protocol"
            ],
            "other protocols": [
              "ICMP: Internet Control Message Protocol",
              "ARP: Address Resolution Protocol",
              "DHCP: Dynamic Host Configuration Protocol"
            ],
            "devices": [
              "Routers, layer 3 switches"
            ]
          },
          type: 'text'
        },
        {
          id: 'osi-5',
          title: 'Layer 4: Transport Layer',
          content: {
            "description": "Transport Layer - Reliable Data Transfer",
            "primary functions": [
              "End-to-end communication",
              "Segmentation and reassembly",
              "Flow control",
              "Error recovery",
              "Port addressing"
            ],
            "TCP (Transmission Control Protocol)": [
              "Connection-oriented: Establishes session before data transfer",
              "Reliable: Guarantees delivery and order",
              "Flow Control: Prevents receiver overflow",
              "Error Recovery: Retransmits lost packets",
              "Use Cases: Web browsing, email, file transfer"
            ],
            "UDP (User Datagram Protocol)": [
              "Connectionless: No session establishment",
              "Unreliable: No delivery guarantee",
              "Fast: Lower overhead than TCP",
              "Use Cases: Video streaming, online gaming, DNS"
            ],
            "port numbers": [
              "Well-known Ports: 0-1023 (HTTP:80, HTTPS:443, FTP:21)",
              "Registered Ports: 1024-49151",
              "Dynamic Ports: 49152-65535"
            ],
            "TCP features": [
              "Three-way handshake (SYN, SYN-ACK, ACK)",
              "Sequence numbers",
              "Acknowledgments",
              "Window size control",
              "Congestion control"
            ]
          },
          type: 'text'
        },
        {
          id: 'osi-6',
          title: 'Layer 5-7: Session, Presentation, and Application',
          content: {
            "Session Layer (Layer 5)": [
              "Functions: Dialog control, session management",
              "Services: Full-duplex, half-duplex, simplex",
              "Examples: NetBIOS, RPC, SQL sessions",
              "Features: Checkpointing, recovery, synchronization"
            ],
            "Presentation Layer (Layer 6)": [
              "Functions: Data formatting, encryption, compression",
              "Services: Character encoding, data compression",
              "Examples: SSL/TLS, JPEG, MPEG, ASCII, EBCDIC",
              "Features: Data translation, encryption/decryption"
            ],
            "Application Layer (Layer 7)": [
              "Functions: Network service interface for applications",
              "Services: User interface, application protocols",
              "Examples: HTTP, HTTPS, FTP, SMTP, DNS, DHCP"
            ],
            "common application protocols": [
              "HTTP/HTTPS: Web browsing (ports 80/443)",
              "FTP: File transfer (ports 20/21)",
              "SMTP: Email sending (port 25)",
              "POP3/IMAP: Email retrieval (ports 110/143)",
              "DNS: Domain name resolution (port 53)",
              "Telnet: Remote terminal access (port 23)",
              "SSH: Secure remote access (port 22)"
            ],
            "note": "In practical TCP/IP implementations, layers 5-7 are often combined into a single application layer."
          },
          type: 'text'
        },
        {
          id: 'osi-7',
          title: 'OSI Model in Practice',
          content: {
            "sending data (top-down)": [
              "Application: User data created",
              "Presentation: Data formatted/encrypted",
              "Session: Session established",
              "Transport: Segments created (TCP/UDP headers added)",
              "Network: Packets created (IP headers added)",
              "Data Link: Frames created (Ethernet headers added)",
              "Physical: Bits transmitted over medium"
            ],
            "receiving data (bottom-up)": [
              "Physical: Bits received",
              "Data Link: Frame headers processed",
              "Network: Packet headers processed",
              "Transport: Segment headers processed",
              "Session: Session managed",
              "Presentation: Data decrypted/formatted",
              "Application: Data delivered to application"
            ],
            "troubleshooting with OSI model": [
              "Physical Issues: Cable problems, signal interference",
              "Data Link Issues: Switch problems, MAC conflicts",
              "Network Issues: Routing problems, IP conflicts",
              "Transport Issues: Port blocks, firewall rules",
              "Application Issues: Protocol misconfigurations"
            ],
            "real-world example - web browsing": [
              "Application: HTTP request created",
              "Transport: TCP segment with port 80",
              "Network: IP packet with destination address",
              "Data Link: Ethernet frame with MAC addresses",
              "Physical: Electrical signals on cable"
            ]
          },
          type: 'text'
        }
      ]
    },
    {
      id: 'tcp-ip',
      title: 'TCP/IP Protocol Suite',
      description: 'Comprehensive study of internet protocols and addressing',
      duration: '75 min',
      slides: [
        {
          id: 'tcp-1',
          title: 'TCP/IP Model Overview',
          content: {
            "description": "TCP/IP Protocol Suite - The foundation of the internet and most modern networks, developed by DARPA in the 1970s.",
            "TCP/IP vs OSI Model": [
              "Application Layer: Combines OSI layers 5-7",
              "Transport Layer: Equivalent to OSI layer 4",
              "Internet Layer: Equivalent to OSI layer 3",
              "Network Access Layer: Combines OSI layers 1-2"
            ],
            "key advantages": [
              "Proven: Battle-tested on the internet",
              "Scalable: Supports billions of devices",
              "Flexible: Works over various physical networks",
              "Open Standards: Not vendor-specific"
            ],
            "core protocols": [
              "IP: Internet Protocol (addressing and routing)",
              "TCP: Transmission Control Protocol (reliable transport)",
              "UDP: User Datagram Protocol (fast transport)",
              "ICMP: Internet Control Message Protocol (error reporting)",
              "ARP: Address Resolution Protocol (MAC address resolution)"
            ]
          },
          type: 'text'
        },
        {
          id: 'tcp-2',
          title: 'Internet Protocol (IP) Addressing',
          content: {
            "IPv4 addressing": "IPv4 addressing uses 32-bit addresses (4 bytes) in dotted decimal notation (e.g., 192.168.1.1).",
            "address structure": [
              "32-bit addresses (4 bytes)",
              "Dotted decimal notation (e.g., 192.168.1.1)",
              "Network and host portions",
              "Subnet mask defines network/host boundary"
            ],
            "address classes": [
              "Class A: 1.0.0.0 - 126.255.255.255 (16M hosts/network)",
              "Class B: 128.0.0.0 - 191.255.255.255 (65K hosts/network)",
              "Class C: 192.0.0.0 - 223.255.255.255 (254 hosts/network)",
              "Class D: 224.0.0.0 - 239.255.255.255 (Multicast)",
              "Class E: 240.0.0.0 - 255.255.255.255 (Experimental)"
            ],
            "special addresses": [
              "Loopback: 127.0.0.1 (localhost)",
              "Private Networks: 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16",
              "APIPA: 169.254.0.0/16 (Automatic Private IP)",
              "Broadcast: 255.255.255.255 (limited broadcast)"
            ],
            "subnet masks": [
              "Define network and host portions",
              "CIDR notation (e.g., /24 = 255.255.255.0)",
              "Enable subnetting for efficient address use"
            ]
          },
          type: 'text'
        },
        {
          id: 'tcp-3',
          title: 'Subnetting and VLSM',
          content: {
            "subnetting fundamentals": "Subnetting involves dividing a network into smaller, more manageable subnetworks.",
            "why subnet": [
              "Efficient address utilization",
              "Improved network performance",
              "Enhanced security through segmentation",
              "Easier network management"
            ],
            "subnetting process": [
              "1. Determine number of subnets needed",
              "2. Determine hosts per subnet",
              "3. Calculate subnet mask",
              "4. Identify subnet ranges"
            ],
            "example: 192.168.1.0/24 into 4 subnets": [
              "Need 2 bits for 4 subnets (2² = 4)",
              "New mask: /26 (255.255.255.192)",
              "192.168.1.0/26 (hosts: 1-62)",
              "192.168.1.64/26 (hosts: 65-126)",
              "192.168.1.128/26 (hosts: 129-190)",
              "192.168.1.192/26 (hosts: 193-254)"
            ],
            "VLSM (Variable Length Subnet Masking)": [
              "Different subnet sizes for different needs",
              "More efficient address utilization",
              "Example: /30 for point-to-point links (2 hosts)",
              "/28 for small departments (14 hosts)"
            ]
          },
          type: 'text'
        },
        {
          id: 'tcp-4',
          title: 'IPv6 - Next Generation IP',
          content: {
            "IPv6 overview": "IPv6 addresses the limitations of IPv4 with 128-bit addresses and enhanced features.",
            "why IPv6": [
              "IPv4 address exhaustion",
              "Improved security features",
              "Better quality of service",
              "Simplified header structure",
              "Native mobility support"
            ],
            "key features": [
              "128-bit addresses: 340 undecillion addresses",
              "Hierarchical addressing: Efficient routing",
              "No NAT required: End-to-end connectivity",
              "Built-in security: IPSec mandatory",
              "Auto-configuration: SLAAC support"
            ],
            "address types": [
              "Unicast: One-to-one communication",
              "- Global unicast (2000::/3)",
              "- Link-local (fe80::/10)",
              "- Unique local (fc00::/7)",
              "Multicast: One-to-many (ff00::/8)",
              "Anycast: One-to-nearest"
            ],
            "address notation": [
              "Hexadecimal separated by colons",
              "Example: 2001:0db8:85a3:0000:0000:8a2e:0370:7334",
              "Compression: 2001:db8:85a3::8a2e:370:7334"
            ],
            "transition mechanisms": [
              "Dual stack (IPv4 and IPv6)",
              "Tunneling (6to4, Teredo)",
              "Translation (NAT64)"
            ]
          },
          type: 'text'
        },
        {
          id: 'tcp-5',
          title: 'TCP - Reliable Transport',
          content: {
            "TCP characteristics": "TCP provides reliable, connection-oriented communication with comprehensive error recovery.",
            "connection-oriented": [
              "Three-way handshake establishment",
              "Four-way handshake termination",
              "Maintains connection state"
            ],
            "reliability features": [
              "Sequence Numbers: Order packets correctly",
              "Acknowledgments: Confirm receipt",
              "Retransmission: Resend lost packets",
              "Checksums: Detect corruption"
            ],
            "flow control": [
              "Window Size: Controls data flow rate",
              "Sliding Window: Efficient data transfer",
              "Zero Window: Stop transmission when buffer full"
            ],
            "congestion control": [
              "Slow Start: Gradually increase sending rate",
              "Congestion Avoidance: Linear increase",
              "Fast Retransmit: Quick loss detection",
              "Fast Recovery: Efficient recovery"
            ],
            "TCP header fields": [
              "Source/Destination ports (16 bits each)",
              "Sequence number (32 bits)",
              "Acknowledgment number (32 bits)",
              "Window size (16 bits)",
              "Flags: SYN, ACK, FIN, RST, PSH, URG"
            ],
            "common TCP applications": [
              "HTTP/HTTPS (web browsing)",
              "FTP (file transfer)",
              "SMTP (email)",
              "SSH (secure shell)",
              "Telnet (remote terminal)"
            ]
          },
          type: 'text'
        },
        {
          id: 'tcp-6',
          title: 'UDP and Other Transport Protocols',
          content: {
            "UDP (User Datagram Protocol)": "UDP provides fast, connectionless communication with minimal overhead.",
            "UDP characteristics": [
              "Connectionless: No session establishment",
              "Unreliable: No delivery guarantee",
              "Fast: Minimal overhead",
              "Simple: Basic error detection only"
            ],
            "UDP header (8 bytes)": [
              "Source port (2 bytes)",
              "Destination port (2 bytes)",
              "Length (2 bytes)",
              "Checksum (2 bytes)"
            ],
            "when to use UDP": [
              "Real-time applications (video, audio)",
              "Simple request-response (DNS)",
              "Broadcast/multicast traffic",
              "Applications handling their own reliability"
            ],
            "UDP applications": [
              "DNS: Domain name resolution",
              "DHCP: IP address assignment",
              "SNMP: Network management",
              "VoIP: Voice communication",
              "Gaming: Real-time multiplayer",
              "Video Streaming: Live broadcasts"
            ],
            "other transport protocols": [
              "SCTP: Stream Control Transmission Protocol",
              "- Multi-homing support",
              "- Multiple streams",
              "- Message-oriented",
              "DCCP: Datagram Congestion Control Protocol",
              "- Unreliable but congestion-controlled",
              "QUIC: Quick UDP Internet Connections",
              "- Google-developed",
              "- HTTP/3 foundation",
              "- Reduced latency"
            ]
          },
          type: 'text'
        }
      ]
    },
    {
      id: 'network-devices',
      title: 'Network Devices and Infrastructure',
      description: 'Comprehensive study of network hardware and their functions',
      duration: '50 min',
      slides: [
        {
          id: 'devices-1',
          title: 'Network Infrastructure Overview',
          content: {
            "network device categories": "Network devices are classified by the OSI layer at which they primarily operate.",
            "Layer 1 Devices (Physical)": [
              "Hubs, repeaters, cables, connectors",
              "Signal amplification and regeneration"
            ],
            "Layer 2 Devices (Data Link)": [
              "Switches, bridges, access points",
              "Frame forwarding based on MAC addresses"
            ],
            "Layer 3 Devices (Network)": [
              "Routers, layer 3 switches",
              "Packet routing based on IP addresses"
            ],
            "Layer 4-7 Devices (Application)": [
              "Firewalls, load balancers, proxies",
              "Application-aware processing"
            ],
            "hybrid devices": [
              "Most modern devices operate at multiple layers",
              "Example: Layer 3 switches combine switching and routing"
            ]
          },
          type: 'text'
        },
        {
          id: 'devices-2',
          title: 'Switches - Layer 2 Intelligence',
          content: {
            "switch operation": "Switches learn MAC addresses and forward frames intelligently within the local network.",
            "MAC address learning": [
              "1. Receive frame on a port",
              "2. Learn source MAC address",
              "3. Add MAC-to-port mapping to table",
              "4. Forward frame based on destination MAC"
            ],
            "forwarding decisions": [
              "Known Unicast: Forward to specific port",
              "Unknown Unicast: Flood to all ports except source",
              "Broadcast: Forward to all ports except source",
              "Multicast: Forward to registered ports"
            ],
            "switch types": [
              "Unmanaged: Basic plug-and-play operation",
              "Managed: Configuration, VLANs, monitoring",
              "Layer 3: Routing capabilities added"
            ],
            "advanced features": [
              "VLANs: Virtual network segmentation",
              "STP: Spanning Tree Protocol (loop prevention)",
              "Port Mirroring: Traffic analysis",
              "QoS: Quality of Service prioritization",
              "PoE: Power over Ethernet"
            ],
            "performance metrics": [
              "Switching Capacity: Total throughput",
              "Forwarding Rate: Packets per second",
              "MAC Address Table Size: Learning capacity"
            ]
          },
          type: 'text'
        },
        {
          id: 'devices-3',
          title: 'Routers - Layer 3 Intelligence',
          content: {
            "router functions": "Routers operate at the network layer to connect different networks and make intelligent forwarding decisions.",
            "primary responsibilities": [
              "Path Selection: Choose best route to destination",
              "Packet Forwarding: Move packets between networks",
              "Network Segmentation: Separate broadcast domains",
              "Protocol Translation: Convert between different protocols"
            ],
            "routing table components": [
              "Destination Network: Target network address",
              "Next Hop: IP address of next router",
              "Interface: Outgoing port",
              "Metric: Cost or preference",
              "Administrative Distance: Route reliability"
            ],
            "routing types": [
              "Static Routing: Manually configured routes",
              "- Pros: Predictable, secure, low overhead",
              "- Cons: Not scalable, manual maintenance",
              "Dynamic Routing: Automatically learned routes",
              "- Pros: Scalable, adaptive, automatic updates",
              "- Cons: Complex, overhead, potential security risks"
            ],
            "router components": [
              "CPU: Process routing protocols",
              "RAM: Store routing tables and running config",
              "NVRAM: Store startup configuration",
              "Flash: Store operating system",
              "Interfaces: Connect to networks"
            ]
          },
          type: 'text'
        },
        {
          id: 'devices-4',
          title: 'VLANs and Inter-VLAN Routing',
          content: {
            "Virtual LANs (VLANs)": "VLANs provide logical network segmentation independent of physical topology.",
            "VLAN benefits": [
              "Logical Segmentation: Group users by function, not location",
              "Broadcast Control: Limit broadcast domains",
              "Security: Isolate sensitive traffic",
              "Flexibility: Easy reconfiguration",
              "Cost Reduction: Reduce need for physical changes"
            ],
            "VLAN types": [
              "Data VLAN: User traffic",
              "Voice VLAN: VoIP traffic",
              "Management VLAN: Switch management",
              "Native VLAN: Untagged traffic on trunks"
            ],
            "VLAN implementation": [
              "Access Ports: Belong to single VLAN",
              "Trunk Ports: Carry multiple VLANs",
              "802.1Q Tagging: VLAN identification standard"
            ],
            "inter-VLAN routing": [
              "Router-on-a-Stick: Single router interface with subinterfaces",
              "Layer 3 Switch: Built-in routing capabilities",
              "Dedicated Router: Separate router for each VLAN"
            ],
            "VLAN configuration example": [
              "! Create VLAN",
              "vlan 10",
              " name Sales",
              "vlan 20",
              " name Marketing",
              "",
              "! Assign ports",
              "interface fa0/1",
              " switchport mode access",
              " switchport access vlan 10"
            ]
          },
          type: 'text'
        },
        {
          id: 'devices-5',
          title: 'Wireless Networking Infrastructure',
          content: {
            "wireless LAN components": "Wireless networks require specialized equipment to provide radio frequency connectivity.",
            "Access Points (APs)": [
              "Bridge between wireless and wired networks",
              "Provide radio coverage for client devices",
              "Handle authentication and encryption"
            ],
            "wireless controllers": [
              "Centralized management of multiple APs",
              "Consistent policy enforcement",
              "Seamless roaming support"
            ],
            "802.11 standards": [
              "802.11a: 5 GHz, 54 Mbps",
              "802.11b: 2.4 GHz, 11 Mbps",
              "802.11g: 2.4 GHz, 54 Mbps",
              "802.11n: 2.4/5 GHz, 600 Mbps (MIMO)",
              "802.11ac: 5 GHz, 6.9 Gbps (Wave 2)",
              "802.11ax (WiFi 6): 2.4/5 GHz, 9.6 Gbps"
            ],
            "security methods": [
              "WEP: Wired Equivalent Privacy (deprecated)",
              "WPA: WiFi Protected Access",
              "WPA2: AES encryption (current standard)",
              "WPA3: Enhanced security features",
              "Enterprise: 802.1X authentication"
            ],
            "frequency bands": [
              "2.4 GHz: Longer range, more interference",
              "5 GHz: Higher speed, shorter range",
              "6 GHz: WiFi 6E, least congested"
            ]
          },
          type: 'text'
        }
      ]
    },
    {
      id: 'routing-protocols',
      title: 'Routing Protocols and Algorithms',
      description: 'Dynamic routing protocols and path selection algorithms',
      duration: '55 min',
      slides: [
        {
          id: 'routing-1',
          title: 'Routing Protocol Classification',
          content: {
            "distance vector protocols": "Distance vector protocols share routing information with immediate neighbors based on distance metrics.",
            "distance vector characteristics": [
              "Share routing table with neighbors",
              "Use hop count or metrics",
              "Periodic updates",
              "Simple to configure"
            ],
            "distance vector examples": [
              "RIP (Routing Information Protocol)",
              "- Maximum 15 hops",
              "- Updates every 30 seconds",
              "- Simple metric (hop count)",
              "EIGRP (Enhanced Interior Gateway Routing Protocol)",
              "- Cisco proprietary",
              "- Composite metric",
              "- Fast convergence"
            ],
            "link state protocols": "Link state protocols maintain a complete topology database for intelligent path selection.",
            "link state characteristics": [
              "Maintain topology database",
              "Flood link state advertisements",
              "Calculate shortest path tree",
              "Fast convergence"
            ],
            "link state examples": [
              "OSPF (Open Shortest Path First)",
              "- Dijkstra algorithm",
              "- Area-based hierarchy",
              "- Cost-based metric",
              "IS-IS (Intermediate System to Intermediate System)",
              "- Similar to OSPF",
              "- Used in large service provider networks"
            ]
          },
          type: 'text'
        },
        {
          id: 'routing-2',
          title: 'OSPF - Open Shortest Path First',
          content: {
            "OSPF overview": "OSPF is a link-state routing protocol that provides fast convergence and scalable hierarchical design.",
            "key features": [
              "Link State Protocol: Maintains complete topology",
              "Hierarchical Design: Areas reduce complexity",
              "Fast Convergence: Rapid response to changes",
              "Load Balancing: Equal-cost path support",
              "Authentication: Secure routing updates"
            ],
            "OSPF areas": [
              "Area 0: Backbone area (mandatory)",
              "Standard Areas: Connect to backbone",
              "Stub Areas: No external routes",
              "NSSA: Not-So-Stubby Areas"
            ],
            "LSA types": [
              "Type 1: Router LSA",
              "Type 2: Network LSA",
              "Type 3: Summary LSA",
              "Type 4: ASBR Summary LSA",
              "Type 5: External LSA"
            ],
            "OSPF process": [
              "1. Neighbor Discovery: Hello packets",
              "2. Database Synchronization: LSA exchange",
              "3. SPF Calculation: Dijkstra algorithm",
              "4. Routing Table Update: Install best paths"
            ],
            "metric calculation": [
              "Cost = Reference Bandwidth / Interface Bandwidth",
              "Default reference: 100 Mbps",
              "Lower cost = preferred path"
            ]
          },
          type: 'text'
        },
        {
          id: 'routing-3',
          title: 'BGP - Border Gateway Protocol',
          content: {
            "BGP overview": "BGP is the protocol that powers the internet, enabling routing between different autonomous systems.",
            "purpose": [
              "Inter-domain routing: Between different organizations",
              "Policy-based routing: Business relationships",
              "Path vector protocol: AS path information",
              "Internet backbone: Core internet routing"
            ],
            "BGP concepts": [
              "Autonomous System (AS): Administrative domain",
              "AS Numbers: 16-bit or 32-bit identifiers",
              "BGP Sessions: TCP connections between peers",
              "Path Attributes: Routing decision factors"
            ],
            "BGP peer types": [
              "eBGP: External BGP (between different AS)",
              "iBGP: Internal BGP (within same AS)",
              "Route Reflectors: iBGP scalability",
              "Confederations: AS subdivision"
            ],
            "path selection process": [
              "1. Weight: Cisco proprietary (highest preferred)",
              "2. Local Preference: AS-wide preference",
              "3. Origin: IGP > EGP > Incomplete",
              "4. AS Path Length: Shorter preferred",
              "5. MED: Multi-Exit Discriminator",
              "6. Neighbor Type: eBGP > iBGP",
              "7. IGP Metric: Lowest to BGP next hop"
            ],
            "BGP applications": [
              "Internet service providers",
              "Enterprise multi-homing",
              "Content delivery networks",
              "Cloud service providers"
            ]
          },
          type: 'text'
        }
      ]
    },
    {
      id: 'network-security',
      title: 'Network Security and Threats',
      description: 'Comprehensive network security principles and threat mitigation',
      duration: '60 min',
      slides: [
        {
          id: 'security-1',
          title: 'Network Security Fundamentals',
          content: {
            "CIA triad": "The foundation of information security consisting of Confidentiality, Integrity, and Availability.",
            "confidentiality": [
              "Information accessible only to authorized users",
              "Encryption, access controls, authentication"
            ],
            "integrity": [
              "Data remains accurate and unmodified",
              "Digital signatures, checksums, hashing"
            ],
            "availability": [
              "Systems and data accessible when needed",
              "Redundancy, backups, DDoS protection"
            ],
            "additional principles": [
              "Authentication: Verify user identity",
              "Authorization: Grant appropriate permissions",
              "Accounting: Log and monitor activities",
              "Non-repudiation: Prevent denial of actions"
            ],
            "defense in depth": [
              "Multiple layers of security controls",
              "Physical, network, host, application, data layers",
              "Redundant protection mechanisms",
              "Fail-safe design principles"
            ],
            "risk management": [
              "Risk = Threat × Vulnerability × Impact",
              "Risk assessment and analysis",
              "Risk mitigation strategies",
              "Residual risk acceptance"
            ]
          },
          type: 'text'
        },
        {
          id: 'security-2',
          title: 'Common Network Threats',
          content: 'Passive Attacks:\n\nEavesdropping/Sniffing:\n• Capture and analyze network traffic\n• Tools: Wireshark, tcpdump\n• Mitigation: Encryption, switched networks\n\nTraffic Analysis:\n• Study communication patterns\n• Infer sensitive information\n• Mitigation: VPNs, traffic padding\n\nActive Attacks:\n\nMan-in-the-Middle (MITM):\n• Intercept and modify communications\n• ARP spoofing, DNS hijacking\n• Mitigation: Certificate validation, encrypted channels\n\nDenial of Service (DoS):\n• Volumetric: Bandwidth exhaustion\n• Protocol: TCP SYN flood, ping of death\n• Application: Slowloris, HTTP flood\n• Distributed (DDoS): Botnet-based attacks\n\nSpoofing Attacks:\n• IP Spoofing: Fake source addresses\n• MAC Spoofing: Duplicate MAC addresses\n• DNS Spoofing: Redirect domain queries\n• Email Spoofing: Fake sender addresses\n\nInjection Attacks:\n• SQL injection\n• Command injection\n• Cross-site scripting (XSS)',
          type: 'text'
        },
        {
          id: 'security-3',
          title: 'Firewalls and Access Control',
          content: 'Firewall Types:\n\nPacket Filtering Firewalls:\n• Examine packet headers\n• Filter based on source/destination IP, ports\n• Stateless operation\n• Fast but limited inspection\n\nStateful Inspection Firewalls:\n• Track connection states\n• Maintain session tables\n• More secure than packet filtering\n• Moderate performance impact\n\nApplication Layer Firewalls:\n• Deep packet inspection\n• Application-aware filtering\n• Protocol validation\n• Higher security, lower performance\n\nNext-Generation Firewalls (NGFW):\n• Integrated IPS/IDS\n• Application identification\n• User awareness\n• SSL inspection\n\nFirewall Deployment:\n• Perimeter: Network edge protection\n• Internal: Network segmentation\n• Host-based: Individual system protection\n• Distributed: Multiple enforcement points\n\nAccess Control Lists (ACLs):\n• Standard ACLs: Source IP only\n• Extended ACLs: Source, destination, protocol, ports\n• Named ACLs: Descriptive names\n• Time-based ACLs: Schedule-based rules',
          type: 'text'
        },
        {
          id: 'security-4',
          title: 'VPNs and Secure Communications',
          content: 'Virtual Private Networks (VPNs):\n\nVPN Types:\n\nSite-to-Site VPN:\n• Connect entire networks\n• Always-on connectivity\n• Transparent to end users\n• Used for branch offices\n\nRemote Access VPN:\n• Individual user connections\n• On-demand connectivity\n• User authentication required\n• Mobile workforce support\n\nVPN Protocols:\n\nIPSec (Internet Protocol Security):\n• AH (Authentication Header): Authentication and integrity\n• ESP (Encapsulating Security Payload): Encryption and authentication\n• Transport Mode: Payload encryption only\n• Tunnel Mode: Entire packet encryption\n\nSSL/TLS VPN:\n• Web browser-based access\n• Application-specific tunnels\n• Clientless or thin client\n• Easier deployment and management\n\nPPTP/L2TP:\n• PPTP: Point-to-Point Tunneling Protocol\n• L2TP: Layer 2 Tunneling Protocol\n• Often combined with IPSec\n• Legacy protocols with limitations\n\nVPN Benefits:\n• Secure remote access\n• Cost-effective WAN connectivity\n• Data confidentiality and integrity\n• Flexible network topologies',
          type: 'text'
        }
      ]
    },
    {
      id: 'network-troubleshooting',
      title: 'Network Troubleshooting and Performance',
      description: 'Systematic approach to network problem resolution and optimization',
      duration: '45 min',
      slides: [
        {
          id: 'troubleshooting-1',
          title: 'Troubleshooting Methodology',
          content: {
            "systematic approach": "Network troubleshooting requires a methodical, step-by-step approach to identify and resolve issues efficiently.",
            "1. problem identification": [
              "Gather symptoms and user reports",
              "Define problem scope and impact",
              "Establish baseline measurements",
              "Document initial observations"
            ],
            "2. information gathering": [
              "Network topology and configuration",
              "Recent changes or maintenance",
              "Error logs and monitoring data",
              "Environmental factors"
            ],
            "3. hypothesis development": [
              "List possible causes",
              "Prioritize based on probability",
              "Consider OSI layer implications",
              "Apply Occam's razor principle"
            ],
            "4. testing and isolation": [
              "Test one variable at a time",
              "Use divide-and-conquer approach",
              "Isolate network segments",
              "Validate test results"
            ],
            "5. solution implementation": [
              "Plan implementation steps",
              "Consider impact on operations",
              "Implement during maintenance windows",
              "Document changes made"
            ],
            "6. verification and documentation": [
              "Verify problem resolution",
              "Monitor for recurring issues",
              "Update documentation",
              "Conduct post-incident review"
            ]
          },
          type: 'text'
        },
        {
          id: 'troubleshooting-2',
          title: 'Essential Troubleshooting Tools',
          content: 'Command Line Tools:\n\nping:\n• Test basic connectivity\n• Measure round-trip time\n• Identify packet loss\n• Commands: `ping -c 4 192.168.1.1`\n\ntraceroute/tracert:\n• Map path to destination\n• Identify routing issues\n• Locate network bottlenecks\n• Commands: `traceroute google.com`\n\nnslookup/dig:\n• DNS query testing\n• Resolve domain names\n• Verify DNS configuration\n• Commands: `nslookup google.com`\n\nnetstat:\n• Display network connections\n• Show listening ports\n• View routing tables\n• Commands: `netstat -an`\n\nProtocol Analyzers:\n\nWireshark:\n• Capture and analyze packets\n• Filter traffic by protocol\n• Decode protocol headers\n• Performance analysis\n\ntcpdump:\n• Command-line packet capture\n• Real-time traffic monitoring\n• Scriptable for automation\n• Lightweight alternative\n\nNetwork Monitoring Tools:\n• SNMP: Simple Network Management Protocol\n• PRTG: Paessler Router Traffic Grapher\n• SolarWinds: Network Performance Monitor\n• Nagios: Open-source monitoring',
          type: 'text'
        },
        {
          id: 'troubleshooting-3',
          title: 'Common Network Problems',
          content: 'Connectivity Issues:\n\nPhysical Layer Problems:\n• Cable damage or disconnection\n• Port failures\n• Power issues\n• Environmental interference\n• Symptoms: No link lights, intermittent connectivity\n• Tools: Cable testers, link lights, loopback tests\n\nConfiguration Problems:\n• Incorrect IP addressing\n• Subnet mask mismatches\n• Default gateway issues\n• VLAN misconfigurations\n• Symptoms: Can\'t reach certain networks\n• Tools: ipconfig, route tables, VLAN verification\n\nPerformance Issues:\n\nBandwidth Limitations:\n• Insufficient capacity for traffic load\n• Quality of Service (QoS) issues\n• Bandwidth competing applications\n• Symptoms: Slow file transfers, video stuttering\n• Tools: Bandwidth monitors, traffic analyzers\n\nLatency Problems:\n• Network congestion\n• Routing inefficiencies\n• Processing delays\n• Symptoms: High ping times, application timeouts\n• Tools: ping, traceroute, latency monitors\n\nDNS Issues:\n• DNS server failures\n• Incorrect DNS records\n• DNS cache problems\n• Symptoms: Can\'t resolve domain names\n• Tools: nslookup, dig, DNS troubleshooting',
          type: 'text'
        },
        {
          id: 'troubleshooting-4',
          title: 'Performance Optimization',
          content: 'Network Performance Metrics:\n\nKey Performance Indicators:\n• Throughput: Actual data transfer rate\n• Latency: End-to-end delay\n• Jitter: Variation in latency\n• Packet Loss: Percentage of lost packets\n• Utilization: Bandwidth usage percentage\n\nOptimization Strategies:\n\nQuality of Service (QoS):\n• Traffic prioritization\n• Bandwidth allocation\n• Traffic shaping and policing\n• Application-aware networking\n\nCaching and Compression:\n• Content delivery networks (CDN)\n• Web proxy caching\n• Data compression techniques\n• Application-level caching\n\nNetwork Design Optimization:\n• Proper network segmentation\n• Redundant paths for failover\n• Load balancing implementation\n• Optimal routing protocols\n\nMonitoring and Baselines:\n• Establish performance baselines\n• Continuous monitoring\n• Capacity planning\n• Proactive maintenance\n\nTraffic Engineering:\n• Path optimization\n• Load distribution\n• Congestion avoidance\n• Bandwidth management',
          type: 'text'
        }
      ]
    },
    {
      id: 'advanced-topics',
      title: 'Advanced Networking Concepts',
      description: 'Modern networking technologies and emerging trends',
      duration: '55 min',
      slides: [
        {
          id: 'advanced-1',
          title: 'Software-Defined Networking (SDN)',
          content: {
            "SDN overview": "Software-Defined Networking separates the control plane from the data plane, enabling centralized network management.",
            "traditional vs SDN": [
              "Traditional: Distributed control plane in each device",
              "SDN: Centralized control plane with programmable interfaces"
            ],
            "application layer": [
              "Business applications",
              "Network services",
              "Orchestration platforms"
            ],
            "control layer": [
              "SDN Controller: Centralized brain",
              "Network operating system",
              "Global network view"
            ],
            "infrastructure layer": [
              "OpenFlow Switches: Programmable forwarding",
              "Flow tables and actions",
              "Statistical information"
            ],
            "SDN benefits": [
              "Centralized Management: Single point of control",
              "Programmability: Custom applications",
              "Flexibility: Dynamic network changes",
              "Cost Reduction: Commodity hardware",
              "Innovation: Rapid service deployment"
            ],
            "OpenFlow protocol": [
              "Communication between controller and switches",
              "Flow-based forwarding",
              "Granular traffic control",
              "Match-action paradigm"
            ],
            "SDN use cases": [
              "Data center networking",
              "Campus networks",
              "WAN optimization",
              "Network function virtualization"
            ]
          },
          type: 'text'
        },
        {
          id: 'advanced-2',
          title: 'Network Function Virtualization (NFV)',
          content: 'NFV Fundamentals:\n\nConcept:\n• Replace dedicated hardware appliances\n• Run network functions as software\n• Deploy on standard servers\n• Dynamic scaling and orchestration\n\nVirtual Network Functions (VNFs):\n• Virtual Firewalls: Security services\n• Virtual Load Balancers: Traffic distribution\n• Virtual Routers: Routing functions\n• Virtual WAN Optimizers: Performance enhancement\n\nNFV Architecture:\n\nNFV Infrastructure (NFVI):\n• Hardware Resources: Compute, storage, network\n• Virtualization Layer: Hypervisors, containers\n• Virtual Resources: VMs, virtual networks\n\nVNF Manager (VNFM):\n• VNF lifecycle management\n• Scaling and healing\n• Configuration management\n\nNFV Orchestrator (NFVO):\n• Service orchestration\n• Resource allocation\n• End-to-end service management\n\nBenefits:\n• Reduced CAPEX: Lower hardware costs\n• Faster Service Deployment: Software-based provisioning\n• Scalability: Dynamic resource allocation\n• Vendor Independence: Multi-vendor environments\n• Energy Efficiency: Optimized resource utilization',
          type: 'text'
        },
        {
          id: 'advanced-3',
          title: 'Cloud Networking',
          content: 'Cloud Network Models:\n\nInfrastructure as a Service (IaaS):\n• Virtual networks in cloud\n• Customer controls networking\n• Examples: AWS VPC, Azure VNet\n\nPlatform as a Service (PaaS):\n• Managed network services\n• Abstracted networking layer\n• Focus on application development\n\nSoftware as a Service (SaaS):\n• Fully managed applications\n• No network control\n• Provider handles all networking\n\nCloud Networking Services:\n\nVirtual Private Clouds (VPC):\n• Isolated cloud networks\n• Customizable IP addressing\n• Security groups and NACLs\n• Internet and VPN gateways\n\nLoad Balancing:\n• Application Load Balancer: Layer 7\n• Network Load Balancer: Layer 4\n• Classic Load Balancer: Mixed layers\n• Auto-scaling integration\n\nContent Delivery Networks (CDN):\n• Global content distribution\n• Edge caching\n• Reduced latency\n• DDoS protection\n\nHybrid Cloud Connectivity:\n• VPN Connections: Encrypted tunnels\n• Direct Connect: Dedicated circuits\n• ExpressRoute: Azure dedicated connectivity\n• Interconnect: Multi-cloud connections',
          type: 'text'
        },
        {
          id: 'advanced-4',
          title: 'Internet of Things (IoT) Networking',
          content: 'IoT Network Requirements:\n\nUnique Challenges:\n• Scale: Billions of connected devices\n• Power Constraints: Battery-operated devices\n• Bandwidth: Efficient data transmission\n• Security: Device and data protection\n• Latency: Real-time applications\n\nIoT Communication Protocols:\n\nShort-Range Protocols:\n• WiFi: High bandwidth, higher power\n• Bluetooth/BLE: Low power, short range\n• Zigbee: Mesh networking, low power\n• Z-Wave: Home automation, reliable\n\nLong-Range Protocols:\n• LoRaWAN: Long range, low power\n• NB-IoT: Cellular-based, wide coverage\n• Sigfox: Ultra-narrow band\n• 5G: High speed, low latency\n\nIoT Network Architectures:\n\nEdge Computing:\n• Process data closer to source\n• Reduced latency\n• Bandwidth optimization\n• Enhanced privacy\n\nFog Computing:\n• Distributed computing layer\n• Bridge between edge and cloud\n• Local processing capabilities\n• Real-time decision making\n\nIoT Security Considerations:\n• Device authentication\n• Data encryption\n• Secure boot processes\n• Regular security updates\n• Network segmentation',
          type: 'text'
        },
        {
          id: 'advanced-5',
          title: 'Network Automation and Orchestration',
          content: 'Network Automation Benefits:\n\nOperational Efficiency:\n• Reduced manual errors\n• Faster deployment times\n• Consistent configurations\n• 24/7 automated operations\n\nCost Reduction:\n• Lower operational expenses\n• Reduced staffing requirements\n• Improved resource utilization\n• Faster problem resolution\n\nAutomation Technologies:\n\nInfrastructure as Code (IaC):\n• Ansible: Agentless automation\n• Puppet: Configuration management\n• Chef: Infrastructure automation\n• Terraform: Multi-cloud provisioning\n\nNetwork APIs:\n• REST APIs: HTTP-based interfaces\n• NETCONF: Network configuration protocol\n• RESTCONF: REST-like NETCONF\n• gRPC: High-performance RPC framework\n\nOrchestration Platforms:\n• Kubernetes: Container orchestration\n• OpenStack: Cloud orchestration\n• CloudFormation: AWS automation\n• ARM Templates: Azure automation\n\nNetwork Telemetry:\n• SNMP: Traditional monitoring\n• Streaming Telemetry: Real-time data\n• Model-driven Telemetry: Structured data\n• Network Analytics: AI-driven insights\n\nDevOps Integration:\n• CI/CD pipelines for network changes\n• Version control for configurations\n• Automated testing and validation\n• GitOps methodology',
          type: 'text'
        }
      ]
    }
  ]
}