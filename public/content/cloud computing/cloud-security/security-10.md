---
id: security-10
title: "DDoS Protection"
type: text
---

# DDoS Protection

Distributed Denial of Service (DDoS) attacks overwhelm services with traffic. Cloud providers offer protection mechanisms.

## Types of DDoS Attacks

**Volumetric Attacks**:
- UDP floods
- ICMP floods
- DNS amplification
- Goal: Consume bandwidth

**Protocol Attacks**:
- SYN floods
- Ping of death
- Smurf attack
- Goal: Exhaust server resources

**Application Layer Attacks**:
- HTTP floods
- Slowloris
- Zero-day exploits
- Goal: Crash applications

## Cloud DDoS Protection

### AWS Shield

**AWS Shield Standard**:
- Free, automatic protection
- Network and transport layers (L3/L4)
- CloudFront and Route 53 protection
- Common attacks mitigated

**AWS Shield Advanced**:
- $3,000/month
- Enhanced detection
- DDoS Response Team (DRT)
- Cost protection
- CloudWatch metrics
- Application layer protection

### Azure DDoS Protection

**Basic Tier**:
- Included with Azure
- Always-on monitoring
- Automatic mitigation
- Platform-level protection

**Standard Tier**:
- Tuned to Azure VNet
- Adaptive tuning
- Attack analytics
- Mitigation policies
- 24/7 support

### Google Cloud Armor

**DDoS Protection**:
- Included with Cloud Load Balancing
- Automatic detection
- Global anycast network
- Absorbs large attacks
- WAF capabilities

## DDoS Mitigation Strategies

**Infrastructure Level**:
- Use CDN (CloudFront, Azure CDN)
- Distribute across regions
- Auto-scaling
- Load balancing

**Network Level**:
- Rate limiting
- Geo-blocking
- IP blacklisting/whitelisting
- Connection limits

**Application Level**:
- Caching
- Request filtering
- CAPTCHAs
- API rate limiting

## Detection and Response

**Monitoring**:
```
Indicators of DDoS:
- Unusual traffic spikes
- High network utilization
- Increased error rates
- Slow response times
- Service unavailability
```

**Response Plan**:
1. Detect anomaly
2. Verify attack
3. Enable advanced protection
4. Contact support/DRT
5. Document incident
6. Post-incident review

## Best Practices

**Prevention**:
- Use cloud DDoS protection services
- Implement rate limiting
- Deploy WAF
- Use load balancers
- Design for redundancy

**Architecture**:
```
Internet
    ↓
CDN/CloudFront (Layer 7)
    ↓
WAF (Application filtering)
    ↓
Load Balancer (Distribution)
    ↓
Auto-Scaling Group (Absorption)
    ↓
Application Servers
```

**Preparation**:
- DDoS response plan
- Runbooks and procedures
- Contact information
- Regular drills
- Monitoring and alerts

**Testing**:
- Load testing
- Stress testing
- Failover testing
- Don't test live without permission!

## Cost Considerations

- Data transfer during attack
- Shield Advanced costs
- Additional resources from auto-scaling
- Cost protection (Shield Advanced)

DDoS protection is essential for internet-facing applications in the cloud.
