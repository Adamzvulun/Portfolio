# Portfolio

Personal photography portfolio for Adam Zvulun.
Built with [Next.js](https://nextjs.org) (App Router) + [Tailwind CSS](https://tailwindcss.com).
Deployed on [Vercel](https://vercel.com).

## Pages

- `/` — Home (selected work)
- `/automotive`, `/architecture`, `/portraits`, `/wildlife` — category galleries
- `/contact` — contact form (Formspree)

## Run locally

```bash
npm install
npm run dev
# open http://localhost:3000
```

## Adding photos

The site auto-discovers everything in `public/images/<category>/`. But
camera originals are 20–50 MB each — way too big for GitHub (100 MB hard
limit) and pointless for the web. So the workflow is:

1. **Drop originals** into `raw-photos/<category>/` (this folder is
   gitignored — originals stay on your machine, never get committed)
2. **Run the resize script** — it shrinks each photo to 2400px long edge,
   JPEG quality 82, and writes the optimized version into
   `public/images/<category>/`:
   ```bash
   npm run resize
   ```
   Typical reduction: 30 MB → ~500 KB. Indistinguishable on any screen.
3. **Commit + push** `public/images/` — the small optimized JPEGs only.

The first time you run `npm run resize`, it creates the
`raw-photos/<category>/` folder structure for you. Subsequent runs skip
files whose output is already up-to-date, so re-running is cheap.

### Folders

- `public/images/home/` — featured photos on the landing page
- `public/images/automotive/`
- `public/images/architecture/`
- `public/images/portraits/`
- `public/images/wildlife/`

Supported input formats: `.jpg`, `.jpeg`, `.png`, `.tif`, `.tiff`,
`.webp`, `.heic`, `.heif`, `.avif`. All output as `.jpg`.

### Controlling the order

Files are sorted alphabetically (with smart number handling). To reorder,
prefix filenames with numbers:

```
raw-photos/automotive/
  01-porsche-front.jpg
  02-porsche-side.jpg
  03-porsche-engine.jpg
```

The grid lays out top-to-bottom, left-to-right across two columns, so
`01-` appears top-left, then the rest flow down. To move a photo, just
rename — change `02-` to `04-` and `04-` to `02-`, run `npm run resize`
again, save. Done.

### Alt text (accessibility / SEO)

Alt text is derived from the filename — the leading number, dashes, and
underscores are stripped. So `01-golden-hour-rooftop.jpg` becomes
`"golden hour rooftop"`. Name files descriptively.

## Contact form (Formspree)

The form on `/contact` submits to [Formspree](https://formspree.io). To enable it:

1. Sign up at https://formspree.io (free, 50 submissions / month).
2. Create a new form, copy the form ID (the part after `/f/` in the form URL).
3. Locally: copy `.env.local.example` to `.env.local` and paste the ID:
   ```
   NEXT_PUBLIC_FORMSPREE_ID=xyzabcd
   ```
4. On Vercel: Project Settings → Environment Variables → add `NEXT_PUBLIC_FORMSPREE_ID`.

Until set, the form shows a friendly "not yet configured" notice.

## Deploy to Vercel

1. Push this repo to GitHub.
2. Go to https://vercel.com/new, sign in with GitHub, import the `Portfolio` repo.
3. Vercel auto-detects Next.js — leave all defaults, click Deploy.
4. Add the `NEXT_PUBLIC_FORMSPREE_ID` env var under Project Settings.
5. Every `git push` to your default branch redeploys. PR branches get preview URLs.

## Project layout

```
app/
  layout.tsx            shared shell (nav + footer + fonts)
  page.tsx              home
  <category>/page.tsx   gallery pages (4)
  contact/page.tsx      contact form
components/
  Nav.tsx               top navigation
  Footer.tsx            footer
  Gallery.tsx           image grid + lightbox
  ContactForm.tsx       Formspree-backed form
lib/
  galleries.ts          single source of truth: photos per category
public/
  images/               photo files
```

## Scripts

- `npm run dev` — local dev server (hot reload)
- `npm run build` — production build (run before deploying / to catch errors)
- `npm run start` — serve the production build locally
- `npm run lint` — ESLint
