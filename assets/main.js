// Mark the active nav link based on a data-page marker set on <body>,
// rather than the URL — keeps working regardless of clean-URL structure,
// trailing slashes, or a repo subpath.
(function highlightNav(){
  const current = document.body.dataset.page;
  if (!current) return;
  document.querySelectorAll("nav.site-nav a[data-page]").forEach((a) => {
    if (a.dataset.page === current) {
      a.classList.remove("text-muted", "border-transparent");
      a.classList.add("text-ink-text", "border-gold");
    }
  });
})();

// Small helper: fetch a markdown file and render it into a target element
// using marked.js (loaded from cdnjs on pages that need it).
async function renderMarkdownInto(path, targetEl, { onTitle } = {}) {
  targetEl.innerHTML = '<p class="text-muted">Loading…</p>';
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    const raw = await res.text();
    const { body, meta } = splitFrontMatter(raw);
    if (onTitle && meta.title) onTitle(meta, targetEl);
    targetEl.innerHTML = marked.parse(body);
  } catch (err) {
    targetEl.innerHTML = `<p class="text-rust">Couldn't load this content (${err.message}). If you're viewing this file directly from disk rather than through a server, your browser may be blocking local fetches — serve the folder with any static server, or view it on the published GitHub Pages site.</p>`;
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

// Contact form — posts directly to Formspark, a hosted form backend built
// for static sites. No server or API key of your own is needed: Formspark
// receives the submission and emails it to you.
(function setupContactForm(){
  const form = document.getElementById("contact-form");
  if (!form) return;

  // Replace with your form's endpoint from the Formspark dashboard.
  const CONTACT_ENDPOINT = "https://submit-form.com/your-form-id";

  const status = document.getElementById("contact-status");
  const button = document.getElementById("contact-submit");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());

    // Honeypot: a hidden field real visitors never fill in.
    if (data.website) return;

    if (!data.name || !data.email || !data.message) {
      status.textContent = "Please fill in your name, email, and message.";
      status.className = "text-sm text-rust";
      return;
    }

    if (CONTACT_ENDPOINT.includes("your-form-id")) {
      status.textContent =
        "The form isn't connected yet — set CONTACT_ENDPOINT in assets/main.js to your Formspark form URL.";
      status.className = "text-sm text-rust";
      return;
    }

    const original = button.textContent;
    button.disabled = true;
    button.textContent = "Sending…";
    status.textContent = "";

    try {
      const res = await fetch(CONTACT_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Request failed");
      form.reset();
      status.textContent = "Thanks — your message is on its way.";
      status.className = "text-sm text-emerald-700";
    } catch (err) {
      status.textContent =
        "Something went wrong sending that. Try emailing hello@example.com directly.";
      status.className = "text-sm text-rust";
    } finally {
      button.disabled = false;
      button.textContent = original;
    }
  });
})();
