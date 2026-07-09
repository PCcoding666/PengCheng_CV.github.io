# AGENTS.md — durable context for coding agents

Peng Cheng's personal site (pccoding666.com). This file is the standing briefing any agent should
read before touching the repo. Per-task instructions come separately; this is what's always true.

## What this is
- **Next.js 14** (App Router) personal homepage, **statically exported** (`output: 'export'` in
  `next.config.mjs`) — the build emits static HTML/CSS/JS into `out/`.
- **Hosted on Vercel**, auto-deploys on push to `main`. There is no server at runtime.

## Commands
- `npm run dev` — local dev server at http://localhost:3000
- `npm run build` — production build + static export (must pass; this is the deploy gate)
- `npm run lint` — eslint

## Where things live
- `app/page.tsx` — the entire homepage. Content lives in **data arrays at the top** (e.g. `BUILDS`,
  `TRACK`) with the layout below; edit copy via the arrays, not the JSX.
- `app/globals.css` — **all** styles. Design tokens are CSS custom properties in `:root`
  (`--bg`, `--surface`, `--border`, `--text`, `--text-2`, `--text-3`, `--accent`, `--warm-em`,
  `--serif`, `--sans`, `--mono`, `--max-w`, `--px`).
- `app/layout.tsx` — fonts + metadata.

## Conventions (respect these)
- **Styling is plain CSS with semantic class names + the tokens above.** Tailwind is installed but
  the homepage does **not** use it — do not introduce Tailwind utility classes. Reuse existing
  tokens rather than hard-coding colors or adding new ones.
- **Fonts are self-hosted** via `@fontsource` (Newsreader serif, IBM Plex Mono, system sans). Do
  **not** add `next/font/google` or external Google Fonts — mainland-China visitors can't reach them.
- **Static export means no runtime server.** No server actions, no dynamic routes, `next/image` is
  unoptimized. Any interactivity must live in a **Client Component** (`"use client"`); keep
  `page.tsx` a Server Component and isolate interactivity into small client components.
- **Tone:** failures are shown as neutral facts (calm gray, never red/error styling). Don't rewrite
  existing copy unless the task explicitly asks.

## Safety
- Work only within the files a task names. Don't touch config, deploy, or unrelated sections.
- `npm run build` passing is the objective bar for "done."
