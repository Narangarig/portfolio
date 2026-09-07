// Mark the active nav link based on the current path.
(function highlightNav(){
  const here = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("nav.site-nav a").forEach((a) => {
    const href = a.getAttribute("href");
    if (href === here) a.classList.add("active");
  });
})();

// Small helper: fetch a markdown file and render it into a target element
// using marked.js (loaded from cdnjs on pages that need it).
async function renderMarkdownInto(path, targetEl, { onTitle } = {}) {
  targetEl.innerHTML = '<p class="loading">Loading…</p>';
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    const raw = await res.text();
    const { body, meta } = splitFrontMatter(raw);
    if (onTitle && meta.title) onTitle(meta, targetEl);
    targetEl.innerHTML = marked.parse(body);
  } catch (err) {
    targetEl.innerHTML = `<p class="error">Couldn't load this content (${err.message}). If you're viewing this file directly from disk rather than through a server, your browser may be blocking local fetches — serve the folder with any static server, or view it on the published GitHub Pages site.</p>`;
  }
}

// Very small front-matter parser: a leading --- block with key: value lines.
function splitFrontMatter(raw) {
  const meta = {};
  if (raw.startsWith("---")) {
    const end = raw.indexOf("\n---", 3);
    if (end !== -1) {
      const block = raw.slice(3, end).trim();
      block.split("\n").forEach((line) => {
        const idx = line.indexOf(":");
        if (idx > -1) {
          meta[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
        }
      });
      return { body: raw.slice(end + 4).trim(), meta };
    }
  }
  return { body: raw, meta };
}
