---
id: advanced-21
title: Site Reliability Engineering (SRE)
type: text
---

# Site Reliability Engineering (SRE)

## Overview

Site Reliability Engineering (SRE) is Google's approach to service management that applies software engineering principles to infrastructure and operations problems. This lesson covers SRE fundamentals, practices, and implementation strategies.

## SRE Fundamentals

### SLIs, SLOs, and SLAs

**Service Level Indicators (SLIs)**: Quantitative measures of service behavior

```python
# sli_calculator.py
from dataclasses import dataclass
from typing import List
import time

@dataclass
class Request:
    timestamp: float
    duration_ms: float
    status_code: int
    success: bool

class SLICalculator:
    def __init__(self):
        self.requests: List[Request] = []
    
    def record_request(self, duration_ms: float, status_code: int):
        """Record a request for SLI calculation"""
        request = Request(
            timestamp=time.time(),
            duration_ms=duration_ms,
            status_code=status_code,
            success=200 <= status_code < 500
        )
        self.requests.append(request)
    
    def availability_sli(self, window_seconds: int = 3600) -> float:
        """Calculate availability SLI (success rate)"""
        cutoff = time.time() - window_seconds
        recent_requests = [r for r in self.requests if r.timestamp >= cutoff]
        
        if not recent_requests:
            return 1.0
        
        successful = sum(1 for r in recent_requests if r.success)
        return successful / len(recent_requests)
    
    def latency_sli(self, threshold_ms: float, window_seconds: int = 3600) -> float:
        """Calculate latency SLI (requests under threshold)"""
        cutoff = time.time() - window_seconds
        recent_requests = [r for r in self.requests if r.timestamp >= cutoff and r.success]
        
        if not recent_requests:
            return 1.0
        
        under_threshold = sum(1 for r in recent_requests if r.duration_ms <= threshold_ms)
        return under_threshold / len(recent_requests)
    
    def percentile_latency(self, percentile: float, window_seconds: int = 3600) -> float:
        """Calculate latency percentile"""
        cutoff = time.time() - window_seconds
        recent_requests = [r for r in self.requests if r.timestamp >= cutoff and r.success]
        
        if not recent_requests:
            return 0.0
        
        latencies = sorted([r.duration_ms for r in recent_requests])
        index = int(len(latencies) * percentile / 100)
        return latencies[min(index, len(latencies) - 1)]

# Usage
sli = SLICalculator()

# Record requests
sli.record_request(duration_ms=45, status_code=200)
sli.record_request(duration_ms=120, status_code=200)
sli.record_request(duration_ms=35, status_code=500)

# Calculate SLIs
availability = sli.availability_sli(window_seconds=3600)
print(f"Availability SLI: {availability * 100:.2f}%")

latency_sli = sli.latency_sli(threshold_ms=100, window_seconds=3600)
print(f"Latency SLI (< 100ms): {latency_sli * 100:.2f}%")

p95 = sli.percentile_latency(95, window_seconds=3600)
p99 = sli.percentile_latency(99, window_seconds=3600)
print(f"P95 latency: {p95:.2f}ms")
print(f"P99 latency: {p99:.2f}ms")
```

**Service Level Objectives (SLOs)**: Target values or ranges for SLIs

```python
# slo_manager.py
from dataclasses import dataclass
from enum import Enum
from typing import Optional

class SLOType(Enum):
    AVAILABILITY = "availability"
    LATENCY = "latency"
    THROUGHPUT = "throughput"

@dataclass
class SLO:
    name: str
    slo_type: SLOType
    target: float  # e.g., 0.999 (99.9%)
    window_days: int  # e.g., 30 days
    
    def error_budget_remaining(self, current_sli: float) -> float:
        """Calculate remaining error budget"""
        error_budget = 1.0 - self.target
        errors_consumed = 1.0 - current_sli
        return max(0, error_budget - errors_consumed)
    
    def error_budget_percentage(self, current_sli: float) -> float:
        """Calculate error budget as percentage"""
        error_budget = 1.0 - self.target
        remaining = self.error_budget_remaining(current_sli)
        return (remaining / error_budget) * 100 if error_budget > 0 else 100

# Define SLOs
availability_slo = SLO(
    name="API Availability",
    slo_type=SLOType.AVAILABILITY,
    target=0.999,  # 99.9%
    window_days=30
)

latency_slo = SLO(
    name="API Latency P95",
    slo_type=SLOType.LATENCY,
    target=0.95,  # 95% of requests < 100ms
    window_days=30
)

# Check error budget
current_availability = 0.9985
remaining = availability_slo.error_budget_percentage(current_availability)
print(f"Error budget remaining: {remaining:.2f}%")

if remaining < 20:
    print("⚠️ Error budget low - slow down deployments!")
elif remaining < 50:
    print("⚡ Error budget moderate - proceed with caution")
else:
    print("✅ Error budget healthy - safe to deploy")
```

**Service Level Agreements (SLAs)**: Contractual obligations with consequences

```python
# sla_calculator.py
from decimal import Decimal

def calculate_sla_credits(availability: float, revenue: Decimal) -> dict:
    """Calculate SLA credits based on availability"""
    if availability >= 0.999:  # 99.9%
        credit_percentage = 0
    elif availability >= 0.99:  # 99.0-99.9%
        credit_percentage = 10
    elif availability >= 0.95:  # 95.0-99.0%
        credit_percentage = 25
    else:  # < 95.0%
        credit_percentage = 50
    
    credit_amount = revenue * Decimal(credit_percentage / 100)
    
    return {
        'availability': availability,
        'credit_percentage': credit_percentage,
        'credit_amount': credit_amount,
        'net_revenue': revenue - credit_amount
    }

# Example
monthly_revenue = Decimal('100000.00')
measured_availability = 0.985

result = calculate_sla_credits(measured_availability, monthly_revenue)
print(f"Availability: {result['availability'] * 100:.2f}%")
print(f"Credit: {result['credit_percentage']}% (${result['credit_amount']:,.2f})")
print(f"Net Revenue: ${result['net_revenue']:,.2f}")
```

## Error Budget Policy

```python
# error_budget_policy.py
from dataclasses import dataclass
from typing import List

@dataclass
class ErrorBudgetPolicy:
    """Define actions based on error budget status"""
    slo_target: float
    window_days: int
    
    def get_policy_action(self, error_budget_remaining: float) -> dict:
        """Determine action based on error budget"""
        if error_budget_remaining >= 75:
            return {
                'status': 'healthy',
                'deployment_frequency': 'normal',
                'allowed_actions': [
                    'Normal deployments',
                    'Feature releases',
                    'Experimental changes',
                    'Canary deployments'
                ],
                'required_reviews': 1
            }
        elif error_budget_remaining >= 50:
            return {
                'status': 'moderate',
                'deployment_frequency': 'reduced',
                'allowed_actions': [
                    'Critical bug fixes',
                    'Security patches',
                    'Gradual rollouts only'
                ],
                'required_reviews': 2
            }
        elif error_budget_remaining >= 25:
            return {
                'status': 'low',
                'deployment_frequency': 'minimal',
                'allowed_actions': [
                    'Emergency fixes only',
                    'Rollbacks',
                    'Incident response'
                ],
                'required_reviews': 3,
                'additional_requirements': [
                    'SRE approval required',
                    'Post-deployment validation',
                    'Increased monitoring'
                ]
            }
        else:
            return {
                'status': 'depleted',
                'deployment_frequency': 'freeze',
                'allowed_actions': [
                    'Critical security fixes only',
                    'Rollbacks'
                ],
                'required_reviews': 4,
                'additional_requirements': [
                    'VP Engineering approval',
                    'Root cause analysis required',
                    'Reliability improvements mandatory',
                    'Incident review'
                ]
            }

# Usage
policy = ErrorBudgetPolicy(slo_target=0.999, window_days=30)

# Check with 45% error budget remaining
action = policy.get_policy_action(error_budget_remaining=45)
print(f"Status: {action['status']}")
print(f"Allowed actions: {', '.join(action['allowed_actions'])}")
print(f"Required reviews: {action['required_reviews']}")
```

## Toil Reduction

### Automating Manual Work

```python
# toil_automation.py
import logging
from typing import Callable, Any
import functools
import time

def retry_with_backoff(max_retries: int = 3, backoff_seconds: int = 1):
    """Decorator to retry failed operations"""
    def decorator(func: Callable) -> Callable:
        @functools.wraps(func)
        def wrapper(*args, **kwargs) -> Any:
            for attempt in range(max_retries):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    if attempt == max_retries - 1:
                        logging.error(f"Failed after {max_retries} attempts: {e}")
                        raise
                    
                    wait_time = backoff_seconds * (2 ** attempt)
                    logging.warning(f"Attempt {attempt + 1} failed, retrying in {wait_time}s")
                    time.sleep(wait_time)
        return wrapper
    return decorator

def measure_toil_time(category: str):
    """Decorator to measure time spent on toil"""
    def decorator(func: Callable) -> Callable:
        @functools.wraps(func)
        def wrapper(*args, **kwargs) -> Any:
            start = time.time()
            try:
                result = func(*args, **kwargs)
                duration = time.time() - start
                logging.info(f"Toil [{category}]: {func.__name__} took {duration:.2f}s")
                return result
            except Exception as e:
                duration = time.time() - start
                logging.error(f"Toil [{category}] failed: {func.__name__} after {duration:.2f}s")
                raise
        return wrapper
    return decorator

class AutomatedOpsTask:
    """Base class for automated operations tasks"""
    
    @retry_with_backoff(max_retries=3, backoff_seconds=2)
    @measure_toil_time(category="certificate_renewal")
    def renew_certificates(self):
        """Automatically renew SSL certificates"""
        logging.info("Starting certificate renewal...")
        # Certificate renewal logic
        time.sleep(1)  # Simulate work
        logging.info("Certificates renewed successfully")
    
    @retry_with_backoff(max_retries=3)
    @measure_toil_time(category="cleanup")
    def cleanup_old_logs(self, retention_days: int = 30):
        """Automatically cleanup old log files"""
        logging.info(f"Cleaning up logs older than {retention_days} days...")
        # Cleanup logic
        time.sleep(0.5)
        logging.info("Log cleanup completed")
    
    @retry_with_backoff(max_retries=5, backoff_seconds=1)
    @measure_toil_time(category="scaling")
    def auto_scale_resources(self, target_cpu_percent: float = 70):
        """Automatically scale resources based on metrics"""
        logging.info(f"Checking if scaling needed (target: {target_cpu_percent}%)")
        # Auto-scaling logic
        time.sleep(0.3)
        logging.info("Scaling check completed")

# Usage
ops = AutomatedOpsTask()
ops.renew_certificates()
ops.cleanup_old_logs(retention_days=30)
ops.auto_scale_resources(target_cpu_percent=70)
```

### Toil Tracking

```python
# toil_tracker.py
from dataclasses import dataclass, field
from datetime import datetime
from typing import List
import json

@dataclass
class ToilEntry:
    task: str
    duration_minutes: float
    category: str
    automatable: bool
    timestamp: datetime = field(default_factory=datetime.now)

class ToilTracker:
    def __init__(self):
        self.entries: List[ToilEntry] = []
    
    def add_entry(self, task: str, duration_minutes: float, 
                  category: str, automatable: bool):
        entry = ToilEntry(
            task=task,
            duration_minutes=duration_minutes,
            category=category,
            automatable=automatable
        )
        self.entries.append(entry)
    
    def weekly_report(self) -> dict:
        """Generate weekly toil report"""
        total_toil = sum(e.duration_minutes for e in self.entries)
        automatable_toil = sum(e.duration_minutes for e in self.entries if e.automatable)
        
        by_category = {}
        for entry in self.entries:
            if entry.category not in by_category:
                by_category[entry.category] = 0
            by_category[entry.category] += entry.duration_minutes
        
        return {
            'total_toil_hours': total_toil / 60,
            'automatable_hours': automatable_toil / 60,
            'automation_opportunity_percent': (automatable_toil / total_toil * 100) if total_toil > 0 else 0,
            'breakdown_by_category': {k: v / 60 for k, v in by_category.items()},
            'top_toil_tasks': sorted(
                [(e.task, e.duration_minutes / 60) for e in self.entries],
                key=lambda x: x[1],
                reverse=True
            )[:5]
        }

# Track toil
tracker = ToilTracker()
tracker.add_entry("Manual deployment", 45, "deployment", automatable=True)
tracker.add_entry("Certificate renewal", 30, "security", automatable=True)
tracker.add_entry("Log investigation", 120, "incident_response", automatable=False)
tracker.add_entry("Database backup", 15, "maintenance", automatable=True)

report = tracker.weekly_report()
print(json.dumps(report, indent=2))
```

## On-Call and Incident Management

### On-Call Rotation

```python
# oncall_manager.py
from dataclasses import dataclass
from datetime import datetime, timedelta
from typing import List

@dataclass
class Engineer:
    name: str
    email: str
    phone: str
    timezone: str

@dataclass
class OnCallShift:
    engineer: Engineer
    start_time: datetime
    end_time: datetime
    is_primary: bool

class OnCallRotation:
    def __init__(self, engineers: List[Engineer], shift_duration_days: int = 7):
        self.engineers = engineers
        self.shift_duration_days = shift_duration_days
        self.shifts: List[OnCallShift] = []
    
    def generate_schedule(self, start_date: datetime, weeks: int):
        """Generate on-call schedule"""
        current_date = start_date
        engineer_index = 0
        
        for week in range(weeks):
            primary = self.engineers[engineer_index % len(self.engineers)]
            secondary = self.engineers[(engineer_index + 1) % len(self.engineers)]
            
            shift_end = current_date + timedelta(days=self.shift_duration_days)
            
            self.shifts.append(OnCallShift(
                engineer=primary,
                start_time=current_date,
                end_time=shift_end,
                is_primary=True
            ))
            
            self.shifts.append(OnCallShift(
                engineer=secondary,
                start_time=current_date,
                end_time=shift_end,
                is_primary=False
            ))
            
            current_date = shift_end
            engineer_index += 1
    
    def get_current_oncall(self, current_time: datetime = None) -> dict:
        """Get current on-call engineers"""
        if current_time is None:
            current_time = datetime.now()
        
        current_shifts = [
            s for s in self.shifts 
            if s.start_time <= current_time < s.end_time
        ]
        
        primary = next((s.engineer for s in current_shifts if s.is_primary), None)
        secondary = next((s.engineer for s in current_shifts if not s.is_primary), None)
        
        return {
            'primary': primary,
            'secondary': secondary,
            'shift_end': current_shifts[0].end_time if current_shifts else None
        }

# Setup rotation
engineers = [
    Engineer("Alice", "alice@example.com", "+1234567890", "America/New_York"),
    Engineer("Bob", "bob@example.com", "+1234567891", "America/Los_Angeles"),
    Engineer("Charlie", "charlie@example.com", "+1234567892", "Europe/London"),
    Engineer("Diana", "diana@example.com", "+1234567893", "Asia/Tokyo"),
]

rotation = OnCallRotation(engineers, shift_duration_days=7)
rotation.generate_schedule(datetime.now(), weeks=8)

oncall = rotation.get_current_oncall()
print(f"Primary: {oncall['primary'].name}")
print(f"Secondary: {oncall['secondary'].name}")
print(f"Shift ends: {oncall['shift_end']}")
```

### Incident Response

```python
# incident_manager.py
from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum
from typing import List, Optional

class Severity(Enum):
    SEV1 = "Critical - Service Down"
    SEV2 = "Major - Significant Impact"
    SEV3 = "Minor - Limited Impact"
    SEV4 = "Low - Minimal Impact"

class IncidentStatus(Enum):
    INVESTIGATING = "investigating"
    IDENTIFIED = "identified"
    MONITORING = "monitoring"
    RESOLVED = "resolved"

@dataclass
class IncidentUpdate:
    timestamp: datetime
    status: IncidentStatus
    message: str
    author: str

@dataclass
class Incident:
    title: str
    severity: Severity
    started_at: datetime = field(default_factory=datetime.now)
    incident_commander: Optional[str] = None
    status: IncidentStatus = IncidentStatus.INVESTIGATING
    updates: List[IncidentUpdate] = field(default_factory=list)
    resolved_at: Optional[datetime] = None
    
    def add_update(self, message: str, author: str, new_status: Optional[IncidentStatus] = None):
        """Add incident update"""
        if new_status:
            self.status = new_status
        
        update = IncidentUpdate(
            timestamp=datetime.now(),
            status=self.status,
            message=message,
            author=author
        )
        self.updates.append(update)
        
        if new_status == IncidentStatus.RESOLVED and not self.resolved_at:
            self.resolved_at = datetime.now()
    
    def time_to_resolution(self) -> Optional[timedelta]:
        """Calculate time to resolution"""
        if self.resolved_at:
            return self.resolved_at - self.started_at
        return None
    
    def generate_postmortem_template(self) -> str:
        """Generate postmortem template"""
        ttrs = self.time_to_resolution()
        ttr_str = f"{ttrs.total_seconds() / 60:.1f} minutes" if ttrs else "Ongoing"
        
        return f"""# Incident Postmortem: {self.title}

**Date:** {self.started_at.strftime('%Y-%m-%d')}
**Severity:** {self.severity.value}
**Duration:** {ttr_str}
**Incident Commander:** {self.incident_commander or 'TBD'}

## Summary
[Brief description of the incident]

## Impact
- **Users Affected:** [number/percentage]
- **Services Affected:** [list]
- **Duration:** {ttr_str}

## Timeline
{self._format_timeline()}

## Root Cause
[Detailed explanation]

## Resolution
[How it was fixed]

## Action Items
- [ ] Immediate fix implemented
- [ ] Monitoring added
- [ ] Documentation updated
- [ ] Prevention measures identified

## Lessons Learned
### What Went Well
- 

### What Could Be Improved
- 

### Action Items for Prevention
- [ ] Item 1
- [ ] Item 2
"""
    
    def _format_timeline(self) -> str:
        """Format incident timeline"""
        lines = [f"- **{self.started_at.strftime('%H:%M')}** - Incident started"]
        for update in self.updates:
            lines.append(f"- **{update.timestamp.strftime('%H:%M')}** - [{update.status.value}] {update.message}")
        return '\n'.join(lines)

# Example usage
incident = Incident(
    title="API Latency Spike",
    severity=Severity.SEV2,
    incident_commander="Alice"
)

incident.add_update(
    "Database query performance degradation detected",
    "Bob",
    IncidentStatus.IDENTIFIED
)

incident.add_update(
    "Added missing index to users table",
    "Charlie",
    IncidentStatus.MONITORING
)

incident.add_update(
    "Latency returned to normal, monitoring for 30 minutes",
    "Alice",
    IncidentStatus.RESOLVED
)

print(incident.generate_postmortem_template())
```

## Key Takeaways

1. **SLIs/SLOs/SLAs** provide objective service quality measures
2. **Error budgets** balance reliability and innovation
3. **Toil reduction** through automation improves efficiency
4. **On-call rotations** ensure sustainable incident response
5. **Postmortems** enable learning from failures

## Next Steps

- Explore observability platforms
- Learn about chaos engineering
- Study capacity planning
