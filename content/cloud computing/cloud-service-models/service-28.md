---
id: service-28
title: Service Model Selection Checklist
type: text
---

## Practical Decision-Making Tool

Use this checklist when selecting a cloud service model.

## Initial Assessment

### Application/Workload Characteristics

**Questions**:
- [ ] Is this a standard business function (email, CRM, etc.)?
- [ ] Are we building a custom application?
- [ ] Do we have specific OS or configuration requirements?
- [ ] What are our performance requirements?
- [ ] What's our scalability pattern (predictable/unpredictable)?
- [ ] How critical is this workload?

### Organizational Factors

**Questions**:
- [ ] What expertise does our team have?
- [ ] What's our risk tolerance?
- [ ] How much control do we need?
- [ ] What's our budget?
- [ ] How quickly do we need to deploy?
- [ ] What are our compliance requirements?

## Model-Specific Evaluation

### Consider IaaS If:

- [ ] Need specific OS or kernel versions
- [ ] Require full administrative access
- [ ] Have unique configuration requirements
- [ ] Migrating legacy applications
- [ ] Need maximum flexibility
- [ ] Have infrastructure management expertise
- [ ] Want to optimize costs through detailed control
- [ ] Compliance requires specific configurations

### Consider PaaS If:

- [ ] Building new custom applications
- [ ] Want to focus on code, not infrastructure
- [ ] Need rapid development and deployment
- [ ] Have development team but limited ops team
- [ ] Require automatic scaling
- [ ] Want built-in DevOps tooling
- [ ] Microservices or container-based architecture
- [ ] Time-to-market is critical

### Consider SaaS If:

- [ ] Need standard business application
- [ ] Want immediate deployment
- [ ] Have small or no IT team
- [ ] Predictable usage and costs desired
- [ ] Standard features meet requirements
- [ ] Need multi-device/location access
- [ ] Want automatic updates
- [ ] Integration needs are straightforward

## Technical Requirements

### Performance Needs

- [ ] Latency requirements defined
- [ ] Throughput requirements documented
- [ ] Geographic distribution needs identified
- [ ] Peak load capacity calculated

### Security and Compliance

- [ ] Data classification completed
- [ ] Compliance requirements listed
- [ ] Data residency needs identified
- [ ] Security controls required documented

### Integration Requirements

- [ ] Existing systems inventory completed
- [ ] Integration points identified
- [ ] Data flow mapped
- [ ] API requirements documented

## Cost Analysis

### Budget Considerations

- [ ] Capital vs operational expense preference noted
- [ ] Monthly/annual budget allocated
- [ ] Growth projections included
- [ ] Total cost of ownership calculated
- [ ] Hidden costs identified

## Risk Assessment

### Risk Factors

- [ ] Vendor stability evaluated
- [ ] Lock-in risks assessed
- [ ] Exit strategy defined
- [ ] Disaster recovery planned
- [ ] Business continuity addressed

## Final Decision Matrix

**Score each model (1-5)** on:
- Meets functional requirements
- Fits budget
- Team capability to manage
- Time to deploy
- Long-term flexibility
- Security/compliance fit
- Integration feasibility
- Total cost of ownership

**Select model** with highest comprehensive score, not just one factor.

## Post-Selection

### After Deciding

- [ ] Document decision rationale
- [ ] Create implementation plan
- [ ] Define success metrics
- [ ] Plan for training
- [ ] Establish governance
- [ ] Set up monitoring
- [ ] Schedule reviews
