---
title: "DB Basics with DuckDB and some Nuances"
description: "An exploration of database engineering terminology gaps, the differences between ETL and ELT compute paradigms, and the SELECT * query performance nuances in analytical engines like DuckDB."
pubDate: 2026-07-03
tags: ["Databases", "DuckDB", "Data Engineering", "SQL"]
category: "Data Engineering"
---

Database engineering can be gatekept by terminology. Tech vocabulary is highly fragmented: one manager demands academic definitions, another uses legacy enterprise jargon, and a third relies on vendor buzzwords. This variance creates arbitrary barriers, treating a subjective dialect as a proxy for competence. Unfortunately, this problem is not the fault of hiring managers; they are just looking for someone who can help them, and assessing the relative competence of an applicant can be a challenge. As my friend Aaron wisely says, "If you really want to learn, learn to help."

Consider cloud object storage. Architecturally, AWS S3 and Azure Blob Storage are identical paradigms: flat, virtually infinite file stores optimized for decoupled compute. If you understand how to stream a Parquet file into DuckDB from one, you know how to do it for both. Yet, the vocabulary layer is completely fragmented:

* **AWS Framework:** Bucket ──> Object ──> S3 Endpoint
* **Azure Framework:** Container ──> Block Blob ──> Blob Endpoint

Microsoft didn't have to call their product "Blob" storage—they chose to wrap a universal engineering concept in proprietary enterprise branding. Having a good definition on hand is great, but I always feel that a little practice with a concept makes remembering the definition more salient. Here are a couple of concepts that are frequently reviewed, some with some practical exercises:

---

## ETL vs. ELT: Where the Compute Happens

Data pipeline paradigms differ based on where the heavy lifting occurs.

* **ETL:** Source ──> `[ External Compute Engine ]` ──> Target Database
* **ELT:** Source ──> Target Database ──> `[ Internal Compute Engine (SQL) ]`

### ETL (Extract, Transform, Load)
Data is transformed by an external middleware layer (like Spark or Python scripts) before hitting the target database. This requires separate infrastructure and forces full pipeline reruns if transformation logic changes.

### ELT (Extract, Load, Transform)
Raw data is dumped directly into the target system, and transformations are executed inside the database. Vectorized, local analytical engines like DuckDB make ELT highly efficient, letting you transform data natively via SQL (`CREATE TABLE AS SELECT`).

---

## DuckDB Indexing: The SELECT * Fallacy

In transactional databases (OLTP), indexes are the default fix for slow queries. In an analytical engine (OLAP) like DuckDB, secondary indexes are highly specialized and often bypassed by design.

A common misconception is that an index speeds up any query filtering on an indexed column. When retrieving entire rows, a full table scan and an index lookup perform identically.

### The Setup: Generating Mock Data
To see this in action, we can use DuckDB's built-in functions to spin up a table with 10 million rows and a secondary index:

```sql
-- Create an analytical schema
CREATE TABLE lineitem (
    order_id INTEGER,
    part_id INTEGER,
    supplier_id INTEGER,
    quantity INTEGER,
    extended_price DECIMAL(10,2),
    ship_date DATE
);

-- Generate 10 million rows of dummy data
INSERT INTO lineitem 
SELECT 
    (random() * 1000000)::INTEGER AS order_id,
    (random() * 50000)::INTEGER AS part_id,
    (random() * 10000)::INTEGER AS supplier_id,
    (random() * 50)::INTEGER AS quantity,
    (random() * 1000)::DECIMAL(10,2) AS extended_price,
    CURRENT_DATE - (random() * 365)::INTEGER AS ship_date
FROM generate_series(1, 10000000);

-- Explicitly build an Adaptive Radix Tree (ART) index
CREATE INDEX idx_order_id ON lineitem (order_id);
```

### Comparing Execution
If you query a single transaction by its ID requesting every attribute, the index offers no resource savings over a localized sequential scan:

```sql
-- Query 1: Forcing a full row retrieval via the index
SELECT * FROM lineitem WHERE order_id = 543210;
```

Mechanically, this operation encounters the materialization bottleneck:

1. **Index Path:** DuckDB queries the radix tree index to locate the physical row identifier (tuple ID) for `543210`.
2. **Scattered I/O:** Because the query requests `SELECT *`, DuckDB must pull every column for that specific row. Since DuckDB stores data column by column, it must jump across separate files or memory blocks to assemble the record. This triggers slow, random I/O reads.

DuckDB’s vectorized engine scans compressed column blocks sequentially at billions of rows per second. The overhead of index traversal combined with scattered column reads quickly matches or exceeds the cost of a raw scan.

---

## Effective Performance Vectors in DuckDB

Secondary indexes are only necessary for:

### Highly Selective Point Lookups
Retrieving a single column for a specific row, avoiding the materialization bottleneck entirely.

```sql
-- Optimized Path: Pulls only the requested column file
SELECT extended_price FROM lineitem WHERE order_id = 543210;
```

### Constraint Enforcement
DuckDB automatically builds unique indexes behind the scenes to enforce `PRIMARY KEY` and `UNIQUE` properties.

---

For general analytical performance, rely on DuckDB's built-in optimization mechanics instead of manual indexes:

* **Zone Maps:** DuckDB automatically tracks the Min/Max values of column blocks to skip irrelevant data entirely without index overhead.
* **Data Sorting:** Physical sorting groups similar values together, maximizing block-skipping efficiency via zone maps.
* **Projection Pushdown:** Select only required columns. Isolating specific fields ensures uncalled column files are never read into memory.

---

## Getting Started with DuckDB

If you're looking to get started with DuckDB, the official guides and documentation are excellent starting points:

* **[Official DuckDB Documentation](https://duckdb.org/docs/)**: The definitive starting point for installation, core concepts, and comprehensive language APIs (Python, R, Java, Node.js, etc.).
* **[DuckDB Official Guides](https://duckdb.org/docs/guides/)**: Practical recipes for loading data, querying flat files (CSV, Parquet, JSON), and connecting to cloud object stores.
* **[Awesome DuckDB](https://github.com/duckdb/awesome-duckdb)**: A community-curated collection of tools, tutorials, extensions, and articles.
