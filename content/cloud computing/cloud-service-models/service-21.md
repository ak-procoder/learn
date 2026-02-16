---
id: service-21
title: Service Model Performance Monitoring
type: text
---

## Monitoring Across Service Models

Each service model requires different monitoring approaches.

## IaaS Monitoring

**Infrastructure Metrics**:
- CPU utilization
- Memory usage
- Disk I/O
- Network throughput
- Instance health

**Tools**:
- AWS CloudWatch
- Azure Monitor
- Google Cloud Monitoring
- Datadog, New Relic

**Custom Monitoring**:
- Application-level metrics
- Business KPIs
- Custom dashboards
- Alert configuration

## PaaS Monitoring

**Platform Metrics**:
- Request rates
- Response times
- Error rates
- Resource consumption

**Application Performance**:
- Code-level profiling
- Dependency tracking
- Transaction tracing
- Memory leaks

**Built-in Tools**:
- Azure Application Insights
- AWS X-Ray
- Google Cloud Trace

## SaaS Monitoring

**Limited Visibility**:
- User-facing metrics only
- Uptime monitoring
- API performance
- Usage statistics

**Provider Dashboards**:
- Service health status
- Usage reports
- Performance metrics
- Billing information

**Third-Party Monitoring**:
- External uptime monitors (Pingdom, StatusCake)
- API performance tracking
- User experience monitoring

## Monitoring Best Practices

**Set Baselines**: Understand normal behavior
**Define SLIs/SLOs**: Service level indicators and objectives
**Alert Thoughtfully**: Avoid alert fatigue
**Monitor User Experience**: End-to-end perspective
**Track Business Metrics**: Revenue, conversions, etc.
**Regular Reviews**: Adjust monitoring as needs change

## Observability

**Three Pillars**:
- **Logs**: Detailed event records
- **Metrics**: Numerical measurements
- **Traces**: Request paths through distributed systems

**Modern Approach**: Correlate all three for complete picture
