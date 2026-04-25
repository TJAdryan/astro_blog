---
title: "Standardizing Privilege: JIT Access and the Emergency Bypass"
description: "Managing an Entra ID tenant requires removing the technical debt of permanent administrative permissions."
pubDate: "2026-04-24T00:00:00-04:00"
tags: ["Security", "Entra ID", "JIT", "PIM"]
category: "Security"
draft: false
---

Managing an Entra ID tenant requires removing the technical debt of permanent administrative permissions. A robust implementation relies on three pillars: Just-In-Time (JIT) elevation for daily operations, a hardened bypass for emergency recovery, and an automated tripwire for audit integrity.

It is far too easy to rely on a standing Global Admin account for routine troubleshooting—or conversely, to accidentally lock out your entire team<sup>*</sup> with a single misconfigured Conditional Access policy. Striking the right balance is essential.  Everyone has a horror story of getting locked out of a machine or a tenant.  Good policy should be designed to both avoid this and help restore access in the event of an emergency.


---

### Global Admin: Removing Standing Access
Permanent Global Admin assignments are a primary security liability. The architecture must transition these to **Eligible** status within Privileged Identity Management (PIM).

* **JIT Activation:** Users do not hold permissions by default. They must explicitly request elevation.
* **Activation Constraints:**
    * **Duration:** Set a strict window (e.g., 2 to 4 hours) after which access is automatically revoked.
    * **MFA Requirement:** Activation must trigger a fresh MFA challenge, regardless of the current session state.
    * **Justification:** Every request must include a ticket reference or reason to maintain a clean audit trail.
* **Approval Gates:** For Tier 0 roles, implement a "Second-Person" approval workflow. No single individual should be able to elevate to Global Admin without a peer or lead signing off in the portal.

### The Emergency Bypass: Breakglass Architecture
A bypass is a deliberate exclusion in security policies designed to prevent a total lockout. If a Conditional Access (CA) policy is misconfigured or a cloud MFA service fails, standard JIT-dependent admins will be locked out. The Breakglass account is the only way back in.

* **Cloud-Only Isolation:** Use a `*.onmicrosoft.com` account. It must have no dependencies on on-premises Active Directory or synchronization tools.
* **Policy Exclusion:** This account is explicitly excluded from **all** Conditional Access policies and PIM. It holds **Permanent Global Admin** rights.
* **Physical Hardware (FIDO2):** Since the account bypasses standard MFA, secure it with a physical FIDO2 security key. Store the key and the randomized 256-character password in separate physical safes.
* **The Circular Dependency Fix:** The bypass ensures that if the services required to validate a "standard" login fail, you still have a path to disable or fix the blocking policy.

### Audit Integrity: Setting the Tripwire
Because the Breakglass account is a managed vulnerability, its use must be treated as a Priority 1 incident.

* **Continuous Monitoring:** Stream all Entra ID sign-in and audit logs to a **Log Analytics Workspace**.
* **The Tripwire Alert:** Configure an Azure Monitor alert using Kusto Query Language (KQL) to trigger immediately upon any successful or failed login attempt from the Breakglass UPN.
* **Baseline Reporting:** PIM provides a centralized history of who requested access, why, and who approved it. This log must be reviewed weekly to ensure JIT is not being used for routine, non-administrative tasks.

---

### Implementation Summary

| Component | Standard Admin (Daily) | Breakglass (Emergency) |
| :--- | :--- | :--- |
| **PIM Status** | Eligible (JIT) | Permanent |
| **Duration** | Time-bound (e.g., 4h) | Indefinite |
| **CA Policies** | Fully Enforced | **Excluded (The Bypass)** |
| **MFA Method** | Authenticator App / OATH | FIDO2 Hardware Key |
| **Log Priority** | Routine Audit | **P1 Security Incident** |

By architecting the bypass as a documented, monitored exception rather than an accidental oversight, you ensure the tenant remains recoverable during a disaster without sacrificing daily security posture.

<sup>*</sup> **Hey solo admin:** I see you, thrust into a position you never expected with responsibility you never asked for. This is important for you, too. You might feel that being a "team of one" justifies staying signed in with full privileges for the sake of speed, but that is a habit born from years of Windows admin conditioning. In the cloud, that convenience is a trap. Just-In-Time access and emergency bypasses aren't just for enterprise teams—they are the only things standing between you and a catastrophic, self-inflicted lockout.
