---
id: security-8
title: Access Control Models and Policies
type: text
---

## Introduction to Access Control Models

Access control models provide the theoretical framework and practical implementation methods for controlling who can access what resources in a network environment. These models define how access rights are granted, maintained, and revoked based on various criteria and organizational policies.

### Core Concepts
- **Access Control**: Regulating who or what can view or use resources
- **Subjects**: Users, processes, or systems requesting access
- **Objects**: Resources being accessed (files, databases, network services)
- **Access Rights**: Specific permissions granted to subjects for objects
- **Security Policies**: Rules governing access control decisions

### Access Control Components
- **Reference Monitor**: Mediates all access attempts
- **Security Kernel**: Trusted computing base that enforces access control
- **Access Control Lists (ACLs)**: Lists of permissions attached to objects
- **Capability Lists**: Lists of objects a subject can access

## Major Access Control Models

### Discretionary Access Control (DAC)
Access control based on the identity of users and their membership in groups.

#### DAC Characteristics
- **Owner Control**: Resource owners determine access permissions
- **User Discretion**: Users can grant access to others at their discretion
- **Flexibility**: Easy to implement and modify permissions
- **Identity-Based**: Access decisions based on user identity

#### DAC Implementation
- **Access Control Lists**: Permissions stored with each object
- **File Permissions**: Unix/Linux rwx permissions (read, write, execute)
- **Share Permissions**: Windows file sharing permissions
- **Database Grants**: SQL GRANT and REVOKE statements

#### DAC Advantages
- **Simplicity**: Easy to understand and implement
- **Flexibility**: Users can manage their own resources
- **Scalability**: Works well in small to medium environments
- **User Control**: Empowers users to share resources

#### DAC Limitations
- **Security Gaps**: Users may grant excessive permissions
- **Trojan Horse Attacks**: Malicious programs can abuse user permissions
- **Access Creep**: Permissions accumulate over time
- **Lack of Central Control**: Difficult to enforce consistent policies

### Mandatory Access Control (MAC)
Access control based on system-enforced security labels and classifications.

#### MAC Characteristics
- **System Enforced**: Operating system controls all access decisions
- **Security Labels**: Objects and subjects have security classifications
- **Non-Discretionary**: Users cannot change access permissions
- **Policy-Based**: Access governed by organizational security policies

#### MAC Security Levels
- **Top Secret**: Highest classification level
- **Secret**: High-level sensitive information
- **Confidential**: Sensitive but not secret information
- **Unclassified**: Public or non-sensitive information

#### MAC Rules
- **No Read Up**: Subjects cannot read objects at higher security levels
- **No Write Down**: Subjects cannot write to objects at lower security levels
- **Bell-LaPadula Model**: Confidentiality-focused MAC implementation
- **Biba Model**: Integrity-focused MAC implementation

#### MAC Advantages
- **Strong Security**: Prevents unauthorized information disclosure
- **Policy Enforcement**: Consistent application of security policies
- **Least Privilege**: Users get minimum necessary access
- **Audit Trail**: Comprehensive logging of access attempts

#### MAC Limitations
- **Complexity**: Difficult to implement and manage
- **Inflexibility**: Hard to accommodate business needs
- **Administrative Overhead**: Requires specialized security administration
- **User Productivity**: May hinder legitimate work activities

### Role-Based Access Control (RBAC)
Access control based on organizational roles and responsibilities.

#### RBAC Components
- **Users**: Individual people in the organization
- **Roles**: Job functions or organizational positions
- **Permissions**: Specific access rights to resources
- **Sessions**: User activations of assigned roles

#### RBAC Principles
- **Role Assignment**: Users are assigned to roles
- **Permission Assignment**: Permissions are assigned to roles
- **Role Activation**: Users must activate roles to use permissions
- **Separation of Duties**: Conflicting roles cannot be activated simultaneously

#### RBAC Hierarchies
- **Role Inheritance**: Senior roles inherit permissions from junior roles
- **Role Hierarchies**: Manager roles include subordinate role permissions
- **Generalization**: Specialized roles inherit from general roles
- **Permission Inheritance**: Automatic permission propagation

#### RBAC Advantages
- **Scalability**: Easy to manage in large organizations
- **Business Alignment**: Roles match organizational structure
- **Simplified Administration**: Manage roles instead of individual permissions
- **Compliance**: Supports regulatory requirements

#### RBAC Implementation
- **Microsoft Active Directory**: Group-based role implementation
- **Oracle Database**: Role-based database security
- **Application Security**: Role-based application access
- **Cloud Platforms**: IAM roles in AWS, Azure, Google Cloud

### Attribute-Based Access Control (ABAC)
Dynamic access control based on attributes of users, resources, and environment.

#### ABAC Attributes
- **Subject Attributes**: User department, clearance level, location
- **Object Attributes**: Data classification, owner, creation date
- **Environment Attributes**: Time of day, network location, threat level
- **Action Attributes**: Read, write, delete, execute operations

#### ABAC Policy Engine
- **Policy Decision Point (PDP)**: Evaluates access requests
- **Policy Enforcement Point (PEP)**: Enforces access decisions
- **Policy Administration Point (PAP)**: Manages policies
- **Policy Information Point (PIP)**: Provides attribute information

#### ABAC Advantages
- **Fine-Grained Control**: Precise access control decisions
- **Dynamic Policies**: Real-time policy evaluation
- **Context Awareness**: Environmental factors in decisions
- **Flexibility**: Accommodates complex business rules

#### ABAC Challenges
- **Complexity**: Difficult to design and implement
- **Performance**: Policy evaluation overhead
- **Policy Management**: Complex policy authoring and maintenance
- **Attribute Management**: Maintaining accurate attribute information

## Access Control Policy Implementation

### Policy Development Process
1. **Requirements Analysis**: Identify business and security needs
2. **Risk Assessment**: Evaluate threats and vulnerabilities
3. **Policy Design**: Create comprehensive access control policies
4. **Implementation Planning**: Develop deployment strategy
5. **Testing and Validation**: Verify policy effectiveness
6. **Deployment**: Roll out policies across the organization
7. **Monitoring**: Continuous policy compliance monitoring
8. **Review and Updates**: Regular policy maintenance

### Policy Components
- **Access Control Matrix**: Users vs resources permission mapping
- **Security Labels**: Classification and sensitivity markings
- **Time-Based Restrictions**: Temporal access limitations
- **Location-Based Controls**: Geographic access restrictions
- **Device-Based Policies**: Access based on device characteristics

### Common Access Control Policies
- **Least Privilege Principle**: Minimum necessary access rights
- **Need-to-Know Basis**: Access only to required information
- **Separation of Duties**: Critical functions require multiple people
- **Job Rotation**: Periodic role changes to prevent fraud
- **Mandatory Vacations**: Temporary role suspension for audit

## Technology Implementation

### Network Access Control (NAC)
Controlling device access to network resources.

#### NAC Components
- **Policy Server**: Centralized policy management and enforcement
- **Network Access Devices**: Switches, routers, wireless access points
- **Endpoint Security**: Host-based security agents
- **Authentication Server**: User and device authentication

#### NAC Enforcement Methods
- **Port-Based**: IEEE 802.1X authentication
- **VLAN Assignment**: Dynamic VLAN placement based on identity
- **ACL Application**: Dynamic firewall rule application
- **Bandwidth Control**: Network resource allocation

### Identity and Access Management (IAM)
Comprehensive identity lifecycle and access management.

#### IAM Capabilities
- **Identity Provisioning**: User account creation and management
- **Authentication Services**: Single sign-on and multi-factor authentication
- **Authorization Management**: Role and permission assignment
- **Identity Federation**: Cross-domain identity trust relationships

#### IAM Technologies
- **Active Directory**: Microsoft's directory service
- **LDAP**: Lightweight Directory Access Protocol
- **SAML**: Security Assertion Markup Language
- **OAuth/OpenID Connect**: Modern web authentication protocols

## Summary

Access control models provide the foundation for implementing comprehensive security policies in network environments. Understanding the strengths and limitations of different models enables organizations to select and implement appropriate access control mechanisms that balance security requirements with operational needs.

### Key Takeaways
- **Model Selection**: Choose appropriate model based on organizational needs
- **Policy Integration**: Combine multiple models for comprehensive security
- **Implementation Challenges**: Plan for complexity and user acceptance
- **Continuous Improvement**: Regular review and policy updates
- **Technology Alignment**: Ensure access control technology supports chosen models