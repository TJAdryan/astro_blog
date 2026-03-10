# Astro Starter Kit: Blog

```sh
bun create astro@latest -- --template blog
```

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

Features:

- ✅ Minimal styling (make it your own!)
- ✅ 100/100 Lighthouse performance
- ✅ SEO-friendly with canonical URLs and OpenGraph data
- ✅ Sitemap support
- ✅ RSS Feed support
- ✅ Markdown & MDX support

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
├── public/
├── src/
│   ├── components/
│   ├── content/
│   ├── layouts/
│   └── pages/
├── astro.config.mjs
├── README.md
├── package.json
└── tsconfig.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

The `src/content/` directory contains "collections" of related Markdown and MDX documents. Use `getCollection()` to retrieve posts from `src/content/blog/`, and type-check your frontmatter using an optional schema. See [Astro's Content Collections docs](https://docs.astro.build/en/guides/content-collections/) to learn more.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `bun install`             | Installs dependencies                            |
| `bun dev`             | Starts local dev server at `localhost:4321`      |
| `bun build`           | Build your production site to `./dist/`          |
| `bun preview`         | Preview your build locally, before deploying     |
| `bun astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `bun astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Check out [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).

## Credit

This theme is based off of the lovely [Bear Blog](https://github.com/HermanMartinus/bearblog/).

## Bun + Tailwind CSS + Astro Setup

If you are using Bun as your package manager, use the following steps to set up Tailwind CSS and PostCSS:

1. **Install dependencies**

```sh
bun add -d tailwindcss postcss autoprefixer @tailwindcss/postcss
```

2. **Configuration files**
- Ensure you have `tailwind.config.mjs` and `postcss.config.cjs` in your project root.
- In your main CSS (e.g., `src/styles/global.css`):
  ```css
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
  ```

3. **Development**
- Use Bun to run your dev/build scripts:
  ```sh
  bun run dev
  ```

4. **Troubleshooting**
- If you see errors about PostCSS plugins, make sure `@tailwindcss/postcss` is installed.
- Some npm-specific plugins may not work with Bun. Check plugin docs for Bun compatibility.

## 📝 User Submissions via Google Docs

This project utilizes **Google Docs** as a backend to store user inputs (e.g., from the Abyss/404 page). Using a Google Doc allows the static site to securely hold sanitized user inputs without requiring a traditional database.

There are also test scripts included in the `scripts/` directory to ensure reading and writing to the Google Doc works correctly:
- `scripts/test_google_doc.js`
- `scripts/test_google_doc_read.js`
- `scripts/test_write.js`
