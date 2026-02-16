---
id: virt-25
title: "Cloud-Native Application Patterns"
type: text
---

# Cloud-Native Application Patterns

Cloud-native patterns help build resilient, scalable applications optimized for container platforms.

## 12-Factor App Principles

1. **Codebase**: One codebase in version control
2. **Dependencies**: Explicitly declare dependencies
3. **Config**: Store config in environment
4. **Backing Services**: Treat as attached resources
5. **Build, Release, Run**: Separate stages
6. **Processes**: Execute as stateless processes
7. **Port Binding**: Export services via port binding
8. **Concurrency**: Scale out via process model
9. **Disposability**: Fast startup and graceful shutdown
10. **Dev/Prod Parity**: Keep environments similar
11. **Logs**: Treat logs as event streams
12. **Admin Processes**: Run as one-off processes

## Design Patterns

**Sidecar**: Helper container alongside main container
**Ambassador**: Proxy for external services
**Adapter**: Standardizes output from main container
**Init Containers**: Run before app containers
**Multi-Container Pods**: Tightly coupled containers

## Microservices Patterns

- Service discovery
- Circuit breaker
- API gateway
- Event-driven architecture
- CQRS (Command Query Responsibility Segregation)
- Saga pattern for distributed transactions

Following cloud-native patterns ensures applications run reliably in dynamic container environments.
