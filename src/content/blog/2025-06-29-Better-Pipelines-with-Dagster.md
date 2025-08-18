---
title: 'Building Data Pipelines with Dagster: Practical'
categories:
- Data Engineering
- Python
- Orchestration
tags:
- Dagster
- data pipelines
- Python
- orchestration
- data engineering
pubDate: 2025-06-29
description: 'A post about Building Data Pipelines with Dagster: Practical.'
---


I am always looking for ways to improve my data pipelines, and Dagster has been really good to me so far.  I am definitely planning on diving further into it in the future but my initial experiences have been favorable.  Of course, I ran into a a few issues.  But mostly I was able to get things up and running, without too much trouble, and get value from using it right away.


I tried to keep it simple, flowing from the NYC Open Data API through various Dagster assets, eventually feeding into both static PNG charts and the dynamic Streamlit dashboard. 
Dagster updates the information and then it is displayed in the Streamlit app.  Here is an exmple of what the output looks like:

<img src="//img/streamdagster.png" alt="Dagster streamlit image" width="600px">

The output from Dagster is no slouch when it comes to visualizations either.  Being able to see the orchestration visually and being able to choose to run a single asset is great.

<img src="//img/full_pipeline.png" alt="Dagster streamlit image" width="600px">


Also the way Dagster displays the logs and allows you to trace back any issues is super helpful too.  Once you start a job you can move over to the runs tab, or you can follow the link that gets generated when you run a job.  
<img src="//img/Run_dagster.png" alt="Dagster streamlit image" width="600px">


If you are interested in getting some ideas for yourself you can follow the README which you to check out directly on the [GitHub repo](https://github.com/TJAdryan/dagster_starter) and walks through the process step by step. 

It was great to be able to use Dagster's built-in decorators to define assets and jobs, making the code cleaner and more maintainable. The use of `@asset` for defining assets and `@job` for was helpful for organizing the jobs.  I did get tripped up from time to time, but the Dagster documentation was really helpful.  I also found the [Dagster Slack community](https://dagster.io/community) had a lot of great hints and encouraging advice. Dagster examples tend to be dedicated to helping people with current workload issues especially in the [sciences](https://www.youtube.com/watch?v=XwuFgGvNibU). I love this.   

The scheuduling from inside Dagster is also really nice.  As well as the logs and the ability to find the origins of errors relatively quickly.  I would love to see how other people are using Dagster in their projects.  If you have any tips or tricks, please let me know.  

