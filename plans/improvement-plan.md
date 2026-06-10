# Site Improvement Plan

Created: 2026-06-10 · Branch: `claude/youthful-galileo-118uiv`
Source: external code review, audited claim-by-claim against the actual codebase
(Next.js 16.2.7 — APIs verified against the bundled docs in
`node_modules/next/dist/docs/`, per AGENTS.md).

Companion visual version: [`improvement-plan.html`](./improvement-plan.html)
(open locally or via https://htmlpreview.github.io/ — GitHub shows raw HTML as
source).

---

## 1. Review audit — what's actually true

Every claim was verified against the code before planning. Three claims were
wrong or overstated; acting on them blindly would have wasted time or
introduced a deprecated API.

| # | Claim | Verdict | Evidence |
|---|-------|---------|----------|
| 1 | `sharp` missing from `package.json` → **build will fail in CI/CD** | ⚠️ **Overstated** | `npm run build` passes (verified, exit 0). `sharp@0.34.5` resolves transitively via `next@16.2.7` (`npm ls sharp`). Real risk: hoisting isn't contractual — a Next upgrade or a strict package manager (pnpm) breaks it. Fix is still worth one line. |
| 2 | No `priority` prop on first images hurts LCP | ⚠️ **Right problem, wrong fix** | True that no image is prioritized (`components/Gallery.tsx`). But in Next 16 `priority` is **deprecated** in favor of `preload`, and the docs recommend `loading="eager"` / `fetchPriority="high"` when several images could be the LCP element (exactly our 2-column grid case). |
| 3 | `outline-none` on form inputs removes **all** focus indicators | ⚠️ **Overstated** | `components/ContactForm.tsx:69,79,89` — inputs also have `focus:border-neutral-900`, so a visible indicator exists (border darkens). It's weak, though; a `focus-visible` ring is the right upgrade. |
| 4 | Lightbox lacks a focus trap | ❓ **Unverified speculation** | `yet-another-react-lightbox` ships its own focus management. Needs a 5-minute keyboard test before any work is scheduled — likely a no-op. |
| 5 | Redundant `outputFileTracingExcludes` entry | ✅ Plausible, **low risk tolerance** | `next.config.ts:15-17` has two keys (`"/**/*"` and `"*"`) with identical globs. This config was load-bearing for the Vercel 300 MB function limit (see PLAN.md "deploy gotchas") — only remove one key with a verified deploy. |
| 6 | No sitemap / robots.txt | ✅ **Confirmed** | No `app/sitemap.*` or `app/robots.*` anywhere. Next 16 supports `app/sitemap.ts` + `app/robots.ts` file conventions. |
| 7 | No JSON-LD structured data | ✅ **Confirmed** | Nothing emits `application/ld+json`. Next docs recommend an inline `<script>` in `layout.tsx`/`page.tsx` with `<` escaped as `<`. |
| 8 | Form errors don't auto-clear | ✅ **Confirmed** | `ContactForm.tsx` clears `errorMsg` on submit but not when the user edits a field. |
| 9 | Nav `links` array recreated each render | ❌ **Wrong** | `components/Nav.tsx:6-12` — the array is already module-level, outside the component. No action. |
| 10 | Misleading `lightboxIndex` comment in Gallery.tsx | ❌ **Not found** | No comment about `lightboxIndex` exists in the current file. The comments that do exist (layout modes, mobile column) are accurate. No action. |

**Additional findings the review missed** (from this audit):

- **A. Fade-in delays LCP.** Tiles render `opacity-0` until `onLoad`
  (`Gallery.tsx:52-54`). Browsers exclude invisible elements from LCP
  candidacy, so the measured LCP is pushed past the fade — this likely costs
  more LCP than the missing preload does. The fix interacts with item 2 and
  should be handled together.
- **B. Form status is invisible to screen readers.** Success/error messages
  swap in visually but aren't announced (`role="status"` / `aria-live`
  missing). Cheap fix, pairs with the focus-ring work.
- **C. The intentional no-`description` metadata** (WhatsApp share-card
  workaround, documented in `app/layout.tsx:22-26`) must be preserved by any
  SEO work. JSON-LD and sitemap don't emit `<meta name="description">`, so
  they're safe; just don't "fix" the missing description while in there.

---

## 2. The plan

Ordered by user impact relative to effort. Each phase is independently
shippable; stop anywhere and the site is strictly better.

### Phase 1 — Dependency correctness *(~5 min, do first)*

The cheapest insurance in the repo.

- [x] Add `sharp` to `dependencies` in `package.json`
      (`npm install sharp` — pins the version we already rely on for
      `lib/photos.ts` and `scripts/resize.mjs`).
- **Acceptance:** `npm ls sharp` shows it as a direct dependency;
  `npm run build` still green.

### Phase 2 — Perceived performance / LCP *(~1–2 h)*

The homepage is the storefront; the first paint of the first photos is the
whole first impression.

- [x] Pass an `eager`/priority hint to the first tiles from `Gallery.tsx`:
      `fetchPriority="high"` + `loading="eager"` on roughly the first 2
      images per column (first 1–2 on mobile). **Use the Next 16 APIs — not
      the deprecated `priority` prop.** A `preload` on the single first image
      is optional; docs warn against preloading several candidates.
- [x] Exempt those first tiles from the `opacity-0 → onLoad` fade (finding A),
      or shorten the fade for them, so the LCP element paints visible.
- [x] Sanity-check the `sizes` attribute (`(max-width: 640px) 100vw, 640px`)
      against the actual rendered width at `max-w-7xl` two-column layout —
      verified: column renders at ~604 px (1280 − 2×24 padding − 24 gap, ÷2),
      so 640 is correctly conservative; kept as is.
- **Acceptance:** Lighthouse (mobile) LCP improves measurably on `/`;
  first-viewport photos no longer flash from blank; no deprecation warnings
  in build output.
- **Shipped & verified in prerendered output:** 4 `<link rel="preload"
  as="image" fetchPriority="high">` head tags (one per eager photo, deduped
  across the two layout copies); 8 `loading="eager"` imgs; eager tiles SSR
  with `opacity-100`; remaining 37 photos stay lazy with the fade. Lighthouse
  run still pending on a real deploy.

### Phase 3 — Accessibility *(~1–2 h)*

- [x] Replace `outline-none` on the three form fields with a visible
      keyboard-focus treatment, keeping the existing border-darken style.
- [x] Cover gallery tiles, nav links, Send, BackToTop, footer link too.
      **Implemented as a single global `:focus-visible { outline }` rule in
      `globals.css`** rather than per-element utilities — one source of truth,
      nothing missed, and it also styles the lightbox's own buttons. (Decided
      against the per-element `focus-visible:ring-*` approach the plan
      sketched.)
- [x] Announce form status: `role="status"` on the success panel,
      `role="status"` + `aria-live="polite"` on the error paragraph
      (finding B).
- [x] Clear the form error when the user edits any field (review item 8) —
      `onChange` on the `<form>` resets `status`/`errorMsg` when in error.
- [x] **Verified, no work needed:** lightbox source confirms `role="dialog"`
      + `aria-modal="true"` + `aria-label` (screen readers announce it),
      `restoreFocus.current = event.relatedTarget` (focus returns to the
      trigger on close), and Escape-to-close. Review finding #4 resolves as a
      no-op, as predicted.
- **Acceptance:** ✅ global focus outline compiled into the production CSS;
  zero `outline-none` left in output; lint + build green. Form-status ARIA is
  client-only state (correctly absent from static prerender). A manual
  screen-reader/keyboard pass on a real deploy is still worth doing.

### Phase 4 — SEO *(~1–2 h)*

All three items must respect finding C (no `description` meta tags).

- [x] `app/robots.ts` — allow all, point at the sitemap. Verified output:
      `User-Agent: * / Allow: / / Sitemap: https://adamzvulun.com/sitemap.xml`.
- [x] `app/sitemap.ts` — the five static routes on the
      `https://adamzvulun.com` base, with changeFrequency/priority hints
      (galleries monthly @0.8, home monthly @1.0, contact yearly @0.5).
      Verified valid `<urlset>` XML in the build output.
- [x] JSON-LD `Person` in `app/layout.tsx` — name, url, `jobTitle:
      "Photographer"`, `image: og.jpg`, `sameAs` the real Instagram from the
      footer. Inline `<script type="application/ld+json">` with `<` escaped
      to `<` per the Next docs. Renders on every page (it's in the
      layout). Per-gallery `ImageGallery` schema deferred as the optional
      follow-up.
- **Acceptance:** ✅ `/robots.txt` and `/sitemap.xml` serve from the build;
  JSON-LD is valid escaped JSON on every page; homepage still emits **zero**
  `meta name="description"` — WhatsApp workaround intact.
- **Observed (not actioned — needs your call):** the gallery + contact pages
  each emit their *own* `meta name="description"` from page-level metadata,
  which pre-dates this work but contradicts the "no description anywhere"
  comment in `layout.tsx`. The bare domain (the URL most likely to be shared)
  stays clean, so the WhatsApp card is unaffected. Left as-is; flag if you
  want those removed for consistency.

### Phase 5 — Cleanup *(~30 min, lowest priority)*

- [ ] Deduplicate `outputFileTracingExcludes` in `next.config.ts` — keep one
      key, then **verify the Vercel function size on the preview deploy**
      before merging (this setting previously guarded a 559 MB → <300 MB
      fix; treat it as load-bearing).
- [ ] Update `PLAN.md` per its own convention (move items, refresh "Last
      updated").
- **Acceptance:** Vercel preview deploy succeeds with function size well
  under the 300 MB limit.

### Explicitly not doing

- Nav `links` hoisting (already done — review was wrong).
- Fixing the "misleading lightboxIndex comment" (doesn't exist).
- Adding `<meta name="description">` anywhere (intentional omission;
  documented WhatsApp workaround).
- Pre-emptive lightbox focus-trap work — verified done by the library
  (`role="dialog"`, `aria-modal`, focus restore, Escape); no action taken.

---

## 3. Suggested sequencing

```
Phase 1 (5 min) ─► Phase 2 (LCP) ─► Phase 3 (a11y) ─► Phase 4 (SEO) ─► Phase 5 (cleanup)
   hygiene          biggest user      real-user          discoverability    verify-gated
                    impact            correctness
```

One PR per phase keeps reviews small and each deploy verifiable. Phases 2+3
touch `Gallery.tsx`/`ContactForm.tsx` independently and could be parallel if
desired.

## 4. Verification notes (how this plan was grounded)

- `npm run build` run on a clean install: **passes** — basis for downgrading
  the sharp claim from "critical" to "hygiene".
- `npm ls sharp` → `next@16.2.7 └── sharp@0.34.5` (transitive).
- `priority` deprecation + `preload`/`fetchPriority` guidance: bundled docs,
  `node_modules/next/dist/docs/01-app/03-api-reference/02-components/image.md`.
- Sitemap/robots/JSON-LD conventions: bundled docs under
  `03-file-conventions/01-metadata/` and `02-guides/json-ld.md`.
