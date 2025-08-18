---
title: Identifying Microsoft Teams Storage Usage with Python and Graph API
categories:
- Development
- Administration
tags:
- python
- microsoft-graph
- teams
- admin
pubDate: 2024-07-10 12:00:00 -0400
description: A post about Identifying Microsoft Teams Storage Usage with Python and
  Graph API.
---


I usually have a hard time learning something when the information is completely abstract I much prefer a practical application. I don't want to expose the internal workings of any of my clients. So this is something I have run, with 'fictitious' data. In this case we are going to use the example of a school. We'll compare synchronous and async code in the Microsoft Graph API to get a list of all the teams in the organization and then get the storage usage for each team.  The school has run out out of data and needs to find out how much space is being used by each team.



## Prerequisites

Before starting, ensure you have the following:

* Python 3.7+
* The following Python libraries: `requests`, `msal`, `pandas`, `aiohttp`, `nest_asyncio`. Install them via pip:
    ```bash
    pip install requests msal pandas aiohttp nest_asyncio
    ```
* An Azure Active Directory (Azure AD) application registration with:
    * Client ID
    * Tenant ID
    * A generated Client Secret
    * The following Microsoft Graph API **Application Permissions** (admin consent granted):
        * `Group.Read.All` (to list Teams)
        * `Sites.Read.All` (to access drive storage information)

**Security Note:** Securely manage your `client_secret`. Avoid hardcoding it in scripts for production environments. Consider using an environment variable.

## Python Script Walkthrough

### Part 1: Authentication with MSAL

We use the Microsoft Authentication Library (MSAL) for Python to obtain an access token for the Graph API. The token is good for an hour. Plenty of time for what we are doing here. I like to put into function anyway, you don't know when you will need it again.  Which is the whole point of functions, right?

```python
import json
import requests
from msal import ConfidentialClientApplication
import pandas as pd
from datetime import datetime, timedelta
import time
from time import sleep  # Optional for deliberate delays

# --- Credentials - Replace with your actual values ---
client_id = 'YOUR_CLIENT_ID'
tenant_id = 'YOUR_TENANT_ID'
client_secret = 'YOUR_CLIENT_SECRET'
# --- End Credentials ---

msal_authority = f"https://login.microsoftonline.com/{tenant_id}"
msal_scope = ["https://graph.microsoft.com/.default"]

msal_app = ConfidentialClientApplication(
    client_id=client_id,
    client_credential=client_secret,
    authority=msal_authority,
)

def update_headers(current_msal_app, current_msal_scope):
    """Acquires a Graph API token and returns request headers."""
    result = current_msal_app.acquire_token_silent(
        scopes=current_msal_scope,
        account=None,
    )

    if not result:
        # print("No token in cache, acquiring new token for client...") # Optional logging
        result = current_msal_app.acquire_token_for_client(scopes=current_msal_scope)

    if "access_token" in result:
        access_token = result["access_token"]
        # print('Token acquired successfully.') # Optional logging
        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json",
        }
        return headers
    else:
        error_description = result.get("error_description", "No error description provided.")
        print(f"Error acquiring token: {error_description}")
        raise Exception("No Access Token found or error in acquiring token.")
headers = update_headers(msal_app, msal_scope)
```

The update_headers function handles token acquisition.



### Part 2: Fetching All Microsoft Teams
Teams are Microsoft 365 Groups with a 'Team' resource. We query the Graph API for these groups. We will run this synchonously it returs the list relatively quickly in about 3 seconds.

```python
teams_url = "https://graph.microsoft.com/v1.0/groups?$filter=resourceProvisioningOptions/Any(x:x eq 'Team')&$select=id,displayName"

print("\nFetching list of all Teams...")
start_fetch_teams_time = time.time()

all_teams_list = []
current_url = teams_url

while current_url:
    response = requests.get(current_url, headers=headers)
    response.raise_for_status() 
    teams_data = response.json()
    
    all_teams_list.extend(teams_data['value'])
    current_url = teams_data.get('@odata.nextLink', None) 
    # if current_url: # Optional logging
    #     print(f"Fetching next page of teams...")

df_teams = pd.DataFrame(all_teams_list)
df_unique_teams = df_teams.drop_duplicates(subset=['id'], keep='first')

end_fetch_teams_time = time.time()
elapsed_fetch_teams_time = end_fetch_teams_time - start_fetch_teams_time

print(f"\nFound {df_unique_teams.shape[0]} unique Teams.")
print(f"Time to fetch Teams list: {elapsed_fetch_teams_time:.2f} seconds")

team_ids_list = df_unique_teams['id'].tolist()
team_names_list = df_unique_teams['displayName'].tolist()
```

After running this code, you'll get a list of teams like this, we really only need the id, but the displayName is nice to have and shows us right away that one of the names is repeated, but has a different id.  This is a good example of why you should always check for duplicates when working with data.  Seems like a strong hint, but I think we all already know who is responsible::
```python
# Example of teams data from Graph API:
[
    {'id': '87w3uhq2ev99r123o5mwi55s6nqp2bk4zlwf', 'displayName': 'Shell Cottage'},
    {'id': 'qq9dqz35wgdq8yqjrn5wt4sqzzgpuihbbvas', 'displayName': 'The Gryffindor Common Room'},
    {'id': 'ly09hvq87rvxh0n1rxh83d2vnaraqy7zpxuu', 'displayName': 'Hufflepuff House'},
    {'id': '38tcpukusneqdhnwconcflwt2dqsgiobrbj4', 'displayName': 'The Black Lake'},
    {'id': 'tsafap1hyai38knuc3p8sgmzafdt7pqq1o9u', 'displayName': 'The Dungeons'},
    {'id': 'z98u31nua35b499cbqi8hy3gzyytad4z9mxb', 'displayName': 'The Library'},
    {'id': 's50u5ipnrukdp4pnrgk0g1fk4bpq0mzkpmms', 'displayName': 'Azkaban Prison'},
    {'id': 'dsos1aq9517gwnavr0c8miz5xrzhc9iq4jce', 'displayName': 'The Library'},
    {'id': 'usrpwr65bj18zmrk8hqqmyaryglyop8dh0x6', 'displayName': 'The Hufflepuff Common Room'},
    {'id': 'no12n4fddxtoq5sddz7c0ej0q35nctjreyv7', 'displayName': "St. Mungo's Hospital"}
]
```
## Part 3: Fetching Drive Storage (Synchronous Method)
This initial approach fetches storage information for each Team sequentially. It can be slow, especially if you have a large number of teams.  

```python
print("\nFetching drive storage for each team (Synchronous approach)...")
sync_start_time = time.time()

all_teams_drive_data_sync = []
# Consider token refresh strategy for very long running synchronous operations.
# headers = update_headers(msal_app, msal_scope) 

for i, teamid in enumerate(team_ids_list):
    if i > 0 and i % 50 == 0: # Progress indicator, skip first
        print(f"Processing team {i+1}/{len(team_ids_list)}: {team_names_list[i]}")
    
    drive_url = f'https://graph.microsoft.com/v1.0/groups/{teamid}/drive'
    
    try:
        response = requests.get(drive_url, headers=headers)
        response.raise_for_status()
        drive_info = response.json()
        
        team_frame = pd.json_normalize(drive_info)
        team_frame['team_id'] = teamid
        team_frame['teamName'] = team_names_list[i]
        all_teams_drive_data_sync.append(team_frame)
    except requests.exceptions.HTTPError as e:
        print(f"Error fetching drive for team ID {teamid} ({team_names_list[i]}): {e.response.status_code}")
    except json.JSONDecodeError:
        print(f"Error decoding JSON for team ID {teamid} ({team_names_list[i]})")
    except Exception as e:
        print(f"An unexpected error for team ID {teamid} ({team_names_list[i]}): {e}")
    
    # time.sleep(0.05) # Optional small delay for very basic throttling avoidance

if all_teams_drive_data_sync:
    space_teams_sync_df = pd.coI didn't dive into thencat(all_teams_drive_data_sync, ignore_index=True)
    print(f"\nSynchronous fetching processed {len(space_teams_sync_df)} team drives.")
else:
    print("\nNo drive data fetched synchronously.")
    space_teams_sync_df = pd.DataFrame()

sync_end_time = time.time()
sync_elapsed_time = sync_end_time - sync_start_time
print(f"Execution time for synchronous drive fetching: {sync_elapsed_time:.2f} seconds")
# print(space_teams_sync_df.head() if not space_teams_sync_df.empty else "No sync data to show.")
```

## Part 4: Asynchronous Data Fetching with aiohttp
To improve performance, we use aiohttp and asyncio for concurrent API calls.
nest_asyncio is only neccesary if you are running this in a jupyter notebook. 
You might not even need this if you are running jupyter 7.  
```python
import asyncio
import aiohttp
import nest_asyncio 

nest_asyncio.apply() 

async def fetch_drive_async(session, teamid, team_name, auth_headers):
    """Asynchronously fetches drive information for a single team."""
    drive_url = f'https://graph.microsoft.com/v1.0/groups/{teamid}/drive'
    try:
        async with session.get(drive_url, headers=auth_headers) as response:
            if response.status == 200:
                data = await response.json()
                if 'quota' in data and 'used' in data['quota']:
                    team_frame = pd.json_normalize(data)
                    team_frame['team_id'] = teamid
                    team_frame['teamName'] = team_name
                    return team_frame
                else:
                    # print(f"Warning: 'quota.used' not found for team {team_name} ({teamid}).") # Optional
                    return pd.DataFrame({'team_id': [teamid], 'teamName': [team_name], 'quota.used': [None], 'error_detail': ['Missing quota info']})
            else:
                # print(f"Error (async) for team {team_name} ({teamid}): {response.status}") # Optional
                return pd.DataFrame({'team_id': [teamid], 'teamName': [team_name], 'error_status': [response.status]})
    except Exception as e:
        # print(f"Exception (async) for team {team_name} ({teamid}): {e}") # Optional
        return pd.DataFrame({'team_id': [teamid], 'teamName': [team_name], 'exception': [str(e)]})

async def main_async_fetch(team_ids, team_names_list_async, auth_headers):
    """Main async function to gather drive information for all teams."""
    all_teams_data = []
    # For very large tenants, consider an asyncio.Semaphore to limit concurrency:
    # sem = asyncio.Semaphore(10) # Limit to 10 concurrent requests
    # async with sem:
    #     tasks.append(fetch_drive_async(session, teamid, team_names_list_async[i], auth_headers))

    async with aiohttp.ClientSession() as session:
        tasks = []
        for i, teamid in enumerate(team_ids):
            if i > 0 and i % 50 == 0: # Progress indicator
                print(f"Queueing async fetch for team {i+1}/{len(team_ids)}: {team_names_list_async[i]}")
            tasks.append(fetch_drive_async(session, teamid, team_names_list_async[i], auth_headers))
        
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        for res in results:
            if isinstance(res, pd.DataFrame):
                all_teams_data.append(res)
            else: 
                print(f"A task failed with exception: {res}")
    
    return pd.concat(all_teams_data, ignore_index=True) if all_teams_data else pd.DataFrame()

print("\nFetching drive storage for each team (Asynchronous approach)...")
current_headers = update_headers(msal_app, msal_scope) # Refresh token

async_start_time = time.time()
space_teams_async_df = asyncio.run(main_async_fetch(team_ids_list, team_names_list, current_headers))
async_end_time = time.time()
async_elapsed_time = async_end_time - async_start_time

print(f"\nAsynchronous fetching complete.")
print(f"Execution time for asynchronous drive fetching: {async_elapsed_time:.2f} seconds")
# print(space_teams_async_df.head() if not space_teams_async_df.empty else "No async data to show.")
```

# Synchronous approach results:
Synchronous fetching processed 535 team drives.
Data shape: (535, 10)
Execution time for synchronous drive fetching: 186.42 seconds

# Asynchronous approach results:
Asynchronous fetching complete.
Data shape: (535, 10)
Execution time for asynchronous drive fetching: 2.94 seconds

So there you go, the async approach returns the same data, just more than 60 times faster.  We didn't dive into the data this time, so I will tell you it was the Library that was using the most space.  I almost feel bad for thinking it was Slytetherin, lazy thinking on my part.    

