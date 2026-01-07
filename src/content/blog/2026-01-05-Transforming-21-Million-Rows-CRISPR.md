---
title: "Transforming 21 Million Rows of CRISPR Data for PostgreSQL"
description: "How I used DuckDB and Podman to unpivot a massive 17,000-column CSV into a usable PostgreSQL database."
pubDate: "Jan 05 2026"

---

![CRISPR Data Pipeline Architecture](/crispr_architecture_simple.png)

Recently, I started working on creating some pipelines using the publicly available CRISPR data from **depmap.org**. The goal is to get the data into **PostgreSQL** so it can be efficiently called as needed. Since this was probably going to involve more than one transformation, building out some basic infrastructure seemed the most sensible way to start.

I have a Fedora workstation running on an old Mac Mini, so that comes with **Podman** installed. That saves me from having to install Postgres. **DuckDB** should be able to do the transforms better than Python or Postgres natively. That isn't too hard to install. Python I already have installed and with `uv` I can create a venv painlessly.

The **CRISPR dependency dataset** is a raw CSV matrix containing over **21 million rows**. My goal was to load this into PostgreSQL for future analysis. However, the raw format is unwieldy, and writing a custom Python script to transform it felt inefficient. I needed a faster, robust pipeline.

### The Problem: A “Wide” Matrix

The raw `CRISPRGeneEffect.csv` file has over **17,000 columns**—one for every gene. Relational databases like PostgreSQL struggle with tables this wide. Querying specific genes across thousands of cell lines becomes a performance nightmare.

To fix this, I needed to “unpivot” the data into a **“Long” format**:
*   **Model ID** (Cell Line)
*   **Gene Symbol**
*   **Dependency Score**

<br/>

### A Technical Snag: The “Folder” Mistake

While setting up my toolchain, I hit a classic Linux hurdle. After downloading the DuckDB binary, I ran a `mv` command to place it in my system path. In a rush, I accidentally created a **directory** named `duckdb` instead of moving the file itself.

When I tried to run it, the terminal threw a confusing error: `command not found`. 

A quick check with `ls -F` revealed the issue: `/usr/local/bin/duckdb/`. That trailing slash meant I was trying to execute a folder! A quick purge and re-map fixed it.

There is a specific kind of irony in spending an hour fixing a mistake that took exactly one millisecond to make. A humbling reminder of why typing fast is not always faster.



### The Solution: DuckDB + Podman

With the tools ready, the transformation became a single, efficient stream. I used a **Podman Quadlet** to manage PostgreSQL, ensuring the database runs as an “always-on” systemd service.

### 1. The Quadlet Configuration

Located at `~/.config/containers/systemd/postgres.container`, this configuration makes the DB persistent and auto-restarting:

```ini
[Container]
Image=docker.io/library/postgres:16
Environment=POSTGRES_PASSWORD=self_assured_complexity
Volume=/home/dominickryan/crispr_db_data:/var/lib/postgresql/data:Z
PublishPort=5432:5432

[Service]
Restart=always

[Install]
WantedBy=default.target
```

### 2. The Unpivot and Load

Using **DuckDB’s Postgres scanner**, I unpivoted all 17,000 columns and streamed them directly into the database in about **4 minutes**:

```bash
duckdb -c "
INSTALL postgres;
LOAD postgres;

-- Connect to the Podman container
ATTACH 'host=localhost user=postgres password=self_assured_complexity dbname=crispr_db' AS pg (TYPE POSTGRES);

-- Unpivot and Load in one pass
CREATE TABLE pg.gene_effects AS 
SELECT 
    \"column00000\" AS model_id, 
    gene_symbol, 
    dependency_score
FROM (
    UNPIVOT (SELECT * FROM read_csv_auto('CRISPRGeneEffect.csv'))
    ON COLUMNS(* EXCLUDE \"column00000\")
    INTO NAME gene_symbol VALUE dependency_score
);"
```

### The Result

The final table contains **21,093,758 rows**. To optimize for research, I added a B-tree index on the gene symbols:

```sql
CREATE INDEX idx_gene_symbol ON gene_effects(gene_symbol);
```

By moving from a flat, wide CSV to an indexed SQL database, I can now query any of the 17,000+ genes across 1,000+ cell lines in **milliseconds**. This provides a sustainable, high-performance foundation for all future analysis.

### Reflections: The Work Behind the Work

Data engineering is rarely just about moving data; it is the culmination of several foundational, seemingly unrelated layers of systems architecture. Before a single row of this 21-million-point dataset could be processed, it was necessary to align the underlying infrastructure—from configuring `systemd` for persistence and Podman for container security to troubleshooting OS-level path errors and environment tooling. This project highlights that a functional pipeline is effectively the final “handshake” between stable systems administration and intentional data modeling. 
