---
id: troubleshooting-11
title: Network Security Troubleshooting
type: text
---

## Security-Related Network Issues

Network security devices and policies can create connectivity and performance issues that require specialized troubleshooting approaches.

## Common Security-Related Problems

### Firewall Issues

**Firewall Blocking Problems:**
- **Port blocking**: Required ports not open
- **Protocol restrictions**: Specific protocols blocked
- **Application blocking**: Deep packet inspection issues
- **Stateful connection tracking**: Connection state problems
- **NAT/PAT issues**: Address translation problems

**Firewall Configuration Errors:**
- **Rule ordering**: Incorrect rule precedence
- **Source/destination errors**: Wrong IP addresses
- **Time-based restrictions**: Scheduled access issues
- **User-based policies**: Identity-based problems

### Access Control Lists (ACLs)

**ACL-Related Issues:**
- **Implicit deny**: Traffic blocked by default
- **Rule conflicts**: Contradictory ACL entries
- **Direction problems**: Inbound vs. outbound rules
- **Interface application**: ACL applied to wrong interface
- **Wildcard mask errors**: Incorrect subnet matching

### VPN Connectivity Problems

**VPN Client Issues:**
- **Authentication failures**: Wrong credentials
- **Certificate problems**: Expired or invalid certificates
- **Tunnel establishment**: Phase 1/Phase 2 failures
- **Split tunneling**: Routing conflicts
- **Client software**: Version compatibility

**Site-to-Site VPN Issues:**
- **IKE/IPSec negotiation**: Protocol mismatch
- **Pre-shared keys**: Wrong or mismatched keys
- **Network routing**: Traffic not using tunnel
- **NAT traversal**: NAT-T configuration problems

## Security Troubleshooting Tools

### Firewall Analysis Tools

**Log Analysis:**
```bash
# Firewall log commands (varies by vendor)
show log firewall           # Cisco ASA
tail -f /var/log/iptables   # Linux iptables
Get-WinEvent FilterHashtable @{LogName='Security'}  # Windows
```

**Connection Testing:**
```bash
telnet destination port     # TCP port testing
nc -zv destination port     # Netcat port test
nmap -p port destination   # Port scanning
```

### VPN Troubleshooting Tools

**VPN Status Commands:**
```bash
show crypto isakmp sa      # Cisco IKE status
show crypto ipsec sa       # Cisco IPSec status
ipsec statusall            # StrongSwan status
```

**VPN Testing:**
```bash
ping -I vpn_interface destination  # Test through VPN
traceroute -i vpn_interface dest   # VPN path tracing
```

### Security Event Monitoring

**SIEM and Log Analysis:**
- **Centralized logging**: Syslog servers
- **Event correlation**: Pattern recognition
- **Anomaly detection**: Unusual traffic patterns
- **Threat intelligence**: Known bad actors

## Troubleshooting Methodology

### Security Policy Verification

**Step 1: Identify Security Path**
- Map traffic flow through security devices
- Identify all security policies affecting traffic
- Check for overlapping or conflicting rules
- Verify correct policy application order

**Step 2: Test Basic Connectivity**
- Test without security policies (if possible)
- Isolate security devices one by one
- Use tools that bypass security (carefully)
- Compare working vs. non-working traffic

**Step 3: Analyze Security Logs**
- Review firewall deny logs
- Check authentication logs
- Examine intrusion detection alerts
- Analyze VPN connection logs

### Common Security Scenarios

**Firewall Blocking Legitimate Traffic:**
1. Identify blocked traffic in firewall logs
2. Verify traffic matches business requirements
3. Create appropriate firewall rules
4. Test connectivity after rule implementation
5. Monitor for security implications

**VPN Connection Failures:**
1. Check VPN server reachability
2. Verify authentication credentials
3. Test Phase 1 IKE negotiation
4. Validate Phase 2 IPSec parameters
5. Check routing and NAT configuration

**Intrusion Detection False Positives:**
1. Analyze IDS/IPS alerts
2. Verify traffic legitimacy
3. Tune detection signatures
4. Adjust threshold settings
5. Whitelist legitimate traffic

## Network Access Control (NAC)

### 802.1X Authentication Issues

**Common 802.1X Problems:**
- **Certificate issues**: Client or server certificates
- **RADIUS configuration**: Authentication server setup
- **Switch configuration**: Port-based authentication
- **Supplicant problems**: Client software issues

**802.1X Troubleshooting:**
```bash
show dot1x all            # Cisco switch 802.1X status
show authentication        # Authentication status
debug dot1x events         # Real-time debugging
```

### MAC Address Filtering

**MAC Filtering Issues:**
- **Unknown devices**: New devices not in database
- **MAC spoofing**: Security bypass attempts
- **Dynamic updates**: Database synchronization
- **Guest access**: Temporary device access

## SSL/TLS Certificate Problems

### Certificate Validation Issues

**Common Certificate Problems:**
- **Expired certificates**: Time-based validation
- **Self-signed certificates**: Trust chain issues
- **Wrong common name**: Hostname mismatch
- **Revoked certificates**: Certificate revocation lists

**Certificate Troubleshooting:**
```bash
openssl s_client -connect server:443  # SSL connection test
openssl x509 -in cert.pem -text       # Certificate details
curl -vI https://server                # HTTPS connection test
```

### Chain of Trust Issues

**Trust Chain Problems:**
- **Missing intermediate certificates**: Incomplete chain
- **Root CA not trusted**: Certificate authority issues
- **Cross-signed certificates**: Multiple trust paths
- **Certificate pinning**: Application-specific validation

## DDoS and Attack Mitigation

### DDoS Detection and Response

**DDoS Symptoms:**
- **Network saturation**: Bandwidth exhaustion
- **Server overload**: CPU/memory exhaustion
- **Service unavailability**: Application timeouts
- **Asymmetric traffic**: Unusual traffic patterns

**DDoS Mitigation:**
- **Rate limiting**: Traffic throttling
- **Blackhole routing**: Drop malicious traffic
- **Content delivery networks**: Traffic distribution
- **Cloud-based protection**: Upstream filtering