---
title: Serving markdown from a static GitHub Pages site
date: 2026-08-02
excerpt: GitHub Pages has no server to run, so "serving markdown" means shipping the .md files as static assets and rendering them in the browser.
---
GitHub Pages only serves files — there's no process running on the other end to convert anything for you. That means two honest options if you want markdown content on a page:

1. **Build step.** Convert `.md` to `.html` before you push (Jekyll, which GitHub Pages runs natively, does exactly this).
2. **Client-side render.** Ship the raw `.md` files as static assets, fetch them with JavaScript, and parse them in the browser.

This site uses the second approach, with [marked.js](https://marked.js.org/) loaded from a CDN. The trade-off is worth naming plainly:

> A build step gives you real HTML files search engines can index immediately. Client-side rendering is simpler to reason about and needs no build pipeline, but content isn't in the initial HTML response.

## The parts that make it work

- The `.md` files live in `content/` and are just static files, same as any image or stylesheet.
- A small `fetch()` call pulls the raw text down.
- `marked.parse()` turns it into HTML, which gets dropped into the page.
- A short front-matter block (the `---` fenced section at the top of each file) carries a title, date, and excerpt without polluting the rendered body.

## When to reach for the build-step version instead

If search visibility of the writing itself matters, or the site will grow past a handful of pages, Jekyll's native markdown support on GitHub Pages is the better default — it does this same job at deploy time instead of in the visitor's browser.
