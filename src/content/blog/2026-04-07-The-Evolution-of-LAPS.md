---
title: "Modern LAPS: Transitioning to Native Security"
description: "Moving from legacy LAPS agents to integrated encryption and Domain LAPS members."
pubDate: "2026-04-08T09:00:00-04:00"
tags: ["Security", "Windows", "LAPS", "Active Directory"]
category: "Security"
draft: false
---

Managing local administrator passwords used to mean relying on legacy agents, on-premises Active Directory, and line-of-sight networks. Today, Windows LAPS has evolved into a native OS feature that simplifies this entire process. By integrating directly with Microsoft Entra ID and rotating passwords over HTTPS, we can secure our endpoints and infrastructure without needing a VPN.

This modern approach provides a unified security posture. Whether you are managing user workstations through Intune or configuring cloud-native VMs with Azure Policy, you can maintain a consistent standard. Ultimately, LAPS serves as a critical isolation layer, guaranteeing that local administrator credentials remain non-global, non-static, and safely locked behind MFA-backed RBAC. Let's walk through how to set this up effectively.

## Implementation: Azure Virtual Machines

For Azure VMs, implementing LAPS via Azure Policy helps ensure a consistent security baseline across your entire cloud environment. This approach is highly efficient because it utilizes the native Guest Configuration extension, completely avoiding the need for manual agent installation and maintenance.

Once you have the policy assigned, you can verify the state of the local engine using the native PowerShell module. Here is the snippet to check your configuration:

```powershell
# Verify the LAPS native engine is running and processing policies
Get-LapsDiagnostics -Scope Operational

# Force a background processing cycle for LAPS
Invoke-LapsPolicyProcessing

# Confirm the managed account and the backup destination
Get-LapsConfig
```

## Implementation: Microsoft Intune

For workstations managed in Intune, deploying LAPS via Account Protection policies is your best route. This leverages the built-in LAPS Configuration Service Provider (CSP) to manage the password lifecycle on endpoints natively.

### Policy Configuration

Here is a quick checklist for setting this up:

- Navigate to **Endpoint Security** > **Account Protection**.
- Create a new **Local admin password solution (Windows LAPS)** policy.
- Set the **Backup Directory** to **Microsoft Entra ID**.
- Configure **Post-Authentication Actions** to *Reset the password and logoff the managed account*. This ensures those credentials aren't left behind after they are used.

## Detection and Remediation

Configuration drift happens. To ensure your LAPS state remains intact, you can use these Proactive Remediation scripts in Intune to automatically detect and fix any endpoints that fall out of compliance.

### Detection Script

Run this script to check if LAPS is active and successfully backing up passwords:

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

If the detection script flags an issue, you can use this counterpart script to step in and fix it automatically:

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
