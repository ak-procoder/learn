---
id: storage-18
title: "Content Delivery Networks (CDN)"
type: text
---

# Content Delivery Networks (CDN)

CDNs cache and deliver content from edge locations close to users, improving performance and reducing origin load.

## How CDNs Work

1. User requests content
2. Request routed to nearest edge location
3. If cached, content served from edge
4. If not cached, fetched from origin and cached
5. Subsequent requests served from cache

## CDN Benefits

**Performance**:
- Reduced latency
- Faster content delivery
- Better user experience

**Scalability**:
- Handle traffic spikes
- Distribute load globally
- Reduce origin load

**Cost Savings**:
- Lower bandwidth costs
- Reduced origin infrastructure
- Pay for edge traffic

**Availability**:
- DDoS protection
- Redundancy across locations
- Origin shielding

## Major CDN Services

**Amazon CloudFront**:
- 450+ edge locations
- Integration with AWS services
- Real-time metrics
- Lambda@Edge for compute

**Azure CDN**:
- Microsoft and Verizon networks
- Dynamic site acceleration
- Rules engine
- Azure integration

**Google Cloud CDN**:
- Anycast IP addresses
- Global load balancing
- HTTP/2 and QUIC support
- Cloud Armor integration

**Cloudflare**:
- Extensive edge network
- Free tier available
- DDoS protection
- Workers for edge computing

## Cacheable Content

**Static Assets**:
- Images, CSS, JavaScript
- Videos and audio
- Downloads
- Fonts

**Dynamic Content**:
- API responses (with TTL)
- Personalized content
- Edge computing results

## Cache Control

```http
Cache-Control: public, max-age=3600
Cache-Control: private, no-cache
Cache-Control: no-store
```

CDNs are essential for global content delivery and performance optimization.
