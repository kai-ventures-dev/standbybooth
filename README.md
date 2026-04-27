# Standby Booth — landing page + product reference

Single-page marketing site + a comprehensive product reference for
[Standby Booth](https://standbybooth.app), a self-service video booth iPad
app. Built as static HTML/CSS/JS, served via GitHub Pages.

**Live:** https://kai-ventures-dev.github.io/standbybooth/  
*(or `https://standbybooth.app` once the custom domain is configured)*

---

## 📖 [`docs/`](./docs/) — design & product reference

The `docs/` folder is the **single source of truth** for what the product
**is**, who it's **for**, and how it **behaves**. Structured for an AI
design tool (Claude design / artifacts) to ingest the full picture before
producing derivative designs.

| File | What's in it |
|---|---|
| [00 · index](./docs/00-index.md) | Reading order + at-a-glance summary |
| [01 · product](./docs/01-product.md) | Vision, design principles, what it is |
| [02 · personas](./docs/02-personas.md) | Who pays, willingness-to-pay framework |
| [03 · guest flow](./docs/03-guest-flow.md) | The 7-screen guest experience |
| [04 · admin panel](./docs/04-admin-panel.md) | The 5 admin tabs + every setting |
| [05 · tiers](./docs/05-tiers.md) | Free vs Pro — every gate, every cap |
| [06 · features](./docs/06-features.md) | Full feature reference |
| [07 · storage](./docs/07-storage.md) | Storage destinations, file format, sidecar |
| [08 · technical](./docs/08-technical.md) | Architecture, constraints, edge cases |
| [09 · brand](./docs/09-brand.md) | Voice, color, typography, motion |
| [10 · copy](./docs/10-copy.md) | Every user-facing string |

Read `00-index.md` first.

---

## 🌐 Landing page

## Stack

No build step. No package manager. Pure HTML, CSS, and ~30 lines of JS.

- `index.html` — single page, semantic HTML5
- `styles.css` — design tokens + sections + responsive
- `script.js` — copy-to-clipboard + chyron scroll state
- `assets/icon-1024.png` — app icon
- `og-image.png` — *(optional)* 1200×630 social card

Fonts: [Instrument Serif](https://fonts.google.com/specimen/Instrument+Serif),
[JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono),
[Geist](https://vercel.com/font) — all loaded from CDNs at runtime.

## Local development

```sh
# No server needed. Open in your browser:
open index.html
```

If you want hot-reload, any static server works:

```sh
python3 -m http.server 8080
# then visit http://localhost:8080
```

## Deploy

The repo deploys via GitHub Pages from `main` / `/ (root)`. Push to `main`
and Pages rebuilds within ~30 seconds.

```sh
git add .
git commit -m "..."
git push origin main
```

Configure once: **Settings → Pages → Source → Deploy from a branch → main / `/`**.

### Custom domain

To wire up `standbybooth.app`:

1. Add a `CNAME` file at the repo root with one line: `standbybooth.app`
2. Configure DNS at the registrar:
   - `A` records → GitHub Pages IPs (`185.199.108.153`, `.109.153`, `.110.153`, `.111.153`)
   - `CNAME` for `www` → `kai-ventures-dev.github.io`
3. Enable HTTPS in **Settings → Pages**

The in-app legal links at `/terms` and `/privacy` already point at this
domain (see `IAPService.swift:457-458` in the app repo), so configuring the
custom domain also unbreaks those.

## Editing copy

Most copy lives in `index.html`. The free-vs-pro tier matrix mirrors
`PaywallView.swift` in the app repo (`comparisonRows` const) — keep them in
sync when changing tier definitions.

The price string `$29.99` appears in two places (hero and pricing section).
Search-and-replace if it changes.

## License

© 2026 Kai Ventures. All rights reserved.
