# Portfolio — Plan

Living checklist of what's done and what's still open. Each Claude session
should update this file as part of its work.

Last updated: audited external code review → improvement plan in
`plans/improvement-plan.md` (+ visual `plans/improvement-plan.html`)

---

## Done

### Scaffolding
- [x] Next.js 16 + Tailwind v4 + TypeScript scaffolded into the repo
- [x] App Router structure under `app/`
- [x] Top-centered "ADAM ZVULUN" title + nav bar (Gallery / Architecture /
      Portraits / Wildlife / Contact)
- [x] Footer ("© All rights reserved", centered)
- [x] Back-to-top button (fixed bottom-right, fades in after 400px scroll)
- [x] Montserrat font to match the Format "Amazon" template typography

### Galleries
- [x] Auto-discovery of photos from `public/images/<category>/`
      (`lib/photos.ts` + `image-size`)
- [x] EXIF rotation fix — swaps width/height for orientations 5-8 so
      sideways shots render correctly
- [x] Two layout modes: `paired` (deterministic, odd→left, even→right)
      and `balance` (CSS columns, browser-balanced)
- [x] Per-page layout assignment:
      home = `paired`; portraits / wildlife / architecture = `balance`
- [x] Click-to-enlarge lightbox (`yet-another-react-lightbox`)
- [x] Photos sort alphabetically with smart-number prefix (`NN-name.ext`)
- [x] Alt text derived from filename (strips prefix, replaces dashes)

### Content (committed photos)
- [x] Home: 41 photos, first 6 user-picked, rest VV/LL pair-balanced
- [x] Portraits: 11 photos, user-ordered (top 2: moonlit standing + bench)
- [x] Wildlife: 10 photos, user-ordered (top 2: tiger close-up + bumblebees)
- [x] Architecture: 14 photos committed

### Tooling
- [x] `npm run dev` / `build` / `start` / `lint` working
- [x] `npm run resize` script for batch-shrinking originals (not in use —
      user pushes full-res for now)
- [x] `raw-photos/` gitignored for if/when resize gets used

### Repo / dev workflow
- [x] On branch `claude/stoic-fermi-qBOF2` (per session rules)
- [x] `.env.local.example` committed for Formspree ID
- [x] `HANDOFF.md` written for next session
- [x] `PLAN.md` (this file)

---

## Open

### Done since last session
- [x] **Deployed to Vercel** — live at
      https://portfolio-bay-tau-87.vercel.app. Production branch is `main`.
      Two fixes were needed (see "Vercel deploy gotchas" below).
- [x] **Architecture photos** — 14 committed.

### Improvement plan (new — see `plans/improvement-plan.md`)
- [ ] Phase 1: declare `sharp` as a direct dependency (build currently passes
      via next's transitive dep — verified — but hoisting isn't contractual)
- [ ] Phase 2: LCP — `fetchPriority`/`loading="eager"` on first tiles
      (NOT the deprecated `priority` prop) + exempt them from the fade-in
- [ ] Phase 3: a11y — focus-visible rings, aria-live form status,
      error auto-clear, lightbox keyboard verification
- [ ] Phase 4: SEO — `app/sitemap.ts`, `app/robots.ts`, JSON-LD Person
      (must preserve the intentional no-meta-description WhatsApp workaround)
- [ ] Phase 5: dedupe `outputFileTracingExcludes` (verify-gated on a
      Vercel preview deploy — that config is load-bearing)

### Content gaps
- [ ] **More home picks** if user wants — easy to insert with the NN-prefix
      rename flow.

### Vercel deploy gotchas (already solved — keep for reference)
- The first import deployed the *empty* initial commit, so Vercel guessed the
  framework as "Other" and just served `public/` statically → every route 404'd.
  Fixed by pinning the framework in `vercel.json` (`"framework": "nextjs"`).
- Once `next build` ran, the serverless function was 559MB (Next traced the
  whole ~560MB `public/images` folder into it) → exceeded Vercel's 300MB limit.
  Fixed with `outputFileTracingExcludes` in `next.config.ts` — pages are static
  and images come from the CDN, so the function doesn't need the bytes.
- Production deployments must have **Deployment Protection OFF** (Settings) so
  the public can view the site without logging into Vercel.
- Vercel's UI hid the "Production Branch" setting, so we set `main` as the live
  branch by merging the feature branch into `main` and deploying that.

### Contact form
- [ ] **Sign up for Formspree** (free tier, no credit card)
- [ ] **Paste the form ID** into `NEXT_PUBLIC_FORMSPREE_ID` (Vercel env var,
      AND locally in `.env.local` if testing). Form shows a "not yet
      configured" notice until then.

### Polish (nice to have, not asked for)
- [ ] **Custom domain** — buy one, point at Vercel
- [ ] **Mobile QA** — site is responsive but unverified on a real device
- [ ] **Favicon** — currently Next.js default; replace with something custom
      (e.g. a monogram)
- [ ] **Page transitions** — could add subtle fade-in on route changes
- [ ] **Social links** in footer (Instagram, etc.) if user wants them
- [ ] **About page** — user said no for now, easy to add later

### Tech debt / known quirks
- [ ] None blocking. The bash octal gotcha (`printf "%02d" 09` fails) is
      documented in HANDOFF.md.
- [ ] Repo is ~370 MB because user pushes 10-30 MB photo originals. Not a
      problem today but watch GitHub's repo-size soft warnings (5 GB).

### Decisions on hold (won't do without user nudge)
- [ ] Drag-and-drop reorder UI — rejected (would need backend or be
      browser-local only)
- [ ] Image CDN (Cloudinary/Imgix) — not yet justified at this size
- [ ] CMS — not yet justified; `git mv` + push is fine
- [ ] Blog / journal — user not interested

---

## How to keep this file fresh

Every session that ships a meaningful change should:
1. Move the matching bullet from **Open** to **Done**, OR add a new one.
2. Update the "Last updated" line at the top with a one-line summary.
3. Commit the file alongside the change so history shows the progress.
