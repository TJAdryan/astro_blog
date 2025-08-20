---
title: Bring me the Data
categories:
- Data Engineering
- Python
- API
tags:
- API
- Pandas
- data analysis
- Python
- testing
pubDate: 2025-06-14 12:00:00 -0400
description: A post about Bring me the Data.
---


<img src="/img/rest_rate2.png" alt="We're toast!" width="400px" height="auto">

<p style="font-size:0.9em; margin-top:0.5em; color:#555;"><em>taking it personally.</em></p>

## NYC Restaurant Inspections Data Pull

When I was making the [DuckDB posts]({% post_url 2025-06-08-DuckDB-Diners-Drives-and-Databases-PartII %}), I wanted to include some code to show how to pull the data from the NYC Open Data portal. In the interest of keeping it simple, I just showed how to download the data.  Here's a separate post that provides a simple way to pull the data programmatically, if you haven't accessed the NYC Open Data portal before, this is a great way to get started and can easily be adpated to the many other datasets available there.

It is great for practice and to help develop your skills to automate a small call everyday.  To further challenge yourself, you can see how try to see how many days in a row you can pull the data, or to script out jobs to find if there are missing days in your code.  I would say if you come accross an issue and you are not sure what to do, it is probably an issue people who work in data engineering face too.  There is a lot of help out and reccomendations of best policy, but no one has all the answers.  So be humble, but by no means be humbled. 


This post is available as code on [GitHub](https://github.com/TJAdryan/nyc-restaurant-inspections) and is adapted from the readme.

## Getting Started

Follow these steps to set up and run the data pull script.

### Prerequisites

Before you begin, ensure you have the following installed:

*   Python 3.x
*   pip (Python package installer)

### Installation

Clone the repository (or download the files directly):

````bash
git clone https://github.com/TJAdryan/nyc-restaurant-inspections.git
cd nyc-restaurant-inspections
````

Install the required Python libraries:

````bash
pip install -r requirements.txt
````

### Setting up Your Environment (and Securing Your Token!)

It's good practice to keep your API tokens out of your main code files and never commit them to version control. This project uses environment variables for secure token management.

#### Get an NYC Open Data App Token:

While many NYC Open Data endpoints can be accessed without a token for basic queries, having one provides higher rate limits and ensures consistent access. You can get one for free by signing up on the NYC Open Data portal.

#### Create a .env file:

In the root directory of your cloned repository, create a file named .env. This file will store your API token. You can use the provided .env.example as a template.

#### Add your app token to .env:

Open the .env file and add your token like so:

````dotenv
MY_APP_SEC="YOUR_APP_TOKEN_GOES_HERE"
````

Replace "YOUR_APP_SEC_GOES_HERE" with the actual token you obtained.

### Running the Script

Once you have installed the dependencies and set up your .env file, you can run the data pull script:

````bash
python pull_data.py
````

The script will print progress messages to your console, and once complete, it will save the retrieved restaurant inspection data as CSV and Parquet files in the same directory.  

## Code Overview

The pull_data.py script performs the following key actions:

*   **Configuration**: Sets up the NYC Open Data endpoint for restaurant inspections and defines the date range.
*   **Date Range Calculation**: Dynamically calculates a date range that ends exactly 30 days before the current date and extends 90 days prior to that.
*   **API Interaction**: Makes HTTP requests to the Socrata API, including proper headers for your app token and $where clauses for date filtering.
*   **Pagination**: Handles retrieving large datasets by iterating through results using $offset parameters until all available data within the specified date range is fetched.
*   **Data Processing**: Converts the JSON response into a pandas DataFrame and formats the inspection_date column.
*   **Saving Data**: Exports the cleaned data to CSV and Parquet formats for easy analysis.

## Exploring the Data

Once you have the data in a pandas DataFrame (and saved to CSV/Parquet), you can explore it using various tools. You might:

*   Filter by grade: Find restaurants with A, B, or C grades.
*   Analyze violation_description: See the most common violations.
*   Group by cuisine_description: Compare inspection scores across different cuisines.
*   Map locations: Use the building, street,zipcode, and boro information to visualize restaurant locations and their inspection outcomes.

