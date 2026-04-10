---
title: "Modern LAPS: Transitioning to Native Security"
description: "Moving from legacy LAPS agents to integrated encryption and Domain LAPS members."
pubDate: "2026-04-08T09:00:00-04:00"
tags: ["Security", "Windows", "LAPS", "Active Directory"]
category: "Security"
draft: false
---

The transition to Windows LAPS is a pivot from managing "sidecar" agents to utilizing a native OS feature. It replaces cleartext AD attributes with group-managed encryption, treating local credentials with the same rigor as the domain itself.

## The Domain LAPS Paradox

Managing "Domain" accounts with a "Local" tool sounds like an architectural hall of mirrors, but it addresses the **Service Account Gap**. Automated accounts for backups or SQL often have static passwords that go unchanged for years to avoid breaking pipelines. By designating these as Domain LAPS members, the rotation engine is applied to the directory level. The password becomes ephemeral—neutralizing the lateral movement an attacker relies on.

## The Entra ID Pivot

In Entra ID, the dependency on DC line-of-sight is removed. Rotation occurs over HTTPS, meaning endpoints stay compliant on any internet connection without a VPN. This replaces brittle AD ACLs with Entra RBAC, allowing password retrieval to be gated behind MFA and Conditional Access.

## The "Service in Error" Ghost

A known friction point on new VMs is a policy that lands in the registry while the service reports an error (Event ID 10031). Whether deploying in Intune to manage users or applying to an ARM template, there is an issue of failing to report the account creation was successful. This usually stems from a race condition where the policy arrives and attempts to manage an account still being provisioned by the template or CSP. The result is a stalemate: the account exists, but the LAPS engine stalls, refusing to rotate or back up the password because it "missed" the creation event.

Relying on a detect-and-remediation approach ensures the environment is scrubbed and the handshake is forced.

### Detection Script

```powershell
$legacyMsi = Get-Package -Name "Local Administrator Password Solution" -ErrorAction SilentlyContinue
$lapsStatePath = "HKLM:\Software\Microsoft\Windows\CurrentVersion\LAPS\State"
$stateError = $false

if (Test-Path $lapsStatePath) {
    $lastSuccess = Get-ItemProperty -Path $lapsStatePath -Name "LastStoredPasswordTimestamp" -ErrorAction SilentlyContinue
    if (-not $lastSuccess) { $stateError = $true }
} else {
    $stateError = $true
}

if ($legacyMsi -or $stateError) { exit 1 } else { exit 0 }
```

### Remediation Script

```powershell
$legacyLaps = Get-Package -Name "Local Administrator Password Solution" -ErrorAction SilentlyContinue
if ($legacyLaps) {
    Uninstall-Package -Name "Local Administrator Password Solution" -Force | Out-Null
}

$lapsStatePath = "HKLM:\Software\Microsoft\Windows\CurrentVersion\LAPS\State"
if (Test-Path $lapsStatePath) {
    Remove-Item -Path $lapsStatePath -Recurse -Force
}

try {
    Invoke-LapsPolicyProcessing -ErrorAction Stop
} catch {
    Write-Error "Remediation failed: $_"
    exit 1
}
```

The evolution is a move away from the assumption that domain accounts are inherently safe. Whether on-prem or in Entra, credentials are now handled as temporary, encrypted secrets.