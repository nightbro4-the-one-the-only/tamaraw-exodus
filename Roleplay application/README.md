# Tamaraw Exodus

A living world website for the Tamaraw Exodus novel and roleplay universe.

## Pages

- **Home** (`index.html`) — Welcome page with navigation to all sections
- **Story** (`story.html`) — Full novel reader with chapter selector, font controls, and table of contents
- **Lore** (`lore.html`) — World-building lore and codex entries
- **Roleplay** (`rp.html`) — Player submission form, chronicle, world-state banner, and rules
- **Author** (`author.html`) — Author's message and notes
- **GM's Desk** (`gm.html`) — Game Master tools for resolving moves and managing the world

## Features

- 📖 **Story Reader** — 60+ chapters with paragraph formatting, font size controls, and chapter navigation
- 🌙 **Dark/Light Mode** — Toggle across all pages
- 📜 **Chronicle** — GM publishes resolved events, visible to all players
- 🎭 **Player Submissions** — Submit moves via form or Discord webhook
- 🏛️ **World-State Banner** — Era, day, and latest chronicle entry at a glance
- 🤖 **GM's Desk** — AI-assisted world management with move resolution

## Discord Integration

See [DISCORD-GUIDE.md](DISCORD-GUIDE.md) for setting up a Discord server for player submissions.

## Hosting

This site is fully static — no server required. Host on:
- **GitHub Pages** — Free, automatic deploys
- **Netlify** — Drag-and-drop deployment
- **Vercel** — Instant deploys

## Local Development

Just open `index.html` in a browser, or use any static file server:

```bash
# Python
python -m http.server 8080

# Node.js
npx serve .
```

## License

All rights reserved. This is a personal creative project.
