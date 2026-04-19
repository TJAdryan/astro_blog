---
title: "Modern LAPS: Transitioning to Native Security"
description: "Moving from legacy LAPS agents to integrated encryption and Domain LAPS members."
pubDate: "2026-04-08T09:00:00-04:00"
tags: ["Security", "Windows", "LAPS", "Active Directory"]
category: "Security"
draft: false
---

Windows LAPS has evolved into a native OS feature that eliminates the need for legacy agents by integrating directly with Microsoft Entra ID. By rotating unique local passwords over HTTPS, it secures endpoints and infrastructure without requiring VPNs or Active Directory line-of-sight. This shift enables a unified security posture, whether managed through Intune for workstations or Azure Policy for cloud-native VMs. Ultimately, LAPS serves as a critical isolation layer that ensuring local administrator credentials are non-global, non-static, and gated behind MFA-backed RBAC.

## Implementation: Azure Virtual Machines

For Azure VMs, LAPS is best implemented via Azure Policy to ensure a consistent security baseline across the environment. This method avoids manual agent maintenance and utilizes the native Guest Configuration extension.

Once the policy is assigned, verify the state of the local engine using the native PowerShell module.

```powershell
# Verify the LAPS native engine is running and processing policies
Get-LapsDiagnostics -Scope Operational

# Force a background processing cycle for LAPS
Invoke-LapsPolicyProcessing

# Confirm the managed account and the backup destination
Get-LapsConfig
```

## Implementation: Microsoft Intune

In Intune, LAPS is deployed via Account Protection policies. This leverages the LAPS Configuration Service Provider (CSP) to manage the password lifecycle on endpoints without VPN requirements.

### Policy Configuration

- Navigate to Endpoint Security > Account Protection.
- Create a new Local admin password solution (Windows LAPS) policy.
- Set Backup Directory to Microsoft Entra ID.
- Configure Post-Authentication Actions to Reset the password and logoff the managed account to ensure credentials are non-persistent after use.

## Detection and Remediation

To maintain the integrity of the LAPS state, use the following Proactive Remediation scripts to detect and fix drift.

### Detection Script

```powershell
# Check for active LAPS configuration
$lapsConfig = Get-LapsConfig -ErrorAction SilentlyContinue

if ($null -eq $lapsConfig) {
    Write-Error "LAPS Configuration missing."
    exit 1
}

# Verify successful backup to Entra ID (Event ID 10004)
$status = Get-LapsDiagnostics | Where-Object { $_.EventID -eq 10004 }

if ($null -eq $status) {
    Write-Host "Policy exists but backup has not occurred."
    exit 1
}

Write-Host "LAPS is healthy."
exit 0
```

### Remediation Script

```powershell
try {
    # Ensure the target local account exists
    $AdminAccount = "LocalAdmin"
    if (-not (Get-LocalUser -Name $AdminAccount -ErrorAction SilentlyContinue)) {
        New-LocalUser -Name $AdminAccount -NoPassword -Description "LAPS Managed Account"
        Add-LocalGroupMember -Group "Administrators" -Member $AdminAccount
    }

    # Force the LAPS engine to process the policy
    Invoke-LapsPolicyProcessing
    Write-Host "LAPS remediation successful."
} catch {
    Write-Error "Remediation failed: $($_.Exception.Message)"
    exit 1
}
```
