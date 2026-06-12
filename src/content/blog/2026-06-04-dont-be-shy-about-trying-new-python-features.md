---
title: "Don't Be Shy About Trying New Python Features"
description: "Learn how to use uv to run Python 3.15 and test PEP 798 (Unpacking in Comprehensions) without global environment overhead."
pubDate: 2026-06-04
tags: ["Python", "uv", "Data Engineering"]
category: "Data Engineering"
---

Historically, experimenting with alpha versions of Python was a tedious chore, often requiring manual compilation or risking conflict with your system-level package managers. But with `uv`, target-testing next-generation Python is entirely frictionless. You can spin up isolated, version-pinned environments in seconds.

One of the most exciting additions coming in Python 3.15 (which you can explore in detail in the official [What's New in Python 3.15](https://docs.python.org/3.15/whatsnew/3.15.html) release notes) is **PEP 798 (Unpacking in Comprehensions)**. This feature introduces support for iterable unpacking (`*`) and dictionary unpacking (`**`) directly within comprehensions. Rather than writing verbose nested loops, relying on complex list generator expansions, or chaining utilities like `itertools.chain`, you now have a unified, native tool to flatten and merge data streams in-line. It's a prime example of Python's evolution: bringing syntax elegance and feature consistency to our daily data pipelines.

To test this experimental runtime right now without touching your global environment, you only need to run:

```bash
# Initialize a new project directory using the Python 3.15 toolchain
uv init pep798-demo --python 3.15
cd pep798-demo

# Ensure uv pulls the latest pre-release binary
uv python install 3.15
```

`uv` automatically fetches, caches, and isolates the pre-release build, ensuring your system environment remains completely clean.

Next, initialize your application entry point:

```bash
touch main.py
```

Open `main.py` in your editor. Let's explore two practical data engineering scenarios: flattening nested list payloads and merging dictionary metadata tags directly inside collection generators.

### Scenario 1: Flattening Traffic Logs (Iterable Unpacking)

Imagine you are building an ingestion pipeline that aggregates traffic data from two separate sources: a highway sensor network and a city camera grid. Each source returns a list of dictionaries, where each dictionary represents a device and contains a nested list of speed logs. Your goal is to combine and flatten these speed logs into a single flat list.

Historically, this required nested comprehension loops or wrapping the pipeline in `itertools.chain`. With PEP 798, you can unpack the inner logs inline:

```python
# Data payloads from separate ingestion sources
sensor_network = [
    {"sensor_id": "A1", "logs": [60, 65, 58]},
    {"sensor_id": "A2", "logs": [72, 70]}
]

city_cameras = [
    {"cam_id": "C1", "logs": [45, 48]},
    {"cam_id": "C2", "logs": [50, 52, 55]}
]

all_sources = [sensor_network, city_cameras]

# PEP 798: Unpack the inner 'logs' directly within the comprehension
flat_traffic_logs = [
    *record["logs"] 
    for source in all_sources 
    for record in source
]

print(flat_traffic_logs)
# Output: [60, 65, 58, 72, 70, 45, 48, 50, 52, 55]
```

### Scenario 2: Merging Sensor Metadata (Dictionary Unpacking)

The same efficiency applies when combining metadata contexts. Imagine you have a stream of sensor telemetry messages, and each message references a list of metadata dictionaries (like geo-location tags, environmental conditions, and system status). You want to merge these dictionaries into a single combined context dictionary.

Before PEP 798, merging a list of dictionaries inside a comprehension required complex workarounds (like calling `.update()` in nested statements) or loops. Now, you can use dictionary unpacking (`**`) inline:

```python
# Multiple metadata contexts associated with a telemetry stream
metadata_responses = [
    {"route": "I-95", "mile_marker": 142},
    {"condition": "Rain", "visibility": "Low"},
    {"sensor_status": "Active"}
]

# PEP 798: Unpack and merge dictionaries directly within a dict comprehension
merged_metadata = {
    **response 
    for response in metadata_responses
}

print(merged_metadata)
# Output: {'route': 'I-95', 'mile_marker': 142, 'condition': 'Rain', 'visibility': 'Low', 'sensor_status': 'Active'}
```

### Execution

With your code saved, you can run the script instantly using `uv`:

```bash
uv run --python 3.15 main.py
```

### Why Start Adopting This Pattern?

Integrating unpacking operators into comprehensions delivers key architectural benefits:

* **Linear Readability**: The syntax reads naturally from left to right, eliminating the cognitive friction and inverted order of complex nested `for` clauses.
* **Syntax Symmetry**: It brings full consistency to Python. The same `*` and `**` operators we already rely on for variable assignment and function arguments now work seamlessly inside comprehensions.
* **Declarative Power**: You describe *what* the final structure should look like, avoiding the boilerplate of initializing empty containers and calling mutating methods like `.extend()` or `.update()`.

Using `uv` removes the friction of compiling pre-releases from source, making it easier than ever to target future runtimes and master next-generation Python patterns today.
