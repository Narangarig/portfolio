---
title: Why I default to static hosting
date: 2026-04-28
excerpt: For a solo builder, the best server is often the one you don't have to run, patch, or pay for while it sits idle.
---
Most of what I build doesn't need a server that's always on. It needs somewhere to put files, a way to update them, and nothing to babysit at 2am. Static hosting — GitHub Pages, in this case — covers that for free.

## What you give up

Be honest about the trade-offs before choosing it:

- No server-side logic. Forms, auth, and anything stateful need a third-party service or a separate backend.
- No server-side rendering. Content that needs to be in the first HTTP response (for SEO, mostly) has to be built in ahead of time, not fetched after load.

## What you get back

- Zero servers to patch or monitor.
- A deploy process that's just a `git push`.
- Almost nothing that can go down except GitHub itself.

For a portfolio, a set of notes, or a small marketing page, that trade almost always favors static. The moment a project needs accounts, payments, or dynamic per-user content, it's time to reach for something else — and that's fine. Not every project needs the same shape.
