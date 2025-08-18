---
title: DuckDB - Diners, Drives, and Databases Part I
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
pubDate: 2025-06-06
description: A post about DuckDB - Diners, Drives, and Databases Part I.
---

<img src="//img/duckdbgf2.png" alt="All paws on Deck" width="400px" height="auto">

<p style="font-size:0.9em; margin-top:0.5em; color:#555;"><em>Hoping for an A.</em></p>

Pandas has been my go-to tool for data manipulation in Python for years. So great for me, right?  End of blog post.  Except... 
“If the only tool you have is a hammer, you will see every problem as a nail.” This dollop of wisdom, often attributed to Maslow, reminds us that the solutions we find are often shaped by the tools we have available. I’m not calling Pandas a hammer; it’s an incredible combination of tools that has truly changed how millions of people, myself included, get work done. My point is simply this: opening yourself up to different solutions can lead you to achieve different—and hopefully better—results.

That’s precisely where DuckDB shines. I’ve been using it in my own data pipelines to speed up transformations and prep reports for joining with other databases. And honestly? I know I’m only scratching the surface of its possibilities. So I thought I would try a few simple jobs with DuckDB, and maybe this exploration will prove useful to others too.

If you’ve been coding in Python for a while, you’re likely familiar with traditional database solutions like PostgreSQL or SQLite. DuckDB stands out from the crowd because it offers **virtually no setup**, delivers **blazing-fast performance**, and can directly pull entire datasets from a **multitude of formats**.

Let’s put it to the test with some real-world data anyone can access. We’ll be using the NYC Department of Health’s restaurant inspection results:

[https://data.cityofofnewyork.us/Health/DOHMH-New-York-City-Restaurant-Inspection-Results/43nn-pn8j/about_data](https://data.cityofofnewyork.us/Health/DOHMH-New-York-City-Restaurant-Inspection-Results/43nn-pn8j/about_data)

To get the data, just click the ‘Actions’ button in the top right corner on that page, select ‘Query Data’, and then hit ‘Export’ to download the CSV file. It should appear in your downloads folder in less than a minute.

---

**!!Warning!!** If you have a favorite restaurant, you might actually not want to look it up in this dataset. Ignorance, bliss… **!!Warning!!**

---


### Optional but Recommended: Simplify Your File Path

If you’re already comfortable navigating file paths and extensions, feel free to skip this step. Otherwise, for easier referencing in our code, I recommend renaming the downloaded file. It will likely have a long name like `DOHMH_New_York_City_Restaurant_Inspection_Results_202506XX.csv`. Let’s simplify it to just `DOHMH.csv`.

---

## Getting Your Environment Set Up:

First, install the necessary libraries using `uv` (if you have it) or `pip`.

````bash
uv pip install duckdb pandas
# If you don't have uv, just use:
pip install duckdb pandas
````


## Initial Data Exploration: First Counts
Now that we have our data and tools ready, let’s dive into some basic, yet incredibly insightful, questions about our NYC restaurant inspection dataset. Instead of loading the entire massive file into memory with pandas (which can be slow for very large datasets and consume a lot of RAM), we’ll leverage DuckDB’s ability to directly query the CSV file. This keeps our memory footprint low and our queries fast.

Let’s start by getting a quick idea of our dataset size:

```python
import duckdb
import os

# Define the path to your CSV file.
# Make sure 'DOHMH.csv' is in the same directory as your Python script,
# or provide the full absolute path.
csv_file_path = 'DOHMH.csv' 

# Establish a connection to an in-memory DuckDB database.
# Close it after use in this block.
con = duckdb.connect()

# Total Number of Inspections using DuckDB
print("--- Dataset Overview ---")
total_inspections_query = f"""
SELECT COUNT(*) AS total_inspections
FROM '{csv_file_path}';
"""
total_inspections = con.sql(total_inspections_query).fetchall()[0][0]
print(f"Total number of inspection records (DuckDB): {total_inspections:,}")

con.close() # Close the DuckDB connection for this snippet
```

We can use Pandas to confirm our results for the total rows:

```python
import pandas as pd
import os

# Make sure this matches your file path
csv_file_path = 'DOHMH.csv'

df = pd.read_csv(csv_file_path)
print(df.shape)
```

Your total rows should match the total from DuckDB. In my case it was 285,210, but the actual number may depend on when you downloaded the file. Let’s put this in perspective: you would have to inspect a restaurant every 1.5 minutes, 24/7, for an entire year to reach that number of inspections!

## TLDR: What Makes this Special?
I want to point out something important about how DuckDB works here: it allows you to run SQL queries directly on CSV files without needing to load the entire dataset into memory. This offers a significant, often ephemeral, performance and memory advantage. In other words, you get the benefit of lower memory use during the query. However, this power also comes with an important practice: remembering to close your connection to the database. 

In the examples above, we've diligently closed our connection using con.close() after running our queries. We'll strive to follow these best practices, but if a small mistake slips through and I leave a connection open, well, that's just too bad, isn't it? Fortunately (or perhaps unfortunately for accountability), there are no database inspectors handing out fines for that.  Anyway we lost that advantage when we checked the table size with Pandas.

Let’s review a few more basic queries.

## Restaurants by Borough
We can easily count the number of inspections by borough, but some places have been inspected on multiple occasions. Let’s compare total inspections by borough to total restaurants by borough using the unique CAMIS number to find how many restaurants in each borough have been inspected.
```python
import duckdb
import pandas as pd

# Define the path to your CSV file.
csv_file_path = 'DOHMH.csv'

# Connect to DuckDB (in-memory)
con = duckdb.connect()

# Inspections by Borough
borough_inspections = con.execute("""
  SELECT
    "BORO",
    COUNT(*) AS total_inspections_in_borough
  FROM read_csv_auto(?)
  GROUP BY "BORO"
  ORDER BY total_inspections_in_borough DESC
""", [csv_file_path]).df()
print(borough_inspections.to_markdown(index=False))

# Unique Restaurants by Borough (using CAMIS)
unique_restaurants = con.execute("""
  SELECT
    "BORO",
    COUNT(DISTINCT "CAMIS") AS unique_restaurants_count
  FROM read_csv_auto(?)
  GROUP BY "BORO"
  ORDER BY unique_restaurants_count DESC
""", [csv_file_path]).df()
print(unique_restaurants.to_markdown(index=False))

con.close()
```
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th>BORO</th>
      <th>total_inspections_in_borough</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Manhattan</td>
      <td>105410</td>
    </tr>
    <tr>
      <td>Brooklyn</td>
      <td>74822</td>
    </tr>
    <tr>
      <td>Queens</td>
      <td>68940</td>
    </tr>
    <tr>
      <td>Bronx</td>
      <td>26017</td>
    </tr>
    <tr>
      <td>Staten Island</td>
      <td>10006</td>
    </tr>
    <tr>
      <td>0</td>
      <td>15</td>
    </tr>
  </tbody>
</table>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th>BORO</th>
      <th>unique_restaurants_count</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Manhattan</td>
      <td>11980</td>
    </tr>
    <tr>
      <td>Brooklyn</td>
      <td>7828</td>
    </tr>
    <tr>
      <td>Queens</td>
      <td>6945</td>
    </tr>
    <tr>
      <td>Bronx</td>
      <td>2556</td>
    </tr>
    <tr>
      <td>Staten Island</td>
      <td>1126</td>
    </tr>
    <tr>
      <td>0</td>
      <td>15</td>
    </tr>
  </tbody>
</table>


## Well that is Unusual Isn't it?
What stands out for me here is all the boroughs appear to have about 10% as many unique restaurants as they do inspections, except the Bronx.  Let's review that.


```python
import duckdb
import pandas as pd

# Define the path to your CSV file.
csv_file_path = 'DOHMH.csv'

# Connect to DuckDB (in-memory)
con = duckdb.connect()

# Get total inspections by borough
borough_inspections = con.execute("""
  SELECT
    "BORO",
    COUNT(*) AS total_inspections_in_borough
  FROM read_csv_auto(?)
  GROUP BY "BORO"
  ORDER BY total_inspections_in_borough DESC
""", [csv_file_path]).df()

# Get unique restaurants by borough
unique_restaurants = con.execute("""
  SELECT
    "BORO",
    COUNT(DISTINCT "CAMIS") AS unique_restaurants_count
  FROM read_csv_auto(?)
  GROUP BY "BORO"
  ORDER BY unique_restaurants_count DESC
""", [csv_file_path]).df()

con.close()

# Merge and calculate percentage
merged = pd.merge(
    borough_inspections,
    unique_restaurants,
    on='BORO',
    how='outer'
).fillna(0)

merged['Percentage_Restaurants_per_Inspection'] = (
    merged['unique_restaurants_count'] / merged['total_inspections_in_borough'] * 100
).round(2)

# Format percentage as string with %
merged['Percentage_Restaurants_per_Inspection'] = merged['Percentage_Restaurants_per_Inspection'].map('{:.2f}%'.format)

print("Percentage of Unique Restaurants per Inspection by Borough")
print(merged[['BORO', 'total_inspections_in_borough', 'unique_restaurants_count', 'Percentage_Restaurants_per_Inspection']].to_markdown(index=False))
```


#### Percentage of Unique Restaurants per Inspection by Borough
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th>BORO</th>
      <th>total_inspections_in_borough</th>
      <th>unique_restaurants_count</th>
      <th>Percentage_Restaurants_per_Inspection</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>0</td>
      <td>15</td>
      <td>15</td>
      <td>100.00%</td>
    </tr>
    <tr>
      <td>Manhattan</td>
      <td>105410</td>
      <td>11980</td>
      <td>11.37%</td>
    </tr>
    <tr>
      <td>Staten Island</td>
      <td>10006</td>
      <td>1126</td>
      <td>11.25%</td>
    </tr>
    <tr>
      <td>Brooklyn</td>
      <td>74822</td>
      <td>7828</td>
      <td>10.46%</td>
    </tr>
    <tr>
      <td>Queens</td>
      <td>68940</td>
      <td>6945</td>
      <td>10.07%</td>
    </tr>
    <tr>
      <td>Bronx</td>
      <td>26017</td>
      <td>2556</td>
      <td>9.82%</td>
    </tr>
  </tbody>
</table>





**Insights:**

This table clearly quantifies the observation! Excluding the "0" borough (which shows a 100% ratio, likely indicating a data anomaly where unique restaurants equal inspection count), we can analyze the main boroughs:

* The percentages for Manhattan (11.37%), Staten Island (11.25%), Brooklyn (10.46%), and Queens (10.07%) are all quite close, generally hovering around 10-11% unique restaurants per total inspections.
* The Bronx, at **9.82%**, is indeed the lowest among the five main boroughs.
* This is the part of data analysis where I like to speculate wildly about why patterns like that emerge, but today I am going to show restraint.  

## Let's Talk Donuts

How many Donut Shops are in New York and how many of them are Dunkin?

```python
import duckdb
import pandas as pd

# Connect to DuckDB and set CSV file path
con = duckdb.connect()
csv_file_path = 'DOHMH.csv'
min_year = 2024

# Donut Shop Dominance: Dunkin' vs. Others (Since 2024)
donut_query = f"""
SELECT
  CASE
    WHEN "DBA" ILIKE '%DUNKIN%' THEN 'Dunkin'' (Locations)'
    ELSE 'Other Donut Shops (Locations)'
  END AS donut_category,
  COUNT(DISTINCT "CAMIS") AS unique_donut_shop_locations
FROM read_csv_auto('{csv_file_path}')
WHERE
  ("CUISINE DESCRIPTION" ILIKE '%DONUT%' OR "CUISINE DESCRIPTION" ILIKE '%DOUGHNUT%')
  AND CAST(strftime('%Y', "INSPECTION DATE") AS INTEGER) >= {min_year}
GROUP BY donut_category
ORDER BY unique_donut_shop_locations DESC;
"""
donut_df = con.execute(donut_query).df()
print(donut_df.to_markdown(index=False))

# Names of Other Donut Shops (Since 2024, Excluding Dunkin')
other_donut_shops_query = f"""
SELECT DISTINCT "DBA", "CAMIS"
FROM read_csv_auto('{csv_file_path}')
WHERE
  ("CUISINE DESCRIPTION" ILIKE '%DONUT%' OR "CUISINE DESCRIPTION" ILIKE '%DOUGHNUT%')
  AND "DBA" NOT ILIKE '%DUNKIN%'
  AND CAST(strftime('%Y', "INSPECTION DATE") AS INTEGER) >= {min_year}
LIMIT 20;
"""
other_donut_shops_df = con.execute(other_donut_shops_query).df()
print(other_donut_shops_df.to_markdown(index=False))

con.close()
```

#### Donut Shops (Since 2024): Dunkin' vs. Others in NYC
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th>donut_category</th>
      <th>unique_donut_shop_locations</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Dunkin' (Locations)</td>
      <td>500</td>
    </tr>
    <tr>
      <td>Other Donut Shops (Locations)</td>
      <td>33</td>
    </tr>
  </tbody>
</table>


## The 800 lb Jelly Donut in the Room

Out of 533 Donut Shops in the city more than 93% are Dunkin, and of those 33 non Dunkin shops 8 of them have the word "Krispy" in their name. 

Anyway if you made it this far, I hope this was a help to you. I would love to hear your thoughts about Duckdb or Donuts or anything else.
