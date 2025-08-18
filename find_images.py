import os
import re
from pathlib import Path

POSTS_DIRECTORY = Path("src/content/blog")

def find_images_in_file(file_path):
    """Finds all Markdown image paths in a file."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        # Regex to find Markdown image syntax: ![alt text](path)
        images = re.findall(r'!\[.*?\]\((.*?)\)', content)
        return images
    except Exception as e:
        print(f"Error reading {file_path.name}: {e}")
        return []

if __name__ == "__main__":
    all_image_paths = set()
    if not POSTS_DIRECTORY.is_dir():
        print(f"Error: Directory not found at '{POSTS_DIRECTORY}'")
    else:
        for filename in os.listdir(POSTS_DIRECTORY):
            if filename.endswith((".md", ".mdx")):
                paths = find_images_in_file(POSTS_DIRECTORY / filename)
                for path in paths:
                    if not path.startswith(('http://', 'https://')):
                        all_image_paths.add(path)

        if all_image_paths:
            print("Found the following local image paths in your posts:")
            for path in sorted(list(all_image_paths)):
                print(f"- {path}")
            print("\nRecommendation: Move your images to the `public/` folder and use a find-and-replace to update these paths.")
        else:
            print("No local image paths found in your posts.")