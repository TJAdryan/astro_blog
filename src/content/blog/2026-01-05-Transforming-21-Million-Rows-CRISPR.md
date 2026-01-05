---
title: "Transforming 21 Million Rows of CRISPR Data for PostgreSQL"
description: "How I used DuckDB and Podman to unpivot a massive 17,000-column CSV into a usable PostgreSQL database."
pubDate: "Jan 05 2026"
heroImage: "/crispr_architecture_simple.png"
---

I have been working with publicly available data on **depmap.org**. The first challenge with any endeavor like this is getting the data into a format that works for you.

The **CRISPR dependency dataset** is a raw matrix CSV containing over **21 million rows**. I want to put the cleaned data into Postgres for future jobs, but the current format is unwieldy for me. Getting Python to make that transformation is possible, but probably not the best use of our time.

Instead, I opted for a stack involving **Fedora 43**, **Podman**, and **DuckDB** to build a more efficient pipeline.

## The Problem: The "Wide" Matrix

The raw `CRISPRGeneEffect.csv` is a matrix with over **17,000 columns** (one for each gene). Relational databases like PostgreSQL struggle with that many columns, and querying specific genes across cell lines becomes a nightmare.

To make this usable, I needed to "unpivot" the data into a **"Long" format**:
*   One column for the cell line ID
*   One for the gene symbol
*   One for the score

## A Technical Snag: Running a Folder

While setting up the toolchain, I hit a classic Linux hurdle. After downloading the DuckDB binary, I ran a `mv` command to put it in my system path. However, I accidentally created a **directory** named `duckdb` instead of moving the file itself.

When I tried to check the version, the terminal threw a "command not found" error. It was a moment that required a bit of troubleshooting—using `ls -F` showed that `/usr/local/bin/duckdb` ended in a `/`, meaning I was trying to execute a folder.

I had to purge the directory and re-map the binary correctly. It was a reminder that even simple file operations require attention to detail in a Linux environment.

## The Solution: DuckDB + Podman

Once the tools were in place, the transformation became a single efficient stream. I used a **Podman Quadlet** to manage the PostgreSQL instance, ensuring the database stays "always-on" as a systemd service.

### 1. The Quadlet Configuration

Located at `~/.config/containers/systemd/postgres.container`, this ensures the DB persists and restarts automatically:

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

Using DuckDB’s Postgres scanner, I was able to unpivot the 17,000 columns and stream them into the container in about **4 minutes**:

```bash
duckdb -c "
INSTALL postgres;
LOAD postgres;
ATTACH 'host=localhost user=postgres password=self_assured_complexity dbname=crispr_db' AS pg (TYPE POSTGRES);

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

## Result and Optimization

The final table contains **21,093,758 rows**. To make this actually useful for research, I added a B-tree index on the gene symbols.

```sql
CREATE INDEX idx_gene_symbol ON gene_effects(gene_symbol);
```

By moving the data out of a flat CSV and into an indexed database, I can now query any of the 17,000+ genes and get the dependency distribution across 1,000+ cell lines in milliseconds. It’s a much more sustainable foundation for the analysis scripts to follow.
