# FRAMR.

> Drop an image. Reframe it for every social. Download what fits.

A no-bullshit web tool for content creators: upload one image, get **23 platform-correct exports** across Instagram, TikTok, YouTube, X, LinkedIn, and Facebook. Pan and zoom to recompose each crop. Download single WebPs or grab the whole set as a ZIP.

Built **client-side**. Nothing uploads anywhere — your image never leaves your browser.

---

## What it does

- **One source → every aspect ratio.** Square, portrait, landscape, story, banner, profile pic. 23 presets total, all official 2026 dimensions.
- **Recompose per format.** Drag inside any frame to pan. Scroll, slider, or trackpad pinch to zoom. The crop always covers — no empty edges, ever.
- **Honest warnings.** If the source is too small, you see exactly how much upscale would happen (`⚠ +28%`). Download is still enabled — you decide if pixelated is fine.
- **Three download modes.**
  - Single preset → `.webp`
  - Per-platform set → `.zip` (one per platform)
  - Everything → `.zip` with all 23 outputs

## Stack

| What | Why |
|---|---|
| **Next.js 16 + React 19** | App Router, Turbopack, zero server logic |
| **TypeScript** | Less crap to debug |
| **CSS Modules** | No Tailwind, no runtime CSS, no design system overhead |
| **Canvas API** | All image processing happens in the browser |
| **JSZip** | ZIP archives built client-side, streamed to download |
| **Space Grotesk + JetBrains Mono** | Display + mono via `next/font/google` |

## Getting started

```bash
pnpm install
pnpm dev
```

App runs at `http://localhost:3000`.

```bash
pnpm build   # production build
pnpm start   # serve the production build
```

## Project structure

```
src/
├── app/
│   ├── layout.tsx              # fonts, skip-link, html lang
│   ├── globals.css             # tokens, focus-visible, reduced-motion
│   ├── page.tsx                # main app (Uploader + PresetCards grid)
│   ├── page.module.css
│   └── ui-kit/
│       ├── page.tsx            # design system showcase
│       └── page.module.css
├── components/
│   ├── Header.tsx              # FRAMR. + UI KIT / BACK TO APP toggle
│   ├── Uploader.tsx            # drag & drop + file picker
│   └── PresetCard.tsx          # interactive crop + per-preset download
└── lib/
    ├── platforms.ts            # the 23-preset catalog
    ├── transform.ts            # cover-crop math (cx/cy/zoom → tx/ty/scale)
    └── export.ts               # canvas → WebP → ZIP helpers
```

## How the crop works

Each preset stores a transform: `{ zoom, cx, cy }` where `cx`/`cy` are the focus point in normalized image coordinates (0–1).

`computeFrame()` in `lib/transform.ts` maps that transform onto any output frame (display preview OR export canvas). It:

1. Calculates `coverScale` so the image always covers the frame at zoom 1.
2. Multiplies by the user zoom.
3. Translates so the focus point lands at the frame center.
4. Clamps so the image never escapes the frame (cover guarantee).

The same function drives the on-screen preview and the export canvas — what you see is exactly what you download.

## Design system

The whole UI follows a strict brutalist language. Hit `/ui-kit` for the visual reference:

- Sharp corners only. No `border-radius`.
- 3px black borders everywhere.
- Hover states **thunk** — 4px solid shadow, no blur.
- Copy is confrontational and mostly UPPERCASE.
- Saturated palette over subtlety.
- Brand colors match official (with minimal darkening on YouTube + Facebook for WCAG AA).
- Warning ≠ blocker. Show the cost, let the user choose.

## Accessibility

Lighthouse a11y score: **100 / 100** on both `/` and `/ui-kit`.

- Skip-to-content link
- Single `<h1>` per page, ordered heading hierarchy
- Landmarks: `<header>`, `<nav>`, `<main id="content">`, `<section aria-labelledby>`, `<footer>`
- Drop zone as `role="button"` with Enter/Space keyboard support
- Slider with `<label>` (visually hidden but linked)
- Descriptive `alt` and `aria-label` on every interactive element
- `:focus-visible` outlines on everything focusable
- `prefers-reduced-motion` respects user preference
- All text passes WCAG AA contrast (4.5:1 for normal, 3:1 for large)

## Roadmap

- [ ] Pinch-zoom on touch devices
- [ ] Smart-crop (face/subject detection) instead of centered cover
- [ ] Safe-zone overlays (YouTube banner mobile region, X header avatar spot)
- [ ] WebP quality slider (currently fixed at q92)
- [ ] Batch upload — process several source images at once
- [ ] PWA install + offline support
- [ ] Drag-and-drop reorder of presets inside a platform

## Why

Most "social media resizer" tools online want your email, your credit card, your image uploaded to their server, or all three. This one wants none of that.

If your image is good, you get 23 perfect crops in five seconds. If it's not, you'll see exactly what's broken.
