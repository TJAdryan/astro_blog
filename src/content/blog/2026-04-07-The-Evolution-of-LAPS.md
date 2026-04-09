---
title: "The Evolution of LAPS"
description: "How Windows LAPS evolved into a native part of the OS security posture."
pubDate: "2026-04-07T22:15:00-04:00"
tags: ["Security", "Windows", "LAPS", "Active Directory"]
categories: ["Security", "Tech Strategy"]
draft: false
---

The evolution of LAPS is less of a "product replacement" and more of an organic hardening of the Windows kernel itself. It’s moving from an external utility to a native, living part of the operating system's security posture.

The real story isn't just that the tech changed; it’s that the strategy changed. We are finally treating the "Local Admin" as a high-value target that deserves the same encryption and rotation rigor as a Domain Admin.

## No Windows Policy would be complete without a known error

When implemented with two windows configurations, one to create the policy and the second to create the admin account, you will get an error in the policy even though the admin account exists.

The "Service in Error" ghost is a notorious friction point in modern deployments. It typically occurs when a policy is successfully pushed, but the underlying LAPS engine stalls because it detects a legacy "AdmPwd" MSI or orphaned registry keys from a previous image. You’ll see the policy reflected in the registry, but the operational logs throw a conflict error (often Event ID 10031) as the native OS service refuses to initialize while a legacy hook is present.

I can't live like that so I moved to a detect-and-remediation script. That allows you to actively scrub legacy artifacts and force-trigger Invoke-LapsPolicyProcessing, ensuring the "Domain LAPS" logic actually takes hold rather than just sitting in a configured-but-failed state.

### Detection Script

This script returns an exit code of 1 if a problem is found, triggering the remediation.

```powershell
# Check 1: Is the legacy LAPS MSI present?
$legacyMsi = Get-Package -Name "Local Administrator Password Solution" -ErrorAction SilentlyContinue

# Check 2: Is the native LAPS engine reporting a failure in the registry?
# A missing 'LastSuccess' timestamp or presence of an error code in the State key indicates a failure.
$lapsStatePath = "HKLM:\Software\Microsoft\Windows\CurrentVersion\LAPS\State"
$stateError = $false
if (Test-Path $lapsStatePath) {
    $lastSuccess = Get-ItemProperty -Path $lapsStatePath -Name "LastStoredPasswordTimestamp" -ErrorAction SilentlyContinue
    if (-not $lastSuccess) { $stateError = $true }
} else {
    $stateError = $true
}

# Exit 1 triggers the Remediation script; Exit 0 means compliant.
if ($legacyMsi -or $stateError) {
    Write-Output "LAPS conflict or uninitialized state detected."
    exit 1 
} else {
    Write-Output "LAPS is healthy."
    exit 0
}
```

### Remediation Script

This script executes only if the Detection script fails. It scrubs the environment and forces a policy refresh.

```powershell
# 1. Remove Legacy MSI to resolve hook conflicts
$legacyLaps = Get-Package -Name "Local Administrator Password Solution" -ErrorAction SilentlyContinue
if ($legacyLaps) {
    Uninstall-Package -Name "Local Administrator Password Solution" -Force | Out-Null
}

# 2. Purge the orphaned state to force a fresh handshake
$lapsStatePath = "HKLM:\Software\Microsoft\Windows\CurrentVersion\LAPS\State"
if (Test-Path $lapsStatePath) {
    Remove-Item -Path $lapsStatePath -Recurse -Force
}

# 3. Explicitly invoke the native engine
try {
    # This cmdlet is built-in to Windows 10/11 and Server 2019+ (post-2023 updates)
    Invoke-LapsPolicyProcessing -ErrorAction Stop
    Write-Output "LAPS native engine successfully re-initialized."
} catch {
    Write-Error "Remediation failed. Check AD Schema or OS Version. Error: $_"
    exit 1
}
```

## The Evolution: From Agent to Native

For years, LAPS was essentially a sidecar. You had to deploy an MSI, manage an agent, and hope your ACLs were tight because passwords sat in Active Directory in cleartext.

The "New" Windows LAPS (introduced in 2023 and refined through 2025-26) isn't something you install; it's something you enable. It’s baked into Windows 10/11 and Server 2019/2022/2025. It introduces a massive architectural upgrade: Group-Managed Password Encryption. Now, when a password is sent to AD, it’s encrypted with the DC’s own keys. Even if an attacker dumps the directory, they don’t get the keys to your workstations.

## The "Domain LAPS Member" Paradox

The most fascinating development is the introduction of Domain LAPS. On paper, using a "Local" tool to manage "Domain" accounts sounds like a category error. It feels like using a deadbolt on a door that is already inside a vault.

But here is why it’s actually a stroke of genius for lateral movement defense:

### 1. The Death of the Service Account "Forever Password"

We all have them: service accounts for SQL, backups, or scanners that have had the same password since the Bush administration. Because they are domain accounts, they have broad reach. Because they are used by scripts, nobody wants to touch them.

By making these Domain LAPS Members, you are applying the LAPS "rotation engine" to the directory level. The password becomes ephemeral.

### 2. Just-In-Time (JIT) Credentialing

When you manage a domain account via LAPS, you are effectively turning it into a "Ghost Account." The password only exists in a usable state when it’s actually needed. Once the task (or the rotation window) is over, LAPS rolls the credential. The hope is, an attacker who sniffs that password on a server finds it’s already been "burned" by the time they try to use it.

### 3. Automatic DSRM Management

Historically, the Directory Services Restore Mode (DSRM) password on Domain Controllers was a major security hole—often set once during forest creation and never changed. Windows LAPS now handles DSRM rotation automatically. It treats the DC's most sensitive "backdoor" like a standard local admin account, ensuring it’s unique and rotated across every DC in your fleet.

## Why it feels "Counter-Intuitive"

We were taught to separate the Local Kingdom from the Domain Kingdom.

- Local: Low trust, isolated.
- Domain: High trust, centralized.

By introducing Domain LAPS, Microsoft is admitting that the border between these two is where most breaches happen. By using the "Local" logic of Rotate-on-Use and Unique-per-Endpoint for domain-level service accounts, they’ve created a hybrid security model that is significantly harder to map and exploit.

It’s a more secure version of LAPS yet because it stops pretending that "Domain" accounts are inherently safe just because they live in the directory. It treats every credential—local or domain—as a temporary, encrypted secret that should only exist for as long as it’s strictly necessary.
