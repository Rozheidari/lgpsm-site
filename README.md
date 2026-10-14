# LGPSM — Future Forward Fashion

A single-page fashion landing site with a cursor-tracking image reveal, parallax grid, and drawer-based navigation. Built with React + Vite + TypeScript.

## Stack

- **React 18** — UI
- **Vite** — build tool
- **TypeScript** — type safety
- **Tailwind + CSS variables** — fluid, clamp-based sizing
- **lucide-react** — icons

## Features

- Dual-image hero reveal masked by a cursor-following radial gradient
- Parallax wireframe grid overlay
- Drawer navigation: catalog, collections, journal, cart
- In-memory cart with toast feedback
- Fully fluid layout — almost no media queries

## Run locally

git clone https://github.com/Rozheidari/lgpsm-site.git
cd lgpsm-site
npm install
npm run dev

Opens at http://localhost:5173.

Scripts
bash
npm run dev       # dev server
npm run build     # production build
npm run preview   # preview build
Known limitations
Single viewport, no scrolling content

No routing — all navigation is drawers

Cart state is in-memory only

Reveal effect uses canvas.toDataURL() per frame (demo-grade, not production-grade)

Author
Rozheidari
