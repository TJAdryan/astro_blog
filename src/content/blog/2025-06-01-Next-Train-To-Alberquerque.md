---
title: 'Next Train to Alberquerque: Track NYC Subway Arrivals in Real-Time with Python'
categories:
- Data Engineering
- Python
tags:
- MTA
- subway
- GTFS-Realtime
- Python
- data
pubDate: 2025-06-01 12:00:00 -0400
description: 'A post about Next Train to Alberquerque: Track NYC Subway Arrivals in
  Real-Time with Python.'
---




<figure style="text-align: center;">
  <img src="/img/next_train.png" alt="Twas but a cookie, with lemon" style="width: 400px; height: auto;">
  <figcaption style="font-size: smaller; color: gray;">If only there was a better way.</figcaption>
</figure>

Tired of anxiously peering down a dark subway tunnel, wondering when your train will actually arrive, or opening an app that asks you to scroll through every line to find the one you need?

With a bit of Python and access to the MTA's live data, you can build your own simple subway arrival tracker.  I have heard of some nice projects that people have used to keep a little sign in their apartment that tells them when the next train is coming.  If you are instested in that, this will help get you started.  The MTA used to require an API key for accessing their real-time data, but now you can access it freely. Which is exactly one less thnig you need to worry about. 

This post will guide you through:

*   Fetching live data from the MTA.
*   Understanding the basics of GTFS-Realtime (the data format).
*   Writing a Python script to find specific train arrivals.
*   Most importantly, how to customize this script for YOUR station, YOUR line, and YOUR commute!

I would recommend getting the code to run first and then customizing it to your local stations.  Once you have a working script you can see how the see how your changes affect the output.

## What You'll Need

*   **Python:** If you don't have it, download it from python.org.
*   **Basic Python Knowledge:** You should be comfortable with variables, functions, loops, and conditional statements.
*   **Two Python Libraries:**
    *   `requests`: For fetching data from the web.
    *   `gtfs-realtime-bindings`: For making sense of the MTA's real-time data format.

You can install these by opening your terminal or command prompt and typing:

````bash
pip install requests
pip install gtfs-realtime-bindings
````

##  Behind the Scenes: MTA & GTFS-Realtime

The Metropolitan Transportation Authority (MTA) generously provides real-time data feeds for its services. This data uses a standard called GTFS-Realtime. Think of GTFS (General Transit Feed Specification) as a universal language for public transportation schedules, and GTFS-Realtime as the live, up-to-the-minute updates to those schedules (like delays, changed arrival times, and vehicle positions).

This data is typically provided in a compact format called Protocol Buffers, which is where our gtfs-realtime-bindings library comes in handy to parse it.


The MTA has different feeds for different sets of subway lines. For our main example, we'll use the feed for the N, Q, R, W lines, but I'll show you how to find others too.

## The python script

Let's look at a Python script that checks for a northbound Q train arriving at Newkirk Plaza. Then, we'll break down how to modify it.

```python
import requests
from google.transit import gtfs_realtime_pb2
import time # To interpret timestamps


## --- CONFIGURATION: YOU'LL CHANGE THIS! ---

## Find other feed URLs here: 
https://api.mta.info/#/System%20Data/TripUpdates/get_tripUpdatesByRoute
## Example: NQRW lines
TRANSIT_FEED_URL = "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-nqrw"


## For direction: "N" for Northbound, "S" for Southbound (used in trip_id convention)
DIRECTION_ABBREVIATION = "N"

## CRITICAL: Find your stop_id from MTA's static GTFS data (stops.txt)

## Example: Newkirk Plaza Northbound on Brighton Line (Q)
TARGET_STOP_ID = "D22N"
TARGET_STATION_NAME = "Newkirk Plaza" # For print messages

## How many minutes in advance do you want to be notified? (e.g., 30 minutes)
ARRIVAL_WINDOW_MINUTES = 30
## --- END CONFIGURATION ---

def get_live_mta_data(url):

    try:
        response = requests.get(url)
        response.raise_for_status()
        return response.content
    except requests.exceptions.RequestException as e:
        print(f"Error fetching MTA data: {e}")
        return None

def parse_gtfs_realtime_feed(feed_content):

    feed = gtfs_realtime_pb2.FeedMessage()
    feed.ParseFromString(feed_content)
    return feed

def check_train_arrivals():
    #Checks for specified train arrivals at the target stop.
    raw_feed = get_live_mta_data(TRANSIT_FEED_URL)
    if not raw_feed:
        print("Could not fetch MTA feed.")
        return

    feed = parse_gtfs_realtime_feed(raw_feed)
    now = time.time()
    found_arrival = False

    print(f"--- Checking arrivals for Route {ROUTE_ID_TO_CHECK} ({DIRECTION_ABBREVIATION}B) at {TARGET_STATION_NAME} ({TARGET_STOP_ID}) ---")
    print(f"Current time: {time.strftime('%I:%M:%S %p')}")


    for entity in feed.entity:
        if entity.HasField('trip_update'):
            trip_update = entity.trip_update
            trip = trip_update.trip

            # 1. Check for the correct Route ID
            if trip.route_id == ROUTE_ID_TO_CHECK:
                # 2. Check for Direction (using trip_id convention)
                # MTA trip_ids often have '..N' or '..S' in the last segment
                # e.g., "A20230515WKD_000800_Q..N03R"
                is_correct_direction = False
                try:
                    # Trip ID structure can vary. This is a common MTA pattern.
                    # Example: some_prefix_ROUTEID..DIRECTIONcode_suffix
                    if ".." in trip.trip_id:
                        parts = trip.trip_id.split("..")
                        if len(parts) > 1 and parts[-1].startswith(DIRECTION_ABBREVIATION):
                            is_correct_direction = True
                    # Fallback for simpler trip_ids like those on LIRR/MetroNorth if adapting later
                    # elif trip.trip_id.endswith(DIRECTION_ABBREVIATION):
                    # is_correct_direction = True
                except Exception as e:
                    # print(f"Could not parse trip_id for direction: {trip.trip_id} - {e}")
                    pass # Continue, maybe rely on stop_id direction if specific enough

                # If direction is confirmed or stop_id itself is direction-specific
                if is_correct_direction or TARGET_STOP_ID.endswith(DIRECTION_ABBREVIATION):
                    for stop_time_update in trip_update.stop_time_update:
                        # 3. Check for the Target Stop ID
                        if stop_time_update.stop_id == TARGET_STOP_ID:
                            arrival = stop_time_update.arrival
                            if arrival and arrival.time > 0: # Ensure arrival time exists
                                arrival_time_unix = arrival.time
                                time_to_arrival_seconds = arrival_time_unix - now
                                arrival_time_readable = time.strftime('%I:%M:%S %p', time.localtime(arrival_time_unix))

                                if 0 <= time_to_arrival_seconds <= (ARRIVAL_WINDOW_MINUTES * 60):
                                    minutes_to_arrival = round(time_to_arrival_seconds / 60)
                                    print(f"  ALERT! {ROUTE_ID_TO_CHECK} train ({DIRECTION_ABBREVIATION}B) for {TARGET_STATION_NAME}")
                                    print(f"    Trip ID: {trip.trip_id}")
                                    print(f"    Estimated Arrival: {arrival_time_readable} (in approx. {minutes_to_arrival} min)")
                                    found_arrival = True
                                elif time_to_arrival_seconds < 0 and time_to_arrival_seconds > -120: # Just arrived (within last 2 mins)
                                    print(f"  INFO: {ROUTE_ID_TO_CHECK} train ({DIRECTION_ABBREVIATION}B) likely JUST ARRIVED/AT {TARGET_STATION_NAME}.")
                                    print(f"    Scheduled arrival was {arrival_time_readable}.")
                                    found_arrival = True
                            break # Found our stop for this trip, move to next trip entity
    
    if not found_arrival:
        print(f"No {ROUTE_ID_TO_CHECK} trains ({DIRECTION_ABBREVIATION}B) currently reporting an upcoming arrival at {TARGET_STATION_NAME} within {ARRIVAL_WINDOW_MINUTES} minutes.")
    print("---------------------------------------------------\n")

if __name__ == "__main__":
    while True:
        check_train_arrivals()
        # How often to check (in seconds)
        # MTA feeds update frequently, but every 30-60 seconds is reasonable
        time.sleep(30)
```
