---
id: advanced-8
title: Edge Computing Platforms and CDN
type: text
---

# Edge Computing Platforms and CDN

## Overview

Content Delivery Networks (CDNs) and edge platforms enable global distribution of content and compute capabilities. This lesson explores major platforms and how to leverage them for performance and scalability.

## Content Delivery Networks (CDN)

### CDN Architecture

```
┌──────────────────────────────────────────┐
│         Origin Server (Cloud)            │
│  - Source of truth                       │
│  - Dynamic content generation            │
└───────────────┬──────────────────────────┘
                │
        ┌───────┴────────┐
        │                │
┌───────▼──────┐  ┌──────▼────────┐
│  Edge POP    │  │   Edge POP    │
│  (US East)   │  │   (EU West)   │
└───────┬──────┘  └──────┬────────┘
        │                │
   ┌────┴────┐      ┌────┴────┐
   │ Users   │      │ Users   │
   └─────────┘      └─────────┘
```

### How CDNs Work

1. **Request Routing**: DNS directs users to nearest edge
2. **Cache Check**: Edge checks for cached content
3. **Cache Hit**: Serve directly from edge (fast)
4. **Cache Miss**: Fetch from origin, cache, then serve
5. **Cache Invalidation**: Remove/update stale content

## Major CDN Platforms

### 1. CloudFlare

**Basic Setup**
```javascript
// Cloudflare Workers - Edge compute
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  // Get user location from Cloudflare
  const country = request.cf.country;
  const city = request.cf.city;
  
  // Customize response based on location
  const content = await generateLocalizedContent(country);
  
  // Add custom headers
  return new Response(content, {
    headers: {
      'Content-Type': 'text/html',
      'X-Edge-Location': city,
      'Cache-Control': 'public, max-age=3600'
    }
  });
}

async function generateLocalizedContent(country) {
  // Fetch from KV store (edge storage)
  const template = await CONTENT_STORE.get(`template_${country}`);
  return template || await CONTENT_STORE.get('template_default');
}
```

**Advanced Caching**
```javascript
// Cloudflare Cache API
addEventListener('fetch', event => {
  event.respondWith(handleCaching(event.request));
});

async function handleCaching(request) {
  const cache = caches.default;
  const cacheKey = new Request(request.url, request);
  
  // Check cache first
  let response = await cache.match(cacheKey);
  
  if (!response) {
    // Cache miss - fetch from origin
    response = await fetch(request);
    
    // Custom cache rules
    if (response.ok && shouldCache(request, response)) {
      // Clone before caching (response body can only be read once)
      response = new Response(response.body, response);
      
      // Add cache headers
      response.headers.set('Cache-Control', 'public, max-age=86400');
      response.headers.set('X-Cache-Status', 'MISS');
      
      // Store in cache
      event.waitUntil(cache.put(cacheKey, response.clone()));
    }
  } else {
    response.headers.set('X-Cache-Status', 'HIT');
  }
  
  return response;
}

function shouldCache(request, response) {
  // Don't cache errors
  if (!response.ok) return false;
  
  // Don't cache POST requests
  if (request.method !== 'GET') return false;
  
  // Check content type
  const contentType = response.headers.get('Content-Type');
  const cacheableTypes = ['text/html', 'application/json', 'text/css'];
  
  return cacheableTypes.some(type => contentType?.includes(type));
}
```

**Edge KV Storage**
```javascript
// Workers KV - Distributed key-value storage
addEventListener('fetch', event => {
  event.respondWith(handleKV(event.request));
});

async function handleKV(request) {
  const url = new URL(request.url);
  
  if (url.pathname.startsWith('/api/config')) {
    // Read from KV (replicated globally)
    const config = await CONFIG_KV.get('app_config', { type: 'json' });
    
    return new Response(JSON.stringify(config), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  if (url.pathname === '/api/counter') {
    // Atomic increment with metadata
    const count = await ANALYTICS_KV.get('page_views');
    const newCount = (parseInt(count) || 0) + 1;
    
    await ANALYTICS_KV.put('page_views', newCount.toString(), {
      metadata: { lastUpdated: new Date().toISOString() }
    });
    
    return new Response(JSON.stringify({ count: newCount }));
  }
}
```

### 2. AWS CloudFront and Lambda@Edge

**CloudFront Distribution**
```yaml
# CloudFormation template
AWSTemplateFormatVersion: '2010-09-09'
Resources:
  MyDistribution:
    Type: AWS::CloudFront::Distribution
    Properties:
      DistributionConfig:
        Enabled: true
        Origins:
          - Id: MyS3Origin
            DomainName: my-bucket.s3.amazonaws.com
            S3OriginConfig:
              OriginAccessIdentity: !Sub 'origin-access-identity/cloudfront/${OAI}'
        DefaultCacheBehavior:
          TargetOriginId: MyS3Origin
          ViewerProtocolPolicy: redirect-to-https
          CachePolicyId: 658327ea-f89d-4fab-a63d-7e88639e58f6 # Managed-CachingOptimized
          LambdaFunctionAssociations:
            - EventType: viewer-request
              LambdaFunctionARN: !Ref ViewerRequestFunction.Version
            - EventType: origin-response
              LambdaFunctionARN: !Ref OriginResponseFunction.Version
```

**Lambda@Edge Functions**
```javascript
// Viewer Request - Run before checking cache
exports.handler = async (event) => {
  const request = event.Records[0].cf.request;
  const headers = request.headers;
  
  // A/B Testing at edge
  const abTest = Math.random() < 0.5 ? 'A' : 'B';
  headers['x-ab-test'] = [{ key: 'X-AB-Test', value: abTest }];
  
  // Modify URI based on device type
  const userAgent = headers['user-agent'][0].value;
  if (isMobileDevice(userAgent)) {
    request.uri = request.uri.replace(/^\//, '/mobile/');
  }
  
  // Add authentication check
  const auth = headers['authorization'];
  if (!auth || !validateToken(auth[0].value)) {
    return {
      status: '401',
      statusDescription: 'Unauthorized',
      headers: {
        'www-authenticate': [{ key: 'WWW-Authenticate', value: 'Bearer' }]
      }
    };
  }
  
  return request;
};

// Origin Response - Modify response from origin
exports.originResponseHandler = async (event) => {
  const response = event.Records[0].cf.response;
  const headers = response.headers;
  
  // Add security headers
  headers['strict-transport-security'] = [{
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains'
  }];
  
  headers['x-content-type-options'] = [{
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  }];
  
  headers['x-frame-options'] = [{
    key: 'X-Frame-Options',
    value: 'DENY'
  }];
  
  // Add custom cache control
  if (response.status === '200') {
    headers['cache-control'] = [{
      key: 'Cache-Control',
      value: 'public, max-age=86400, s-maxage=31536000'
    }];
  }
  
  return response;
};
```

**CloudFront Functions (Lightweight)**
```javascript
// CloudFront Function - Even lower latency than Lambda@Edge
function handler(event) {
  var request = event.request;
  var uri = request.uri;
  
  // Redirect old URLs
  if (uri.startsWith('/old-path/')) {
    return {
      statusCode: 301,
      statusDescription: 'Moved Permanently',
      headers: {
        'location': { value: uri.replace('/old-path/', '/new-path/') }
      }
    };
  }
  
  // Add index.html to directory requests
  if (uri.endsWith('/')) {
    request.uri += 'index.html';
  }
  
  // Normalize URLs (remove trailing slashes)
  else if (uri.includes('.') === false && uri.endsWith('/') === false) {
    return {
      statusCode: 301,
      statusDescription: 'Moved Permanently',
      headers: {
        'location': { value: uri + '/' }
      }
    };
  }
  
  return request;
}
```

### 3. Azure CDN and Front Door

**Azure Front Door Configuration**
```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "resources": [
    {
      "type": "Microsoft.Network/frontDoors",
      "apiVersion": "2020-05-01",
      "name": "myFrontDoor",
      "location": "global",
      "properties": {
        "enabledState": "Enabled",
        "routingRules": [
          {
            "name": "routingRule1",
            "properties": {
              "frontendEndpoints": [
                { "id": "[resourceId('frontendEndpoints', 'frontendEndpoint1')]" }
              ],
              "acceptedProtocols": ["Https"],
              "patternsToMatch": ["/*"],
              "routeConfiguration": {
                "@odata.type": "#Microsoft.Azure.FrontDoor.Models.FrontdoorForwardingConfiguration",
                "forwardingProtocol": "HttpsOnly",
                "backendPool": {
                  "id": "[resourceId('backendPools', 'backendPool1')]"
                }
              }
            }
          }
        ],
        "backendPools": [
          {
            "name": "backendPool1",
            "properties": {
              "backends": [
                {
                  "address": "myapp.azurewebsites.net",
                  "httpPort": 80,
                  "httpsPort": 443,
                  "priority": 1,
                  "weight": 100
                }
              ],
              "loadBalancingSettings": {
                "id": "[resourceId('loadBalancingSettings', 'loadBalancingSettings1')]"
              },
              "healthProbeSettings": {
                "id": "[resourceId('healthProbeSettings', 'healthProbeSettings1')]"
              }
            }
          }
        ]
      }
    }
  ]
}
```

**Azure CDN Rules Engine**
```javascript
// Azure CDN Standard Rules
const rules = {
  "rules": [
    {
      "name": "EnforceHTTPS",
      "order": 1,
      "conditions": [
        {
          "name": "RequestScheme",
          "parameters": {
            "operator": "Equal",
            "matchValues": ["HTTP"]
          }
        }
      ],
      "actions": [
        {
          "name": "UrlRedirect",
          "parameters": {
            "redirectType": "Moved",
            "destinationProtocol": "Https"
          }
        }
      ]
    },
    {
      "name": "CacheStaticAssets",
      "order": 2,
      "conditions": [
        {
          "name": "UrlFileExtension",
          "parameters": {
            "operator": "Contains",
            "matchValues": ["jpg", "png", "css", "js"]
          }
        }
      ],
      "actions": [
        {
          "name": "CacheExpiration",
          "parameters": {
            "cacheBehavior": "SetIfMissing",
            "cacheType": "All",
            "cacheDuration": "7.00:00:00"
          }
        }
      ]
    }
  ]
};
```

### 4. Google Cloud CDN

**Cloud CDN with Load Balancer**
```python
# Python - Configure Cloud CDN
from google.cloud import compute_v1

def setup_cloud_cdn():
    backend_services_client = compute_v1.BackendServicesClient()
    
    # Create backend service with CDN enabled
    backend_service = compute_v1.BackendService(
        name="my-backend-service",
        backends=[
            compute_v1.Backend(
                group="instance-group-url",
                balancing_mode="UTILIZATION",
                max_utilization=0.8
            )
        ],
        enable_cdn=True,
        cdn_policy=compute_v1.BackendServiceCdnPolicy(
            cache_mode="CACHE_ALL_STATIC",
            default_ttl=3600,
            max_ttl=86400,
            client_ttl=3600,
            negative_caching=True,
            cache_key_policy=compute_v1.CacheKeyPolicy(
                include_host=True,
                include_protocol=True,
                include_query_string=True,
                query_string_whitelist=["lang", "format"]
            )
        )
    )
    
    operation = backend_services_client.insert(
        project="my-project",
        backend_service_resource=backend_service
    )
    
    return operation
```

**Cloud CDN Cache Control**
```python
# Flask application with Cloud CDN
from flask import Flask, make_response
import datetime

app = Flask(__name__)

@app.route('/static-content')
def static_content():
    """Cacheable static content"""
    response = make_response(render_template('static.html'))
    
    # Cache for 1 hour at CDN, 10 minutes at browser
    response.headers['Cache-Control'] = 'public, max-age=600, s-maxage=3600'
    
    # Add ETag for validation
    etag = generate_etag(content)
    response.headers['ETag'] = etag
    
    return response

@app.route('/dynamic-content')
def dynamic_content():
    """Per-user dynamic content"""
    response = make_response(render_user_content())
    
    # Don't cache at CDN, but allow browser cache
    response.headers['Cache-Control'] = 'private, max-age=300'
    response.headers['Vary'] = 'Cookie'
    
    return response

@app.route('/api/data')
def api_data():
    """API with custom cache key"""
    user_tier = request.args.get('tier', 'free')
    
    data = get_data_for_tier(user_tier)
    response = make_response(jsonify(data))
    
    # Cache per tier
    response.headers['Cache-Control'] = 'public, max-age=300'
    response.headers['Vary'] = 'Accept-Encoding'
    response.headers['X-Cache-Key'] = f'tier-{user_tier}'
    
    return response
```

## Edge Computing Platforms

### 1. Fastly Compute@Edge

**Rust-based Edge Compute**
```rust
// Fastly Compute@Edge using Rust
use fastly::http::{header, Method, StatusCode};
use fastly::{Error, Request, Response};

#[fastly::main]
fn main(req: Request) -> Result<Response, Error> {
    // Route based on path
    match req.get_path() {
        "/api/hello" => handle_hello(req),
        "/api/proxy" => handle_proxy(req),
        _ => Ok(Response::from_status(StatusCode::NOT_FOUND)),
    }
}

fn handle_hello(req: Request) -> Result<Response, Error> {
    // Get client IP from Fastly headers
    let client_ip = req
        .get_header_str("Fastly-Client-IP")
        .unwrap_or("unknown");
    
    // Get geolocation data
    let geo = req.get_geo_info().unwrap();
    
    let body = format!(
        "Hello from edge! IP: {}, Country: {}",
        client_ip, geo.country_code()
    );
    
    Ok(Response::from_body(body)
        .with_status(StatusCode::OK)
        .with_header(header::CONTENT_TYPE, "text/plain"))
}

fn handle_proxy(mut req: Request) -> Result<Response, Error> {
    // Modify request before forwarding
    req.set_header("X-Edge-Processed", "true");
    
    // Send to backend
    let mut beresp = req.send("backend")?;
    
    // Modify response
    beresp.set_header("X-Served-By", "Fastly-Edge");
    beresp.set_header("Cache-Control", "public, max-age=3600");
    
    Ok(beresp)
}
```

### 2. Vercel Edge Functions

**Next.js Edge Runtime**
```typescript
// Next.js Edge Function
import { NextRequest, NextResponse } from 'next/server';

export const config = {
  runtime: 'edge',
};

export default async function handler(req: NextRequest) {
  const { geo, ip } = req;
  
  // Personalize based on location
  const greeting = getGreeting(geo?.country);
  
  // A/B testing at edge
  const variant = selectVariant(ip);
  
  // Rewrite to different page based on variant
  if (variant === 'B') {
    return NextResponse.rewrite(new URL('/variant-b', req.url));
  }
  
  return NextResponse.json({
    greeting,
    variant,
    country: geo?.country,
    city: geo?.city,
  });
}

function getGreeting(country?: string): string {
  const greetings: Record<string, string> = {
    'US': 'Hello',
    'ES': 'Hola',
    'FR': 'Bonjour',
    'DE': 'Guten Tag',
  };
  
  return greetings[country || 'US'] || 'Hello';
}

function selectVariant(ip?: string): 'A' | 'B' {
  // Consistent variant based on IP hash
  const hash = simpleHash(ip || '');
  return hash % 2 === 0 ? 'A' : 'B';
}
```

**Edge Middleware**
```typescript
// middleware.ts - Runs on all requests
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Authentication check at edge
  const token = request.cookies.get('auth_token');
  
  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // Add security headers
  const response = NextResponse.next();
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Rate limiting (simplified)
  const ip = request.ip || 'unknown';
  if (isRateLimited(ip)) {
    return new NextResponse('Too Many Requests', { status: 429 });
  }
  
  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
```

## Cache Strategies and Optimization

### 1. Cache Invalidation

```python
# Python - Invalidate CloudFront cache
import boto3
import time

cloudfront = boto3.client('cloudfront')

def invalidate_cache(distribution_id, paths):
    """Invalidate specific paths in CloudFront"""
    
    invalidation = cloudfront.create_invalidation(
        DistributionId=distribution_id,
        InvalidationBatch={
            'Paths': {
                'Quantity': len(paths),
                'Items': paths
            },
            'CallerReference': str(time.time())
        }
    )
    
    return invalidation

# Invalidate on deployment
invalidate_cache(
    'E1234EXAMPLE',
    ['/index.html', '/static/css/*', '/static/js/*']
)
```

### 2. Stale-While-Revalidate

```javascript
// Serve stale content while updating cache
addEventListener('fetch', event => {
  event.respondWith(staleWhileRevalidate(event.request));
});

async function staleWhileRevalidate(request) {
  const cache = await caches.open('v1');
  const cachedResponse = await cache.match(request);
  
  // Fetch fresh version in background
  const fetchPromise = fetch(request).then(response => {
    cache.put(request, response.clone());
    return response;
  });
  
  // Return cached version immediately if available
  return cachedResponse || fetchPromise;
}
```

## Key Takeaways

1. **CDNs cache content globally** for faster delivery
2. **Edge compute** enables processing closer to users
3. **Major platforms**: CloudFlare, AWS CloudFront, Azure Front Door, Google Cloud CDN
4. **Use cases**: Static/dynamic content, API acceleration, security, personalization
5. **Cache strategies**: TTL, invalidation, stale-while-revalidate
6. **Edge functions** can modify requests/responses in real-time

## Next Steps

- Implement edge authentication and authorization
- Explore edge databases (CloudFlare D1, Supabase)
- Learn advanced caching patterns
