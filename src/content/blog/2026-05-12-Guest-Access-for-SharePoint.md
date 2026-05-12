---
title: "Guest Access for SharePoint For Always and Forever by Default"
description: "Why guest access reviews are inadequate and how to audit SharePoint for direct guest access."
pubDate: "2026-05-12T00:00:00-04:00"
tags: ["Security", "SharePoint", "Entra ID", "Governance"]
category: "Security"
draft: false
---

In Microsoft Entra ID, guest invitation policies are often set to "Self-Service" to facilitate quick collaboration. However, when everyone has the power to invite guests but no one is assigned responsibility for their lifecycle, the directory quickly becomes a graveyard of stale, over-privileged accounts.

Below is the technical approach used to audit a subset of 20 guest accounts and why the results point to a systemic failure in identity governance.

### The Code: Mapping Guest Access

To understand the true footprint of a guest, you have to look beyond their group memberships. You must check their sign-in metadata and, crucially, scan for direct SharePoint permissions that bypass standard group-based governance.

*Note: This script presumes you have your own auth set up and have granted the app the proper permissions (e.g., Sites.FullControl.All, AuditLog.Read.All). It is recommended to tailor this code in a notebook so you can process results incrementally and avoid global timeouts before data is returned.*

```python
import pandas as pd
import time
from datetime import datetime

def audit_guest_subset(guest_csv_path):
    # Load specific guest list for review
    guests = pd.read_csv(guest_csv_path)
    
    # Discover all sites to check for direct permissions
    site_url = "https://graph.microsoft.com/v1.0/sites/getAllSites?$select=id,displayName"
    all_sites = graph_get(site_url).json().get('value', [])
    
    audit_results = []

    for _, guest in guests.iterrows():
        uid = guest['id']
        
        # 1. Fetch Sign-in Activity (Last Access)
        u_url = f"https://graph.microsoft.com/v1.0/users/{uid}?$select=signInActivity"
        u_data = graph_get(u_url).json()
        last_login = u_data.get('signInActivity', {}).get('lastSignInDateTime', 'None')

        # 2. Fetch Group Memberships
        m_url = f"https://graph.microsoft.com/v1.0/users/{uid}/memberOf?$select=displayName"
        groups = [g['displayName'] for g in graph_get(m_url).json().get('value', [])]

        # 3. Check for Direct Site-Level Permissions
        direct_sites = []
        for site in all_sites:
            p_url = f"https://graph.microsoft.com/v1.0/sites/{site['id']}/permissions"
            perms = graph_get(p_url).json().get('value', [])
            for p in perms:
                if p.get('grantedToV2', {}).get('user', {}).get('id') == uid:
                    role = ", ".join(p.get('roles', []))
                    direct_sites.append(f"{site['displayName']} ({role})")

        audit_results.append({
            "UPN": guest['userPrincipalName'],
            "LastAccess": last_login,
            "Groups": ", ".join(groups),
            "DirectSites": " | ".join(direct_sites) or "None"
        })
        
        # Throttling to prevent 429s during deep permission scans
        time.sleep(1.2) 

    return pd.DataFrame(audit_results)
```

### Why Access Reviews are the Answer

When an audit reveals guests with "Owner" permissions who haven't logged in for months, the standard recommendation is to implement Access Reviews. They address the responsibility gap by:

- **Delegating Ownership:** They force the person who invited the guest (or the resource owner) to justify the continued access.
- **Automated Remediation:** Accounts can be automatically disabled or access removed if a reviewer does not respond.
- **Audit Compliance:** They provide a documented trail of who approved the access and why.

### Why Access Reviews are Inadequate

Despite their benefits, Access Reviews often fail in practice for several reasons:

- **Reviewer Fatigue:** When managers receive lists of hundreds of guests, they often "rubber-stamp" the entire list to save time, effectively approving access they haven't actually reviewed.
- **The Direct Grant Blindspot:** Most automated reviews focus on Group Membership. If a guest was granted direct permission to a specific SharePoint folder or site, a standard review might miss that access entirely.
- **Lack of Activity Context:** Reviewers are often presented with a name and an email but no data on when the user last signed in. Without seeing "Last Access" side-by-side with the "Approve" button, the reviewer is making a blind guess.

### Conclusion

Lifecycle management is not a "set and forget" feature. If you allow multiple users to invite guests without a rigid structure for expiration and permission auditing, you are simply creating a larger attack surface. Access reviews are a start, but without auditing direct grants and monitoring actual activity, they are often just security theater.
