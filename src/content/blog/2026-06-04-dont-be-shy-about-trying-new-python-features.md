---
title: "Don't Be Shy About Trying New Python Features"
description: "Learn how to use uv to run Python 3.15 and test PEP 798 (Unpacking in Comprehensions) without global environment overhead."
pubDate: 2026-06-04
tags: ["Python", "uv", "Data Engineering"]
category: "Data Engineering"
---

I didn't always experiment with new Python features, but with uv, launching a Python instance with any version of Python requires a lot less overhead. Create a project and it is ready in seconds with minimal commands.

One of the new Python 3.15 features I was excited to try is PEP 798 (Unpacking in Comprehensions). It allows iterable unpacking (`*` and `**`) directly inside comprehensions. Instead of having to remember different custom loop structures or chain utilities for every different data type, we get a unified tool to safely flatten and merge our data pipelines natively. That is the magic of Python—we get cool features for free.

To test this experimental runtime right now, you only need to run:

```bash
# Initialize a new project directory using the Python 3.15 toolchain
uv init pep798-demo --python 3.15
cd pep798-demo

# Ensure uv pulls the latest pre-release binary
uv python install 3.15
```

uv automatically fetches and isolates the pre-release build, keeping your global environment completely untouched.

Next, create your application entry point:

```bash
touch main.py
```

Now, open `main.py`. Let’s look at a real-world data engineering task: combining and flattening traffic sensor logs from multiple APIs.

### The Scenario: Merging Traffic Logs

Imagine you are processing ingestion pipelines. You pull payloads from a highway sensor network and a city camera grid. Each source returns a list of records containing vehicle logs. You need to combine these independent streams into a single flat list for downstream analysis.

Traditionally, this required verbose nested loops or falling back to `itertools.chain`. With PEP 798, you can unpack data streams directly inside the collection generator.

Add this code to your `main.py`:

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

# PEP 798: Unpack the inner 'logs' directly while iterating
flat_traffic_logs = [
    *record["logs"] 
    for source in all_sources 
    for record in source
]

print(flat_traffic_logs)
# Output: [60, 65, 58, 72, 70, 45, 48, 50, 52, 55]
```

### Merging Metadata Contexts

The same efficiency applies when combining contextual metadata maps (such as merging geolocation tags and environmental conditions) using dictionary unpacking. You can append this example to your file as well:

```python
geo_tags = {"route": "I-95", "mile_marker": 142}
weather_tags = {"condition": "Rain", "visibility": "Low"}

# Inline dictionary composition
stream_metadata = {**geo_tags, **weather_tags}

print(stream_metadata)
# Output: {'route': 'I-95', 'mile_marker': 142, 'condition': 'Rain', 'visibility': 'Low'}
```

### Execution

With your code saved, execute your script instantly through uv:

```bash
uv run --python 3.15 main.py
```

### Why Start Adopting This Pattern?

Integrating iterable unpacking into your comprehensions delivers clear architectural benefits:

* **Linear Readability**: The syntax reads naturally from left to right, eliminating the cognitive friction of inverted nested `for` clauses.
* **Declarative Hygiene**: It brings full symmetry to Python’s syntax. The same `*` and `**` operators used for variable unpacking and function arguments now handle collection generation cleanly.

Using uv eliminates the overhead of compiling alpha binaries from source, making it completely frictionless to clone a repository, target a future runtime, and start mastering next-generation Python layout habits today.
