import os
import yaml
from pathlib import Path
import re
from datetime import datetime

# --- Configuration ---
POSTS_DIRECTORY = Path("src/content/blog")
# --- End Configuration ---

def update_frontmatter(file_path):
    """Reads a Markdown file, adds or updates its frontmatter, and saves it."""
    print(f"Processing: {file_path.name}...")

    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Check if frontmatter exists
        if content.strip().startswith('---'):
            parts = content.split('---', 2)
            if len(parts) < 3:
                print(f"  -> Skipping: Malformed frontmatter.")
                return
            frontmatter_str = parts[1]
            body = parts[2]
            data = yaml.safe_load(frontmatter_str) or {}
        else:
            # No frontmatter found, create it from scratch
            print(f"  -> No frontmatter found. Creating it.")
            data = {}
            body = content # The whole file is the body
            frontmatter_str = ""

        made_changes = False

        # --- Apply Fixes ---
        # 1. Ensure title exists
        if 'title' not in data or not data.get('title'):
            data['title'] = file_path.stem.replace('-', ' ').title()
            made_changes = True

        # 2. Ensure description exists
        if 'description' not in data or not data.get('description'):
            data['description'] = f"A post about {data['title']}."
            made_changes = True

        # 3. Handle date -> pubDate conversion
        if 'date' in data:
            data['pubDate'] = data.pop('date')
            made_changes = True
        elif 'pubDate' not in data:
            # Try to get date from filename (e.g., YYYY-MM-DD-title.md)
            match = re.match(r'(\d{4}-\d{2}-\d{2})', file_path.name)
            if match:
                data['pubDate'] = datetime.strptime(match.group(1), '%Y-%m-%d').date()
            else:
                data['pubDate'] = datetime.now().date() # Fallback to today
            made_changes = True

        # 4. Remove obsolete 'layout' key
        if 'layout' in data:
            del data['layout']
            made_changes = True

        # --- Save Changes ---
        if made_changes:
            new_frontmatter_str = yaml.dump(data, default_flow_style=False, sort_keys=False, allow_unicode=True)
            new_content = f"---\n{new_frontmatter_str}---\n{body}"
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"  -> Updated successfully.")
        else:
            print(f"  -> No changes needed.")

    except Exception as e:
        print(f"  -> ERROR: Could not process file. Reason: {e}")

if __name__ == "__main__":
    if not POSTS_DIRECTORY.is_dir():
        print(f"Error: Directory not found at '{POSTS_DIRECTORY}'")
    else:
        print("Starting frontmatter update...")
        for filename in os.listdir(POSTS_DIRECTORY):
            if filename.endswith((".md", ".mdx")):
                update_frontmatter(POSTS_DIRECTORY / filename)
        print("\nUpdate script finished!")