---
title: "PEP 686: Python Finally Kills the Windows Locale Default"
description: "Python 3.15 makes UTF-8 the default across all platforms. Legacy PowerShell 5.1 can still get in the way."
pubDate: 2026-10-06
tags: ["Python", "Windows", "PowerShell"]
category: "Data Engineering"
---

If you develop on Linux or macOS and run jobs on Windows, you have hit this bug:

```python
with open("data.json") as f:
    payload = f.read()
```

Without an explicit `encoding="utf-8"`, that line behaved differently depending on the host OS. Linux gave you UTF-8. Windows inspected the system locale and defaulted to `cp1252` (or your regional equivalent). The file opened fine locally, then broke on a Windows runner with a `UnicodeDecodeError`.

PEP 686 fixes this in Python 3.15. Standard file operations and stdio streams now default to UTF-8 everywhere, including Windows.

---

### What Changes

The runtime assumes UTF-8 by default. You no longer need to pass `encoding="utf-8"` to every standard file call just to guarantee cross-platform parity. (If you want this behavior on earlier versions today, set `PYTHONUTF8=1` or run with `-X utf8`).

If you actually need the host platform's legacy ANSI code page to interface with older software, you now request it explicitly:

```python
with open("export.csv", encoding="locale") as f:
    payload = f.read()
```

---

### The PowerShell 5.1 Gotcha

Modern PowerShell 7 (`pwsh`) already defaults to UTF-8 without BOM across streams and cmdlets. Interop with Python 3.15 is clean.

Windows PowerShell 5.1 (`powershell.exe`) is where this breaks.

1. **Piping stdio into Python:** In 5.1, `$OutputEncoding` defaults to ASCII. If you pipe data into Python, non-ASCII characters get mangled before Python's `sys.stdin` reads them:
```powershell
# PowerShell 5.1 defaults to ASCII output encoding
$raw_json | python ingest.py
```

2. **Redirection to disk:** Redirecting stdout with `>` in 5.1 writes UTF-16 LE because `>` is syntactic sugar for `Out-File`. Reading that file back in Python 3.15 with a bare `open("output.json")` immediately fails because Python now expects UTF-8, not UTF-16.

If you have legacy 5.1 scripts driving Python tasks, normalize both stdio and cmdlet output encodings first:

```powershell
# Fix stdio piping to/from external executables
$OutputEncoding = [System.Text.UTF8Encoding]::new($false)
[Console]::OutputEncoding = [System.Text.UTF8Encoding]::new($false)

# Fix '>' redirection (Out-File)
$PSDefaultParameterValues['Out-File:Encoding'] = 'utf8'
```

It is a small change in the spec, but it eliminates decades of unnecessary platform drift.
