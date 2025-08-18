---
title: Automated SQL Backups to Google Drive with Python
categories:
- Development
- Automation
- Databases
tags:
- python
- google-drive
- backup
- sql
- automation
pubDate: 2025-05-26 12:00:00 -0400
description: A post about Automated SQL Backups to Google Drive with Python.
---


Protecting your data is crucial, and having automated backups is a cornerstone of any robust data strategy. In this post, I'll walk you through a Python script that automatically backs up your SQL database (in `.gz` format) to Google Drive. This ensures your backups are stored securely offsite and are easily accessible when needed.  As always there are a lot of cateats to consider, like over using your Google Drive storage quota, in this case my total backups are less than 1GB.  A service like [rclone](https://rclone.org/) can you help you manage your backups with Google Drive and other cloud stoarge providers. without having to write your own code. This is a longer process and it involves running a cron job to fully automate. 

I usually advocate for the simple and straightforward approach, but in this case, I think there is value in scripting the process.  Both for learning and flexibility. There are a lot of great tools for backing up your files, they can also consume a lot of resources.


## Why Automate Backups to Google Drive?

*   **Offsite Storage:** Google Drive provides a secure and reliable offsite location for your backups, protecting against local hardware failures or disasters.
*   **Automation:** Automating the backup process ensures that backups are performed regularly without manual intervention.
*   **Version History:** Google Drive keeps a history of file versions, allowing you to restore to a specific point in time if necessary.
*   **Accessibility:** Your backups are accessible from anywhere with an internet connection.

## Prerequisites

Before you begin, make sure you have the following:

*   **Python 3.7+:** Ensure you have Python installed.
*   **Google Cloud Project:** You'll need a Google Cloud project with the Google Drive API enabled.
*   **Service Account:** Create a service account in your Google Cloud project and download the JSON key file. This key file will be used to authenticate your script with Google Drive.
*   **Required Python Libraries:** Install the necessary libraries using pip:

    ```bash
    pip install google-api-python-client google-auth-httplib2 google-auth-oauthlib
    ```

## The Python Script: Automating the Backup

Here's the Python script that handles the automated backup process. I've added comments inline to explain each step.  You need to combine the steps into a single script, and you can run it manually or set it up to run on a schedule using cron or another task scheduler.

```python
import os
import glob
import datetime
from google.oauth2.service_account import Credentials
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload
from googleapiclient.errors import HttpError
``` 
### --- CONFIGURATION ---
```python
LOCAL_BACKUP_DIRECTORY = "/home/files/folders/nestedfolder/db_backups"  # Directory containing .gz backups
FILE_PATTERN = "*.gz"  # Pattern to match .gz files
GOOGLE_DRIVE_FOLDER_ID = "YOUR_GOOGLE_DRIVE_FOLDER_ID"  # Replace with your Google Drive folder ID
SERVICE_ACCOUNT_FILE = "path/to/your/service_account.json"  # Path to your service account key file
``` 

### --- AUTHENTICATION ---
```python
SCOPES = ['https://www.googleapis.com/auth/drive.file']  # Scope for Google Drive access
credentials = Credentials.from_service_account_file(SERVICE_ACCOUNT_FILE, scopes=SCOPES)  # Authenticate with service account
service = build('drive', 'v3', credentials=credentials)  # Build the Google Drive service
``` 

### --- UPLOAD FUNCTION ---

```python
def upload_backup(filename, folder_id):
    #Uploads a file to Google Drive.
    file_metadata = {'name': filename, 'parents': [folder_id]}  # Metadata for the file
    media = MediaFileUpload(filename, mimetype='application/gzip', resumable=True)  # File to upload
    try:
        file = service.files().create(body=file_metadata, media=media, fields='id').execute()  # Upload the file
        print(f"File ID: {file.get('id')} uploaded successfully.")  # Print success message
    except HttpError as error:
        print(f"An error occurred: {error}")  # Print error message
``` 

### --- MAIN FUNCTION ---

```python   

def main():
    #Main function to find backup files and upload them.
    files = glob.glob(os.path.join(LOCAL_BACKUP_DIRECTORY, FILE_PATTERN))  # Find all .gz files
    if not files:
        print("No backup files found.")  # If no files found, print message
        return

    for filepath in files:  # Loop through each file
        filename = os.path.basename(filepath)  # Get the filename
        print(f"Uploading {filename}...")  # Print uploading message
        upload_backup(filepath, GOOGLE_DRIVE_FOLDER_ID)  # Upload the file

if __name__ == "__main__":
    main()  # Run the main function

```

## Automating the Backup Process with Cron

To automate the backup process, you can use a cron job (on Linux/macOS). Cron allows you to schedule tasks to run automatically at specific intervals.

### Setting Up a Cron Job

1.  **Open the Crontab File:**

    Open your terminal and type the following command:

    ```bash
    crontab -e
    ```

    This will open the crontab file in a text editor. If this is your first time using `crontab`, you may be prompted to select an editor.

2.  **Understand Crontab Syntax:**

    Each line in the crontab file represents a scheduled task and follows this format:

    ```
    minute hour day_of_month month day_of_week command
    ```

    *   `minute`: (0-59)
    *   `hour`: (0-23)
    *   `day_of_month`: (1-31)
    *   `month`: (1-12)
    *   `day_of_week`: (0-6, 0 is Sunday)
    *   `command`: The command to execute

    You can use special characters:

    *   `*`: Represents "every".
    *   `,`: Specifies a list of values.
    *   `-`: Specifies a range of values.
    *   `/`: Specifies a step value.

3.  **Add the Cron Job Entry:**

    Add a line to the crontab file to schedule your Python script. For example, to run the script every day at 2:00 AM, add the following line:

    ```
    0 2 * * * python /path/to/your/script.py > /path/to/backup.log 2>&1
    ```

    *   `0 2 * * *`: This schedules the task to run at 2:00 AM every day.
    *   `python /path/to/your/script.py`: This is the command to execute your Python script.  **Replace `/path/to/your/script.py` with the actual path to your script.**
    *   `> /path/to/backup.log 2>&1`: This redirects the output of the script (both standard output and standard error) to a log file named `backup.log`.  This is helpful for troubleshooting.

4.  **Save the Crontab File:**

    Save the crontab file. The changes will be applied automatically.

5.  **Verify the Cron Job:**

    You can verify that the cron job has been added by running the following command:

    ```bash
    crontab -l
    ```

    This will list all the cron jobs in your crontab file.

### Important Notes:

*   **Full Paths:** Always use full paths to the `python` executable and your script in the cron job entry.
*   **Logging:** Redirecting the output to a log file is highly recommended for debugging purposes.
*   **Testing:** Test your cron job by setting it to run more frequently (e.g., every minute) and checking the log file to ensure that it's working correctly.

### Example:

To run the backup script located at `/home/user/backup_script.py` every day at 3:30 AM and log the output to `/home/user/backup.log`, the cron job entry would be:

```
30 3 * * * python /home/user/backup_script.py > /home/user/backup.log 2>&1
```

