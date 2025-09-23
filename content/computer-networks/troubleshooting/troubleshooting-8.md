---
id: troubleshooting-8
title: Transport Layer Troubleshooting
type: text
---

## Transport Layer Overview

The transport layer provides reliable or unreliable delivery between applications using TCP or UDP protocols. Issues at this layer affect application connectivity and data integrity.

## Common Transport Layer Issues

### TCP Connection Problems

**Connection Establishment Issues:**
- **Three-way handshake failures**: SYN, SYN-ACK, ACK problems
- **Port blocking**: Firewall or ACL blocking
- **Service not listening**: Application not bound to port
- **Connection timeouts**: Slow or unresponsive services
- **Maximum connection limits**: Server capacity exceeded

**Connection Maintenance Issues:**
- **Connection drops**: Premature connection termination
- **Keep-alive failures**: Connection state problems
- **Window size issues**: Flow control problems
- **Retransmission problems**: Packet loss and recovery

### UDP Communication Issues

**UDP-Specific Problems:**
- **Packet loss**: No reliability mechanisms
- **Port unreachable**: Destination service unavailable
- **Fragmentation issues**: Large UDP packets fragmented
- **Firewall blocking**: UDP traffic filtering
- **Application timeouts**: No acknowledgment mechanism

### Port and Socket Issues

**Port-Related Problems:**
- **Port conflicts**: Multiple services on same port
- **Ephemeral port exhaustion**: Client-side port depletion
- **Well-known port conflicts**: Standard port conflicts
- **Dynamic port range issues**: NAT and firewall problems

## Troubleshooting Techniques

### Connection Testing

**TCP Port Testing:**
```bash
telnet hostname 80         # Test HTTP port
nc -zv hostname 443       # Test HTTPS port (netcat)
nmap -p 1-1000 hostname   # Port scan
```

**UDP Port Testing:**
```bash
nc -u hostname 53         # Test DNS port (UDP)
nmap -sU hostname         # UDP port scan
```

### Connection State Analysis

**Network Connection Commands:**
```bash
netstat -an               # All connections and listeners
netstat -an | grep :80    # Specific port connections
ss -tuln                  # Socket statistics (Linux)
lsof -i :80              # Process using specific port
```

**Connection States:**
- **LISTEN**: Server waiting for connections
- **ESTABLISHED**: Active connection
- **TIME_WAIT**: Connection closing gracefully
- **CLOSE_WAIT**: Waiting for application to close
- **FIN_WAIT**: Initiating connection close

### Packet Capture Analysis

**TCP Analysis with Wireshark:**
- **Handshake analysis**: SYN, SYN-ACK, ACK sequence
- **Window scaling**: TCP window size negotiation
- **Retransmissions**: Duplicate packets and timeouts
- **Connection termination**: FIN and RST packets

**Key TCP Flags:**
- **SYN**: Synchronize sequence numbers
- **ACK**: Acknowledgment of received data
- **FIN**: Finish connection gracefully
- **RST**: Reset connection immediately
- **PSH**: Push data to application
- **URG**: Urgent data pointer

## Diagnostic Scenarios

### Application Cannot Connect

**Symptoms:**
- Connection refused errors
- Connection timeout errors
- Service unavailable messages

**Diagnosis Steps:**
1. Verify service is running and listening
2. Check port accessibility
3. Test firewall rules
4. Analyze network path

**Troubleshooting Commands:**
```bash
netstat -ln | grep :80    # Check if service listening
telnet hostname 80        # Test connection
nmap -p 80 hostname      # Port scan test
```

### Slow Application Performance

**Symptoms:**
- High response times
- Application timeouts
- Poor throughput

**Diagnosis Steps:**
1. Analyze TCP window sizes
2. Check for packet retransmissions
3. Monitor connection establishment time
4. Examine application-level protocols

### Connection Drops

**Symptoms:**
- Frequent disconnections
- Connection reset messages
- Application reconnection attempts

**Diagnosis Steps:**
1. Monitor connection duration
2. Check for RST packets
3. Analyze keep-alive settings
4. Review firewall timeout settings

### Port Exhaustion

**Symptoms:**
- Cannot establish new connections
- Address already in use errors
- High port utilization

**Diagnosis Steps:**
1. Monitor ephemeral port usage
2. Check TIME_WAIT connections
3. Review application connection pooling
4. Analyze connection reuse patterns