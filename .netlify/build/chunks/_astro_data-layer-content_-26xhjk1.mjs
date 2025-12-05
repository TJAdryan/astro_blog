const _astro_dataLayerContent = [["Map", 1, 2, 9, 10], "meta::meta", ["Map", 3, 4, 5, 6, 7, 8], "astro-version", "5.14.6", "content-config-digest", "0bb5677cfe0e4413", "astro-config-digest", '{"root":{},"srcDir":{},"publicDir":{},"outDir":{},"cacheDir":{},"site":"https://nextvaldata.com","compressHTML":true,"base":"/","trailingSlash":"ignore","output":"server","scopedStyleStrategy":"attribute","build":{"format":"directory","client":{},"server":{},"assets":"_astro","serverEntry":"entry.mjs","redirects":false,"inlineStylesheets":"auto","concurrency":1},"server":{"open":false,"host":false,"port":4321,"streaming":true,"allowedHosts":[]},"redirects":{},"image":{"endpoint":{"route":"/_image"},"service":{"entrypoint":"@astrojs/netlify/image-service.js","config":{}},"domains":[],"remotePatterns":[],"responsiveStyles":false},"devToolbar":{"enabled":true},"markdown":{"syntaxHighlight":{"type":"shiki","excludeLangs":["math"]},"shikiConfig":{"langs":[],"langAlias":{},"theme":"github-dark","themes":{},"wrap":false,"transformers":[]},"remarkPlugins":[null],"rehypePlugins":[],"remarkRehype":{},"gfm":true,"smartypants":true},"security":{"checkOrigin":true,"allowedDomains":[]},"env":{"schema":{"PUBLIC_CLERK_PUBLISHABLE_KEY":{"context":"client","access":"public","type":"string"},"PUBLIC_CLERK_SIGN_IN_URL":{"context":"client","access":"public","optional":true,"type":"string"},"PUBLIC_CLERK_SIGN_UP_URL":{"context":"client","access":"public","optional":true,"type":"string"},"PUBLIC_CLERK_IS_SATELLITE":{"context":"client","access":"public","optional":true,"type":"boolean"},"PUBLIC_CLERK_PROXY_URL":{"context":"client","access":"public","optional":true,"url":true,"type":"string"},"PUBLIC_CLERK_DOMAIN":{"context":"client","access":"public","optional":true,"url":true,"type":"string"},"PUBLIC_CLERK_JS_URL":{"context":"client","access":"public","optional":true,"url":true,"type":"string"},"PUBLIC_CLERK_JS_VARIANT":{"context":"client","access":"public","optional":true,"values":["headless"],"type":"enum"},"PUBLIC_CLERK_JS_VERSION":{"context":"client","access":"public","optional":true,"type":"string"},"PUBLIC_CLERK_TELEMETRY_DISABLED":{"context":"client","access":"public","optional":true,"type":"boolean"},"PUBLIC_CLERK_TELEMETRY_DEBUG":{"context":"client","access":"public","optional":true,"type":"boolean"},"CLERK_SECRET_KEY":{"context":"server","access":"secret","type":"string"},"CLERK_MACHINE_SECRET_KEY":{"context":"server","access":"secret","optional":true,"type":"string"},"CLERK_JWT_KEY":{"context":"server","access":"secret","optional":true,"type":"string"}},"validateSecrets":false},"experimental":{"clientPrerender":false,"contentIntellisense":false,"headingIdCompat":false,"preserveScriptOrder":false,"liveContentCollections":false,"csp":false,"staticImportMetaEnv":false,"chromeDevtoolsWorkspace":false,"failOnPrerenderConflict":false},"legacy":{"collections":false},"session":{"driver":"netlify-blobs","options":{"name":"astro-sessions","consistency":"strong"}}}', "blog", ["Map", 11, 12, 70, 71, 105, 106, 156, 157, 187, 188, 225, 226, 254, 255, 291, 292, 349, 350, 380, 381, 399, 400, 458, 459, 513, 514, 551, 552, 579, 580, 633, 634, 666, 667, 677, 678, 719, 720, 762, 763, 804, 805, 829, 830, 840, 841], "2024-06-05-xml-all-the-things", { id: 11, data: 13, body: 25, filePath: 26, digest: 27, rendered: 28, legacyId: 69 }, { title: 14, description: 15, pubDate: 16, tags: 17, categories: 22 }, "XLSX are Just Text Files in a Trench Coat", "An exploration of the XML structure behind modern Excel files.", ["Date", "2024-06-05T16:00:00.000Z"], [18, 19, 20, 21], "xml", "excel", "file-formats", "python", [23, 24], "Technology", "Data", "# It's XML All the Way Down\n\nA few years ago I was tasked to use an API with poor documentation that was only available in SOAP. Fortunately, there is a Python library called Zeep ([docs.python-zeep.org/](https://docs.python-zeep.org/)) – without it, I would have been completely lost. I grumbled through this task, feeling like I was working on something that if not already obsolete was well on its way. This is a good example of how everything can be a learning experience.  Even if it wasn't the thing you set out to learn. \n\nThis is how I learned that XLSX files are actually zipped XML files. And even though I had not not set out to learn that, taking it apart taught me something. So let's take one apart:\n\n### 1. Initial CSV File\nStarting with a CSV file has about 1200 rows and 17 columns comes to 210 KB.\n\nuser/downloads/\n└── data.csv (210 KB)\n\n\n### 2. CSV Saved as .xlsx\nSince the file is zipped, saving it as a .xlsx file reduces the file size to 141 KB.\n\n\nuser/downloads/\n├── data.csv (210 KB)\n└── data.xlsx (141 KB)\n\n\n### 3. Formatted .xlsx File\nCreating a formatted table and changing the fonts increases the size of the file to 768 KB.\n\nuser/downloads/\n├── data.csv (210 KB)\n└── data.xlsx (768 KB)\n\n\n\n### 4. Now you can change the file extension to .zip and unzip the file to see the contents\n\n![Top of the xml folder](/img/2024-06-05-xml-all-the-things/firstlevel.png)\n\nWhat we thought was a single file is actually a nested folder structure. \n\n├── xl/\n│   ├── _rels/\n│   │   └── workbook.xml.rels\n│   ├── theme/\n│   │   └── theme1.xml\n│   ├── worksheets/\n│   │   └── sheet1.xml\n│   ├── styles.xml\n│   ├── workbook.xml\n│   └── sharedStrings.xml \n\n![nested xml](/img/2024-06-05-xml-all-the-things/xl_level.png)\n\n\n\n\nNow the weird changes in file size and why some (relatively) small XLSX files take so long to open almost makes sense. When I heard it was the Microsoft standard since 2007, I instantly assumed it was some nefarious plot to consolidate their market share. But actually, it opened up Excel from a proprietary to an open format called [Office Open XML (OOXML)](https://en.wikipedia.org/wiki/Office_Open_XML). My bad Microsoft. I guess I should have read the [ISO/IEC 29500:2008](https://www.iso.org/standard/39574.html) standard before jumping to conclusions.\n\n### XML Forever?\n\nXML (eXtensible Markup Language) was created in the late 1990s to replace SGML which I am guessing was a replacement for something else. JSON (JavaScript Object Notation) is a lighter weight alternative but obviously ther are still many applications where XML is the better choice. Or in the case of XLSX, the only choice.\n\n## Practical tips\n\n- When sharing Excel data, consider providing it as a CSV file for simplicity and wider accessibility.\n- Use Excel's \"Inspect Document\" feature to see what XML data is embedded in your XLSX files.\n- Explore using Python's `openpyxl` or `pandas` libraries for advanced Excel file manipulations beyond the XML structure.\n\n## Recommended diagram — CRISPR mechanics\n\nFor a clear, well-labeled diagram that demonstrates CRISPR mechanics (target recognition, guide RNA, and nuclease cutting), see this figure from IJMS:\n\n[CRISPR mechanism diagram — IJMS Fig.1](https://www.mdpi.com/ijms/ijms-26-04420/article_deploy/html/images/ijms-26-04420-g001.png)\n\nThis diagram is a useful reference when explaining how guide RNAs direct nucleases to specific DNA sequences.\n\n---\n\n## Conclusion\n\nUnderstanding the underlying XML structure of XLSX files can demystify many of the oddities encountered when working with Excel data. It also provides a powerful tool for data manipulation and analysis, opening up new possibilities for automation and integration with other data processing workflows.", "src/content/blog/2024-06-05-xml-all-the-things.md", "618ca99111522333", { html: 29, metadata: 30 }, '<h1 id="its-xml-all-the-way-down">It’s XML All the Way Down</h1>\n<p>A few years ago I was tasked to use an API with poor documentation that was only available in SOAP. Fortunately, there is a Python library called Zeep (<a href="https://docs.python-zeep.org/">docs.python-zeep.org/</a>) – without it, I would have been completely lost. I grumbled through this task, feeling like I was working on something that if not already obsolete was well on its way. This is a good example of how everything can be a learning experience.  Even if it wasn’t the thing you set out to learn.</p>\n<p>This is how I learned that XLSX files are actually zipped XML files. And even though I had not not set out to learn that, taking it apart taught me something. So let’s take one apart:</p>\n<h3 id="1-initial-csv-file">1. Initial CSV File</h3>\n<p>Starting with a CSV file has about 1200 rows and 17 columns comes to 210 KB.</p>\n<p>user/downloads/\n└── data.csv (210 KB)</p>\n<h3 id="2-csv-saved-as-xlsx">2. CSV Saved as .xlsx</h3>\n<p>Since the file is zipped, saving it as a .xlsx file reduces the file size to 141 KB.</p>\n<p>user/downloads/\n├── data.csv (210 KB)\n└── data.xlsx (141 KB)</p>\n<h3 id="3-formatted-xlsx-file">3. Formatted .xlsx File</h3>\n<p>Creating a formatted table and changing the fonts increases the size of the file to 768 KB.</p>\n<p>user/downloads/\n├── data.csv (210 KB)\n└── data.xlsx (768 KB)</p>\n<h3 id="4-now-you-can-change-the-file-extension-to-zip-and-unzip-the-file-to-see-the-contents">4. Now you can change the file extension to .zip and unzip the file to see the contents</h3>\n<p><img src="/img/2024-06-05-xml-all-the-things/firstlevel.png" alt="Top of the xml folder"></p>\n<p>What we thought was a single file is actually a nested folder structure.</p>\n<p>├── xl/\n│   ├── _rels/\n│   │   └── workbook.xml.rels\n│   ├── theme/\n│   │   └── theme1.xml\n│   ├── worksheets/\n│   │   └── sheet1.xml\n│   ├── styles.xml\n│   ├── workbook.xml\n│   └── sharedStrings.xml</p>\n<p><img src="/img/2024-06-05-xml-all-the-things/xl_level.png" alt="nested xml"></p>\n<p>Now the weird changes in file size and why some (relatively) small XLSX files take so long to open almost makes sense. When I heard it was the Microsoft standard since 2007, I instantly assumed it was some nefarious plot to consolidate their market share. But actually, it opened up Excel from a proprietary to an open format called <a href="https://en.wikipedia.org/wiki/Office_Open_XML">Office Open XML (OOXML)</a>. My bad Microsoft. I guess I should have read the <a href="https://www.iso.org/standard/39574.html">ISO/IEC 29500:2008</a> standard before jumping to conclusions.</p>\n<h3 id="xml-forever">XML Forever?</h3>\n<p>XML (eXtensible Markup Language) was created in the late 1990s to replace SGML which I am guessing was a replacement for something else. JSON (JavaScript Object Notation) is a lighter weight alternative but obviously ther are still many applications where XML is the better choice. Or in the case of XLSX, the only choice.</p>\n<h2 id="practical-tips">Practical tips</h2>\n<ul>\n<li>When sharing Excel data, consider providing it as a CSV file for simplicity and wider accessibility.</li>\n<li>Use Excel’s “Inspect Document” feature to see what XML data is embedded in your XLSX files.</li>\n<li>Explore using Python’s <code>openpyxl</code> or <code>pandas</code> libraries for advanced Excel file manipulations beyond the XML structure.</li>\n</ul>\n<h2 id="recommended-diagram--crispr-mechanics">Recommended diagram — CRISPR mechanics</h2>\n<p>For a clear, well-labeled diagram that demonstrates CRISPR mechanics (target recognition, guide RNA, and nuclease cutting), see this figure from IJMS:</p>\n<p><a href="https://www.mdpi.com/ijms/ijms-26-04420/article_deploy/html/images/ijms-26-04420-g001.png">CRISPR mechanism diagram — IJMS Fig.1</a></p>\n<p>This diagram is a useful reference when explaining how guide RNAs direct nucleases to specific DNA sequences.</p>\n<hr>\n<h2 id="conclusion">Conclusion</h2>\n<p>Understanding the underlying XML structure of XLSX files can demystify many of the oddities encountered when working with Excel data. It also provides a powerful tool for data manipulation and analysis, opening up new possibilities for automation and integration with other data processing workflows.</p>', { headings: 31, localImagePaths: 62, remoteImagePaths: 63, frontmatter: 64, imagePaths: 68 }, [32, 36, 40, 43, 46, 49, 52, 56, 59], { depth: 33, slug: 34, text: 35 }, 1, "its-xml-all-the-way-down", "It’s XML All the Way Down", { depth: 37, slug: 38, text: 39 }, 3, "1-initial-csv-file", "1. Initial CSV File", { depth: 37, slug: 41, text: 42 }, "2-csv-saved-as-xlsx", "2. CSV Saved as .xlsx", { depth: 37, slug: 44, text: 45 }, "3-formatted-xlsx-file", "3. Formatted .xlsx File", { depth: 37, slug: 47, text: 48 }, "4-now-you-can-change-the-file-extension-to-zip-and-unzip-the-file-to-see-the-contents", "4. Now you can change the file extension to .zip and unzip the file to see the contents", { depth: 37, slug: 50, text: 51 }, "xml-forever", "XML Forever?", { depth: 53, slug: 54, text: 55 }, 2, "practical-tips", "Practical tips", { depth: 53, slug: 57, text: 58 }, "recommended-diagram--crispr-mechanics", "Recommended diagram — CRISPR mechanics", { depth: 53, slug: 60, text: 61 }, "conclusion", "Conclusion", [], [], { title: 14, description: 15, pubDate: 65, categories: 66, tags: 67 }, "2024-06-05 12:00:00 -0400", [23, 24], [18, 19, 20, 21], [], "2024-06-05-xml-all-the-things.md", "2024-09-12-sometimes-selenium", { id: 70, data: 72, body: 84, filePath: 85, digest: 86, rendered: 87, legacyId: 104 }, { title: 73, description: 74, pubDate: 75, tags: 76, categories: 81 }, "Sometimes Selenium Works Best: Web Automation in Python", "A post about Sometimes Selenium Works Best: Web Automation in Python.", ["Date", "2024-09-12T16:00:00.000Z"], [21, 77, 78, 79, 80], "selenium", "web-scraping", "automation", "chromedriver", [82, 83], "Development", "Automation", `## Quick Intro: Web Automation with Selenium
Automation of scraping can be tricky. I remember an early roadblock was trying to interact with the pop-up on the website, the pop up would stop the script. Once I learned how to switch the focus to the pop up and close it, a whole world opened up to me.  I know people swear by Playwright, but I feel like Selenium was just there for me when I needed it. 

### Why Selenium?

It's invaluable for:

- Automated testing of web applications.

- Web scraping when data isn't easily accessible via APIs.Or when the API is unfriendly.

- Automating repetitive web-based tasks.


The Python code below sets up Selenium and defines a simple function. This function attempts to find and click a specific button (perhaps to close a pop-up or acknowledge a message) on a webpage, and then closes the browser.

\`\`\`python
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
\`\`\``, "src/content/blog/2024-09-12-Sometimes-Selenium.md", "99a46c0ae9c83216", { html: 88, metadata: 89 }, `<h2 id="quick-intro-web-automation-with-selenium">Quick Intro: Web Automation with Selenium</h2>
<p>Automation of scraping can be tricky. I remember an early roadblock was trying to interact with the pop-up on the website, the pop up would stop the script. Once I learned how to switch the focus to the pop up and close it, a whole world opened up to me.  I know people swear by Playwright, but I feel like Selenium was just there for me when I needed it.</p>
<h3 id="why-selenium">Why Selenium?</h3>
<p>It’s invaluable for:</p>
<ul>
<li>
<p>Automated testing of web applications.</p>
</li>
<li>
<p>Web scraping when data isn’t easily accessible via APIs.Or when the API is unfriendly.</p>
</li>
<li>
<p>Automating repetitive web-based tasks.</p>
</li>
</ul>
<p>The Python code below sets up Selenium and defines a simple function. This function attempts to find and click a specific button (perhaps to close a pop-up or acknowledge a message) on a webpage, and then closes the browser.</p>
<pre class="astro-code github-dark" style="background-color:#24292e;color:#e1e4e8; overflow-x: auto;" tabindex="0" data-language="python"><code><span class="line"><span style="color:#F97583">import</span><span style="color:#E1E4E8"> selenium</span></span>
<span class="line"><span style="color:#F97583">from</span><span style="color:#E1E4E8"> selenium </span><span style="color:#F97583">import</span><span style="color:#E1E4E8"> webdriver</span></span>
<span class="line"><span style="color:#F97583">from</span><span style="color:#E1E4E8"> selenium.webdriver.common.by </span><span style="color:#F97583">import</span><span style="color:#E1E4E8"> By</span></span>
<span class="line"><span style="color:#F97583">from</span><span style="color:#E1E4E8"> selenium.common.exceptions </span><span style="color:#F97583">import</span><span style="color:#E1E4E8"> NoSuchElementException</span></span>
<span class="line"><span style="color:#F97583">import</span><span style="color:#E1E4E8"> chromedriver_autoinstaller</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D"># Automatically install/update chromedriver</span></span>
<span class="line"><span style="color:#E1E4E8">chromedriver_autoinstaller.install()</span><span style="color:#6A737D"># This will put the chromedriver in your PATH</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D"># Example: Initialize a Chrome driver (you'd do this before calling the function)</span></span>
<span class="line"><span style="color:#6A737D"># driver = webdriver.Chrome() </span></span>
<span class="line"><span style="color:#6A737D"># driver.get("your_website_url_here") </span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">def</span><span style="color:#B392F0"> remove_popup_and_quit</span><span style="color:#E1E4E8">(driver_instance):</span></span>
<span class="line"><span style="color:#9ECBFF">    """</span></span>
<span class="line"><span style="color:#9ECBFF">    Attempts to find and click an element with id 'btnRead'</span></span>
<span class="line"><span style="color:#9ECBFF">    and then quits the browser instance.</span></span>
<span class="line"><span style="color:#9ECBFF">    """</span></span>
<span class="line"><span style="color:#F97583">    try</span><span style="color:#E1E4E8">:</span></span>
<span class="line"><span style="color:#6A737D">        # Check if the element exists before trying to click</span></span>
<span class="line"><span style="color:#E1E4E8">        popup_button </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> driver_instance.find_element(By.</span><span style="color:#79B8FF">ID</span><span style="color:#E1E4E8">, </span><span style="color:#9ECBFF">"btnRead"</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#F97583">        if</span><span style="color:#E1E4E8"> popup_button:</span></span>
<span class="line"><span style="color:#6A737D">            # A more robust way to click, especially if obscured</span></span>
<span class="line"><span style="color:#E1E4E8">            driver_instance.execute_script(</span><span style="color:#9ECBFF">"arguments[0].click();"</span><span style="color:#E1E4E8">, popup_button)</span></span>
<span class="line"><span style="color:#79B8FF">            print</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"Popup button clicked."</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#F97583">    except</span><span style="color:#E1E4E8"> NoSuchElementException:</span></span>
<span class="line"><span style="color:#79B8FF">        print</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"Popup button with id 'btnRead' not found."</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#F97583">    except</span><span style="color:#79B8FF"> Exception</span><span style="color:#F97583"> as</span><span style="color:#E1E4E8"> e:</span></span>
<span class="line"><span style="color:#79B8FF">        print</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">f</span><span style="color:#9ECBFF">"An error occurred: </span><span style="color:#79B8FF">{</span><span style="color:#E1E4E8">e</span><span style="color:#79B8FF">}</span><span style="color:#9ECBFF">"</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#F97583">    finally</span><span style="color:#E1E4E8">:    </span></span>
<span class="line"><span style="color:#F97583">        if</span><span style="color:#E1E4E8"> driver_instance:</span></span>
<span class="line"><span style="color:#E1E4E8">            driver_instance.quit()</span></span>
<span class="line"><span style="color:#79B8FF">            print</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"Browser closed."</span><span style="color:#E1E4E8">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D"># To use this:</span></span>
<span class="line"><span style="color:#6A737D"># 1. Initialize your driver: driver = webdriver.Chrome()</span></span>
<span class="line"><span style="color:#6A737D"># 2. Navigate to a page: driver.get("https://example.com")</span></span>
<span class="line"><span style="color:#6A737D"># 3. Call the function: remove_popup_and_quit(driver)</span></span></code></pre>`, { headings: 90, localImagePaths: 97, remoteImagePaths: 98, frontmatter: 99, imagePaths: 103 }, [91, 94], { depth: 53, slug: 92, text: 93 }, "quick-intro-web-automation-with-selenium", "Quick Intro: Web Automation with Selenium", { depth: 37, slug: 95, text: 96 }, "why-selenium", "Why Selenium?", [], [], { title: 73, categories: 100, tags: 101, pubDate: 102, description: 74 }, [82, 83], [21, 77, 78, 79, 80], "2024-09-12 12:00:00 -0400", [], "2024-09-12-Sometimes-Selenium.md", "2024-07-10-all-the-teams-storage", { id: 105, data: 107, body: 117, filePath: 118, digest: 119, rendered: 120, legacyId: 155 }, { title: 108, description: 109, pubDate: 110, tags: 111, categories: 115 }, "Identifying Microsoft Teams Storage Usage with Python and Graph API", "A post about Identifying Microsoft Teams Storage Usage with Python and Graph API.", ["Date", "2024-07-10T16:00:00.000Z"], [21, 112, 113, 114], "microsoft-graph", "teams", "admin", [82, 116], "Administration", `I usually have a hard time learning something when the information is completely abstract I much prefer a practical application. I don't want to expose the internal workings of any of my clients. So this is something I have run, with 'fictitious' data. In this case we are going to use the example of a school. We'll compare synchronous and async code in the Microsoft Graph API to get a list of all the teams in the organization and then get the storage usage for each team.  The school has run out out of data and needs to find out how much space is being used by each team.



## Prerequisites

Before starting, ensure you have the following:

* Python 3.7+
* The following Python libraries: \`requests\`, \`msal\`, \`pandas\`, \`aiohttp\`, \`nest_asyncio\`. Install them via pip:
    \`\`\`bash
    pip install requests msal pandas aiohttp nest_asyncio
    \`\`\`
* An Azure Active Directory (Azure AD) application registration with:
    * Client ID
    * Tenant ID
    * A generated Client Secret
    * The following Microsoft Graph API **Application Permissions** (admin consent granted):
        * \`Group.Read.All\` (to list Teams)
        * \`Sites.Read.All\` (to access drive storage information)

**Security Note:** Securely manage your \`client_secret\`. Avoid hardcoding it in scripts for production environments. Consider using an environment variable.

## Python Script Walkthrough

### Part 1: Authentication with MSAL

We use the Microsoft Authentication Library (MSAL) for Python to obtain an access token for the Graph API. The token is good for an hour. Plenty of time for what we are doing here. I like to put into function anyway, you don't know when you will need it again.  Which is the whole point of functions, right?

\`\`\`python
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
\`\`\`

The update_headers function handles token acquisition.



### Part 2: Fetching All Microsoft Teams
Teams are Microsoft 365 Groups with a 'Team' resource. We query the Graph API for these groups. We will run this synchonously it returs the list relatively quickly in about 3 seconds.

\`\`\`python
teams_url = "https://graph.microsoft.com/v1.0/groups?$filter=resourceProvisioningOptions/Any(x:x eq 'Team')&$select=id,displayName"

print("\\nFetching list of all Teams...")
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

print(f"\\nFound {df_unique_teams.shape[0]} unique Teams.")
print(f"Time to fetch Teams list: {elapsed_fetch_teams_time:.2f} seconds")

team_ids_list = df_unique_teams['id'].tolist()
team_names_list = df_unique_teams['displayName'].tolist()
\`\`\`

After running this code, you'll get a list of teams like this, we really only need the id, but the displayName is nice to have and shows us right away that one of the names is repeated, but has a different id.  This is a good example of why you should always check for duplicates when working with data.  Seems like a strong hint, but I think we all already know who is responsible::
\`\`\`python
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
\`\`\`
## Part 3: Fetching Drive Storage (Synchronous Method)
This initial approach fetches storage information for each Team sequentially. It can be slow, especially if you have a large number of teams.  

\`\`\`python
print("\\nFetching drive storage for each team (Synchronous approach)...")
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
    print(f"\\nSynchronous fetching processed {len(space_teams_sync_df)} team drives.")
else:
    print("\\nNo drive data fetched synchronously.")
    space_teams_sync_df = pd.DataFrame()

sync_end_time = time.time()
sync_elapsed_time = sync_end_time - sync_start_time
print(f"Execution time for synchronous drive fetching: {sync_elapsed_time:.2f} seconds")
# print(space_teams_sync_df.head() if not space_teams_sync_df.empty else "No sync data to show.")
\`\`\`

## Part 4: Asynchronous Data Fetching with aiohttp
To improve performance, we use aiohttp and asyncio for concurrent API calls.
nest_asyncio is only neccesary if you are running this in a jupyter notebook. 
You might not even need this if you are running jupyter 7.  
\`\`\`python
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

print("\\nFetching drive storage for each team (Asynchronous approach)...")
current_headers = update_headers(msal_app, msal_scope) # Refresh token

async_start_time = time.time()
space_teams_async_df = asyncio.run(main_async_fetch(team_ids_list, team_names_list, current_headers))
async_end_time = time.time()
async_elapsed_time = async_end_time - async_start_time

print(f"\\nAsynchronous fetching complete.")
print(f"Execution time for asynchronous drive fetching: {async_elapsed_time:.2f} seconds")
# print(space_teams_async_df.head() if not space_teams_async_df.empty else "No async data to show.")
\`\`\`

# Synchronous approach results:
Synchronous fetching processed 535 team drives.
Data shape: (535, 10)
Execution time for synchronous drive fetching: 186.42 seconds

# Asynchronous approach results:
Asynchronous fetching complete.
Data shape: (535, 10)
Execution time for asynchronous drive fetching: 2.94 seconds

So there you go, the async approach returns the same data, just more than 60 times faster.  We didn't dive into the data this time, so I will tell you it was the Library that was using the most space.  I almost feel bad for thinking it was Slytetherin, lazy thinking on my part.`, "src/content/blog/2024-07-10-All-the-Teams-Storage.md", "634773522603942a", { html: 121, metadata: 122 }, `<p>I usually have a hard time learning something when the information is completely abstract I much prefer a practical application. I don’t want to expose the internal workings of any of my clients. So this is something I have run, with ‘fictitious’ data. In this case we are going to use the example of a school. We’ll compare synchronous and async code in the Microsoft Graph API to get a list of all the teams in the organization and then get the storage usage for each team.  The school has run out out of data and needs to find out how much space is being used by each team.</p>
<h2 id="prerequisites">Prerequisites</h2>
<p>Before starting, ensure you have the following:</p>
<ul>
<li>Python 3.7+</li>
<li>The following Python libraries: <code>requests</code>, <code>msal</code>, <code>pandas</code>, <code>aiohttp</code>, <code>nest_asyncio</code>. Install them via pip:
<pre class="astro-code github-dark" style="background-color:#24292e;color:#e1e4e8; overflow-x: auto;" tabindex="0" data-language="bash"><code><span class="line"><span style="color:#B392F0">pip</span><span style="color:#9ECBFF"> install</span><span style="color:#9ECBFF"> requests</span><span style="color:#9ECBFF"> msal</span><span style="color:#9ECBFF"> pandas</span><span style="color:#9ECBFF"> aiohttp</span><span style="color:#9ECBFF"> nest_asyncio</span></span></code></pre>
</li>
<li>An Azure Active Directory (Azure AD) application registration with:
<ul>
<li>Client ID</li>
<li>Tenant ID</li>
<li>A generated Client Secret</li>
<li>The following Microsoft Graph API <strong>Application Permissions</strong> (admin consent granted):
<ul>
<li><code>Group.Read.All</code> (to list Teams)</li>
<li><code>Sites.Read.All</code> (to access drive storage information)</li>
</ul>
</li>
</ul>
</li>
</ul>
<p><strong>Security Note:</strong> Securely manage your <code>client_secret</code>. Avoid hardcoding it in scripts for production environments. Consider using an environment variable.</p>
<h2 id="python-script-walkthrough">Python Script Walkthrough</h2>
<h3 id="part-1-authentication-with-msal">Part 1: Authentication with MSAL</h3>
<p>We use the Microsoft Authentication Library (MSAL) for Python to obtain an access token for the Graph API. The token is good for an hour. Plenty of time for what we are doing here. I like to put into function anyway, you don’t know when you will need it again.  Which is the whole point of functions, right?</p>
<pre class="astro-code github-dark" style="background-color:#24292e;color:#e1e4e8; overflow-x: auto;" tabindex="0" data-language="python"><code><span class="line"><span style="color:#F97583">import</span><span style="color:#E1E4E8"> json</span></span>
<span class="line"><span style="color:#F97583">import</span><span style="color:#E1E4E8"> requests</span></span>
<span class="line"><span style="color:#F97583">from</span><span style="color:#E1E4E8"> msal </span><span style="color:#F97583">import</span><span style="color:#E1E4E8"> ConfidentialClientApplication</span></span>
<span class="line"><span style="color:#F97583">import</span><span style="color:#E1E4E8"> pandas </span><span style="color:#F97583">as</span><span style="color:#E1E4E8"> pd</span></span>
<span class="line"><span style="color:#F97583">from</span><span style="color:#E1E4E8"> datetime </span><span style="color:#F97583">import</span><span style="color:#E1E4E8"> datetime, timedelta</span></span>
<span class="line"><span style="color:#F97583">import</span><span style="color:#E1E4E8"> time</span></span>
<span class="line"><span style="color:#F97583">from</span><span style="color:#E1E4E8"> time </span><span style="color:#F97583">import</span><span style="color:#E1E4E8"> sleep  </span><span style="color:#6A737D"># Optional for deliberate delays</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D"># --- Credentials - Replace with your actual values ---</span></span>
<span class="line"><span style="color:#E1E4E8">client_id </span><span style="color:#F97583">=</span><span style="color:#9ECBFF"> 'YOUR_CLIENT_ID'</span></span>
<span class="line"><span style="color:#E1E4E8">tenant_id </span><span style="color:#F97583">=</span><span style="color:#9ECBFF"> 'YOUR_TENANT_ID'</span></span>
<span class="line"><span style="color:#E1E4E8">client_secret </span><span style="color:#F97583">=</span><span style="color:#9ECBFF"> 'YOUR_CLIENT_SECRET'</span></span>
<span class="line"><span style="color:#6A737D"># --- End Credentials ---</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">msal_authority </span><span style="color:#F97583">=</span><span style="color:#F97583"> f</span><span style="color:#9ECBFF">"https://login.microsoftonline.com/</span><span style="color:#79B8FF">{</span><span style="color:#E1E4E8">tenant_id</span><span style="color:#79B8FF">}</span><span style="color:#9ECBFF">"</span></span>
<span class="line"><span style="color:#E1E4E8">msal_scope </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> [</span><span style="color:#9ECBFF">"https://graph.microsoft.com/.default"</span><span style="color:#E1E4E8">]</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">msal_app </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> ConfidentialClientApplication(</span></span>
<span class="line"><span style="color:#FFAB70">    client_id</span><span style="color:#F97583">=</span><span style="color:#E1E4E8">client_id,</span></span>
<span class="line"><span style="color:#FFAB70">    client_credential</span><span style="color:#F97583">=</span><span style="color:#E1E4E8">client_secret,</span></span>
<span class="line"><span style="color:#FFAB70">    authority</span><span style="color:#F97583">=</span><span style="color:#E1E4E8">msal_authority,</span></span>
<span class="line"><span style="color:#E1E4E8">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">def</span><span style="color:#B392F0"> update_headers</span><span style="color:#E1E4E8">(current_msal_app, current_msal_scope):</span></span>
<span class="line"><span style="color:#9ECBFF">    """Acquires a Graph API token and returns request headers."""</span></span>
<span class="line"><span style="color:#E1E4E8">    result </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> current_msal_app.acquire_token_silent(</span></span>
<span class="line"><span style="color:#FFAB70">        scopes</span><span style="color:#F97583">=</span><span style="color:#E1E4E8">current_msal_scope,</span></span>
<span class="line"><span style="color:#FFAB70">        account</span><span style="color:#F97583">=</span><span style="color:#79B8FF">None</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">    )</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">    if</span><span style="color:#F97583"> not</span><span style="color:#E1E4E8"> result:</span></span>
<span class="line"><span style="color:#6A737D">        # print("No token in cache, acquiring new token for client...") # Optional logging</span></span>
<span class="line"><span style="color:#E1E4E8">        result </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> current_msal_app.acquire_token_for_client(</span><span style="color:#FFAB70">scopes</span><span style="color:#F97583">=</span><span style="color:#E1E4E8">current_msal_scope)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">    if</span><span style="color:#9ECBFF"> "access_token"</span><span style="color:#F97583"> in</span><span style="color:#E1E4E8"> result:</span></span>
<span class="line"><span style="color:#E1E4E8">        access_token </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> result[</span><span style="color:#9ECBFF">"access_token"</span><span style="color:#E1E4E8">]</span></span>
<span class="line"><span style="color:#6A737D">        # print('Token acquired successfully.') # Optional logging</span></span>
<span class="line"><span style="color:#E1E4E8">        headers </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#9ECBFF">            "Authorization"</span><span style="color:#E1E4E8">: </span><span style="color:#F97583">f</span><span style="color:#9ECBFF">"Bearer </span><span style="color:#79B8FF">{</span><span style="color:#E1E4E8">access_token</span><span style="color:#79B8FF">}</span><span style="color:#9ECBFF">"</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#9ECBFF">            "Content-Type"</span><span style="color:#E1E4E8">: </span><span style="color:#9ECBFF">"application/json"</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">        }</span></span>
<span class="line"><span style="color:#F97583">        return</span><span style="color:#E1E4E8"> headers</span></span>
<span class="line"><span style="color:#F97583">    else</span><span style="color:#E1E4E8">:</span></span>
<span class="line"><span style="color:#E1E4E8">        error_description </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> result.get(</span><span style="color:#9ECBFF">"error_description"</span><span style="color:#E1E4E8">, </span><span style="color:#9ECBFF">"No error description provided."</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#79B8FF">        print</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">f</span><span style="color:#9ECBFF">"Error acquiring token: </span><span style="color:#79B8FF">{</span><span style="color:#E1E4E8">error_description</span><span style="color:#79B8FF">}</span><span style="color:#9ECBFF">"</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#F97583">        raise</span><span style="color:#79B8FF"> Exception</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"No Access Token found or error in acquiring token."</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#E1E4E8">headers </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> update_headers(msal_app, msal_scope)</span></span></code></pre>
<p>The update_headers function handles token acquisition.</p>
<h3 id="part-2-fetching-all-microsoft-teams">Part 2: Fetching All Microsoft Teams</h3>
<p>Teams are Microsoft 365 Groups with a ‘Team’ resource. We query the Graph API for these groups. We will run this synchonously it returs the list relatively quickly in about 3 seconds.</p>
<pre class="astro-code github-dark" style="background-color:#24292e;color:#e1e4e8; overflow-x: auto;" tabindex="0" data-language="python"><code><span class="line"><span style="color:#E1E4E8">teams_url </span><span style="color:#F97583">=</span><span style="color:#9ECBFF"> "https://graph.microsoft.com/v1.0/groups?$filter=resourceProvisioningOptions/Any(x:x eq 'Team')&#x26;$select=id,displayName"</span></span>
<span class="line"></span>
<span class="line"><span style="color:#79B8FF">print</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"</span><span style="color:#79B8FF">\\n</span><span style="color:#9ECBFF">Fetching list of all Teams..."</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#E1E4E8">start_fetch_teams_time </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> time.time()</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">all_teams_list </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> []</span></span>
<span class="line"><span style="color:#E1E4E8">current_url </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> teams_url</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">while</span><span style="color:#E1E4E8"> current_url:</span></span>
<span class="line"><span style="color:#E1E4E8">    response </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> requests.get(current_url, </span><span style="color:#FFAB70">headers</span><span style="color:#F97583">=</span><span style="color:#E1E4E8">headers)</span></span>
<span class="line"><span style="color:#E1E4E8">    response.raise_for_status() </span></span>
<span class="line"><span style="color:#E1E4E8">    teams_data </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> response.json()</span></span>
<span class="line"><span style="color:#E1E4E8">    </span></span>
<span class="line"><span style="color:#E1E4E8">    all_teams_list.extend(teams_data[</span><span style="color:#9ECBFF">'value'</span><span style="color:#E1E4E8">])</span></span>
<span class="line"><span style="color:#E1E4E8">    current_url </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> teams_data.get(</span><span style="color:#9ECBFF">'@odata.nextLink'</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">None</span><span style="color:#E1E4E8">) </span></span>
<span class="line"><span style="color:#6A737D">    # if current_url: # Optional logging</span></span>
<span class="line"><span style="color:#6A737D">    #     print(f"Fetching next page of teams...")</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">df_teams </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> pd.DataFrame(all_teams_list)</span></span>
<span class="line"><span style="color:#E1E4E8">df_unique_teams </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> df_teams.drop_duplicates(</span><span style="color:#FFAB70">subset</span><span style="color:#F97583">=</span><span style="color:#E1E4E8">[</span><span style="color:#9ECBFF">'id'</span><span style="color:#E1E4E8">], </span><span style="color:#FFAB70">keep</span><span style="color:#F97583">=</span><span style="color:#9ECBFF">'first'</span><span style="color:#E1E4E8">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">end_fetch_teams_time </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> time.time()</span></span>
<span class="line"><span style="color:#E1E4E8">elapsed_fetch_teams_time </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> end_fetch_teams_time </span><span style="color:#F97583">-</span><span style="color:#E1E4E8"> start_fetch_teams_time</span></span>
<span class="line"></span>
<span class="line"><span style="color:#79B8FF">print</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">f</span><span style="color:#9ECBFF">"</span><span style="color:#79B8FF">\\n</span><span style="color:#9ECBFF">Found </span><span style="color:#79B8FF">{</span><span style="color:#E1E4E8">df_unique_teams.shape[</span><span style="color:#79B8FF">0</span><span style="color:#E1E4E8">]</span><span style="color:#79B8FF">}</span><span style="color:#9ECBFF"> unique Teams."</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#79B8FF">print</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">f</span><span style="color:#9ECBFF">"Time to fetch Teams list: </span><span style="color:#79B8FF">{</span><span style="color:#E1E4E8">elapsed_fetch_teams_time</span><span style="color:#F97583">:.2f</span><span style="color:#79B8FF">}</span><span style="color:#9ECBFF"> seconds"</span><span style="color:#E1E4E8">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">team_ids_list </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> df_unique_teams[</span><span style="color:#9ECBFF">'id'</span><span style="color:#E1E4E8">].tolist()</span></span>
<span class="line"><span style="color:#E1E4E8">team_names_list </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> df_unique_teams[</span><span style="color:#9ECBFF">'displayName'</span><span style="color:#E1E4E8">].tolist()</span></span></code></pre>
<p>After running this code, you’ll get a list of teams like this, we really only need the id, but the displayName is nice to have and shows us right away that one of the names is repeated, but has a different id.  This is a good example of why you should always check for duplicates when working with data.  Seems like a strong hint, but I think we all already know who is responsible::</p>
<pre class="astro-code github-dark" style="background-color:#24292e;color:#e1e4e8; overflow-x: auto;" tabindex="0" data-language="python"><code><span class="line"><span style="color:#6A737D"># Example of teams data from Graph API:</span></span>
<span class="line"><span style="color:#E1E4E8">[</span></span>
<span class="line"><span style="color:#E1E4E8">    {</span><span style="color:#9ECBFF">'id'</span><span style="color:#E1E4E8">: </span><span style="color:#9ECBFF">'87w3uhq2ev99r123o5mwi55s6nqp2bk4zlwf'</span><span style="color:#E1E4E8">, </span><span style="color:#9ECBFF">'displayName'</span><span style="color:#E1E4E8">: </span><span style="color:#9ECBFF">'Shell Cottage'</span><span style="color:#E1E4E8">},</span></span>
<span class="line"><span style="color:#E1E4E8">    {</span><span style="color:#9ECBFF">'id'</span><span style="color:#E1E4E8">: </span><span style="color:#9ECBFF">'qq9dqz35wgdq8yqjrn5wt4sqzzgpuihbbvas'</span><span style="color:#E1E4E8">, </span><span style="color:#9ECBFF">'displayName'</span><span style="color:#E1E4E8">: </span><span style="color:#9ECBFF">'The Gryffindor Common Room'</span><span style="color:#E1E4E8">},</span></span>
<span class="line"><span style="color:#E1E4E8">    {</span><span style="color:#9ECBFF">'id'</span><span style="color:#E1E4E8">: </span><span style="color:#9ECBFF">'ly09hvq87rvxh0n1rxh83d2vnaraqy7zpxuu'</span><span style="color:#E1E4E8">, </span><span style="color:#9ECBFF">'displayName'</span><span style="color:#E1E4E8">: </span><span style="color:#9ECBFF">'Hufflepuff House'</span><span style="color:#E1E4E8">},</span></span>
<span class="line"><span style="color:#E1E4E8">    {</span><span style="color:#9ECBFF">'id'</span><span style="color:#E1E4E8">: </span><span style="color:#9ECBFF">'38tcpukusneqdhnwconcflwt2dqsgiobrbj4'</span><span style="color:#E1E4E8">, </span><span style="color:#9ECBFF">'displayName'</span><span style="color:#E1E4E8">: </span><span style="color:#9ECBFF">'The Black Lake'</span><span style="color:#E1E4E8">},</span></span>
<span class="line"><span style="color:#E1E4E8">    {</span><span style="color:#9ECBFF">'id'</span><span style="color:#E1E4E8">: </span><span style="color:#9ECBFF">'tsafap1hyai38knuc3p8sgmzafdt7pqq1o9u'</span><span style="color:#E1E4E8">, </span><span style="color:#9ECBFF">'displayName'</span><span style="color:#E1E4E8">: </span><span style="color:#9ECBFF">'The Dungeons'</span><span style="color:#E1E4E8">},</span></span>
<span class="line"><span style="color:#E1E4E8">    {</span><span style="color:#9ECBFF">'id'</span><span style="color:#E1E4E8">: </span><span style="color:#9ECBFF">'z98u31nua35b499cbqi8hy3gzyytad4z9mxb'</span><span style="color:#E1E4E8">, </span><span style="color:#9ECBFF">'displayName'</span><span style="color:#E1E4E8">: </span><span style="color:#9ECBFF">'The Library'</span><span style="color:#E1E4E8">},</span></span>
<span class="line"><span style="color:#E1E4E8">    {</span><span style="color:#9ECBFF">'id'</span><span style="color:#E1E4E8">: </span><span style="color:#9ECBFF">'s50u5ipnrukdp4pnrgk0g1fk4bpq0mzkpmms'</span><span style="color:#E1E4E8">, </span><span style="color:#9ECBFF">'displayName'</span><span style="color:#E1E4E8">: </span><span style="color:#9ECBFF">'Azkaban Prison'</span><span style="color:#E1E4E8">},</span></span>
<span class="line"><span style="color:#E1E4E8">    {</span><span style="color:#9ECBFF">'id'</span><span style="color:#E1E4E8">: </span><span style="color:#9ECBFF">'dsos1aq9517gwnavr0c8miz5xrzhc9iq4jce'</span><span style="color:#E1E4E8">, </span><span style="color:#9ECBFF">'displayName'</span><span style="color:#E1E4E8">: </span><span style="color:#9ECBFF">'The Library'</span><span style="color:#E1E4E8">},</span></span>
<span class="line"><span style="color:#E1E4E8">    {</span><span style="color:#9ECBFF">'id'</span><span style="color:#E1E4E8">: </span><span style="color:#9ECBFF">'usrpwr65bj18zmrk8hqqmyaryglyop8dh0x6'</span><span style="color:#E1E4E8">, </span><span style="color:#9ECBFF">'displayName'</span><span style="color:#E1E4E8">: </span><span style="color:#9ECBFF">'The Hufflepuff Common Room'</span><span style="color:#E1E4E8">},</span></span>
<span class="line"><span style="color:#E1E4E8">    {</span><span style="color:#9ECBFF">'id'</span><span style="color:#E1E4E8">: </span><span style="color:#9ECBFF">'no12n4fddxtoq5sddz7c0ej0q35nctjreyv7'</span><span style="color:#E1E4E8">, </span><span style="color:#9ECBFF">'displayName'</span><span style="color:#E1E4E8">: </span><span style="color:#9ECBFF">"St. Mungo's Hospital"</span><span style="color:#E1E4E8">}</span></span>
<span class="line"><span style="color:#E1E4E8">]</span></span></code></pre>
<h2 id="part-3-fetching-drive-storage-synchronous-method">Part 3: Fetching Drive Storage (Synchronous Method)</h2>
<p>This initial approach fetches storage information for each Team sequentially. It can be slow, especially if you have a large number of teams.</p>
<pre class="astro-code github-dark" style="background-color:#24292e;color:#e1e4e8; overflow-x: auto;" tabindex="0" data-language="python"><code><span class="line"><span style="color:#79B8FF">print</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"</span><span style="color:#79B8FF">\\n</span><span style="color:#9ECBFF">Fetching drive storage for each team (Synchronous approach)..."</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#E1E4E8">sync_start_time </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> time.time()</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">all_teams_drive_data_sync </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> []</span></span>
<span class="line"><span style="color:#6A737D"># Consider token refresh strategy for very long running synchronous operations.</span></span>
<span class="line"><span style="color:#6A737D"># headers = update_headers(msal_app, msal_scope) </span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">for</span><span style="color:#E1E4E8"> i, teamid </span><span style="color:#F97583">in</span><span style="color:#79B8FF"> enumerate</span><span style="color:#E1E4E8">(team_ids_list):</span></span>
<span class="line"><span style="color:#F97583">    if</span><span style="color:#E1E4E8"> i </span><span style="color:#F97583">></span><span style="color:#79B8FF"> 0</span><span style="color:#F97583"> and</span><span style="color:#E1E4E8"> i </span><span style="color:#F97583">%</span><span style="color:#79B8FF"> 50</span><span style="color:#F97583"> ==</span><span style="color:#79B8FF"> 0</span><span style="color:#E1E4E8">: </span><span style="color:#6A737D"># Progress indicator, skip first</span></span>
<span class="line"><span style="color:#79B8FF">        print</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">f</span><span style="color:#9ECBFF">"Processing team </span><span style="color:#79B8FF">{</span><span style="color:#E1E4E8">i</span><span style="color:#F97583">+</span><span style="color:#79B8FF">1}</span><span style="color:#9ECBFF">/</span><span style="color:#79B8FF">{len</span><span style="color:#E1E4E8">(team_ids_list)</span><span style="color:#79B8FF">}</span><span style="color:#9ECBFF">: </span><span style="color:#79B8FF">{</span><span style="color:#E1E4E8">team_names_list[i]</span><span style="color:#79B8FF">}</span><span style="color:#9ECBFF">"</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#E1E4E8">    </span></span>
<span class="line"><span style="color:#E1E4E8">    drive_url </span><span style="color:#F97583">=</span><span style="color:#F97583"> f</span><span style="color:#9ECBFF">'https://graph.microsoft.com/v1.0/groups/</span><span style="color:#79B8FF">{</span><span style="color:#E1E4E8">teamid</span><span style="color:#79B8FF">}</span><span style="color:#9ECBFF">/drive'</span></span>
<span class="line"><span style="color:#E1E4E8">    </span></span>
<span class="line"><span style="color:#F97583">    try</span><span style="color:#E1E4E8">:</span></span>
<span class="line"><span style="color:#E1E4E8">        response </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> requests.get(drive_url, </span><span style="color:#FFAB70">headers</span><span style="color:#F97583">=</span><span style="color:#E1E4E8">headers)</span></span>
<span class="line"><span style="color:#E1E4E8">        response.raise_for_status()</span></span>
<span class="line"><span style="color:#E1E4E8">        drive_info </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> response.json()</span></span>
<span class="line"><span style="color:#E1E4E8">        </span></span>
<span class="line"><span style="color:#E1E4E8">        team_frame </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> pd.json_normalize(drive_info)</span></span>
<span class="line"><span style="color:#E1E4E8">        team_frame[</span><span style="color:#9ECBFF">'team_id'</span><span style="color:#E1E4E8">] </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> teamid</span></span>
<span class="line"><span style="color:#E1E4E8">        team_frame[</span><span style="color:#9ECBFF">'teamName'</span><span style="color:#E1E4E8">] </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> team_names_list[i]</span></span>
<span class="line"><span style="color:#E1E4E8">        all_teams_drive_data_sync.append(team_frame)</span></span>
<span class="line"><span style="color:#F97583">    except</span><span style="color:#E1E4E8"> requests.exceptions.HTTPError </span><span style="color:#F97583">as</span><span style="color:#E1E4E8"> e:</span></span>
<span class="line"><span style="color:#79B8FF">        print</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">f</span><span style="color:#9ECBFF">"Error fetching drive for team ID </span><span style="color:#79B8FF">{</span><span style="color:#E1E4E8">teamid</span><span style="color:#79B8FF">}</span><span style="color:#9ECBFF"> (</span><span style="color:#79B8FF">{</span><span style="color:#E1E4E8">team_names_list[i]</span><span style="color:#79B8FF">}</span><span style="color:#9ECBFF">): </span><span style="color:#79B8FF">{</span><span style="color:#E1E4E8">e.response.status_code</span><span style="color:#79B8FF">}</span><span style="color:#9ECBFF">"</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#F97583">    except</span><span style="color:#E1E4E8"> json.JSONDecodeError:</span></span>
<span class="line"><span style="color:#79B8FF">        print</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">f</span><span style="color:#9ECBFF">"Error decoding JSON for team ID </span><span style="color:#79B8FF">{</span><span style="color:#E1E4E8">teamid</span><span style="color:#79B8FF">}</span><span style="color:#9ECBFF"> (</span><span style="color:#79B8FF">{</span><span style="color:#E1E4E8">team_names_list[i]</span><span style="color:#79B8FF">}</span><span style="color:#9ECBFF">)"</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#F97583">    except</span><span style="color:#79B8FF"> Exception</span><span style="color:#F97583"> as</span><span style="color:#E1E4E8"> e:</span></span>
<span class="line"><span style="color:#79B8FF">        print</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">f</span><span style="color:#9ECBFF">"An unexpected error for team ID </span><span style="color:#79B8FF">{</span><span style="color:#E1E4E8">teamid</span><span style="color:#79B8FF">}</span><span style="color:#9ECBFF"> (</span><span style="color:#79B8FF">{</span><span style="color:#E1E4E8">team_names_list[i]</span><span style="color:#79B8FF">}</span><span style="color:#9ECBFF">): </span><span style="color:#79B8FF">{</span><span style="color:#E1E4E8">e</span><span style="color:#79B8FF">}</span><span style="color:#9ECBFF">"</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#E1E4E8">    </span></span>
<span class="line"><span style="color:#6A737D">    # time.sleep(0.05) # Optional small delay for very basic throttling avoidance</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">if</span><span style="color:#E1E4E8"> all_teams_drive_data_sync:</span></span>
<span class="line"><span style="color:#E1E4E8">    space_teams_sync_df </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> pd.coI didn</span><span style="color:#9ECBFF">'t dive into thencat(all_teams_drive_data_sync, ignore_index=True)</span></span>
<span class="line"><span style="color:#79B8FF">    print</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">f</span><span style="color:#9ECBFF">"</span><span style="color:#79B8FF">\\n</span><span style="color:#9ECBFF">Synchronous fetching processed </span><span style="color:#79B8FF">{len</span><span style="color:#E1E4E8">(space_teams_sync_df)</span><span style="color:#79B8FF">}</span><span style="color:#9ECBFF"> team drives."</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#F97583">else</span><span style="color:#E1E4E8">:</span></span>
<span class="line"><span style="color:#79B8FF">    print</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"</span><span style="color:#79B8FF">\\n</span><span style="color:#9ECBFF">No drive data fetched synchronously."</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#E1E4E8">    space_teams_sync_df </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> pd.DataFrame()</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">sync_end_time </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> time.time()</span></span>
<span class="line"><span style="color:#E1E4E8">sync_elapsed_time </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> sync_end_time </span><span style="color:#F97583">-</span><span style="color:#E1E4E8"> sync_start_time</span></span>
<span class="line"><span style="color:#79B8FF">print</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">f</span><span style="color:#9ECBFF">"Execution time for synchronous drive fetching: </span><span style="color:#79B8FF">{</span><span style="color:#E1E4E8">sync_elapsed_time</span><span style="color:#F97583">:.2f</span><span style="color:#79B8FF">}</span><span style="color:#9ECBFF"> seconds"</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#6A737D"># print(space_teams_sync_df.head() if not space_teams_sync_df.empty else "No sync data to show.")</span></span></code></pre>
<h2 id="part-4-asynchronous-data-fetching-with-aiohttp">Part 4: Asynchronous Data Fetching with aiohttp</h2>
<p>To improve performance, we use aiohttp and asyncio for concurrent API calls.
nest_asyncio is only neccesary if you are running this in a jupyter notebook.
You might not even need this if you are running jupyter 7.</p>
<pre class="astro-code github-dark" style="background-color:#24292e;color:#e1e4e8; overflow-x: auto;" tabindex="0" data-language="python"><code><span class="line"><span style="color:#F97583">import</span><span style="color:#E1E4E8"> asyncio</span></span>
<span class="line"><span style="color:#F97583">import</span><span style="color:#E1E4E8"> aiohttp</span></span>
<span class="line"><span style="color:#F97583">import</span><span style="color:#E1E4E8"> nest_asyncio </span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">nest_asyncio.apply() </span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">async</span><span style="color:#F97583"> def</span><span style="color:#B392F0"> fetch_drive_async</span><span style="color:#E1E4E8">(session, teamid, team_name, auth_headers):</span></span>
<span class="line"><span style="color:#9ECBFF">    """Asynchronously fetches drive information for a single team."""</span></span>
<span class="line"><span style="color:#E1E4E8">    drive_url </span><span style="color:#F97583">=</span><span style="color:#F97583"> f</span><span style="color:#9ECBFF">'https://graph.microsoft.com/v1.0/groups/</span><span style="color:#79B8FF">{</span><span style="color:#E1E4E8">teamid</span><span style="color:#79B8FF">}</span><span style="color:#9ECBFF">/drive'</span></span>
<span class="line"><span style="color:#F97583">    try</span><span style="color:#E1E4E8">:</span></span>
<span class="line"><span style="color:#F97583">        async</span><span style="color:#F97583"> with</span><span style="color:#E1E4E8"> session.get(drive_url, </span><span style="color:#FFAB70">headers</span><span style="color:#F97583">=</span><span style="color:#E1E4E8">auth_headers) </span><span style="color:#F97583">as</span><span style="color:#E1E4E8"> response:</span></span>
<span class="line"><span style="color:#F97583">            if</span><span style="color:#E1E4E8"> response.status </span><span style="color:#F97583">==</span><span style="color:#79B8FF"> 200</span><span style="color:#E1E4E8">:</span></span>
<span class="line"><span style="color:#E1E4E8">                data </span><span style="color:#F97583">=</span><span style="color:#F97583"> await</span><span style="color:#E1E4E8"> response.json()</span></span>
<span class="line"><span style="color:#F97583">                if</span><span style="color:#9ECBFF"> 'quota'</span><span style="color:#F97583"> in</span><span style="color:#E1E4E8"> data </span><span style="color:#F97583">and</span><span style="color:#9ECBFF"> 'used'</span><span style="color:#F97583"> in</span><span style="color:#E1E4E8"> data[</span><span style="color:#9ECBFF">'quota'</span><span style="color:#E1E4E8">]:</span></span>
<span class="line"><span style="color:#E1E4E8">                    team_frame </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> pd.json_normalize(data)</span></span>
<span class="line"><span style="color:#E1E4E8">                    team_frame[</span><span style="color:#9ECBFF">'team_id'</span><span style="color:#E1E4E8">] </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> teamid</span></span>
<span class="line"><span style="color:#E1E4E8">                    team_frame[</span><span style="color:#9ECBFF">'teamName'</span><span style="color:#E1E4E8">] </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> team_name</span></span>
<span class="line"><span style="color:#F97583">                    return</span><span style="color:#E1E4E8"> team_frame</span></span>
<span class="line"><span style="color:#F97583">                else</span><span style="color:#E1E4E8">:</span></span>
<span class="line"><span style="color:#6A737D">                    # print(f"Warning: 'quota.used' not found for team {team_name} ({teamid}).") # Optional</span></span>
<span class="line"><span style="color:#F97583">                    return</span><span style="color:#E1E4E8"> pd.DataFrame({</span><span style="color:#9ECBFF">'team_id'</span><span style="color:#E1E4E8">: [teamid], </span><span style="color:#9ECBFF">'teamName'</span><span style="color:#E1E4E8">: [team_name], </span><span style="color:#9ECBFF">'quota.used'</span><span style="color:#E1E4E8">: [</span><span style="color:#79B8FF">None</span><span style="color:#E1E4E8">], </span><span style="color:#9ECBFF">'error_detail'</span><span style="color:#E1E4E8">: [</span><span style="color:#9ECBFF">'Missing quota info'</span><span style="color:#E1E4E8">]})</span></span>
<span class="line"><span style="color:#F97583">            else</span><span style="color:#E1E4E8">:</span></span>
<span class="line"><span style="color:#6A737D">                # print(f"Error (async) for team {team_name} ({teamid}): {response.status}") # Optional</span></span>
<span class="line"><span style="color:#F97583">                return</span><span style="color:#E1E4E8"> pd.DataFrame({</span><span style="color:#9ECBFF">'team_id'</span><span style="color:#E1E4E8">: [teamid], </span><span style="color:#9ECBFF">'teamName'</span><span style="color:#E1E4E8">: [team_name], </span><span style="color:#9ECBFF">'error_status'</span><span style="color:#E1E4E8">: [response.status]})</span></span>
<span class="line"><span style="color:#F97583">    except</span><span style="color:#79B8FF"> Exception</span><span style="color:#F97583"> as</span><span style="color:#E1E4E8"> e:</span></span>
<span class="line"><span style="color:#6A737D">        # print(f"Exception (async) for team {team_name} ({teamid}): {e}") # Optional</span></span>
<span class="line"><span style="color:#F97583">        return</span><span style="color:#E1E4E8"> pd.DataFrame({</span><span style="color:#9ECBFF">'team_id'</span><span style="color:#E1E4E8">: [teamid], </span><span style="color:#9ECBFF">'teamName'</span><span style="color:#E1E4E8">: [team_name], </span><span style="color:#9ECBFF">'exception'</span><span style="color:#E1E4E8">: [</span><span style="color:#79B8FF">str</span><span style="color:#E1E4E8">(e)]})</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">async</span><span style="color:#F97583"> def</span><span style="color:#B392F0"> main_async_fetch</span><span style="color:#E1E4E8">(team_ids, team_names_list_async, auth_headers):</span></span>
<span class="line"><span style="color:#9ECBFF">    """Main async function to gather drive information for all teams."""</span></span>
<span class="line"><span style="color:#E1E4E8">    all_teams_data </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> []</span></span>
<span class="line"><span style="color:#6A737D">    # For very large tenants, consider an asyncio.Semaphore to limit concurrency:</span></span>
<span class="line"><span style="color:#6A737D">    # sem = asyncio.Semaphore(10) # Limit to 10 concurrent requests</span></span>
<span class="line"><span style="color:#6A737D">    # async with sem:</span></span>
<span class="line"><span style="color:#6A737D">    #     tasks.append(fetch_drive_async(session, teamid, team_names_list_async[i], auth_headers))</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">    async</span><span style="color:#F97583"> with</span><span style="color:#E1E4E8"> aiohttp.ClientSession() </span><span style="color:#F97583">as</span><span style="color:#E1E4E8"> session:</span></span>
<span class="line"><span style="color:#E1E4E8">        tasks </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> []</span></span>
<span class="line"><span style="color:#F97583">        for</span><span style="color:#E1E4E8"> i, teamid </span><span style="color:#F97583">in</span><span style="color:#79B8FF"> enumerate</span><span style="color:#E1E4E8">(team_ids):</span></span>
<span class="line"><span style="color:#F97583">            if</span><span style="color:#E1E4E8"> i </span><span style="color:#F97583">></span><span style="color:#79B8FF"> 0</span><span style="color:#F97583"> and</span><span style="color:#E1E4E8"> i </span><span style="color:#F97583">%</span><span style="color:#79B8FF"> 50</span><span style="color:#F97583"> ==</span><span style="color:#79B8FF"> 0</span><span style="color:#E1E4E8">: </span><span style="color:#6A737D"># Progress indicator</span></span>
<span class="line"><span style="color:#79B8FF">                print</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">f</span><span style="color:#9ECBFF">"Queueing async fetch for team </span><span style="color:#79B8FF">{</span><span style="color:#E1E4E8">i</span><span style="color:#F97583">+</span><span style="color:#79B8FF">1}</span><span style="color:#9ECBFF">/</span><span style="color:#79B8FF">{len</span><span style="color:#E1E4E8">(team_ids)</span><span style="color:#79B8FF">}</span><span style="color:#9ECBFF">: </span><span style="color:#79B8FF">{</span><span style="color:#E1E4E8">team_names_list_async[i]</span><span style="color:#79B8FF">}</span><span style="color:#9ECBFF">"</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#E1E4E8">            tasks.append(fetch_drive_async(session, teamid, team_names_list_async[i], auth_headers))</span></span>
<span class="line"><span style="color:#E1E4E8">        </span></span>
<span class="line"><span style="color:#E1E4E8">        results </span><span style="color:#F97583">=</span><span style="color:#F97583"> await</span><span style="color:#E1E4E8"> asyncio.gather(</span><span style="color:#F97583">*</span><span style="color:#E1E4E8">tasks, </span><span style="color:#FFAB70">return_exceptions</span><span style="color:#F97583">=</span><span style="color:#79B8FF">True</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#E1E4E8">        </span></span>
<span class="line"><span style="color:#F97583">        for</span><span style="color:#E1E4E8"> res </span><span style="color:#F97583">in</span><span style="color:#E1E4E8"> results:</span></span>
<span class="line"><span style="color:#F97583">            if</span><span style="color:#79B8FF"> isinstance</span><span style="color:#E1E4E8">(res, pd.DataFrame):</span></span>
<span class="line"><span style="color:#E1E4E8">                all_teams_data.append(res)</span></span>
<span class="line"><span style="color:#F97583">            else</span><span style="color:#E1E4E8">: </span></span>
<span class="line"><span style="color:#79B8FF">                print</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">f</span><span style="color:#9ECBFF">"A task failed with exception: </span><span style="color:#79B8FF">{</span><span style="color:#E1E4E8">res</span><span style="color:#79B8FF">}</span><span style="color:#9ECBFF">"</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#E1E4E8">    </span></span>
<span class="line"><span style="color:#F97583">    return</span><span style="color:#E1E4E8"> pd.concat(all_teams_data, </span><span style="color:#FFAB70">ignore_index</span><span style="color:#F97583">=</span><span style="color:#79B8FF">True</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">if</span><span style="color:#E1E4E8"> all_teams_data </span><span style="color:#F97583">else</span><span style="color:#E1E4E8"> pd.DataFrame()</span></span>
<span class="line"></span>
<span class="line"><span style="color:#79B8FF">print</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"</span><span style="color:#79B8FF">\\n</span><span style="color:#9ECBFF">Fetching drive storage for each team (Asynchronous approach)..."</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#E1E4E8">current_headers </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> update_headers(msal_app, msal_scope) </span><span style="color:#6A737D"># Refresh token</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">async_start_time </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> time.time()</span></span>
<span class="line"><span style="color:#E1E4E8">space_teams_async_df </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> asyncio.run(main_async_fetch(team_ids_list, team_names_list, current_headers))</span></span>
<span class="line"><span style="color:#E1E4E8">async_end_time </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> time.time()</span></span>
<span class="line"><span style="color:#E1E4E8">async_elapsed_time </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> async_end_time </span><span style="color:#F97583">-</span><span style="color:#E1E4E8"> async_start_time</span></span>
<span class="line"></span>
<span class="line"><span style="color:#79B8FF">print</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">f</span><span style="color:#9ECBFF">"</span><span style="color:#79B8FF">\\n</span><span style="color:#9ECBFF">Asynchronous fetching complete."</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#79B8FF">print</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">f</span><span style="color:#9ECBFF">"Execution time for asynchronous drive fetching: </span><span style="color:#79B8FF">{</span><span style="color:#E1E4E8">async_elapsed_time</span><span style="color:#F97583">:.2f</span><span style="color:#79B8FF">}</span><span style="color:#9ECBFF"> seconds"</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#6A737D"># print(space_teams_async_df.head() if not space_teams_async_df.empty else "No async data to show.")</span></span></code></pre>
<h1 id="synchronous-approach-results">Synchronous approach results:</h1>
<p>Synchronous fetching processed 535 team drives.
Data shape: (535, 10)
Execution time for synchronous drive fetching: 186.42 seconds</p>
<h1 id="asynchronous-approach-results">Asynchronous approach results:</h1>
<p>Asynchronous fetching complete.
Data shape: (535, 10)
Execution time for asynchronous drive fetching: 2.94 seconds</p>
<p>So there you go, the async approach returns the same data, just more than 60 times faster.  We didn’t dive into the data this time, so I will tell you it was the Library that was using the most space.  I almost feel bad for thinking it was Slytetherin, lazy thinking on my part.</p>`, { headings: 123, localImagePaths: 148, remoteImagePaths: 149, frontmatter: 150, imagePaths: 154 }, [124, 127, 130, 133, 136, 139, 142, 145], { depth: 53, slug: 125, text: 126 }, "prerequisites", "Prerequisites", { depth: 53, slug: 128, text: 129 }, "python-script-walkthrough", "Python Script Walkthrough", { depth: 37, slug: 131, text: 132 }, "part-1-authentication-with-msal", "Part 1: Authentication with MSAL", { depth: 37, slug: 134, text: 135 }, "part-2-fetching-all-microsoft-teams", "Part 2: Fetching All Microsoft Teams", { depth: 53, slug: 137, text: 138 }, "part-3-fetching-drive-storage-synchronous-method", "Part 3: Fetching Drive Storage (Synchronous Method)", { depth: 53, slug: 140, text: 141 }, "part-4-asynchronous-data-fetching-with-aiohttp", "Part 4: Asynchronous Data Fetching with aiohttp", { depth: 33, slug: 143, text: 144 }, "synchronous-approach-results", "Synchronous approach results:", { depth: 33, slug: 146, text: 147 }, "asynchronous-approach-results", "Asynchronous approach results:", [], [], { title: 108, categories: 151, tags: 152, pubDate: 153, description: 109 }, [82, 116], [21, 112, 113, 114], "2024-07-10 12:00:00 -0400", [], "2024-07-10-All-the-Teams-Storage.md", "2024-07-18-if-you-have-to", { id: 156, data: 158, body: 166, filePath: 167, digest: 168, rendered: 169, legacyId: 186 }, { title: 159, description: 160, pubDate: 161, tags: 162, categories: 165 }, "If You Have To Use Excel, Automate It: Formatting with Python", "A post about If You Have To Use Excel, Automate It: Formatting with Python.", ["Date", "2024-07-18T16:00:00.000Z"], [21, 19, 163, 164, 79], "pandas", "xlsxwriter", [82, 24], "Sometimes people need to download some data, format it in Excel, and distribute it. And they have to do this every day, and you look at it and think \"I bet I could automate that.\" And you are right!  You could automate it and make someone's life a lot easier. Don't be a slacker, help them out. \n\n## How it Works\n\nAfter writing a Pandas DataFrame to an Excel sheet using `df.to_excel(writer, ...)`, you can access XlsxWriter's workbook and worksheet objects. The library has a ton of formatting options I am not even touching here. If you want to review them all, check out the [XlsxWriter documentation](https://xlsxwriter.readthedocs.io/).\n\nLet's walk through a Python script that uses Pandas and XlsxWriter to create a well-formatted Excel report from a DataFrame (df1).\n\n```python\nimport pandas as pd\n# Assume df1 is a pre-existing Pandas DataFrame\n# For example:\n# data = {'ColA': [1, 2, 3], 'ColB': ['X', 'Y', 'Z'], 'ColC': [10.1, 20.2, 30.3], 'ColD': [True, False, True]}\n# df1 = pd.DataFrame(data)\n\n# 1. Initialize ExcelWriter with XlsxWriter engine\nwriter = pd.ExcelWriter('formatted_report.xlsx', engine='xlsxwriter')\n\n# 2. Write DataFrame to a sheet\n# index=False prevents writing the DataFrame index as a column in Excel\ndf1.to_excel(writer, sheet_name='Sheet1', index=False)\n\n# 3. Access XlsxWriter workbook and worksheet objects\nworkbook = writer.book\nworksheet = writer.sheets['Sheet1']\n\n# 4. Format the Header Row\n# Define a format for the header cells\nheader_format = workbook.add_format({\n    'bold': True,\n    'italic': True,\n    'underline': True,\n    'font_size': 13,\n    'bottom': 2,    # Medium border\n    'top': 2,       # Medium border\n    'left': 2,      # Medium border\n    'right': 2,     # Medium border\n    'align': 'center',\n    'valign': 'vcenter',\n    'bg_color': '#DDEBF7' # A light blue background\n})\n# Apply the format to the header row (rewriting what Pandas initially wrote)\nfor col_num, value in enumerate(df1.columns.values):\n    worksheet.write(0, col_num, value, header_format)\n\n# 5. Define Formats for Data Cells\n# General format for data cells (thin borders on all sides)\nformat1_all_borders = workbook.add_format({\n    'bottom': 1, 'top': 1, 'left': 1, 'right': 1\n})\n\n# Specific format for the first row of data (medium top border, thin other borders)\nformat2_first_data_row = workbook.add_format({\n    'top': 2,    # Medium top border\n    'bottom': 1, # Thin bottom border\n    'right': 1,  # Thin right border\n    'left': 1    # Thin left border\n})\n\n# 6. Apply Conditional Formatting to Data Cells\n# This applies 'format2_first_data_row' to the first row of data (row index 1)\n# It checks if cells are not blank (criteria: '>=', value: '\"\"' effectively means not blank for text/numbers)\nif len(df1) > 0: # Ensure there is at least one data row\n    worksheet.conditional_format(1, 0, 1, df1.shape[1] - 1, {\n        'type': 'cell',\n        'criteria': '>=', # Applies to cells with any content (numbers or text)\n        'value': '\"\"',    # Compares against an empty string\n        'format': format2_first_data_row\n    })\n\n    # Apply 'format1_all_borders' to all data cells\n    worksheet.conditional_format(1, 0, df1.shape[0], df1.shape[1] - 1, {\n        'type': 'cell',\n        'criteria': '>=',\n        'value': '\"\"',\n        'format': format1_all_borders\n    })\n\n# 7. Add an Excel Table with AutoFilter and Style\nif len(df1) > 0:\n    column_settings = [{'header': column} for column in df1.columns.values]\n    worksheet.add_table(0, 0, df1.shape[0], df1.shape[1] - 1, {\n        'columns': column_settings, # Use DataFrame headers for the table\n        'autofilter': True,\n        'style': 'Table Style Light 1'\n    })\nelse: # Handle empty DataFrame: create table with only headers\n    column_settings = [{'header': column} for column in df1.columns.values]\n    worksheet.add_table(0, 0, 0, df1.shape[1] - 1, {\n        'columns': column_settings,\n        'autofilter': True,\n        'style': 'Table Style Light 1'\n    })\n\n# 8. Set Column Widths\n# Adjust these character widths based on your data\nworksheet.set_column('A:A', 10)\nworksheet.set_column('B:B', 22)\nworksheet.set_column('C:D', 11)\nworksheet.set_column('E:K', 8.5) # Example range\n\n# 9. Page Setup for Printing\nworksheet.set_landscape()      # Set page orientation to landscape\nworksheet.repeat_rows(0)       # Repeat header row (row 0) on each printed page\n\n# 10. Save and Close the Excel File\ntry:\n    writer.close() # This also saves the file\n    print(\"Excel file 'formatted_report.xlsx' saved successfully!\")\nexcept Exception as e:\n    print(f\"Error saving Excel file: {e}\")\n```\n\n## Explanation of the Code\n\n1. **Initialize ExcelWriter with XlsxWriter engine**\n\n   ```python\n   writer = pd.ExcelWriter('formatted_report.xlsx', engine='xlsxwriter')\n   ```\n\n2. **Write DataFrame to a sheet**\n\n   `index=False` prevents writing the DataFrame index as a column in Excel.\n\n   ```python\n   df1.to_excel(writer, sheet_name='Sheet1', index=False)\n   ```\n\n3. **Access XlsxWriter workbook and worksheet objects**\n\n   ```python\n   workbook = writer.book\n   worksheet = writer.sheets['Sheet1']\n   ```\n\n4. **Format the Header Row**\n\n   Define a format for the header cells.\n\n   ```python\n   header_format = workbook.add_format({\n       'bold': True,\n       'italic': True,\n       'underline': True,\n       'font_size': 13,\n       'bottom': 2,    # Medium border\n       'top': 2,       # Medium border\n       'left': 2,      # Medium border\n       'right': 2,     # Medium border\n       'align': 'center',\n       'valign': 'vcenter',\n       'bg_color': '#DDEBF7' # A light blue background\n   })\n   ```\n\n   Apply the format to the header row (rewriting what Pandas initially wrote).\n\n   ```python\n   for col_num, value in enumerate(df1.columns.values):\n       worksheet.write(0, col_num, value, header_format)\n   ```\n\n5. **Define Formats for Data Cells**\n\n   General format for data cells (thin borders on all sides).\n\n   ```python\n   format1_all_borders = workbook.add_format({\n       'bottom': 1, 'top': 1, 'left': 1, 'right': 1\n   })\n   ```\n\n   Specific format for the first row of data (medium top border, thin other borders).\n\n   ```python\n   format2_first_data_row = workbook.add_format({\n       'top': 2,    # Medium top border\n       'bottom': 1, # Thin bottom border\n       'right': 1,  # Thin right border\n       'left': 1    # Thin left border\n   })\n   ```\n\n6. **Apply Conditional Formatting to Data Cells**\n\n   This applies 'format2_first_data_row' to the first row of data (row index 1). It checks if cells are not blank (criteria: '>=', value: '\"\"' effectively means not blank for text/numbers).\n\n   ```python\n   if len(df1) > 0: # Ensure there is at least one data row\n       worksheet.conditional_format(1, 0, 1, df1.shape[1] - 1, {\n           'type': 'cell',\n           'criteria': '>=', # Applies to cells with any content (numbers or text)\n           'value': '\"\"',    # Compares against an empty string\n           'format': format2_first_data_row\n       })\n\n       # Apply 'format1_all_borders' to all data cells\n       worksheet.conditional_format(1, 0, df1.shape[0], df1.shape[1] - 1, {\n           'type': 'cell',\n           'criteria': '>=',\n           'value': '\"\"',\n           'format': format1_all_borders\n       })\n   ```\n\n7. **Add an Excel Table with AutoFilter and Style**\n\n   The table range should include the header row (row 0) and all data rows. `df1.shape[0]` is the number of data rows, so the last data row index is `df1.shape[0]`.\n\n   ```python\n   if len(df1) > 0:\n       column_settings = [{'header': column} for column in df1.columns.values]\n       worksheet.add_table(0, 0, df1.shape[0], df1.shape[1] - 1, {\n           'columns': column_settings, # Use DataFrame headers for the table\n           'autofilter': True,\n           'style': 'Table Style Light 1'\n       })\n   ```\n\n   Handle empty DataFrame: create table with only headers.\n\n   ```python\n   else: # Handle empty DataFrame: create table with only headers\n       column_settings = [{'header': column} for column in df1.columns.values]\n       worksheet.add_table(0, 0, 0, df1.shape[1] - 1, {\n           'columns': column_settings,\n           'autofilter': True,\n           'style': 'Table Style Light 1'\n       })\n   ```\n\n8. **Set Column Widths**\n\n   Adjust these character widths based on your data.\n\n   ```python\n   worksheet.set_column('A:A', 10)\n   worksheet.set_column('B:B', 22)\n   worksheet.set_column('C:D', 11)\n   worksheet.set_column('E:K', 8.5) # Example range\n   ```\n\n9. **Page Setup for Printing**\n\n   ```python\n   worksheet.set_landscape()      # Set page orientation to landscape\n   worksheet.repeat_rows(0)       # Repeat header row (row 0) on each printed page\n   ```\n\n10. **Save and Close the Excel File**\n\n    ```python\n    try:\n        writer.close() # This also saves the file\n        print(\"Excel file 'formatted_report.xlsx' saved successfully!\")\n    except Exception as e:\n        print(f\"Error saving Excel file: {e}\")\n    ```", "src/content/blog/2024-07-18-If you-have-to.md", "4c8ae12e6fb03edd", { html: 170, metadata: 171 }, `<p>Sometimes people need to download some data, format it in Excel, and distribute it. And they have to do this every day, and you look at it and think “I bet I could automate that.” And you are right!  You could automate it and make someone’s life a lot easier. Don’t be a slacker, help them out.</p>
<h2 id="how-it-works">How it Works</h2>
<p>After writing a Pandas DataFrame to an Excel sheet using <code>df.to_excel(writer, ...)</code>, you can access XlsxWriter’s workbook and worksheet objects. The library has a ton of formatting options I am not even touching here. If you want to review them all, check out the <a href="https://xlsxwriter.readthedocs.io/">XlsxWriter documentation</a>.</p>
<p>Let’s walk through a Python script that uses Pandas and XlsxWriter to create a well-formatted Excel report from a DataFrame (df1).</p>
<pre class="astro-code github-dark" style="background-color:#24292e;color:#e1e4e8; overflow-x: auto;" tabindex="0" data-language="python"><code><span class="line"><span style="color:#F97583">import</span><span style="color:#E1E4E8"> pandas </span><span style="color:#F97583">as</span><span style="color:#E1E4E8"> pd</span></span>
<span class="line"><span style="color:#6A737D"># Assume df1 is a pre-existing Pandas DataFrame</span></span>
<span class="line"><span style="color:#6A737D"># For example:</span></span>
<span class="line"><span style="color:#6A737D"># data = {'ColA': [1, 2, 3], 'ColB': ['X', 'Y', 'Z'], 'ColC': [10.1, 20.2, 30.3], 'ColD': [True, False, True]}</span></span>
<span class="line"><span style="color:#6A737D"># df1 = pd.DataFrame(data)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D"># 1. Initialize ExcelWriter with XlsxWriter engine</span></span>
<span class="line"><span style="color:#E1E4E8">writer </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> pd.ExcelWriter(</span><span style="color:#9ECBFF">'formatted_report.xlsx'</span><span style="color:#E1E4E8">, </span><span style="color:#FFAB70">engine</span><span style="color:#F97583">=</span><span style="color:#9ECBFF">'xlsxwriter'</span><span style="color:#E1E4E8">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D"># 2. Write DataFrame to a sheet</span></span>
<span class="line"><span style="color:#6A737D"># index=False prevents writing the DataFrame index as a column in Excel</span></span>
<span class="line"><span style="color:#E1E4E8">df1.to_excel(writer, </span><span style="color:#FFAB70">sheet_name</span><span style="color:#F97583">=</span><span style="color:#9ECBFF">'Sheet1'</span><span style="color:#E1E4E8">, </span><span style="color:#FFAB70">index</span><span style="color:#F97583">=</span><span style="color:#79B8FF">False</span><span style="color:#E1E4E8">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D"># 3. Access XlsxWriter workbook and worksheet objects</span></span>
<span class="line"><span style="color:#E1E4E8">workbook </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> writer.book</span></span>
<span class="line"><span style="color:#E1E4E8">worksheet </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> writer.sheets[</span><span style="color:#9ECBFF">'Sheet1'</span><span style="color:#E1E4E8">]</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D"># 4. Format the Header Row</span></span>
<span class="line"><span style="color:#6A737D"># Define a format for the header cells</span></span>
<span class="line"><span style="color:#E1E4E8">header_format </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> workbook.add_format({</span></span>
<span class="line"><span style="color:#9ECBFF">    'bold'</span><span style="color:#E1E4E8">: </span><span style="color:#79B8FF">True</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#9ECBFF">    'italic'</span><span style="color:#E1E4E8">: </span><span style="color:#79B8FF">True</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#9ECBFF">    'underline'</span><span style="color:#E1E4E8">: </span><span style="color:#79B8FF">True</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#9ECBFF">    'font_size'</span><span style="color:#E1E4E8">: </span><span style="color:#79B8FF">13</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#9ECBFF">    'bottom'</span><span style="color:#E1E4E8">: </span><span style="color:#79B8FF">2</span><span style="color:#E1E4E8">,    </span><span style="color:#6A737D"># Medium border</span></span>
<span class="line"><span style="color:#9ECBFF">    'top'</span><span style="color:#E1E4E8">: </span><span style="color:#79B8FF">2</span><span style="color:#E1E4E8">,       </span><span style="color:#6A737D"># Medium border</span></span>
<span class="line"><span style="color:#9ECBFF">    'left'</span><span style="color:#E1E4E8">: </span><span style="color:#79B8FF">2</span><span style="color:#E1E4E8">,      </span><span style="color:#6A737D"># Medium border</span></span>
<span class="line"><span style="color:#9ECBFF">    'right'</span><span style="color:#E1E4E8">: </span><span style="color:#79B8FF">2</span><span style="color:#E1E4E8">,     </span><span style="color:#6A737D"># Medium border</span></span>
<span class="line"><span style="color:#9ECBFF">    'align'</span><span style="color:#E1E4E8">: </span><span style="color:#9ECBFF">'center'</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#9ECBFF">    'valign'</span><span style="color:#E1E4E8">: </span><span style="color:#9ECBFF">'vcenter'</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#9ECBFF">    'bg_color'</span><span style="color:#E1E4E8">: </span><span style="color:#9ECBFF">'#DDEBF7'</span><span style="color:#6A737D"> # A light blue background</span></span>
<span class="line"><span style="color:#E1E4E8">})</span></span>
<span class="line"><span style="color:#6A737D"># Apply the format to the header row (rewriting what Pandas initially wrote)</span></span>
<span class="line"><span style="color:#F97583">for</span><span style="color:#E1E4E8"> col_num, value </span><span style="color:#F97583">in</span><span style="color:#79B8FF"> enumerate</span><span style="color:#E1E4E8">(df1.columns.values):</span></span>
<span class="line"><span style="color:#E1E4E8">    worksheet.write(</span><span style="color:#79B8FF">0</span><span style="color:#E1E4E8">, col_num, value, header_format)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D"># 5. Define Formats for Data Cells</span></span>
<span class="line"><span style="color:#6A737D"># General format for data cells (thin borders on all sides)</span></span>
<span class="line"><span style="color:#E1E4E8">format1_all_borders </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> workbook.add_format({</span></span>
<span class="line"><span style="color:#9ECBFF">    'bottom'</span><span style="color:#E1E4E8">: </span><span style="color:#79B8FF">1</span><span style="color:#E1E4E8">, </span><span style="color:#9ECBFF">'top'</span><span style="color:#E1E4E8">: </span><span style="color:#79B8FF">1</span><span style="color:#E1E4E8">, </span><span style="color:#9ECBFF">'left'</span><span style="color:#E1E4E8">: </span><span style="color:#79B8FF">1</span><span style="color:#E1E4E8">, </span><span style="color:#9ECBFF">'right'</span><span style="color:#E1E4E8">: </span><span style="color:#79B8FF">1</span></span>
<span class="line"><span style="color:#E1E4E8">})</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D"># Specific format for the first row of data (medium top border, thin other borders)</span></span>
<span class="line"><span style="color:#E1E4E8">format2_first_data_row </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> workbook.add_format({</span></span>
<span class="line"><span style="color:#9ECBFF">    'top'</span><span style="color:#E1E4E8">: </span><span style="color:#79B8FF">2</span><span style="color:#E1E4E8">,    </span><span style="color:#6A737D"># Medium top border</span></span>
<span class="line"><span style="color:#9ECBFF">    'bottom'</span><span style="color:#E1E4E8">: </span><span style="color:#79B8FF">1</span><span style="color:#E1E4E8">, </span><span style="color:#6A737D"># Thin bottom border</span></span>
<span class="line"><span style="color:#9ECBFF">    'right'</span><span style="color:#E1E4E8">: </span><span style="color:#79B8FF">1</span><span style="color:#E1E4E8">,  </span><span style="color:#6A737D"># Thin right border</span></span>
<span class="line"><span style="color:#9ECBFF">    'left'</span><span style="color:#E1E4E8">: </span><span style="color:#79B8FF">1</span><span style="color:#6A737D">    # Thin left border</span></span>
<span class="line"><span style="color:#E1E4E8">})</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D"># 6. Apply Conditional Formatting to Data Cells</span></span>
<span class="line"><span style="color:#6A737D"># This applies 'format2_first_data_row' to the first row of data (row index 1)</span></span>
<span class="line"><span style="color:#6A737D"># It checks if cells are not blank (criteria: '>=', value: '""' effectively means not blank for text/numbers)</span></span>
<span class="line"><span style="color:#F97583">if</span><span style="color:#79B8FF"> len</span><span style="color:#E1E4E8">(df1) </span><span style="color:#F97583">></span><span style="color:#79B8FF"> 0</span><span style="color:#E1E4E8">: </span><span style="color:#6A737D"># Ensure there is at least one data row</span></span>
<span class="line"><span style="color:#E1E4E8">    worksheet.conditional_format(</span><span style="color:#79B8FF">1</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">0</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">1</span><span style="color:#E1E4E8">, df1.shape[</span><span style="color:#79B8FF">1</span><span style="color:#E1E4E8">] </span><span style="color:#F97583">-</span><span style="color:#79B8FF"> 1</span><span style="color:#E1E4E8">, {</span></span>
<span class="line"><span style="color:#9ECBFF">        'type'</span><span style="color:#E1E4E8">: </span><span style="color:#9ECBFF">'cell'</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#9ECBFF">        'criteria'</span><span style="color:#E1E4E8">: </span><span style="color:#9ECBFF">'>='</span><span style="color:#E1E4E8">, </span><span style="color:#6A737D"># Applies to cells with any content (numbers or text)</span></span>
<span class="line"><span style="color:#9ECBFF">        'value'</span><span style="color:#E1E4E8">: </span><span style="color:#9ECBFF">'""'</span><span style="color:#E1E4E8">,    </span><span style="color:#6A737D"># Compares against an empty string</span></span>
<span class="line"><span style="color:#9ECBFF">        'format'</span><span style="color:#E1E4E8">: format2_first_data_row</span></span>
<span class="line"><span style="color:#E1E4E8">    })</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    # Apply 'format1_all_borders' to all data cells</span></span>
<span class="line"><span style="color:#E1E4E8">    worksheet.conditional_format(</span><span style="color:#79B8FF">1</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">0</span><span style="color:#E1E4E8">, df1.shape[</span><span style="color:#79B8FF">0</span><span style="color:#E1E4E8">], df1.shape[</span><span style="color:#79B8FF">1</span><span style="color:#E1E4E8">] </span><span style="color:#F97583">-</span><span style="color:#79B8FF"> 1</span><span style="color:#E1E4E8">, {</span></span>
<span class="line"><span style="color:#9ECBFF">        'type'</span><span style="color:#E1E4E8">: </span><span style="color:#9ECBFF">'cell'</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#9ECBFF">        'criteria'</span><span style="color:#E1E4E8">: </span><span style="color:#9ECBFF">'>='</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#9ECBFF">        'value'</span><span style="color:#E1E4E8">: </span><span style="color:#9ECBFF">'""'</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#9ECBFF">        'format'</span><span style="color:#E1E4E8">: format1_all_borders</span></span>
<span class="line"><span style="color:#E1E4E8">    })</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D"># 7. Add an Excel Table with AutoFilter and Style</span></span>
<span class="line"><span style="color:#F97583">if</span><span style="color:#79B8FF"> len</span><span style="color:#E1E4E8">(df1) </span><span style="color:#F97583">></span><span style="color:#79B8FF"> 0</span><span style="color:#E1E4E8">:</span></span>
<span class="line"><span style="color:#E1E4E8">    column_settings </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> [{</span><span style="color:#9ECBFF">'header'</span><span style="color:#E1E4E8">: column} </span><span style="color:#F97583">for</span><span style="color:#E1E4E8"> column </span><span style="color:#F97583">in</span><span style="color:#E1E4E8"> df1.columns.values]</span></span>
<span class="line"><span style="color:#E1E4E8">    worksheet.add_table(</span><span style="color:#79B8FF">0</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">0</span><span style="color:#E1E4E8">, df1.shape[</span><span style="color:#79B8FF">0</span><span style="color:#E1E4E8">], df1.shape[</span><span style="color:#79B8FF">1</span><span style="color:#E1E4E8">] </span><span style="color:#F97583">-</span><span style="color:#79B8FF"> 1</span><span style="color:#E1E4E8">, {</span></span>
<span class="line"><span style="color:#9ECBFF">        'columns'</span><span style="color:#E1E4E8">: column_settings, </span><span style="color:#6A737D"># Use DataFrame headers for the table</span></span>
<span class="line"><span style="color:#9ECBFF">        'autofilter'</span><span style="color:#E1E4E8">: </span><span style="color:#79B8FF">True</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#9ECBFF">        'style'</span><span style="color:#E1E4E8">: </span><span style="color:#9ECBFF">'Table Style Light 1'</span></span>
<span class="line"><span style="color:#E1E4E8">    })</span></span>
<span class="line"><span style="color:#F97583">else</span><span style="color:#E1E4E8">: </span><span style="color:#6A737D"># Handle empty DataFrame: create table with only headers</span></span>
<span class="line"><span style="color:#E1E4E8">    column_settings </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> [{</span><span style="color:#9ECBFF">'header'</span><span style="color:#E1E4E8">: column} </span><span style="color:#F97583">for</span><span style="color:#E1E4E8"> column </span><span style="color:#F97583">in</span><span style="color:#E1E4E8"> df1.columns.values]</span></span>
<span class="line"><span style="color:#E1E4E8">    worksheet.add_table(</span><span style="color:#79B8FF">0</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">0</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">0</span><span style="color:#E1E4E8">, df1.shape[</span><span style="color:#79B8FF">1</span><span style="color:#E1E4E8">] </span><span style="color:#F97583">-</span><span style="color:#79B8FF"> 1</span><span style="color:#E1E4E8">, {</span></span>
<span class="line"><span style="color:#9ECBFF">        'columns'</span><span style="color:#E1E4E8">: column_settings,</span></span>
<span class="line"><span style="color:#9ECBFF">        'autofilter'</span><span style="color:#E1E4E8">: </span><span style="color:#79B8FF">True</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#9ECBFF">        'style'</span><span style="color:#E1E4E8">: </span><span style="color:#9ECBFF">'Table Style Light 1'</span></span>
<span class="line"><span style="color:#E1E4E8">    })</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D"># 8. Set Column Widths</span></span>
<span class="line"><span style="color:#6A737D"># Adjust these character widths based on your data</span></span>
<span class="line"><span style="color:#E1E4E8">worksheet.set_column(</span><span style="color:#9ECBFF">'A:A'</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">10</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#E1E4E8">worksheet.set_column(</span><span style="color:#9ECBFF">'B:B'</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">22</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#E1E4E8">worksheet.set_column(</span><span style="color:#9ECBFF">'C:D'</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">11</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#E1E4E8">worksheet.set_column(</span><span style="color:#9ECBFF">'E:K'</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">8.5</span><span style="color:#E1E4E8">) </span><span style="color:#6A737D"># Example range</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D"># 9. Page Setup for Printing</span></span>
<span class="line"><span style="color:#E1E4E8">worksheet.set_landscape()      </span><span style="color:#6A737D"># Set page orientation to landscape</span></span>
<span class="line"><span style="color:#E1E4E8">worksheet.repeat_rows(</span><span style="color:#79B8FF">0</span><span style="color:#E1E4E8">)       </span><span style="color:#6A737D"># Repeat header row (row 0) on each printed page</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D"># 10. Save and Close the Excel File</span></span>
<span class="line"><span style="color:#F97583">try</span><span style="color:#E1E4E8">:</span></span>
<span class="line"><span style="color:#E1E4E8">    writer.close() </span><span style="color:#6A737D"># This also saves the file</span></span>
<span class="line"><span style="color:#79B8FF">    print</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"Excel file 'formatted_report.xlsx' saved successfully!"</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#F97583">except</span><span style="color:#79B8FF"> Exception</span><span style="color:#F97583"> as</span><span style="color:#E1E4E8"> e:</span></span>
<span class="line"><span style="color:#79B8FF">    print</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">f</span><span style="color:#9ECBFF">"Error saving Excel file: </span><span style="color:#79B8FF">{</span><span style="color:#E1E4E8">e</span><span style="color:#79B8FF">}</span><span style="color:#9ECBFF">"</span><span style="color:#E1E4E8">)</span></span></code></pre>
<h2 id="explanation-of-the-code">Explanation of the Code</h2>
<ol>
<li>
<p><strong>Initialize ExcelWriter with XlsxWriter engine</strong></p>
<pre class="astro-code github-dark" style="background-color:#24292e;color:#e1e4e8; overflow-x: auto;" tabindex="0" data-language="python"><code><span class="line"><span style="color:#E1E4E8">writer </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> pd.ExcelWriter(</span><span style="color:#9ECBFF">'formatted_report.xlsx'</span><span style="color:#E1E4E8">, </span><span style="color:#FFAB70">engine</span><span style="color:#F97583">=</span><span style="color:#9ECBFF">'xlsxwriter'</span><span style="color:#E1E4E8">)</span></span></code></pre>
</li>
<li>
<p><strong>Write DataFrame to a sheet</strong></p>
<p><code>index=False</code> prevents writing the DataFrame index as a column in Excel.</p>
<pre class="astro-code github-dark" style="background-color:#24292e;color:#e1e4e8; overflow-x: auto;" tabindex="0" data-language="python"><code><span class="line"><span style="color:#E1E4E8">df1.to_excel(writer, </span><span style="color:#FFAB70">sheet_name</span><span style="color:#F97583">=</span><span style="color:#9ECBFF">'Sheet1'</span><span style="color:#E1E4E8">, </span><span style="color:#FFAB70">index</span><span style="color:#F97583">=</span><span style="color:#79B8FF">False</span><span style="color:#E1E4E8">)</span></span></code></pre>
</li>
<li>
<p><strong>Access XlsxWriter workbook and worksheet objects</strong></p>
<pre class="astro-code github-dark" style="background-color:#24292e;color:#e1e4e8; overflow-x: auto;" tabindex="0" data-language="python"><code><span class="line"><span style="color:#E1E4E8">workbook </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> writer.book</span></span>
<span class="line"><span style="color:#E1E4E8">worksheet </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> writer.sheets[</span><span style="color:#9ECBFF">'Sheet1'</span><span style="color:#E1E4E8">]</span></span></code></pre>
</li>
<li>
<p><strong>Format the Header Row</strong></p>
<p>Define a format for the header cells.</p>
<pre class="astro-code github-dark" style="background-color:#24292e;color:#e1e4e8; overflow-x: auto;" tabindex="0" data-language="python"><code><span class="line"><span style="color:#E1E4E8">header_format </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> workbook.add_format({</span></span>
<span class="line"><span style="color:#9ECBFF">    'bold'</span><span style="color:#E1E4E8">: </span><span style="color:#79B8FF">True</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#9ECBFF">    'italic'</span><span style="color:#E1E4E8">: </span><span style="color:#79B8FF">True</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#9ECBFF">    'underline'</span><span style="color:#E1E4E8">: </span><span style="color:#79B8FF">True</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#9ECBFF">    'font_size'</span><span style="color:#E1E4E8">: </span><span style="color:#79B8FF">13</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#9ECBFF">    'bottom'</span><span style="color:#E1E4E8">: </span><span style="color:#79B8FF">2</span><span style="color:#E1E4E8">,    </span><span style="color:#6A737D"># Medium border</span></span>
<span class="line"><span style="color:#9ECBFF">    'top'</span><span style="color:#E1E4E8">: </span><span style="color:#79B8FF">2</span><span style="color:#E1E4E8">,       </span><span style="color:#6A737D"># Medium border</span></span>
<span class="line"><span style="color:#9ECBFF">    'left'</span><span style="color:#E1E4E8">: </span><span style="color:#79B8FF">2</span><span style="color:#E1E4E8">,      </span><span style="color:#6A737D"># Medium border</span></span>
<span class="line"><span style="color:#9ECBFF">    'right'</span><span style="color:#E1E4E8">: </span><span style="color:#79B8FF">2</span><span style="color:#E1E4E8">,     </span><span style="color:#6A737D"># Medium border</span></span>
<span class="line"><span style="color:#9ECBFF">    'align'</span><span style="color:#E1E4E8">: </span><span style="color:#9ECBFF">'center'</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#9ECBFF">    'valign'</span><span style="color:#E1E4E8">: </span><span style="color:#9ECBFF">'vcenter'</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#9ECBFF">    'bg_color'</span><span style="color:#E1E4E8">: </span><span style="color:#9ECBFF">'#DDEBF7'</span><span style="color:#6A737D"> # A light blue background</span></span>
<span class="line"><span style="color:#E1E4E8">})</span></span></code></pre>
<p>Apply the format to the header row (rewriting what Pandas initially wrote).</p>
<pre class="astro-code github-dark" style="background-color:#24292e;color:#e1e4e8; overflow-x: auto;" tabindex="0" data-language="python"><code><span class="line"><span style="color:#F97583">for</span><span style="color:#E1E4E8"> col_num, value </span><span style="color:#F97583">in</span><span style="color:#79B8FF"> enumerate</span><span style="color:#E1E4E8">(df1.columns.values):</span></span>
<span class="line"><span style="color:#E1E4E8">    worksheet.write(</span><span style="color:#79B8FF">0</span><span style="color:#E1E4E8">, col_num, value, header_format)</span></span></code></pre>
</li>
<li>
<p><strong>Define Formats for Data Cells</strong></p>
<p>General format for data cells (thin borders on all sides).</p>
<pre class="astro-code github-dark" style="background-color:#24292e;color:#e1e4e8; overflow-x: auto;" tabindex="0" data-language="python"><code><span class="line"><span style="color:#E1E4E8">format1_all_borders </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> workbook.add_format({</span></span>
<span class="line"><span style="color:#9ECBFF">    'bottom'</span><span style="color:#E1E4E8">: </span><span style="color:#79B8FF">1</span><span style="color:#E1E4E8">, </span><span style="color:#9ECBFF">'top'</span><span style="color:#E1E4E8">: </span><span style="color:#79B8FF">1</span><span style="color:#E1E4E8">, </span><span style="color:#9ECBFF">'left'</span><span style="color:#E1E4E8">: </span><span style="color:#79B8FF">1</span><span style="color:#E1E4E8">, </span><span style="color:#9ECBFF">'right'</span><span style="color:#E1E4E8">: </span><span style="color:#79B8FF">1</span></span>
<span class="line"><span style="color:#E1E4E8">})</span></span></code></pre>
<p>Specific format for the first row of data (medium top border, thin other borders).</p>
<pre class="astro-code github-dark" style="background-color:#24292e;color:#e1e4e8; overflow-x: auto;" tabindex="0" data-language="python"><code><span class="line"><span style="color:#E1E4E8">format2_first_data_row </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> workbook.add_format({</span></span>
<span class="line"><span style="color:#9ECBFF">    'top'</span><span style="color:#E1E4E8">: </span><span style="color:#79B8FF">2</span><span style="color:#E1E4E8">,    </span><span style="color:#6A737D"># Medium top border</span></span>
<span class="line"><span style="color:#9ECBFF">    'bottom'</span><span style="color:#E1E4E8">: </span><span style="color:#79B8FF">1</span><span style="color:#E1E4E8">, </span><span style="color:#6A737D"># Thin bottom border</span></span>
<span class="line"><span style="color:#9ECBFF">    'right'</span><span style="color:#E1E4E8">: </span><span style="color:#79B8FF">1</span><span style="color:#E1E4E8">,  </span><span style="color:#6A737D"># Thin right border</span></span>
<span class="line"><span style="color:#9ECBFF">    'left'</span><span style="color:#E1E4E8">: </span><span style="color:#79B8FF">1</span><span style="color:#6A737D">    # Thin left border</span></span>
<span class="line"><span style="color:#E1E4E8">})</span></span></code></pre>
</li>
<li>
<p><strong>Apply Conditional Formatting to Data Cells</strong></p>
<p>This applies ‘format2_first_data_row’ to the first row of data (row index 1). It checks if cells are not blank (criteria: ’>=’, value: ’""’ effectively means not blank for text/numbers).</p>
<pre class="astro-code github-dark" style="background-color:#24292e;color:#e1e4e8; overflow-x: auto;" tabindex="0" data-language="python"><code><span class="line"><span style="color:#F97583">if</span><span style="color:#79B8FF"> len</span><span style="color:#E1E4E8">(df1) </span><span style="color:#F97583">></span><span style="color:#79B8FF"> 0</span><span style="color:#E1E4E8">: </span><span style="color:#6A737D"># Ensure there is at least one data row</span></span>
<span class="line"><span style="color:#E1E4E8">    worksheet.conditional_format(</span><span style="color:#79B8FF">1</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">0</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">1</span><span style="color:#E1E4E8">, df1.shape[</span><span style="color:#79B8FF">1</span><span style="color:#E1E4E8">] </span><span style="color:#F97583">-</span><span style="color:#79B8FF"> 1</span><span style="color:#E1E4E8">, {</span></span>
<span class="line"><span style="color:#9ECBFF">        'type'</span><span style="color:#E1E4E8">: </span><span style="color:#9ECBFF">'cell'</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#9ECBFF">        'criteria'</span><span style="color:#E1E4E8">: </span><span style="color:#9ECBFF">'>='</span><span style="color:#E1E4E8">, </span><span style="color:#6A737D"># Applies to cells with any content (numbers or text)</span></span>
<span class="line"><span style="color:#9ECBFF">        'value'</span><span style="color:#E1E4E8">: </span><span style="color:#9ECBFF">'""'</span><span style="color:#E1E4E8">,    </span><span style="color:#6A737D"># Compares against an empty string</span></span>
<span class="line"><span style="color:#9ECBFF">        'format'</span><span style="color:#E1E4E8">: format2_first_data_row</span></span>
<span class="line"><span style="color:#E1E4E8">    })</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    # Apply 'format1_all_borders' to all data cells</span></span>
<span class="line"><span style="color:#E1E4E8">    worksheet.conditional_format(</span><span style="color:#79B8FF">1</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">0</span><span style="color:#E1E4E8">, df1.shape[</span><span style="color:#79B8FF">0</span><span style="color:#E1E4E8">], df1.shape[</span><span style="color:#79B8FF">1</span><span style="color:#E1E4E8">] </span><span style="color:#F97583">-</span><span style="color:#79B8FF"> 1</span><span style="color:#E1E4E8">, {</span></span>
<span class="line"><span style="color:#9ECBFF">        'type'</span><span style="color:#E1E4E8">: </span><span style="color:#9ECBFF">'cell'</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#9ECBFF">        'criteria'</span><span style="color:#E1E4E8">: </span><span style="color:#9ECBFF">'>='</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#9ECBFF">        'value'</span><span style="color:#E1E4E8">: </span><span style="color:#9ECBFF">'""'</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#9ECBFF">        'format'</span><span style="color:#E1E4E8">: format1_all_borders</span></span>
<span class="line"><span style="color:#E1E4E8">    })</span></span></code></pre>
</li>
<li>
<p><strong>Add an Excel Table with AutoFilter and Style</strong></p>
<p>The table range should include the header row (row 0) and all data rows. <code>df1.shape[0]</code> is the number of data rows, so the last data row index is <code>df1.shape[0]</code>.</p>
<pre class="astro-code github-dark" style="background-color:#24292e;color:#e1e4e8; overflow-x: auto;" tabindex="0" data-language="python"><code><span class="line"><span style="color:#F97583">if</span><span style="color:#79B8FF"> len</span><span style="color:#E1E4E8">(df1) </span><span style="color:#F97583">></span><span style="color:#79B8FF"> 0</span><span style="color:#E1E4E8">:</span></span>
<span class="line"><span style="color:#E1E4E8">    column_settings </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> [{</span><span style="color:#9ECBFF">'header'</span><span style="color:#E1E4E8">: column} </span><span style="color:#F97583">for</span><span style="color:#E1E4E8"> column </span><span style="color:#F97583">in</span><span style="color:#E1E4E8"> df1.columns.values]</span></span>
<span class="line"><span style="color:#E1E4E8">    worksheet.add_table(</span><span style="color:#79B8FF">0</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">0</span><span style="color:#E1E4E8">, df1.shape[</span><span style="color:#79B8FF">0</span><span style="color:#E1E4E8">], df1.shape[</span><span style="color:#79B8FF">1</span><span style="color:#E1E4E8">] </span><span style="color:#F97583">-</span><span style="color:#79B8FF"> 1</span><span style="color:#E1E4E8">, {</span></span>
<span class="line"><span style="color:#9ECBFF">        'columns'</span><span style="color:#E1E4E8">: column_settings, </span><span style="color:#6A737D"># Use DataFrame headers for the table</span></span>
<span class="line"><span style="color:#9ECBFF">        'autofilter'</span><span style="color:#E1E4E8">: </span><span style="color:#79B8FF">True</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#9ECBFF">        'style'</span><span style="color:#E1E4E8">: </span><span style="color:#9ECBFF">'Table Style Light 1'</span></span>
<span class="line"><span style="color:#E1E4E8">    })</span></span></code></pre>
<p>Handle empty DataFrame: create table with only headers.</p>
<pre class="astro-code github-dark" style="background-color:#24292e;color:#e1e4e8; overflow-x: auto;" tabindex="0" data-language="python"><code><span class="line"><span style="color:#F97583">else</span><span style="color:#E1E4E8">: </span><span style="color:#6A737D"># Handle empty DataFrame: create table with only headers</span></span>
<span class="line"><span style="color:#E1E4E8">    column_settings </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> [{</span><span style="color:#9ECBFF">'header'</span><span style="color:#E1E4E8">: column} </span><span style="color:#F97583">for</span><span style="color:#E1E4E8"> column </span><span style="color:#F97583">in</span><span style="color:#E1E4E8"> df1.columns.values]</span></span>
<span class="line"><span style="color:#E1E4E8">    worksheet.add_table(</span><span style="color:#79B8FF">0</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">0</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">0</span><span style="color:#E1E4E8">, df1.shape[</span><span style="color:#79B8FF">1</span><span style="color:#E1E4E8">] </span><span style="color:#F97583">-</span><span style="color:#79B8FF"> 1</span><span style="color:#E1E4E8">, {</span></span>
<span class="line"><span style="color:#9ECBFF">        'columns'</span><span style="color:#E1E4E8">: column_settings,</span></span>
<span class="line"><span style="color:#9ECBFF">        'autofilter'</span><span style="color:#E1E4E8">: </span><span style="color:#79B8FF">True</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#9ECBFF">        'style'</span><span style="color:#E1E4E8">: </span><span style="color:#9ECBFF">'Table Style Light 1'</span></span>
<span class="line"><span style="color:#E1E4E8">    })</span></span></code></pre>
</li>
<li>
<p><strong>Set Column Widths</strong></p>
<p>Adjust these character widths based on your data.</p>
<pre class="astro-code github-dark" style="background-color:#24292e;color:#e1e4e8; overflow-x: auto;" tabindex="0" data-language="python"><code><span class="line"><span style="color:#E1E4E8">worksheet.set_column(</span><span style="color:#9ECBFF">'A:A'</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">10</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#E1E4E8">worksheet.set_column(</span><span style="color:#9ECBFF">'B:B'</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">22</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#E1E4E8">worksheet.set_column(</span><span style="color:#9ECBFF">'C:D'</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">11</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#E1E4E8">worksheet.set_column(</span><span style="color:#9ECBFF">'E:K'</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">8.5</span><span style="color:#E1E4E8">) </span><span style="color:#6A737D"># Example range</span></span></code></pre>
</li>
<li>
<p><strong>Page Setup for Printing</strong></p>
<pre class="astro-code github-dark" style="background-color:#24292e;color:#e1e4e8; overflow-x: auto;" tabindex="0" data-language="python"><code><span class="line"><span style="color:#E1E4E8">worksheet.set_landscape()      </span><span style="color:#6A737D"># Set page orientation to landscape</span></span>
<span class="line"><span style="color:#E1E4E8">worksheet.repeat_rows(</span><span style="color:#79B8FF">0</span><span style="color:#E1E4E8">)       </span><span style="color:#6A737D"># Repeat header row (row 0) on each printed page</span></span></code></pre>
</li>
<li>
<p><strong>Save and Close the Excel File</strong></p>
<pre class="astro-code github-dark" style="background-color:#24292e;color:#e1e4e8; overflow-x: auto;" tabindex="0" data-language="python"><code><span class="line"><span style="color:#F97583">try</span><span style="color:#E1E4E8">:</span></span>
<span class="line"><span style="color:#E1E4E8">    writer.close() </span><span style="color:#6A737D"># This also saves the file</span></span>
<span class="line"><span style="color:#79B8FF">    print</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"Excel file 'formatted_report.xlsx' saved successfully!"</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#F97583">except</span><span style="color:#79B8FF"> Exception</span><span style="color:#F97583"> as</span><span style="color:#E1E4E8"> e:</span></span>
<span class="line"><span style="color:#79B8FF">    print</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">f</span><span style="color:#9ECBFF">"Error saving Excel file: </span><span style="color:#79B8FF">{</span><span style="color:#E1E4E8">e</span><span style="color:#79B8FF">}</span><span style="color:#9ECBFF">"</span><span style="color:#E1E4E8">)</span></span></code></pre>
</li>
</ol>`, { headings: 172, localImagePaths: 179, remoteImagePaths: 180, frontmatter: 181, imagePaths: 185 }, [173, 176], { depth: 53, slug: 174, text: 175 }, "how-it-works", "How it Works", { depth: 53, slug: 177, text: 178 }, "explanation-of-the-code", "Explanation of the Code", [], [], { title: 159, categories: 182, tags: 183, pubDate: 184, description: 160 }, [82, 24], [21, 19, 163, 164, 79], "2024-07-18 12:00:00 -0400", [], "2024-07-18-If you-have-to.md", "2025-04-25-brighter-but-not-harmful", { id: 187, data: 189, body: 201, filePath: 202, digest: 203, rendered: 204, legacyId: 224 }, { title: 190, description: 191, pubDate: 192, tags: 193, categories: 199 }, "Brighter But Not Harmful: The 'uv' Python Installer", "A post about Brighter But Not Harmful: The 'uv' Python Installer.", ["Date", "2025-04-25T16:00:00.000Z"], [21, 194, 195, 196, 197, 198], "uv", "dependency-management", "pip", "package-manager", "rust", [82, 200], "Python", "# The Effective and Unobtrusive 'uv' Python Package Manager\n\nI really like 'uv'. I know controversial opinion, but I am not afraid of what the bureaucrats in city hall will say. I never really felt like dependencies took too long to download. But when I saw uv in action, I mourned the collective hours of all the python users who had the misfortune of coding before 'uv', a new, blazing-fast Python package installer and resolver from Astral, the creators of the Ruff linter. It's designed to be a drop-in replacement for common pip and pip-tools workflows, but significantly faster.\n\n## Why is uv a Big Deal?\n\n- **Speed**: This is uv's headline feature. It's written in Rust and leverages parallelism and smart caching to install and resolve dependencies much quicker than traditional tools. For large projects or CI/CD pipelines, this can mean saving substantial amounts of time.\n\n- **Drop-in Replacement (Mostly)**: uv aims to be compatible with existing requirements.txt files and pyproject.toml standards. You can often use uv pip install ... much like you would pip install ....\n\n- **Unified Tooling**: It can act as both a package installer (like pip) and a resolver for pinning dependencies (like pip-compile from pip-tools). It also includes capabilities for managing virtual environments.\n\n- **Modern Foundation**: Built with performance and correctness in mind from the ground up.\n\n## What Can You Do With uv?\n\n- `uv pip install -r requirements.txt`: Install dependencies from a requirements file, but faster.\n\n- `uv pip compile pyproject.toml -o requirements.txt`: Resolve dependencies and generate a locked requirements.txt file.\n\n- `uv venv`: Create virtual environments quickly.\n\nSometimes you think the world is going in the wrong direction. And then you see something like uv and you think, maybe it is not so bad after all.\n\nHere are the docs if you want to learn more: [uv docs](https://astral.sh/uv/).", "src/content/blog/2025-04-25-Brighter-But-Not-Harmful.md", "04f74c714e2647fd", { html: 205, metadata: 206 }, '<h1 id="the-effective-and-unobtrusive-uv-python-package-manager">The Effective and Unobtrusive ‘uv’ Python Package Manager</h1>\n<p>I really like ‘uv’. I know controversial opinion, but I am not afraid of what the bureaucrats in city hall will say. I never really felt like dependencies took too long to download. But when I saw uv in action, I mourned the collective hours of all the python users who had the misfortune of coding before ‘uv’, a new, blazing-fast Python package installer and resolver from Astral, the creators of the Ruff linter. It’s designed to be a drop-in replacement for common pip and pip-tools workflows, but significantly faster.</p>\n<h2 id="why-is-uv-a-big-deal">Why is uv a Big Deal?</h2>\n<ul>\n<li>\n<p><strong>Speed</strong>: This is uv’s headline feature. It’s written in Rust and leverages parallelism and smart caching to install and resolve dependencies much quicker than traditional tools. For large projects or CI/CD pipelines, this can mean saving substantial amounts of time.</p>\n</li>\n<li>\n<p><strong>Drop-in Replacement (Mostly)</strong>: uv aims to be compatible with existing requirements.txt files and pyproject.toml standards. You can often use uv pip install … much like you would pip install …</p>\n</li>\n<li>\n<p><strong>Unified Tooling</strong>: It can act as both a package installer (like pip) and a resolver for pinning dependencies (like pip-compile from pip-tools). It also includes capabilities for managing virtual environments.</p>\n</li>\n<li>\n<p><strong>Modern Foundation</strong>: Built with performance and correctness in mind from the ground up.</p>\n</li>\n</ul>\n<h2 id="what-can-you-do-with-uv">What Can You Do With uv?</h2>\n<ul>\n<li>\n<p><code>uv pip install -r requirements.txt</code>: Install dependencies from a requirements file, but faster.</p>\n</li>\n<li>\n<p><code>uv pip compile pyproject.toml -o requirements.txt</code>: Resolve dependencies and generate a locked requirements.txt file.</p>\n</li>\n<li>\n<p><code>uv venv</code>: Create virtual environments quickly.</p>\n</li>\n</ul>\n<p>Sometimes you think the world is going in the wrong direction. And then you see something like uv and you think, maybe it is not so bad after all.</p>\n<p>Here are the docs if you want to learn more: <a href="https://astral.sh/uv/">uv docs</a>.</p>', { headings: 207, localImagePaths: 217, remoteImagePaths: 218, frontmatter: 219, imagePaths: 223 }, [208, 211, 214], { depth: 33, slug: 209, text: 210 }, "the-effective-and-unobtrusive-uv-python-package-manager", "The Effective and Unobtrusive ‘uv’ Python Package Manager", { depth: 53, slug: 212, text: 213 }, "why-is-uv-a-big-deal", "Why is uv a Big Deal?", { depth: 53, slug: 215, text: 216 }, "what-can-you-do-with-uv", "What Can You Do With uv?", [], [], { title: 190, categories: 220, tags: 221, pubDate: 222, description: 191 }, [82, 200], [21, 194, 195, 196, 197, 198], "2025-04-25 12:00:00 -0400", [], "2025-04-25-Brighter-But-Not-Harmful.md", "2025-05-29-lemon-labor-lost", { id: 225, data: 227, body: 239, filePath: 240, digest: 241, rendered: 242, legacyId: 253 }, { title: 228, description: 229, pubDate: 230, tags: 231, categories: 236 }, "Lemon Labor Lost: A Quest for the Perfect Cookie", "A post about Lemon Labor Lost: A Quest for the Perfect Cookie.", ["Date", "2025-05-29T16:00:00.000Z"], [232, 233, 234, 235], "lemon cookies", "food review", "maximizer", "satisficer", [237, 238], "Food", "Personal", `<figure style="text-align: center;">
  <img src="/img/lemon-hamlet.png" alt="Twas but a cookie, with lemon" style="width: 400px; height: auto;">
  <figcaption style="font-size: smaller; color: gray;">Twas a cookie, with scant but the scent of a lemon.</figcaption>
</figure>

For weeks now, I've been on a quiet, personal quest: the search for the perfect lemon cookie. It's not some grand, dramatic saga; it's just a simple desire to find that one, cookie that delivers a bright, zesty, and utterly satisfying lemon experience. No, I don't know what is wrong with me. I just want what I want.

So for a while now, I have been going to different grocery stores and looking for lemon cookie mixes or lemon-flavored cookies. On one trip, the only ones with icing I could find were [lemon Oreos](https://www.oreo.com/products/oreo-lemon-cookies?Size=2+Pack). I thought, well if this is the only one's they have, I will give them a try. I like regular Oreos I will probably like these too. 

I opened the package on the walk home. The cookie part had no lemon flavor, it was like one of those regular 'Golden' Oreos. The filling was okay. It had a mild lemon flavor but not what I was hoping for. Is it Oreo's that are disappointing or my high expectations? Obviously this is a huge company and making a mass market appeal cookie is going to be the priority, not trying to ease the longing of the few people in the world who are trying to rediscover and idealized moment. I understand in psychology, some people are maximizers and some are satisficers. This is one of the times I am a maximizer. I don't want to be, because maximizers are always looking for the best. But the rub is that even when they find it, they have a comparatively less enjoyable experience than satisficers. So I am fated to fail?

I don't know what specific lemon cookie from my past set this high, yet seemingly unachievable, bar. But its memory drives my continued search. It might be that I am nostalgic or have unrealistic expections. Anyway if anyone knows of lemon cookie they really enjoy I'd love to hear about it.
There are some lemon cookies I like. These [are great](https://www.tatesbakeshop.com/cookies/flavors/new-lemon-cookies) but they don't have any icing.


**Update:**

I am happy to report that I have found a lemon treat that satisfies my craving! While technically not a cookie, the [Bonne Maman Lemon Tartlets](https://bonnemaman.us/products/bonne-maman-raspberry-tartlets-copy) have a delightful lemon flavor in the shortbread crust that is exactly what I was looking for. The lemon filling is great, not the icing I was thinking I was looking for but very nice.  Almost like a little creme brulee. Weirdly the link is mislabeled as "Raspberry Tartlets" but the image and product description confirm they are indeed lemon tartlets.

<figure style="text-align: center;">
  <img src="https://bonnemaman.us/cdn/shop/products/Raspberry_copy_1024x1024.png?v=1614638290" alt="Bonne Maman Raspberry Tartlets" style="width: 300px; height: auto;">
  <figcaption style="font-size: smaller; color: gray;">The end of my quest? Bonne Maman Raspberry Tartlets</figcaption>
</figure>

So, for now, my quest has come to a satisfying end. Maybe I am not fated to be a perpetually unsatisified maximizer, there is hope. However, I am always open to trying other lemon cookies, so please keep the recommendations coming!`, "src/content/blog/2025-05-29-Lemon-labor-lost.md", "2eb9b87796cd401d", { html: 243, metadata: 244 }, '<figure style="text-align: center;">\n  <img src="/img/lemon-hamlet.png" alt="Twas but a cookie, with lemon" style="width: 400px; height: auto;">\n  <figcaption style="font-size: smaller; color: gray;">Twas a cookie, with scant but the scent of a lemon.</figcaption>\n</figure>\n<p>For weeks now, I’ve been on a quiet, personal quest: the search for the perfect lemon cookie. It’s not some grand, dramatic saga; it’s just a simple desire to find that one, cookie that delivers a bright, zesty, and utterly satisfying lemon experience. No, I don’t know what is wrong with me. I just want what I want.</p>\n<p>So for a while now, I have been going to different grocery stores and looking for lemon cookie mixes or lemon-flavored cookies. On one trip, the only ones with icing I could find were <a href="https://www.oreo.com/products/oreo-lemon-cookies?Size=2+Pack">lemon Oreos</a>. I thought, well if this is the only one’s they have, I will give them a try. I like regular Oreos I will probably like these too.</p>\n<p>I opened the package on the walk home. The cookie part had no lemon flavor, it was like one of those regular ‘Golden’ Oreos. The filling was okay. It had a mild lemon flavor but not what I was hoping for. Is it Oreo’s that are disappointing or my high expectations? Obviously this is a huge company and making a mass market appeal cookie is going to be the priority, not trying to ease the longing of the few people in the world who are trying to rediscover and idealized moment. I understand in psychology, some people are maximizers and some are satisficers. This is one of the times I am a maximizer. I don’t want to be, because maximizers are always looking for the best. But the rub is that even when they find it, they have a comparatively less enjoyable experience than satisficers. So I am fated to fail?</p>\n<p>I don’t know what specific lemon cookie from my past set this high, yet seemingly unachievable, bar. But its memory drives my continued search. It might be that I am nostalgic or have unrealistic expections. Anyway if anyone knows of lemon cookie they really enjoy I’d love to hear about it.\nThere are some lemon cookies I like. These <a href="https://www.tatesbakeshop.com/cookies/flavors/new-lemon-cookies">are great</a> but they don’t have any icing.</p>\n<p><strong>Update:</strong></p>\n<p>I am happy to report that I have found a lemon treat that satisfies my craving! While technically not a cookie, the <a href="https://bonnemaman.us/products/bonne-maman-raspberry-tartlets-copy">Bonne Maman Lemon Tartlets</a> have a delightful lemon flavor in the shortbread crust that is exactly what I was looking for. The lemon filling is great, not the icing I was thinking I was looking for but very nice.  Almost like a little creme brulee. Weirdly the link is mislabeled as “Raspberry Tartlets” but the image and product description confirm they are indeed lemon tartlets.</p>\n<figure style="text-align: center;">\n  <img src="https://bonnemaman.us/cdn/shop/products/Raspberry_copy_1024x1024.png?v=1614638290" alt="Bonne Maman Raspberry Tartlets" style="width: 300px; height: auto;">\n  <figcaption style="font-size: smaller; color: gray;">The end of my quest? Bonne Maman Raspberry Tartlets</figcaption>\n</figure>\n<p>So, for now, my quest has come to a satisfying end. Maybe I am not fated to be a perpetually unsatisified maximizer, there is hope. However, I am always open to trying other lemon cookies, so please keep the recommendations coming!</p>', { headings: 245, localImagePaths: 246, remoteImagePaths: 247, frontmatter: 248, imagePaths: 252 }, [], [], [], { title: 228, categories: 249, tags: 250, pubDate: 251, description: 229 }, [237, 238], [232, 233, 234, 235], "2025-05-29 12:00:00 -0400", [], "2025-05-29-Lemon-labor-lost.md", "2025-06-01-next-train-to-alberquerque", { id: 254, data: 256, body: 267, filePath: 268, digest: 269, rendered: 270, legacyId: 290 }, { title: 257, description: 258, pubDate: 259, tags: 260, categories: 265 }, "Next Train to Alberquerque: Track NYC Subway Arrivals in Real-Time with Python", "A post about Next Train to Alberquerque: Track NYC Subway Arrivals in Real-Time with Python.", ["Date", "2025-06-01T16:00:00.000Z"], [261, 262, 263, 200, 264], "MTA", "subway", "GTFS-Realtime", "data", [266, 200], "Data Engineering", `<figure style="text-align: center;">
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
    *   \`requests\`: For fetching data from the web.
    *   \`gtfs-realtime-bindings\`: For making sense of the MTA's real-time data format.

You can install these by opening your terminal or command prompt and typing:

\`\`\`\`bash
pip install requests
pip install gtfs-realtime-bindings
\`\`\`\`

##  Behind the Scenes: MTA & GTFS-Realtime

The Metropolitan Transportation Authority (MTA) generously provides real-time data feeds for its services. This data uses a standard called GTFS-Realtime. Think of GTFS (General Transit Feed Specification) as a universal language for public transportation schedules, and GTFS-Realtime as the live, up-to-the-minute updates to those schedules (like delays, changed arrival times, and vehicle positions).

This data is typically provided in a compact format called Protocol Buffers, which is where our gtfs-realtime-bindings library comes in handy to parse it.


The MTA has different feeds for different sets of subway lines. For our main example, we'll use the feed for the N, Q, R, W lines, but I'll show you how to find others too.

## The python script

Let's look at a Python script that checks for a northbound Q train arriving at Newkirk Plaza. Then, we'll break down how to modify it.

\`\`\`python
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
    print("---------------------------------------------------\\n")

if __name__ == "__main__":
    while True:
        check_train_arrivals()
        # How often to check (in seconds)
        # MTA feeds update frequently, but every 30-60 seconds is reasonable
        time.sleep(30)
\`\`\``, "src/content/blog/2025-06-01-Next-Train-To-Alberquerque.md", "1901fb94eb54bfbc", { html: 271, metadata: 272 }, `<figure style="text-align: center;">
  <img src="/img/next_train.png" alt="Twas but a cookie, with lemon" style="width: 400px; height: auto;">
  <figcaption style="font-size: smaller; color: gray;">If only there was a better way.</figcaption>
</figure>
<p>Tired of anxiously peering down a dark subway tunnel, wondering when your train will actually arrive, or opening an app that asks you to scroll through every line to find the one you need?</p>
<p>With a bit of Python and access to the MTA’s live data, you can build your own simple subway arrival tracker.  I have heard of some nice projects that people have used to keep a little sign in their apartment that tells them when the next train is coming.  If you are instested in that, this will help get you started.  The MTA used to require an API key for accessing their real-time data, but now you can access it freely. Which is exactly one less thnig you need to worry about.</p>
<p>This post will guide you through:</p>
<ul>
<li>Fetching live data from the MTA.</li>
<li>Understanding the basics of GTFS-Realtime (the data format).</li>
<li>Writing a Python script to find specific train arrivals.</li>
<li>Most importantly, how to customize this script for YOUR station, YOUR line, and YOUR commute!</li>
</ul>
<p>I would recommend getting the code to run first and then customizing it to your local stations.  Once you have a working script you can see how the see how your changes affect the output.</p>
<h2 id="what-youll-need">What You’ll Need</h2>
<ul>
<li><strong>Python:</strong> If you don’t have it, download it from python.org.</li>
<li><strong>Basic Python Knowledge:</strong> You should be comfortable with variables, functions, loops, and conditional statements.</li>
<li><strong>Two Python Libraries:</strong>
<ul>
<li><code>requests</code>: For fetching data from the web.</li>
<li><code>gtfs-realtime-bindings</code>: For making sense of the MTA’s real-time data format.</li>
</ul>
</li>
</ul>
<p>You can install these by opening your terminal or command prompt and typing:</p>
<pre class="astro-code github-dark" style="background-color:#24292e;color:#e1e4e8; overflow-x: auto;" tabindex="0" data-language="bash"><code><span class="line"><span style="color:#B392F0">pip</span><span style="color:#9ECBFF"> install</span><span style="color:#9ECBFF"> requests</span></span>
<span class="line"><span style="color:#B392F0">pip</span><span style="color:#9ECBFF"> install</span><span style="color:#9ECBFF"> gtfs-realtime-bindings</span></span></code></pre>
<h2 id="behind-the-scenes-mta--gtfs-realtime">Behind the Scenes: MTA &#x26; GTFS-Realtime</h2>
<p>The Metropolitan Transportation Authority (MTA) generously provides real-time data feeds for its services. This data uses a standard called GTFS-Realtime. Think of GTFS (General Transit Feed Specification) as a universal language for public transportation schedules, and GTFS-Realtime as the live, up-to-the-minute updates to those schedules (like delays, changed arrival times, and vehicle positions).</p>
<p>This data is typically provided in a compact format called Protocol Buffers, which is where our gtfs-realtime-bindings library comes in handy to parse it.</p>
<p>The MTA has different feeds for different sets of subway lines. For our main example, we’ll use the feed for the N, Q, R, W lines, but I’ll show you how to find others too.</p>
<h2 id="the-python-script">The python script</h2>
<p>Let’s look at a Python script that checks for a northbound Q train arriving at Newkirk Plaza. Then, we’ll break down how to modify it.</p>
<pre class="astro-code github-dark" style="background-color:#24292e;color:#e1e4e8; overflow-x: auto;" tabindex="0" data-language="python"><code><span class="line"><span style="color:#F97583">import</span><span style="color:#E1E4E8"> requests</span></span>
<span class="line"><span style="color:#F97583">from</span><span style="color:#E1E4E8"> google.transit </span><span style="color:#F97583">import</span><span style="color:#E1E4E8"> gtfs_realtime_pb2</span></span>
<span class="line"><span style="color:#F97583">import</span><span style="color:#E1E4E8"> time </span><span style="color:#6A737D"># To interpret timestamps</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">## --- CONFIGURATION: YOU'LL CHANGE THIS! ---</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">## Find other feed URLs here: </span></span>
<span class="line"><span style="color:#E1E4E8">https:</span><span style="color:#F97583">//</span><span style="color:#E1E4E8">api.mta.info</span><span style="color:#F97583">/</span><span style="color:#6A737D">#/System%20Data/TripUpdates/get_tripUpdatesByRoute</span></span>
<span class="line"><span style="color:#6A737D">## Example: NQRW lines</span></span>
<span class="line"><span style="color:#79B8FF">TRANSIT_FEED_URL</span><span style="color:#F97583"> =</span><span style="color:#9ECBFF"> "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct</span><span style="color:#79B8FF">%2F</span><span style="color:#9ECBFF">gtfs-nqrw"</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">## For direction: "N" for Northbound, "S" for Southbound (used in trip_id convention)</span></span>
<span class="line"><span style="color:#79B8FF">DIRECTION_ABBREVIATION</span><span style="color:#F97583"> =</span><span style="color:#9ECBFF"> "N"</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">## CRITICAL: Find your stop_id from MTA's static GTFS data (stops.txt)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">## Example: Newkirk Plaza Northbound on Brighton Line (Q)</span></span>
<span class="line"><span style="color:#79B8FF">TARGET_STOP_ID</span><span style="color:#F97583"> =</span><span style="color:#9ECBFF"> "D22N"</span></span>
<span class="line"><span style="color:#79B8FF">TARGET_STATION_NAME</span><span style="color:#F97583"> =</span><span style="color:#9ECBFF"> "Newkirk Plaza"</span><span style="color:#6A737D"> # For print messages</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">## How many minutes in advance do you want to be notified? (e.g., 30 minutes)</span></span>
<span class="line"><span style="color:#79B8FF">ARRIVAL_WINDOW_MINUTES</span><span style="color:#F97583"> =</span><span style="color:#79B8FF"> 30</span></span>
<span class="line"><span style="color:#6A737D">## --- END CONFIGURATION ---</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">def</span><span style="color:#B392F0"> get_live_mta_data</span><span style="color:#E1E4E8">(url):</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">    try</span><span style="color:#E1E4E8">:</span></span>
<span class="line"><span style="color:#E1E4E8">        response </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> requests.get(url)</span></span>
<span class="line"><span style="color:#E1E4E8">        response.raise_for_status()</span></span>
<span class="line"><span style="color:#F97583">        return</span><span style="color:#E1E4E8"> response.content</span></span>
<span class="line"><span style="color:#F97583">    except</span><span style="color:#E1E4E8"> requests.exceptions.RequestException </span><span style="color:#F97583">as</span><span style="color:#E1E4E8"> e:</span></span>
<span class="line"><span style="color:#79B8FF">        print</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">f</span><span style="color:#9ECBFF">"Error fetching MTA data: </span><span style="color:#79B8FF">{</span><span style="color:#E1E4E8">e</span><span style="color:#79B8FF">}</span><span style="color:#9ECBFF">"</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#F97583">        return</span><span style="color:#79B8FF"> None</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">def</span><span style="color:#B392F0"> parse_gtfs_realtime_feed</span><span style="color:#E1E4E8">(feed_content):</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">    feed </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> gtfs_realtime_pb2.FeedMessage()</span></span>
<span class="line"><span style="color:#E1E4E8">    feed.ParseFromString(feed_content)</span></span>
<span class="line"><span style="color:#F97583">    return</span><span style="color:#E1E4E8"> feed</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">def</span><span style="color:#B392F0"> check_train_arrivals</span><span style="color:#E1E4E8">():</span></span>
<span class="line"><span style="color:#6A737D">    #Checks for specified train arrivals at the target stop.</span></span>
<span class="line"><span style="color:#E1E4E8">    raw_feed </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> get_live_mta_data(</span><span style="color:#79B8FF">TRANSIT_FEED_URL</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#F97583">    if</span><span style="color:#F97583"> not</span><span style="color:#E1E4E8"> raw_feed:</span></span>
<span class="line"><span style="color:#79B8FF">        print</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"Could not fetch MTA feed."</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#F97583">        return</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">    feed </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> parse_gtfs_realtime_feed(raw_feed)</span></span>
<span class="line"><span style="color:#E1E4E8">    now </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> time.time()</span></span>
<span class="line"><span style="color:#E1E4E8">    found_arrival </span><span style="color:#F97583">=</span><span style="color:#79B8FF"> False</span></span>
<span class="line"></span>
<span class="line"><span style="color:#79B8FF">    print</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">f</span><span style="color:#9ECBFF">"--- Checking arrivals for Route </span><span style="color:#79B8FF">{ROUTE_ID_TO_CHECK}</span><span style="color:#9ECBFF"> (</span><span style="color:#79B8FF">{DIRECTION_ABBREVIATION}</span><span style="color:#9ECBFF">B) at </span><span style="color:#79B8FF">{TARGET_STATION_NAME}</span><span style="color:#9ECBFF"> (</span><span style="color:#79B8FF">{TARGET_STOP_ID}</span><span style="color:#9ECBFF">) ---"</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#79B8FF">    print</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">f</span><span style="color:#9ECBFF">"Current time: </span><span style="color:#79B8FF">{</span><span style="color:#E1E4E8">time.strftime(</span><span style="color:#9ECBFF">'%I:%M:%S %p'</span><span style="color:#E1E4E8">)</span><span style="color:#79B8FF">}</span><span style="color:#9ECBFF">"</span><span style="color:#E1E4E8">)</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">    for</span><span style="color:#E1E4E8"> entity </span><span style="color:#F97583">in</span><span style="color:#E1E4E8"> feed.entity:</span></span>
<span class="line"><span style="color:#F97583">        if</span><span style="color:#E1E4E8"> entity.HasField(</span><span style="color:#9ECBFF">'trip_update'</span><span style="color:#E1E4E8">):</span></span>
<span class="line"><span style="color:#E1E4E8">            trip_update </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> entity.trip_update</span></span>
<span class="line"><span style="color:#E1E4E8">            trip </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> trip_update.trip</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">            # 1. Check for the correct Route ID</span></span>
<span class="line"><span style="color:#F97583">            if</span><span style="color:#E1E4E8"> trip.route_id </span><span style="color:#F97583">==</span><span style="color:#79B8FF"> ROUTE_ID_TO_CHECK</span><span style="color:#E1E4E8">:</span></span>
<span class="line"><span style="color:#6A737D">                # 2. Check for Direction (using trip_id convention)</span></span>
<span class="line"><span style="color:#6A737D">                # MTA trip_ids often have '..N' or '..S' in the last segment</span></span>
<span class="line"><span style="color:#6A737D">                # e.g., "A20230515WKD_000800_Q..N03R"</span></span>
<span class="line"><span style="color:#E1E4E8">                is_correct_direction </span><span style="color:#F97583">=</span><span style="color:#79B8FF"> False</span></span>
<span class="line"><span style="color:#F97583">                try</span><span style="color:#E1E4E8">:</span></span>
<span class="line"><span style="color:#6A737D">                    # Trip ID structure can vary. This is a common MTA pattern.</span></span>
<span class="line"><span style="color:#6A737D">                    # Example: some_prefix_ROUTEID..DIRECTIONcode_suffix</span></span>
<span class="line"><span style="color:#F97583">                    if</span><span style="color:#9ECBFF"> ".."</span><span style="color:#F97583"> in</span><span style="color:#E1E4E8"> trip.trip_id:</span></span>
<span class="line"><span style="color:#E1E4E8">                        parts </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> trip.trip_id.split(</span><span style="color:#9ECBFF">".."</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#F97583">                        if</span><span style="color:#79B8FF"> len</span><span style="color:#E1E4E8">(parts) </span><span style="color:#F97583">></span><span style="color:#79B8FF"> 1</span><span style="color:#F97583"> and</span><span style="color:#E1E4E8"> parts[</span><span style="color:#F97583">-</span><span style="color:#79B8FF">1</span><span style="color:#E1E4E8">].startswith(</span><span style="color:#79B8FF">DIRECTION_ABBREVIATION</span><span style="color:#E1E4E8">):</span></span>
<span class="line"><span style="color:#E1E4E8">                            is_correct_direction </span><span style="color:#F97583">=</span><span style="color:#79B8FF"> True</span></span>
<span class="line"><span style="color:#6A737D">                    # Fallback for simpler trip_ids like those on LIRR/MetroNorth if adapting later</span></span>
<span class="line"><span style="color:#6A737D">                    # elif trip.trip_id.endswith(DIRECTION_ABBREVIATION):</span></span>
<span class="line"><span style="color:#6A737D">                    # is_correct_direction = True</span></span>
<span class="line"><span style="color:#F97583">                except</span><span style="color:#79B8FF"> Exception</span><span style="color:#F97583"> as</span><span style="color:#E1E4E8"> e:</span></span>
<span class="line"><span style="color:#6A737D">                    # print(f"Could not parse trip_id for direction: {trip.trip_id} - {e}")</span></span>
<span class="line"><span style="color:#F97583">                    pass</span><span style="color:#6A737D"> # Continue, maybe rely on stop_id direction if specific enough</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">                # If direction is confirmed or stop_id itself is direction-specific</span></span>
<span class="line"><span style="color:#F97583">                if</span><span style="color:#E1E4E8"> is_correct_direction </span><span style="color:#F97583">or</span><span style="color:#79B8FF"> TARGET_STOP_ID</span><span style="color:#E1E4E8">.endswith(</span><span style="color:#79B8FF">DIRECTION_ABBREVIATION</span><span style="color:#E1E4E8">):</span></span>
<span class="line"><span style="color:#F97583">                    for</span><span style="color:#E1E4E8"> stop_time_update </span><span style="color:#F97583">in</span><span style="color:#E1E4E8"> trip_update.stop_time_update:</span></span>
<span class="line"><span style="color:#6A737D">                        # 3. Check for the Target Stop ID</span></span>
<span class="line"><span style="color:#F97583">                        if</span><span style="color:#E1E4E8"> stop_time_update.stop_id </span><span style="color:#F97583">==</span><span style="color:#79B8FF"> TARGET_STOP_ID</span><span style="color:#E1E4E8">:</span></span>
<span class="line"><span style="color:#E1E4E8">                            arrival </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> stop_time_update.arrival</span></span>
<span class="line"><span style="color:#F97583">                            if</span><span style="color:#E1E4E8"> arrival </span><span style="color:#F97583">and</span><span style="color:#E1E4E8"> arrival.time </span><span style="color:#F97583">></span><span style="color:#79B8FF"> 0</span><span style="color:#E1E4E8">: </span><span style="color:#6A737D"># Ensure arrival time exists</span></span>
<span class="line"><span style="color:#E1E4E8">                                arrival_time_unix </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> arrival.time</span></span>
<span class="line"><span style="color:#E1E4E8">                                time_to_arrival_seconds </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> arrival_time_unix </span><span style="color:#F97583">-</span><span style="color:#E1E4E8"> now</span></span>
<span class="line"><span style="color:#E1E4E8">                                arrival_time_readable </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> time.strftime(</span><span style="color:#9ECBFF">'%I:%M:%S %p'</span><span style="color:#E1E4E8">, time.localtime(arrival_time_unix))</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">                                if</span><span style="color:#79B8FF"> 0</span><span style="color:#F97583"> &#x3C;=</span><span style="color:#E1E4E8"> time_to_arrival_seconds </span><span style="color:#F97583">&#x3C;=</span><span style="color:#E1E4E8"> (</span><span style="color:#79B8FF">ARRIVAL_WINDOW_MINUTES</span><span style="color:#F97583"> *</span><span style="color:#79B8FF"> 60</span><span style="color:#E1E4E8">):</span></span>
<span class="line"><span style="color:#E1E4E8">                                    minutes_to_arrival </span><span style="color:#F97583">=</span><span style="color:#79B8FF"> round</span><span style="color:#E1E4E8">(time_to_arrival_seconds </span><span style="color:#F97583">/</span><span style="color:#79B8FF"> 60</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#79B8FF">                                    print</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">f</span><span style="color:#9ECBFF">"  ALERT! </span><span style="color:#79B8FF">{ROUTE_ID_TO_CHECK}</span><span style="color:#9ECBFF"> train (</span><span style="color:#79B8FF">{DIRECTION_ABBREVIATION}</span><span style="color:#9ECBFF">B) for </span><span style="color:#79B8FF">{TARGET_STATION_NAME}</span><span style="color:#9ECBFF">"</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#79B8FF">                                    print</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">f</span><span style="color:#9ECBFF">"    Trip ID: </span><span style="color:#79B8FF">{</span><span style="color:#E1E4E8">trip.trip_id</span><span style="color:#79B8FF">}</span><span style="color:#9ECBFF">"</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#79B8FF">                                    print</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">f</span><span style="color:#9ECBFF">"    Estimated Arrival: </span><span style="color:#79B8FF">{</span><span style="color:#E1E4E8">arrival_time_readable</span><span style="color:#79B8FF">}</span><span style="color:#9ECBFF"> (in approx. </span><span style="color:#79B8FF">{</span><span style="color:#E1E4E8">minutes_to_arrival</span><span style="color:#79B8FF">}</span><span style="color:#9ECBFF"> min)"</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#E1E4E8">                                    found_arrival </span><span style="color:#F97583">=</span><span style="color:#79B8FF"> True</span></span>
<span class="line"><span style="color:#F97583">                                elif</span><span style="color:#E1E4E8"> time_to_arrival_seconds </span><span style="color:#F97583">&#x3C;</span><span style="color:#79B8FF"> 0</span><span style="color:#F97583"> and</span><span style="color:#E1E4E8"> time_to_arrival_seconds </span><span style="color:#F97583">></span><span style="color:#F97583"> -</span><span style="color:#79B8FF">120</span><span style="color:#E1E4E8">: </span><span style="color:#6A737D"># Just arrived (within last 2 mins)</span></span>
<span class="line"><span style="color:#79B8FF">                                    print</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">f</span><span style="color:#9ECBFF">"  INFO: </span><span style="color:#79B8FF">{ROUTE_ID_TO_CHECK}</span><span style="color:#9ECBFF"> train (</span><span style="color:#79B8FF">{DIRECTION_ABBREVIATION}</span><span style="color:#9ECBFF">B) likely JUST ARRIVED/AT </span><span style="color:#79B8FF">{TARGET_STATION_NAME}</span><span style="color:#9ECBFF">."</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#79B8FF">                                    print</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">f</span><span style="color:#9ECBFF">"    Scheduled arrival was </span><span style="color:#79B8FF">{</span><span style="color:#E1E4E8">arrival_time_readable</span><span style="color:#79B8FF">}</span><span style="color:#9ECBFF">."</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#E1E4E8">                                    found_arrival </span><span style="color:#F97583">=</span><span style="color:#79B8FF"> True</span></span>
<span class="line"><span style="color:#F97583">                            break</span><span style="color:#6A737D"> # Found our stop for this trip, move to next trip entity</span></span>
<span class="line"><span style="color:#E1E4E8">    </span></span>
<span class="line"><span style="color:#F97583">    if</span><span style="color:#F97583"> not</span><span style="color:#E1E4E8"> found_arrival:</span></span>
<span class="line"><span style="color:#79B8FF">        print</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">f</span><span style="color:#9ECBFF">"No </span><span style="color:#79B8FF">{ROUTE_ID_TO_CHECK}</span><span style="color:#9ECBFF"> trains (</span><span style="color:#79B8FF">{DIRECTION_ABBREVIATION}</span><span style="color:#9ECBFF">B) currently reporting an upcoming arrival at </span><span style="color:#79B8FF">{TARGET_STATION_NAME}</span><span style="color:#9ECBFF"> within </span><span style="color:#79B8FF">{ARRIVAL_WINDOW_MINUTES}</span><span style="color:#9ECBFF"> minutes."</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#79B8FF">    print</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"---------------------------------------------------</span><span style="color:#79B8FF">\\n</span><span style="color:#9ECBFF">"</span><span style="color:#E1E4E8">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">if</span><span style="color:#79B8FF"> __name__</span><span style="color:#F97583"> ==</span><span style="color:#9ECBFF"> "__main__"</span><span style="color:#E1E4E8">:</span></span>
<span class="line"><span style="color:#F97583">    while</span><span style="color:#79B8FF"> True</span><span style="color:#E1E4E8">:</span></span>
<span class="line"><span style="color:#E1E4E8">        check_train_arrivals()</span></span>
<span class="line"><span style="color:#6A737D">        # How often to check (in seconds)</span></span>
<span class="line"><span style="color:#6A737D">        # MTA feeds update frequently, but every 30-60 seconds is reasonable</span></span>
<span class="line"><span style="color:#E1E4E8">        time.sleep(</span><span style="color:#79B8FF">30</span><span style="color:#E1E4E8">)</span></span></code></pre>`, { headings: 273, localImagePaths: 283, remoteImagePaths: 284, frontmatter: 285, imagePaths: 289 }, [274, 277, 280], { depth: 53, slug: 275, text: 276 }, "what-youll-need", "What You’ll Need", { depth: 53, slug: 278, text: 279 }, "behind-the-scenes-mta--gtfs-realtime", "Behind the Scenes: MTA & GTFS-Realtime", { depth: 53, slug: 281, text: 282 }, "the-python-script", "The python script", [], [], { title: 257, categories: 286, tags: 287, pubDate: 288, description: 258 }, [266, 200], [261, 262, 263, 200, 264], "2025-06-01 12:00:00 -0400", [], "2025-06-01-Next-Train-To-Alberquerque.md", "2025-05-26-automated-sql-backups-to-google-drive", { id: 291, data: 293, body: 303, filePath: 304, digest: 305, rendered: 306, legacyId: 348 }, { title: 294, description: 295, pubDate: 296, tags: 297, categories: 301 }, "Automated SQL Backups to Google Drive with Python", "A post about Automated SQL Backups to Google Drive with Python.", ["Date", "2025-05-26T16:00:00.000Z"], [21, 298, 299, 300, 79], "google-drive", "backup", "sql", [82, 83, 302], "Databases", "Protecting your data is crucial, and having automated backups is a cornerstone of any robust data strategy. In this post, I'll walk you through a Python script that automatically backs up your SQL database (in `.gz` format) to Google Drive. This ensures your backups are stored securely offsite and are easily accessible when needed.  As always there are a lot of cateats to consider, like over using your Google Drive storage quota, in this case my total backups are less than 1GB.  A service like [rclone](https://rclone.org/) can you help you manage your backups with Google Drive and other cloud stoarge providers. without having to write your own code. This is a longer process and it involves running a cron job to fully automate. \n\nI usually advocate for the simple and straightforward approach, but in this case, I think there is value in scripting the process.  Both for learning and flexibility. There are a lot of great tools for backing up your files, they can also consume a lot of resources.\n\n\n## Why Automate Backups to Google Drive?\n\n*   **Offsite Storage:** Google Drive provides a secure and reliable offsite location for your backups, protecting against local hardware failures or disasters.\n*   **Automation:** Automating the backup process ensures that backups are performed regularly without manual intervention.\n*   **Version History:** Google Drive keeps a history of file versions, allowing you to restore to a specific point in time if necessary.\n*   **Accessibility:** Your backups are accessible from anywhere with an internet connection.\n\n## Prerequisites\n\nBefore you begin, make sure you have the following:\n\n*   **Python 3.7+:** Ensure you have Python installed.\n*   **Google Cloud Project:** You'll need a Google Cloud project with the Google Drive API enabled.\n*   **Service Account:** Create a service account in your Google Cloud project and download the JSON key file. This key file will be used to authenticate your script with Google Drive.\n*   **Required Python Libraries:** Install the necessary libraries using pip:\n\n    ```bash\n    pip install google-api-python-client google-auth-httplib2 google-auth-oauthlib\n    ```\n\n## The Python Script: Automating the Backup\n\nHere's the Python script that handles the automated backup process. I've added comments inline to explain each step.  You need to combine the steps into a single script, and you can run it manually or set it up to run on a schedule using cron or another task scheduler.\n\n```python\nimport os\nimport glob\nimport datetime\nfrom google.oauth2.service_account import Credentials\nfrom googleapiclient.discovery import build\nfrom googleapiclient.http import MediaFileUpload\nfrom googleapiclient.errors import HttpError\n``` \n### --- CONFIGURATION ---\n```python\nLOCAL_BACKUP_DIRECTORY = \"/home/files/folders/nestedfolder/db_backups\"  # Directory containing .gz backups\nFILE_PATTERN = \"*.gz\"  # Pattern to match .gz files\nGOOGLE_DRIVE_FOLDER_ID = \"YOUR_GOOGLE_DRIVE_FOLDER_ID\"  # Replace with your Google Drive folder ID\nSERVICE_ACCOUNT_FILE = \"path/to/your/service_account.json\"  # Path to your service account key file\n``` \n\n### --- AUTHENTICATION ---\n```python\nSCOPES = ['https://www.googleapis.com/auth/drive.file']  # Scope for Google Drive access\ncredentials = Credentials.from_service_account_file(SERVICE_ACCOUNT_FILE, scopes=SCOPES)  # Authenticate with service account\nservice = build('drive', 'v3', credentials=credentials)  # Build the Google Drive service\n``` \n\n### --- UPLOAD FUNCTION ---\n\n```python\ndef upload_backup(filename, folder_id):\n    #Uploads a file to Google Drive.\n    file_metadata = {'name': filename, 'parents': [folder_id]}  # Metadata for the file\n    media = MediaFileUpload(filename, mimetype='application/gzip', resumable=True)  # File to upload\n    try:\n        file = service.files().create(body=file_metadata, media=media, fields='id').execute()  # Upload the file\n        print(f\"File ID: {file.get('id')} uploaded successfully.\")  # Print success message\n    except HttpError as error:\n        print(f\"An error occurred: {error}\")  # Print error message\n``` \n\n### --- MAIN FUNCTION ---\n\n```python   \n\ndef main():\n    #Main function to find backup files and upload them.\n    files = glob.glob(os.path.join(LOCAL_BACKUP_DIRECTORY, FILE_PATTERN))  # Find all .gz files\n    if not files:\n        print(\"No backup files found.\")  # If no files found, print message\n        return\n\n    for filepath in files:  # Loop through each file\n        filename = os.path.basename(filepath)  # Get the filename\n        print(f\"Uploading {filename}...\")  # Print uploading message\n        upload_backup(filepath, GOOGLE_DRIVE_FOLDER_ID)  # Upload the file\n\nif __name__ == \"__main__\":\n    main()  # Run the main function\n\n```\n\n## Automating the Backup Process with Cron\n\nTo automate the backup process, you can use a cron job (on Linux/macOS). Cron allows you to schedule tasks to run automatically at specific intervals.\n\n### Setting Up a Cron Job\n\n1.  **Open the Crontab File:**\n\n    Open your terminal and type the following command:\n\n    ```bash\n    crontab -e\n    ```\n\n    This will open the crontab file in a text editor. If this is your first time using `crontab`, you may be prompted to select an editor.\n\n2.  **Understand Crontab Syntax:**\n\n    Each line in the crontab file represents a scheduled task and follows this format:\n\n    ```\n    minute hour day_of_month month day_of_week command\n    ```\n\n    *   `minute`: (0-59)\n    *   `hour`: (0-23)\n    *   `day_of_month`: (1-31)\n    *   `month`: (1-12)\n    *   `day_of_week`: (0-6, 0 is Sunday)\n    *   `command`: The command to execute\n\n    You can use special characters:\n\n    *   `*`: Represents \"every\".\n    *   `,`: Specifies a list of values.\n    *   `-`: Specifies a range of values.\n    *   `/`: Specifies a step value.\n\n3.  **Add the Cron Job Entry:**\n\n    Add a line to the crontab file to schedule your Python script. For example, to run the script every day at 2:00 AM, add the following line:\n\n    ```\n    0 2 * * * python /path/to/your/script.py > /path/to/backup.log 2>&1\n    ```\n\n    *   `0 2 * * *`: This schedules the task to run at 2:00 AM every day.\n    *   `python /path/to/your/script.py`: This is the command to execute your Python script.  **Replace `/path/to/your/script.py` with the actual path to your script.**\n    *   `> /path/to/backup.log 2>&1`: This redirects the output of the script (both standard output and standard error) to a log file named `backup.log`.  This is helpful for troubleshooting.\n\n4.  **Save the Crontab File:**\n\n    Save the crontab file. The changes will be applied automatically.\n\n5.  **Verify the Cron Job:**\n\n    You can verify that the cron job has been added by running the following command:\n\n    ```bash\n    crontab -l\n    ```\n\n    This will list all the cron jobs in your crontab file.\n\n### Important Notes:\n\n*   **Full Paths:** Always use full paths to the `python` executable and your script in the cron job entry.\n*   **Logging:** Redirecting the output to a log file is highly recommended for debugging purposes.\n*   **Testing:** Test your cron job by setting it to run more frequently (e.g., every minute) and checking the log file to ensure that it's working correctly.\n\n### Example:\n\nTo run the backup script located at `/home/user/backup_script.py` every day at 3:30 AM and log the output to `/home/user/backup.log`, the cron job entry would be:\n\n```\n30 3 * * * python /home/user/backup_script.py > /home/user/backup.log 2>&1\n```", "src/content/blog/2025-05-26-Automated-SQL-Backups-to-Google-Drive.md", "4554f40ac9693b0b", { html: 307, metadata: 308 }, `<p>Protecting your data is crucial, and having automated backups is a cornerstone of any robust data strategy. In this post, I’ll walk you through a Python script that automatically backs up your SQL database (in <code>.gz</code> format) to Google Drive. This ensures your backups are stored securely offsite and are easily accessible when needed.  As always there are a lot of cateats to consider, like over using your Google Drive storage quota, in this case my total backups are less than 1GB.  A service like <a href="https://rclone.org/">rclone</a> can you help you manage your backups with Google Drive and other cloud stoarge providers. without having to write your own code. This is a longer process and it involves running a cron job to fully automate.</p>
<p>I usually advocate for the simple and straightforward approach, but in this case, I think there is value in scripting the process.  Both for learning and flexibility. There are a lot of great tools for backing up your files, they can also consume a lot of resources.</p>
<h2 id="why-automate-backups-to-google-drive">Why Automate Backups to Google Drive?</h2>
<ul>
<li><strong>Offsite Storage:</strong> Google Drive provides a secure and reliable offsite location for your backups, protecting against local hardware failures or disasters.</li>
<li><strong>Automation:</strong> Automating the backup process ensures that backups are performed regularly without manual intervention.</li>
<li><strong>Version History:</strong> Google Drive keeps a history of file versions, allowing you to restore to a specific point in time if necessary.</li>
<li><strong>Accessibility:</strong> Your backups are accessible from anywhere with an internet connection.</li>
</ul>
<h2 id="prerequisites">Prerequisites</h2>
<p>Before you begin, make sure you have the following:</p>
<ul>
<li>
<p><strong>Python 3.7+:</strong> Ensure you have Python installed.</p>
</li>
<li>
<p><strong>Google Cloud Project:</strong> You’ll need a Google Cloud project with the Google Drive API enabled.</p>
</li>
<li>
<p><strong>Service Account:</strong> Create a service account in your Google Cloud project and download the JSON key file. This key file will be used to authenticate your script with Google Drive.</p>
</li>
<li>
<p><strong>Required Python Libraries:</strong> Install the necessary libraries using pip:</p>
<pre class="astro-code github-dark" style="background-color:#24292e;color:#e1e4e8; overflow-x: auto;" tabindex="0" data-language="bash"><code><span class="line"><span style="color:#B392F0">pip</span><span style="color:#9ECBFF"> install</span><span style="color:#9ECBFF"> google-api-python-client</span><span style="color:#9ECBFF"> google-auth-httplib2</span><span style="color:#9ECBFF"> google-auth-oauthlib</span></span></code></pre>
</li>
</ul>
<h2 id="the-python-script-automating-the-backup">The Python Script: Automating the Backup</h2>
<p>Here’s the Python script that handles the automated backup process. I’ve added comments inline to explain each step.  You need to combine the steps into a single script, and you can run it manually or set it up to run on a schedule using cron or another task scheduler.</p>
<pre class="astro-code github-dark" style="background-color:#24292e;color:#e1e4e8; overflow-x: auto;" tabindex="0" data-language="python"><code><span class="line"><span style="color:#F97583">import</span><span style="color:#E1E4E8"> os</span></span>
<span class="line"><span style="color:#F97583">import</span><span style="color:#E1E4E8"> glob</span></span>
<span class="line"><span style="color:#F97583">import</span><span style="color:#E1E4E8"> datetime</span></span>
<span class="line"><span style="color:#F97583">from</span><span style="color:#E1E4E8"> google.oauth2.service_account </span><span style="color:#F97583">import</span><span style="color:#E1E4E8"> Credentials</span></span>
<span class="line"><span style="color:#F97583">from</span><span style="color:#E1E4E8"> googleapiclient.discovery </span><span style="color:#F97583">import</span><span style="color:#E1E4E8"> build</span></span>
<span class="line"><span style="color:#F97583">from</span><span style="color:#E1E4E8"> googleapiclient.http </span><span style="color:#F97583">import</span><span style="color:#E1E4E8"> MediaFileUpload</span></span>
<span class="line"><span style="color:#F97583">from</span><span style="color:#E1E4E8"> googleapiclient.errors </span><span style="color:#F97583">import</span><span style="color:#E1E4E8"> HttpError</span></span></code></pre>
<h3 id="----configuration---">--- CONFIGURATION ---</h3>
<pre class="astro-code github-dark" style="background-color:#24292e;color:#e1e4e8; overflow-x: auto;" tabindex="0" data-language="python"><code><span class="line"><span style="color:#79B8FF">LOCAL_BACKUP_DIRECTORY</span><span style="color:#F97583"> =</span><span style="color:#9ECBFF"> "/home/files/folders/nestedfolder/db_backups"</span><span style="color:#6A737D">  # Directory containing .gz backups</span></span>
<span class="line"><span style="color:#79B8FF">FILE_PATTERN</span><span style="color:#F97583"> =</span><span style="color:#9ECBFF"> "*.gz"</span><span style="color:#6A737D">  # Pattern to match .gz files</span></span>
<span class="line"><span style="color:#79B8FF">GOOGLE_DRIVE_FOLDER_ID</span><span style="color:#F97583"> =</span><span style="color:#9ECBFF"> "YOUR_GOOGLE_DRIVE_FOLDER_ID"</span><span style="color:#6A737D">  # Replace with your Google Drive folder ID</span></span>
<span class="line"><span style="color:#79B8FF">SERVICE_ACCOUNT_FILE</span><span style="color:#F97583"> =</span><span style="color:#9ECBFF"> "path/to/your/service_account.json"</span><span style="color:#6A737D">  # Path to your service account key file</span></span></code></pre>
<h3 id="----authentication---">--- AUTHENTICATION ---</h3>
<pre class="astro-code github-dark" style="background-color:#24292e;color:#e1e4e8; overflow-x: auto;" tabindex="0" data-language="python"><code><span class="line"><span style="color:#79B8FF">SCOPES</span><span style="color:#F97583"> =</span><span style="color:#E1E4E8"> [</span><span style="color:#9ECBFF">'https://www.googleapis.com/auth/drive.file'</span><span style="color:#E1E4E8">]  </span><span style="color:#6A737D"># Scope for Google Drive access</span></span>
<span class="line"><span style="color:#E1E4E8">credentials </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> Credentials.from_service_account_file(</span><span style="color:#79B8FF">SERVICE_ACCOUNT_FILE</span><span style="color:#E1E4E8">, </span><span style="color:#FFAB70">scopes</span><span style="color:#F97583">=</span><span style="color:#79B8FF">SCOPES</span><span style="color:#E1E4E8">)  </span><span style="color:#6A737D"># Authenticate with service account</span></span>
<span class="line"><span style="color:#E1E4E8">service </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> build(</span><span style="color:#9ECBFF">'drive'</span><span style="color:#E1E4E8">, </span><span style="color:#9ECBFF">'v3'</span><span style="color:#E1E4E8">, </span><span style="color:#FFAB70">credentials</span><span style="color:#F97583">=</span><span style="color:#E1E4E8">credentials)  </span><span style="color:#6A737D"># Build the Google Drive service</span></span></code></pre>
<h3 id="----upload-function---">--- UPLOAD FUNCTION ---</h3>
<pre class="astro-code github-dark" style="background-color:#24292e;color:#e1e4e8; overflow-x: auto;" tabindex="0" data-language="python"><code><span class="line"><span style="color:#F97583">def</span><span style="color:#B392F0"> upload_backup</span><span style="color:#E1E4E8">(filename, folder_id):</span></span>
<span class="line"><span style="color:#6A737D">    #Uploads a file to Google Drive.</span></span>
<span class="line"><span style="color:#E1E4E8">    file_metadata </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> {</span><span style="color:#9ECBFF">'name'</span><span style="color:#E1E4E8">: filename, </span><span style="color:#9ECBFF">'parents'</span><span style="color:#E1E4E8">: [folder_id]}  </span><span style="color:#6A737D"># Metadata for the file</span></span>
<span class="line"><span style="color:#E1E4E8">    media </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> MediaFileUpload(filename, </span><span style="color:#FFAB70">mimetype</span><span style="color:#F97583">=</span><span style="color:#9ECBFF">'application/gzip'</span><span style="color:#E1E4E8">, </span><span style="color:#FFAB70">resumable</span><span style="color:#F97583">=</span><span style="color:#79B8FF">True</span><span style="color:#E1E4E8">)  </span><span style="color:#6A737D"># File to upload</span></span>
<span class="line"><span style="color:#F97583">    try</span><span style="color:#E1E4E8">:</span></span>
<span class="line"><span style="color:#FFAB70">        file</span><span style="color:#F97583"> =</span><span style="color:#E1E4E8"> service.files().create(</span><span style="color:#FFAB70">body</span><span style="color:#F97583">=</span><span style="color:#E1E4E8">file_metadata, </span><span style="color:#FFAB70">media</span><span style="color:#F97583">=</span><span style="color:#E1E4E8">media, </span><span style="color:#FFAB70">fields</span><span style="color:#F97583">=</span><span style="color:#9ECBFF">'id'</span><span style="color:#E1E4E8">).execute()  </span><span style="color:#6A737D"># Upload the file</span></span>
<span class="line"><span style="color:#79B8FF">        print</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">f</span><span style="color:#9ECBFF">"File ID: </span><span style="color:#79B8FF">{</span><span style="color:#FFAB70">file</span><span style="color:#E1E4E8">.get(</span><span style="color:#9ECBFF">'id'</span><span style="color:#E1E4E8">)</span><span style="color:#79B8FF">}</span><span style="color:#9ECBFF"> uploaded successfully."</span><span style="color:#E1E4E8">)  </span><span style="color:#6A737D"># Print success message</span></span>
<span class="line"><span style="color:#F97583">    except</span><span style="color:#E1E4E8"> HttpError </span><span style="color:#F97583">as</span><span style="color:#E1E4E8"> error:</span></span>
<span class="line"><span style="color:#79B8FF">        print</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">f</span><span style="color:#9ECBFF">"An error occurred: </span><span style="color:#79B8FF">{</span><span style="color:#E1E4E8">error</span><span style="color:#79B8FF">}</span><span style="color:#9ECBFF">"</span><span style="color:#E1E4E8">)  </span><span style="color:#6A737D"># Print error message</span></span></code></pre>
<h3 id="----main-function---">--- MAIN FUNCTION ---</h3>
<pre class="astro-code github-dark" style="background-color:#24292e;color:#e1e4e8; overflow-x: auto;" tabindex="0" data-language="python"><code><span class="line"></span>
<span class="line"><span style="color:#F97583">def</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">():</span></span>
<span class="line"><span style="color:#6A737D">    #Main function to find backup files and upload them.</span></span>
<span class="line"><span style="color:#E1E4E8">    files </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> glob.glob(os.path.join(</span><span style="color:#79B8FF">LOCAL_BACKUP_DIRECTORY</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">FILE_PATTERN</span><span style="color:#E1E4E8">))  </span><span style="color:#6A737D"># Find all .gz files</span></span>
<span class="line"><span style="color:#F97583">    if</span><span style="color:#F97583"> not</span><span style="color:#E1E4E8"> files:</span></span>
<span class="line"><span style="color:#79B8FF">        print</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"No backup files found."</span><span style="color:#E1E4E8">)  </span><span style="color:#6A737D"># If no files found, print message</span></span>
<span class="line"><span style="color:#F97583">        return</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">    for</span><span style="color:#E1E4E8"> filepath </span><span style="color:#F97583">in</span><span style="color:#E1E4E8"> files:  </span><span style="color:#6A737D"># Loop through each file</span></span>
<span class="line"><span style="color:#E1E4E8">        filename </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> os.path.basename(filepath)  </span><span style="color:#6A737D"># Get the filename</span></span>
<span class="line"><span style="color:#79B8FF">        print</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">f</span><span style="color:#9ECBFF">"Uploading </span><span style="color:#79B8FF">{</span><span style="color:#E1E4E8">filename</span><span style="color:#79B8FF">}</span><span style="color:#9ECBFF">..."</span><span style="color:#E1E4E8">)  </span><span style="color:#6A737D"># Print uploading message</span></span>
<span class="line"><span style="color:#E1E4E8">        upload_backup(filepath, </span><span style="color:#79B8FF">GOOGLE_DRIVE_FOLDER_ID</span><span style="color:#E1E4E8">)  </span><span style="color:#6A737D"># Upload the file</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">if</span><span style="color:#79B8FF"> __name__</span><span style="color:#F97583"> ==</span><span style="color:#9ECBFF"> "__main__"</span><span style="color:#E1E4E8">:</span></span>
<span class="line"><span style="color:#E1E4E8">    main()  </span><span style="color:#6A737D"># Run the main function</span></span>
<span class="line"></span></code></pre>
<h2 id="automating-the-backup-process-with-cron">Automating the Backup Process with Cron</h2>
<p>To automate the backup process, you can use a cron job (on Linux/macOS). Cron allows you to schedule tasks to run automatically at specific intervals.</p>
<h3 id="setting-up-a-cron-job">Setting Up a Cron Job</h3>
<ol>
<li>
<p><strong>Open the Crontab File:</strong></p>
<p>Open your terminal and type the following command:</p>
<pre class="astro-code github-dark" style="background-color:#24292e;color:#e1e4e8; overflow-x: auto;" tabindex="0" data-language="bash"><code><span class="line"><span style="color:#B392F0">crontab</span><span style="color:#79B8FF"> -e</span></span></code></pre>
<p>This will open the crontab file in a text editor. If this is your first time using <code>crontab</code>, you may be prompted to select an editor.</p>
</li>
<li>
<p><strong>Understand Crontab Syntax:</strong></p>
<p>Each line in the crontab file represents a scheduled task and follows this format:</p>
<pre class="astro-code github-dark" style="background-color:#24292e;color:#e1e4e8; overflow-x: auto;" tabindex="0" data-language="plaintext"><code><span class="line"><span>minute hour day_of_month month day_of_week command</span></span></code></pre>
<ul>
<li><code>minute</code>: (0-59)</li>
<li><code>hour</code>: (0-23)</li>
<li><code>day_of_month</code>: (1-31)</li>
<li><code>month</code>: (1-12)</li>
<li><code>day_of_week</code>: (0-6, 0 is Sunday)</li>
<li><code>command</code>: The command to execute</li>
</ul>
<p>You can use special characters:</p>
<ul>
<li><code>*</code>: Represents “every”.</li>
<li><code>,</code>: Specifies a list of values.</li>
<li><code>-</code>: Specifies a range of values.</li>
<li><code>/</code>: Specifies a step value.</li>
</ul>
</li>
<li>
<p><strong>Add the Cron Job Entry:</strong></p>
<p>Add a line to the crontab file to schedule your Python script. For example, to run the script every day at 2:00 AM, add the following line:</p>
<pre class="astro-code github-dark" style="background-color:#24292e;color:#e1e4e8; overflow-x: auto;" tabindex="0" data-language="plaintext"><code><span class="line"><span>0 2 * * * python /path/to/your/script.py > /path/to/backup.log 2>&#x26;1</span></span></code></pre>
<ul>
<li><code>0 2 * * *</code>: This schedules the task to run at 2:00 AM every day.</li>
<li><code>python /path/to/your/script.py</code>: This is the command to execute your Python script.  <strong>Replace <code>/path/to/your/script.py</code> with the actual path to your script.</strong></li>
<li><code>> /path/to/backup.log 2>&#x26;1</code>: This redirects the output of the script (both standard output and standard error) to a log file named <code>backup.log</code>.  This is helpful for troubleshooting.</li>
</ul>
</li>
<li>
<p><strong>Save the Crontab File:</strong></p>
<p>Save the crontab file. The changes will be applied automatically.</p>
</li>
<li>
<p><strong>Verify the Cron Job:</strong></p>
<p>You can verify that the cron job has been added by running the following command:</p>
<pre class="astro-code github-dark" style="background-color:#24292e;color:#e1e4e8; overflow-x: auto;" tabindex="0" data-language="bash"><code><span class="line"><span style="color:#B392F0">crontab</span><span style="color:#79B8FF"> -l</span></span></code></pre>
<p>This will list all the cron jobs in your crontab file.</p>
</li>
</ol>
<h3 id="important-notes">Important Notes:</h3>
<ul>
<li><strong>Full Paths:</strong> Always use full paths to the <code>python</code> executable and your script in the cron job entry.</li>
<li><strong>Logging:</strong> Redirecting the output to a log file is highly recommended for debugging purposes.</li>
<li><strong>Testing:</strong> Test your cron job by setting it to run more frequently (e.g., every minute) and checking the log file to ensure that it’s working correctly.</li>
</ul>
<h3 id="example">Example:</h3>
<p>To run the backup script located at <code>/home/user/backup_script.py</code> every day at 3:30 AM and log the output to <code>/home/user/backup.log</code>, the cron job entry would be:</p>
<pre class="astro-code github-dark" style="background-color:#24292e;color:#e1e4e8; overflow-x: auto;" tabindex="0" data-language="plaintext"><code><span class="line"><span>30 3 * * * python /home/user/backup_script.py > /home/user/backup.log 2>&#x26;1</span></span></code></pre>`, { headings: 309, localImagePaths: 341, remoteImagePaths: 342, frontmatter: 343, imagePaths: 347 }, [310, 313, 314, 317, 320, 323, 326, 329, 332, 335, 338], { depth: 53, slug: 311, text: 312 }, "why-automate-backups-to-google-drive", "Why Automate Backups to Google Drive?", { depth: 53, slug: 125, text: 126 }, { depth: 53, slug: 315, text: 316 }, "the-python-script-automating-the-backup", "The Python Script: Automating the Backup", { depth: 37, slug: 318, text: 319 }, "----configuration---", "--- CONFIGURATION ---", { depth: 37, slug: 321, text: 322 }, "----authentication---", "--- AUTHENTICATION ---", { depth: 37, slug: 324, text: 325 }, "----upload-function---", "--- UPLOAD FUNCTION ---", { depth: 37, slug: 327, text: 328 }, "----main-function---", "--- MAIN FUNCTION ---", { depth: 53, slug: 330, text: 331 }, "automating-the-backup-process-with-cron", "Automating the Backup Process with Cron", { depth: 37, slug: 333, text: 334 }, "setting-up-a-cron-job", "Setting Up a Cron Job", { depth: 37, slug: 336, text: 337 }, "important-notes", "Important Notes:", { depth: 37, slug: 339, text: 340 }, "example", "Example:", [], [], { title: 294, categories: 344, tags: 345, pubDate: 346, description: 295 }, [82, 83, 302], [21, 298, 299, 300, 79], "2025-05-26 12:00:00 -0400", [], "2025-05-26-Automated-SQL-Backups-to-Google-Drive.md", "2025-05-15-sometimes-good-things-happen", { id: 349, data: 351, body: 362, filePath: 363, digest: 364, rendered: 365, legacyId: 379 }, { title: 352, description: 353, pubDate: 354, tags: 355, categories: 360 }, "The Legend of CRISPR: Long Ago and Far Away a Young Prokaryote...", "A post about The Legend of CRISPR: Long Ago and Far Away a Young Prokaryote....", ["Date", "2025-05-15T16:00:00.000Z"], [356, 357, 358, 359, 21], "CRISPR", "Gene Editing", "Biotechnology", "Health", [23, 361], "Science", `# Sort of a fairytale...
Almost everything about CRISPR sounds magical, even its origins. It began billions of years ago as an evolutionary arms race between some of the first living organisms—bacteria—and the viruses that hunt them (bacteriophages).

When a virus attacked, it injected its own genetic code into the bacterium. While few survived, some evolved an incredible defense: they would find the invading viral DNA, snip out a specific piece, and save it. They stored this genetic "memory" inside their own DNA, in a special, repeating section called a CRISPR array. It became a "most wanted" gallery of past attackers.

If that virus ever attacked again, the bacterium would quickly create a "guide" molecule (RNA) from that stored memory. This guide would team up with a powerful "scissor" enzyme (like the famous Cas9). This complex would then patrol the cell, and if it found a perfect match to the invader's DNA, the Cas9 scissors would slice that viral DNA apart, neutralizing the threat.

Billions of years later, humans learned this secret. We figured out how to hijack this ancient bacterial system. By creating our own custom "guide RNA," we can now tell those molecular scissors exactly where to cut, allowing us to edit the genome of almost any living thing and opening the door to curing genetic diseases.

<div style="text-align: center;">
  <img src="/img/2025-05-15-Sometimes-Good/legendcrispr.png" alt="Legend of CRISPR image" width="25%">
</div>

This week I read that a [child](https://www.nytimes.com/2025/05/15/health/gene-editing-personalized-rare-disorders.html) that had virtually no chance of survival, seems to have been saved by this technology. They call the kid KJ, and if it worked for him they might be able to save thousands or even millions of other lives. The speficific disease is called [AADC deficiency](https://medlineplus.gov/genetics/condition/aromatic-l-amino-acid-decarboxylase-deficiency/) and it is a rare genetic disorder that affects the brain's ability to produce dopamine and serotonin. But there is good reason to believe the same techniques could be used to treat other diseases.  

That is not even the only use for CRISPR. Here is a python library used to help identify [similar looking plants](https://pubmed.ncbi.nlm.nih.gov/38768250/) potentially to help identify invasive species more reliably. I am sure there will be countless other uses for this technology. If you are interested in exploring more with python, here is a [link](https://depmap.org/portal/data_page/?tab=overview) to the DepMap portal. It is a great resource for exploring CRISPR in the context of cancer research. A great primer on Bioinformatics is the [Biopython](https://biopython.org/) library`, "src/content/blog/2025-05-15-Sometimes-Good-Things-Happen.md", "a68ca1e640b33b58", { html: 366, metadata: 367 }, '<h1 id="sort-of-a-fairytale">Sort of a fairytale…</h1>\n<p>Almost everything about CRISPR sounds magical, even its origins. It began billions of years ago as an evolutionary arms race between some of the first living organisms—bacteria—and the viruses that hunt them (bacteriophages).</p>\n<p>When a virus attacked, it injected its own genetic code into the bacterium. While few survived, some evolved an incredible defense: they would find the invading viral DNA, snip out a specific piece, and save it. They stored this genetic “memory” inside their own DNA, in a special, repeating section called a CRISPR array. It became a “most wanted” gallery of past attackers.</p>\n<p>If that virus ever attacked again, the bacterium would quickly create a “guide” molecule (RNA) from that stored memory. This guide would team up with a powerful “scissor” enzyme (like the famous Cas9). This complex would then patrol the cell, and if it found a perfect match to the invader’s DNA, the Cas9 scissors would slice that viral DNA apart, neutralizing the threat.</p>\n<p>Billions of years later, humans learned this secret. We figured out how to hijack this ancient bacterial system. By creating our own custom “guide RNA,” we can now tell those molecular scissors exactly where to cut, allowing us to edit the genome of almost any living thing and opening the door to curing genetic diseases.</p>\n<div style="text-align: center;">\n  <img src="/img/2025-05-15-Sometimes-Good/legendcrispr.png" alt="Legend of CRISPR image" width="25%">\n</div>\n<p>This week I read that a <a href="https://www.nytimes.com/2025/05/15/health/gene-editing-personalized-rare-disorders.html">child</a> that had virtually no chance of survival, seems to have been saved by this technology. They call the kid KJ, and if it worked for him they might be able to save thousands or even millions of other lives. The speficific disease is called <a href="https://medlineplus.gov/genetics/condition/aromatic-l-amino-acid-decarboxylase-deficiency/">AADC deficiency</a> and it is a rare genetic disorder that affects the brain’s ability to produce dopamine and serotonin. But there is good reason to believe the same techniques could be used to treat other diseases.</p>\n<p>That is not even the only use for CRISPR. Here is a python library used to help identify <a href="https://pubmed.ncbi.nlm.nih.gov/38768250/">similar looking plants</a> potentially to help identify invasive species more reliably. I am sure there will be countless other uses for this technology. If you are interested in exploring more with python, here is a <a href="https://depmap.org/portal/data_page/?tab=overview">link</a> to the DepMap portal. It is a great resource for exploring CRISPR in the context of cancer research. A great primer on Bioinformatics is the <a href="https://biopython.org/">Biopython</a> library</p>', { headings: 368, localImagePaths: 372, remoteImagePaths: 373, frontmatter: 374, imagePaths: 378 }, [369], { depth: 33, slug: 370, text: 371 }, "sort-of-a-fairytale", "Sort of a fairytale…", [], [], { title: 352, categories: 375, tags: 376, pubDate: 377, description: 353 }, [23, 361], [356, 357, 358, 359, 21], "2025-05-15 12:00:00 -0400", [], "2025-05-15-Sometimes-Good-Things-Happen.md", "2024-10-10-judy-the-wise", { id: 380, data: 382, body: 386, filePath: 387, digest: 388, rendered: 389, legacyId: 398 }, { title: 383, description: 384, pubDate: 385 }, "2024 10 10 Judy The Wise", "A post about 2024 10 10 Judy The Wise.", ["Date", "2024-10-10T00:00:00.000Z"], "No technology in this post—just some thinking and reflecting. If this resonates with you, great; if not, perhaps another post will. This is the story of how a seemingly trivial moment on Judge Judy illuminated the often-unseen dynamics of power that shape our relationships and societies. I didn't know how little I understood people until I watched one episode of Judge Judy\n\nToo many years ago to count, I was watching Judge Judy. If you're not familiar, the appeal of the show and shows like it lies in watching someone with an undeservedly high opinion of themselves be corrected. Usually there's a small amount of money in question—I think it's put up by the show—which helps make the judge's decision seem a little weightier than just receiving a talking-to. The judge is really the star of the show. The audience in these courtrooms is more or less for appearance and to provide somewhere for the judge's jokes to land. There's a bailiff, and their job is to agree with the judge.\n\nI never really thought much of these shows, honestly. I know I've obviously given them considerable thought since then. Maybe it was a right time, right place event; maybe it was just something I already knew but didn't realize. I should point out that although I've only seen this episode once, I've tried to find it again but have never succeeded. According to Google, there are more than 7,000 episodes of Judge Judy. I've seen more episodes of the show than I'd like to admit, though I haven't seen one in several years. Cord cutting has more to do with that than taste, I assure you. Before this particular episode, I even used to harbor a slightly snobby attitude towards the show, dismissing it as mere entertainment. But that's the nice thing about being open to new experiences: our opinions can change and hopefully grow.\n\nThe episode I'm talking about involved two women who were roommates. The first one, I'll call her Generous. Generous explained how she invited her friend (named here as Free-Loader) to live with her. She knew Free-Loader was unemployed and didn't have anywhere to go. She offered Free-Loader the chance to move in with her and asked her to pay back half the rent once she started working. Free-Loader agreed and moved in, but made no effort to find work, despite constantly promising she would. After about eight months of this, Free-Loader moved out, leaving a debt of about $5,000. Generous seemed genuinely hurt, which was understandable, but it also made her appear somewhat gullible to me at first. It seriously took her eight months to see through this?\n\nThe beginning of the case was pretty standard, except that Free-Loader seemed kind of bored by the proceedings. She was either giving one-word answers or mumbling while Generous was speaking. After establishing the timeline and how the amount of money was calculated, Judge Judy spoke directly to Free-Loader. This is where the exchange became truly illuminating. Judge Judy, cutting through Free-Loader's evasions, directly asked how she intended to pay back Generous. Free-Loader, with a straight face and an almost comical lack of self-respect, replied, “I went to my money tree but it was empty.” Even for a show where you are looking for someone to be the villain, this seemed over the top. If she was speaking plainly, she would have said, “I never planned to pay her back.” Judge Judy seemed unfazed and, seemingly as a courtesy, prompted her, “Could you say that one more time?” And Free-Loader, unflustered, reiterated, “I was going to get it from my money tree but when I got there, there was no money.” At this point, Judge Judy’s patience evaporated. “Okay, I’m done with you,” she declared, “I don’t need anything else. I’m going to talk to the plaintiff now.”\n\nThis moment wasn’t just about the absurd excuse; it was the definitive proof of Free-Loader’s complete detachment from any sense of obligation, financial or personal. Her true nature as a self-serving individual was laid bare. But the real wisdom came next, when Judge Judy turned her attention to Generous.\n\n“Let me ask you something,” Judge Judy began, “when you met this person, she had already done what she is doing to you, to other people?” Generous looked confused at first, but a dawning realization flickered across her face as she started to understand. Judge Judy pressed on, “When she did this to other people, you used to think it was funny, didn't you?” Generous nodded, reluctantly. “But the difference is, you never thought she would do this to you; you thought you were in on the joke. You thought you were on the inside. But when she turned around and did it to you, it wasn’t so funny anymore.” Judge Judy concluded, “So let me tell you what I’m going to do here, I’m going to rule in your favor. But you’re never going to see the money from this person.”\n\nThe Cost of Being “On the Inside”\nThis exchange was the epiphany. Initially, the case seemed to me a simple matter of someone taking advantage of a friend, and I had viewed Generous as simply gullible and overly trusting. However, Judge Judy’s pointed questioning of Generous, and her unmasking of Free-Loader’s character, revealed a deeper, more uncomfortable truth that profoundly impacted me. Generous wasn’t just a victim of debt; she was a victim of misplaced loyalty rooted in a selective tolerance of Free-Loader’s behavior. I can only assume Generous felt a real, genuine sense of betrayal and surprise when she realized Free-Loader was never going to pay her back, nor even express gratitude for the profound generosity she had been given. Generous had implicitly sided with Free-Loader’s exploitative actions when they were directed at others, finding amusement in the “joke” because she believed herself immune—part of an exclusive circle, part of the coveted “in-group” that was safe from Free-Loader’s predatory behavior.\n\nIt was this realization that made me understand that much of what we call bullying isn't about direct harm to a specific victim as its primary goal. Instead, much of bullying is performative; demeaning the victim is often merely the sideshow, not the actual objective. The true aim is to establish control by implicitly setting an “in-group” and an “out-group.” This is precisely where the complex dynamic of self-serving individuals, the manipulative bully, truly reveals itself. It’s not just about some people being willing victims; often, they genuinely believe having a bully “fight” for them, or even just tolerating their behavior when directed elsewhere, makes them stronger, or at least exempt from the bully’s wrath. They see shared circumstances or a shared narrative, failing to recognize that for the bully, the alliance is merely a means to an end, and that anyone, even those perceived to be “on their side,” is ultimately expendable. The facade of friendship, of being “on the same team,” crumbled under the weight of Free-Loader’s utter lack of accountability and empathy, and Generous’s realization that she was just another mark.\n\nLooking back, I can see echoes of Generous in my own past. I think almost everyone has experienced some form of bullying, and it can be unpleasant to remember yourself this way: vulnerable, weak, unsure. It’s not just the memory of the external event, but the jarring disconnect from the person we are now, or aspire to be. We struggle to reconcile our present strength and agency with that past self who felt powerless, leaving us to still wonder what made us the target or what we could have said differently. This rejection of our past selves, that sense of having overcome or moved past that vulnerability, often blunts our ability to sympathize with others being victimized. It soothes our egos, assuring us we are not ‘that person’ anymore, while simultaneously instilling the fear that we could still be again. While those moments of humiliation and the misplaced feeling that maybe you deserved it are painful, since seeing this exchange play out, it feels even worse to recall the times I was in the audience of someone being mean to another. Perhaps I didn't like the target anyway, or I dismissed it as harmless teasing, or—worst of all—I didn't want to be the next target. These instances of passive acceptance, much like Generous’s prior amusement, contribute to a culture where such behavior thrives. The protection Generous thought she had by being “in on the joke” evaporated the moment the joke was on her.\n\nUnderstanding the Landscape of Self-Interest\nThis particular episode, seemingly a minor dispute on a television screen, offered a startling microcosm of a much larger global phenomenon: the dynamics of self-interest and false alliances within the systems we inhabit. Just as Generous inadvertently empowered Free-Loader by tolerating her behavior when it was directed at others, so too do societies often provide fertile ground for the rise and dominance of self-serving figures on a grand scale. Many of us don’t have limitless choices regarding the people we work with or the actions of our friends and relatives, and we often find ourselves navigating social and economic structures that are more prescribed than collectively created.\n\nConsider how charismatic, yet ultimately tyrannical, leaders gain power. They often rise by demonizing an “out-group,” attracting followers who feel a sense of shared purpose or protection from a perceived enemy. Like Generous, these supporters may initially find a dark satisfaction in seeing the bully’s aggression directed elsewhere, believing themselves to be “on the inside” of an exclusive, powerful clique. They overlook or even rationalize the blatant disregard for truth, empathy, or fair play, because it benefits them in the short term, or because they fear becoming a target themselves. However, history is replete with examples where these very same “allies” eventually become the bully’s next victim, discarded when no longer useful, or consumed by the very system of oppression they helped to build. The only constant in the bully’s world is their own unquenchable thirst for power and control, and their primary goal is always to solidify their own position by clearly delineating who is “in” and who is “out.”\n\nSimilarly, in the corporate world, an aggressive manager who steps on colleagues to climb the ladder might find initial loyalty from a few subordinates who believe they’re benefiting from proximity to power, or who hope to avoid being targeted. Yet, when the manager’s self-interest dictates, those very subordinates are often thrown under the bus, their careers sacrificed for the manager’s next promotion. On the international stage, nations sometimes form alliances with powerful, unprincipled regimes, hoping for economic gain or strategic advantage, only to find their own sovereignty or values compromised when the larger power shifts its focus or demands unconditional fealty.\n\nThe lesson from Judge Judy’s courtroom extends far beyond personal relationships. It is a stark reminder that accepting self-serving behavior, even passively or by enjoying its temporary benefits, ultimately reinforces the very limitations and inequalities already built into the prescribed social and economic systems we inhabit. The “joke” of others’ suffering eventually ceases to be funny when the bully turns their attention to us, revealing that their side has only ever been their own. This critical realization forces us to confront not just the external landscape of power and self-interest, but our own internal compass. The core issue isn’t whether others can be trusted or if genuine alliances are possible; it’s about our own willingness to adhere to our principles, or if we’ve even done the essential work of developing them. Without this internal integrity, the illusion of being “on the inside” will always leave us vulnerable to the self-serving.", "src/content/blog/2024-10-10-Judy-The-Wise.md", "477aa66c82dec864", { html: 390, metadata: 391 }, "<p>No technology in this post—just some thinking and reflecting. If this resonates with you, great; if not, perhaps another post will. This is the story of how a seemingly trivial moment on Judge Judy illuminated the often-unseen dynamics of power that shape our relationships and societies. I didn’t know how little I understood people until I watched one episode of Judge Judy</p>\n<p>Too many years ago to count, I was watching Judge Judy. If you’re not familiar, the appeal of the show and shows like it lies in watching someone with an undeservedly high opinion of themselves be corrected. Usually there’s a small amount of money in question—I think it’s put up by the show—which helps make the judge’s decision seem a little weightier than just receiving a talking-to. The judge is really the star of the show. The audience in these courtrooms is more or less for appearance and to provide somewhere for the judge’s jokes to land. There’s a bailiff, and their job is to agree with the judge.</p>\n<p>I never really thought much of these shows, honestly. I know I’ve obviously given them considerable thought since then. Maybe it was a right time, right place event; maybe it was just something I already knew but didn’t realize. I should point out that although I’ve only seen this episode once, I’ve tried to find it again but have never succeeded. According to Google, there are more than 7,000 episodes of Judge Judy. I’ve seen more episodes of the show than I’d like to admit, though I haven’t seen one in several years. Cord cutting has more to do with that than taste, I assure you. Before this particular episode, I even used to harbor a slightly snobby attitude towards the show, dismissing it as mere entertainment. But that’s the nice thing about being open to new experiences: our opinions can change and hopefully grow.</p>\n<p>The episode I’m talking about involved two women who were roommates. The first one, I’ll call her Generous. Generous explained how she invited her friend (named here as Free-Loader) to live with her. She knew Free-Loader was unemployed and didn’t have anywhere to go. She offered Free-Loader the chance to move in with her and asked her to pay back half the rent once she started working. Free-Loader agreed and moved in, but made no effort to find work, despite constantly promising she would. After about eight months of this, Free-Loader moved out, leaving a debt of about $5,000. Generous seemed genuinely hurt, which was understandable, but it also made her appear somewhat gullible to me at first. It seriously took her eight months to see through this?</p>\n<p>The beginning of the case was pretty standard, except that Free-Loader seemed kind of bored by the proceedings. She was either giving one-word answers or mumbling while Generous was speaking. After establishing the timeline and how the amount of money was calculated, Judge Judy spoke directly to Free-Loader. This is where the exchange became truly illuminating. Judge Judy, cutting through Free-Loader’s evasions, directly asked how she intended to pay back Generous. Free-Loader, with a straight face and an almost comical lack of self-respect, replied, “I went to my money tree but it was empty.” Even for a show where you are looking for someone to be the villain, this seemed over the top. If she was speaking plainly, she would have said, “I never planned to pay her back.” Judge Judy seemed unfazed and, seemingly as a courtesy, prompted her, “Could you say that one more time?” And Free-Loader, unflustered, reiterated, “I was going to get it from my money tree but when I got there, there was no money.” At this point, Judge Judy’s patience evaporated. “Okay, I’m done with you,” she declared, “I don’t need anything else. I’m going to talk to the plaintiff now.”</p>\n<p>This moment wasn’t just about the absurd excuse; it was the definitive proof of Free-Loader’s complete detachment from any sense of obligation, financial or personal. Her true nature as a self-serving individual was laid bare. But the real wisdom came next, when Judge Judy turned her attention to Generous.</p>\n<p>“Let me ask you something,” Judge Judy began, “when you met this person, she had already done what she is doing to you, to other people?” Generous looked confused at first, but a dawning realization flickered across her face as she started to understand. Judge Judy pressed on, “When she did this to other people, you used to think it was funny, didn’t you?” Generous nodded, reluctantly. “But the difference is, you never thought she would do this to you; you thought you were in on the joke. You thought you were on the inside. But when she turned around and did it to you, it wasn’t so funny anymore.” Judge Judy concluded, “So let me tell you what I’m going to do here, I’m going to rule in your favor. But you’re never going to see the money from this person.”</p>\n<p>The Cost of Being “On the Inside”\nThis exchange was the epiphany. Initially, the case seemed to me a simple matter of someone taking advantage of a friend, and I had viewed Generous as simply gullible and overly trusting. However, Judge Judy’s pointed questioning of Generous, and her unmasking of Free-Loader’s character, revealed a deeper, more uncomfortable truth that profoundly impacted me. Generous wasn’t just a victim of debt; she was a victim of misplaced loyalty rooted in a selective tolerance of Free-Loader’s behavior. I can only assume Generous felt a real, genuine sense of betrayal and surprise when she realized Free-Loader was never going to pay her back, nor even express gratitude for the profound generosity she had been given. Generous had implicitly sided with Free-Loader’s exploitative actions when they were directed at others, finding amusement in the “joke” because she believed herself immune—part of an exclusive circle, part of the coveted “in-group” that was safe from Free-Loader’s predatory behavior.</p>\n<p>It was this realization that made me understand that much of what we call bullying isn’t about direct harm to a specific victim as its primary goal. Instead, much of bullying is performative; demeaning the victim is often merely the sideshow, not the actual objective. The true aim is to establish control by implicitly setting an “in-group” and an “out-group.” This is precisely where the complex dynamic of self-serving individuals, the manipulative bully, truly reveals itself. It’s not just about some people being willing victims; often, they genuinely believe having a bully “fight” for them, or even just tolerating their behavior when directed elsewhere, makes them stronger, or at least exempt from the bully’s wrath. They see shared circumstances or a shared narrative, failing to recognize that for the bully, the alliance is merely a means to an end, and that anyone, even those perceived to be “on their side,” is ultimately expendable. The facade of friendship, of being “on the same team,” crumbled under the weight of Free-Loader’s utter lack of accountability and empathy, and Generous’s realization that she was just another mark.</p>\n<p>Looking back, I can see echoes of Generous in my own past. I think almost everyone has experienced some form of bullying, and it can be unpleasant to remember yourself this way: vulnerable, weak, unsure. It’s not just the memory of the external event, but the jarring disconnect from the person we are now, or aspire to be. We struggle to reconcile our present strength and agency with that past self who felt powerless, leaving us to still wonder what made us the target or what we could have said differently. This rejection of our past selves, that sense of having overcome or moved past that vulnerability, often blunts our ability to sympathize with others being victimized. It soothes our egos, assuring us we are not ‘that person’ anymore, while simultaneously instilling the fear that we could still be again. While those moments of humiliation and the misplaced feeling that maybe you deserved it are painful, since seeing this exchange play out, it feels even worse to recall the times I was in the audience of someone being mean to another. Perhaps I didn’t like the target anyway, or I dismissed it as harmless teasing, or—worst of all—I didn’t want to be the next target. These instances of passive acceptance, much like Generous’s prior amusement, contribute to a culture where such behavior thrives. The protection Generous thought she had by being “in on the joke” evaporated the moment the joke was on her.</p>\n<p>Understanding the Landscape of Self-Interest\nThis particular episode, seemingly a minor dispute on a television screen, offered a startling microcosm of a much larger global phenomenon: the dynamics of self-interest and false alliances within the systems we inhabit. Just as Generous inadvertently empowered Free-Loader by tolerating her behavior when it was directed at others, so too do societies often provide fertile ground for the rise and dominance of self-serving figures on a grand scale. Many of us don’t have limitless choices regarding the people we work with or the actions of our friends and relatives, and we often find ourselves navigating social and economic structures that are more prescribed than collectively created.</p>\n<p>Consider how charismatic, yet ultimately tyrannical, leaders gain power. They often rise by demonizing an “out-group,” attracting followers who feel a sense of shared purpose or protection from a perceived enemy. Like Generous, these supporters may initially find a dark satisfaction in seeing the bully’s aggression directed elsewhere, believing themselves to be “on the inside” of an exclusive, powerful clique. They overlook or even rationalize the blatant disregard for truth, empathy, or fair play, because it benefits them in the short term, or because they fear becoming a target themselves. However, history is replete with examples where these very same “allies” eventually become the bully’s next victim, discarded when no longer useful, or consumed by the very system of oppression they helped to build. The only constant in the bully’s world is their own unquenchable thirst for power and control, and their primary goal is always to solidify their own position by clearly delineating who is “in” and who is “out.”</p>\n<p>Similarly, in the corporate world, an aggressive manager who steps on colleagues to climb the ladder might find initial loyalty from a few subordinates who believe they’re benefiting from proximity to power, or who hope to avoid being targeted. Yet, when the manager’s self-interest dictates, those very subordinates are often thrown under the bus, their careers sacrificed for the manager’s next promotion. On the international stage, nations sometimes form alliances with powerful, unprincipled regimes, hoping for economic gain or strategic advantage, only to find their own sovereignty or values compromised when the larger power shifts its focus or demands unconditional fealty.</p>\n<p>The lesson from Judge Judy’s courtroom extends far beyond personal relationships. It is a stark reminder that accepting self-serving behavior, even passively or by enjoying its temporary benefits, ultimately reinforces the very limitations and inequalities already built into the prescribed social and economic systems we inhabit. The “joke” of others’ suffering eventually ceases to be funny when the bully turns their attention to us, revealing that their side has only ever been their own. This critical realization forces us to confront not just the external landscape of power and self-interest, but our own internal compass. The core issue isn’t whether others can be trusted or if genuine alliances are possible; it’s about our own willingness to adhere to our principles, or if we’ve even done the essential work of developing them. Without this internal integrity, the illusion of being “on the inside” will always leave us vulnerable to the self-serving.</p>", { headings: 392, localImagePaths: 393, remoteImagePaths: 394, frontmatter: 395, imagePaths: 397 }, [], [], [], { title: 383, description: 384, pubDate: 396 }, ["Date", "2024-10-10T00:00:00.000Z"], [], "2024-10-10-Judy-The-Wise.md", "2025-06-06-duckdb-diners-drives-and-databases", { id: 399, data: 401, body: 412, filePath: 413, digest: 414, rendered: 415, legacyId: 457 }, { title: 402, description: 403, pubDate: 404, tags: 405, categories: 411 }, "DuckDB - Diners, Drives, and Databases Part I", "A post about DuckDB - Diners, Drives, and Databases Part I.", ["Date", "2025-06-06T00:00:00.000Z"], [406, 407, 408, 409, 200, 410], "DuckDB", "Pandas", "data analysis", "SQL", "testing", [266, 200], `<img src="/img/duckdbgf2.png" alt="All paws on Deck" width="400px" height="auto">

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

If you’re already comfortable navigating file paths and extensions, feel free to skip this step. Otherwise, for easier referencing in our code, I recommend renaming the downloaded file. It will likely have a long name like \`DOHMH_New_York_City_Restaurant_Inspection_Results_202506XX.csv\`. Let’s simplify it to just \`DOHMH.csv\`.

---

## Getting Your Environment Set Up:

First, install the necessary libraries using \`uv\` (if you have it) or \`pip\`.

\`\`\`\`bash
uv pip install duckdb pandas
# If you don't have uv, just use:
pip install duckdb pandas
\`\`\`\`


## Initial Data Exploration: First Counts
Now that we have our data and tools ready, let’s dive into some basic, yet incredibly insightful, questions about our NYC restaurant inspection dataset. Instead of loading the entire massive file into memory with pandas (which can be slow for very large datasets and consume a lot of RAM), we’ll leverage DuckDB’s ability to directly query the CSV file. This keeps our memory footprint low and our queries fast.

Let’s start by getting a quick idea of our dataset size:

\`\`\`python
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
\`\`\`

We can use Pandas to confirm our results for the total rows:

\`\`\`python
import pandas as pd
import os

# Make sure this matches your file path
csv_file_path = 'DOHMH.csv'

df = pd.read_csv(csv_file_path)
print(df.shape)
\`\`\`

Your total rows should match the total from DuckDB. In my case it was 285,210, but the actual number may depend on when you downloaded the file. Let’s put this in perspective: you would have to inspect a restaurant every 1.5 minutes, 24/7, for an entire year to reach that number of inspections!

## TLDR: What Makes this Special?
I want to point out something important about how DuckDB works here: it allows you to run SQL queries directly on CSV files without needing to load the entire dataset into memory. This offers a significant, often ephemeral, performance and memory advantage. In other words, you get the benefit of lower memory use during the query. However, this power also comes with an important practice: remembering to close your connection to the database. 

In the examples above, we've diligently closed our connection using con.close() after running our queries. We'll strive to follow these best practices, but if a small mistake slips through and I leave a connection open, well, that's just too bad, isn't it? Fortunately (or perhaps unfortunately for accountability), there are no database inspectors handing out fines for that.  Anyway we lost that advantage when we checked the table size with Pandas.

Let’s review a few more basic queries.

## Restaurants by Borough
We can easily count the number of inspections by borough, but some places have been inspected on multiple occasions. Let’s compare total inspections by borough to total restaurants by borough using the unique CAMIS number to find how many restaurants in each borough have been inspected.
\`\`\`python
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
\`\`\`
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


\`\`\`python
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
\`\`\`


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

\`\`\`python
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
\`\`\`

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

Anyway if you made it this far, I hope this was a help to you. I would love to hear your thoughts about Duckdb or Donuts or anything else.`, "src/content/blog/2025-06-06-DuckDB-Diners-Drives-and-Databases.md", "8423beefcdf067f3", { html: 416, metadata: 417 }, `<img src="/img/duckdbgf2.png" alt="All paws on Deck" width="400px" height="auto">
<p style="font-size:0.9em; margin-top:0.5em; color:#555;"><em>Hoping for an A.</em></p>
<p>Pandas has been my go-to tool for data manipulation in Python for years. So great for me, right?  End of blog post.  Except…
“If the only tool you have is a hammer, you will see every problem as a nail.” This dollop of wisdom, often attributed to Maslow, reminds us that the solutions we find are often shaped by the tools we have available. I’m not calling Pandas a hammer; it’s an incredible combination of tools that has truly changed how millions of people, myself included, get work done. My point is simply this: opening yourself up to different solutions can lead you to achieve different—and hopefully better—results.</p>
<p>That’s precisely where DuckDB shines. I’ve been using it in my own data pipelines to speed up transformations and prep reports for joining with other databases. And honestly? I know I’m only scratching the surface of its possibilities. So I thought I would try a few simple jobs with DuckDB, and maybe this exploration will prove useful to others too.</p>
<p>If you’ve been coding in Python for a while, you’re likely familiar with traditional database solutions like PostgreSQL or SQLite. DuckDB stands out from the crowd because it offers <strong>virtually no setup</strong>, delivers <strong>blazing-fast performance</strong>, and can directly pull entire datasets from a <strong>multitude of formats</strong>.</p>
<p>Let’s put it to the test with some real-world data anyone can access. We’ll be using the NYC Department of Health’s restaurant inspection results:</p>
<p><a href="https://data.cityofofnewyork.us/Health/DOHMH-New-York-City-Restaurant-Inspection-Results/43nn-pn8j/about_data">https://data.cityofofnewyork.us/Health/DOHMH-New-York-City-Restaurant-Inspection-Results/43nn-pn8j/about_data</a></p>
<p>To get the data, just click the ‘Actions’ button in the top right corner on that page, select ‘Query Data’, and then hit ‘Export’ to download the CSV file. It should appear in your downloads folder in less than a minute.</p>
<hr>
<p><strong>!!Warning!!</strong> If you have a favorite restaurant, you might actually not want to look it up in this dataset. Ignorance, bliss… <strong>!!Warning!!</strong></p>
<hr>
<h3 id="optional-but-recommended-simplify-your-file-path">Optional but Recommended: Simplify Your File Path</h3>
<p>If you’re already comfortable navigating file paths and extensions, feel free to skip this step. Otherwise, for easier referencing in our code, I recommend renaming the downloaded file. It will likely have a long name like <code>DOHMH_New_York_City_Restaurant_Inspection_Results_202506XX.csv</code>. Let’s simplify it to just <code>DOHMH.csv</code>.</p>
<hr>
<h2 id="getting-your-environment-set-up">Getting Your Environment Set Up:</h2>
<p>First, install the necessary libraries using <code>uv</code> (if you have it) or <code>pip</code>.</p>
<pre class="astro-code github-dark" style="background-color:#24292e;color:#e1e4e8; overflow-x: auto;" tabindex="0" data-language="bash"><code><span class="line"><span style="color:#B392F0">uv</span><span style="color:#9ECBFF"> pip</span><span style="color:#9ECBFF"> install</span><span style="color:#9ECBFF"> duckdb</span><span style="color:#9ECBFF"> pandas</span></span>
<span class="line"><span style="color:#6A737D"># If you don't have uv, just use:</span></span>
<span class="line"><span style="color:#B392F0">pip</span><span style="color:#9ECBFF"> install</span><span style="color:#9ECBFF"> duckdb</span><span style="color:#9ECBFF"> pandas</span></span></code></pre>
<h2 id="initial-data-exploration-first-counts">Initial Data Exploration: First Counts</h2>
<p>Now that we have our data and tools ready, let’s dive into some basic, yet incredibly insightful, questions about our NYC restaurant inspection dataset. Instead of loading the entire massive file into memory with pandas (which can be slow for very large datasets and consume a lot of RAM), we’ll leverage DuckDB’s ability to directly query the CSV file. This keeps our memory footprint low and our queries fast.</p>
<p>Let’s start by getting a quick idea of our dataset size:</p>
<pre class="astro-code github-dark" style="background-color:#24292e;color:#e1e4e8; overflow-x: auto;" tabindex="0" data-language="python"><code><span class="line"><span style="color:#F97583">import</span><span style="color:#E1E4E8"> duckdb</span></span>
<span class="line"><span style="color:#F97583">import</span><span style="color:#E1E4E8"> os</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D"># Define the path to your CSV file.</span></span>
<span class="line"><span style="color:#6A737D"># Make sure 'DOHMH.csv' is in the same directory as your Python script,</span></span>
<span class="line"><span style="color:#6A737D"># or provide the full absolute path.</span></span>
<span class="line"><span style="color:#E1E4E8">csv_file_path </span><span style="color:#F97583">=</span><span style="color:#9ECBFF"> 'DOHMH.csv'</span><span style="color:#E1E4E8"> </span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D"># Establish a connection to an in-memory DuckDB database.</span></span>
<span class="line"><span style="color:#6A737D"># Close it after use in this block.</span></span>
<span class="line"><span style="color:#E1E4E8">con </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> duckdb.connect()</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D"># Total Number of Inspections using DuckDB</span></span>
<span class="line"><span style="color:#79B8FF">print</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"--- Dataset Overview ---"</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#E1E4E8">total_inspections_query </span><span style="color:#F97583">=</span><span style="color:#F97583"> f</span><span style="color:#9ECBFF">"""</span></span>
<span class="line"><span style="color:#9ECBFF">SELECT COUNT(*) AS total_inspections</span></span>
<span class="line"><span style="color:#9ECBFF">FROM '</span><span style="color:#79B8FF">{</span><span style="color:#E1E4E8">csv_file_path</span><span style="color:#79B8FF">}</span><span style="color:#9ECBFF">';</span></span>
<span class="line"><span style="color:#9ECBFF">"""</span></span>
<span class="line"><span style="color:#E1E4E8">total_inspections </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> con.sql(total_inspections_query).fetchall()[</span><span style="color:#79B8FF">0</span><span style="color:#E1E4E8">][</span><span style="color:#79B8FF">0</span><span style="color:#E1E4E8">]</span></span>
<span class="line"><span style="color:#79B8FF">print</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">f</span><span style="color:#9ECBFF">"Total number of inspection records (DuckDB): </span><span style="color:#79B8FF">{</span><span style="color:#E1E4E8">total_inspections</span><span style="color:#F97583">:,</span><span style="color:#79B8FF">}</span><span style="color:#9ECBFF">"</span><span style="color:#E1E4E8">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">con.close() </span><span style="color:#6A737D"># Close the DuckDB connection for this snippet</span></span></code></pre>
<p>We can use Pandas to confirm our results for the total rows:</p>
<pre class="astro-code github-dark" style="background-color:#24292e;color:#e1e4e8; overflow-x: auto;" tabindex="0" data-language="python"><code><span class="line"><span style="color:#F97583">import</span><span style="color:#E1E4E8"> pandas </span><span style="color:#F97583">as</span><span style="color:#E1E4E8"> pd</span></span>
<span class="line"><span style="color:#F97583">import</span><span style="color:#E1E4E8"> os</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D"># Make sure this matches your file path</span></span>
<span class="line"><span style="color:#E1E4E8">csv_file_path </span><span style="color:#F97583">=</span><span style="color:#9ECBFF"> 'DOHMH.csv'</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">df </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> pd.read_csv(csv_file_path)</span></span>
<span class="line"><span style="color:#79B8FF">print</span><span style="color:#E1E4E8">(df.shape)</span></span></code></pre>
<p>Your total rows should match the total from DuckDB. In my case it was 285,210, but the actual number may depend on when you downloaded the file. Let’s put this in perspective: you would have to inspect a restaurant every 1.5 minutes, 24/7, for an entire year to reach that number of inspections!</p>
<h2 id="tldr-what-makes-this-special">TLDR: What Makes this Special?</h2>
<p>I want to point out something important about how DuckDB works here: it allows you to run SQL queries directly on CSV files without needing to load the entire dataset into memory. This offers a significant, often ephemeral, performance and memory advantage. In other words, you get the benefit of lower memory use during the query. However, this power also comes with an important practice: remembering to close your connection to the database.</p>
<p>In the examples above, we’ve diligently closed our connection using con.close() after running our queries. We’ll strive to follow these best practices, but if a small mistake slips through and I leave a connection open, well, that’s just too bad, isn’t it? Fortunately (or perhaps unfortunately for accountability), there are no database inspectors handing out fines for that.  Anyway we lost that advantage when we checked the table size with Pandas.</p>
<p>Let’s review a few more basic queries.</p>
<h2 id="restaurants-by-borough">Restaurants by Borough</h2>
<p>We can easily count the number of inspections by borough, but some places have been inspected on multiple occasions. Let’s compare total inspections by borough to total restaurants by borough using the unique CAMIS number to find how many restaurants in each borough have been inspected.</p>
<pre class="astro-code github-dark" style="background-color:#24292e;color:#e1e4e8; overflow-x: auto;" tabindex="0" data-language="python"><code><span class="line"><span style="color:#F97583">import</span><span style="color:#E1E4E8"> duckdb</span></span>
<span class="line"><span style="color:#F97583">import</span><span style="color:#E1E4E8"> pandas </span><span style="color:#F97583">as</span><span style="color:#E1E4E8"> pd</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D"># Define the path to your CSV file.</span></span>
<span class="line"><span style="color:#E1E4E8">csv_file_path </span><span style="color:#F97583">=</span><span style="color:#9ECBFF"> 'DOHMH.csv'</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D"># Connect to DuckDB (in-memory)</span></span>
<span class="line"><span style="color:#E1E4E8">con </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> duckdb.connect()</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D"># Inspections by Borough</span></span>
<span class="line"><span style="color:#E1E4E8">borough_inspections </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> con.execute(</span><span style="color:#9ECBFF">"""</span></span>
<span class="line"><span style="color:#9ECBFF">  SELECT</span></span>
<span class="line"><span style="color:#9ECBFF">    "BORO",</span></span>
<span class="line"><span style="color:#9ECBFF">    COUNT(*) AS total_inspections_in_borough</span></span>
<span class="line"><span style="color:#9ECBFF">  FROM read_csv_auto(?)</span></span>
<span class="line"><span style="color:#9ECBFF">  GROUP BY "BORO"</span></span>
<span class="line"><span style="color:#9ECBFF">  ORDER BY total_inspections_in_borough DESC</span></span>
<span class="line"><span style="color:#9ECBFF">"""</span><span style="color:#E1E4E8">, [csv_file_path]).df()</span></span>
<span class="line"><span style="color:#79B8FF">print</span><span style="color:#E1E4E8">(borough_inspections.to_markdown(</span><span style="color:#FFAB70">index</span><span style="color:#F97583">=</span><span style="color:#79B8FF">False</span><span style="color:#E1E4E8">))</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D"># Unique Restaurants by Borough (using CAMIS)</span></span>
<span class="line"><span style="color:#E1E4E8">unique_restaurants </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> con.execute(</span><span style="color:#9ECBFF">"""</span></span>
<span class="line"><span style="color:#9ECBFF">  SELECT</span></span>
<span class="line"><span style="color:#9ECBFF">    "BORO",</span></span>
<span class="line"><span style="color:#9ECBFF">    COUNT(DISTINCT "CAMIS") AS unique_restaurants_count</span></span>
<span class="line"><span style="color:#9ECBFF">  FROM read_csv_auto(?)</span></span>
<span class="line"><span style="color:#9ECBFF">  GROUP BY "BORO"</span></span>
<span class="line"><span style="color:#9ECBFF">  ORDER BY unique_restaurants_count DESC</span></span>
<span class="line"><span style="color:#9ECBFF">"""</span><span style="color:#E1E4E8">, [csv_file_path]).df()</span></span>
<span class="line"><span style="color:#79B8FF">print</span><span style="color:#E1E4E8">(unique_restaurants.to_markdown(</span><span style="color:#FFAB70">index</span><span style="color:#F97583">=</span><span style="color:#79B8FF">False</span><span style="color:#E1E4E8">))</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">con.close()</span></span></code></pre>
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
<h2 id="well-that-is-unusual-isnt-it">Well that is Unusual Isn’t it?</h2>
<p>What stands out for me here is all the boroughs appear to have about 10% as many unique restaurants as they do inspections, except the Bronx.  Let’s review that.</p>
<pre class="astro-code github-dark" style="background-color:#24292e;color:#e1e4e8; overflow-x: auto;" tabindex="0" data-language="python"><code><span class="line"><span style="color:#F97583">import</span><span style="color:#E1E4E8"> duckdb</span></span>
<span class="line"><span style="color:#F97583">import</span><span style="color:#E1E4E8"> pandas </span><span style="color:#F97583">as</span><span style="color:#E1E4E8"> pd</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D"># Define the path to your CSV file.</span></span>
<span class="line"><span style="color:#E1E4E8">csv_file_path </span><span style="color:#F97583">=</span><span style="color:#9ECBFF"> 'DOHMH.csv'</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D"># Connect to DuckDB (in-memory)</span></span>
<span class="line"><span style="color:#E1E4E8">con </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> duckdb.connect()</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D"># Get total inspections by borough</span></span>
<span class="line"><span style="color:#E1E4E8">borough_inspections </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> con.execute(</span><span style="color:#9ECBFF">"""</span></span>
<span class="line"><span style="color:#9ECBFF">  SELECT</span></span>
<span class="line"><span style="color:#9ECBFF">    "BORO",</span></span>
<span class="line"><span style="color:#9ECBFF">    COUNT(*) AS total_inspections_in_borough</span></span>
<span class="line"><span style="color:#9ECBFF">  FROM read_csv_auto(?)</span></span>
<span class="line"><span style="color:#9ECBFF">  GROUP BY "BORO"</span></span>
<span class="line"><span style="color:#9ECBFF">  ORDER BY total_inspections_in_borough DESC</span></span>
<span class="line"><span style="color:#9ECBFF">"""</span><span style="color:#E1E4E8">, [csv_file_path]).df()</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D"># Get unique restaurants by borough</span></span>
<span class="line"><span style="color:#E1E4E8">unique_restaurants </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> con.execute(</span><span style="color:#9ECBFF">"""</span></span>
<span class="line"><span style="color:#9ECBFF">  SELECT</span></span>
<span class="line"><span style="color:#9ECBFF">    "BORO",</span></span>
<span class="line"><span style="color:#9ECBFF">    COUNT(DISTINCT "CAMIS") AS unique_restaurants_count</span></span>
<span class="line"><span style="color:#9ECBFF">  FROM read_csv_auto(?)</span></span>
<span class="line"><span style="color:#9ECBFF">  GROUP BY "BORO"</span></span>
<span class="line"><span style="color:#9ECBFF">  ORDER BY unique_restaurants_count DESC</span></span>
<span class="line"><span style="color:#9ECBFF">"""</span><span style="color:#E1E4E8">, [csv_file_path]).df()</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">con.close()</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D"># Merge and calculate percentage</span></span>
<span class="line"><span style="color:#E1E4E8">merged </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> pd.merge(</span></span>
<span class="line"><span style="color:#E1E4E8">    borough_inspections,</span></span>
<span class="line"><span style="color:#E1E4E8">    unique_restaurants,</span></span>
<span class="line"><span style="color:#FFAB70">    on</span><span style="color:#F97583">=</span><span style="color:#9ECBFF">'BORO'</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#FFAB70">    how</span><span style="color:#F97583">=</span><span style="color:#9ECBFF">'outer'</span></span>
<span class="line"><span style="color:#E1E4E8">).fillna(</span><span style="color:#79B8FF">0</span><span style="color:#E1E4E8">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">merged[</span><span style="color:#9ECBFF">'Percentage_Restaurants_per_Inspection'</span><span style="color:#E1E4E8">] </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> (</span></span>
<span class="line"><span style="color:#E1E4E8">    merged[</span><span style="color:#9ECBFF">'unique_restaurants_count'</span><span style="color:#E1E4E8">] </span><span style="color:#F97583">/</span><span style="color:#E1E4E8"> merged[</span><span style="color:#9ECBFF">'total_inspections_in_borough'</span><span style="color:#E1E4E8">] </span><span style="color:#F97583">*</span><span style="color:#79B8FF"> 100</span></span>
<span class="line"><span style="color:#E1E4E8">).round(</span><span style="color:#79B8FF">2</span><span style="color:#E1E4E8">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D"># Format percentage as string with %</span></span>
<span class="line"><span style="color:#E1E4E8">merged[</span><span style="color:#9ECBFF">'Percentage_Restaurants_per_Inspection'</span><span style="color:#E1E4E8">] </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> merged[</span><span style="color:#9ECBFF">'Percentage_Restaurants_per_Inspection'</span><span style="color:#E1E4E8">].map(</span><span style="color:#9ECBFF">'</span><span style="color:#79B8FF">{</span><span style="color:#F97583">:.2f</span><span style="color:#79B8FF">}</span><span style="color:#9ECBFF">%'</span><span style="color:#E1E4E8">.format)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#79B8FF">print</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"Percentage of Unique Restaurants per Inspection by Borough"</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#79B8FF">print</span><span style="color:#E1E4E8">(merged[[</span><span style="color:#9ECBFF">'BORO'</span><span style="color:#E1E4E8">, </span><span style="color:#9ECBFF">'total_inspections_in_borough'</span><span style="color:#E1E4E8">, </span><span style="color:#9ECBFF">'unique_restaurants_count'</span><span style="color:#E1E4E8">, </span><span style="color:#9ECBFF">'Percentage_Restaurants_per_Inspection'</span><span style="color:#E1E4E8">]].to_markdown(</span><span style="color:#FFAB70">index</span><span style="color:#F97583">=</span><span style="color:#79B8FF">False</span><span style="color:#E1E4E8">))</span></span></code></pre>
<h4 id="percentage-of-unique-restaurants-per-inspection-by-borough">Percentage of Unique Restaurants per Inspection by Borough</h4>
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
<p><strong>Insights:</strong></p>
<p>This table clearly quantifies the observation! Excluding the “0” borough (which shows a 100% ratio, likely indicating a data anomaly where unique restaurants equal inspection count), we can analyze the main boroughs:</p>
<ul>
<li>The percentages for Manhattan (11.37%), Staten Island (11.25%), Brooklyn (10.46%), and Queens (10.07%) are all quite close, generally hovering around 10-11% unique restaurants per total inspections.</li>
<li>The Bronx, at <strong>9.82%</strong>, is indeed the lowest among the five main boroughs.</li>
<li>This is the part of data analysis where I like to speculate wildly about why patterns like that emerge, but today I am going to show restraint.</li>
</ul>
<h2 id="lets-talk-donuts">Let’s Talk Donuts</h2>
<p>How many Donut Shops are in New York and how many of them are Dunkin?</p>
<pre class="astro-code github-dark" style="background-color:#24292e;color:#e1e4e8; overflow-x: auto;" tabindex="0" data-language="python"><code><span class="line"><span style="color:#F97583">import</span><span style="color:#E1E4E8"> duckdb</span></span>
<span class="line"><span style="color:#F97583">import</span><span style="color:#E1E4E8"> pandas </span><span style="color:#F97583">as</span><span style="color:#E1E4E8"> pd</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D"># Connect to DuckDB and set CSV file path</span></span>
<span class="line"><span style="color:#E1E4E8">con </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> duckdb.connect()</span></span>
<span class="line"><span style="color:#E1E4E8">csv_file_path </span><span style="color:#F97583">=</span><span style="color:#9ECBFF"> 'DOHMH.csv'</span></span>
<span class="line"><span style="color:#E1E4E8">min_year </span><span style="color:#F97583">=</span><span style="color:#79B8FF"> 2024</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D"># Donut Shop Dominance: Dunkin' vs. Others (Since 2024)</span></span>
<span class="line"><span style="color:#E1E4E8">donut_query </span><span style="color:#F97583">=</span><span style="color:#F97583"> f</span><span style="color:#9ECBFF">"""</span></span>
<span class="line"><span style="color:#9ECBFF">SELECT</span></span>
<span class="line"><span style="color:#9ECBFF">  CASE</span></span>
<span class="line"><span style="color:#9ECBFF">    WHEN "DBA" ILIKE '%DUNKIN%' THEN 'Dunkin'' (Locations)'</span></span>
<span class="line"><span style="color:#9ECBFF">    ELSE 'Other Donut Shops (Locations)'</span></span>
<span class="line"><span style="color:#9ECBFF">  END AS donut_category,</span></span>
<span class="line"><span style="color:#9ECBFF">  COUNT(DISTINCT "CAMIS") AS unique_donut_shop_locations</span></span>
<span class="line"><span style="color:#9ECBFF">FROM read_csv_auto('</span><span style="color:#79B8FF">{</span><span style="color:#E1E4E8">csv_file_path</span><span style="color:#79B8FF">}</span><span style="color:#9ECBFF">')</span></span>
<span class="line"><span style="color:#9ECBFF">WHERE</span></span>
<span class="line"><span style="color:#9ECBFF">  ("CUISINE DESCRIPTION" ILIKE '%DONUT%' OR "CUISINE DESCRIPTION" ILIKE '%DOUGHNUT%')</span></span>
<span class="line"><span style="color:#9ECBFF">  AND CAST(strftime('%Y', "INSPECTION DATE") AS INTEGER) >= </span><span style="color:#79B8FF">{</span><span style="color:#E1E4E8">min_year</span><span style="color:#79B8FF">}</span></span>
<span class="line"><span style="color:#9ECBFF">GROUP BY donut_category</span></span>
<span class="line"><span style="color:#9ECBFF">ORDER BY unique_donut_shop_locations DESC;</span></span>
<span class="line"><span style="color:#9ECBFF">"""</span></span>
<span class="line"><span style="color:#E1E4E8">donut_df </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> con.execute(donut_query).df()</span></span>
<span class="line"><span style="color:#79B8FF">print</span><span style="color:#E1E4E8">(donut_df.to_markdown(</span><span style="color:#FFAB70">index</span><span style="color:#F97583">=</span><span style="color:#79B8FF">False</span><span style="color:#E1E4E8">))</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D"># Names of Other Donut Shops (Since 2024, Excluding Dunkin')</span></span>
<span class="line"><span style="color:#E1E4E8">other_donut_shops_query </span><span style="color:#F97583">=</span><span style="color:#F97583"> f</span><span style="color:#9ECBFF">"""</span></span>
<span class="line"><span style="color:#9ECBFF">SELECT DISTINCT "DBA", "CAMIS"</span></span>
<span class="line"><span style="color:#9ECBFF">FROM read_csv_auto('</span><span style="color:#79B8FF">{</span><span style="color:#E1E4E8">csv_file_path</span><span style="color:#79B8FF">}</span><span style="color:#9ECBFF">')</span></span>
<span class="line"><span style="color:#9ECBFF">WHERE</span></span>
<span class="line"><span style="color:#9ECBFF">  ("CUISINE DESCRIPTION" ILIKE '%DONUT%' OR "CUISINE DESCRIPTION" ILIKE '%DOUGHNUT%')</span></span>
<span class="line"><span style="color:#9ECBFF">  AND "DBA" NOT ILIKE '%DUNKIN%'</span></span>
<span class="line"><span style="color:#9ECBFF">  AND CAST(strftime('%Y', "INSPECTION DATE") AS INTEGER) >= </span><span style="color:#79B8FF">{</span><span style="color:#E1E4E8">min_year</span><span style="color:#79B8FF">}</span></span>
<span class="line"><span style="color:#9ECBFF">LIMIT 20;</span></span>
<span class="line"><span style="color:#9ECBFF">"""</span></span>
<span class="line"><span style="color:#E1E4E8">other_donut_shops_df </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> con.execute(other_donut_shops_query).df()</span></span>
<span class="line"><span style="color:#79B8FF">print</span><span style="color:#E1E4E8">(other_donut_shops_df.to_markdown(</span><span style="color:#FFAB70">index</span><span style="color:#F97583">=</span><span style="color:#79B8FF">False</span><span style="color:#E1E4E8">))</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">con.close()</span></span></code></pre>
<h4 id="donut-shops-since-2024-dunkin-vs-others-in-nyc">Donut Shops (Since 2024): Dunkin’ vs. Others in NYC</h4>
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
<h2 id="the-800-lb-jelly-donut-in-the-room">The 800 lb Jelly Donut in the Room</h2>
<p>Out of 533 Donut Shops in the city more than 93% are Dunkin, and of those 33 non Dunkin shops 8 of them have the word “Krispy” in their name.</p>
<p>Anyway if you made it this far, I hope this was a help to you. I would love to hear your thoughts about Duckdb or Donuts or anything else.</p>`, { headings: 418, localImagePaths: 450, remoteImagePaths: 451, frontmatter: 452, imagePaths: 456 }, [419, 422, 425, 428, 431, 434, 437, 441, 444, 447], { depth: 37, slug: 420, text: 421 }, "optional-but-recommended-simplify-your-file-path", "Optional but Recommended: Simplify Your File Path", { depth: 53, slug: 423, text: 424 }, "getting-your-environment-set-up", "Getting Your Environment Set Up:", { depth: 53, slug: 426, text: 427 }, "initial-data-exploration-first-counts", "Initial Data Exploration: First Counts", { depth: 53, slug: 429, text: 430 }, "tldr-what-makes-this-special", "TLDR: What Makes this Special?", { depth: 53, slug: 432, text: 433 }, "restaurants-by-borough", "Restaurants by Borough", { depth: 53, slug: 435, text: 436 }, "well-that-is-unusual-isnt-it", "Well that is Unusual Isn’t it?", { depth: 438, slug: 439, text: 440 }, 4, "percentage-of-unique-restaurants-per-inspection-by-borough", "Percentage of Unique Restaurants per Inspection by Borough", { depth: 53, slug: 442, text: 443 }, "lets-talk-donuts", "Let’s Talk Donuts", { depth: 438, slug: 445, text: 446 }, "donut-shops-since-2024-dunkin-vs-others-in-nyc", "Donut Shops (Since 2024): Dunkin’ vs. Others in NYC", { depth: 53, slug: 448, text: 449 }, "the-800-lb-jelly-donut-in-the-room", "The 800 lb Jelly Donut in the Room", [], [], { title: 402, categories: 453, tags: 454, pubDate: 455, description: 403 }, [266, 200], [406, 407, 408, 409, 200, 410], ["Date", "2025-06-06T00:00:00.000Z"], [], "2025-06-06-DuckDB-Diners-Drives-and-Databases.md", "2025-06-14-bring-me-the-data", { id: 458, data: 460, body: 467, filePath: 468, digest: 469, rendered: 470, legacyId: 512 }, { title: 461, description: 462, pubDate: 463, tags: 464, categories: 466 }, "Bring me the Data", "A post about Bring me the Data.", ["Date", "2025-06-14T16:00:00.000Z"], [465, 407, 408, 200, 410], "API", [266, 200, 465], '<img src="/img/rest_rate2.png" alt="We\'re toast!" width="400px" height="auto">\n\n<p style="font-size:0.9em; margin-top:0.5em; color:#555;"><em>taking it personally.</em></p>\n\n## NYC Restaurant Inspections Data Pull\n\nWhen I was making the [DuckDB posts]({% post_url 2025-06-08-DuckDB-Diners-Drives-and-Databases-PartII %}), I wanted to include some code to show how to pull the data from the NYC Open Data portal. In the interest of keeping it simple, I just showed how to download the data.  Here\'s a separate post that provides a simple way to pull the data programmatically, if you haven\'t accessed the NYC Open Data portal before, this is a great way to get started and can easily be adpated to the many other datasets available there.\n\nIt is great for practice and to help develop your skills to automate a small call everyday.  To further challenge yourself, you can see how try to see how many days in a row you can pull the data, or to script out jobs to find if there are missing days in your code.  I would say if you come accross an issue and you are not sure what to do, it is probably an issue people who work in data engineering face too.  There is a lot of help out and reccomendations of best policy, but no one has all the answers.  So be humble, but by no means be humbled. \n\n\nThis post is available as code on [GitHub](https://github.com/TJAdryan/nyc-restaurant-inspections) and is adapted from the readme.\n\n## Getting Started\n\nFollow these steps to set up and run the data pull script.\n\n### Prerequisites\n\nBefore you begin, ensure you have the following installed:\n\n*   Python 3.x\n*   pip (Python package installer)\n\n### Installation\n\nClone the repository (or download the files directly):\n\n````bash\ngit clone https://github.com/TJAdryan/nyc-restaurant-inspections.git\ncd nyc-restaurant-inspections\n````\n\nInstall the required Python libraries:\n\n````bash\npip install -r requirements.txt\n````\n\n### Setting up Your Environment (and Securing Your Token!)\n\nIt\'s good practice to keep your API tokens out of your main code files and never commit them to version control. This project uses environment variables for secure token management.\n\n#### Get an NYC Open Data App Token:\n\nWhile many NYC Open Data endpoints can be accessed without a token for basic queries, having one provides higher rate limits and ensures consistent access. You can get one for free by signing up on the NYC Open Data portal.\n\n#### Create a .env file:\n\nIn the root directory of your cloned repository, create a file named .env. This file will store your API token. You can use the provided .env.example as a template.\n\n#### Add your app token to .env:\n\nOpen the .env file and add your token like so:\n\n````dotenv\nMY_APP_SEC="YOUR_APP_TOKEN_GOES_HERE"\n````\n\nReplace "YOUR_APP_SEC_GOES_HERE" with the actual token you obtained.\n\n### Running the Script\n\nOnce you have installed the dependencies and set up your .env file, you can run the data pull script:\n\n````bash\npython pull_data.py\n````\n\nThe script will print progress messages to your console, and once complete, it will save the retrieved restaurant inspection data as CSV and Parquet files in the same directory.  \n\n## Code Overview\n\nThe pull_data.py script performs the following key actions:\n\n*   **Configuration**: Sets up the NYC Open Data endpoint for restaurant inspections and defines the date range.\n*   **Date Range Calculation**: Dynamically calculates a date range that ends exactly 30 days before the current date and extends 90 days prior to that.\n*   **API Interaction**: Makes HTTP requests to the Socrata API, including proper headers for your app token and $where clauses for date filtering.\n*   **Pagination**: Handles retrieving large datasets by iterating through results using $offset parameters until all available data within the specified date range is fetched.\n*   **Data Processing**: Converts the JSON response into a pandas DataFrame and formats the inspection_date column.\n*   **Saving Data**: Exports the cleaned data to CSV and Parquet formats for easy analysis.\n\n## Exploring the Data\n\nOnce you have the data in a pandas DataFrame (and saved to CSV/Parquet), you can explore it using various tools. You might:\n\n*   Filter by grade: Find restaurants with A, B, or C grades.\n*   Analyze violation_description: See the most common violations.\n*   Group by cuisine_description: Compare inspection scores across different cuisines.\n*   Map locations: Use the building, street,zipcode, and boro information to visualize restaurant locations and their inspection outcomes.', "src/content/blog/2025-06-14-Bring-me-the-Data.md", "edb6ee6b753ce217", { html: 471, metadata: 472 }, '<img src="/img/rest_rate2.png" alt="We&#x27;re toast!" width="400px" height="auto">\n<p style="font-size:0.9em; margin-top:0.5em; color:#555;"><em>taking it personally.</em></p>\n<h2 id="nyc-restaurant-inspections-data-pull">NYC Restaurant Inspections Data Pull</h2>\n<p>When I was making the [DuckDB posts]({% post_url 2025-06-08-DuckDB-Diners-Drives-and-Databases-PartII %}), I wanted to include some code to show how to pull the data from the NYC Open Data portal. In the interest of keeping it simple, I just showed how to download the data.  Here’s a separate post that provides a simple way to pull the data programmatically, if you haven’t accessed the NYC Open Data portal before, this is a great way to get started and can easily be adpated to the many other datasets available there.</p>\n<p>It is great for practice and to help develop your skills to automate a small call everyday.  To further challenge yourself, you can see how try to see how many days in a row you can pull the data, or to script out jobs to find if there are missing days in your code.  I would say if you come accross an issue and you are not sure what to do, it is probably an issue people who work in data engineering face too.  There is a lot of help out and reccomendations of best policy, but no one has all the answers.  So be humble, but by no means be humbled.</p>\n<p>This post is available as code on <a href="https://github.com/TJAdryan/nyc-restaurant-inspections">GitHub</a> and is adapted from the readme.</p>\n<h2 id="getting-started">Getting Started</h2>\n<p>Follow these steps to set up and run the data pull script.</p>\n<h3 id="prerequisites">Prerequisites</h3>\n<p>Before you begin, ensure you have the following installed:</p>\n<ul>\n<li>Python 3.x</li>\n<li>pip (Python package installer)</li>\n</ul>\n<h3 id="installation">Installation</h3>\n<p>Clone the repository (or download the files directly):</p>\n<pre class="astro-code github-dark" style="background-color:#24292e;color:#e1e4e8; overflow-x: auto;" tabindex="0" data-language="bash"><code><span class="line"><span style="color:#B392F0">git</span><span style="color:#9ECBFF"> clone</span><span style="color:#9ECBFF"> https://github.com/TJAdryan/nyc-restaurant-inspections.git</span></span>\n<span class="line"><span style="color:#79B8FF">cd</span><span style="color:#9ECBFF"> nyc-restaurant-inspections</span></span></code></pre>\n<p>Install the required Python libraries:</p>\n<pre class="astro-code github-dark" style="background-color:#24292e;color:#e1e4e8; overflow-x: auto;" tabindex="0" data-language="bash"><code><span class="line"><span style="color:#B392F0">pip</span><span style="color:#9ECBFF"> install</span><span style="color:#79B8FF"> -r</span><span style="color:#9ECBFF"> requirements.txt</span></span></code></pre>\n<h3 id="setting-up-your-environment-and-securing-your-token">Setting up Your Environment (and Securing Your Token!)</h3>\n<p>It’s good practice to keep your API tokens out of your main code files and never commit them to version control. This project uses environment variables for secure token management.</p>\n<h4 id="get-an-nyc-open-data-app-token">Get an NYC Open Data App Token:</h4>\n<p>While many NYC Open Data endpoints can be accessed without a token for basic queries, having one provides higher rate limits and ensures consistent access. You can get one for free by signing up on the NYC Open Data portal.</p>\n<h4 id="create-a-env-file">Create a .env file:</h4>\n<p>In the root directory of your cloned repository, create a file named .env. This file will store your API token. You can use the provided .env.example as a template.</p>\n<h4 id="add-your-app-token-to-env">Add your app token to .env:</h4>\n<p>Open the .env file and add your token like so:</p>\n<pre class="astro-code github-dark" style="background-color:#24292e;color:#e1e4e8; overflow-x: auto;" tabindex="0" data-language="dotenv"><code><span class="line"><span style="color:#FFAB70">MY_APP_SEC</span><span style="color:#F97583">=</span><span style="color:#9ECBFF">"YOUR_APP_TOKEN_GOES_HERE"</span></span></code></pre>\n<p>Replace “YOUR_APP_SEC_GOES_HERE” with the actual token you obtained.</p>\n<h3 id="running-the-script">Running the Script</h3>\n<p>Once you have installed the dependencies and set up your .env file, you can run the data pull script:</p>\n<pre class="astro-code github-dark" style="background-color:#24292e;color:#e1e4e8; overflow-x: auto;" tabindex="0" data-language="bash"><code><span class="line"><span style="color:#B392F0">python</span><span style="color:#9ECBFF"> pull_data.py</span></span></code></pre>\n<p>The script will print progress messages to your console, and once complete, it will save the retrieved restaurant inspection data as CSV and Parquet files in the same directory.</p>\n<h2 id="code-overview">Code Overview</h2>\n<p>The pull_data.py script performs the following key actions:</p>\n<ul>\n<li><strong>Configuration</strong>: Sets up the NYC Open Data endpoint for restaurant inspections and defines the date range.</li>\n<li><strong>Date Range Calculation</strong>: Dynamically calculates a date range that ends exactly 30 days before the current date and extends 90 days prior to that.</li>\n<li><strong>API Interaction</strong>: Makes HTTP requests to the Socrata API, including proper headers for your app token and $where clauses for date filtering.</li>\n<li><strong>Pagination</strong>: Handles retrieving large datasets by iterating through results using $offset parameters until all available data within the specified date range is fetched.</li>\n<li><strong>Data Processing</strong>: Converts the JSON response into a pandas DataFrame and formats the inspection_date column.</li>\n<li><strong>Saving Data</strong>: Exports the cleaned data to CSV and Parquet formats for easy analysis.</li>\n</ul>\n<h2 id="exploring-the-data">Exploring the Data</h2>\n<p>Once you have the data in a pandas DataFrame (and saved to CSV/Parquet), you can explore it using various tools. You might:</p>\n<ul>\n<li>Filter by grade: Find restaurants with A, B, or C grades.</li>\n<li>Analyze violation_description: See the most common violations.</li>\n<li>Group by cuisine_description: Compare inspection scores across different cuisines.</li>\n<li>Map locations: Use the building, street,zipcode, and boro information to visualize restaurant locations and their inspection outcomes.</li>\n</ul>', { headings: 473, localImagePaths: 505, remoteImagePaths: 506, frontmatter: 507, imagePaths: 511 }, [474, 477, 480, 481, 484, 487, 490, 493, 496, 499, 502], { depth: 53, slug: 475, text: 476 }, "nyc-restaurant-inspections-data-pull", "NYC Restaurant Inspections Data Pull", { depth: 53, slug: 478, text: 479 }, "getting-started", "Getting Started", { depth: 37, slug: 125, text: 126 }, { depth: 37, slug: 482, text: 483 }, "installation", "Installation", { depth: 37, slug: 485, text: 486 }, "setting-up-your-environment-and-securing-your-token", "Setting up Your Environment (and Securing Your Token!)", { depth: 438, slug: 488, text: 489 }, "get-an-nyc-open-data-app-token", "Get an NYC Open Data App Token:", { depth: 438, slug: 491, text: 492 }, "create-a-env-file", "Create a .env file:", { depth: 438, slug: 494, text: 495 }, "add-your-app-token-to-env", "Add your app token to .env:", { depth: 37, slug: 497, text: 498 }, "running-the-script", "Running the Script", { depth: 53, slug: 500, text: 501 }, "code-overview", "Code Overview", { depth: 53, slug: 503, text: 504 }, "exploring-the-data", "Exploring the Data", [], [], { title: 461, categories: 508, tags: 509, pubDate: 510, description: 462 }, [266, 200, 465], [465, 407, 408, 200, 410], "2025-06-14 12:00:00 -0400", [], "2025-06-14-Bring-me-the-Data.md", "2025-06-08-duckdb-diners-drives-and-databases-partii", { id: 513, data: 515, body: 521, filePath: 522, digest: 523, rendered: 524, legacyId: 550 }, { title: 516, description: 517, pubDate: 518, tags: 519, categories: 520 }, "DuckDB - Diners, Drives, and Databases Part II", "A post about DuckDB - Diners, Drives, and Databases Part II.", ["Date", "2025-06-08T00:00:00.000Z"], [406, 407, 408, 409, 200, 410], [266, 200], `<img src="/img/duckdbgf2.png" alt="All paws on Deck" width="400px" height="auto">

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
- Rename a column (\`DBA\` to \`Restaurant_Name\` for clarity).
- Filter out any records where the \`BORO\` is \`'0'\` (an anomalous entry we noticed in Part I).
- Write the transformed data to a new CSV file.

\`\`\`python
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
\`\`\`
## 2. Space-Saving Formats: Compressed CSV & Parquet
Once your data is transformed, you often want to store it efficiently. DuckDB makes it trivial to convert your data into compressed formats, which can significantly reduce storage space and often improve read performance for subsequent analytical queries. We'll compare:

The original DOHMH.csv.
Our new DOHMH_transformed.csv.
A GZIP-compressed version of the transformed CSV.
A Parquet version of the transformed data.

\`\`\`python

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

print(f"\\n--- Comparing File Sizes ---")

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


    print(f"\\nTotal savings from original CSV to Parquet: "
          f"{((original_size_bytes - parquet_size_bytes) / original_size_bytes) * 100:.2f}%")

except FileNotFoundError as e:
    print(f"Error: A required file was not found. Please ensure '{original_csv_path}' and '{transformed_csv_path}' exist. {e}")
except Exception as e:
    print(f"Error during file compression/conversion: {e}")

finally:
    con.close()
\`\`\`
You should see some pretty amazing space savings.  Here are my results more than a 30% savings from the original CSV to the transformed CSV, and then over 90% savings when compressing to GZIP and converting to Parquet. More than 15X reduction, saving in the right format means you can keep a year worth of data in the space you would have used for a single month in the original CSV format.

\`\`\`
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
\`\`\`
## 3. Data Typing & PostgreSQL Compatibility

Before loading data into a production database like PostgreSQL, it's crucial to confirm that your data types are correct and compatible. DuckDB does a great job of inferring types, but explicit confirmation and potential casting are good practice to avoid surprises during loading.



\`\`\`python
import duckdb
import pandas as pd # For displaying schema as a DataFrame

# Path to our transformed Parquet file (or CSV, it doesn't matter for schema inspection)
transformed_data_path = 'DOHMH_transformed.parquet'

# Re-establishing connection
con = duckdb.connect()

print(f"\\n--- Inspecting Schema for PostgreSQL Compatibility ---")

try:
    # Use PRAGMA table_info to get the schema of data from a file
    # We implicitly create a temporary table/view from the file for inspection
    schema_query = f"""
    PRAGMA table_info('{transformed_data_path}');
    """
    schema_df = con.sql(schema_query).df()

    print("DuckDB Inferred Schema (from transformed data):")
    print(schema_df.to_string(index=False))

    print("\\n--- PostgreSQL Type Considerations ---")
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
            # max_len_query = f"SELECT MAX(LENGTH(\\"{column_name}\\")) FROM '{transformed_data_path}';"
            # max_len = con.sql(max_len_query).fetchone()[0]
            # pg_equivalent = f"VARCHAR({max_len or 255})" # Use a default if max_len is 0 or None
            pg_equivalent = "VARCHAR(255)" # Common default for text, adjust as needed or calculate max_len

        print(f"- Column: '{column_name}'")
        print(f"  DuckDB Type: {duckdb_type}")
        print(f"  PostgreSQL Equivalent: {pg_equivalent}")
        print(f"  Nullable: {nullable}")
        print(f"  Considerations: {'Check string max length' if duckdb_type.upper() == 'VARCHAR' else 'Confirm precision/scale' if duckdb_type.upper() == 'DECIMAL' else 'Standard mapping'}")
        print("-" * 30)

    print("\\nTo load into PostgreSQL, you would typically use a PostgreSQL client library (like Psycopg2 in Python) or a tool like \`pg_loader\` after connecting to your PostgreSQL database. DuckDB acts as an intermediary here, handling the transformation and type validation.")

except FileNotFoundError:
    print(f"Error: Transformed data file '{transformed_data_path}' not found. Please ensure the previous steps ran successfully.")
except Exception as e:
    print(f"Error inspecting schema: {e}")

finally:
    con.close()

\`\`\`
## Explanation of Schema Inspection:

Let's break down what's happening in the schema inspection step:

- **\`PRAGMA table_info('file_path')\`:**  
    This handy DuckDB command lets you peek at the schema DuckDB infers from your file—no need to create a table first. It shows you each column's name, data type, whether it allows NULLs, and more.

- **Mapping to PostgreSQL:**  
    We walk through a general mapping of DuckDB types to PostgreSQL equivalents. Here are a few things to keep in mind:
    - **VARCHAR length:** DuckDB's \`VARCHAR\` is flexible, but PostgreSQL usually wants a specific length (like \`VARCHAR(255)\`). To pick the right number, you can run a quick \`SELECT MAX(LENGTH(column_name))\` on your data.
    - **DECIMAL / NUMERIC:** If you have columns with decimal numbers (like scores), you'll want to decide on the total number of digits (\`PRECISION\`) and how many come after the decimal point (\`SCALE\`).
    - **Date/Time types:** DuckDB is pretty good at figuring out dates and timestamps, but double-check if you need a plain \`DATE\` or a full \`TIMESTAMP\` (and whether you need time zones) for PostgreSQL.

---

### Wrapping Up Part II

In this post, we've seen how DuckDB can help you:

- Transform data directly from CSVs with SQL, no manual file wrangling required.
- Store your results in space-saving formats like compressed CSV and Parquet.
- Inspect and prepare your data's schema for a smooth handoff to databases like PostgreSQL.

I hope this gives you some good ideas for how t use DuckDB as an ETL tool in your data workflows.  I realize this I went in a few different directions here, I like the idea of exploring what is possible and then refining my approach for my use case.  If you have something you are using DuckDB for that I didn't cover please share it.  I love to hearing what is working for others.`, "src/content/blog/2025-06-08-DuckDB-Diners-Drives-and-Databases-PartII.md", "caf08752cd2578d6", { html: 525, metadata: 526 }, `<img src="/img/duckdbgf2.png" alt="All paws on Deck" width="400px" height="auto">
<p style="font-size:0.9em; margin-top:0.5em; color:#555;"><em>Hoping for an A.</em></p>
<p>In [Part I]({% post_url 2025-06-06-DuckDB-Diners-Drives-and-Databases %}) , we got our feet wet by performing initial data explorations on the NYC restaurant inspection dataset directly from a CSV file. We saw how DuckDB allows for quick insights without full data loading into memory.</p>
<p>I felt like I didn’t get to cover everything I wanted to touch in the last post so here I will focus on some of the other capabilities namely as a lightweight, in-process ETL (Extract, Transform, Load) tool.</p>
<p>We’ll cover:</p>
<ul>
<li>Performing CSV-to-CSV transformations purely with SQL, without ever needing to manually inspect the file.</li>
<li>Converting your transformed data into space-efficient formats like compressed CSV (GZIP) and Parquet, and quantifying the storage savings.</li>
<li>Inspecting the data types within DuckDB and confirming their compatibility before a potential load into a production database like PostgreSQL.</li>
</ul>
<p>Let’s pick up where we left off, assuming you have your DOHMH.csv file ready and your DuckDB environment set up.</p>
<h2 id="1-the-blind-csv-to-csv-transformation">1. The “Blind” CSV-to-CSV Transformation</h2>
<p>Imagine you’ve received a large CSV file, and you know it needs some basic cleaning or column selection before you can use it. Just to save a subset. DuckDB is perfect for this “blind” transformation.</p>
<p>We’ll take our DOHMH.csv and perform a few common transformations:</p>
<ul>
<li>Select a subset of relevant columns.</li>
<li>Rename a column (<code>DBA</code> to <code>Restaurant_Name</code> for clarity).</li>
<li>Filter out any records where the <code>BORO</code> is <code>'0'</code> (an anomalous entry we noticed in Part I).</li>
<li>Write the transformed data to a new CSV file.</li>
</ul>
<pre class="astro-code github-dark" style="background-color:#24292e;color:#e1e4e8; overflow-x: auto;" tabindex="0" data-language="python"><code><span class="line"><span style="color:#F97583">import</span><span style="color:#E1E4E8"> duckdb</span></span>
<span class="line"><span style="color:#F97583">import</span><span style="color:#E1E4E8"> os</span></span>
<span class="line"><span style="color:#F97583">import</span><span style="color:#E1E4E8"> pandas </span><span style="color:#F97583">as</span><span style="color:#E1E4E8"> pd  </span><span style="color:#6A737D"># For displaying schemas later</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D"># Define the path to your original CSV file</span></span>
<span class="line"><span style="color:#E1E4E8">csv_file_path </span><span style="color:#F97583">=</span><span style="color:#9ECBFF"> 'DOHMH.csv'</span></span>
<span class="line"><span style="color:#6A737D"># Define the path for the new, transformed CSV</span></span>
<span class="line"><span style="color:#E1E4E8">transformed_csv_path </span><span style="color:#F97583">=</span><span style="color:#9ECBFF"> 'DOHMH_transformed.csv'</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D"># Establish a connection to an in-memory DuckDB database</span></span>
<span class="line"><span style="color:#E1E4E8">con </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> duckdb.connect()</span></span>
<span class="line"></span>
<span class="line"><span style="color:#79B8FF">print</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">f</span><span style="color:#9ECBFF">"--- Performing CSV-to-CSV Transformation ---"</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#79B8FF">print</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">f</span><span style="color:#9ECBFF">"Reading '</span><span style="color:#79B8FF">{</span><span style="color:#E1E4E8">csv_file_path</span><span style="color:#79B8FF">}</span><span style="color:#9ECBFF">' and writing to '</span><span style="color:#79B8FF">{</span><span style="color:#E1E4E8">transformed_csv_path</span><span style="color:#79B8FF">}</span><span style="color:#9ECBFF">'..."</span><span style="color:#E1E4E8">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">try</span><span style="color:#E1E4E8">:</span></span>
<span class="line"><span style="color:#6A737D">    # Use DuckDB's COPY statement with a subquery to transform data</span></span>
<span class="line"><span style="color:#6A737D">    # The subquery selects, renames, and filters data without loading the whole file</span></span>
<span class="line"><span style="color:#E1E4E8">    transform_query </span><span style="color:#F97583">=</span><span style="color:#F97583"> f</span><span style="color:#9ECBFF">'''</span></span>
<span class="line"><span style="color:#9ECBFF">    COPY (</span></span>
<span class="line"><span style="color:#9ECBFF">        SELECT</span></span>
<span class="line"><span style="color:#9ECBFF">            "CAMIS",</span></span>
<span class="line"><span style="color:#9ECBFF">            "DBA" AS "Restaurant_Name", -- Renaming DBA column</span></span>
<span class="line"><span style="color:#9ECBFF">            "BORO",</span></span>
<span class="line"><span style="color:#9ECBFF">            "BUILDING",</span></span>
<span class="line"><span style="color:#9ECBFF">            "STREET",</span></span>
<span class="line"><span style="color:#9ECBFF">            "ZIPCODE",</span></span>
<span class="line"><span style="color:#9ECBFF">            "CUISINE DESCRIPTION",</span></span>
<span class="line"><span style="color:#9ECBFF">            "INSPECTION DATE",</span></span>
<span class="line"><span style="color:#9ECBFF">            "ACTION",</span></span>
<span class="line"><span style="color:#9ECBFF">            "VIOLATION CODE",</span></span>
<span class="line"><span style="color:#9ECBFF">            "VIOLATION DESCRIPTION",</span></span>
<span class="line"><span style="color:#9ECBFF">            "CRITICAL FLAG",</span></span>
<span class="line"><span style="color:#9ECBFF">            "SCORE",</span></span>
<span class="line"><span style="color:#9ECBFF">            "GRADE"</span></span>
<span class="line"><span style="color:#9ECBFF">        FROM</span></span>
<span class="line"><span style="color:#9ECBFF">            '</span><span style="color:#79B8FF">{</span><span style="color:#E1E4E8">csv_file_path</span><span style="color:#79B8FF">}</span><span style="color:#9ECBFF">'</span></span>
<span class="line"><span style="color:#9ECBFF">        WHERE</span></span>
<span class="line"><span style="color:#9ECBFF">            "BORO" != '0' -- Filter out anomalous '0' borough</span></span>
<span class="line"><span style="color:#9ECBFF">            AND "CAMIS" IS NOT NULL -- Ensure unique identifier is present</span></span>
<span class="line"><span style="color:#9ECBFF">    ) TO '</span><span style="color:#79B8FF">{</span><span style="color:#E1E4E8">transformed_csv_path</span><span style="color:#79B8FF">}</span><span style="color:#9ECBFF">' (HEADER, DELIMITER ',');</span></span>
<span class="line"><span style="color:#9ECBFF">    '''</span></span>
<span class="line"><span style="color:#E1E4E8">    con.execute(transform_query)</span></span>
<span class="line"><span style="color:#79B8FF">    print</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">f</span><span style="color:#9ECBFF">"Transformation complete. Transformed data saved to: </span><span style="color:#79B8FF">{</span><span style="color:#E1E4E8">transformed_csv_path</span><span style="color:#79B8FF">}</span><span style="color:#9ECBFF">"</span><span style="color:#E1E4E8">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">except</span><span style="color:#79B8FF"> Exception</span><span style="color:#F97583"> as</span><span style="color:#E1E4E8"> e:</span></span>
<span class="line"><span style="color:#79B8FF">    print</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">f</span><span style="color:#9ECBFF">"Error during transformation: </span><span style="color:#79B8FF">{</span><span style="color:#E1E4E8">e</span><span style="color:#79B8FF">}</span><span style="color:#9ECBFF">"</span><span style="color:#E1E4E8">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">finally</span><span style="color:#E1E4E8">:</span></span>
<span class="line"><span style="color:#E1E4E8">    con.close()</span></span></code></pre>
<h2 id="2-space-saving-formats-compressed-csv--parquet">2. Space-Saving Formats: Compressed CSV &#x26; Parquet</h2>
<p>Once your data is transformed, you often want to store it efficiently. DuckDB makes it trivial to convert your data into compressed formats, which can significantly reduce storage space and often improve read performance for subsequent analytical queries. We’ll compare:</p>
<p>The original DOHMH.csv.
Our new DOHMH_transformed.csv.
A GZIP-compressed version of the transformed CSV.
A Parquet version of the transformed data.</p>
<pre class="astro-code github-dark" style="background-color:#24292e;color:#e1e4e8; overflow-x: auto;" tabindex="0" data-language="python"><code><span class="line"></span>
<span class="line"><span style="color:#F97583">import</span><span style="color:#E1E4E8"> duckdb</span></span>
<span class="line"><span style="color:#F97583">import</span><span style="color:#E1E4E8"> os</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D"># Paths from previous step</span></span>
<span class="line"><span style="color:#E1E4E8">original_csv_path </span><span style="color:#F97583">=</span><span style="color:#9ECBFF"> 'DOHMH.csv'</span></span>
<span class="line"><span style="color:#E1E4E8">transformed_csv_path </span><span style="color:#F97583">=</span><span style="color:#9ECBFF"> 'DOHMH_transformed.csv'</span></span>
<span class="line"><span style="color:#E1E4E8">compressed_csv_path </span><span style="color:#F97583">=</span><span style="color:#9ECBFF"> 'DOHMH_transformed_compressed.csv.gz'</span><span style="color:#6A737D"> # .gz suffix is common for GZIP</span></span>
<span class="line"><span style="color:#E1E4E8">parquet_path </span><span style="color:#F97583">=</span><span style="color:#9ECBFF"> 'DOHMH_transformed.parquet'</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D"># Ensure the transformed_csv_path exists from the previous step, or run the transformation again</span></span>
<span class="line"><span style="color:#6A737D"># Re-establishing connection for this snippet</span></span>
<span class="line"><span style="color:#E1E4E8">con </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> duckdb.connect()</span></span>
<span class="line"></span>
<span class="line"><span style="color:#79B8FF">print</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">f</span><span style="color:#9ECBFF">"</span><span style="color:#79B8FF">\\n</span><span style="color:#9ECBFF">--- Comparing File Sizes ---"</span><span style="color:#E1E4E8">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">try</span><span style="color:#E1E4E8">:</span></span>
<span class="line"><span style="color:#6A737D">    # Get original CSV size</span></span>
<span class="line"><span style="color:#E1E4E8">    original_size_bytes </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> os.path.getsize(original_csv_path)</span></span>
<span class="line"><span style="color:#79B8FF">    print</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">f</span><span style="color:#9ECBFF">"Original CSV Size: </span><span style="color:#79B8FF">{</span><span style="color:#E1E4E8">original_size_bytes </span><span style="color:#F97583">/</span><span style="color:#E1E4E8"> (</span><span style="color:#79B8FF">1024</span><span style="color:#F97583"> *</span><span style="color:#79B8FF"> 1024</span><span style="color:#E1E4E8">)</span><span style="color:#F97583">:.2f</span><span style="color:#79B8FF">}</span><span style="color:#9ECBFF"> MB"</span><span style="color:#E1E4E8">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    # Get transformed CSV size</span></span>
<span class="line"><span style="color:#E1E4E8">    transformed_size_bytes </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> os.path.getsize(transformed_csv_path)</span></span>
<span class="line"><span style="color:#79B8FF">    print</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">f</span><span style="color:#9ECBFF">"Transformed CSV Size: </span><span style="color:#79B8FF">{</span><span style="color:#E1E4E8">transformed_size_bytes </span><span style="color:#F97583">/</span><span style="color:#E1E4E8"> (</span><span style="color:#79B8FF">1024</span><span style="color:#F97583"> *</span><span style="color:#79B8FF"> 1024</span><span style="color:#E1E4E8">)</span><span style="color:#F97583">:.2f</span><span style="color:#79B8FF">}</span><span style="color:#9ECBFF"> MB"</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#79B8FF">    print</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">f</span><span style="color:#9ECBFF">"  Savings from Transformation (selected columns, filtered rows): "</span></span>
<span class="line"><span style="color:#F97583">          f</span><span style="color:#9ECBFF">"</span><span style="color:#79B8FF">{</span><span style="color:#E1E4E8">((original_size_bytes </span><span style="color:#F97583">-</span><span style="color:#E1E4E8"> transformed_size_bytes) </span><span style="color:#F97583">/</span><span style="color:#E1E4E8"> original_size_bytes) </span><span style="color:#F97583">*</span><span style="color:#79B8FF"> 100</span><span style="color:#F97583">:.2f</span><span style="color:#79B8FF">}</span><span style="color:#9ECBFF">%"</span><span style="color:#E1E4E8">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    # Write to GZIP compressed CSV</span></span>
<span class="line"><span style="color:#79B8FF">    print</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">f</span><span style="color:#9ECBFF">"Writing transformed data to GZIP compressed CSV: </span><span style="color:#79B8FF">{</span><span style="color:#E1E4E8">compressed_csv_path</span><span style="color:#79B8FF">}</span><span style="color:#9ECBFF">"</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#E1E4E8">    copy_to_compressed_csv_query </span><span style="color:#F97583">=</span><span style="color:#F97583"> f</span><span style="color:#9ECBFF">"""</span></span>
<span class="line"><span style="color:#9ECBFF">    COPY (SELECT * FROM '</span><span style="color:#79B8FF">{</span><span style="color:#E1E4E8">transformed_csv_path</span><span style="color:#79B8FF">}</span><span style="color:#9ECBFF">') TO '</span><span style="color:#79B8FF">{</span><span style="color:#E1E4E8">compressed_csv_path</span><span style="color:#79B8FF">}</span><span style="color:#9ECBFF">' (HEADER, DELIMITER ',', COMPRESSION GZIP);</span></span>
<span class="line"><span style="color:#9ECBFF">    """</span></span>
<span class="line"><span style="color:#E1E4E8">    con.execute(copy_to_compressed_csv_query)</span></span>
<span class="line"><span style="color:#E1E4E8">    compressed_size_bytes </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> os.path.getsize(compressed_csv_path)</span></span>
<span class="line"><span style="color:#79B8FF">    print</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">f</span><span style="color:#9ECBFF">"Compressed CSV (GZIP) Size: </span><span style="color:#79B8FF">{</span><span style="color:#E1E4E8">compressed_size_bytes </span><span style="color:#F97583">/</span><span style="color:#E1E4E8"> (</span><span style="color:#79B8FF">1024</span><span style="color:#F97583"> *</span><span style="color:#79B8FF"> 1024</span><span style="color:#E1E4E8">)</span><span style="color:#F97583">:.2f</span><span style="color:#79B8FF">}</span><span style="color:#9ECBFF"> MB"</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#79B8FF">    print</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">f</span><span style="color:#9ECBFF">"  Savings vs. Transformed CSV: "</span></span>
<span class="line"><span style="color:#F97583">          f</span><span style="color:#9ECBFF">"</span><span style="color:#79B8FF">{</span><span style="color:#E1E4E8">((transformed_size_bytes </span><span style="color:#F97583">-</span><span style="color:#E1E4E8"> compressed_size_bytes) </span><span style="color:#F97583">/</span><span style="color:#E1E4E8"> transformed_size_bytes) </span><span style="color:#F97583">*</span><span style="color:#79B8FF"> 100</span><span style="color:#F97583">:.2f</span><span style="color:#79B8FF">}</span><span style="color:#9ECBFF">%"</span><span style="color:#E1E4E8">)</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    # Write to Parquet</span></span>
<span class="line"><span style="color:#79B8FF">    print</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">f</span><span style="color:#9ECBFF">"Writing transformed data to Parquet: </span><span style="color:#79B8FF">{</span><span style="color:#E1E4E8">parquet_path</span><span style="color:#79B8FF">}</span><span style="color:#9ECBFF">"</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#E1E4E8">    copy_to_parquet_query </span><span style="color:#F97583">=</span><span style="color:#F97583"> f</span><span style="color:#9ECBFF">"""</span></span>
<span class="line"><span style="color:#9ECBFF">    COPY (SELECT * FROM '</span><span style="color:#79B8FF">{</span><span style="color:#E1E4E8">transformed_csv_path</span><span style="color:#79B8FF">}</span><span style="color:#9ECBFF">') TO '</span><span style="color:#79B8FF">{</span><span style="color:#E1E4E8">parquet_path</span><span style="color:#79B8FF">}</span><span style="color:#9ECBFF">' (FORMAT PARQUET);</span></span>
<span class="line"><span style="color:#9ECBFF">    """</span></span>
<span class="line"><span style="color:#E1E4E8">    con.execute(copy_to_parquet_query)</span></span>
<span class="line"><span style="color:#E1E4E8">    parquet_size_bytes </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> os.path.getsize(parquet_path)</span></span>
<span class="line"><span style="color:#79B8FF">    print</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">f</span><span style="color:#9ECBFF">"Parquet Size: </span><span style="color:#79B8FF">{</span><span style="color:#E1E4E8">parquet_size_bytes </span><span style="color:#F97583">/</span><span style="color:#E1E4E8"> (</span><span style="color:#79B8FF">1024</span><span style="color:#F97583"> *</span><span style="color:#79B8FF"> 1024</span><span style="color:#E1E4E8">)</span><span style="color:#F97583">:.2f</span><span style="color:#79B8FF">}</span><span style="color:#9ECBFF"> MB"</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#79B8FF">    print</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">f</span><span style="color:#9ECBFF">"  Savings vs. Transformed CSV: "</span></span>
<span class="line"><span style="color:#F97583">          f</span><span style="color:#9ECBFF">"</span><span style="color:#79B8FF">{</span><span style="color:#E1E4E8">((transformed_size_bytes </span><span style="color:#F97583">-</span><span style="color:#E1E4E8"> parquet_size_bytes) </span><span style="color:#F97583">/</span><span style="color:#E1E4E8"> transformed_size_bytes) </span><span style="color:#F97583">*</span><span style="color:#79B8FF"> 100</span><span style="color:#F97583">:.2f</span><span style="color:#79B8FF">}</span><span style="color:#9ECBFF">%"</span><span style="color:#E1E4E8">)</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="color:#79B8FF">    print</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">f</span><span style="color:#9ECBFF">"</span><span style="color:#79B8FF">\\n</span><span style="color:#9ECBFF">Total savings from original CSV to Parquet: "</span></span>
<span class="line"><span style="color:#F97583">          f</span><span style="color:#9ECBFF">"</span><span style="color:#79B8FF">{</span><span style="color:#E1E4E8">((original_size_bytes </span><span style="color:#F97583">-</span><span style="color:#E1E4E8"> parquet_size_bytes) </span><span style="color:#F97583">/</span><span style="color:#E1E4E8"> original_size_bytes) </span><span style="color:#F97583">*</span><span style="color:#79B8FF"> 100</span><span style="color:#F97583">:.2f</span><span style="color:#79B8FF">}</span><span style="color:#9ECBFF">%"</span><span style="color:#E1E4E8">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">except</span><span style="color:#79B8FF"> FileNotFoundError</span><span style="color:#F97583"> as</span><span style="color:#E1E4E8"> e:</span></span>
<span class="line"><span style="color:#79B8FF">    print</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">f</span><span style="color:#9ECBFF">"Error: A required file was not found. Please ensure '</span><span style="color:#79B8FF">{</span><span style="color:#E1E4E8">original_csv_path</span><span style="color:#79B8FF">}</span><span style="color:#9ECBFF">' and '</span><span style="color:#79B8FF">{</span><span style="color:#E1E4E8">transformed_csv_path</span><span style="color:#79B8FF">}</span><span style="color:#9ECBFF">' exist. </span><span style="color:#79B8FF">{</span><span style="color:#E1E4E8">e</span><span style="color:#79B8FF">}</span><span style="color:#9ECBFF">"</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#F97583">except</span><span style="color:#79B8FF"> Exception</span><span style="color:#F97583"> as</span><span style="color:#E1E4E8"> e:</span></span>
<span class="line"><span style="color:#79B8FF">    print</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">f</span><span style="color:#9ECBFF">"Error during file compression/conversion: </span><span style="color:#79B8FF">{</span><span style="color:#E1E4E8">e</span><span style="color:#79B8FF">}</span><span style="color:#9ECBFF">"</span><span style="color:#E1E4E8">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">finally</span><span style="color:#E1E4E8">:</span></span>
<span class="line"><span style="color:#E1E4E8">    con.close()</span></span></code></pre>
<p>You should see some pretty amazing space savings.  Here are my results more than a 30% savings from the original CSV to the transformed CSV, and then over 90% savings when compressing to GZIP and converting to Parquet. More than 15X reduction, saving in the right format means you can keep a year worth of data in the space you would have used for a single month in the original CSV format.</p>
<pre class="astro-code github-dark" style="background-color:#24292e;color:#e1e4e8; overflow-x: auto;" tabindex="0" data-language="plaintext"><code><span class="line"><span>--- Comparing File Sizes ---</span></span>
<span class="line"><span>Original CSV Size: 124.82 MB</span></span>
<span class="line"><span>Transformed CSV Size: 85.26 MB</span></span>
<span class="line"><span>  Savings from Transformation (selected columns, filtered rows): 31.69%</span></span>
<span class="line"><span>Writing transformed data to GZIP compressed CSV: DOHMH_transformed_compressed.csv.gz</span></span>
<span class="line"><span>Compressed CSV (GZIP) Size: 7.56 MB</span></span>
<span class="line"><span>  Savings vs. Transformed CSV: 91.13%</span></span>
<span class="line"><span>Writing transformed data to Parquet: DOHMH_transformed.parquet</span></span>
<span class="line"><span>Parquet Size: 7.41 MB</span></span>
<span class="line"><span>  Savings vs. Transformed CSV: 91.31%</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Total savings from original CSV to Parquet: 94.07%</span></span></code></pre>
<h2 id="3-data-typing--postgresql-compatibility">3. Data Typing &#x26; PostgreSQL Compatibility</h2>
<p>Before loading data into a production database like PostgreSQL, it’s crucial to confirm that your data types are correct and compatible. DuckDB does a great job of inferring types, but explicit confirmation and potential casting are good practice to avoid surprises during loading.</p>
<pre class="astro-code github-dark" style="background-color:#24292e;color:#e1e4e8; overflow-x: auto;" tabindex="0" data-language="python"><code><span class="line"><span style="color:#F97583">import</span><span style="color:#E1E4E8"> duckdb</span></span>
<span class="line"><span style="color:#F97583">import</span><span style="color:#E1E4E8"> pandas </span><span style="color:#F97583">as</span><span style="color:#E1E4E8"> pd </span><span style="color:#6A737D"># For displaying schema as a DataFrame</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D"># Path to our transformed Parquet file (or CSV, it doesn't matter for schema inspection)</span></span>
<span class="line"><span style="color:#E1E4E8">transformed_data_path </span><span style="color:#F97583">=</span><span style="color:#9ECBFF"> 'DOHMH_transformed.parquet'</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D"># Re-establishing connection</span></span>
<span class="line"><span style="color:#E1E4E8">con </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> duckdb.connect()</span></span>
<span class="line"></span>
<span class="line"><span style="color:#79B8FF">print</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">f</span><span style="color:#9ECBFF">"</span><span style="color:#79B8FF">\\n</span><span style="color:#9ECBFF">--- Inspecting Schema for PostgreSQL Compatibility ---"</span><span style="color:#E1E4E8">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">try</span><span style="color:#E1E4E8">:</span></span>
<span class="line"><span style="color:#6A737D">    # Use PRAGMA table_info to get the schema of data from a file</span></span>
<span class="line"><span style="color:#6A737D">    # We implicitly create a temporary table/view from the file for inspection</span></span>
<span class="line"><span style="color:#E1E4E8">    schema_query </span><span style="color:#F97583">=</span><span style="color:#F97583"> f</span><span style="color:#9ECBFF">"""</span></span>
<span class="line"><span style="color:#9ECBFF">    PRAGMA table_info('</span><span style="color:#79B8FF">{</span><span style="color:#E1E4E8">transformed_data_path</span><span style="color:#79B8FF">}</span><span style="color:#9ECBFF">');</span></span>
<span class="line"><span style="color:#9ECBFF">    """</span></span>
<span class="line"><span style="color:#E1E4E8">    schema_df </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> con.sql(schema_query).df()</span></span>
<span class="line"></span>
<span class="line"><span style="color:#79B8FF">    print</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"DuckDB Inferred Schema (from transformed data):"</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#79B8FF">    print</span><span style="color:#E1E4E8">(schema_df.to_string(</span><span style="color:#FFAB70">index</span><span style="color:#F97583">=</span><span style="color:#79B8FF">False</span><span style="color:#E1E4E8">))</span></span>
<span class="line"></span>
<span class="line"><span style="color:#79B8FF">    print</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"</span><span style="color:#79B8FF">\\n</span><span style="color:#9ECBFF">--- PostgreSQL Type Considerations ---"</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#79B8FF">    print</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"Here's a general mapping and considerations for PostgreSQL:"</span><span style="color:#E1E4E8">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">    pg_type_map </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#9ECBFF">        'BIGINT'</span><span style="color:#E1E4E8">: </span><span style="color:#9ECBFF">'BIGINT'</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#9ECBFF">        'INTEGER'</span><span style="color:#E1E4E8">: </span><span style="color:#9ECBFF">'INTEGER'</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#9ECBFF">        'DOUBLE'</span><span style="color:#E1E4E8">: </span><span style="color:#9ECBFF">'DOUBLE PRECISION'</span><span style="color:#E1E4E8">, </span><span style="color:#6A737D"># or REAL for float4</span></span>
<span class="line"><span style="color:#9ECBFF">        'VARCHAR'</span><span style="color:#E1E4E8">: </span><span style="color:#9ECBFF">'VARCHAR(N)'</span><span style="color:#E1E4E8">,       </span><span style="color:#6A737D"># N needs to be determined based on max length</span></span>
<span class="line"><span style="color:#9ECBFF">        'BOOLEAN'</span><span style="color:#E1E4E8">: </span><span style="color:#9ECBFF">'BOOLEAN'</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#9ECBFF">        'DATE'</span><span style="color:#E1E4E8">: </span><span style="color:#9ECBFF">'DATE'</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#9ECBFF">        'TIMESTAMP'</span><span style="color:#E1E4E8">: </span><span style="color:#9ECBFF">'TIMESTAMP'</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#9ECBFF">        'BLOB'</span><span style="color:#E1E4E8">: </span><span style="color:#9ECBFF">'BYTEA'</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#9ECBFF">        'DECIMAL'</span><span style="color:#E1E4E8">: </span><span style="color:#9ECBFF">'NUMERIC(P, S)'</span><span style="color:#6A737D">     # P=precision, S=scale needs to be determined</span></span>
<span class="line"><span style="color:#E1E4E8">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">    for</span><span style="color:#E1E4E8"> index, row </span><span style="color:#F97583">in</span><span style="color:#E1E4E8"> schema_df.iterrows():</span></span>
<span class="line"><span style="color:#E1E4E8">        column_name </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> row[</span><span style="color:#9ECBFF">'name'</span><span style="color:#E1E4E8">]</span></span>
<span class="line"><span style="color:#E1E4E8">        duckdb_type </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> row[</span><span style="color:#9ECBFF">'type'</span><span style="color:#E1E4E8">]</span></span>
<span class="line"><span style="color:#E1E4E8">        nullable </span><span style="color:#F97583">=</span><span style="color:#9ECBFF"> "NULL"</span><span style="color:#F97583"> if</span><span style="color:#E1E4E8"> row[</span><span style="color:#9ECBFF">'null'</span><span style="color:#E1E4E8">] </span><span style="color:#F97583">==</span><span style="color:#79B8FF"> 1</span><span style="color:#F97583"> else</span><span style="color:#9ECBFF"> "NOT NULL"</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">        pg_equivalent </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> pg_type_map.get(duckdb_type.upper(), </span><span style="color:#F97583">f</span><span style="color:#9ECBFF">"UNKNOWN_TYPE (</span><span style="color:#79B8FF">{</span><span style="color:#E1E4E8">duckdb_type</span><span style="color:#79B8FF">}</span><span style="color:#9ECBFF">)"</span><span style="color:#E1E4E8">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">        # Special handling for VARCHAR to suggest length</span></span>
<span class="line"><span style="color:#F97583">        if</span><span style="color:#E1E4E8"> duckdb_type.upper() </span><span style="color:#F97583">==</span><span style="color:#9ECBFF"> 'VARCHAR'</span><span style="color:#E1E4E8">:</span></span>
<span class="line"><span style="color:#6A737D">            # To get actual max length, you'd need to query the data:</span></span>
<span class="line"><span style="color:#6A737D">            # max_len_query = f"SELECT MAX(LENGTH(\\"{column_name}\\")) FROM '{transformed_data_path}';"</span></span>
<span class="line"><span style="color:#6A737D">            # max_len = con.sql(max_len_query).fetchone()[0]</span></span>
<span class="line"><span style="color:#6A737D">            # pg_equivalent = f"VARCHAR({max_len or 255})" # Use a default if max_len is 0 or None</span></span>
<span class="line"><span style="color:#E1E4E8">            pg_equivalent </span><span style="color:#F97583">=</span><span style="color:#9ECBFF"> "VARCHAR(255)"</span><span style="color:#6A737D"> # Common default for text, adjust as needed or calculate max_len</span></span>
<span class="line"></span>
<span class="line"><span style="color:#79B8FF">        print</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">f</span><span style="color:#9ECBFF">"- Column: '</span><span style="color:#79B8FF">{</span><span style="color:#E1E4E8">column_name</span><span style="color:#79B8FF">}</span><span style="color:#9ECBFF">'"</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#79B8FF">        print</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">f</span><span style="color:#9ECBFF">"  DuckDB Type: </span><span style="color:#79B8FF">{</span><span style="color:#E1E4E8">duckdb_type</span><span style="color:#79B8FF">}</span><span style="color:#9ECBFF">"</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#79B8FF">        print</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">f</span><span style="color:#9ECBFF">"  PostgreSQL Equivalent: </span><span style="color:#79B8FF">{</span><span style="color:#E1E4E8">pg_equivalent</span><span style="color:#79B8FF">}</span><span style="color:#9ECBFF">"</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#79B8FF">        print</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">f</span><span style="color:#9ECBFF">"  Nullable: </span><span style="color:#79B8FF">{</span><span style="color:#E1E4E8">nullable</span><span style="color:#79B8FF">}</span><span style="color:#9ECBFF">"</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#79B8FF">        print</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">f</span><span style="color:#9ECBFF">"  Considerations: </span><span style="color:#79B8FF">{</span><span style="color:#9ECBFF">'Check string max length'</span><span style="color:#F97583"> if</span><span style="color:#E1E4E8"> duckdb_type.upper() </span><span style="color:#F97583">==</span><span style="color:#9ECBFF"> 'VARCHAR'</span><span style="color:#F97583"> else</span><span style="color:#9ECBFF"> 'Confirm precision/scale'</span><span style="color:#F97583"> if</span><span style="color:#E1E4E8"> duckdb_type.upper() </span><span style="color:#F97583">==</span><span style="color:#9ECBFF"> 'DECIMAL'</span><span style="color:#F97583"> else</span><span style="color:#9ECBFF"> 'Standard mapping'</span><span style="color:#79B8FF">}</span><span style="color:#9ECBFF">"</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#79B8FF">        print</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"-"</span><span style="color:#F97583"> *</span><span style="color:#79B8FF"> 30</span><span style="color:#E1E4E8">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#79B8FF">    print</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"</span><span style="color:#79B8FF">\\n</span><span style="color:#9ECBFF">To load into PostgreSQL, you would typically use a PostgreSQL client library (like Psycopg2 in Python) or a tool like \`pg_loader\` after connecting to your PostgreSQL database. DuckDB acts as an intermediary here, handling the transformation and type validation."</span><span style="color:#E1E4E8">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">except</span><span style="color:#79B8FF"> FileNotFoundError</span><span style="color:#E1E4E8">:</span></span>
<span class="line"><span style="color:#79B8FF">    print</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">f</span><span style="color:#9ECBFF">"Error: Transformed data file '</span><span style="color:#79B8FF">{</span><span style="color:#E1E4E8">transformed_data_path</span><span style="color:#79B8FF">}</span><span style="color:#9ECBFF">' not found. Please ensure the previous steps ran successfully."</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#F97583">except</span><span style="color:#79B8FF"> Exception</span><span style="color:#F97583"> as</span><span style="color:#E1E4E8"> e:</span></span>
<span class="line"><span style="color:#79B8FF">    print</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">f</span><span style="color:#9ECBFF">"Error inspecting schema: </span><span style="color:#79B8FF">{</span><span style="color:#E1E4E8">e</span><span style="color:#79B8FF">}</span><span style="color:#9ECBFF">"</span><span style="color:#E1E4E8">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">finally</span><span style="color:#E1E4E8">:</span></span>
<span class="line"><span style="color:#E1E4E8">    con.close()</span></span>
<span class="line"></span></code></pre>
<h2 id="explanation-of-schema-inspection">Explanation of Schema Inspection:</h2>
<p>Let’s break down what’s happening in the schema inspection step:</p>
<ul>
<li>
<p><strong><code>PRAGMA table_info('file_path')</code>:</strong><br>
This handy DuckDB command lets you peek at the schema DuckDB infers from your file—no need to create a table first. It shows you each column’s name, data type, whether it allows NULLs, and more.</p>
</li>
<li>
<p><strong>Mapping to PostgreSQL:</strong><br>
We walk through a general mapping of DuckDB types to PostgreSQL equivalents. Here are a few things to keep in mind:</p>
<ul>
<li><strong>VARCHAR length:</strong> DuckDB’s <code>VARCHAR</code> is flexible, but PostgreSQL usually wants a specific length (like <code>VARCHAR(255)</code>). To pick the right number, you can run a quick <code>SELECT MAX(LENGTH(column_name))</code> on your data.</li>
<li><strong>DECIMAL / NUMERIC:</strong> If you have columns with decimal numbers (like scores), you’ll want to decide on the total number of digits (<code>PRECISION</code>) and how many come after the decimal point (<code>SCALE</code>).</li>
<li><strong>Date/Time types:</strong> DuckDB is pretty good at figuring out dates and timestamps, but double-check if you need a plain <code>DATE</code> or a full <code>TIMESTAMP</code> (and whether you need time zones) for PostgreSQL.</li>
</ul>
</li>
</ul>
<hr>
<h3 id="wrapping-up-part-ii">Wrapping Up Part II</h3>
<p>In this post, we’ve seen how DuckDB can help you:</p>
<ul>
<li>Transform data directly from CSVs with SQL, no manual file wrangling required.</li>
<li>Store your results in space-saving formats like compressed CSV and Parquet.</li>
<li>Inspect and prepare your data’s schema for a smooth handoff to databases like PostgreSQL.</li>
</ul>
<p>I hope this gives you some good ideas for how t use DuckDB as an ETL tool in your data workflows.  I realize this I went in a few different directions here, I like the idea of exploring what is possible and then refining my approach for my use case.  If you have something you are using DuckDB for that I didn’t cover please share it.  I love to hearing what is working for others.</p>`, { headings: 527, localImagePaths: 543, remoteImagePaths: 544, frontmatter: 545, imagePaths: 549 }, [528, 531, 534, 537, 540], { depth: 53, slug: 529, text: 530 }, "1-the-blind-csv-to-csv-transformation", "1. The “Blind” CSV-to-CSV Transformation", { depth: 53, slug: 532, text: 533 }, "2-space-saving-formats-compressed-csv--parquet", "2. Space-Saving Formats: Compressed CSV & Parquet", { depth: 53, slug: 535, text: 536 }, "3-data-typing--postgresql-compatibility", "3. Data Typing & PostgreSQL Compatibility", { depth: 53, slug: 538, text: 539 }, "explanation-of-schema-inspection", "Explanation of Schema Inspection:", { depth: 37, slug: 541, text: 542 }, "wrapping-up-part-ii", "Wrapping Up Part II", [], [], { title: 516, categories: 546, tags: 547, pubDate: 548, description: 517 }, [266, 200], [406, 407, 408, 409, 200, 410], ["Date", "2025-06-08T00:00:00.000Z"], [], "2025-06-08-DuckDB-Diners-Drives-and-Databases-PartII.md", "2025-06-29-better-pipelines-with-dagster", { id: 551, data: 553, body: 564, filePath: 565, digest: 566, rendered: 567, legacyId: 578 }, { title: 554, description: 555, pubDate: 556, tags: 557, categories: 562 }, "Building Data Pipelines with Dagster: Practical", "A post about Building Data Pipelines with Dagster: Practical.", ["Date", "2025-06-29T00:00:00.000Z"], [558, 559, 200, 560, 561], "Dagster", "data pipelines", "orchestration", "data engineering", [266, 200, 563], "Orchestration", 'I am always looking for ways to improve my data pipelines, and Dagster has been really good to me so far.  I am definitely planning on using it in the future  Of course, I ran into a a few issues.  But mostly I was able to get things up and running, without too much trouble, and I see some real value in using Dagster for more pipelines.  I have used Airflow in the past, and while it is great too. Dagster just seems easier to use and better at delivering results quickly.\n\nGetting started with any orhestration tool can be difficult and no matter how good your current set up is, trying to retro fit it to an orchestrator is going to be a challenge. Here I built a relatively simple pipeline that pulls data from the NYC Open Data API, processes it, and then visualizes it using both static PNG charts and a dynamic Streamlit dashboard.\n\nHere is an exmple of what the output looks like:\n\n<img src="/img/streamdagster.png" alt="Dagster streamlit image" width="600px">\n\nThe output from Dagster is no slouch when it comes to visualizations either.  Being able to see the orchestration visually and being able to choose to run a single asset is great.\n\n<img src="/img/full_pipeline.png" alt="Dagster streamlit image" width="600px">\n\n\nAlso the way Dagster displays the logs and allows you to trace back any issues is super helpful.  Once you start a job you can move over to the runs tab, or you can follow the link that is generated when you run a job.  \n<img src="/img/Run_dagster.png" alt="Dagster streamlit image" width="600px">\n\n\nIf you are interested in getting some ideas for yourself you can follow the README which you to check out directly on the [GitHub repo](https://github.com/TJAdryan/dagster_starter) and walks through the process step by step. \n\nIt was great to be able to use Dagster\'s built-in decorators to define assets and jobs, making the code cleaner and more maintainable. The use of `@asset` for defining assets and `@job` for was helpful for organizing the jobs.  I did get tripped up from time to time, but the Dagster documentation was really helpful.  I also found the [Dagster Slack community](https://dagster.io/community) had a lot of great hints and encouraging advice. Dagster examples tend to be dedicated to helping people with current workload issues especially in the [sciences](https://www.youtube.com/watch?v=XwuFgGvNibU). I love this.   \n\nThe scheuduling from inside Dagster is also really nice.  As well as the logs and the ability to find the origins of errors relatively quickly.  I would love to see how other people are using Dagster in their projects.  If you have any tips or tricks, please let me know.', "src/content/blog/2025-06-29-Better-Pipelines-with-Dagster.md", "509bcfef6fd18b0c", { html: 568, metadata: 569 }, '<p>I am always looking for ways to improve my data pipelines, and Dagster has been really good to me so far.  I am definitely planning on using it in the future  Of course, I ran into a a few issues.  But mostly I was able to get things up and running, without too much trouble, and I see some real value in using Dagster for more pipelines.  I have used Airflow in the past, and while it is great too. Dagster just seems easier to use and better at delivering results quickly.</p>\n<p>Getting started with any orhestration tool can be difficult and no matter how good your current set up is, trying to retro fit it to an orchestrator is going to be a challenge. Here I built a relatively simple pipeline that pulls data from the NYC Open Data API, processes it, and then visualizes it using both static PNG charts and a dynamic Streamlit dashboard.</p>\n<p>Here is an exmple of what the output looks like:</p>\n<img src="/img/streamdagster.png" alt="Dagster streamlit image" width="600px">\n<p>The output from Dagster is no slouch when it comes to visualizations either.  Being able to see the orchestration visually and being able to choose to run a single asset is great.</p>\n<img src="/img/full_pipeline.png" alt="Dagster streamlit image" width="600px">\n<p>Also the way Dagster displays the logs and allows you to trace back any issues is super helpful.  Once you start a job you can move over to the runs tab, or you can follow the link that is generated when you run a job.<br>\n<img src="/img/Run_dagster.png" alt="Dagster streamlit image" width="600px"></p>\n<p>If you are interested in getting some ideas for yourself you can follow the README which you to check out directly on the <a href="https://github.com/TJAdryan/dagster_starter">GitHub repo</a> and walks through the process step by step.</p>\n<p>It was great to be able to use Dagster’s built-in decorators to define assets and jobs, making the code cleaner and more maintainable. The use of <code>@asset</code> for defining assets and <code>@job</code> for was helpful for organizing the jobs.  I did get tripped up from time to time, but the Dagster documentation was really helpful.  I also found the <a href="https://dagster.io/community">Dagster Slack community</a> had a lot of great hints and encouraging advice. Dagster examples tend to be dedicated to helping people with current workload issues especially in the <a href="https://www.youtube.com/watch?v=XwuFgGvNibU">sciences</a>. I love this.</p>\n<p>The scheuduling from inside Dagster is also really nice.  As well as the logs and the ability to find the origins of errors relatively quickly.  I would love to see how other people are using Dagster in their projects.  If you have any tips or tricks, please let me know.</p>', { headings: 570, localImagePaths: 571, remoteImagePaths: 572, frontmatter: 573, imagePaths: 577 }, [], [], [], { title: 554, categories: 574, tags: 575, pubDate: 576, description: 555 }, [266, 200, 563], [558, 559, 200, 560, 561], ["Date", "2025-06-29T00:00:00.000Z"], [], "2025-06-29-Better-Pipelines-with-Dagster.md", "2025-07-19-taking-the-small-wins", { id: 579, data: 581, body: 599, filePath: 600, digest: 601, rendered: 602, legacyId: 632 }, { title: 582, description: 583, pubDate: 584, tags: 585, categories: 594 }, "Taking the Small Wins: How Incremental Improvements Cut My API Call Times from 70 to 45 Minutes", "A post about Taking the Small Wins: How Incremental Improvements Cut My API Call Times from 70 to 45 Minutes.", ["Date", "2025-07-19T16:00:00.000Z"], [200, 465, 586, 587, 588, 589, 590, 591, 592, 593], "performance", "optimization", "json", "orjson", "benchmark", "data pipeline", "incremental improvement", "long-term code health", [200, 595, 596, 597, 589, 598], "Performance", "APIs", "DataEngineering", "Optimization", 'As someone who looks back at their own code and sees a mix of pride and regret, I am often torn between the desire to improve what is there and the fear of breaking something that already works. I am sure this is a common feeling, and not just something I suffer from (right?). However, sometimes there are opportunities to make small, incremental improvements that can lead to significant performance gains ~~without~~ with just a small risk of a catastrophic failure. This post is about one such improvement I made recently that cut my nightly API call times from 70 minutes to 45 minutes—a 36.44% speedup—by optimizing how I parsed JSON data.\n\n### The Nightly Grind: My API Performance Bottleneck\n\nOne of the processes our team relies on is a nightly API call. Its purpose: to fetch the current status for approximately 3,000 distinct objects. This process had a frustratingly consistent completion time of **70 to 80 minutes**. The process runs overnight, so while it wasn\'t critical to reduce the time, it still presented an increased risk of failure due to the long duration. If something went wrong, it would hold back other processes, and the accumulation would mean the longer it took to discover the issue, the longer it would take to recover.\n\nThe complexity stemmed not only from the sheer volume of calls but also from the nature of the API responses. The JSON data returned for each object was deeply nested, and crucially, the specific information I needed wasn\'t consistently located under the same header. My parsing logic often involved a series of attempts: try Header A, if not found, try Header B, and so on. This added considerable overhead to each object\'s processing.\n\nMy initial attempts to speed things up focused on concurrency. I pushed Python\'s [`ThreadPoolExecutor`](https://docs.python.org/3/library/concurrent.futures.html) as far as I could, making multiple requests simultaneously. This certainly helped, but I quickly slammed into the API\'s inherent rate limits, which effectively capped how much more parallelization I could achieve.\n\nIn a search for further optimization, I even experimented with downloading *all* the raw JSON data first, for all 3,000 objects, and then parsing it in a separate, dedicated step. This was a revelation for raw data acquisition: the data was downloaded in under 15 minutes! However, the next step of parsing and restructuring that massive, inconsistent raw JSON proved to be incredibly cumbersome and complex. The code became brittle, and I found I was having to retool all the parsing logic. I realized I was running into a wall.  I needed a more fundamental change to how I was handling JSON parsing, which turned out to be the place where I could get a significant performance boost without overhauling the entire process.\n\n\n\n### The Root of the Problem: Slow JSON Parsing\n\nWhen your Python application receives data from an API, it arrives as a JSON string or byte stream. This raw data must be converted ("parsed" or "deserialized") into Python objects (like dictionaries and lists) before you can work with it.\n\nPython\'s built-in `json` module, while reliable and universally available, performs this parsing primarily in Python. For a high volume of calls or large, complex JSON payloads, this Python-level execution can introduce significant overhead. It becomes a CPU-bound operation that can limit your application\'s overall throughput, even if your network requests are efficient.\n\n### `orjson`: The Performance Enhancer\n\n`orjson` is a JSON library for Python implemented in Rust. By leveraging Rust\'s compiled, highly optimized nature, `orjson` can perform JSON parsing and serialization operations dramatically faster than the built-in `json` module. It bypasses many of Python\'s inherent runtime overheads, directly boosting processing speed.\n\n**Key characteristics of `orjson`:**\n\n* **Exceptional Speed:** Benchmarks consistently show `orjson` deserialization (`loads`) outperforming `json.loads()` by significant margins.\n* **JSON Standard Compliance:** It strictly adheres to the JSON specification (RFC 8259) and UTF-8 encoding.\n* **Native Type Support:** It intelligently handles common Python types such as `datetime`, `UUID`, and `numpy` arrays directly, reducing the need for custom serializers/deserializers.\n* **Familiar API:** Its `loads` and `dumps` functions closely mirror the standard `json` module\'s interface, making it relatively straightforward to integrate into existing code. (Note: `orjson.dumps` returns `bytes`, while `json.dumps` returns `str`).\n\n### Quantifying the Gain: A Practical Benchmark\n\nTo demonstrate `orjson`\'s impact, let\'s run a controlled benchmark. We\'ll generate a large, representative JSON dataset and measure the parsing time for both `json` and `orjson` over multiple repetitions using the `timeit` module for accuracy.\n\n**Installation:**\n\n```bash\npip install orjson\n```\n\n**Benchmark Script:**\n\n```python\nimport json\nimport orjson\nimport timeit\nimport datetime\nimport uuid\nimport sys\n\n# Function to generate a large, nested JSON structure for testing\ndef create_large_test_json(num_entries=10000): # Using 10,000 entries to match your previous output\n    entries = []\n    for i in range(num_entries):\n        current_entry = {\n            "id": f"entry-{i}-{uuid.uuid4()}", # Include UUID for more realistic complexity\n            "name": f"Item Name {i}",\n            "value": i * 1.23,\n            "details": {\n                "category": "Category " + str(i % 10),\n                "status": "Online" if i % 2 == 0 else "Offline",\n                "tags": ["tag_a", "tag_b", "tag_c"] if i % 2 == 0 else ["tag_x", "tag_y"],\n                "created_at": datetime.datetime.now(datetime.timezone.utc).isoformat() # Include datetime\n            },\n            "config": {"ip": f"192.168.1.{100 + i}", "os": "Linux"},\n            "history": [{"timestamp": timeit.default_timer() - j, "event": f"Event {j}"} for j in range(5)]\n        }\n        entries.append(current_entry)\n\n    # Use orjson.dumps for efficient generation of the test data\n    return orjson.dumps({"data": entries})\n\n# Generate test data based on your scale\nTEST_DATA_BYTES = create_large_test_json(num_entries=10000)\nprint(f"Generated test data size: {len(TEST_DATA_BYTES) / (1024*1024):.2f} MB")\n\n# Number of times to repeat the parsing operation for more accurate timing\nNUM_REPETITIONS = 100\n\nprint(f"\\nRunning benchmarks with {NUM_REPETITIONS} repetitions...")\n\n# Benchmark json.loads()\ntime_json = timeit.timeit(lambda: json.loads(TEST_DATA_BYTES), number=NUM_REPETITIONS)\nprint(f"Built-in json.loads() took: {time_json:.6f} seconds (total for {NUM_REPETITIONS} runs)")\n\n# Benchmark orjson.loads()\ntime_orjson = timeit.timeit(lambda: orjson.loads(TEST_DATA_BYTES), number=NUM_REPETITIONS)\nprint(f"orjson.loads() took:      {time_orjson:.6f} seconds (total for {NUM_REPETITIONS} runs)")\n\n# Confirm parsing accuracy (performed once for correctness)\nparsed_data_json_single = json.loads(TEST_DATA_BYTES)\nparsed_data_orjson_single = orjson.loads(TEST_DATA_BYTES)\n\nif parsed_data_json_single == parsed_data_orjson_single:\n    print("\\nParsing results are identical for a single run.")\nelse:\n    print("\\nWARNING: Parsing results differ for a single run.")\n\n# Calculate speedup ratio\nif time_orjson > 0:\n    speedup_factor = time_json / time_orjson\n    print(f"\\norjson is {speedup_factor:.2f}x faster than built-in json for deserialization (over {NUM_REPETITIONS} runs).")\nelse:\n    print("orjson was extremely fast, time close to zero.")\n```\n\n### Interpretation of Results:\n\nUsing the benchmark with 10,000 entries and 100 repetitions, we obtained the following results, consistent with real-world scenarios:\n\n* **Generated test data size:** 4.31 MB\n* **Built-in `json.loads()` took:** 25.002522 seconds (total for 100 runs)\n* **`orjson.loads()` took:** 15.892222 seconds (total for 100 runs)\n\nThese results demonstrate that `orjson` is approximately **36.44% faster** than the built-in `json` module for deserialization in this benchmark.\n\nTo translate this directly to my problem: if JSON parsing was a significant portion of my 70-minute nightly API call, a **36.44% speedup in parsing time** could translate into substantial real-world savings. For instance, if a process relying heavily on JSON parsing currently takes **1 hour and 10 minutes (70 minutes)**, a 36.44% improvement could reduce that specific processing step to approximately **45 minutes**. This 25-minute reduction is a tangible win, directly impacting how quickly my data pipelines complete.\n\n### Integration with API Workflows\n\nIntegrating `orjson` into your existing API client setup (e.g., using the `requests` library) is straightforward:\n\n1.  **Import `orjson`:** `import orjson`\n2.  **Use `orjson.loads()` on `response.content`:** Instead of `response.json()`, which internally uses `json.loads()`, explicitly call `orjson.loads(response.content)`. `response.content` provides the raw byte data, which `orjson` prefers for optimal performance.\n\n```python\nimport requests\nimport orjson\nimport time\n\napi_url = "[https://jsonplaceholder.typicode.com/posts/1](https://jsonplaceholder.typicode.com/posts/1)" # Example API endpoint\n\ntry:\n    response = requests.get(api_url, timeout=10)\n    response.raise_for_status() \n\n    parse_start = time.perf_counter()\n    api_data = orjson.loads(response.content)\n    parse_end = time.perf_counter()\n    \n    print(f"API call successful. JSON parsing took: {parse_end - parse_start:.6f} seconds.")\n    # Process api_data (now a Python dictionary)\n    print(f"Parsed data: {api_data.get(\'title\')[:30]}...")\n\nexcept requests.exceptions.RequestException as e:\n    print(f"API request failed: {e}")\nexcept orjson.JSONDecodeError as e:\n    print(f"JSON parsing failed: {e}")\n```\n\n### Conclusion\n\nOptimizing JSON parsing is a practical and effective method to enhance API interaction speed, especially when dealing with high data volumes or complex structures. As my own experience demonstrated, identifying and addressing bottlenecks like slow parsing with tools like orjson can yield substantial performance gains. And that\'s the real lesson here, isn\'t it? It\'s not always about needing a massive rewrite. Sometimes, those small, steady improvements—saving a few minutes here and there—are what truly make your code better and your daily work smoother in the long run. Just remember to back up your code before you start tinkering. Your future self will appreciate it.\n\nOn a serious note, none of this would be possible without the hard work of the `orjson` team. If you haven\'t already, I highly recommend checking out their [GitHub repository](https://github.com/ijl/orjson). It might sound hokey, but I can\'t believe how much my life has been improved by people I have never or probably will never meet.', "src/content/blog/2025-07-19-Taking-the-Small-Wins.md", "853134fcc993c63e", { html: 603, metadata: 604 }, `<p>As someone who looks back at their own code and sees a mix of pride and regret, I am often torn between the desire to improve what is there and the fear of breaking something that already works. I am sure this is a common feeling, and not just something I suffer from (right?). However, sometimes there are opportunities to make small, incremental improvements that can lead to significant performance gains <del>without</del> with just a small risk of a catastrophic failure. This post is about one such improvement I made recently that cut my nightly API call times from 70 minutes to 45 minutes—a 36.44% speedup—by optimizing how I parsed JSON data.</p>
<h3 id="the-nightly-grind-my-api-performance-bottleneck">The Nightly Grind: My API Performance Bottleneck</h3>
<p>One of the processes our team relies on is a nightly API call. Its purpose: to fetch the current status for approximately 3,000 distinct objects. This process had a frustratingly consistent completion time of <strong>70 to 80 minutes</strong>. The process runs overnight, so while it wasn’t critical to reduce the time, it still presented an increased risk of failure due to the long duration. If something went wrong, it would hold back other processes, and the accumulation would mean the longer it took to discover the issue, the longer it would take to recover.</p>
<p>The complexity stemmed not only from the sheer volume of calls but also from the nature of the API responses. The JSON data returned for each object was deeply nested, and crucially, the specific information I needed wasn’t consistently located under the same header. My parsing logic often involved a series of attempts: try Header A, if not found, try Header B, and so on. This added considerable overhead to each object’s processing.</p>
<p>My initial attempts to speed things up focused on concurrency. I pushed Python’s <a href="https://docs.python.org/3/library/concurrent.futures.html"><code>ThreadPoolExecutor</code></a> as far as I could, making multiple requests simultaneously. This certainly helped, but I quickly slammed into the API’s inherent rate limits, which effectively capped how much more parallelization I could achieve.</p>
<p>In a search for further optimization, I even experimented with downloading <em>all</em> the raw JSON data first, for all 3,000 objects, and then parsing it in a separate, dedicated step. This was a revelation for raw data acquisition: the data was downloaded in under 15 minutes! However, the next step of parsing and restructuring that massive, inconsistent raw JSON proved to be incredibly cumbersome and complex. The code became brittle, and I found I was having to retool all the parsing logic. I realized I was running into a wall.  I needed a more fundamental change to how I was handling JSON parsing, which turned out to be the place where I could get a significant performance boost without overhauling the entire process.</p>
<h3 id="the-root-of-the-problem-slow-json-parsing">The Root of the Problem: Slow JSON Parsing</h3>
<p>When your Python application receives data from an API, it arrives as a JSON string or byte stream. This raw data must be converted (“parsed” or “deserialized”) into Python objects (like dictionaries and lists) before you can work with it.</p>
<p>Python’s built-in <code>json</code> module, while reliable and universally available, performs this parsing primarily in Python. For a high volume of calls or large, complex JSON payloads, this Python-level execution can introduce significant overhead. It becomes a CPU-bound operation that can limit your application’s overall throughput, even if your network requests are efficient.</p>
<h3 id="orjson-the-performance-enhancer"><code>orjson</code>: The Performance Enhancer</h3>
<p><code>orjson</code> is a JSON library for Python implemented in Rust. By leveraging Rust’s compiled, highly optimized nature, <code>orjson</code> can perform JSON parsing and serialization operations dramatically faster than the built-in <code>json</code> module. It bypasses many of Python’s inherent runtime overheads, directly boosting processing speed.</p>
<p><strong>Key characteristics of <code>orjson</code>:</strong></p>
<ul>
<li><strong>Exceptional Speed:</strong> Benchmarks consistently show <code>orjson</code> deserialization (<code>loads</code>) outperforming <code>json.loads()</code> by significant margins.</li>
<li><strong>JSON Standard Compliance:</strong> It strictly adheres to the JSON specification (RFC 8259) and UTF-8 encoding.</li>
<li><strong>Native Type Support:</strong> It intelligently handles common Python types such as <code>datetime</code>, <code>UUID</code>, and <code>numpy</code> arrays directly, reducing the need for custom serializers/deserializers.</li>
<li><strong>Familiar API:</strong> Its <code>loads</code> and <code>dumps</code> functions closely mirror the standard <code>json</code> module’s interface, making it relatively straightforward to integrate into existing code. (Note: <code>orjson.dumps</code> returns <code>bytes</code>, while <code>json.dumps</code> returns <code>str</code>).</li>
</ul>
<h3 id="quantifying-the-gain-a-practical-benchmark">Quantifying the Gain: A Practical Benchmark</h3>
<p>To demonstrate <code>orjson</code>’s impact, let’s run a controlled benchmark. We’ll generate a large, representative JSON dataset and measure the parsing time for both <code>json</code> and <code>orjson</code> over multiple repetitions using the <code>timeit</code> module for accuracy.</p>
<p><strong>Installation:</strong></p>
<pre class="astro-code github-dark" style="background-color:#24292e;color:#e1e4e8; overflow-x: auto;" tabindex="0" data-language="bash"><code><span class="line"><span style="color:#B392F0">pip</span><span style="color:#9ECBFF"> install</span><span style="color:#9ECBFF"> orjson</span></span></code></pre>
<p><strong>Benchmark Script:</strong></p>
<pre class="astro-code github-dark" style="background-color:#24292e;color:#e1e4e8; overflow-x: auto;" tabindex="0" data-language="python"><code><span class="line"><span style="color:#F97583">import</span><span style="color:#E1E4E8"> json</span></span>
<span class="line"><span style="color:#F97583">import</span><span style="color:#E1E4E8"> orjson</span></span>
<span class="line"><span style="color:#F97583">import</span><span style="color:#E1E4E8"> timeit</span></span>
<span class="line"><span style="color:#F97583">import</span><span style="color:#E1E4E8"> datetime</span></span>
<span class="line"><span style="color:#F97583">import</span><span style="color:#E1E4E8"> uuid</span></span>
<span class="line"><span style="color:#F97583">import</span><span style="color:#E1E4E8"> sys</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D"># Function to generate a large, nested JSON structure for testing</span></span>
<span class="line"><span style="color:#F97583">def</span><span style="color:#B392F0"> create_large_test_json</span><span style="color:#E1E4E8">(num_entries</span><span style="color:#F97583">=</span><span style="color:#79B8FF">10000</span><span style="color:#E1E4E8">): </span><span style="color:#6A737D"># Using 10,000 entries to match your previous output</span></span>
<span class="line"><span style="color:#E1E4E8">    entries </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> []</span></span>
<span class="line"><span style="color:#F97583">    for</span><span style="color:#E1E4E8"> i </span><span style="color:#F97583">in</span><span style="color:#79B8FF"> range</span><span style="color:#E1E4E8">(num_entries):</span></span>
<span class="line"><span style="color:#E1E4E8">        current_entry </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#9ECBFF">            "id"</span><span style="color:#E1E4E8">: </span><span style="color:#F97583">f</span><span style="color:#9ECBFF">"entry-</span><span style="color:#79B8FF">{</span><span style="color:#E1E4E8">i</span><span style="color:#79B8FF">}</span><span style="color:#9ECBFF">-</span><span style="color:#79B8FF">{</span><span style="color:#E1E4E8">uuid.uuid4()</span><span style="color:#79B8FF">}</span><span style="color:#9ECBFF">"</span><span style="color:#E1E4E8">, </span><span style="color:#6A737D"># Include UUID for more realistic complexity</span></span>
<span class="line"><span style="color:#9ECBFF">            "name"</span><span style="color:#E1E4E8">: </span><span style="color:#F97583">f</span><span style="color:#9ECBFF">"Item Name </span><span style="color:#79B8FF">{</span><span style="color:#E1E4E8">i</span><span style="color:#79B8FF">}</span><span style="color:#9ECBFF">"</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#9ECBFF">            "value"</span><span style="color:#E1E4E8">: i </span><span style="color:#F97583">*</span><span style="color:#79B8FF"> 1.23</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#9ECBFF">            "details"</span><span style="color:#E1E4E8">: {</span></span>
<span class="line"><span style="color:#9ECBFF">                "category"</span><span style="color:#E1E4E8">: </span><span style="color:#9ECBFF">"Category "</span><span style="color:#F97583"> +</span><span style="color:#79B8FF"> str</span><span style="color:#E1E4E8">(i </span><span style="color:#F97583">%</span><span style="color:#79B8FF"> 10</span><span style="color:#E1E4E8">),</span></span>
<span class="line"><span style="color:#9ECBFF">                "status"</span><span style="color:#E1E4E8">: </span><span style="color:#9ECBFF">"Online"</span><span style="color:#F97583"> if</span><span style="color:#E1E4E8"> i </span><span style="color:#F97583">%</span><span style="color:#79B8FF"> 2</span><span style="color:#F97583"> ==</span><span style="color:#79B8FF"> 0</span><span style="color:#F97583"> else</span><span style="color:#9ECBFF"> "Offline"</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#9ECBFF">                "tags"</span><span style="color:#E1E4E8">: [</span><span style="color:#9ECBFF">"tag_a"</span><span style="color:#E1E4E8">, </span><span style="color:#9ECBFF">"tag_b"</span><span style="color:#E1E4E8">, </span><span style="color:#9ECBFF">"tag_c"</span><span style="color:#E1E4E8">] </span><span style="color:#F97583">if</span><span style="color:#E1E4E8"> i </span><span style="color:#F97583">%</span><span style="color:#79B8FF"> 2</span><span style="color:#F97583"> ==</span><span style="color:#79B8FF"> 0</span><span style="color:#F97583"> else</span><span style="color:#E1E4E8"> [</span><span style="color:#9ECBFF">"tag_x"</span><span style="color:#E1E4E8">, </span><span style="color:#9ECBFF">"tag_y"</span><span style="color:#E1E4E8">],</span></span>
<span class="line"><span style="color:#9ECBFF">                "created_at"</span><span style="color:#E1E4E8">: datetime.datetime.now(datetime.timezone.utc).isoformat() </span><span style="color:#6A737D"># Include datetime</span></span>
<span class="line"><span style="color:#E1E4E8">            },</span></span>
<span class="line"><span style="color:#9ECBFF">            "config"</span><span style="color:#E1E4E8">: {</span><span style="color:#9ECBFF">"ip"</span><span style="color:#E1E4E8">: </span><span style="color:#F97583">f</span><span style="color:#9ECBFF">"192.168.1.</span><span style="color:#79B8FF">{100</span><span style="color:#F97583"> +</span><span style="color:#E1E4E8"> i</span><span style="color:#79B8FF">}</span><span style="color:#9ECBFF">"</span><span style="color:#E1E4E8">, </span><span style="color:#9ECBFF">"os"</span><span style="color:#E1E4E8">: </span><span style="color:#9ECBFF">"Linux"</span><span style="color:#E1E4E8">},</span></span>
<span class="line"><span style="color:#9ECBFF">            "history"</span><span style="color:#E1E4E8">: [{</span><span style="color:#9ECBFF">"timestamp"</span><span style="color:#E1E4E8">: timeit.default_timer() </span><span style="color:#F97583">-</span><span style="color:#E1E4E8"> j, </span><span style="color:#9ECBFF">"event"</span><span style="color:#E1E4E8">: </span><span style="color:#F97583">f</span><span style="color:#9ECBFF">"Event </span><span style="color:#79B8FF">{</span><span style="color:#E1E4E8">j</span><span style="color:#79B8FF">}</span><span style="color:#9ECBFF">"</span><span style="color:#E1E4E8">} </span><span style="color:#F97583">for</span><span style="color:#E1E4E8"> j </span><span style="color:#F97583">in</span><span style="color:#79B8FF"> range</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">5</span><span style="color:#E1E4E8">)]</span></span>
<span class="line"><span style="color:#E1E4E8">        }</span></span>
<span class="line"><span style="color:#E1E4E8">        entries.append(current_entry)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    # Use orjson.dumps for efficient generation of the test data</span></span>
<span class="line"><span style="color:#F97583">    return</span><span style="color:#E1E4E8"> orjson.dumps({</span><span style="color:#9ECBFF">"data"</span><span style="color:#E1E4E8">: entries})</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D"># Generate test data based on your scale</span></span>
<span class="line"><span style="color:#79B8FF">TEST_DATA_BYTES</span><span style="color:#F97583"> =</span><span style="color:#E1E4E8"> create_large_test_json(</span><span style="color:#FFAB70">num_entries</span><span style="color:#F97583">=</span><span style="color:#79B8FF">10000</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#79B8FF">print</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">f</span><span style="color:#9ECBFF">"Generated test data size: </span><span style="color:#79B8FF">{len</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">TEST_DATA_BYTES</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">/</span><span style="color:#E1E4E8"> (</span><span style="color:#79B8FF">1024</span><span style="color:#F97583">*</span><span style="color:#79B8FF">1024</span><span style="color:#E1E4E8">)</span><span style="color:#F97583">:.2f</span><span style="color:#79B8FF">}</span><span style="color:#9ECBFF"> MB"</span><span style="color:#E1E4E8">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D"># Number of times to repeat the parsing operation for more accurate timing</span></span>
<span class="line"><span style="color:#79B8FF">NUM_REPETITIONS</span><span style="color:#F97583"> =</span><span style="color:#79B8FF"> 100</span></span>
<span class="line"></span>
<span class="line"><span style="color:#79B8FF">print</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">f</span><span style="color:#9ECBFF">"</span><span style="color:#79B8FF">\\n</span><span style="color:#9ECBFF">Running benchmarks with </span><span style="color:#79B8FF">{NUM_REPETITIONS}</span><span style="color:#9ECBFF"> repetitions..."</span><span style="color:#E1E4E8">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D"># Benchmark json.loads()</span></span>
<span class="line"><span style="color:#E1E4E8">time_json </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> timeit.timeit(</span><span style="color:#F97583">lambda</span><span style="color:#E1E4E8">: json.loads(</span><span style="color:#79B8FF">TEST_DATA_BYTES</span><span style="color:#E1E4E8">), </span><span style="color:#FFAB70">number</span><span style="color:#F97583">=</span><span style="color:#79B8FF">NUM_REPETITIONS</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#79B8FF">print</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">f</span><span style="color:#9ECBFF">"Built-in json.loads() took: </span><span style="color:#79B8FF">{</span><span style="color:#E1E4E8">time_json</span><span style="color:#F97583">:.6f</span><span style="color:#79B8FF">}</span><span style="color:#9ECBFF"> seconds (total for </span><span style="color:#79B8FF">{NUM_REPETITIONS}</span><span style="color:#9ECBFF"> runs)"</span><span style="color:#E1E4E8">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D"># Benchmark orjson.loads()</span></span>
<span class="line"><span style="color:#E1E4E8">time_orjson </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> timeit.timeit(</span><span style="color:#F97583">lambda</span><span style="color:#E1E4E8">: orjson.loads(</span><span style="color:#79B8FF">TEST_DATA_BYTES</span><span style="color:#E1E4E8">), </span><span style="color:#FFAB70">number</span><span style="color:#F97583">=</span><span style="color:#79B8FF">NUM_REPETITIONS</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#79B8FF">print</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">f</span><span style="color:#9ECBFF">"orjson.loads() took:      </span><span style="color:#79B8FF">{</span><span style="color:#E1E4E8">time_orjson</span><span style="color:#F97583">:.6f</span><span style="color:#79B8FF">}</span><span style="color:#9ECBFF"> seconds (total for </span><span style="color:#79B8FF">{NUM_REPETITIONS}</span><span style="color:#9ECBFF"> runs)"</span><span style="color:#E1E4E8">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D"># Confirm parsing accuracy (performed once for correctness)</span></span>
<span class="line"><span style="color:#E1E4E8">parsed_data_json_single </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> json.loads(</span><span style="color:#79B8FF">TEST_DATA_BYTES</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#E1E4E8">parsed_data_orjson_single </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> orjson.loads(</span><span style="color:#79B8FF">TEST_DATA_BYTES</span><span style="color:#E1E4E8">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">if</span><span style="color:#E1E4E8"> parsed_data_json_single </span><span style="color:#F97583">==</span><span style="color:#E1E4E8"> parsed_data_orjson_single:</span></span>
<span class="line"><span style="color:#79B8FF">    print</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"</span><span style="color:#79B8FF">\\n</span><span style="color:#9ECBFF">Parsing results are identical for a single run."</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#F97583">else</span><span style="color:#E1E4E8">:</span></span>
<span class="line"><span style="color:#79B8FF">    print</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"</span><span style="color:#79B8FF">\\n</span><span style="color:#9ECBFF">WARNING: Parsing results differ for a single run."</span><span style="color:#E1E4E8">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D"># Calculate speedup ratio</span></span>
<span class="line"><span style="color:#F97583">if</span><span style="color:#E1E4E8"> time_orjson </span><span style="color:#F97583">></span><span style="color:#79B8FF"> 0</span><span style="color:#E1E4E8">:</span></span>
<span class="line"><span style="color:#E1E4E8">    speedup_factor </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> time_json </span><span style="color:#F97583">/</span><span style="color:#E1E4E8"> time_orjson</span></span>
<span class="line"><span style="color:#79B8FF">    print</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">f</span><span style="color:#9ECBFF">"</span><span style="color:#79B8FF">\\n</span><span style="color:#9ECBFF">orjson is </span><span style="color:#79B8FF">{</span><span style="color:#E1E4E8">speedup_factor</span><span style="color:#F97583">:.2f</span><span style="color:#79B8FF">}</span><span style="color:#9ECBFF">x faster than built-in json for deserialization (over </span><span style="color:#79B8FF">{NUM_REPETITIONS}</span><span style="color:#9ECBFF"> runs)."</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#F97583">else</span><span style="color:#E1E4E8">:</span></span>
<span class="line"><span style="color:#79B8FF">    print</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"orjson was extremely fast, time close to zero."</span><span style="color:#E1E4E8">)</span></span></code></pre>
<h3 id="interpretation-of-results">Interpretation of Results:</h3>
<p>Using the benchmark with 10,000 entries and 100 repetitions, we obtained the following results, consistent with real-world scenarios:</p>
<ul>
<li><strong>Generated test data size:</strong> 4.31 MB</li>
<li><strong>Built-in <code>json.loads()</code> took:</strong> 25.002522 seconds (total for 100 runs)</li>
<li><strong><code>orjson.loads()</code> took:</strong> 15.892222 seconds (total for 100 runs)</li>
</ul>
<p>These results demonstrate that <code>orjson</code> is approximately <strong>36.44% faster</strong> than the built-in <code>json</code> module for deserialization in this benchmark.</p>
<p>To translate this directly to my problem: if JSON parsing was a significant portion of my 70-minute nightly API call, a <strong>36.44% speedup in parsing time</strong> could translate into substantial real-world savings. For instance, if a process relying heavily on JSON parsing currently takes <strong>1 hour and 10 minutes (70 minutes)</strong>, a 36.44% improvement could reduce that specific processing step to approximately <strong>45 minutes</strong>. This 25-minute reduction is a tangible win, directly impacting how quickly my data pipelines complete.</p>
<h3 id="integration-with-api-workflows">Integration with API Workflows</h3>
<p>Integrating <code>orjson</code> into your existing API client setup (e.g., using the <code>requests</code> library) is straightforward:</p>
<ol>
<li><strong>Import <code>orjson</code>:</strong> <code>import orjson</code></li>
<li><strong>Use <code>orjson.loads()</code> on <code>response.content</code>:</strong> Instead of <code>response.json()</code>, which internally uses <code>json.loads()</code>, explicitly call <code>orjson.loads(response.content)</code>. <code>response.content</code> provides the raw byte data, which <code>orjson</code> prefers for optimal performance.</li>
</ol>
<pre class="astro-code github-dark" style="background-color:#24292e;color:#e1e4e8; overflow-x: auto;" tabindex="0" data-language="python"><code><span class="line"><span style="color:#F97583">import</span><span style="color:#E1E4E8"> requests</span></span>
<span class="line"><span style="color:#F97583">import</span><span style="color:#E1E4E8"> orjson</span></span>
<span class="line"><span style="color:#F97583">import</span><span style="color:#E1E4E8"> time</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">api_url </span><span style="color:#F97583">=</span><span style="color:#9ECBFF"> "[https://jsonplaceholder.typicode.com/posts/1](https://jsonplaceholder.typicode.com/posts/1)"</span><span style="color:#6A737D"> # Example API endpoint</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">try</span><span style="color:#E1E4E8">:</span></span>
<span class="line"><span style="color:#E1E4E8">    response </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> requests.get(api_url, </span><span style="color:#FFAB70">timeout</span><span style="color:#F97583">=</span><span style="color:#79B8FF">10</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#E1E4E8">    response.raise_for_status() </span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">    parse_start </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> time.perf_counter()</span></span>
<span class="line"><span style="color:#E1E4E8">    api_data </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> orjson.loads(response.content)</span></span>
<span class="line"><span style="color:#E1E4E8">    parse_end </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> time.perf_counter()</span></span>
<span class="line"><span style="color:#E1E4E8">    </span></span>
<span class="line"><span style="color:#79B8FF">    print</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">f</span><span style="color:#9ECBFF">"API call successful. JSON parsing took: </span><span style="color:#79B8FF">{</span><span style="color:#E1E4E8">parse_end </span><span style="color:#F97583">-</span><span style="color:#E1E4E8"> parse_start</span><span style="color:#F97583">:.6f</span><span style="color:#79B8FF">}</span><span style="color:#9ECBFF"> seconds."</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#6A737D">    # Process api_data (now a Python dictionary)</span></span>
<span class="line"><span style="color:#79B8FF">    print</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">f</span><span style="color:#9ECBFF">"Parsed data: </span><span style="color:#79B8FF">{</span><span style="color:#E1E4E8">api_data.get(</span><span style="color:#9ECBFF">'title'</span><span style="color:#E1E4E8">)[:</span><span style="color:#79B8FF">30</span><span style="color:#E1E4E8">]</span><span style="color:#79B8FF">}</span><span style="color:#9ECBFF">..."</span><span style="color:#E1E4E8">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">except</span><span style="color:#E1E4E8"> requests.exceptions.RequestException </span><span style="color:#F97583">as</span><span style="color:#E1E4E8"> e:</span></span>
<span class="line"><span style="color:#79B8FF">    print</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">f</span><span style="color:#9ECBFF">"API request failed: </span><span style="color:#79B8FF">{</span><span style="color:#E1E4E8">e</span><span style="color:#79B8FF">}</span><span style="color:#9ECBFF">"</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#F97583">except</span><span style="color:#E1E4E8"> orjson.JSONDecodeError </span><span style="color:#F97583">as</span><span style="color:#E1E4E8"> e:</span></span>
<span class="line"><span style="color:#79B8FF">    print</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">f</span><span style="color:#9ECBFF">"JSON parsing failed: </span><span style="color:#79B8FF">{</span><span style="color:#E1E4E8">e</span><span style="color:#79B8FF">}</span><span style="color:#9ECBFF">"</span><span style="color:#E1E4E8">)</span></span></code></pre>
<h3 id="conclusion">Conclusion</h3>
<p>Optimizing JSON parsing is a practical and effective method to enhance API interaction speed, especially when dealing with high data volumes or complex structures. As my own experience demonstrated, identifying and addressing bottlenecks like slow parsing with tools like orjson can yield substantial performance gains. And that’s the real lesson here, isn’t it? It’s not always about needing a massive rewrite. Sometimes, those small, steady improvements—saving a few minutes here and there—are what truly make your code better and your daily work smoother in the long run. Just remember to back up your code before you start tinkering. Your future self will appreciate it.</p>
<p>On a serious note, none of this would be possible without the hard work of the <code>orjson</code> team. If you haven’t already, I highly recommend checking out their <a href="https://github.com/ijl/orjson">GitHub repository</a>. It might sound hokey, but I can’t believe how much my life has been improved by people I have never or probably will never meet.</p>`, { headings: 605, localImagePaths: 625, remoteImagePaths: 626, frontmatter: 627, imagePaths: 631 }, [606, 609, 612, 615, 618, 621, 624], { depth: 37, slug: 607, text: 608 }, "the-nightly-grind-my-api-performance-bottleneck", "The Nightly Grind: My API Performance Bottleneck", { depth: 37, slug: 610, text: 611 }, "the-root-of-the-problem-slow-json-parsing", "The Root of the Problem: Slow JSON Parsing", { depth: 37, slug: 613, text: 614 }, "orjson-the-performance-enhancer", "orjson: The Performance Enhancer", { depth: 37, slug: 616, text: 617 }, "quantifying-the-gain-a-practical-benchmark", "Quantifying the Gain: A Practical Benchmark", { depth: 37, slug: 619, text: 620 }, "interpretation-of-results", "Interpretation of Results:", { depth: 37, slug: 622, text: 623 }, "integration-with-api-workflows", "Integration with API Workflows", { depth: 37, slug: 60, text: 61 }, [], [], { title: 582, categories: 628, tags: 629, pubDate: 630, description: 583 }, [200, 595, 596, 597, 589, 598], [200, 465, 586, 587, 588, 589, 590, 591, 592, 593], "2025-07-19 12:00:00 -0400", [], "2025-07-19-Taking-the-Small-Wins.md", "2025-08-10-fact-and-friction-in-healthcare-data", { id: 633, data: 635, body: 651, filePath: 652, digest: 653, rendered: 654, legacyId: 665 }, { title: 636, description: 637, pubDate: 638, tags: 639, categories: 647 }, "Fact and Friction in Healthcare Data", "How advanced data integration in healthcare creates powerful capabilities alongside unintended friction for patients and providers.", ["Date", "2025-08-10T16:00:00.000Z"], [640, 641, 642, 643, 644, 645, 646], "HL7", "FHIR", "healthcare data", "Java", "Mirth Connect", "healthcare interoperability", "data exchange", [648, 649, 650], "Healthcare Technology", "Data Integration", "Interoperability", '**Blackbox Consensus: The Potential for Misalignment in Health Data Integration for Patient Outcomes in Claim Adjudication**\n\nThe pursuit of total data integration has been a foundational goal in health informatics for decades. This ambition long predates even landmark regulations like the Health Insurance Portability and Accountability Act of 1996, whose full title begins, "An Act To amend the Internal Revenue Code of 1986 to improve portability and continuity of health insurance coverage..." (Pub. L. No. 104-191). This legislative focus underscored a fundamental challenge: without the ability to easily move health information between providers and locations, patients faced substantially more complex and fragmented healthcare decisions. Early efforts were often constrained by the high cost of on-premise computing and the technical limitations of disparate systems. However, the widespread adoption of cloud computing and big data platforms has fundamentally altered this landscape. Fueled by this new technological power and driven by the promise of enhanced efficiency and personalized medicine, healthcare organizations are now investing heavily in sophisticated technical architectures to eliminate data silos. The objective is laudable: to create a unified, longitudinal patient record accessible across the care continuum.\n\nHowever, this technological pursuit presents a parallax—an apparent shift in an object\'s position due to a change in the line of sight. Viewed from the perspective of enterprise operations, data integration is a panacea for fragmentation and inefficiency. Viewed from the patient\'s perspective, however, the same infrastructure can manifest as an opaque system of control that may subordinate individual clinical needs to institutional objectives. This analysis will critically examine the architecture of these integrated systems, detailing the specific data flows and technologies involved, and argue that without deliberate governance, their primary effect may be the consolidation of institutional power rather than the empowerment of the patient.\nArchitecting the Centralized Health Data Ecosystem: A Deeper Analysis\nThe technical feat of modern data integration involves constructing a multi-layered infrastructure designed to ingest, manage, and analyze data at a massive scale. This ecosystem moves beyond simple point-to-point interfaces to create a central repository of curated health information. A detailed examination of this process reveals a complex data lifecycle. \n\n**Data Ingestion and Federation: The Digital Front Door**\nThe initial challenge is unifying heterogeneous data sources, each with its own standards, formats, and latencies. Integration engines like Mirth Connect or Infor Cloverleaf are critical at this stage. For instance, a typical Health Level Seven (HL7) v2 message, containing an admission or a lab result, is received via a TCP port. The engine parses this pipe-and-hat delimited text into a structured format (often XML or JSON). It then applies transformation logic—mapping proprietary Z-segments, validating data fields, and enriching the message with data from other sources via API calls—before routing it to downstream systems. Concurrently, modern, API-driven data streams using Fast Healthcare Interoperability Resources (FHIR) are handled through secure RESTful endpoints, providing a more standardized, resource-oriented flow of information. This layer must also accommodate batch data from claims systems (in [X12 EDI format](https://x12.org/)) and streaming data from Internet of Things (IoT) medical devices.\n\n**Harmonization and Curation: From Raw Data to Actionable Insight**\nOnce ingested, data is channeled into a cloud-based data lakehouse, a hybrid architecture combining the flexibility of a data lake with the management features of a data warehouse. Platforms like Databricks (built on Apache Spark) and Snowflake are dominant in this space. The data flow typically follows a medallion architecture:\nBronze Layer: Raw, untransformed data is landed here from the integration engine. It is the immutable source of truth.\nSilver Layer: Data from the bronze layer is cleaned, deduplicated, and conformed. For example, patient records from multiple source systems are linked using a Master Patient Index (MPI), and clinical terminologies are mapped to standards like [SNOMED CT](https://www.snomed.org/snomed-ct) or [LOINC](https://loinc.org/). This is where tools like Python with libraries such as Polars (for performance) or PySpark are used for large-scale data transformations.\nGold Layer: Data from the silver layer is aggregated and organized into business-centric data models. These are the analysis-ready tables that power reporting and machine learning, such as a patient-level table with features for predicting readmission risk. Apache Iceberg is often used as the open table format to provide ACID transactions, schema evolution, and time-travel capabilities directly on the data lake.\n\n**Analytics and Application: Activating the Data**\nThe curated data in the gold layer supports a range of functions. Business intelligence tools like Tableau or Power BI connect to these tables for operational dashboards. More critically, data science teams use platforms like Databricks Machine Learning or AWS SageMaker to develop and deploy complex predictive models. These models, trained on vast historical datasets, are designed to stratify patient risk, predict disease progression, identify potential fraud, and optimize resource allocation. The outputs of these models are then fed back into clinical or operational systems, often via API, to influence decision-making.\nThis architectural model represents a significant leap in technical capability, successfully solving many long-standing problems of interoperability and data fragmentation.\nFigure 1: Conceptual Model of an Enterprise Health Data Architecture\n\n```mermaid\ngraph TD\n    subgraph "Layer 1: Data Sources"\n        A1[EHRs / Clinical Systems]\n        A2[Admin & Financial Systems]\n        A3[Medical Devices / IoT]\n    end\n\n    subgraph "Layer 2: Integration & Orchestration"\n        B1["Integration Engine<br/>(HL7, FHIR)"]\n        B2[ETL / ELT Pipelines]\n        B3[APIs & ESB]\n    end\n\n    subgraph "Layer 3: Storage & Management"\n        C1["Data Lake<br/>(Raw Data)"]\n        C2["Data Warehouse / Lakehouse<br/>(Curated Data)"]\n        C3[Master Data Management MDM]\n    end\n\n    subgraph "Layer 4: Analytics & Applications"\n        D1[Business Intelligence & Reporting]\n        D2[Machine Learning & Predictive Analytics]\n        D3[Claims Adjudication Systems]\n    end\n\n    A1 --> B1\n    A2 --> B2\n    A3 --> B3\n    B1 --> C1\n    B2 --> C2\n    B3 --> C3\n    C1 --> D1\n    C2 --> D2\n    C3 --> D3\n```\n\n\n**The Unintended Consequences: Algorithmic Opacity and the Diffusion of Accountability**\nWhile technologically impressive, a primary application of this integrated data—particularly for payers—is the optimization of claims adjudication and utilization management. This operational focus introduces significant consequences for the patient by creating systems characterized by algorithmic opacity and a diffusion of accountability.\nThe process is no longer a simple transaction between a provider and a payer. Instead, it is a multi-stage, automated workflow that often delegates key decisions to third-party vendors. These external entities provide specialized services in payment integrity, utilization review, and benefits administration, each employing proprietary algorithms. This complex arrangement, modeled below, fundamentally alters the dynamic of care authorization and payment.\nFigure 2: The Role of Third-Party Vendors in Claims Adjudication\n\n```mermaid\ngraph TD\n    subgraph "Payer\'s Internal Process"\n        A[Claim Received] --> B{Initial Automated Checks}\n        B --> C[Adjudication Engine]\n        C --> F{Final Decision}\n        F -->|Approved| G[Payment Processed]\n        F -->|Denied| H[Denial Sent to Patient/Provider]\n    end\n\n    subgraph "Third-Party Black Box Vendors"\n        TP1["Payment Integrity Vendor<br/>(Scans for fraud, waste, abuse)"]\n        TP2["Utilization Management UM Org<br/>(Checks Medical Necessity)"]\n        TP3["Contract & Benefit Vendor<br/>(Applies complex plan rules)"]\n    end\n\n    C --> TP1\n    C --> TP2\n    C --> TP3\n\n    TP1 -->|returns flags & recommendations| C\n    TP2 -->|returns approval/denial| C\n    TP3 -->|returns coverage analysis| C\n\n    style TP1 fill:#f9f,stroke:#333,stroke-width:2px\n    style TP2 fill:#f9f,stroke:#333,stroke-width:2px\n    style TP3 fill:#f9f,stroke:#333,stroke-width:2px\n```\n\n\nThis model creates two critical issues:\n\n**Algorithmic Opacity:** The decision-making logic of third-party vendors is almost always a protected "black box." A claim may be denied based on an algorithmic determination, yet neither the patient nor the provider has access to the specific rules or weighting that led to that conclusion. This creates a profound information asymmetry and risks perpetuating systemic biases. A landmark study by Obermeyer et al. (2019) found that a widely used commercial algorithm was significantly biased against some patients because it incorrectly used healthcare costs as a proxy for health needs, thereby systematically disadvantaging a population that incurs lower health costs for a given level of illness.\n\n**Diffusion of Accountability:** When a claim is denied, the locus of responsibility becomes obscured. The payer can attribute the decision to its vendor, while the vendor is accountable only to the payer. This structure creates a digital version of the "bystander effect," a sociopsychological phenomenon first detailed by Darley and Latané (1968) as a "diffusion of responsibility." Just as the presence of multiple onlookers can reduce any single individual\'s impulse to intervene in an emergency, the multi-party, automated nature of claims adjudication makes it difficult to assign clear accountability for an adverse decision (Cummings & Rawson, 2023). This arrangement makes the appeals process exceptionally difficult.\nThe Provider\'s Dilemma: Caught Between Patient Needs and System Demands\nThis system places healthcare providers in an untenable position. While data integration promises a holistic patient view to improve clinical decisions, it simultaneously fuels an administrative apparatus that erodes their professional autonomy and consumes valuable resources. Clinicians and their staff are forced to spend an inordinate amount of time contesting automated denials, engaging in time-consuming "peer-to-peer" reviews, and generating extensive documentation not for clinical purposes, but to satisfy the demands of an algorithm. This immense administrative burden is a well-documented driver of physician burnout. Furthermore, it represents a fundamental erosion of clinical judgment, as the provider\'s expert opinion is often subordinated to a rigid, automated rule set that cannot account for the nuances of an individual patient\'s condition.\n\n**A Case Study in System Failure: The Patient\'s Journey**\nTo illustrate the practical implications of this model, consider the following hypothetical patient journey. A 45-year-old patient with a complex autoimmune condition is recommended a newer biologic drug by her specialist based on her specific genotype and poor response to older therapies. The claim is automatically denied by the insurer\'s system, with the Explanation of Benefits citing a generic reason: "step-therapy required." The specialist\'s office spends weeks submitting appeals and providing documentation. During this delay, the patient\'s condition worsens, leading to a preventable hospitalization. The system, designed for cost-containment, has not only failed to account for the specific clinical needs of the patient but has also generated a higher long-term cost, all while causing significant patient harm and disempowerment. This case is not an outlier; it is a predictable outcome of a system where operational metrics are decoupled from patient well-being.\nThe Narrative of Patient-Centricity and the Incentives of Liability\nCompounding these issues is the pervasive corporate narrative of "patient-centricity." Health insurers and technology vendors frequently frame their solutions as being designed to empower patients, yet this rhetoric often masks underlying priorities. As Weissman et al. (2017) note, "patient-centered care" remains one of the most-used and least-understood terms, with a significant gap between the marketing ideal and operational reality.\nThis gap is widened by the regulatory and legal landscape. The legal frameworks governing AI in healthcare are still evolving, creating ambiguity around liability for algorithmic harm. In this environment, a powerful incentive exists for organizations to limit their legal exposure. Full transparency into how an algorithm works could reveal flaws or biases that create grounds for malpractice or product liability lawsuits. Therefore, a rational, risk-averse corporate strategy is to keep algorithmic processes opaque, treating them as proprietary trade secrets. This directly conflicts with the principles of transparency and shared decision-making that are foundational to genuine patient-centricity. Regulations, intended to protect, can thus have the perverse effect of incentivizing companies to withhold information and avoid acknowledging harms in favor of limiting liability.\n\n**Conclusion: Toward a Framework for Accountable Data Governance**\nThe advancement of enterprise data integration in healthcare is inevitable and offers substantial potential benefits. However, to ensure these benefits accrue to patients as well as institutions, the focus must expand from technical implementation to robust governance. Achieving a more equitable balance requires a framework centered on accountability and transparency. This includes:\nAlgorithmic Auditing: Establishing standards for the independent auditing of proprietary algorithms to ensure they are clinically valid and free from the types of bias identified by researchers (Obermeyer et al., 2019). This addresses the ethical question of responsibility for algorithmic harm (Aquino et al., 2024).\nEnhanced Transparency and Explainability: Mandating that explanations of benefits (EOBs) for denied claims provide clearer insight into the decision-making rationale. The growing industry discourse around "explainable AI" acknowledges the need to move away from "black box" systems toward auditable processes.\nStrengthened Data Stewardship: Developing governance models that treat patient data not merely as an asset to be optimized but as a clinical entity that requires fiduciary-level stewardship, with clear lines of responsibility that counteract the natural tendency toward diffusion.\nTo break the cycle of misaligned incentives and ensure these governance principles are upheld, an external, unbiased mechanism for oversight is required. The current system lacks a trusted arbiter to report on real-world outcomes. Therefore, a crucial step forward is the empowerment of independent bodies—such as academic institutions, non-partisan NGOs like The Commonwealth Fund or the Kaiser Family Foundation, or designated government organizations—to serve this function. These organizations could be tasked with independently auditing algorithmic outcomes, analyzing their impact on different patient populations, and publishing their findings. Such transparent, third-party reporting would create an essential feedback loop, providing policymakers with the unbiased evidence needed to craft more effective, patient-focused regulations and holding the industry accountable to its promise of better care.', "src/content/blog/2025-08-10-Fact-and-Friction-in-Healthcare-Data.md", "3269ed053a0ab116", { html: 655, metadata: 656 }, `<p><strong>Blackbox Consensus: The Potential for Misalignment in Health Data Integration for Patient Outcomes in Claim Adjudication</strong></p>
<p>The pursuit of total data integration has been a foundational goal in health informatics for decades. This ambition long predates even landmark regulations like the Health Insurance Portability and Accountability Act of 1996, whose full title begins, “An Act To amend the Internal Revenue Code of 1986 to improve portability and continuity of health insurance coverage…” (Pub. L. No. 104-191). This legislative focus underscored a fundamental challenge: without the ability to easily move health information between providers and locations, patients faced substantially more complex and fragmented healthcare decisions. Early efforts were often constrained by the high cost of on-premise computing and the technical limitations of disparate systems. However, the widespread adoption of cloud computing and big data platforms has fundamentally altered this landscape. Fueled by this new technological power and driven by the promise of enhanced efficiency and personalized medicine, healthcare organizations are now investing heavily in sophisticated technical architectures to eliminate data silos. The objective is laudable: to create a unified, longitudinal patient record accessible across the care continuum.</p>
<p>However, this technological pursuit presents a parallax—an apparent shift in an object’s position due to a change in the line of sight. Viewed from the perspective of enterprise operations, data integration is a panacea for fragmentation and inefficiency. Viewed from the patient’s perspective, however, the same infrastructure can manifest as an opaque system of control that may subordinate individual clinical needs to institutional objectives. This analysis will critically examine the architecture of these integrated systems, detailing the specific data flows and technologies involved, and argue that without deliberate governance, their primary effect may be the consolidation of institutional power rather than the empowerment of the patient.
Architecting the Centralized Health Data Ecosystem: A Deeper Analysis
The technical feat of modern data integration involves constructing a multi-layered infrastructure designed to ingest, manage, and analyze data at a massive scale. This ecosystem moves beyond simple point-to-point interfaces to create a central repository of curated health information. A detailed examination of this process reveals a complex data lifecycle.</p>
<p><strong>Data Ingestion and Federation: The Digital Front Door</strong>
The initial challenge is unifying heterogeneous data sources, each with its own standards, formats, and latencies. Integration engines like Mirth Connect or Infor Cloverleaf are critical at this stage. For instance, a typical Health Level Seven (HL7) v2 message, containing an admission or a lab result, is received via a TCP port. The engine parses this pipe-and-hat delimited text into a structured format (often XML or JSON). It then applies transformation logic—mapping proprietary Z-segments, validating data fields, and enriching the message with data from other sources via API calls—before routing it to downstream systems. Concurrently, modern, API-driven data streams using Fast Healthcare Interoperability Resources (FHIR) are handled through secure RESTful endpoints, providing a more standardized, resource-oriented flow of information. This layer must also accommodate batch data from claims systems (in <a href="https://x12.org/">X12 EDI format</a>) and streaming data from Internet of Things (IoT) medical devices.</p>
<p><strong>Harmonization and Curation: From Raw Data to Actionable Insight</strong>
Once ingested, data is channeled into a cloud-based data lakehouse, a hybrid architecture combining the flexibility of a data lake with the management features of a data warehouse. Platforms like Databricks (built on Apache Spark) and Snowflake are dominant in this space. The data flow typically follows a medallion architecture:
Bronze Layer: Raw, untransformed data is landed here from the integration engine. It is the immutable source of truth.
Silver Layer: Data from the bronze layer is cleaned, deduplicated, and conformed. For example, patient records from multiple source systems are linked using a Master Patient Index (MPI), and clinical terminologies are mapped to standards like <a href="https://www.snomed.org/snomed-ct">SNOMED CT</a> or <a href="https://loinc.org/">LOINC</a>. This is where tools like Python with libraries such as Polars (for performance) or PySpark are used for large-scale data transformations.
Gold Layer: Data from the silver layer is aggregated and organized into business-centric data models. These are the analysis-ready tables that power reporting and machine learning, such as a patient-level table with features for predicting readmission risk. Apache Iceberg is often used as the open table format to provide ACID transactions, schema evolution, and time-travel capabilities directly on the data lake.</p>
<p><strong>Analytics and Application: Activating the Data</strong>
The curated data in the gold layer supports a range of functions. Business intelligence tools like Tableau or Power BI connect to these tables for operational dashboards. More critically, data science teams use platforms like Databricks Machine Learning or AWS SageMaker to develop and deploy complex predictive models. These models, trained on vast historical datasets, are designed to stratify patient risk, predict disease progression, identify potential fraud, and optimize resource allocation. The outputs of these models are then fed back into clinical or operational systems, often via API, to influence decision-making.
This architectural model represents a significant leap in technical capability, successfully solving many long-standing problems of interoperability and data fragmentation.
Figure 1: Conceptual Model of an Enterprise Health Data Architecture</p>
<div class="mermaid">
graph TD
    subgraph "Layer 1: Data Sources"
        A1[EHRs / Clinical Systems]
        A2[Admin &#x26; Financial Systems]
        A3[Medical Devices / IoT]
    end

    subgraph "Layer 2: Integration &#x26; Orchestration"
        B1["Integration Engine<br>(HL7, FHIR)"]
        B2[ETL / ELT Pipelines]
        B3[APIs &#x26; ESB]
    end

    subgraph "Layer 3: Storage &#x26; Management"
        C1["Data Lake<br>(Raw Data)"]
        C2["Data Warehouse / Lakehouse<br>(Curated Data)"]
        C3[Master Data Management MDM]
    end

    subgraph "Layer 4: Analytics &#x26; Applications"
        D1[Business Intelligence &#x26; Reporting]
        D2[Machine Learning &#x26; Predictive Analytics]
        D3[Claims Adjudication Systems]
    end

    A1 --> B1
    A2 --> B2
    A3 --> B3
    B1 --> C1
    B2 --> C2
    B3 --> C3
    C1 --> D1
    C2 --> D2
    C3 --> D3
</div>
<p><strong>The Unintended Consequences: Algorithmic Opacity and the Diffusion of Accountability</strong>
While technologically impressive, a primary application of this integrated data—particularly for payers—is the optimization of claims adjudication and utilization management. This operational focus introduces significant consequences for the patient by creating systems characterized by algorithmic opacity and a diffusion of accountability.
The process is no longer a simple transaction between a provider and a payer. Instead, it is a multi-stage, automated workflow that often delegates key decisions to third-party vendors. These external entities provide specialized services in payment integrity, utilization review, and benefits administration, each employing proprietary algorithms. This complex arrangement, modeled below, fundamentally alters the dynamic of care authorization and payment.
Figure 2: The Role of Third-Party Vendors in Claims Adjudication</p>
<div class="mermaid">
graph TD
    subgraph "Payer's Internal Process"
        A[Claim Received] --> B{Initial Automated Checks}
        B --> C[Adjudication Engine]
        C --> F{Final Decision}
        F -->|Approved| G[Payment Processed]
        F -->|Denied| H[Denial Sent to Patient/Provider]
    end

    subgraph "Third-Party Black Box Vendors"
        TP1["Payment Integrity Vendor<br>(Scans for fraud, waste, abuse)"]
        TP2["Utilization Management UM Org<br>(Checks Medical Necessity)"]
        TP3["Contract &#x26; Benefit Vendor<br>(Applies complex plan rules)"]
    end

    C --> TP1
    C --> TP2
    C --> TP3

    TP1 -->|returns flags &#x26; recommendations| C
    TP2 -->|returns approval/denial| C
    TP3 -->|returns coverage analysis| C

    style TP1 fill:#f9f,stroke:#333,stroke-width:2px
    style TP2 fill:#f9f,stroke:#333,stroke-width:2px
    style TP3 fill:#f9f,stroke:#333,stroke-width:2px
</div>
<p>This model creates two critical issues:</p>
<p><strong>Algorithmic Opacity:</strong> The decision-making logic of third-party vendors is almost always a protected “black box.” A claim may be denied based on an algorithmic determination, yet neither the patient nor the provider has access to the specific rules or weighting that led to that conclusion. This creates a profound information asymmetry and risks perpetuating systemic biases. A landmark study by Obermeyer et al. (2019) found that a widely used commercial algorithm was significantly biased against some patients because it incorrectly used healthcare costs as a proxy for health needs, thereby systematically disadvantaging a population that incurs lower health costs for a given level of illness.</p>
<p><strong>Diffusion of Accountability:</strong> When a claim is denied, the locus of responsibility becomes obscured. The payer can attribute the decision to its vendor, while the vendor is accountable only to the payer. This structure creates a digital version of the “bystander effect,” a sociopsychological phenomenon first detailed by Darley and Latané (1968) as a “diffusion of responsibility.” Just as the presence of multiple onlookers can reduce any single individual’s impulse to intervene in an emergency, the multi-party, automated nature of claims adjudication makes it difficult to assign clear accountability for an adverse decision (Cummings &#x26; Rawson, 2023). This arrangement makes the appeals process exceptionally difficult.
The Provider’s Dilemma: Caught Between Patient Needs and System Demands
This system places healthcare providers in an untenable position. While data integration promises a holistic patient view to improve clinical decisions, it simultaneously fuels an administrative apparatus that erodes their professional autonomy and consumes valuable resources. Clinicians and their staff are forced to spend an inordinate amount of time contesting automated denials, engaging in time-consuming “peer-to-peer” reviews, and generating extensive documentation not for clinical purposes, but to satisfy the demands of an algorithm. This immense administrative burden is a well-documented driver of physician burnout. Furthermore, it represents a fundamental erosion of clinical judgment, as the provider’s expert opinion is often subordinated to a rigid, automated rule set that cannot account for the nuances of an individual patient’s condition.</p>
<p><strong>A Case Study in System Failure: The Patient’s Journey</strong>
To illustrate the practical implications of this model, consider the following hypothetical patient journey. A 45-year-old patient with a complex autoimmune condition is recommended a newer biologic drug by her specialist based on her specific genotype and poor response to older therapies. The claim is automatically denied by the insurer’s system, with the Explanation of Benefits citing a generic reason: “step-therapy required.” The specialist’s office spends weeks submitting appeals and providing documentation. During this delay, the patient’s condition worsens, leading to a preventable hospitalization. The system, designed for cost-containment, has not only failed to account for the specific clinical needs of the patient but has also generated a higher long-term cost, all while causing significant patient harm and disempowerment. This case is not an outlier; it is a predictable outcome of a system where operational metrics are decoupled from patient well-being.
The Narrative of Patient-Centricity and the Incentives of Liability
Compounding these issues is the pervasive corporate narrative of “patient-centricity.” Health insurers and technology vendors frequently frame their solutions as being designed to empower patients, yet this rhetoric often masks underlying priorities. As Weissman et al. (2017) note, “patient-centered care” remains one of the most-used and least-understood terms, with a significant gap between the marketing ideal and operational reality.
This gap is widened by the regulatory and legal landscape. The legal frameworks governing AI in healthcare are still evolving, creating ambiguity around liability for algorithmic harm. In this environment, a powerful incentive exists for organizations to limit their legal exposure. Full transparency into how an algorithm works could reveal flaws or biases that create grounds for malpractice or product liability lawsuits. Therefore, a rational, risk-averse corporate strategy is to keep algorithmic processes opaque, treating them as proprietary trade secrets. This directly conflicts with the principles of transparency and shared decision-making that are foundational to genuine patient-centricity. Regulations, intended to protect, can thus have the perverse effect of incentivizing companies to withhold information and avoid acknowledging harms in favor of limiting liability.</p>
<p><strong>Conclusion: Toward a Framework for Accountable Data Governance</strong>
The advancement of enterprise data integration in healthcare is inevitable and offers substantial potential benefits. However, to ensure these benefits accrue to patients as well as institutions, the focus must expand from technical implementation to robust governance. Achieving a more equitable balance requires a framework centered on accountability and transparency. This includes:
Algorithmic Auditing: Establishing standards for the independent auditing of proprietary algorithms to ensure they are clinically valid and free from the types of bias identified by researchers (Obermeyer et al., 2019). This addresses the ethical question of responsibility for algorithmic harm (Aquino et al., 2024).
Enhanced Transparency and Explainability: Mandating that explanations of benefits (EOBs) for denied claims provide clearer insight into the decision-making rationale. The growing industry discourse around “explainable AI” acknowledges the need to move away from “black box” systems toward auditable processes.
Strengthened Data Stewardship: Developing governance models that treat patient data not merely as an asset to be optimized but as a clinical entity that requires fiduciary-level stewardship, with clear lines of responsibility that counteract the natural tendency toward diffusion.
To break the cycle of misaligned incentives and ensure these governance principles are upheld, an external, unbiased mechanism for oversight is required. The current system lacks a trusted arbiter to report on real-world outcomes. Therefore, a crucial step forward is the empowerment of independent bodies—such as academic institutions, non-partisan NGOs like The Commonwealth Fund or the Kaiser Family Foundation, or designated government organizations—to serve this function. These organizations could be tasked with independently auditing algorithmic outcomes, analyzing their impact on different patient populations, and publishing their findings. Such transparent, third-party reporting would create an essential feedback loop, providing policymakers with the unbiased evidence needed to craft more effective, patient-focused regulations and holding the industry accountable to its promise of better care.</p>`, { headings: 657, localImagePaths: 658, remoteImagePaths: 659, frontmatter: 660, imagePaths: 664 }, [], [], [], { title: 636, categories: 661, tags: 662, pubDate: 663, description: 637 }, [648, 649, 650], [640, 641, 642, 643, 644, 645, 646], "2025-08-10 12:00:00 -0400", [], "2025-08-10-Fact-and-Friction-in-Healthcare-Data.md", "2025-09-29-from-raw-to-polished", { id: 666, data: 668, body: 672, filePath: 673, digest: 674, legacyId: 675, deferredRender: 676 }, { title: 669, description: 670, pubDate: 671 }, "From Raw Data to Polished Insights: A Guide to the Medallion Architecture", "Learn how the Medallion Architecture transforms raw data into polished insights through a structured, repeatable process.", ["Date", "2025-09-29T00:00:00.000Z"], `### From Raw Data to Polished Insights: A Guide to the Medallion Architecture


Hearing about a new design pattern or concept can feel overwhelming sometimes.  But once you look at it, it is really a simple idea, that you were probably already using.  
That is how I feel about Medallion Architecture. Most projects you work on involve cleaning data, usually in the early stages.  The very nature of data is that it is not always going to be collected in a uniform way. 
This makes having a formalized process for cleaning and structuring the data you are using very important
The Medallion Architecture is a way to take a more formalized and structured approact to what you were already doing. Encouraging you to document and iterate the process.

***

### The Bronze Layer: The Raw Collection

The Bronze layer is where all the raw materials arrive. For our project, we used the **GWAS Catalog**, a public database of published genetic research findings from the European Bioinformatics Institute and the National Human Genome Research Institute.

The raw data is remarkably versatile and can be used for countless abstractions because it contains the most granular level of detail possible. A single record has a comprehensive set of fields, including the specific **genetic variant**, the **p-value** of the association, the **disease or trait** it is linked to, the **journal** it was published in, and much more. This raw, detailed information is the foundation for all the insights that follow.

However, because it is sourced from so many different studies, the raw data is full of inconsistencies and needs a rigorous quality control check before any analysis. The Bronze layer ensures we have a complete, untouched copy of the raw data before any cleaning begins, which is the first step toward reproducibility.

***

### The Silver Layer: The First Shine

The Silver layer is where the real work begins. We take the raw data from the Bronze layer and start the first round of polishing. This is where we apply a rigorous process to clean, validate, and structure the data.

For the GWAS Catalog data, this meant:
* **Renaming columns:** We changed the difficult-to-read column names like \`DATE ADDED TO CATALOG\` to something clean and simple, like \`date_added\`.
* **Converting data types:** We converted the \`date_added\` column from a string to a proper date format, making it usable for time-based analysis.
* **Filtering out noise:** We can filter out any incomplete or low-quality data that could skew our results.

By the end of this stage, the data is in a clean, structured format, ready for analysis. It's no longer just a collection of text; it's a reliable table that can be trusted.

***

### The Gold Layer: The Final Gleam

The Gold layer is the final stage, where the data is polished to perfection and made ready for scientific inquiry. The goal here is to answer specific questions by aggregating the cleaned data. This layer is optimized for analysis and reporting, ensuring that you can get your answers quickly and reliably.

The real value here is that we can now use this clean data to get key insights that would have been impossible to see in the raw data. We chose two specific insights to abstract from the data:

* **Most Studied Traits:** We counted the number of studies for each disease or trait. This gives us a high-level view of where research is most concentrated in the field of genomics.
* **Most Prolific Journals:** We counted the number of studies published in each journal. This tells us which publications are the most influential in this research space.

The Medallion Architecture isn't just about moving data; it's about adding a layer of scientific rigor and trust at every stage, turning a chaotic pile of raw data into a set of reliable, valuable insights.

Here's a sample of what a single record in the raw data looks like:
\`\`\`
2016-10-04	26482879	Paternoster L	2015-10-19	Nat Genet	www.ncbi.nlm.nih.gov/pubmed/26482879	Multi-ancestry genome-wide association study of 21,000 cases and 95,000 controls identifies new risk loci for atopic dermatitis.	Atopic dermatitis	18,900 European ancestry cases, 1,472 Japanese ancestry cases, 422 African American cases, 300 Latino cases, 305 cases, 84,166 European ancestry controls, 7,966 Japanese ancestry controls, 844 African American controls, 1,592 Latino controls, 896 controls	 30,588 European ancestry cases, 459 African American cases, 1,012 Chinese ancestry cases, 226,537 European ancestry controls, 729 African American controls, 1,362 Chinese ancestry controls		19p13.2 19		8679458 ADAMTS10, ACTL9 NFILZ					ENSG00000268480					rs2918307-G	rs2918307	0	2918307 3_prime_UTR_variant		0	0.16	5E-12	11.301029995663981	 (EA, fixed effects)	1.12	[1.08–1.16]	Illumina [15539996] (imputed)	N	atopic eczema	http://www.ebi.ac.uk/efo/EFO_0000274	 GCST003184 Genome-wide genotyping array
\`\`\`
This single line of text represents a finding from a scientific study, but it's almost impossible to read. Now, contrast that with the data from the Gold layer. After being "polished" in the Silver layer and aggregated in the Gold layer, the data is now a clean, structured table that is ready for immediate analysis. .

Here's what the final, polished data looks like, showing the top 10 most-studied traits:

<table>
    <thead>
        <tr>
            <th style={{textAlign: "left"}}>Trait</th>
            <th style={{textAlign: "right"}}>Study Count</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>body height</td>
            <td style={{textAlign: "right"}}>44,485</td>
        </tr>
        <tr>
            <td>body mass index</td>
            <td style={{textAlign: "right"}}>21,919</td>
        </tr>
        <tr>
            <td>fatty acid amount</td>
            <td style={{textAlign: "right"}}>18,779</td>
        </tr>
        <tr>
            <td>high density lipoprotein cholesterol measurement</td>
            <td style={{textAlign: "right"}}>12,244</td>
        </tr>
        <tr>
            <td>triglyceride measurement</td>
            <td style={{textAlign: "right"}}>10,532</td>
        </tr>
        <tr>
            <td>platelet count</td>
            <td style={{textAlign: "right"}}>10,213</td>
        </tr>
        <tr>
            <td>blood protein amount</td>
            <td style={{textAlign: "right"}}>9,757</td>
        </tr>
        <tr>
            <td>systolic blood pressure</td>
            <td style={{textAlign: "right"}}>9,574</td>
        </tr>
        <tr>
            <td>protein measurement</td>
            <td style={{textAlign: "right"}}>9,451</td>
        </tr>
        <tr>
            <td>erythrocyte volume</td>
            <td style={{textAlign: "right"}}>8,875</td>
        </tr>
    </tbody>
</table>

<hr />
...
<hr />

You can find all the code for this project on my GitHub repository here: [https://github.com/TJAdryan/medallion_project.git](https://github.com/TJAdryan/medallion_project.git)



I added the full readme here for people who like to do things the pregit way:

The pipeline processes data through three distinct layers:

Bronze Layer: The raw, ingested data directly from the source.

Silver Layer: The cleaned, structured, and validated data.

Gold Layer: The aggregated, business-ready data optimized for analysis.

The Data: GWAS Catalog
We are using data from the GWAS Catalog maintained by the European Bioinformatics Institute (EBI) and the National Human Genome Research Institute (NHGRI). This catalog is a public database of published genome-wide association studies.

Source: https://www.ebi.ac.uk/gwas/api/search/downloads/alternative

Project Setup
1. Prerequisites
You'll need a Python environment with uv to manage packages.

Install uv: https://astral.sh/uv/install

2. Environment Setup
Create a dedicated virtual environment for the project.
\`\`\`
uv venv
source .venv/bin/activate
\`\`\`
3. Install Dependencies
We need a few key libraries for data manipulation and storage.

\`\`\`uv install pandas pyarrow duckdb
\`\`\` 
Project Structure
The project is organized to reflect the layers of the Medallion Architecture.

\`\`\`
.
├── .venv/                         # Virtual environment
├── data/
│   ├── bronze/                    # Raw, original data
│   ├── silver/                    # Cleaned and enriched data
│   └── gold/                      # Aggregated and finalized data
├── scripts/
│   ├── bronze_ingest.py           # Ingestion script
│   ├── silver_process.py          # Cleaning and structuring script
│   └── gold_transform.py          # Aggregation script
├── README.mdx                     # Project documentation
└── .gitignore                     # Git ignore file
\`\`\`

The Pipeline Steps
Step 1: Bronze Layer - Data Ingestion
This step downloads the raw GWAS Catalog data. It is the entry point for our data.

scripts/bronze_ingest.py
\`\`\`python
import requests
import os

url = "https://www.ebi.ac.uk/gwas/api/search/downloads/alternative"
filename = "gwas_catalog.tsv"
bronze_path = os.path.join("data", "bronze")
os.makedirs(bronze_path, exist_ok=True)
local_filepath = os.path.join(bronze_path, filename)

def download_file(url, local_filepath):
    if os.path.exists(local_filepath):
        print(f"File '{local_filepath}' already exists. Skipping download.")
        return
    print(f"Downloading {url} to {local_filepath}...")
    try:
        response = requests.get(url, stream=True)
        response.raise_for_status()
        with open(local_filepath, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        print("Download successful!")
    except requests.exceptions.RequestException as e:
        print(f"Error during download: {e}")

if __name__ == "__main__":
    download_file(url, local_filepath)

\`\`\`
Step 2: Silver Layer - Data Processing & Cleaning
Here, we take the raw data, clean it, and structure it into a more usable format (Parquet).

scripts/silver_process.py
\`\`\`python
import pandas as pd
import os
import pyarrow as pa
import pyarrow.parquet as pq

input_dir = os.path.join("data", "bronze")
output_dir = os.path.join("data", "silver")
os.makedirs(output_dir, exist_ok=True)
input_file = os.path.join(input_dir, "gwas_catalog.tsv")
output_file = os.path.join(output_dir, "gwas_catalog_clean.parquet")

def process_gwas_data():
    print("Reading raw data from the Bronze layer...")
    try:
        gwas_df = pd.read_csv(input_file, sep='\\t')
    except FileNotFoundError:
        print(f"Error: Raw data file not found at {input_file}. Please ensure the file is in the 'data/bronze' directory.")
        return
    print("Cleaning and structuring the data...")
    cleaned_df = gwas_df[[
        'DATE ADDED TO CATALOG', 'JOURNAL', 'DISEASE/TRAIT', 'MAPPED_TRAIT',
        'SNPS', 'P-VALUE', 'OR or BETA'
    ]].copy()
    cleaned_df['DATE ADDED TO CATALOG'] = pd.to_datetime(cleaned_df['DATE ADDED TO CATALOG'])
    cleaned_df.rename(columns={
        'DATE ADDED TO CATALOG': 'date_added', 'JOURNAL': 'journal',
        'DISEASE/TRAIT': 'disease', 'MAPPED_TRAIT': 'mapped_trait',
        'SNPS': 'snps', 'P-VALUE': 'p_value', 'OR or BETA': 'or_or_beta'
    }, inplace=True)
    arrow_table = pa.Table.from_pandas(cleaned_df)
    print(f"Writing structured data to the Silver layer at {output_file}...")
    pq.write_table(arrow_table, output_file)
    print("Silver layer processing complete!")

if __name__ == "__main__":
    process_gwas_data()

\`\`\`
Step 3: Gold Layer - Aggregation & Analysis
This is the final stage where we aggregate the clean data into a business-ready format and prepare it for analysis or visualization.

scripts/gold_transform.py   

\`\`\`python
import pandas as pd
import os
import pyarrow as pa
import pyarrow.parquet as pq

silver_dir = os.path.join("data", "silver")
gold_dir = os.path.join("data", "gold")
os.makedirs(gold_dir, exist_ok=True)
input_file = os.path.join(silver_dir, "gwas_catalog_clean.parquet")
output_journal_file = os.path.join(gold_dir, "journal_study_counts.parquet")
output_disease_file = os.path.join(gold_dir, "disease_study_counts.parquet")

def aggregate_gwas_data():
    print("Reading data from the Silver layer...")
    try:
        clean_df = pd.read_parquet(input_file)
    except FileNotFoundError:
        print(f"Error: Silver layer file not found at {input_file}. Please run the silver_process.py script first.")
        return
    print("Aggregating study counts by journal...")
    journal_counts_df = clean_df.groupby('journal').size().reset_index(name='study_count')
    journal_counts_df.sort_values(by='study_count', ascending=False, inplace=True)
    journal_table = pa.Table.from_pandas(journal_counts_df)
    pq.write_table(journal_table, output_journal_file)
    print(f"Saved journal study counts to {output_journal_file}")
    print("Aggregating study counts by disease/trait...")
    disease_counts_df = clean_df.groupby('mapped_trait').size().reset_index(name='study_count')
    disease_counts_df.sort_values(by='study_count', ascending=False, inplace=True)
    disease_table = pa.Table.from_pandas(disease_counts_df)
    pq.write_table(disease_table, output_disease_file)
    print(f"Saved disease study counts to {output_disease_file}")
    print("\\nGold layer processing complete! Final data is ready for analysis.")

if __name__ == "__main__":
    aggregate_gwas_data()
\`\`\`

Step 4: Final Analysis & Visualization
Finally, you can use the Gold layer data to create charts for your blog post.

scripts/analyze_gold_data.py
\`\`\`python
import pandas as pd
import os
import matplotlib.pyplot as plt

gold_dir = os.path.join("data", "gold")
input_file = os.path.join(gold_dir, "disease_study_counts.parquet")

def analyze_and_visualize():
    try:
        gold_df = pd.read_parquet(input_file)
        top_results = gold_df.head(10)
        print("\\nTop 10 most studied diseases/traits:")
        print(top_results.to_string(index=False))

        top_results.plot(kind='bar', x='mapped_trait', y='study_count', legend=False)
        plt.title('Top 10 Most Studied Diseases/Traits')
        plt.xlabel('Disease/Trait')
        plt.ylabel('Study Count')
        plt.tight_layout()
        plt.show()

    except FileNotFoundError:
        print(f"Error: Gold layer file not found at {input_file}. Please run the gold_transform.py script first.")
        return

if __name__ == "__main__":
    analyze_and_visualize()
\`\`\``, "src/content/blog/2025-09-29-From-Raw-to-Polished.mdx", "ed17a26566c38aa1", "2025-09-29-From-Raw-to-Polished.mdx", true, "2025-10-20-getting--70x-data-processing-speed-with-gpu-vs-cpu", { id: 677, data: 679, body: 688, filePath: 689, digest: 690, rendered: 691, legacyId: 718 }, { title: 680, description: 681, pubDate: 682, tags: 683 }, "Getting 70x Data Processing Speed with GPU vs CPU: A Performance Deep Dive", "Discover how switching from CPU to GPU processing can dramatically accelerate your data workflows, with real-world benchmarks and implementation strategies.", ["Date", "2025-10-21T00:00:00.000Z"], [684, 685, 595, 686, 200, 687], "Data Science", "GPU Computing", "CUDA", "Machine Learning", "I began to run some of my own tests after seeing some incredible performance figures from NVIDIA's open-source data processing efforts using tools like RAPIDS and cuDF, which you can explore further here: [NVIDIA RAPIDS Open Source for Data Processing](https://rapids.ai/). It occurred to me that while my existing data pipelines complete within the expected time frame, maybe I wasn't getting all performance I could be from utilizing the cpu.  I needed a true baseline to understand the limits of my existing hardware before pursuing specialized solutions. I should point out that the existing benchmark testing in the RAPIDS documentation it great, I recommend checking them out.  But anytime you can test code that is closer to what you are acutally running in production, the more likely you are to have gains that match the excpected results.\n\n**The complete code and benchmarks from this analysis are available in my [GitHub repository: gpu_rapids_demo](https://github.com/TJAdryan/gpu_rapids_demo).** I hope it helps people get started with their own GPU acceleration experiments, though there are many other excellent resources and tutorials available on this topic as well.\n\n\n## The Optimized CPU Baseline: Leveraging Multi-Threading\n\nTo establish a competitive baseline, I benchmarked a core Extract, Transform, Load (ETL) workflow—complex string searches and multi-key aggregations—on a multi-million row CMS Open Payments Dataset. The test environment utilized a powerful modern processor: the **12th Gen Intel Core i9-12900K**.\n\nMy initial test of the core ETL workflow resulted in a **2.79-second execution time**. This impressive speed was achieved because the Python libraries, specifically Pandas' C/C++ backends, automatically utilized multi-threading for I/O and vectorized operations. Based on rough estimates, running the initial CSV read without any multi-threading optimization would have taken over 20 seconds. By simply leveraging the optimized backends of Pandas, we gained a more than **5x speedup** on the CPU before ever touching the GPU. This established a robust, highly optimized multi-threaded baseline against which the GPU would have to compete.\n\n## The GPU Challenge: Understanding Architectural Prerequisites\n\nInitially, the GPU appeared slower than this optimized CPU time, leading to early disappointment: I was not seeing the expected gains. Taking a step back it was me who needed to change. The initial code was built on a CPU-centric architecture, and the GPU was not failing; it was being tested to the wrong standard.\n\nThe seemingly poor GPU performance was caused by two major bottlenecks that were inadvertently included in the timer:\n\n1. **Memory Copy Latency**: The slow process of copying the large dataset from system RAM to the GPU's Video RAM (VRAM)\n2. **JIT Compilation Tax**: The time spent on Just-In-Time (JIT) compilation of the GPU kernels on the first run\n\nBy correcting these code prerequisites—namely, pre-copying the data to VRAM outside the timer and adding a \"warm-up\" run to handle the JIT compilation tax—the GPU's true parallel execution speed was revealed.\n\n### Performance Results\n\n| Hardware | Execution Time | Speedup |\n|----------|----------------|---------|\n| Intel i9-12900K (Optimized CPU) | 2.79 seconds | Baseline |\n| GPU (cuDF) | 0.039 seconds | **71.70x faster** |\n\nThe **71.70x improvement** confirms a key finding: for heavy, highly vectorizable processing jobs where time is a factor, a GPU provides a dramatic, justified advantage that no amount of CPU optimization can achieve.\n\n## Making the Right Architectural Choice: CPU vs. GPU\n\nThis experience underscores a fundamental rule: the solution is always a right-tool, right-job question. Performance improvement begins with optimization of the existing hardware, and often the answer isn't immediately obvious without testing.\n\nThe CPU, with its fewer but faster cores, excels at sequential operations, branching logic, and file I/O. Before seeking specialized hardware, you should always ensure you're taking advantage of multi-threading for appropriate tasks, as demonstrated by the 5x speedup gained with Pandas alone. Techniques like **lazy evaluation** and **data chunking** remain invaluable strategies for initial data exploration, memory conservation, and building robust job pipelines. Sometimes chunking your data and processing it in smaller batches can give you the performance you need without any hardware changes.\n\nThe GPU, with its thousands of smaller, specialized cores, is the architecture for massive parallelism. For workloads that are highly vectorizable—like complex aggregation, string matching, or matrix multiplication—the CPU's 16 cores are simply the wrong architecture. The GPU's massive parallelism is built for production-level throughput. The 71x improvement achieved here far surpasses any incremental gain possible through further CPU-only optimization.\n\nFor mixed workloads, the CPU can orchestrate while the GPU processes. When data volume inevitably exceeds the VRAM of a single card, the solution is not more CPU threads, but vertical scaling with multiple GPUs orchestrated via frameworks like Dask-cuDF.\n\n**The key is to test your specific workload.** Start with chunking and lazy evaluation on your existing hardware. If that's not enough, try optimizing your data structures and algorithms. Only when you've exhausted those options should you consider GPU acceleration. But when you do need that level of parallelism, the performance gains can be transformational.\n\n## Getting Started with GPU Acceleration\n\nIf you've determined that GPU acceleration is right for your workload, the GPU acceleration used in this benchmark comes from NVIDIA's RAPIDS suite of open-source libraries. RAPIDS includes cuDF (GPU DataFrames), cuML (GPU Machine Learning), cuGraph (GPU Graph Analytics), and Dask-cuDF for multi-GPU scaling.\n\nThe CUDA Toolkit, available free at [developer.nvidia.com/cuda-toolkit](https://developer.nvidia.com/cuda-toolkit), provides the foundation for all GPU computing. For those interested in writing custom GPU kernels without deep CUDA knowledge, [Triton](https://triton-lang.org/) is an open-source language that makes GPU programming accessible to Python developers.\n\nYou can install the suite via conda (recommended) or pip:\n\n```bash\n# Using conda (recommended)\nconda create -n rapids-env -c rapidsai -c conda-forge rapids=24.10 python=3.11 cudatoolkit=12.0\n\n# OR using pip\npip install cudf-cu12 dask-cudf-cu12 cuml-cu12\n```", "src/content/blog/2025-10-20-Getting -70x-Data-Processing-Speed-with-GPU-vs-CPU.md", "6d0d2b14c3462e65", { html: 692, metadata: 693 }, '<p>I began to run some of my own tests after seeing some incredible performance figures from NVIDIA’s open-source data processing efforts using tools like RAPIDS and cuDF, which you can explore further here: <a href="https://rapids.ai/">NVIDIA RAPIDS Open Source for Data Processing</a>. It occurred to me that while my existing data pipelines complete within the expected time frame, maybe I wasn’t getting all performance I could be from utilizing the cpu.  I needed a true baseline to understand the limits of my existing hardware before pursuing specialized solutions. I should point out that the existing benchmark testing in the RAPIDS documentation it great, I recommend checking them out.  But anytime you can test code that is closer to what you are acutally running in production, the more likely you are to have gains that match the excpected results.</p>\n<p><strong>The complete code and benchmarks from this analysis are available in my <a href="https://github.com/TJAdryan/gpu_rapids_demo">GitHub repository: gpu_rapids_demo</a>.</strong> I hope it helps people get started with their own GPU acceleration experiments, though there are many other excellent resources and tutorials available on this topic as well.</p>\n<h2 id="the-optimized-cpu-baseline-leveraging-multi-threading">The Optimized CPU Baseline: Leveraging Multi-Threading</h2>\n<p>To establish a competitive baseline, I benchmarked a core Extract, Transform, Load (ETL) workflow—complex string searches and multi-key aggregations—on a multi-million row CMS Open Payments Dataset. The test environment utilized a powerful modern processor: the <strong>12th Gen Intel Core i9-12900K</strong>.</p>\n<p>My initial test of the core ETL workflow resulted in a <strong>2.79-second execution time</strong>. This impressive speed was achieved because the Python libraries, specifically Pandas’ C/C++ backends, automatically utilized multi-threading for I/O and vectorized operations. Based on rough estimates, running the initial CSV read without any multi-threading optimization would have taken over 20 seconds. By simply leveraging the optimized backends of Pandas, we gained a more than <strong>5x speedup</strong> on the CPU before ever touching the GPU. This established a robust, highly optimized multi-threaded baseline against which the GPU would have to compete.</p>\n<h2 id="the-gpu-challenge-understanding-architectural-prerequisites">The GPU Challenge: Understanding Architectural Prerequisites</h2>\n<p>Initially, the GPU appeared slower than this optimized CPU time, leading to early disappointment: I was not seeing the expected gains. Taking a step back it was me who needed to change. The initial code was built on a CPU-centric architecture, and the GPU was not failing; it was being tested to the wrong standard.</p>\n<p>The seemingly poor GPU performance was caused by two major bottlenecks that were inadvertently included in the timer:</p>\n<ol>\n<li><strong>Memory Copy Latency</strong>: The slow process of copying the large dataset from system RAM to the GPU’s Video RAM (VRAM)</li>\n<li><strong>JIT Compilation Tax</strong>: The time spent on Just-In-Time (JIT) compilation of the GPU kernels on the first run</li>\n</ol>\n<p>By correcting these code prerequisites—namely, pre-copying the data to VRAM outside the timer and adding a “warm-up” run to handle the JIT compilation tax—the GPU’s true parallel execution speed was revealed.</p>\n<h3 id="performance-results">Performance Results</h3>\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n<table><thead><tr><th>Hardware</th><th>Execution Time</th><th>Speedup</th></tr></thead><tbody><tr><td>Intel i9-12900K (Optimized CPU)</td><td>2.79 seconds</td><td>Baseline</td></tr><tr><td>GPU (cuDF)</td><td>0.039 seconds</td><td><strong>71.70x faster</strong></td></tr></tbody></table>\n<p>The <strong>71.70x improvement</strong> confirms a key finding: for heavy, highly vectorizable processing jobs where time is a factor, a GPU provides a dramatic, justified advantage that no amount of CPU optimization can achieve.</p>\n<h2 id="making-the-right-architectural-choice-cpu-vs-gpu">Making the Right Architectural Choice: CPU vs. GPU</h2>\n<p>This experience underscores a fundamental rule: the solution is always a right-tool, right-job question. Performance improvement begins with optimization of the existing hardware, and often the answer isn’t immediately obvious without testing.</p>\n<p>The CPU, with its fewer but faster cores, excels at sequential operations, branching logic, and file I/O. Before seeking specialized hardware, you should always ensure you’re taking advantage of multi-threading for appropriate tasks, as demonstrated by the 5x speedup gained with Pandas alone. Techniques like <strong>lazy evaluation</strong> and <strong>data chunking</strong> remain invaluable strategies for initial data exploration, memory conservation, and building robust job pipelines. Sometimes chunking your data and processing it in smaller batches can give you the performance you need without any hardware changes.</p>\n<p>The GPU, with its thousands of smaller, specialized cores, is the architecture for massive parallelism. For workloads that are highly vectorizable—like complex aggregation, string matching, or matrix multiplication—the CPU’s 16 cores are simply the wrong architecture. The GPU’s massive parallelism is built for production-level throughput. The 71x improvement achieved here far surpasses any incremental gain possible through further CPU-only optimization.</p>\n<p>For mixed workloads, the CPU can orchestrate while the GPU processes. When data volume inevitably exceeds the VRAM of a single card, the solution is not more CPU threads, but vertical scaling with multiple GPUs orchestrated via frameworks like Dask-cuDF.</p>\n<p><strong>The key is to test your specific workload.</strong> Start with chunking and lazy evaluation on your existing hardware. If that’s not enough, try optimizing your data structures and algorithms. Only when you’ve exhausted those options should you consider GPU acceleration. But when you do need that level of parallelism, the performance gains can be transformational.</p>\n<h2 id="getting-started-with-gpu-acceleration">Getting Started with GPU Acceleration</h2>\n<p>If you’ve determined that GPU acceleration is right for your workload, the GPU acceleration used in this benchmark comes from NVIDIA’s RAPIDS suite of open-source libraries. RAPIDS includes cuDF (GPU DataFrames), cuML (GPU Machine Learning), cuGraph (GPU Graph Analytics), and Dask-cuDF for multi-GPU scaling.</p>\n<p>The CUDA Toolkit, available free at <a href="https://developer.nvidia.com/cuda-toolkit">developer.nvidia.com/cuda-toolkit</a>, provides the foundation for all GPU computing. For those interested in writing custom GPU kernels without deep CUDA knowledge, <a href="https://triton-lang.org/">Triton</a> is an open-source language that makes GPU programming accessible to Python developers.</p>\n<p>You can install the suite via conda (recommended) or pip:</p>\n<pre class="astro-code github-dark" style="background-color:#24292e;color:#e1e4e8; overflow-x: auto;" tabindex="0" data-language="bash"><code><span class="line"><span style="color:#6A737D"># Using conda (recommended)</span></span>\n<span class="line"><span style="color:#B392F0">conda</span><span style="color:#9ECBFF"> create</span><span style="color:#79B8FF"> -n</span><span style="color:#9ECBFF"> rapids-env</span><span style="color:#79B8FF"> -c</span><span style="color:#9ECBFF"> rapidsai</span><span style="color:#79B8FF"> -c</span><span style="color:#9ECBFF"> conda-forge</span><span style="color:#9ECBFF"> rapids=</span><span style="color:#79B8FF">24.10</span><span style="color:#9ECBFF"> python=</span><span style="color:#79B8FF">3.11</span><span style="color:#9ECBFF"> cudatoolkit=</span><span style="color:#79B8FF">12.0</span></span>\n<span class="line"></span>\n<span class="line"><span style="color:#6A737D"># OR using pip</span></span>\n<span class="line"><span style="color:#B392F0">pip</span><span style="color:#9ECBFF"> install</span><span style="color:#9ECBFF"> cudf-cu12</span><span style="color:#9ECBFF"> dask-cudf-cu12</span><span style="color:#9ECBFF"> cuml-cu12</span></span></code></pre>', { headings: 694, localImagePaths: 710, remoteImagePaths: 711, frontmatter: 712, imagePaths: 717 }, [695, 698, 701, 704, 707], { depth: 53, slug: 696, text: 697 }, "the-optimized-cpu-baseline-leveraging-multi-threading", "The Optimized CPU Baseline: Leveraging Multi-Threading", { depth: 53, slug: 699, text: 700 }, "the-gpu-challenge-understanding-architectural-prerequisites", "The GPU Challenge: Understanding Architectural Prerequisites", { depth: 37, slug: 702, text: 703 }, "performance-results", "Performance Results", { depth: 53, slug: 705, text: 706 }, "making-the-right-architectural-choice-cpu-vs-gpu", "Making the Right Architectural Choice: CPU vs. GPU", { depth: 53, slug: 708, text: 709 }, "getting-started-with-gpu-acceleration", "Getting Started with GPU Acceleration", [], [], { title: 680, description: 681, pubDate: 713, tags: 714, image: 715, draft: 716 }, ["Date", "2025-10-21T00:00:00.000Z"], [684, 685, 595, 686, 200, 687], "/images/gpu-vs-cpu-performance.png", false, [], "2025-10-20-Getting -70x-Data-Processing-Speed-with-GPU-vs-CPU.md", "2025-09-14-an-imperfect-model-for-an-imperfect-market", { id: 719, data: 721, body: 727, filePath: 728, digest: 729, rendered: 730, legacyId: 761 }, { title: 722, description: 723, pubDate: 724, tags: 725 }, "An Imperfect Model for an Imperfect Market", "A simulation-based exploration of how market forces affect housing utility and affordability.", ["Date", "2025-09-14T00:00:00.000Z"], [726], "housing-simulation", "*Want to try the simulation? [Try it here](https://nextvaldata.com/blog/interactive-housing-simulation/). Instructions for downloading and running locally are provided below.*\n\n> **Homeownership: A Shifting Foundation**  \n> For generations, homeownership has been a cornerstone of the American narrative—a key marker of financial stability and a primary vehicle for building wealth. The 2008 financial crisis, however, fundamentally reshaped this landscape, and its aftershocks continue to define the market today.\n\n---\n\n### The Post-2008 Housing Landscape\n\nTo understand the modern housing market, it's crucial to look at the data. According to the U.S. Census Bureau, the national homeownership rate ([see the data on FRED](https://fred.stlouisfed.org/series/RHORUSQ156N)) was **67.8%** in the first quarter of 2008. In the aftermath of the crisis, it entered a prolonged decline, hitting a generational low of **62.9%** in 2016. While the rate has since recovered to roughly **66%** as of mid-2025, it highlights a market that is fundamentally more complex than it was a generation ago.\n\nThis new environment is shaped by a series of rational, yet often competing, economic forces:\n\n- For an existing homeowner, rising property values feel like a clear financial win.\n- For a seller, accepting the highest bid is the logical outcome of an efficient market.\n- For an institutional investor or local landlord, purchasing properties to meet rental demand is a sound business decision based on established metrics.\n\nNone of these actions are inherently disruptive. Yet, when aggregated, they can produce collective outcomes that are challenging for the community as a whole, particularly for first-time buyers. A home's soaring market price may increase the paper wealth of its owner, but its fundamental utility—as a place to live—remains unchanged. This growing gap between an asset's market price and its practical value is a defining feature of the post-2008 economy.\n\n---\n\n### Modeling the Market\n\nHow do these individual, logical decisions create complex feedback loops that drive up prices and impact affordability? To explore this question and visualize how these forces interact, I developed a simulation that models the behavior of different actors within a simplified housing market.\n\n---\n\n> **Try It Yourself: Interactive Housing Simulation**  \n> [Interactive Housing Simulation](https://github.com/TJAdryan/astro_blog/blob/main/src/components/HousingSim/HousingSimulation.jsx)\n\n> **Simulation Parameters:**  \n> The weights and constants used in the simulation are available in  \n> [`housing_weights.json`](https://github.com/TJAdryan/astro_blog/blob/main/src/components/HousingSim/housing_weights.json)\n\n---\n\n#### **Download & Run the Simulation Locally**\n\n**Requirements:**  \n- [Node.js](https://nodejs.org/) and npm\n\n**Setup Instructions:**\n1. Download the code above or clone the repository:\n   ```bash\n   git clone https://github.com/TJAdryan/astro_blog.git\n   cd astro_blog\n   ```\n2. Install dependencies:\n   ```bash\n   npm install\n   ```\n3. Start the development server:\n   ```bash\n   npm run dev\n   ```\n4. Open your browser to the local address shown in the terminal (usually http://localhost:3000).\n\n> You only need the code in `src/components/HousingSim/HousingSimulation.jsx` to experiment with the simulation logic, but running the full project gives you the interactive UI.\n\n---\n\n### The Widening Gaps: From Credentials to Housing\n\nAs much as I tried to make this an impartial look at a simplified version of today's housing market, I have opinions and probably some biases. It’s a symptom of a larger economic reality defined by two powerful trends: the rising bar for entry and the shifting psychological rewards for clearing it.\n\n**1. Credential Inflation**  \nMore jobs now require a bachelor's degree, even when the work hasn't become more complex. Research from Harvard Business School, such as the [\"Dismissed by Degrees\" report](https://www.hbs.edu/managing-the-future-of-work/Documents/dismissed-by-degrees.pdf), shows that this often functions as a screening tool in a crowded labor market, rather than a true measure of skill, creating costly barriers for individuals without improving performance.\n\n**2. The Psychology of Inequality**  \nFor years, the prevailing wisdom came from a 2010 study by Daniel Kahneman and Angus Deaton ([see the original PNAS study](https://www.pnas.org/doi/10.1073/pnas.1011492107)). They found that while life satisfaction continued to rise with income, day-to-day emotional well-being tended to plateau at around $75,000 per year.\n\nHowever, a more recent 2023 study by Kahneman and Matthew Killingsworth refined this view, finding that for most people, happiness does continue to rise with income ([see the study in PNAS](https://www.pnas.org/doi/10.1073/pnas.2208661120)). The critical context is inequality. The Relative Income Hypothesis suggests our happiness is deeply tied to our economic standing relative to others. In a society with vast wealth gaps, each additional dollar has a higher \"happiness utility\" because it buys insulation from precarity and a greater sense of status and security.\n\n---\n\n\n### The Appreciation Trap\n\nHome prices rise, creating \"paper wealth\" for owners, but this increase does not improve a home's utility as shelter. Owners often oppose development that could make housing more affordable, seeking to protect their appreciation. Meanwhile, investors with a cash advantage win bidding wars, efficiently turning homes into vehicles for rental income rather than family shelter. The conversion of homes to short-term rentals further maximizes financial returns but reduces the supply of long-term housing, increasing scarcity and raising costs for the broader community.\n\n---\n\n#### The Dashboard of the Divide\n\nThe simulation's dashboard reveals the measurable outcomes of these dynamics:\n\n- **Median Homeowner Income** (the asset owners) pulls away from\n- **Median Seeker Income** (those seeking the utility of shelter)\n- **Median Rent Burden** shows the direct cost of renting a home's utility when you cannot afford to buy the asset itself\n\nIt is the real-time measurement of the market decoupling from the community it's meant to serve.\n\n---\n\n\n#### Realigning Price and Purpose\n\nThis model, I hope, doesn't have a conclusion. I built it to help as tool to broaden my understanding.  If it fails to that for you, I regret that.   That is why I included the code. I would love to see other people's models.  I think at the very least this is a good place for anyone trying to better understand how markets work.  \n\nBut this is just one interpretation—an imperfect model for an imperfect market. If you find flaws in my logic, I would love to hear them. I know I have bias, as much as I like to see myself as logical and clear minded, I am well aware I am often wrong before I am right.  I also welcome idealogical criticism, should you be intersted in providing it.\n\n\nBest,\nDominick", "src/content/blog/2025-09-14-An-Imperfect-Model-for-an-Imperfect-Market.md", "32841296d065d24a", { html: 731, metadata: 732 }, '<p><em>Want to try the simulation? <a href="https://nextvaldata.com/blog/interactive-housing-simulation/">Try it here</a>. Instructions for downloading and running locally are provided below.</em></p>\n<blockquote>\n<p><strong>Homeownership: A Shifting Foundation</strong><br>\nFor generations, homeownership has been a cornerstone of the American narrative—a key marker of financial stability and a primary vehicle for building wealth. The 2008 financial crisis, however, fundamentally reshaped this landscape, and its aftershocks continue to define the market today.</p>\n</blockquote>\n<hr>\n<h3 id="the-post-2008-housing-landscape">The Post-2008 Housing Landscape</h3>\n<p>To understand the modern housing market, it’s crucial to look at the data. According to the U.S. Census Bureau, the national homeownership rate (<a href="https://fred.stlouisfed.org/series/RHORUSQ156N">see the data on FRED</a>) was <strong>67.8%</strong> in the first quarter of 2008. In the aftermath of the crisis, it entered a prolonged decline, hitting a generational low of <strong>62.9%</strong> in 2016. While the rate has since recovered to roughly <strong>66%</strong> as of mid-2025, it highlights a market that is fundamentally more complex than it was a generation ago.</p>\n<p>This new environment is shaped by a series of rational, yet often competing, economic forces:</p>\n<ul>\n<li>For an existing homeowner, rising property values feel like a clear financial win.</li>\n<li>For a seller, accepting the highest bid is the logical outcome of an efficient market.</li>\n<li>For an institutional investor or local landlord, purchasing properties to meet rental demand is a sound business decision based on established metrics.</li>\n</ul>\n<p>None of these actions are inherently disruptive. Yet, when aggregated, they can produce collective outcomes that are challenging for the community as a whole, particularly for first-time buyers. A home’s soaring market price may increase the paper wealth of its owner, but its fundamental utility—as a place to live—remains unchanged. This growing gap between an asset’s market price and its practical value is a defining feature of the post-2008 economy.</p>\n<hr>\n<h3 id="modeling-the-market">Modeling the Market</h3>\n<p>How do these individual, logical decisions create complex feedback loops that drive up prices and impact affordability? To explore this question and visualize how these forces interact, I developed a simulation that models the behavior of different actors within a simplified housing market.</p>\n<hr>\n<blockquote>\n<p><strong>Try It Yourself: Interactive Housing Simulation</strong><br>\n<a href="https://github.com/TJAdryan/astro_blog/blob/main/src/components/HousingSim/HousingSimulation.jsx">Interactive Housing Simulation</a></p>\n</blockquote>\n<blockquote>\n<p><strong>Simulation Parameters:</strong><br>\nThe weights and constants used in the simulation are available in<br>\n<a href="https://github.com/TJAdryan/astro_blog/blob/main/src/components/HousingSim/housing_weights.json"><code>housing_weights.json</code></a></p>\n</blockquote>\n<hr>\n<h4 id="download--run-the-simulation-locally"><strong>Download &#x26; Run the Simulation Locally</strong></h4>\n<p><strong>Requirements:</strong></p>\n<ul>\n<li><a href="https://nodejs.org/">Node.js</a> and npm</li>\n</ul>\n<p><strong>Setup Instructions:</strong></p>\n<ol>\n<li>Download the code above or clone the repository:\n<pre class="astro-code github-dark" style="background-color:#24292e;color:#e1e4e8; overflow-x: auto;" tabindex="0" data-language="bash"><code><span class="line"><span style="color:#B392F0">git</span><span style="color:#9ECBFF"> clone</span><span style="color:#9ECBFF"> https://github.com/TJAdryan/astro_blog.git</span></span>\n<span class="line"><span style="color:#79B8FF">cd</span><span style="color:#9ECBFF"> astro_blog</span></span></code></pre>\n</li>\n<li>Install dependencies:\n<pre class="astro-code github-dark" style="background-color:#24292e;color:#e1e4e8; overflow-x: auto;" tabindex="0" data-language="bash"><code><span class="line"><span style="color:#B392F0">npm</span><span style="color:#9ECBFF"> install</span></span></code></pre>\n</li>\n<li>Start the development server:\n<pre class="astro-code github-dark" style="background-color:#24292e;color:#e1e4e8; overflow-x: auto;" tabindex="0" data-language="bash"><code><span class="line"><span style="color:#B392F0">npm</span><span style="color:#9ECBFF"> run</span><span style="color:#9ECBFF"> dev</span></span></code></pre>\n</li>\n<li>Open your browser to the local address shown in the terminal (usually <a href="http://localhost:3000">http://localhost:3000</a>).</li>\n</ol>\n<blockquote>\n<p>You only need the code in <code>src/components/HousingSim/HousingSimulation.jsx</code> to experiment with the simulation logic, but running the full project gives you the interactive UI.</p>\n</blockquote>\n<hr>\n<h3 id="the-widening-gaps-from-credentials-to-housing">The Widening Gaps: From Credentials to Housing</h3>\n<p>As much as I tried to make this an impartial look at a simplified version of today’s housing market, I have opinions and probably some biases. It’s a symptom of a larger economic reality defined by two powerful trends: the rising bar for entry and the shifting psychological rewards for clearing it.</p>\n<p><strong>1. Credential Inflation</strong><br>\nMore jobs now require a bachelor’s degree, even when the work hasn’t become more complex. Research from Harvard Business School, such as the <a href="https://www.hbs.edu/managing-the-future-of-work/Documents/dismissed-by-degrees.pdf">“Dismissed by Degrees” report</a>, shows that this often functions as a screening tool in a crowded labor market, rather than a true measure of skill, creating costly barriers for individuals without improving performance.</p>\n<p><strong>2. The Psychology of Inequality</strong><br>\nFor years, the prevailing wisdom came from a 2010 study by Daniel Kahneman and Angus Deaton (<a href="https://www.pnas.org/doi/10.1073/pnas.1011492107">see the original PNAS study</a>). They found that while life satisfaction continued to rise with income, day-to-day emotional well-being tended to plateau at around $75,000 per year.</p>\n<p>However, a more recent 2023 study by Kahneman and Matthew Killingsworth refined this view, finding that for most people, happiness does continue to rise with income (<a href="https://www.pnas.org/doi/10.1073/pnas.2208661120">see the study in PNAS</a>). The critical context is inequality. The Relative Income Hypothesis suggests our happiness is deeply tied to our economic standing relative to others. In a society with vast wealth gaps, each additional dollar has a higher “happiness utility” because it buys insulation from precarity and a greater sense of status and security.</p>\n<hr>\n<h3 id="the-appreciation-trap">The Appreciation Trap</h3>\n<p>Home prices rise, creating “paper wealth” for owners, but this increase does not improve a home’s utility as shelter. Owners often oppose development that could make housing more affordable, seeking to protect their appreciation. Meanwhile, investors with a cash advantage win bidding wars, efficiently turning homes into vehicles for rental income rather than family shelter. The conversion of homes to short-term rentals further maximizes financial returns but reduces the supply of long-term housing, increasing scarcity and raising costs for the broader community.</p>\n<hr>\n<h4 id="the-dashboard-of-the-divide">The Dashboard of the Divide</h4>\n<p>The simulation’s dashboard reveals the measurable outcomes of these dynamics:</p>\n<ul>\n<li><strong>Median Homeowner Income</strong> (the asset owners) pulls away from</li>\n<li><strong>Median Seeker Income</strong> (those seeking the utility of shelter)</li>\n<li><strong>Median Rent Burden</strong> shows the direct cost of renting a home’s utility when you cannot afford to buy the asset itself</li>\n</ul>\n<p>It is the real-time measurement of the market decoupling from the community it’s meant to serve.</p>\n<hr>\n<h4 id="realigning-price-and-purpose">Realigning Price and Purpose</h4>\n<p>This model, I hope, doesn’t have a conclusion. I built it to help as tool to broaden my understanding.  If it fails to that for you, I regret that.   That is why I included the code. I would love to see other people’s models.  I think at the very least this is a good place for anyone trying to better understand how markets work.</p>\n<p>But this is just one interpretation—an imperfect model for an imperfect market. If you find flaws in my logic, I would love to hear them. I know I have bias, as much as I like to see myself as logical and clear minded, I am well aware I am often wrong before I am right.  I also welcome idealogical criticism, should you be intersted in providing it.</p>\n<p>Best,\nDominick</p>', { headings: 733, localImagePaths: 755, remoteImagePaths: 756, frontmatter: 757, imagePaths: 760 }, [734, 737, 740, 743, 746, 749, 752], { depth: 37, slug: 735, text: 736 }, "the-post-2008-housing-landscape", "The Post-2008 Housing Landscape", { depth: 37, slug: 738, text: 739 }, "modeling-the-market", "Modeling the Market", { depth: 438, slug: 741, text: 742 }, "download--run-the-simulation-locally", "Download & Run the Simulation Locally", { depth: 37, slug: 744, text: 745 }, "the-widening-gaps-from-credentials-to-housing", "The Widening Gaps: From Credentials to Housing", { depth: 37, slug: 747, text: 748 }, "the-appreciation-trap", "The Appreciation Trap", { depth: 438, slug: 750, text: 751 }, "the-dashboard-of-the-divide", "The Dashboard of the Divide", { depth: 438, slug: 753, text: 754 }, "realigning-price-and-purpose", "Realigning Price and Purpose", [], [], { title: 722, description: 723, pubDate: 758, tags: 759 }, "2025-09-14", [726], [], "2025-09-14-An-Imperfect-Model-for-an-Imperfect-Market.md", "2025-11-19-get-your-rows-in-duck", { id: 762, data: 764, body: 774, filePath: 775, digest: 776, rendered: 777, legacyId: 803 }, { title: 765, description: 766, pubDate: 767, tags: 768, categories: 772 }, "A Pragmatic Look at pg_duckdb 1.0", "Exploring the features and benefits of the pg_duckdb 1.0 extension for PostgreSQL.", ["Date", "2025-11-19T00:00:00.000Z"], [769, 770, 771], "pg_duckdb", "PostgreSQL", "analytics", [24, 773], "Tools", "In September, the pg_duckdb extension reached version 1.0. For teams heavily invested in the PostgreSQL ecosystem, this release offers a specific, practical utility: it allows the DuckDB engine to run within the Postgres process.\n\nAt first, I didn't know what to make of it, not just the release the whole project.  DuckDB and Postgres already can interoperate via FDW and other methods, so what does embedding DuckDB inside Postgres really gain you? I was wildly off, it turns out it can give you a lot of gain.  FDW (Foreign Data Wrappers) lose the columnar advantage instantly, the data needs to get translated into rows to be read.  My newfound understanding of that distinction humbled me, and I began to wonder what else I was missing.\n\nYou can follow along with my tutorial but if you want to learn more you can access the release notes here: [pg_duckdb release notes](https://motherduck.com/blog/pg-duckdb-release/).\n\n### Getting Started: Installing the Extension\n\nAdding pg_duckdb to your PostgreSQL instance is straightforward. The extension is available through standard PostgreSQL package managers and can be installed directly from source.\n\nFor most users, the quickest path is through your system's package manager or by using the precompiled binaries from the official releases. Once installed, enabling it in your database is a simple SQL command:\n\n```sql\nCREATE EXTENSION pg_duckdb;\n```\n\nAfter installation, you can verify it's working by checking the available extensions or running a simple test query with DuckDB's vectorized processing enabled.\n\n### The Core Value: Vectorized Execution in Postgres\n\nPostgreSQL is designed for row-based processing. It is excellent at retrieving single records but inefficient at aggregating millions of rows (e.g., calculating average revenue per user over five years).\n\npg_duckdb addresses this by embedding DuckDB’s vectorized execution engine. When you execute an analytical query, the extension intercepts it and processes the data in batches (vectors) rather than row-by-row.\n\n**The Benefit:** You can run heavy analytical queries on your existing Postgres tables without the performance penalty typically associated with such operations.\n\n**The Constraint:** This shares resources (CPU/RAM) with your operational database. It is best suited for read replicas or non-critical instances, rather than your primary transactional node.\n\n### The Primary Use Case: The \"Zero-ETL\" Join\n\nThe most compelling feature of version 1.0 is the ability to query external object storage (S3, GCS) directly from Postgres and join it with local tables.\n\nIn a traditional stack, if you wanted to join \"current users\" (Postgres) with \"historical logs\" (S3 Parquet), you would need to ETL the user data into a data warehouse. With pg_duckdb, you can treat the S3 bucket as a foreign table. So yay to that.\n\n#### Implementation Example\n\nYou can query a remote Parquet file and join it to a local Postgres table in a single SQL statement.\n\n```sql\n-- Force execution to use the DuckDB engine for performance\nSET duckdb.force_execution = true;\n\nSELECT \n    u.customer_id,\n    u.signup_date,\n    count(h.event_id) as total_historical_events\nFROM postgres_users u\nJOIN read_parquet('s3://archive-bucket/logs/2024/*.parquet') h\n    ON u.customer_id = h.user_id\nWHERE u.status = 'active'\nGROUP BY u.customer_id, u.signup_date;\n\n``` \n\n\n#### When to Use It\n\nThis architecture is effective for specific scenarios:\n\n- **Mid-Sized Analytics:** You have data that is too large for a standard SELECT but not large enough to justify the cost and maintenance of Snowflake or Databricks.\n- **Data Lake Access:** You need to access archived data in S3 occasionally and do not want to maintain a permanent pipeline for it.\n- **Simplification:** You want to reduce the number of tools in your stack.\n\nIf your team is already comfortable managing PostgreSQL, pg_duckdb 1.0 provides a method to extend that infrastructure into the analytical domain with minimal overhead.", "src/content/blog/2025-11-19-Get-Your-Rows-in-Duck.md", "cd6bf0066cd3e8cb", { html: 778, metadata: 779 }, `<p>In September, the pg_duckdb extension reached version 1.0. For teams heavily invested in the PostgreSQL ecosystem, this release offers a specific, practical utility: it allows the DuckDB engine to run within the Postgres process.</p>
<p>At first, I didn’t know what to make of it, not just the release the whole project.  DuckDB and Postgres already can interoperate via FDW and other methods, so what does embedding DuckDB inside Postgres really gain you? I was wildly off, it turns out it can give you a lot of gain.  FDW (Foreign Data Wrappers) lose the columnar advantage instantly, the data needs to get translated into rows to be read.  My newfound understanding of that distinction humbled me, and I began to wonder what else I was missing.</p>
<p>You can follow along with my tutorial but if you want to learn more you can access the release notes here: <a href="https://motherduck.com/blog/pg-duckdb-release/">pg_duckdb release notes</a>.</p>
<h3 id="getting-started-installing-the-extension">Getting Started: Installing the Extension</h3>
<p>Adding pg_duckdb to your PostgreSQL instance is straightforward. The extension is available through standard PostgreSQL package managers and can be installed directly from source.</p>
<p>For most users, the quickest path is through your system’s package manager or by using the precompiled binaries from the official releases. Once installed, enabling it in your database is a simple SQL command:</p>
<pre class="astro-code github-dark" style="background-color:#24292e;color:#e1e4e8; overflow-x: auto;" tabindex="0" data-language="sql"><code><span class="line"><span style="color:#F97583">CREATE</span><span style="color:#E1E4E8"> EXTENSION pg_duckdb;</span></span></code></pre>
<p>After installation, you can verify it’s working by checking the available extensions or running a simple test query with DuckDB’s vectorized processing enabled.</p>
<h3 id="the-core-value-vectorized-execution-in-postgres">The Core Value: Vectorized Execution in Postgres</h3>
<p>PostgreSQL is designed for row-based processing. It is excellent at retrieving single records but inefficient at aggregating millions of rows (e.g., calculating average revenue per user over five years).</p>
<p>pg_duckdb addresses this by embedding DuckDB’s vectorized execution engine. When you execute an analytical query, the extension intercepts it and processes the data in batches (vectors) rather than row-by-row.</p>
<p><strong>The Benefit:</strong> You can run heavy analytical queries on your existing Postgres tables without the performance penalty typically associated with such operations.</p>
<p><strong>The Constraint:</strong> This shares resources (CPU/RAM) with your operational database. It is best suited for read replicas or non-critical instances, rather than your primary transactional node.</p>
<h3 id="the-primary-use-case-the-zero-etl-join">The Primary Use Case: The “Zero-ETL” Join</h3>
<p>The most compelling feature of version 1.0 is the ability to query external object storage (S3, GCS) directly from Postgres and join it with local tables.</p>
<p>In a traditional stack, if you wanted to join “current users” (Postgres) with “historical logs” (S3 Parquet), you would need to ETL the user data into a data warehouse. With pg_duckdb, you can treat the S3 bucket as a foreign table. So yay to that.</p>
<h4 id="implementation-example">Implementation Example</h4>
<p>You can query a remote Parquet file and join it to a local Postgres table in a single SQL statement.</p>
<pre class="astro-code github-dark" style="background-color:#24292e;color:#e1e4e8; overflow-x: auto;" tabindex="0" data-language="sql"><code><span class="line"><span style="color:#6A737D">-- Force execution to use the DuckDB engine for performance</span></span>
<span class="line"><span style="color:#F97583">SET</span><span style="color:#79B8FF"> duckdb</span><span style="color:#E1E4E8">.</span><span style="color:#79B8FF">force_execution</span><span style="color:#F97583"> =</span><span style="color:#E1E4E8"> true;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">SELECT</span><span style="color:#E1E4E8"> </span></span>
<span class="line"><span style="color:#79B8FF">    u</span><span style="color:#E1E4E8">.</span><span style="color:#79B8FF">customer_id</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#79B8FF">    u</span><span style="color:#E1E4E8">.</span><span style="color:#79B8FF">signup_date</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#79B8FF">    count</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">h</span><span style="color:#E1E4E8">.</span><span style="color:#79B8FF">event_id</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">as</span><span style="color:#E1E4E8"> total_historical_events</span></span>
<span class="line"><span style="color:#F97583">FROM</span><span style="color:#E1E4E8"> postgres_users u</span></span>
<span class="line"><span style="color:#F97583">JOIN</span><span style="color:#E1E4E8"> read_parquet(</span><span style="color:#9ECBFF">'s3://archive-bucket/logs/2024/*.parquet'</span><span style="color:#E1E4E8">) h</span></span>
<span class="line"><span style="color:#F97583">    ON</span><span style="color:#79B8FF"> u</span><span style="color:#E1E4E8">.</span><span style="color:#79B8FF">customer_id</span><span style="color:#F97583"> =</span><span style="color:#79B8FF"> h</span><span style="color:#E1E4E8">.</span><span style="color:#79B8FF">user_id</span></span>
<span class="line"><span style="color:#F97583">WHERE</span><span style="color:#79B8FF"> u</span><span style="color:#E1E4E8">.</span><span style="color:#79B8FF">status</span><span style="color:#F97583"> =</span><span style="color:#9ECBFF"> 'active'</span></span>
<span class="line"><span style="color:#F97583">GROUP BY</span><span style="color:#79B8FF"> u</span><span style="color:#E1E4E8">.</span><span style="color:#79B8FF">customer_id</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">u</span><span style="color:#E1E4E8">.</span><span style="color:#79B8FF">signup_date</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span></code></pre>
<h4 id="when-to-use-it">When to Use It</h4>
<p>This architecture is effective for specific scenarios:</p>
<ul>
<li><strong>Mid-Sized Analytics:</strong> You have data that is too large for a standard SELECT but not large enough to justify the cost and maintenance of Snowflake or Databricks.</li>
<li><strong>Data Lake Access:</strong> You need to access archived data in S3 occasionally and do not want to maintain a permanent pipeline for it.</li>
<li><strong>Simplification:</strong> You want to reduce the number of tools in your stack.</li>
</ul>
<p>If your team is already comfortable managing PostgreSQL, pg_duckdb 1.0 provides a method to extend that infrastructure into the analytical domain with minimal overhead.</p>`, { headings: 780, localImagePaths: 796, remoteImagePaths: 797, frontmatter: 798, imagePaths: 802 }, [781, 784, 787, 790, 793], { depth: 37, slug: 782, text: 783 }, "getting-started-installing-the-extension", "Getting Started: Installing the Extension", { depth: 37, slug: 785, text: 786 }, "the-core-value-vectorized-execution-in-postgres", "The Core Value: Vectorized Execution in Postgres", { depth: 37, slug: 788, text: 789 }, "the-primary-use-case-the-zero-etl-join", "The Primary Use Case: The “Zero-ETL” Join", { depth: 438, slug: 791, text: 792 }, "implementation-example", "Implementation Example", { depth: 438, slug: 794, text: 795 }, "when-to-use-it", "When to Use It", [], [], { title: 765, description: 766, pubDate: 799, tags: 800, categories: 801, draft: 716 }, "2025-11-19T00:00:00Z", [769, 770, 771], [24, 773], [], "2025-11-19-Get-Your-Rows-in-Duck.md", "more-about-me", { id: 804, data: 806, body: 814, filePath: 815, digest: 816, rendered: 817, legacyId: 828 }, { title: 807, description: 808, pubDate: 809, tags: 810, categories: 813 }, "More About Dominick", "The trivia, less formal stuff, and personal thoughts from Dominick - why nextvaldata, NYC life, and connecting with fellow data enthusiasts.", ["Date", "2021-08-08T00:00:00.000Z"], [811, 812], "personal", "about", [238], "**The trivia or trivial stuff:**\n\nWhy nextvaldata? The name is from the SQL function `nextval()`, maybe it is a case of just hearing something a lot but I thought it has a nice ring to it and sounds forward thinking.\n\n**Less formal Stuff:**\n\nI started this blog for a couple of reasons. Firstly, I genuinely believe in sharing knowledge, but let's face it, we forget most of what we learn, documenting it won't prevent that but it helps. Secondly, I wanted a space to explore data engineering and related topics with a bit more personality – maybe even *fun*, ~~probably~~ hopefully. Finally, I can't resist a good anecdote, so this will never be 100% technical content.\n\nData is an incredibly broad and complex field, I am sure many of you have had the same experience of realizing there are too many things for one person to know. My goal here isn't just to present dry technical facts but to share the *how* and the *why*, we all want to have perfect projects that perform flawlessly but that isn't true for most of us.\n\n**Other Stuff:**\n\nI love New York City where I work and live and enjoy a bit of everything it has to offer. I have a distrust for automobiles, but when I do drive, I get the appeal. Maybe it is just the metaphor of spending all your time in a box, maybe it was reading [The Power Broker by Robert Caro](https://www.amazon.com/Power-Broker-Robert-Moses-Fall/dp/0394720245) at an impressionable time in my life. To be honest I think cars are a kind of evil. Like many people, my contradictions probably say as much about me as my convictions. I love reading and there are just too many good books and not nearly enough time.\n\n**Hobbies & Interests:**\n\nWhen I'm not buried in data, you'll often find me walking around the city – there's something therapeutic about exploring different neighborhoods and discovering hidden gems. NYC is perfect for this; every walk reveals something new, whether it's a historic building I've never noticed or a great little café tucked away on a side street.\n\nI'm passionate about good food and love trying new restaurants, from hole-in-the-wall spots to places that have been perfecting their craft for decades. There's a real art to finding those places that do one thing exceptionally well, and the city is full of them.\n\nHistory fascinates me, particularly how past decisions continue to shape our present. Whether it's urban planning, technology, or policy, understanding the historical context helps make sense of why things are the way they are. It's probably why I enjoyed *The Power Broker* so much – it's a perfect example of how one person's vision can transform entire cities and regions for generations. Other times I am just thinking about how pretty Sophio is, and the answer is usually \"Very\".\n\n**Tell me stuff:**\n\nI'm always keen to connect with fellow data enthusiasts! Feel free to reach out, I love a good story and I feel like most people have one or more to tell. I appreciate all feedback, I promise to read it all.\n\n\\* Dominick\n\n---\n\n[Back to Professional Info](/about/)", "src/content/blog/more-about-me.md", "f7a090b8d62ad627", { html: 818, metadata: 819 }, '<p><strong>The trivia or trivial stuff:</strong></p>\n<p>Why nextvaldata? The name is from the SQL function <code>nextval()</code>, maybe it is a case of just hearing something a lot but I thought it has a nice ring to it and sounds forward thinking.</p>\n<p><strong>Less formal Stuff:</strong></p>\n<p>I started this blog for a couple of reasons. Firstly, I genuinely believe in sharing knowledge, but let’s face it, we forget most of what we learn, documenting it won’t prevent that but it helps. Secondly, I wanted a space to explore data engineering and related topics with a bit more personality – maybe even <em>fun</em>, <del>probably</del> hopefully. Finally, I can’t resist a good anecdote, so this will never be 100% technical content.</p>\n<p>Data is an incredibly broad and complex field, I am sure many of you have had the same experience of realizing there are too many things for one person to know. My goal here isn’t just to present dry technical facts but to share the <em>how</em> and the <em>why</em>, we all want to have perfect projects that perform flawlessly but that isn’t true for most of us.</p>\n<p><strong>Other Stuff:</strong></p>\n<p>I love New York City where I work and live and enjoy a bit of everything it has to offer. I have a distrust for automobiles, but when I do drive, I get the appeal. Maybe it is just the metaphor of spending all your time in a box, maybe it was reading <a href="https://www.amazon.com/Power-Broker-Robert-Moses-Fall/dp/0394720245">The Power Broker by Robert Caro</a> at an impressionable time in my life. To be honest I think cars are a kind of evil. Like many people, my contradictions probably say as much about me as my convictions. I love reading and there are just too many good books and not nearly enough time.</p>\n<p><strong>Hobbies &#x26; Interests:</strong></p>\n<p>When I’m not buried in data, you’ll often find me walking around the city – there’s something therapeutic about exploring different neighborhoods and discovering hidden gems. NYC is perfect for this; every walk reveals something new, whether it’s a historic building I’ve never noticed or a great little café tucked away on a side street.</p>\n<p>I’m passionate about good food and love trying new restaurants, from hole-in-the-wall spots to places that have been perfecting their craft for decades. There’s a real art to finding those places that do one thing exceptionally well, and the city is full of them.</p>\n<p>History fascinates me, particularly how past decisions continue to shape our present. Whether it’s urban planning, technology, or policy, understanding the historical context helps make sense of why things are the way they are. It’s probably why I enjoyed <em>The Power Broker</em> so much – it’s a perfect example of how one person’s vision can transform entire cities and regions for generations. Other times I am just thinking about how pretty Sophio is, and the answer is usually “Very”.</p>\n<p><strong>Tell me stuff:</strong></p>\n<p>I’m always keen to connect with fellow data enthusiasts! Feel free to reach out, I love a good story and I feel like most people have one or more to tell. I appreciate all feedback, I promise to read it all.</p>\n<p>* Dominick</p>\n<hr>\n<p><a href="/about/">Back to Professional Info</a></p>', { headings: 820, localImagePaths: 821, remoteImagePaths: 822, frontmatter: 823, imagePaths: 827 }, [], [], [], { title: 807, description: 808, pubDate: 824, tags: 825, categories: 826, draft: 716 }, "2021-08-08T00:00:00Z", [811, 812], [238], [], "more-about-me.md", "interactive-housing-simulation", { id: 829, data: 831, body: 836, filePath: 837, digest: 838, legacyId: 839, deferredRender: 676 }, { title: 832, description: 833, pubDate: 834, tags: 835 }, "Interactive Housing Market Simulation", "An interactive sandbox to explore the forces of supply, demand, and investment in the housing market.", ["Date", "2025-09-07T00:00:00.000Z"], [726], "import HousingSimulation from '@/components/HousingSim/HousingSimulation.jsx';\nimport SimulationInstructions from '@/components/HousingSim/SimulationInstructions.jsx';\n\nThis is an interactive simulation of a housing market, allowing users to explore various scenarios and their impacts on the market. You can adjust the variables below and run the simulation to see how the market responds in over several years to changes in demand, housing supply, and more.\n\n<SimulationInstructions client:load />\n\n<HousingSimulation client:load />", "src/content/blog/interactive-housing-simulation.mdx", "f79818a049133509", "interactive-housing-simulation.mdx", "2025-11-24-google-scholar-gets-even-better", { id: 840, data: 842, body: 853, filePath: 854, digest: 855, rendered: 856, legacyId: 870 }, { title: 843, description: 844, pubDate: 845, tags: 846, categories: 851 }, "Google Scholar Gets Better: What to Know About the Latest Updates", "A look at the recent improvements to Google Scholar and why they matter for researchers and data professionals.", ["Date", "2025-11-24T00:00:00.000Z"], [847, 848, 849, 850], "research", "tools", "AI", "academic", [773, 852], "Research", `### We Privatized Knowledge and Socialized Lies


They say [a lie gets halfway around the world before the truth finishes tying its sneakers](https://quoteinvestigator.com/2014/07/13/truth/) Today, we have effectively institutionalized that dynamic. We have created an ecosystem where misinformation is frictionless. Lies are free, optimized for engagement, and delivered to your phone with algorithmic precision. Meanwhile, the truth—specifically rigorous, peer-reviewed scientific truth—is usually locked behind a $35 paywall or buried under density and jargon that requires a PhD to decrypt.

I’ve been thinking about this asymmetry a lot. We constantly hear people claim they’ve "done their own research." Usually, that’s a euphemism for watching a confirmation-bias-fueled video. But I find it hard to blame them entirely. When we make the truth expensive and difficult to read, is it any wonder misinformation is winning?

The cost of this confusion is measured in human lives. We know, scientifically, that social isolation leads to disastrous health outcomes, yet we fail to build connected communities. We know that high-sugar diets and sedentary lifestyles are dangerous, yet we don't change course. Why? Because financial interests and lobbyists have mastered the frictionless lie. They exploit the gap between public knowledge and scientific reality to protect their bottom lines, ensuring that confusion always outpaces the cure.

This is why I’ve been paying close attention to the new [Scholar Labs](https://scholar.google.com/) features in Google Scholar.

I work in IT—I spend a lot of time optimizing workflows and testing local AI models—so I’m usually skeptical of the hype cycle. But what I’m seeing here feels different. It feels like a genuine hedge against the noise. Google is testing an AI-powered search that moves beyond simple keyword matching to actual synthesis. If you ask a question in natural language, it attempts to outline the scientific consensus, citing the papers as it goes.

For decades, there has been a cognitive barrier to entry for science. If you didn’t know the specific nomenclature (searching for "myocardial infarction" instead of "heart attack"), you were effectively locked out. Scholar Labs acts as a translator. It allows a curious non-expert to ask a plain question and get a response rooted in literature, not in engagement farming.

But using it highlights a remaining, frustrating fracture in the system. The AI can tell you a paper exists, and it can explain *why* it matters, but the moment you click the link, the door often slams shut.

I know hosting data costs money. But there is something fundamentally broken about a system where public tax dollars fund research that the public cannot read. I often use open-access repositories like [arXiv](https://arxiv.org/) or [SSRN](https://www.ssrn.com/) because they feel like what the internet was promised to be: a library for everyone. But most of the world doesn’t know those exist. They use Google.

If Scholar Labs can successfully lower the barrier to *understanding* complex topics, that is a massive victory. It builds a bridge. But until we solve the paywall issue, that bridge ends at a toll booth most people can’t afford.

I want to believe we can fix this. I want to believe tools like this are the first step toward a world where "doing your own research" actually means engaging with science rather than conspiracy. It’s a bit of a dream, but I am hopeful. If we can get more people to understand that science is a product of our humanity, not a special club for a nameless elite, we can rebuild trust in expertise—and start showing meaningful progress toward helping people build better lives.`, "src/content/blog/2025-11-24-Google-Scholar-Gets-Even-Better.md", "d887920b7bc0c28e", { html: 857, metadata: 858 }, '<h3 id="we-privatized-knowledge-and-socialized-lies">We Privatized Knowledge and Socialized Lies</h3>\n<p>They say <a href="https://quoteinvestigator.com/2014/07/13/truth/">a lie gets halfway around the world before the truth finishes tying its sneakers</a> Today, we have effectively institutionalized that dynamic. We have created an ecosystem where misinformation is frictionless. Lies are free, optimized for engagement, and delivered to your phone with algorithmic precision. Meanwhile, the truth—specifically rigorous, peer-reviewed scientific truth—is usually locked behind a $35 paywall or buried under density and jargon that requires a PhD to decrypt.</p>\n<p>I’ve been thinking about this asymmetry a lot. We constantly hear people claim they’ve “done their own research.” Usually, that’s a euphemism for watching a confirmation-bias-fueled video. But I find it hard to blame them entirely. When we make the truth expensive and difficult to read, is it any wonder misinformation is winning?</p>\n<p>The cost of this confusion is measured in human lives. We know, scientifically, that social isolation leads to disastrous health outcomes, yet we fail to build connected communities. We know that high-sugar diets and sedentary lifestyles are dangerous, yet we don’t change course. Why? Because financial interests and lobbyists have mastered the frictionless lie. They exploit the gap between public knowledge and scientific reality to protect their bottom lines, ensuring that confusion always outpaces the cure.</p>\n<p>This is why I’ve been paying close attention to the new <a href="https://scholar.google.com/">Scholar Labs</a> features in Google Scholar.</p>\n<p>I work in IT—I spend a lot of time optimizing workflows and testing local AI models—so I’m usually skeptical of the hype cycle. But what I’m seeing here feels different. It feels like a genuine hedge against the noise. Google is testing an AI-powered search that moves beyond simple keyword matching to actual synthesis. If you ask a question in natural language, it attempts to outline the scientific consensus, citing the papers as it goes.</p>\n<p>For decades, there has been a cognitive barrier to entry for science. If you didn’t know the specific nomenclature (searching for “myocardial infarction” instead of “heart attack”), you were effectively locked out. Scholar Labs acts as a translator. It allows a curious non-expert to ask a plain question and get a response rooted in literature, not in engagement farming.</p>\n<p>But using it highlights a remaining, frustrating fracture in the system. The AI can tell you a paper exists, and it can explain <em>why</em> it matters, but the moment you click the link, the door often slams shut.</p>\n<p>I know hosting data costs money. But there is something fundamentally broken about a system where public tax dollars fund research that the public cannot read. I often use open-access repositories like <a href="https://arxiv.org/">arXiv</a> or <a href="https://www.ssrn.com/">SSRN</a> because they feel like what the internet was promised to be: a library for everyone. But most of the world doesn’t know those exist. They use Google.</p>\n<p>If Scholar Labs can successfully lower the barrier to <em>understanding</em> complex topics, that is a massive victory. It builds a bridge. But until we solve the paywall issue, that bridge ends at a toll booth most people can’t afford.</p>\n<p>I want to believe we can fix this. I want to believe tools like this are the first step toward a world where “doing your own research” actually means engaging with science rather than conspiracy. It’s a bit of a dream, but I am hopeful. If we can get more people to understand that science is a product of our humanity, not a special club for a nameless elite, we can rebuild trust in expertise—and start showing meaningful progress toward helping people build better lives.</p>', { headings: 859, localImagePaths: 863, remoteImagePaths: 864, frontmatter: 865, imagePaths: 869 }, [860], { depth: 37, slug: 861, text: 862 }, "we-privatized-knowledge-and-socialized-lies", "We Privatized Knowledge and Socialized Lies", [], [], { title: 843, description: 844, pubDate: 866, tags: 867, categories: 868, draft: 716 }, "2025-11-24T00:00:00Z", [847, 848, 849, 850], [773, 852], [], "2025-11-24-Google-Scholar-Gets-Even-Better.md"];
export {
  _astro_dataLayerContent as default
};
