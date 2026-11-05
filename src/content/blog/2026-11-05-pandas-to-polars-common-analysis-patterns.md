---
title: "Pandas to Polars: Why Speed Matters for Finding the Truth"
description: "You can't ignore the performance advantage of Polars anymore. Moving from Pandas' in-place mutations to Polars' declarative expressions lets you verify truth across much larger datasets."
pubDate: 2026-11-05
tags: ["Python", "Polars", "Pandas", "Data Engineering"]
category: "Data Engineering"
---
Pandas to Polars: Why Speed Matters for Finding the Truth

I stuck with Pandas for a long time because the muscle memory was there. Even when scripts dragged or memory spiked, it felt easier to wait on a slow run, or work from a smaller sample, than to rethink how I write dataframe code.

Polars has changed that for me. Speed changes how you investigate data. When queries run across all your CPU cores in milliseconds instead of minutes, you don't have to check a sample of 10,000 rows and hope it represents the rest of the table. You can run your checks against the entire dataset and confirm what is actually in it. The feedback loop is short enough that you ask more questions, catch edge cases earlier, and trust your numbers more.

The main mental shift is moving away from changing a dataframe one step at a time and juggling the index. Polars uses declarative expressions instead. You describe the result you want and let the engine optimize and parallelize the work.

Below are two common analysis patterns side by side: filtering with derived columns, and group aggregations with window calculations.

Filtering and Derived Columns

A typical first pass on raw data means filtering out rows you don't want, calculating a few new columns, and tagging rows based on a threshold.

Pandas

You filter first, adding .copy() to avoid SettingWithCopyWarning, then add new columns one line at a time:

python
import numpy as np
import pandas as pd

df = pd.read_csv("orders.csv")

# Filter and avoid view warnings
active = df[df["status"] != "cancelled"].copy()

# Add derived columns sequentially
active["tax"] = active["subtotal"] * 0.08
active["total"] = active["subtotal"] + active["tax"]
active["priority"] = np.where(active["total"] >= 500, "high", "standard")
Polars

You chain .filter() into .with_columns() and define all the new fields in one block:

python
import polars as pl

df = pl.read_csv("orders.csv")

clean = df.filter(pl.col("status") != "cancelled").with_columns(
    tax=pl.col("subtotal") * 0.08,
    total=pl.col("subtotal") * 1.08,
    priority=pl.when(pl.col("subtotal") * 1.08 >= 500)
    .then(pl.lit("high"))
    .otherwise(pl.lit("standard")),
)

Every expression inside with_columns is independent, so Polars evaluates them concurrently instead of one series at a time. That independence is also why total uses subtotal * 1.08 rather than subtotal + tax. Expressions in the same block can't see each other's results. If you would rather reference tax, chain a second .with_columns() after the first.

Group Aggregations and Window Calculations

Once the data is clean, the next step is usually rolling up summary numbers by group, or ranking rows within a group without collapsing the original table.

Pandas

Grouping pushes your keys into the index, so you almost always call .reset_index() right after to get a flat table back:

python
# Group summary
summary = (
    active.groupby("region")
    .agg(
        total_revenue=("total", "sum"),
        unique_buyers=("customer_id", "nunique"),
        median_order=("total", "median"),
    )
    .reset_index()
    .sort_values(by="total_revenue", ascending=False)
)

# Window rank per group back on the original DataFrame
active["regional_rank"] = active.groupby("region")["total"].rank(
    method="dense", ascending=False
)
Polars

There is no index to reset or align. Aggregations return a normal table, and window functions run inline with .over(), much like OVER (PARTITION BY ...) in SQL:

python
# Group summary
summary = (
    clean.group_by("region")
    .agg(
        pl.col("total").sum().alias("total_revenue"),
        pl.col("customer_id").n_unique().alias("unique_buyers"),
        pl.col("total").median().alias("median_order"),
    )
    .sort("total_revenue", descending=True)
)

# Window rank per group
ranked = clean.with_columns(
    regional_rank=pl.col("total").rank(method="dense", descending=True).over("region")
)

Once .with_columns() and .over() click, the code reads from top to bottom. When you point it at millions of rows to test a hypothesis, the answer comes back almost immediately.
