---
title: 'If You Have To Use Excel, Automate It: Formatting with Python'
categories:
- Development
- Data
tags:
- python
- excel
- pandas
- xlsxwriter
- automation
pubDate: 2024-07-18 12:00:00 -0400
description: 'A post about If You Have To Use Excel, Automate It: Formatting with
  Python.'
---



Sometimes people need to download some data, format it in Excel, and distribute it. And they have to do this every day, and you look at it and think "I bet I could automate that." And you are right!  You could automate it and make someone's life a lot easier. Don't be a slacker, help them out. 

## How it Works

After writing a Pandas DataFrame to an Excel sheet using `df.to_excel(writer, ...)`, you can access XlsxWriter's workbook and worksheet objects. The library has a ton of formatting options I am not even touching here. If you want to review them all, check out the [XlsxWriter documentation](https://xlsxwriter.readthedocs.io/).

Let's walk through a Python script that uses Pandas and XlsxWriter to create a well-formatted Excel report from a DataFrame (df1).

```python
import pandas as pd
# Assume df1 is a pre-existing Pandas DataFrame
# For example:
# data = {'ColA': [1, 2, 3], 'ColB': ['X', 'Y', 'Z'], 'ColC': [10.1, 20.2, 30.3], 'ColD': [True, False, True]}
# df1 = pd.DataFrame(data)

# 1. Initialize ExcelWriter with XlsxWriter engine
writer = pd.ExcelWriter('formatted_report.xlsx', engine='xlsxwriter')

# 2. Write DataFrame to a sheet
# index=False prevents writing the DataFrame index as a column in Excel
df1.to_excel(writer, sheet_name='Sheet1', index=False)

# 3. Access XlsxWriter workbook and worksheet objects
workbook = writer.book
worksheet = writer.sheets['Sheet1']

# 4. Format the Header Row
# Define a format for the header cells
header_format = workbook.add_format({
    'bold': True,
    'italic': True,
    'underline': True,
    'font_size': 13,
    'bottom': 2,    # Medium border
    'top': 2,       # Medium border
    'left': 2,      # Medium border
    'right': 2,     # Medium border
    'align': 'center',
    'valign': 'vcenter',
    'bg_color': '#DDEBF7' # A light blue background
})
# Apply the format to the header row (rewriting what Pandas initially wrote)
for col_num, value in enumerate(df1.columns.values):
    worksheet.write(0, col_num, value, header_format)

# 5. Define Formats for Data Cells
# General format for data cells (thin borders on all sides)
format1_all_borders = workbook.add_format({
    'bottom': 1, 'top': 1, 'left': 1, 'right': 1
})

# Specific format for the first row of data (medium top border, thin other borders)
format2_first_data_row = workbook.add_format({
    'top': 2,    # Medium top border
    'bottom': 1, # Thin bottom border
    'right': 1,  # Thin right border
    'left': 1    # Thin left border
})

# 6. Apply Conditional Formatting to Data Cells
# This applies 'format2_first_data_row' to the first row of data (row index 1)
# It checks if cells are not blank (criteria: '>=', value: '""' effectively means not blank for text/numbers)
if len(df1) > 0: # Ensure there is at least one data row
    worksheet.conditional_format(1, 0, 1, df1.shape[1] - 1, {
        'type': 'cell',
        'criteria': '>=', # Applies to cells with any content (numbers or text)
        'value': '""',    # Compares against an empty string
        'format': format2_first_data_row
    })

    # Apply 'format1_all_borders' to all data cells
    worksheet.conditional_format(1, 0, df1.shape[0], df1.shape[1] - 1, {
        'type': 'cell',
        'criteria': '>=',
        'value': '""',
        'format': format1_all_borders
    })

# 7. Add an Excel Table with AutoFilter and Style
if len(df1) > 0:
    column_settings = [{'header': column} for column in df1.columns.values]
    worksheet.add_table(0, 0, df1.shape[0], df1.shape[1] - 1, {
        'columns': column_settings, # Use DataFrame headers for the table
        'autofilter': True,
        'style': 'Table Style Light 1'
    })
else: # Handle empty DataFrame: create table with only headers
    column_settings = [{'header': column} for column in df1.columns.values]
    worksheet.add_table(0, 0, 0, df1.shape[1] - 1, {
        'columns': column_settings,
        'autofilter': True,
        'style': 'Table Style Light 1'
    })

# 8. Set Column Widths
# Adjust these character widths based on your data
worksheet.set_column('A:A', 10)
worksheet.set_column('B:B', 22)
worksheet.set_column('C:D', 11)
worksheet.set_column('E:K', 8.5) # Example range

# 9. Page Setup for Printing
worksheet.set_landscape()      # Set page orientation to landscape
worksheet.repeat_rows(0)       # Repeat header row (row 0) on each printed page

# 10. Save and Close the Excel File
try:
    writer.close() # This also saves the file
    print("Excel file 'formatted_report.xlsx' saved successfully!")
except Exception as e:
    print(f"Error saving Excel file: {e}")
```

## Explanation of the Code

1. **Initialize ExcelWriter with XlsxWriter engine**

   ```python
   writer = pd.ExcelWriter('formatted_report.xlsx', engine='xlsxwriter')
   ```

2. **Write DataFrame to a sheet**

   `index=False` prevents writing the DataFrame index as a column in Excel.

   ```python
   df1.to_excel(writer, sheet_name='Sheet1', index=False)
   ```

3. **Access XlsxWriter workbook and worksheet objects**

   ```python
   workbook = writer.book
   worksheet = writer.sheets['Sheet1']
   ```

4. **Format the Header Row**

   Define a format for the header cells.

   ```python
   header_format = workbook.add_format({
       'bold': True,
       'italic': True,
       'underline': True,
       'font_size': 13,
       'bottom': 2,    # Medium border
       'top': 2,       # Medium border
       'left': 2,      # Medium border
       'right': 2,     # Medium border
       'align': 'center',
       'valign': 'vcenter',
       'bg_color': '#DDEBF7' # A light blue background
   })
   ```

   Apply the format to the header row (rewriting what Pandas initially wrote).

   ```python
   for col_num, value in enumerate(df1.columns.values):
       worksheet.write(0, col_num, value, header_format)
   ```

5. **Define Formats for Data Cells**

   General format for data cells (thin borders on all sides).

   ```python
   format1_all_borders = workbook.add_format({
       'bottom': 1, 'top': 1, 'left': 1, 'right': 1
   })
   ```

   Specific format for the first row of data (medium top border, thin other borders).

   ```python
   format2_first_data_row = workbook.add_format({
       'top': 2,    # Medium top border
       'bottom': 1, # Thin bottom border
       'right': 1,  # Thin right border
       'left': 1    # Thin left border
   })
   ```

6. **Apply Conditional Formatting to Data Cells**

   This applies 'format2_first_data_row' to the first row of data (row index 1). It checks if cells are not blank (criteria: '>=', value: '""' effectively means not blank for text/numbers).

   ```python
   if len(df1) > 0: # Ensure there is at least one data row
       worksheet.conditional_format(1, 0, 1, df1.shape[1] - 1, {
           'type': 'cell',
           'criteria': '>=', # Applies to cells with any content (numbers or text)
           'value': '""',    # Compares against an empty string
           'format': format2_first_data_row
       })

       # Apply 'format1_all_borders' to all data cells
       worksheet.conditional_format(1, 0, df1.shape[0], df1.shape[1] - 1, {
           'type': 'cell',
           'criteria': '>=',
           'value': '""',
           'format': format1_all_borders
       })
   ```

7. **Add an Excel Table with AutoFilter and Style**

   The table range should include the header row (row 0) and all data rows. `df1.shape[0]` is the number of data rows, so the last data row index is `df1.shape[0]`.

   ```python
   if len(df1) > 0:
       column_settings = [{'header': column} for column in df1.columns.values]
       worksheet.add_table(0, 0, df1.shape[0], df1.shape[1] - 1, {
           'columns': column_settings, # Use DataFrame headers for the table
           'autofilter': True,
           'style': 'Table Style Light 1'
       })
   ```

   Handle empty DataFrame: create table with only headers.

   ```python
   else: # Handle empty DataFrame: create table with only headers
       column_settings = [{'header': column} for column in df1.columns.values]
       worksheet.add_table(0, 0, 0, df1.shape[1] - 1, {
           'columns': column_settings,
           'autofilter': True,
           'style': 'Table Style Light 1'
       })
   ```

8. **Set Column Widths**

   Adjust these character widths based on your data.

   ```python
   worksheet.set_column('A:A', 10)
   worksheet.set_column('B:B', 22)
   worksheet.set_column('C:D', 11)
   worksheet.set_column('E:K', 8.5) # Example range
   ```

9. **Page Setup for Printing**

   ```python
   worksheet.set_landscape()      # Set page orientation to landscape
   worksheet.repeat_rows(0)       # Repeat header row (row 0) on each printed page
   ```

10. **Save and Close the Excel File**

    ```python
    try:
        writer.close() # This also saves the file
        print("Excel file 'formatted_report.xlsx' saved successfully!")
    except Exception as e:
        print(f"Error saving Excel file: {e}")
    ```
