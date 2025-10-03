---
title: 'Sometimes Selenium Works Best: Web Automation in Python'
categories:
- Development
- Automation
tags:
- python
- selenium
- web-scraping
- automation
- chromedriver
pubDate: 2024-09-12 12:00:00 -0400
description: 'A post about Sometimes Selenium Works Best: Web Automation in Python.'
---


## Quick Intro: Web Automation with Selenium
Automation of scraping can be tricky. I remember an early roadblock was trying to interact with the pop-up on the website, the pop up would stop the script. Once I learned how to switch the focus to the pop up and close it, a whole world opened up to me.  I know people swear by Playwright, but I feel like Selenium was just there for me when I needed it. 

### Why Selenium?

It's invaluable for:

- Automated testing of web applications.

- Web scraping when data isn't easily accessible via APIs.Or when the API is unfriendly.

- Automating repetitive web-based tasks.


The Python code below sets up Selenium and defines a simple function. This function attempts to find and click a specific button (perhaps to close a pop-up or acknowledge a message) on a webpage, and then closes the browser.

```python
import selenium
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoSuchElementException
import chromedriver_autoinstaller

# Automatically install/update chromedriver
chromedriver_autoinstaller.install()# This will put the chromedriver in your PATH

# Example: Initialize a Chrome driver (you'd do this before calling the function)
# driver = webdriver.Chrome() 
# driver.get("your_website_url_here") 

def remove_popup_and_quit(driver_instance):
    """
    Attempts to find and click an element with id 'btnRead'
    and then quits the browser instance.
    """
    try:
        # Check if the element exists before trying to click
        popup_button = driver_instance.find_element(By.ID, "btnRead")
        if popup_button:
            # A more robust way to click, especially if obscured
            driver_instance.execute_script("arguments[0].click();", popup_button)
            print("Popup button clicked.")
    except NoSuchElementException:
        print("Popup button with id 'btnRead' not found.")
    except Exception as e:
        print(f"An error occurred: {e}")
    finally:    
        if driver_instance:
            driver_instance.quit()
            print("Browser closed.")

# To use this:
# 1. Initialize your driver: driver = webdriver.Chrome()
# 2. Navigate to a page: driver.get("https://example.com")
# 3. Call the function: remove_popup_and_quit(driver)
```
