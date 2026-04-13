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

In Entra ID, the dependency on Domain Controller line-of-sight is removed. Rotation occurs over HTTPS, meaning endpoints stay compliant on any internet connection without a VPN. This replaces brittle AD ACLs with Entra RBAC, allowing password retrieval to be gated behind MFA and Conditional Access.

---

## Implementing the Solution

Depending on how your fleet is managed, the path to enforcement differs. Whether you are using **Microsoft Intune** for modern endpoint management or **ARM Templates** for unmanaged cloud infrastructure, the goal is the same: eliminate the race condition and ensure the LAPS engine takes ownership of the account.

### 1. The Managed Path: Microsoft Intune
For workstations and managed servers, the LAPS policy is delivered via the Configuration Service Provider (CSP). This is the cleanest delivery method, but it is the most susceptible to the "Service in Error" ghost if the policy arrives before the user account it is meant to manage exists.

### 2. The Unmanaged Path: ARM Template Integration
For VMs that sit outside of Intune management—such as backend servers or specialized cloud workloads—you must bake the policy into the deployment itself. We use the `Microsoft.Compute/virtualMachines/extensions` resource to trigger the Windows LAPS configuration immediately after provisioning.

#### ARM Template Snippet: LAPS Policy Extension
```json
{
  "type": "Microsoft.Compute/virtualMachines/extensions",
  "apiVersion": "2023-03-01",
  "name": "[concat(parameters('vmName'), '/Microsoft.GuestConfiguration')]",
  "location": "[parameters('location')]",
  "dependsOn": [
    "[resourceId('Microsoft.Compute/virtualMachines', parameters('vmName'))]"
  ],
  "properties": {
    "publisher": "Microsoft.GuestConfiguration",
    "type": "ConfigurationforWindows",
    "typeHandlerVersion": "1.0",
    "autoUpgradeMinorVersion": true,
    "settings": {
      "configuration": {
        "name": "LAPS",
        "parameters": [
          {
            "name": "Laps.BackupDirectory",
            "value": "1" 
          },
          {
            "name": "Laps.AdministratorAccountName",
            "value": "LapsAdmin"
          },
          {
            "name": "Laps.PasswordComplexity",
            "value": "4"
          },
          {
            "name": "Laps.PasswordAgeDays",
            "value": "30"
          }
        ]
      }
    }
  }
}
```

#### Configuration Breakdown
| Parameter | Value | Description |
| :--- | :--- | :--- |
| **Laps.BackupDirectory** | `1` | Backs up the password to Entra ID. |
| **Laps.AdministratorAccountName** | `String` | The specific local account to manage. |
| **Laps.PasswordComplexity** | `4` | Requires Large + small letters + numbers + symbols. |
| **Laps.PasswordAgeDays** | `30` | Forces a rotation every 30 days. |

---

## The "Service in Error" Ghost

A known friction point on new VMs is a policy that lands in the registry while the service reports an error (**Event ID 10031**). This usually stems from a race condition where the policy arrives and attempts to manage an account still being provisioned by the template or CSP. The result is a stalemate: the account exists, but the LAPS engine stalls, refusing to rotate or back up the password because it "missed" the creation event.

Relying on a detect-and-remediation approach—delivered via Intune Proactive Remediation or a post-deployment script—ensures the environment is scrubbed and the handshake is forced.

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
Activating this policy for your VMs or your Intune devices is a good idea in my opinion.  It doesn't resolve every security issue, but it is a step in the right direction. Like most things it depends on how it well it is implemented and that is going to affect how it is adopted.
