(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/data/courses/computer-networks.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "computerNetworksContent",
    ()=>computerNetworksContent
]);
const computerNetworksContent = {
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
                    content: 'A computer network is a collection of interconnected computing devices that can communicate and share resources. These devices (nodes) include:\n\n• Computers: Desktops, laptops, servers\n• Mobile Devices: Smartphones, tablets\n• Network Equipment: Routers, switches, hubs\n• IoT Devices: Smart sensors, cameras, appliances\n\nKey Characteristics:\n• Shared communication medium\n• Protocol-based communication\n• Resource sharing capabilities\n• Distributed processing power',
                    type: 'text'
                },
                {
                    id: 'intro-2',
                    title: 'Evolution of Computer Networks',
                    content: 'Historical Timeline:\n\n1960s - ARPANET: First packet-switching network\n• Funded by US Department of Defense\n• Connected universities and research institutions\n• Foundation for modern internet\n\n1970s - Ethernet: Local area networking\n• Developed by Xerox\n• Collision detection protocol\n• Still widely used today\n\n1980s - TCP/IP: Standardized protocols\n• Transmission Control Protocol\n• Internet Protocol suite\n• Enabled global internetworking\n\n1990s - World Wide Web: User-friendly internet\n• HTTP protocol\n• Web browsers\n• Commercial internet adoption',
                    type: 'text'
                },
                {
                    id: 'intro-3',
                    title: 'Network Classifications by Scale',
                    content: 'Personal Area Network (PAN)\n• Range: 1-10 meters\n• Examples: Bluetooth, USB connections\n• Use: Personal device connectivity\n\nLocal Area Network (LAN)\n• Range: Building or campus\n• Examples: Office networks, WiFi\n• High speed, low latency\n\nMetropolitan Area Network (MAN)\n• Range: City-wide coverage\n• Examples: Cable TV networks, city WiFi\n• Moderate speed and latency\n\nWide Area Network (WAN)\n• Range: Country/continent-wide\n• Examples: Internet, corporate networks\n• Variable speed, higher latency\n\nGlobal Area Network (GAN)\n• Range: Worldwide coverage\n• Examples: Satellite networks\n• Lower speed, highest latency',
                    type: 'text'
                },
                {
                    id: 'intro-4',
                    title: 'Network Topologies',
                    content: 'Physical vs Logical Topology\n• Physical: How devices are physically connected\n• Logical: How data flows through the network\n\nCommon Topologies:\n\nBus Topology\n• Single cable backbone\n• All devices connected to main cable\n• Pros: Simple, cost-effective\n• Cons: Single point of failure\n\nStar Topology\n• Central hub/switch\n• All devices connected to center\n• Pros: Easy to manage, fault tolerant\n• Cons: Central point dependency\n\nRing Topology\n• Devices connected in circular fashion\n• Data travels in one direction\n• Pros: Equal access, predictable performance\n• Cons: Single break affects entire network\n\nMesh Topology\n• Multiple paths between devices\n• Full mesh: Every device connected to every other\n• Partial mesh: Some devices have multiple connections\n• Pros: Highly fault tolerant\n• Cons: Complex, expensive',
                    type: 'text'
                },
                {
                    id: 'intro-5',
                    title: 'Network Services and Applications',
                    content: 'Core Network Services:\n\nFile Sharing\n• Network File System (NFS)\n• Server Message Block (SMB)\n• File Transfer Protocol (FTP)\n\nPrint Services\n• Shared printer access\n• Print queue management\n• Remote printing capabilities\n\nEmail Services\n• Simple Mail Transfer Protocol (SMTP)\n• Post Office Protocol (POP3)\n• Internet Message Access Protocol (IMAP)\n\nWeb Services\n• HyperText Transfer Protocol (HTTP/HTTPS)\n• Web server hosting\n• Content delivery networks\n\nDatabase Services\n• Distributed database access\n• Client-server database architecture\n• Database replication and synchronization\n\nCommunication Services\n• Voice over IP (VoIP)\n• Video conferencing\n• Instant messaging\n• Social networking platforms',
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
                    content: 'Open Systems Interconnection (OSI) Model\n\nDeveloped by the International Organization for Standardization (ISO) in 1984 to standardize network communication.\n\nPurpose:\n• Provide a framework for network protocol design\n• Enable interoperability between different vendors\n• Simplify network troubleshooting\n• Facilitate network education and understanding\n\nKey Principles:\n• Layered Architecture: Each layer has specific responsibilities\n• Abstraction: Upper layers don\'t need to know lower layer details\n• Modularity: Changes in one layer don\'t affect others\n• Standardization: Common protocols at each layer\n\nBenefits:\n• Reduces complexity\n• Enables vendor independence\n• Promotes innovation\n• Simplifies troubleshooting',
                    type: 'text'
                },
                {
                    id: 'osi-2',
                    title: 'Layer 1: Physical Layer',
                    content: 'Physical Layer - The Foundation\n\nPrimary Functions:\n• Transmission of raw bit streams\n• Physical medium specifications\n• Electrical and mechanical interfaces\n• Signal encoding and timing\n\nKey Concepts:\n• Bits: Binary data (0s and 1s)\n• Signaling: How bits are represented physically\n• Synchronization: Timing coordination\n• Medium: The physical path for data\n\nPhysical Media Types:\n• Copper Cables: Twisted pair, coaxial\n• Fiber Optic: Single-mode, multi-mode\n• Wireless: Radio waves, microwaves, infrared\n\nExamples:\n• Ethernet cables (Cat5e, Cat6)\n• USB ports\n• WiFi radio signals\n• Bluetooth connections\n\nDevices:\n• Hubs, repeaters, cables, connectors',
                    type: 'text'
                },
                {
                    id: 'osi-3',
                    title: 'Layer 2: Data Link Layer',
                    content: 'Data Link Layer - Node-to-Node Communication\n\nPrimary Functions:\n• Frame formation and detection\n• Error detection and correction\n• Flow control\n• Media Access Control (MAC)\n\nKey Concepts:\n• Frames: Data units at this layer\n• MAC Addresses: Physical device identifiers\n• Error Detection: CRC, checksums\n• Flow Control: Preventing buffer overflow\n\nSub-layers:\n• LLC (Logical Link Control): Interface with network layer\n• MAC (Media Access Control): Controls access to medium\n\nProtocols:\n• Ethernet: Most common LAN protocol\n• WiFi (802.11): Wireless LAN protocol\n• PPP: Point-to-Point Protocol\n• HDLC: High-level Data Link Control\n\nError Detection Methods:\n• Parity bits\n• Cyclic Redundancy Check (CRC)\n• Checksums\n\nDevices:\n• Switches, bridges, network interface cards (NICs)',
                    type: 'text'
                },
                {
                    id: 'osi-4',
                    title: 'Layer 3: Network Layer',
                    content: 'Network Layer - End-to-End Routing\n\nPrimary Functions:\n• Logical addressing (IP addresses)\n• Path determination and routing\n• Packet forwarding\n• Fragmentation and reassembly\n\nKey Concepts:\n• IP Addresses: Logical network identifiers\n• Routing: Finding best path to destination\n• Packets: Data units at this layer\n• Subnetting: Dividing networks into smaller segments\n\nInternet Protocol (IP):\n• IPv4: 32-bit addresses (4.3 billion addresses)\n• IPv6: 128-bit addresses (virtually unlimited)\n• Address Classes: A, B, C, D, E\n• Private vs Public: RFC 1918 private ranges\n\nRouting Protocols:\n• Static Routing: Manually configured routes\n• Dynamic Routing: Automatically learned routes\n  - RIP: Routing Information Protocol\n  - OSPF: Open Shortest Path First\n  - BGP: Border Gateway Protocol\n\nOther Protocols:\n• ICMP: Internet Control Message Protocol\n• ARP: Address Resolution Protocol\n• DHCP: Dynamic Host Configuration Protocol\n\nDevices:\n• Routers, layer 3 switches',
                    type: 'text'
                },
                {
                    id: 'osi-5',
                    title: 'Layer 4: Transport Layer',
                    content: 'Transport Layer - Reliable Data Transfer\n\nPrimary Functions:\n• End-to-end communication\n• Segmentation and reassembly\n• Flow control\n• Error recovery\n• Port addressing\n\nKey Protocols:\n\nTCP (Transmission Control Protocol)\n• Connection-oriented: Establishes session before data transfer\n• Reliable: Guarantees delivery and order\n• Flow Control: Prevents receiver overflow\n• Error Recovery: Retransmits lost packets\n• Use Cases: Web browsing, email, file transfer\n\nUDP (User Datagram Protocol)\n• Connectionless: No session establishment\n• Unreliable: No delivery guarantee\n• Fast: Lower overhead than TCP\n• Use Cases: Video streaming, online gaming, DNS\n\nPort Numbers:\n• Well-known Ports: 0-1023 (HTTP:80, HTTPS:443, FTP:21)\n• Registered Ports: 1024-49151\n• Dynamic Ports: 49152-65535\n\nTCP Features:\n• Three-way handshake (SYN, SYN-ACK, ACK)\n• Sequence numbers\n• Acknowledgments\n• Window size control\n• Congestion control',
                    type: 'text'
                },
                {
                    id: 'osi-6',
                    title: 'Layer 5-7: Session, Presentation, and Application',
                    content: 'Session Layer (Layer 5)\n• Functions: Dialog control, session management\n• Services: Full-duplex, half-duplex, simplex\n• Examples: NetBIOS, RPC, SQL sessions\n• Features: Checkpointing, recovery, synchronization\n\nPresentation Layer (Layer 6)\n• Functions: Data formatting, encryption, compression\n• Services: Character encoding, data compression\n• Examples: SSL/TLS, JPEG, MPEG, ASCII, EBCDIC\n• Features: Data translation, encryption/decryption\n\nApplication Layer (Layer 7)\n• Functions: Network service interface for applications\n• Services: User interface, application protocols\n• Examples: HTTP, HTTPS, FTP, SMTP, DNS, DHCP\n\nCommon Application Protocols:\n• HTTP/HTTPS: Web browsing (ports 80/443)\n• FTP: File transfer (ports 20/21)\n• SMTP: Email sending (port 25)\n• POP3/IMAP: Email retrieval (ports 110/143)\n• DNS: Domain name resolution (port 53)\n• Telnet: Remote terminal access (port 23)\n• SSH: Secure remote access (port 22)\n\nNote: In practical TCP/IP implementations, layers 5-7 are often combined into a single application layer.',
                    type: 'text'
                },
                {
                    id: 'osi-7',
                    title: 'OSI Model in Practice',
                    content: 'Data Encapsulation Process:\n\nSending Data (Top-Down):\n1. Application: User data created\n2. Presentation: Data formatted/encrypted\n3. Session: Session established\n4. Transport: Segments created (TCP/UDP headers added)\n5. Network: Packets created (IP headers added)\n6. Data Link: Frames created (Ethernet headers added)\n7. Physical: Bits transmitted over medium\n\nReceiving Data (Bottom-Up):\n1. Physical: Bits received\n2. Data Link: Frame headers processed\n3. Network: Packet headers processed\n4. Transport: Segment headers processed\n5. Session: Session managed\n6. Presentation: Data decrypted/formatted\n7. Application: Data delivered to application\n\nTroubleshooting with OSI Model:\n• Physical Issues: Cable problems, signal interference\n• Data Link Issues: Switch problems, MAC conflicts\n• Network Issues: Routing problems, IP conflicts\n• Transport Issues: Port blocks, firewall rules\n• Application Issues: Protocol misconfigurations\n\nReal-World Example - Web Browsing:\n• Application: HTTP request created\n• Transport: TCP segment with port 80\n• Network: IP packet with destination address\n• Data Link: Ethernet frame with MAC addresses\n• Physical: Electrical signals on cable',
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
                    content: 'TCP/IP Protocol Suite\n\nThe foundation of the internet and most modern networks, developed by DARPA in the 1970s.\n\nTCP/IP vs OSI Model:\n• Application Layer: Combines OSI layers 5-7\n• Transport Layer: Equivalent to OSI layer 4\n• Internet Layer: Equivalent to OSI layer 3\n• Network Access Layer: Combines OSI layers 1-2\n\nKey Advantages:\n• Proven: Battle-tested on the internet\n• Scalable: Supports billions of devices\n• Flexible: Works over various physical networks\n• Open Standards: Not vendor-specific\n\nCore Protocols:\n• IP: Internet Protocol (addressing and routing)\n• TCP: Transmission Control Protocol (reliable transport)\n• UDP: User Datagram Protocol (fast transport)\n• ICMP: Internet Control Message Protocol (error reporting)\n• ARP: Address Resolution Protocol (MAC address resolution)',
                    type: 'text'
                },
                {
                    id: 'tcp-2',
                    title: 'Internet Protocol (IP) Addressing',
                    content: 'IPv4 Addressing\n\nAddress Structure:\n• 32-bit addresses (4 bytes)\n• Dotted decimal notation (e.g., 192.168.1.1)\n• Network and host portions\n• Subnet mask defines network/host boundary\n\nAddress Classes:\n• Class A: 1.0.0.0 - 126.255.255.255 (16M hosts/network)\n• Class B: 128.0.0.0 - 191.255.255.255 (65K hosts/network)\n• Class C: 192.0.0.0 - 223.255.255.255 (254 hosts/network)\n• Class D: 224.0.0.0 - 239.255.255.255 (Multicast)\n• Class E: 240.0.0.0 - 255.255.255.255 (Experimental)\n\nSpecial Addresses:\n• Loopback: 127.0.0.1 (localhost)\n• Private Networks: 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16\n• APIPA: 169.254.0.0/16 (Automatic Private IP)\n• Broadcast: 255.255.255.255 (limited broadcast)\n\nSubnet Masks:\n• Define network and host portions\n• CIDR notation (e.g., /24 = 255.255.255.0)\n• Enable subnetting for efficient address use',
                    type: 'text'
                },
                {
                    id: 'tcp-3',
                    title: 'Subnetting and VLSM',
                    content: 'Subnetting Fundamentals\n\nWhy Subnet?\n• Efficient address utilization\n• Improved network performance\n• Enhanced security through segmentation\n• Easier network management\n\nSubnetting Process:\n1. Determine number of subnets needed\n2. Determine hosts per subnet\n3. Calculate subnet mask\n4. Identify subnet ranges\n\nExample: 192.168.1.0/24 into 4 subnets\n• Need 2 bits for 4 subnets (2² = 4)\n• New mask: /26 (255.255.255.192)\n• Subnets:\n  - 192.168.1.0/26 (hosts: 1-62)\n  - 192.168.1.64/26 (hosts: 65-126)\n  - 192.168.1.128/26 (hosts: 129-190)\n  - 192.168.1.192/26 (hosts: 193-254)\n\nVLSM (Variable Length Subnet Masking):\n• Different subnet sizes for different needs\n• More efficient address utilization\n• Example: /30 for point-to-point links (2 hosts)\n• /28 for small departments (14 hosts)',
                    type: 'text'
                },
                {
                    id: 'tcp-4',
                    title: 'IPv6 - Next Generation IP',
                    content: 'IPv6 Overview\n\nWhy IPv6?\n• IPv4 address exhaustion\n• Improved security features\n• Better quality of service\n• Simplified header structure\n• Native mobility support\n\nKey Features:\n• 128-bit addresses: 340 undecillion addresses\n• Hierarchical addressing: Efficient routing\n• No NAT required: End-to-end connectivity\n• Built-in security: IPSec mandatory\n• Auto-configuration: SLAAC support\n\nAddress Types:\n• Unicast: One-to-one communication\n  - Global unicast (2000::/3)\n  - Link-local (fe80::/10)\n  - Unique local (fc00::/7)\n• Multicast: One-to-many (ff00::/8)\n• Anycast: One-to-nearest\n\nAddress Notation:\n• Hexadecimal separated by colons\n• Example: 2001:0db8:85a3:0000:0000:8a2e:0370:7334\n• Compression: 2001:db8:85a3::8a2e:370:7334\n\nTransition Mechanisms:\n• Dual stack (IPv4 and IPv6)\n• Tunneling (6to4, Teredo)\n• Translation (NAT64)',
                    type: 'text'
                },
                {
                    id: 'tcp-5',
                    title: 'TCP - Reliable Transport',
                    content: 'TCP Characteristics\n\nConnection-Oriented:\n• Three-way handshake establishment\n• Four-way handshake termination\n• Maintains connection state\n\nReliability Features:\n• Sequence Numbers: Order packets correctly\n• Acknowledgments: Confirm receipt\n• Retransmission: Resend lost packets\n• Checksums: Detect corruption\n\nFlow Control:\n• Window Size: Controls data flow rate\n• Sliding Window: Efficient data transfer\n• Zero Window: Stop transmission when buffer full\n\nCongestion Control:\n• Slow Start: Gradually increase sending rate\n• Congestion Avoidance: Linear increase\n• Fast Retransmit: Quick loss detection\n• Fast Recovery: Efficient recovery\n\nTCP Header Fields:\n• Source/Destination ports (16 bits each)\n• Sequence number (32 bits)\n• Acknowledgment number (32 bits)\n• Window size (16 bits)\n• Flags: SYN, ACK, FIN, RST, PSH, URG\n\nCommon TCP Applications:\n• HTTP/HTTPS (web browsing)\n• FTP (file transfer)\n• SMTP (email)\n• SSH (secure shell)\n• Telnet (remote terminal)',
                    type: 'text'
                },
                {
                    id: 'tcp-6',
                    title: 'UDP and Other Transport Protocols',
                    content: 'UDP (User Datagram Protocol)\n\nCharacteristics:\n• Connectionless: No session establishment\n• Unreliable: No delivery guarantee\n• Fast: Minimal overhead\n• Simple: Basic error detection only\n\nUDP Header (8 bytes):\n• Source port (2 bytes)\n• Destination port (2 bytes)\n• Length (2 bytes)\n• Checksum (2 bytes)\n\nWhen to Use UDP:\n• Real-time applications (video, audio)\n• Simple request-response (DNS)\n• Broadcast/multicast traffic\n• Applications handling their own reliability\n\nUDP Applications:\n• DNS: Domain name resolution\n• DHCP: IP address assignment\n• SNMP: Network management\n• VoIP: Voice communication\n• Gaming: Real-time multiplayer\n• Video Streaming: Live broadcasts\n\nOther Transport Protocols:\n• SCTP: Stream Control Transmission Protocol\n  - Multi-homing support\n  - Multiple streams\n  - Message-oriented\n• DCCP: Datagram Congestion Control Protocol\n  - Unreliable but congestion-controlled\n• QUIC: Quick UDP Internet Connections\n  - Google-developed\n  - HTTP/3 foundation\n  - Reduced latency',
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
                    content: 'Network Device Categories:\n\nLayer 1 Devices (Physical)\n• Hubs, repeaters, cables, connectors\n• Signal amplification and regeneration\n\nLayer 2 Devices (Data Link)\n• Switches, bridges, access points\n• Frame forwarding based on MAC addresses\n\nLayer 3 Devices (Network)\n• Routers, layer 3 switches\n• Packet routing based on IP addresses\n\nLayer 4-7 Devices (Application)\n• Firewalls, load balancers, proxies\n• Application-aware processing\n\nHybrid Devices:\n• Most modern devices operate at multiple layers\n• Example: Layer 3 switches combine switching and routing',
                    type: 'text'
                },
                {
                    id: 'devices-2',
                    title: 'Switches - Layer 2 Intelligence',
                    content: 'Switch Operation:\n\nMAC Address Learning:\n1. Receive frame on a port\n2. Learn source MAC address\n3. Add MAC-to-port mapping to table\n4. Forward frame based on destination MAC\n\nForwarding Decisions:\n• Known Unicast: Forward to specific port\n• Unknown Unicast: Flood to all ports except source\n• Broadcast: Forward to all ports except source\n• Multicast: Forward to registered ports\n\nSwitch Types:\n• Unmanaged: Basic plug-and-play operation\n• Managed: Configuration, VLANs, monitoring\n• Layer 3: Routing capabilities added\n\nAdvanced Features:\n• VLANs: Virtual network segmentation\n• STP: Spanning Tree Protocol (loop prevention)\n• Port Mirroring: Traffic analysis\n• QoS: Quality of Service prioritization\n• PoE: Power over Ethernet\n\nPerformance Metrics:\n• Switching Capacity: Total throughput\n• Forwarding Rate: Packets per second\n• MAC Address Table Size: Learning capacity',
                    type: 'text'
                },
                {
                    id: 'devices-3',
                    title: 'Routers - Layer 3 Intelligence',
                    content: 'Router Functions:\n\nPrimary Responsibilities:\n• Path Selection: Choose best route to destination\n• Packet Forwarding: Move packets between networks\n• Network Segmentation: Separate broadcast domains\n• Protocol Translation: Convert between different protocols\n\nRouting Table Components:\n• Destination Network: Target network address\n• Next Hop: IP address of next router\n• Interface: Outgoing port\n• Metric: Cost or preference\n• Administrative Distance: Route reliability\n\nRouting Types:\n• Static Routing: Manually configured routes\n  - Pros: Predictable, secure, low overhead\n  - Cons: Not scalable, manual maintenance\n• Dynamic Routing: Automatically learned routes\n  - Pros: Scalable, adaptive, automatic updates\n  - Cons: Complex, overhead, potential security risks\n\nRouter Components:\n• CPU: Process routing protocols\n• RAM: Store routing tables and running config\n• NVRAM: Store startup configuration\n• Flash: Store operating system\n• Interfaces: Connect to networks',
                    type: 'text'
                },
                {
                    id: 'devices-4',
                    title: 'VLANs and Inter-VLAN Routing',
                    content: 'Virtual LANs (VLANs)\n\nVLAN Benefits:\n• Logical Segmentation: Group users by function, not location\n• Broadcast Control: Limit broadcast domains\n• Security: Isolate sensitive traffic\n• Flexibility: Easy reconfiguration\n• Cost Reduction: Reduce need for physical changes\n\nVLAN Types:\n• Data VLAN: User traffic\n• Voice VLAN: VoIP traffic\n• Management VLAN: Switch management\n• Native VLAN: Untagged traffic on trunks\n\nVLAN Implementation:\n• Access Ports: Belong to single VLAN\n• Trunk Ports: Carry multiple VLANs\n• 802.1Q Tagging: VLAN identification standard\n\nInter-VLAN Routing:\n• Router-on-a-Stick: Single router interface with subinterfaces\n• Layer 3 Switch: Built-in routing capabilities\n• Dedicated Router: Separate router for each VLAN\n\nVLAN Configuration Example:\n```\n! Create VLAN\nvlan 10\n name Sales\nvlan 20\n name Marketing\n\n! Assign ports\ninterface fa0/1\n switchport mode access\n switchport access vlan 10\n```',
                    type: 'text'
                },
                {
                    id: 'devices-5',
                    title: 'Wireless Networking Infrastructure',
                    content: 'Wireless LAN Components:\n\nAccess Points (APs):\n• Bridge between wireless and wired networks\n• Provide radio coverage for client devices\n• Handle authentication and encryption\n\nWireless Controllers:\n• Centralized management of multiple APs\n• Consistent policy enforcement\n• Seamless roaming support\n\n802.11 Standards:\n• 802.11a: 5 GHz, 54 Mbps\n• 802.11b: 2.4 GHz, 11 Mbps\n• 802.11g: 2.4 GHz, 54 Mbps\n• 802.11n: 2.4/5 GHz, 600 Mbps (MIMO)\n• 802.11ac: 5 GHz, 6.9 Gbps (Wave 2)\n• 802.11ax (WiFi 6): 2.4/5 GHz, 9.6 Gbps\n\nSecurity Methods:\n• WEP: Wired Equivalent Privacy (deprecated)\n• WPA: WiFi Protected Access\n• WPA2: AES encryption (current standard)\n• WPA3: Enhanced security features\n• Enterprise: 802.1X authentication\n\nFrequency Bands:\n• 2.4 GHz: Longer range, more interference\n• 5 GHz: Higher speed, shorter range\n• 6 GHz: WiFi 6E, least congested',
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
                    content: 'Distance Vector Protocols:\n\nCharacteristics:\n• Share routing table with neighbors\n• Use hop count or metrics\n• Periodic updates\n• Simple to configure\n\nExamples:\n• RIP (Routing Information Protocol)\n  - Maximum 15 hops\n  - Updates every 30 seconds\n  - Simple metric (hop count)\n• EIGRP (Enhanced Interior Gateway Routing Protocol)\n  - Cisco proprietary\n  - Composite metric\n  - Fast convergence\n\nLink State Protocols:\n\nCharacteristics:\n• Maintain topology database\n• Flood link state advertisements\n• Calculate shortest path tree\n• Fast convergence\n\nExamples:\n• OSPF (Open Shortest Path First)\n  - Dijkstra algorithm\n  - Area-based hierarchy\n  - Cost-based metric\n• IS-IS (Intermediate System to Intermediate System)\n  - Similar to OSPF\n  - Used in large service provider networks',
                    type: 'text'
                },
                {
                    id: 'routing-2',
                    title: 'OSPF - Open Shortest Path First',
                    content: 'OSPF Overview:\n\nKey Features:\n• Link State Protocol: Maintains complete topology\n• Hierarchical Design: Areas reduce complexity\n• Fast Convergence: Rapid response to changes\n• Load Balancing: Equal-cost path support\n• Authentication: Secure routing updates\n\nOSPF Areas:\n• Area 0: Backbone area (mandatory)\n• Standard Areas: Connect to backbone\n• Stub Areas: No external routes\n• NSSA: Not-So-Stubby Areas\n\nLSA Types:\n• Type 1: Router LSA\n• Type 2: Network LSA\n• Type 3: Summary LSA\n• Type 4: ASBR Summary LSA\n• Type 5: External LSA\n\nOSPF Process:\n1. Neighbor Discovery: Hello packets\n2. Database Synchronization: LSA exchange\n3. SPF Calculation: Dijkstra algorithm\n4. Routing Table Update: Install best paths\n\nMetric Calculation:\n• Cost = Reference Bandwidth / Interface Bandwidth\n• Default reference: 100 Mbps\n• Lower cost = preferred path',
                    type: 'text'
                },
                {
                    id: 'routing-3',
                    title: 'BGP - Border Gateway Protocol',
                    content: 'BGP Overview:\n\nPurpose:\n• Inter-domain routing: Between different organizations\n• Policy-based routing: Business relationships\n• Path vector protocol: AS path information\n• Internet backbone: Core internet routing\n\nBGP Concepts:\n• Autonomous System (AS): Administrative domain\n• AS Numbers: 16-bit or 32-bit identifiers\n• BGP Sessions: TCP connections between peers\n• Path Attributes: Routing decision factors\n\nBGP Peer Types:\n• eBGP: External BGP (between different AS)\n• iBGP: Internal BGP (within same AS)\n• Route Reflectors: iBGP scalability\n• Confederations: AS subdivision\n\nPath Selection Process:\n1. Weight: Cisco proprietary (highest preferred)\n2. Local Preference: AS-wide preference\n3. Origin: IGP > EGP > Incomplete\n4. AS Path Length: Shorter preferred\n5. MED: Multi-Exit Discriminator\n6. Neighbor Type: eBGP > iBGP\n7. IGP Metric: Lowest to BGP next hop\n\nBGP Applications:\n• Internet service providers\n• Enterprise multi-homing\n• Content delivery networks\n• Cloud service providers',
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
                    content: 'CIA Triad:\n\nConfidentiality:\n• Information accessible only to authorized users\n• Encryption, access controls, authentication\n\nIntegrity:\n• Data remains accurate and unmodified\n• Digital signatures, checksums, hashing\n\nAvailability:\n• Systems and data accessible when needed\n• Redundancy, backups, DDoS protection\n\nAdditional Principles:\n• Authentication: Verify user identity\n• Authorization: Grant appropriate permissions\n• Accounting: Log and monitor activities\n• Non-repudiation: Prevent denial of actions\n\nDefense in Depth:\n• Multiple layers of security controls\n• Physical, network, host, application, data layers\n• Redundant protection mechanisms\n• Fail-safe design principles\n\nRisk Management:\n• Risk = Threat × Vulnerability × Impact\n• Risk assessment and analysis\n• Risk mitigation strategies\n• Residual risk acceptance',
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
                    content: 'Systematic Approach:\n\n1. Problem Identification:\n• Gather symptoms and user reports\n• Define problem scope and impact\n• Establish baseline measurements\n• Document initial observations\n\n2. Information Gathering:\n• Network topology and configuration\n• Recent changes or maintenance\n• Error logs and monitoring data\n• Environmental factors\n\n3. Hypothesis Development:\n• List possible causes\n• Prioritize based on probability\n• Consider OSI layer implications\n• Apply Occam\'s razor principle\n\n4. Testing and Isolation:\n• Test one variable at a time\n• Use divide-and-conquer approach\n• Isolate network segments\n• Validate test results\n\n5. Solution Implementation:\n• Plan implementation steps\n• Consider impact on operations\n• Implement during maintenance windows\n• Document changes made\n\n6. Verification and Documentation:\n• Verify problem resolution\n• Monitor for recurring issues\n• Update documentation\n• Conduct post-incident review',
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
                    content: 'SDN Overview:\n\nTraditional vs SDN:\n• Traditional: Distributed control plane in each device\n• SDN: Centralized control plane with programmable interfaces\n\nSDN Architecture:\n\nApplication Layer:\n• Business applications\n• Network services\n• Orchestration platforms\n\nControl Layer:\n• SDN Controller: Centralized brain\n• Network operating system\n• Global network view\n\nInfrastructure Layer:\n• OpenFlow Switches: Programmable forwarding\n• Flow tables and actions\n• Statistical information\n\nSDN Benefits:\n• Centralized Management: Single point of control\n• Programmability: Custom applications\n• Flexibility: Dynamic network changes\n• Cost Reduction: Commodity hardware\n• Innovation: Rapid service deployment\n\nOpenFlow Protocol:\n• Communication between controller and switches\n• Flow-based forwarding\n• Granular traffic control\n• Match-action paradigm\n\nSDN Use Cases:\n• Data center networking\n• Campus networks\n• WAN optimization\n• Network function virtualization',
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
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_data_courses_computer-networks_ts_1ff2d6ee._.js.map