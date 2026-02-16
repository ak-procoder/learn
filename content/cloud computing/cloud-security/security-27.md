---
id: security-27
title: "Cloud Incident Response"
type: text
---

# Cloud Incident Response

Effective incident response in cloud environments requires adapted processes and tools.

## Cloud-Specific Considerations

**Ephemeral Resources**:
- Instances auto-scale
- Containers come and go
- Evidence may disappear
- Snapshots critical

**Shared Responsibility**:
- Provider handles infrastructure
- Customer handles applications
- Clear boundary understanding
- Coordination requirements

**API-Driven**:
- Automated response possible
- Programmatic containment
- Script-based investigation
- Integration with tools

## Incident Response Phases

**1. Preparation**:
- Cloud-specific runbooks
- Automated playbooks
- Contact lists (including provider)
- Tools and access ready
- Training and drills

**2. Detection**:
- Security monitoring services
- Log analysis
- Threat intelligence
- Automated alerts
- User reports

**3. Analysis**:
- Scope determination
- Affected resources
- Attack timeline
- Indicators of compromise
- Root cause

**4. Containment**:
- Isolate affected resources
- Network isolation
- Snapshot for forensics
- Prevent spread
- Maintain evidence

**5. Eradication**:
- Remove malware
- Close vulnerabilities
- Patch systems
- Reset credentials
- Harden configurations

**6. Recovery**:
- Restore from clean backups
- Rebuild compromised systems
- Verify integrity
- Gradual restoration
- Enhanced monitoring

**7. Post-Incident**:
- Lessons learned
- Update procedures
- Improve defenses
- Report to stakeholders
- Document everything

## Cloud Forensics

**Evidence Collection**:

AWS:
```bash
# Snapshot EBS volume
aws ec2 create-snapshot \
  --volume-id vol-1234567890abcdef0 \
  --description "Forensic snapshot"

# Export logs
aws logs create-export-task \
  --log-group-name /aws/lambda/my-function \
  --from 1609459200000 \
  --to 1609545600000 \
  --destination s3-bucket-name

# Isolate instance
aws ec2 modify-instance-attribute \
  --instance-id i-1234567890abcdef0 \
  --groups sg-forensics
```

Azure:
```bash
# Create VM snapshot
az snapshot create \
  --resource-group myRG \
  --source myVM \
  --name forensic-snapshot

# Export logs
az monitor diagnostic-settings create \
  --resource myVM \
  --name export-logs \
  --storage-account forensic-storage
```

**Forensic Analysis**:
- Memory dumps (before shutdown)
- Disk images
- Log aggregation
- Network packet captures
- Timeline analysis

## Automated Response

**Lambda/Functions for Response**:
```python
def quarantine_instance(instance_id):
    # Move to isolated security group
    ec2.modify_instance_attribute(
        InstanceId=instance_id,
        Groups=['sg-quarantine']
    )
    
    # Tag for tracking
    ec2.create_tags(
        Resources=[instance_id],
        Tags=[{'Key': 'Status', 'Value': 'Quarantined'}]
    )
    
    # Snapshot for forensics
    volumes = ec2.describe_instances(
        InstanceIds=[instance_id]
    )['Reservations'][0]['Instances'][0]['BlockDeviceMappings']
    
    for volume in volumes:
        ec2.create_snapshot(
            VolumeId=volume['Ebs']['VolumeId'],
            Description=f'Forensic snapshot - {instance_id}'
        )
    
    # Notify team
    sns.publish(
        TopicArn=alert_topic,
        Subject='Instance Quarantined',
        Message=f'Instance {instance_id} has been quarantined'
    )
```

## Communication

**Internal**:
- Security team
- IT operations
- Legal department
- Executive management
- Affected teams

**External**:
- Cloud provider support
- Law enforcement (if needed)
- Customers (if data breach)
- Regulators (if required)
- Insurance company

**Notification Templates**:
- Initial alert
- Status updates
- All-clear notification
- Post-incident report

## Legal and Compliance

**Breach Notification**:
- GDPR: 72 hours to regulators
- State laws vary
- Document decision process
- Legal consultation

**Evidence Chain of Custody**:
- Document all access
- Cryptographic hashing
- Tamper-proof storage
- Detailed logs

**Regulatory Reporting**:
- Industry-specific requirements
- Compliance frameworks
- Third-party auditors
- Customer notifications

## Tools

**AWS**:
- GuardDuty (detection)
- Security Hub (aggregation)
- Systems Manager (automation)
- Step Functions (orchestration)

**Azure**:
- Sentinel (SIEM)
- Logic Apps (automation)
- Security Center (detection)

**GCP**:
- Security Command Center
- Chronicle
- Cloud Functions (automation)

**Third-Party**:
- PagerDuty (alerting)
- ServiceNow (ticketing)
- Slack (communication)
- SOAR platforms

## Metrics

**Response Metrics**:
- Mean Time to Detect (MTTD)
- Mean Time to Respond (MTTR)
- Mean Time to Contain (MTTC)
- Mean Time to Recover (MTTR)

**Improvement**:
- Track over time
- Set targets
- Continuous optimization
- Regular drills

## Tabletop Exercises

**Scenarios**:
- Ransomware attack
- Data exfiltration
- Compromised credentials
- DDoS attack
- Insider threat

**Frequency**: Quarterly recommended

**Participants**:
- Security team
- Operations
- Management
- Legal
- Communications

Effective cloud incident response requires preparation, practice, and cloud-specific knowledge.
