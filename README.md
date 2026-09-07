# drafting.desk — 5-page static site

A 5-page static site (Home, About, Work, Notes, Contact) built for GitHub Pages.

- **Markdown, actually served:** `content/about.md` and the posts in `content/notes/` are plain `.md` files. They're fetched at runtime with the browser's `fetch()` API and rendered to HTML with [marked.js](https://marked.js.org/) (loaded from a CDN, no build step or npm install required).
- **One photo, on the home page hero** — currently a placeholder from picsum.photos. Swap it for a real image (see below).
- **Styled with Tailwind CSS**, loaded via the Play CDN — no build step (see the Tailwind section below for the trade-off this implies).
- **A working contact form** that emails you via [Formspark](https://formspark.io) — no backend of your own to deploy.
- **No framework, no bundler.** Every page is plain HTML/JS, so `git push` is the whole deploy.

## File structure

```
index.html          Home (hero photo, intro)
about/index.html     Renders content/about.md
work/index.html      Project list (static)
notes/index.html     Lists posts, or renders one via ?post=<slug>
contact/index.html   Contact form + links
robots.txt           Crawler access + sitemap pointer
sitemap.xml          URLs for the 5 pages
llms.txt             Plain-text summary + links, for AI crawlers/assistants
.nojekyll            Tells GitHub Pages not to run its default Jekyll build
assets/
  main.js            Nav active-state helper, markdown fetch/render helper, contact form submit logic
content/
  about.md
  notes/
    manifest.json    List of posts notes/index.html reads to build the index
    *.md             Individual posts
```

Each page except Home lives in its own folder as `index.html`, so URLs are extensionless and clean: `/about/`, `/work/`, `/notes/`, `/contact/` instead of `/about.html`. This is what makes the `.html`-free URLs work — see below.

## SEO / AI-crawler files added

- **`robots.txt`** — allows all crawlers, points to `sitemap.xml`.
- **`sitemap.xml`** — lists the 5 page URLs.
- **`llms.txt`** — a plain-text/markdown summary of the site with direct links, following the [llmstxt.org](https://llmstxt.org) convention. It also links straight to the `.md` files under `content/`, since those contain the full text without needing JavaScript — the most reliable way for an AI crawler to read the About/Notes content given that those pages render client-side (see the earlier note on that trade-off).
- **Open Graph + Twitter Card tags** — on every page's `<head>`, so links shared on social platforms and messaging apps show a title, description, and image instead of a bare URL.
- **JSON-LD structured data** — on every page's `<head>`: `WebSite`/`Person` on Home, `ProfilePage` on About, `ItemList` of `CreativeWork` on Work, `Blog`/`BlogPosting` entries on Notes, `ContactPage` on Contact.

### Before publishing, replace the placeholder domain

All of the above use `https://your-username.github.io/your-repo/` as a placeholder. Find-and-replace that with your real GitHub Pages URL in:

- `robots.txt`, `sitemap.xml`, `llms.txt`
- the `<link rel="canonical">`, `og:url`, and JSON-LD `url`/`@id` fields in each HTML page

Also worth doing: the `BlogPosting` entries in `notes/index.html`'s JSON-LD are written by hand to mirror `content/notes/manifest.json` — if you add or edit a note, update both so they stay in sync.

## Extensionless URLs (no `.htaccess` needed)

`.htaccess` doesn't do anything on GitHub Pages — Pages isn't served by Apache, so an `.htaccess` file is simply ignored, no matter what's in it.

The way this site hides `.html` from URLs is the standard static-hosting approach instead: each page (other than Home) is a **folder containing `index.html`** — e.g. `about/index.html` rather than `about.html`. Any static web server, GitHub Pages included, serves a directory's `index.html` automatically when you request the folder, so `/about/` just works with no extension and no server configuration. This is host-agnostic — it works identically on Netlify, S3, or anywhere else, unlike `.htaccess`, which only ever worked on Apache.

Because of this, active-nav-link detection in `assets/main.js` no longer matches on the filename in the URL (there isn't one) — each page's `<body data-page="...">` attribute marks which nav link should be active instead.

## Styling: Tailwind via CDN

Every page loads Tailwind through the **Play CDN** (`<script src="https://cdn.tailwindcss.com?...">`), which compiles utility classes in the browser at load time. It keeps the "no build step" deploy model — the custom colors and fonts (the navy/vellum/gold palette, Fraunces + IBM Plex Sans) are registered inline via a small `tailwind.config` script block repeated at the top of each page, since there's no shared include mechanism without a build step.

The trade-off: the Play CDN logs a console warning about not being intended for production, and it does the utility-class compilation on every page load rather than once ahead of time. For a small personal site this is a reasonable trade for zero tooling. If it starts to matter (console noise, a bit of extra load time, wanting a smaller CSS payload), the fix is a real Tailwind build — a `package.json` + `tailwind.config.js` + a CLI or PostCSS build step, run either locally before each push or via a GitHub Actions workflow on push. That's a bigger change to the project's shape (it stops being a zero-dependency static folder), so it's worth doing deliberately rather than by default.

## Contact form: Formspark

The form on the Contact page posts JSON (`name`, `email`, `message`) straight to Formspark from the browser — set in `assets/main.js`:

```js
const CONTACT_ENDPOINT = "https://submit-form.com/your-form-id";
```

Formspark is built for exactly this: static sites with no backend. You don't need your own server, API key, or relay — Formspark receives the submission and forwards it to your email. To set it up:

1. Create a free account at [formspark.io](https://formspark.io) and create a new form.
2. Copy the form's submission URL (looks like `https://submit-form.com/xxxxxxxxx`) from the dashboard.
3. Paste it into `CONTACT_ENDPOINT` in `assets/main.js`.
4. Push the change — the form is live.

**The form won't send anything until you do step 3.** Until then, submitting shows a message saying so instead of failing silently.

A hidden `website` field on the form acts as a simple honeypot — real visitors never see or fill it in, and the script quietly drops the submission client-side if it arrives filled in. It's a mild speed bump against simple bots, not a substitute for whatever spam filtering Formspark offers on your plan.

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
- Replace the email and social links in `contact/index.html`.
- Create a Formspark form and set `CONTACT_ENDPOINT` in `assets/main.js` to your form's submission URL — the contact form won't send email until this is done (see the Formspark section above).
- Edit or add posts under `content/notes/` and register them in `content/notes/manifest.json` (and the matching `BlogPosting` entry in `notes/index.html`'s JSON-LD).
- Update `content/about.md` with your own bio.
- Swap the project list in `work/index.html` for your own — it's currently written from a generic builder's project history as a starting point.

## Why markdown is rendered client-side instead of pre-built

GitHub Pages has no server process to run — it only serves files. This site fetches the raw `.md` files in the browser and parses them there, which needs zero build tooling but means content isn't present in the initial HTML (a minor SEO trade-off). If search visibility of the writing becomes important, switch to GitHub Pages' native Jekyll support, which converts markdown to HTML at deploy time instead.
