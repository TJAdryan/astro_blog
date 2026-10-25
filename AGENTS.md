# Workspace Rules (`astro_blog`)

## Git Commit & Push Workflow

1. **Auto-Commit and Push Immediately**: Whenever you complete a requested code, style, or content change in this repository, **immediately commit and push the changes to `origin/main`** as part of the same turn. Do **not** stop to ask the user whether they want to commit or push unless they explicitly asked you to hold off.
2. **Pull Rebase Before Pushing**: An automated GitHub Action updates the daily train log on `origin/main`. Always run `git pull --rebase origin main` before `git push origin main` so pushes are never rejected due to remote commits.
3. **Keep Git Commands Prefix-Matchable (Avoid Re-Prompting)**:
   - Run `git commit`, `git pull --rebase origin main`, and `git push origin main` as **separate** `run_command` calls (do not chain them with `&&` or `;`) so the user's "Always Allow" permissions match the command prefixes cleanly without re-prompting.
   - Stage files directly in the `git commit` command (e.g., `git commit -m "<message>" <file1> <file2>`) or via a separate `git add` step.

## Reading List Synchronization

- Whenever adding, editing, or removing items from the reading list ("My Reading List"), update both [src/data/articles.json](file:///Users/dominickryan/astro_blog/astro_blog/src/data/articles.json) (used by the homepage) and [public/data/articles.json](file:///Users/dominickryan/astro_blog/astro_blog/public/data/articles.json) (used by `/interesting-articles`), as well as [src/data/articles.js](file:///Users/dominickryan/astro_blog/astro_blog/src/data/articles.js) if present.
