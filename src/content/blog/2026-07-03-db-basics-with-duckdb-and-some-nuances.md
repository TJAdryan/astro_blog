---
title: "DB Basics with DuckDB and some Nuances"
description: "An exploration of database engineering terminology gaps, the differences between ETL and ELT compute paradigms, and the SELECT * query performance nuances in analytical engines like DuckDB."
pubDate: 2026-07-03
tags: ["Databases", "DuckDB", "Data Engineering", "SQL"]
category: "Data Engineering"
---

Database engineering can be gatekept by terminology. Tech vocabulary is highly fragmented: one manager demands academic definitions, another uses legacy enterprise terms, and a third relies on vendor buzzwords. This variance creates arbitrary barriers, treating jargon as a proxy for competence. This is not the intention of hiring managers; they are just looking for someone who can help them, and assessing the relative competence of an applicant is definitely an imperfect science.

The friction reminds me of a fall I took near the Barclays Center. I came up too fast on a deceptively slippery curb and went down, catching myself but bending back the ring finger of my right hand. The pain was delayed, but by the time I got to work, the finger had swollen into a shade of purple I couldn't quite name. When I asked my friend Aaron what color he thought it was, he bypassed the vocabulary completely and said, “You should get that checked out.”

I regularly cite Aaron's wisdom in this blog, so I wanted to ensure I captured his exact point. When I asked him, "Do you mean learning to help, helps you to learn?" Aaron retorted, "No, I think you should go see a doctor today."

Maybe it was the fall talking but Arron was starting to make a lot of sense, learning to help people does help you to learn.  I was confused for a moment, was Aaron was shaking his head no or the room was spinning.  If I was going to write this blog post I would need to focus.

Consider cloud object storage. Architecturally, AWS S3 and Azure Blob Storage are identical paradigms: flat, virtually infinite file stores optimized for decoupled compute. If you understand how to stream a Parquet file into DuckDB from one, you know how to do it for both. Yet, the vocabulary layer is completely fragmented:

* **AWS Framework:** Bucket ──> Object ──> S3 Endpoint
* **Azure Framework:** Container ──> Block Blob ──> Blob Endpoint

Microsoft didn't have to call their product "Blob" storage—they chose to wrap a universal engineering concept in proprietary enterprise branding. Having a good definition on hand is great, but I always feel that a little practice with a concept makes remembering the definition more salient. Here are a couple of concepts that are frequently reviewed, some with some practical exercises:

---

## ETL vs. ELT: Where the Compute Happens

The real distinction between ETL and ELT isn't about the acronyms; it's about where you choose to pay the compute tax. With ETL, you are forced to spin up and maintain external middleware—like Spark or a dedicated Python runtime—to clean the data before it hits the destination. If your transformation logic changes tomorrow, you have to rerun the entire pipeline from scratch:

* **ETL:** Source ──> `[ External Compute Engine ]` ──> Target Database

ELT shifts that heavy lifting directly to the target system. Using a vectorized analytical engine like DuckDB allows you to dump raw data directly into the database and handle transformations natively via local SQL (`CREATE TABLE AS SELECT`), cutting out the middleware infrastructure entirely:

* **ELT:** Source ──> Target Database ──> `[ Internal Compute Engine (SQL) ]`

---

## DuckDB Indexing: The SELECT * Fallacy

Bringing traditional indexing habits to DuckDB will backfire. In transactional OLTP setups, slapping a secondary index on a column is the default reflex to fix a slow query. In an OLAP engine like DuckDB, the query planner often bypasses secondary indexes by design because the engine is already optimized for fast columnar scans.

The common trap is assuming an index speeds up everything. If you execute a `SELECT *` query, an index lookup and a full table scan perform identically. The index might locate the row instantly, but the engine still has to fetch every single column across the disk blocks, completely wiping out any theoretical performance gain.

### The Setup: Generating Mock Data
To see this in action, we can use DuckDB's built-in functions to spin up a table with 10 million rows and a secondary index. If you are running this in a Python environment, you can refer to the [DuckDB Python Getting Started Guide](https://duckdb.org/docs/api/python/overview) to set up your connection:

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

### Constraint Enforcement and Performance Mechanics

DuckDB automatically constructs internal unique indexes exclusively to enforce `PRIMARY KEY` and `UNIQUE` constraints. These system-generated structures guarantee data integrity but incur storage and write-amplification overhead, meaning they should never be intentionally created or relied upon for query acceleration.

Analytical performance instead depends on DuckDB's columnar storage architecture and automatic optimization mechanics. The engine utilizes zone maps to automatically track the minimum and maximum values of column blocks, allowing queries to skip irrelevant data entirely without index maintenance. This block-skipping efficiency is directly maximized by physical data sorting, which groups similar values together and tightens the zone map boundaries. Furthermore, projection pushdown ensures that the engine isolates specific fields and reads only the explicitly required columns, completely preventing uncalled column files from loading into memory.

---

## Further Resources

For more detailed guides and community resources on working with DuckDB, explore these links:

* **[Official DuckDB Documentation](https://duckdb.org/docs/)**: The definitive starting point for installation, core concepts, and comprehensive language APIs (Python, R, Java, Node.js, etc.).
* **[DuckDB Official Guides](https://duckdb.org/docs/guides/)**: Practical recipes for loading data, querying flat files (CSV, Parquet, JSON), and connecting to cloud object stores.
* **[Awesome DuckDB](https://github.com/duckdb/awesome-duckdb)**: A community-curated collection of tools, tutorials, extensions, and articles.
