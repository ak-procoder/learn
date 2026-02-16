---
id: storage-16
title: "Data Lifecycle Management"
type: text
---

# Data Lifecycle Management

Data lifecycle management automates actions on data based on age, access patterns, and business rules.

## Lifecycle Stages

**Creation**: Data is generated or uploaded
**Active Use**: Frequently accessed and modified
**Infrequent Use**: Occasional access
**Archive**: Long-term retention
**Deletion**: End of lifecycle

## Lifecycle Policies

**Transition Rules**: Move data between tiers
**Expiration Rules**: Delete data after period
**Versioning Rules**: Manage object versions
**Incomplete Upload Cleanup**: Remove failed uploads

## AWS S3 Lifecycle Example

```json
{
  "Rules": [{
    "Id": "Archive old logs",
    "Status": "Enabled",
    "Filter": {
      "Prefix": "logs/"
    },
    "Transitions": [
      {
        "Days": 30,
        "StorageClass": "STANDARD_IA"
      },
      {
        "Days": 90,
        "StorageClass": "GLACIER"
      }
    ],
    "Expiration": {
      "Days": 365
    }
  }]
}
```

## Azure Lifecycle Management

```json
{
  "rules": [{
    "name": "archiveRule",
    "type": "Lifecycle",
    "definition": {
      "filters": {
        "blobTypes": ["blockBlob"],
        "prefixMatch": ["logs/"]
      },
      "actions": {
        "baseBlob": {
          "tierToCool": {
            "daysAfterModificationGreaterThan": 30
          },
          "tierToArchive": {
            "daysAfterModificationGreaterThan": 90
          },
          "delete": {
            "daysAfterModificationGreaterThan": 365
          }
        }
      }
    }
  }]
}
```

## Best Practices

- Analyze access patterns before creating policies
- Start with conservative policies
- Monitor policy effectiveness
- Consider compliance requirements
- Test policies on subset of data
- Document lifecycle strategies

Effective lifecycle management reduces storage costs while maintaining data accessibility.
