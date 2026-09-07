# drafting.desk — 5-page static site

A 5-page static site (Home, About, Work, Notes, Contact) built for GitHub Pages.

- **Markdown, actually served:** `content/about.md` and the posts in `content/notes/` are plain `.md` files. They're fetched at runtime with the browser's `fetch()` API and rendered to HTML with [marked.js](https://marked.js.org/) (loaded from a CDN, no build step or npm install required).
- **One photo, on the home page hero** — currently a placeholder from picsum.photos. Swap it for a real image (see below).
- **No framework, no build step.** Every page is plain HTML/CSS/JS, so `git push` is the whole deploy.

## File structure

```
index.html          Home (hero photo, intro)
about.html           Renders content/about.md
work.html            Project list (static)
notes.html           Lists posts, or renders one via ?post=<slug>
contact.html         Contact links
assets/
  style.css          Design system
  main.js            Nav highlighting + markdown fetch/render helper
content/
  about.md
  notes/
    manifest.json    List of posts notes.html reads to build the index
    *.md             Individual posts
```

## Deploy to GitHub Pages

1. Create a new GitHub repository (or use an existing one).
2. Copy all files from this folder into the repo root, then commit and push:
   ```bash
   git init
   git add .
   git commit -m "Initial site"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo>.git
   git push -u origin main
   ```
3. On GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a branch**, then pick `main` and `/ (root)`.
4. Your site will be live at `https://<your-username>.github.io/<your-repo>/` within a minute or two.

No build step, no `_config.yml`, and no Jekyll processing needed — GitHub Pages will serve these files as-is.

## Things to personalize before publishing

- Replace the placeholder photo URL in `index.html` with your own image (drop a file into `assets/` and update the `src`).
- Replace the email and social links in `contact.html`.
- Edit or add posts under `content/notes/` and register them in `content/notes/manifest.json`.
- Update `content/about.md` with your own bio.
- Swap the project list in `work.html` for your own — it's currently written from a generic builder's project history as a starting point.

## Why markdown is rendered client-side instead of pre-built

GitHub Pages has no server process to run — it only serves files. This site fetches the raw `.md` files in the browser and parses them there, which needs zero build tooling but means content isn't present in the initial HTML (a minor SEO trade-off). If search visibility of the writing becomes important, switch to GitHub Pages' native Jekyll support, which converts markdown to HTML at deploy time instead.
