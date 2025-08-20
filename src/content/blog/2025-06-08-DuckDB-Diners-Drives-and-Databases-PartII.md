---
title: DuckDB - Diners, Drives, and Databases Part II
categories:
- Data Engineering
- Python
tags:
- DuckDB
- Pandas
- data analysis
- SQL
- Python
- testing
pubDate: 2025-06-08
description: A post about DuckDB - Diners, Drives, and Databases Part II.
---


<img src="/img/duckdbgf2.png" alt="All paws on Deck" width="400px" height="auto">

<p style="font-size:0.9em; margin-top:0.5em; color:#555;"><em>Hoping for an A.</em></p>



 In [Part I]({% post_url 2025-06-06-DuckDB-Diners-Drives-and-Databases %}) , we got our feet wet by performing initial data explorations on the NYC restaurant inspection dataset directly from a CSV file. We saw how DuckDB allows for quick insights without full data loading into memory.

I felt like I didn't get to cover everything I wanted to touch in the last post so here I will focus on some of the other capabilities namely as a lightweight, in-process ETL (Extract, Transform, Load) tool.

We'll cover:

- Performing CSV-to-CSV transformations purely with SQL, without ever needing to manually inspect the file.
- Converting your transformed data into space-efficient formats like compressed CSV (GZIP) and Parquet, and quantifying the storage savings.
- Inspecting the data types within DuckDB and confirming their compatibility before a potential load into a production database like PostgreSQL.

Let's pick up where we left off, assuming you have your DOHMH.csv file ready and your DuckDB environment set up.

## 1. The "Blind" CSV-to-CSV Transformation

Imagine you've received a large CSV file, and you know it needs some basic cleaning or column selection before you can use it. Just to save a subset. DuckDB is perfect for this "blind" transformation.

We'll take our DOHMH.csv and perform a few common transformations:

- Select a subset of relevant columns.
- Rename a column (`DBA` to `Restaurant_Name` for clarity).
- Filter out any records where the `BORO` is `'0'` (an anomalous entry we noticed in Part I).
- Write the transformed data to a new CSV file.

```python
import duckdb
import os
import pandas as pd  # For displaying schemas later

# Define the path to your original CSV file
csv_file_path = 'DOHMH.csv'
# Define the path for the new, transformed CSV
transformed_csv_path = 'DOHMH_transformed.csv'

# Establish a connection to an in-memory DuckDB database
con = duckdb.connect()

print(f"--- Performing CSV-to-CSV Transformation ---")
print(f"Reading '{csv_file_path}' and writing to '{transformed_csv_path}'...")

try:
    # Use DuckDB's COPY statement with a subquery to transform data
    # The subquery selects, renames, and filters data without loading the whole file
    transform_query = f'''
    COPY (
        SELECT
            "CAMIS",
            "DBA" AS "Restaurant_Name", -- Renaming DBA column
            "BORO",
            "BUILDING",
            "STREET",
            "ZIPCODE",
            "CUISINE DESCRIPTION",
            "INSPECTION DATE",
            "ACTION",
            "VIOLATION CODE",
            "VIOLATION DESCRIPTION",
            "CRITICAL FLAG",
            "SCORE",
            "GRADE"
        FROM
            '{csv_file_path}'
        WHERE
            "BORO" != '0' -- Filter out anomalous '0' borough
            AND "CAMIS" IS NOT NULL -- Ensure unique identifier is present
    ) TO '{transformed_csv_path}' (HEADER, DELIMITER ',');
    '''
    con.execute(transform_query)
    print(f"Transformation complete. Transformed data saved to: {transformed_csv_path}")

except Exception as e:
    print(f"Error during transformation: {e}")

finally:
    con.close()
```
## 2. Space-Saving Formats: Compressed CSV & Parquet
Once your data is transformed, you often want to store it efficiently. DuckDB makes it trivial to convert your data into compressed formats, which can significantly reduce storage space and often improve read performance for subsequent analytical queries. We'll compare:

The original DOHMH.csv.
Our new DOHMH_transformed.csv.
A GZIP-compressed version of the transformed CSV.
A Parquet version of the transformed data.

```python

import duckdb
import os

# Paths from previous step
original_csv_path = 'DOHMH.csv'
transformed_csv_path = 'DOHMH_transformed.csv'
compressed_csv_path = 'DOHMH_transformed_compressed.csv.gz' # .gz suffix is common for GZIP
parquet_path = 'DOHMH_transformed.parquet'

# Ensure the transformed_csv_path exists from the previous step, or run the transformation again
# Re-establishing connection for this snippet
con = duckdb.connect()

print(f"\n--- Comparing File Sizes ---")

try:
    # Get original CSV size
    original_size_bytes = os.path.getsize(original_csv_path)
    print(f"Original CSV Size: {original_size_bytes / (1024 * 1024):.2f} MB")

    # Get transformed CSV size
    transformed_size_bytes = os.path.getsize(transformed_csv_path)
    print(f"Transformed CSV Size: {transformed_size_bytes / (1024 * 1024):.2f} MB")
    print(f"  Savings from Transformation (selected columns, filtered rows): "
          f"{((original_size_bytes - transformed_size_bytes) / original_size_bytes) * 100:.2f}%")

    # Write to GZIP compressed CSV
    print(f"Writing transformed data to GZIP compressed CSV: {compressed_csv_path}")
    copy_to_compressed_csv_query = f"""
    COPY (SELECT * FROM '{transformed_csv_path}') TO '{compressed_csv_path}' (HEADER, DELIMITER ',', COMPRESSION GZIP);
    """
    con.execute(copy_to_compressed_csv_query)
    compressed_size_bytes = os.path.getsize(compressed_csv_path)
    print(f"Compressed CSV (GZIP) Size: {compressed_size_bytes / (1024 * 1024):.2f} MB")
    print(f"  Savings vs. Transformed CSV: "
          f"{((transformed_size_bytes - compressed_size_bytes) / transformed_size_bytes) * 100:.2f}%")


    # Write to Parquet
    print(f"Writing transformed data to Parquet: {parquet_path}")
    copy_to_parquet_query = f"""
    COPY (SELECT * FROM '{transformed_csv_path}') TO '{parquet_path}' (FORMAT PARQUET);
    """
    con.execute(copy_to_parquet_query)
    parquet_size_bytes = os.path.getsize(parquet_path)
    print(f"Parquet Size: {parquet_size_bytes / (1024 * 1024):.2f} MB")
    print(f"  Savings vs. Transformed CSV: "
          f"{((transformed_size_bytes - parquet_size_bytes) / transformed_size_bytes) * 100:.2f}%")


    print(f"\nTotal savings from original CSV to Parquet: "
          f"{((original_size_bytes - parquet_size_bytes) / original_size_bytes) * 100:.2f}%")

except FileNotFoundError as e:
    print(f"Error: A required file was not found. Please ensure '{original_csv_path}' and '{transformed_csv_path}' exist. {e}")
except Exception as e:
    print(f"Error during file compression/conversion: {e}")

finally:
    con.close()
```
You should see some pretty amazing space savings.  Here are my results more than a 30% savings from the original CSV to the transformed CSV, and then over 90% savings when compressing to GZIP and converting to Parquet. More than 15X reduction, saving in the right format means you can keep a year worth of data in the space you would have used for a single month in the original CSV format.

```
--- Comparing File Sizes ---
Original CSV Size: 124.82 MB
Transformed CSV Size: 85.26 MB
  Savings from Transformation (selected columns, filtered rows): 31.69%
Writing transformed data to GZIP compressed CSV: DOHMH_transformed_compressed.csv.gz
Compressed CSV (GZIP) Size: 7.56 MB
  Savings vs. Transformed CSV: 91.13%
Writing transformed data to Parquet: DOHMH_transformed.parquet
Parquet Size: 7.41 MB
  Savings vs. Transformed CSV: 91.31%

Total savings from original CSV to Parquet: 94.07%
```
## 3. Data Typing & PostgreSQL Compatibility

Before loading data into a production database like PostgreSQL, it's crucial to confirm that your data types are correct and compatible. DuckDB does a great job of inferring types, but explicit confirmation and potential casting are good practice to avoid surprises during loading.



```python
import duckdb
import pandas as pd # For displaying schema as a DataFrame

# Path to our transformed Parquet file (or CSV, it doesn't matter for schema inspection)
transformed_data_path = 'DOHMH_transformed.parquet'

# Re-establishing connection
con = duckdb.connect()

print(f"\n--- Inspecting Schema for PostgreSQL Compatibility ---")

try:
    # Use PRAGMA table_info to get the schema of data from a file
    # We implicitly create a temporary table/view from the file for inspection
    schema_query = f"""
    PRAGMA table_info('{transformed_data_path}');
    """
    schema_df = con.sql(schema_query).df()

    print("DuckDB Inferred Schema (from transformed data):")
    print(schema_df.to_string(index=False))

    print("\n--- PostgreSQL Type Considerations ---")
    print("Here's a general mapping and considerations for PostgreSQL:")

    pg_type_map = {
        'BIGINT': 'BIGINT',
        'INTEGER': 'INTEGER',
        'DOUBLE': 'DOUBLE PRECISION', # or REAL for float4
        'VARCHAR': 'VARCHAR(N)',       # N needs to be determined based on max length
        'BOOLEAN': 'BOOLEAN',
        'DATE': 'DATE',
        'TIMESTAMP': 'TIMESTAMP',
        'BLOB': 'BYTEA',
        'DECIMAL': 'NUMERIC(P, S)'     # P=precision, S=scale needs to be determined
    }

    for index, row in schema_df.iterrows():
        column_name = row['name']
        duckdb_type = row['type']
        nullable = "NULL" if row['null'] == 1 else "NOT NULL"

        pg_equivalent = pg_type_map.get(duckdb_type.upper(), f"UNKNOWN_TYPE ({duckdb_type})")

        # Special handling for VARCHAR to suggest length
        if duckdb_type.upper() == 'VARCHAR':
            # To get actual max length, you'd need to query the data:
            # max_len_query = f"SELECT MAX(LENGTH(\"{column_name}\")) FROM '{transformed_data_path}';"
            # max_len = con.sql(max_len_query).fetchone()[0]
            # pg_equivalent = f"VARCHAR({max_len or 255})" # Use a default if max_len is 0 or None
            pg_equivalent = "VARCHAR(255)" # Common default for text, adjust as needed or calculate max_len

        print(f"- Column: '{column_name}'")
        print(f"  DuckDB Type: {duckdb_type}")
        print(f"  PostgreSQL Equivalent: {pg_equivalent}")
        print(f"  Nullable: {nullable}")
        print(f"  Considerations: {'Check string max length' if duckdb_type.upper() == 'VARCHAR' else 'Confirm precision/scale' if duckdb_type.upper() == 'DECIMAL' else 'Standard mapping'}")
        print("-" * 30)

    print("\nTo load into PostgreSQL, you would typically use a PostgreSQL client library (like Psycopg2 in Python) or a tool like `pg_loader` after connecting to your PostgreSQL database. DuckDB acts as an intermediary here, handling the transformation and type validation.")

except FileNotFoundError:
    print(f"Error: Transformed data file '{transformed_data_path}' not found. Please ensure the previous steps ran successfully.")
except Exception as e:
    print(f"Error inspecting schema: {e}")

finally:
    con.close()

```
## Explanation of Schema Inspection:

Let's break down what's happening in the schema inspection step:

- **`PRAGMA table_info('file_path')`:**  
    This handy DuckDB command lets you peek at the schema DuckDB infers from your file—no need to create a table first. It shows you each column's name, data type, whether it allows NULLs, and more.

- **Mapping to PostgreSQL:**  
    We walk through a general mapping of DuckDB types to PostgreSQL equivalents. Here are a few things to keep in mind:
    - **VARCHAR length:** DuckDB's `VARCHAR` is flexible, but PostgreSQL usually wants a specific length (like `VARCHAR(255)`). To pick the right number, you can run a quick `SELECT MAX(LENGTH(column_name))` on your data.
    - **DECIMAL / NUMERIC:** If you have columns with decimal numbers (like scores), you'll want to decide on the total number of digits (`PRECISION`) and how many come after the decimal point (`SCALE`).
    - **Date/Time types:** DuckDB is pretty good at figuring out dates and timestamps, but double-check if you need a plain `DATE` or a full `TIMESTAMP` (and whether you need time zones) for PostgreSQL.

---

### Wrapping Up Part II

In this post, we've seen how DuckDB can help you:

- Transform data directly from CSVs with SQL, no manual file wrangling required.
- Store your results in space-saving formats like compressed CSV and Parquet.
- Inspect and prepare your data's schema for a smooth handoff to databases like PostgreSQL.

I hope this gives you some good ideas for how t use DuckDB as an ETL tool in your data workflows.  I realize this I went in a few different directions here, I like the idea of exploring what is possible and then refining my approach for my use case.  If you have something you are using DuckDB for that I didn't cover please share it.  I love to hearing what is working for others.






