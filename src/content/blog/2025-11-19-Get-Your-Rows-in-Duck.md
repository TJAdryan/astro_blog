---
title: "A Pragmatic Look at pg_duckdb 1.0"
description: "Exploring the features and benefits of the pg_duckdb 1.0 extension for PostgreSQL."
pubDate: "2025-11-19T00:00:00Z"
tags: ["pg_duckdb", "PostgreSQL", "analytics"]
categories: ["Data", "Tools"]
draft: false
---

In September, the pg_duckdb extension reached version 1.0. For teams heavily invested in the PostgreSQL ecosystem, this release offers a specific, practical utility: it allows the DuckDB engine to run within the Postgres process.

At first I didn't know what to make of it not just the release the whole project.  DuckDB and Postgres already can interoperate via FDW and other methods, so what does embedding DuckDB inside Postgres really gain you?  Well I was able to identify a couple, so there are probably more.


Here is an assessment of why it is useful and how to implement it.

If you feel I fall short or want to learn more you can access the release notes here: [pg_duckdb release notes](https://motherduck.com/blog/pg-duckdb-release/).
### The Core Value: Vectorized Execution in Postgres

PostgreSQL is designed for row-based processing. It is excellent at retrieving single records but inefficient at aggregating millions of rows (e.g., calculating average revenue per user over five years).

pg_duckdb addresses this by embedding DuckDB’s vectorized execution engine. When you execute an analytical query, the extension intercepts it and processes the data in batches (vectors) rather than row-by-row.

**The Benefit:** You can run heavy analytical queries on your existing Postgres tables without the performance penalty typically associated with such operations.

**The Constraint:** This shares resources (CPU/RAM) with your operational database. It is best suited for read replicas or non-critical instances, rather than your primary transactional node.

### The Primary Use Case: The "Zero-ETL" Join

The most compelling feature of version 1.0 is the ability to query external object storage (S3, GCS) directly from Postgres and join it with local tables.

In a traditional stack, if you wanted to join "current users" (Postgres) with "historical logs" (S3 Parquet), you would need to ETL the user data into a data warehouse. With pg_duckdb, you can treat the S3 bucket as a foreign table. So yay to that.

#### Implementation Example

You can query a remote Parquet file and join it to a local Postgres table in a single SQL statement.

```sql
-- Force execution to use the DuckDB engine for performance
SET duckdb.force_execution = true;

SELECT 
    u.customer_id,
    u.signup_date,
    count(h.event_id) as total_historical_events
FROM postgres_users u
JOIN read_parquet('s3://archive-bucket/logs/2024/*.parquet') h
    ON u.customer_id = h.user_id
WHERE u.status = 'active'
GROUP BY u.customer_id, u.signup_date;

``` 


#### When to Use It

This architecture is effective for specific scenarios:

- **Mid-Sized Analytics:** You have data that is too large for a standard SELECT but not large enough to justify the cost and maintenance of Snowflake or Databricks.
- **Data Lake Access:** You need to access archived data in S3 occasionally and do not want to maintain a permanent pipeline for it.
- **Simplification:** You want to reduce the number of tools in your stack.

If your team is already comfortable managing PostgreSQL, pg_duckdb 1.0 provides a method to extend that infrastructure into the analytical domain with minimal overhead.
