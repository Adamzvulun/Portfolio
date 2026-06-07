# Handoff — Adam Zvulun Portfolio

Context document for the next Claude session. Read this before doing anything.

## What this is

Personal photography portfolio for **Adam Zvulun** (adam.zvulun@gmail.com).
Recreating a [Format.com Amazon template](https://www.format.com/website-templates/amazon)
style portfolio from scratch in this repo. User is **not a developer** — explain
things plainly, never assume he'll edit code himself.

## The user

- New to web dev. Has used Format.com before, otherwise no prior experience.
- Walks through every git command — he's learning as he goes. Be patient.
- Pushes from a Windows machine (`C:\Users\adamz\Portfolio`).
- Very specific about photo placement; prefers minimal scope changes. He
  reverted a large overhaul once with the words "i did not tell you to rethink
  the whole design". Do exactly what he asks, no more.
- Communicates by attaching screenshots with red arrows / circles. Look at
  the images carefully — that's the source of truth.

## Stack & deploy

- **Next.js 16.2.7** (App Router, no `src/` dir, TypeScript) + **Tailwind v4**
- **CRITICAL**: Tailwind v4 has no `tailwind.config.ts` — theme lives in
  `app/globals.css` under `@theme inline`. Same for any Next.js 16 quirks —
  read `node_modules/next/dist/docs/` before assuming pre-15 patterns.
- Lightbox: `yet-another-react-lightbox` (do not swap)
- Dimension reader: `image-size` (returns EXIF orientation in `.orientation`)
- Image processor: `sharp` (peer dep of Next.js, used by `scripts/resize.mjs`)
- Branch: **`claude/stoic-fermi-qBOF2`** (never push to main without permission)
- Hosting: **Vercel** is the plan, but **not yet connected** as of this handoff.
  User still needs to import the repo at vercel.com/new.

## Site structure

```
app/
  layout.tsx              centered Adam Zvulun title + nav + footer + BackToTop
  page.tsx                / — home, featured gallery (paired layout)
  architecture/page.tsx   /architecture (balance layout, empty)
  portraits/page.tsx      /portraits (balance layout)
  wildlife/page.tsx       /wildlife (balance layout)
  contact/page.tsx        /contact — Formspree form (not yet configured)
components/
  Nav.tsx                 centered title + 5 nav links (Gallery / Architecture /
                          Portraits / Wildlife / Contact). "Gallery" links to /.
  Footer.tsx              "© All rights reserved" centered
  Gallery.tsx             two layouts via `layout` prop — see below
  BackToTop.tsx           fixed bottom-right button, appears after 400px scroll
  ContactForm.tsx         Formspree form, friendly notice if not configured
lib/
  galleries.ts            getGallery(slug) / getFeatured() — calls loadPhotos
  photos.ts               filesystem scan + dimension read + EXIF rotation fix
scripts/
  resize.mjs              npm run resize — batch-shrink raw photos. User does
                          NOT currently use it; he pushes originals.
public/images/
  home/                   featured gallery photos (currently 41)
  architecture/           empty (.gitkeep only)
  portraits/              11 photos
  wildlife/               10 photos
```

## The two layouts (key concept)

Gallery accepts a `layout` prop:

- **`layout="paired"`** (default) — `grid grid-cols-2` with manual flex columns.
  Odd index → left column, even → right column. Each row is a deterministic
  pair: photo 01 next to 02, 03 next to 04, etc. Use when user wants
  specific photos side by side.

- **`layout="balance"`** — `columns-2 [column-fill:_balance]`. CSS multi-column
  layout, browser picks the split point to balance column heights. Original
  layout. Better visually when ordering is loose; can't guarantee adjacent
  source positions render side by side.

Current per-page assignment (`app/<page>/page.tsx`):
| Page | Layout | Why |
|---|---|---|
| home (`/`) | `paired` (default) | user wants specific photo pairs side by side |
| portraits | `balance` | user prefers the masonry balance look |
| wildlife | `balance` | same |
| architecture | `balance` | empty, harmless |

Home photos are arranged in **VV / LL pairs** so each `paired` row has two
photos of similar height — keeps columns balanced. If you reshuffle home,
preserve this pairing rule or columns go uneven.

## Photo conventions

- **Files** live under `public/images/<category>/`.
- **Auto-discovery**: `lib/photos.ts` scans the folder at render time, reads
  dimensions with `image-size`, **handles EXIF orientation 5-8** by swapping
  width/height (many of user's phone shots are rotated). Don't break this.
- **Order = alphabetical** with smart-number sort. **Reorder by renaming files
  with `NN-` prefix** (e.g. `01-tiger.jpg`, `02-cat.jpg`). All photos already
  use this convention.
- **Alt text** is derived from the filename: strips leading `NN-`, replaces
  dashes/underscores with spaces.
- **Supported extensions**: `.jpg .jpeg .png .webp .avif .gif`. CR2 and other
  RAW formats are silently skipped — user dropped a CR2 once, was confused.
- **User pushes full-size originals (10-30 MB each)**. He explicitly rejected
  resizing. The repo is ~370 MB. Don't try to "optimize" without permission.
  `scripts/resize.mjs` exists for later if he changes his mind.

## Rearranging photos (the loop you'll spend the most time in)

When the user says "swap A and B" or "move A to the top":

1. **Use `git mv`** so history follows the rename (his repo is on Vercel-bound
   GitHub — clean history matters).
2. **Two-phase rename to avoid collisions**: move both files to `__tmp__`
   names first, then to their final `NN-base` names.
3. **Octal gotcha**: bash `printf "%02d" 09` errors with "invalid octal number".
   Always use `printf "%02d" "$((10#$n))"` to force base 10.
4. **Don't renumber unaffected files** unless the user says so — he gets
   annoyed when changes cascade beyond what he asked.

The "current order" matters for `paired` layout (home). For `balance` (others),
the position number is just the source order — visual position depends on
column heights.

## Things the user has asked for, decided against, or hasn't done

- **Contact form**: form code is in place, needs `NEXT_PUBLIC_FORMSPREE_ID`
  env var. User has not signed up for Formspree yet. Form shows a friendly
  "not yet configured" notice in the meantime.
- **Resize**: refuses to resize. Pushes originals.
- **Drag-and-drop reorder**: explicitly rejected (would need backend or only
  persist in his browser). Filename prefixes are the agreed mechanism.
- **Vercel deploy**: not done. Next step once he's happy with the look.
- **Architecture page**: empty. He hasn't shot any yet (or hasn't pushed any).
- **Custom domain**: not yet bought.
- **Mobile testing**: not done. Layout is responsive but unverified.

## Sub-flows worth knowing

- **Force-pushed once**: he asked me to revert a commit (`git reset --hard
  HEAD~1` + `git push --force-with-lease`). His local was rescued with
  `git fetch && git reset --hard origin/<branch>`. Safe to do again if he
  asks "go back one commit" — he understands the workflow.
- **GitHub web upload limit is 25 MB**, CLI is 100 MB. When he hit a "too
  large" error early on, he was using drag-drop in the browser.
- **Always pull before he makes changes** if a session intervenes — explain
  this when handing off a sequence of commands.

## Build / run

```bash
npm install
npm run dev        # localhost:3000
npm run build      # also a sanity check before pushing
npm run resize     # if he ever wants to start optimizing
```

Build should pass cleanly. If you see EXIF/dimension warnings about specific
photos, it's the rotation fix at `lib/photos.ts:25-30` catching weird files.

## Keep PLAN.md current

`PLAN.md` tracks done / open work. Every session that ships a meaningful
change should move bullets between sections and bump the "Last updated"
line. Commit it alongside the change.

## Tone

- Short replies. No headers or sections for trivial questions.
- Always end with the exact terminal commands for him to run on Windows.
- When making changes, push them yourself, then tell him to `git pull`.
- Beware of scope creep. When in doubt, do only what he asked.

## Latest state at handoff

- Home gallery has 41 photos with first 6 hand-picked by user:
  1. alfa ferrari upscaled (Italian motorsport museum)
  2. `.png (moonlit crouched skeleton)
  3. IMG_7708 (black cat in grass)
  4. dog instagram edited (dog splash)
  5. 20231015_021915 (close-up portrait)
  6. IMG_0332 (Colosseum)
  Positions 7-41 are VV/LL pair-balanced.
- Portraits (11 photos) and wildlife (10 photos) have their own user-picked
  order; layout is `balance`.
- Site builds cleanly, dev server boots, all routes return 200.
- Last commit on branch: per-gallery layout split (paired vs balance).
