---
title: 'Taking the Small Wins: How Incremental Improvements Cut My API Call Times
  from 70 to 45 Minutes'
categories:
- Python
- Performance
- APIs
- DataEngineering
- orjson
- Optimization
tags:
- Python
- API
- performance
- optimization
- json
- orjson
- benchmark
- data pipeline
- incremental improvement
- long-term code health
pubDate: 2025-07-19 12:00:00 -0400
description: 'A post about Taking the Small Wins: How Incremental Improvements Cut
  My API Call Times from 70 to 45 Minutes.'
---




As someone who looks back at their own code and sees a mix of pride and regret, I am often torn between the desire to improve what is there and the fear of breaking something that already works. I am sure this is a common feeling, and not just something I suffer from (right?). However, sometimes there are opportunities to make small, incremental improvements that can lead to significant performance gains ~~without~~ with just a small risk of a catastrophic failure. This post is about one such improvement I made recently that cut my nightly API call times from 70 minutes to 45 minutes—a 36.44% speedup—by optimizing how I parsed JSON data.

### The Nightly Grind: My API Performance Bottleneck

One of the processes our team relies on is a nightly API call. Its purpose: to fetch the current status for approximately 3,000 distinct objects. This process had a frustratingly consistent completion time of **70 to 80 minutes**. The process runs overnight, so while it wasn't critical to reduce the time, it still presented an increased risk of failure due to the long duration. If something went wrong, it would hold back other processes, and the accumulation would mean the longer it took to discover the issue, the longer it would take to recover.

The complexity stemmed not only from the sheer volume of calls but also from the nature of the API responses. The JSON data returned for each object was deeply nested, and crucially, the specific information I needed wasn't consistently located under the same header. My parsing logic often involved a series of attempts: try Header A, if not found, try Header B, and so on. This added considerable overhead to each object's processing.

My initial attempts to speed things up focused on concurrency. I pushed Python's [`ThreadPoolExecutor`](https://docs.python.org/3/library/concurrent.futures.html) as far as I could, making multiple requests simultaneously. This certainly helped, but I quickly slammed into the API's inherent rate limits, which effectively capped how much more parallelization I could achieve.

In a search for further optimization, I even experimented with downloading *all* the raw JSON data first, for all 3,000 objects, and then parsing it in a separate, dedicated step. This was a revelation for raw data acquisition: the data was downloaded in under 15 minutes! However, the next step of parsing and restructuring that massive, inconsistent raw JSON proved to be incredibly cumbersome and complex. The code became brittle, and I found I was having to retool all the parsing logic. I realized I was running into a wall.  I needed a more fundamental change to how I was handling JSON parsing, which turned out to be the place where I could get a significant performance boost without overhauling the entire process.



### The Root of the Problem: Slow JSON Parsing

When your Python application receives data from an API, it arrives as a JSON string or byte stream. This raw data must be converted ("parsed" or "deserialized") into Python objects (like dictionaries and lists) before you can work with it.

Python's built-in `json` module, while reliable and universally available, performs this parsing primarily in Python. For a high volume of calls or large, complex JSON payloads, this Python-level execution can introduce significant overhead. It becomes a CPU-bound operation that can limit your application's overall throughput, even if your network requests are efficient.

### `orjson`: The Performance Enhancer

`orjson` is a JSON library for Python implemented in Rust. By leveraging Rust's compiled, highly optimized nature, `orjson` can perform JSON parsing and serialization operations dramatically faster than the built-in `json` module. It bypasses many of Python's inherent runtime overheads, directly boosting processing speed.

**Key characteristics of `orjson`:**

* **Exceptional Speed:** Benchmarks consistently show `orjson` deserialization (`loads`) outperforming `json.loads()` by significant margins.
* **JSON Standard Compliance:** It strictly adheres to the JSON specification (RFC 8259) and UTF-8 encoding.
* **Native Type Support:** It intelligently handles common Python types such as `datetime`, `UUID`, and `numpy` arrays directly, reducing the need for custom serializers/deserializers.
* **Familiar API:** Its `loads` and `dumps` functions closely mirror the standard `json` module's interface, making it relatively straightforward to integrate into existing code. (Note: `orjson.dumps` returns `bytes`, while `json.dumps` returns `str`).

### Quantifying the Gain: A Practical Benchmark

To demonstrate `orjson`'s impact, let's run a controlled benchmark. We'll generate a large, representative JSON dataset and measure the parsing time for both `json` and `orjson` over multiple repetitions using the `timeit` module for accuracy.

**Installation:**

```bash
pip install orjson
```

**Benchmark Script:**

```python
import json
import orjson
import timeit
import datetime
import uuid
import sys

# Function to generate a large, nested JSON structure for testing
def create_large_test_json(num_entries=10000): # Using 10,000 entries to match your previous output
    entries = []
    for i in range(num_entries):
        current_entry = {
            "id": f"entry-{i}-{uuid.uuid4()}", # Include UUID for more realistic complexity
            "name": f"Item Name {i}",
            "value": i * 1.23,
            "details": {
                "category": "Category " + str(i % 10),
                "status": "Online" if i % 2 == 0 else "Offline",
                "tags": ["tag_a", "tag_b", "tag_c"] if i % 2 == 0 else ["tag_x", "tag_y"],
                "created_at": datetime.datetime.now(datetime.timezone.utc).isoformat() # Include datetime
            },
            "config": {"ip": f"192.168.1.{100 + i}", "os": "Linux"},
            "history": [{"timestamp": timeit.default_timer() - j, "event": f"Event {j}"} for j in range(5)]
        }
        entries.append(current_entry)

    # Use orjson.dumps for efficient generation of the test data
    return orjson.dumps({"data": entries})

# Generate test data based on your scale
TEST_DATA_BYTES = create_large_test_json(num_entries=10000)
print(f"Generated test data size: {len(TEST_DATA_BYTES) / (1024*1024):.2f} MB")

# Number of times to repeat the parsing operation for more accurate timing
NUM_REPETITIONS = 100

print(f"\nRunning benchmarks with {NUM_REPETITIONS} repetitions...")

# Benchmark json.loads()
time_json = timeit.timeit(lambda: json.loads(TEST_DATA_BYTES), number=NUM_REPETITIONS)
print(f"Built-in json.loads() took: {time_json:.6f} seconds (total for {NUM_REPETITIONS} runs)")

# Benchmark orjson.loads()
time_orjson = timeit.timeit(lambda: orjson.loads(TEST_DATA_BYTES), number=NUM_REPETITIONS)
print(f"orjson.loads() took:      {time_orjson:.6f} seconds (total for {NUM_REPETITIONS} runs)")

# Confirm parsing accuracy (performed once for correctness)
parsed_data_json_single = json.loads(TEST_DATA_BYTES)
parsed_data_orjson_single = orjson.loads(TEST_DATA_BYTES)

if parsed_data_json_single == parsed_data_orjson_single:
    print("\nParsing results are identical for a single run.")
else:
    print("\nWARNING: Parsing results differ for a single run.")

# Calculate speedup ratio
if time_orjson > 0:
    speedup_factor = time_json / time_orjson
    print(f"\norjson is {speedup_factor:.2f}x faster than built-in json for deserialization (over {NUM_REPETITIONS} runs).")
else:
    print("orjson was extremely fast, time close to zero.")
```

### Interpretation of Results:

Using the benchmark with 10,000 entries and 100 repetitions, we obtained the following results, consistent with real-world scenarios:

* **Generated test data size:** 4.31 MB
* **Built-in `json.loads()` took:** 25.002522 seconds (total for 100 runs)
* **`orjson.loads()` took:** 15.892222 seconds (total for 100 runs)

These results demonstrate that `orjson` is approximately **36.44% faster** than the built-in `json` module for deserialization in this benchmark.

To translate this directly to my problem: if JSON parsing was a significant portion of my 70-minute nightly API call, a **36.44% speedup in parsing time** could translate into substantial real-world savings. For instance, if a process relying heavily on JSON parsing currently takes **1 hour and 10 minutes (70 minutes)**, a 36.44% improvement could reduce that specific processing step to approximately **45 minutes**. This 25-minute reduction is a tangible win, directly impacting how quickly my data pipelines complete.

### Integration with API Workflows

Integrating `orjson` into your existing API client setup (e.g., using the `requests` library) is straightforward:

1.  **Import `orjson`:** `import orjson`
2.  **Use `orjson.loads()` on `response.content`:** Instead of `response.json()`, which internally uses `json.loads()`, explicitly call `orjson.loads(response.content)`. `response.content` provides the raw byte data, which `orjson` prefers for optimal performance.

```python
import requests
import orjson
import time

api_url = "[https://jsonplaceholder.typicode.com/posts/1](https://jsonplaceholder.typicode.com/posts/1)" # Example API endpoint

try:
    response = requests.get(api_url, timeout=10)
    response.raise_for_status() 

    parse_start = time.perf_counter()
    api_data = orjson.loads(response.content)
    parse_end = time.perf_counter()
    
    print(f"API call successful. JSON parsing took: {parse_end - parse_start:.6f} seconds.")
    # Process api_data (now a Python dictionary)
    print(f"Parsed data: {api_data.get('title')[:30]}...")

except requests.exceptions.RequestException as e:
    print(f"API request failed: {e}")
except orjson.JSONDecodeError as e:
    print(f"JSON parsing failed: {e}")
```

### Conclusion

Optimizing JSON parsing is a practical and effective method to enhance API interaction speed, especially when dealing with high data volumes or complex structures. As my own experience demonstrated, identifying and addressing bottlenecks like slow parsing with tools like orjson can yield substantial performance gains. And that's the real lesson here, isn't it? It's not always about needing a massive rewrite. Sometimes, those small, steady improvements—saving a few minutes here and there—are what truly make your code better and your daily work smoother in the long run. Just remember to back up your code before you start tinkering. Your future self will appreciate it.

On a serious note, none of this would be possible without the hard work of the `orjson` team. If you haven't already, I highly recommend checking out their [GitHub repository](https://github.com/ijl/orjson). It might sound hokey, but I can't believe how much my life has been improved by people I have never or probably will never meet.  

