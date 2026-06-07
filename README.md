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

1. Drop image files into `public/images/<category>/` (e.g. `public/images/portraits/dana-001.jpg`).
2. Open `lib/galleries.ts` and add an entry to the appropriate gallery's `photos` array:
   ```ts
   {
     src: "/images/portraits/dana-001.jpg",
     alt: "Dana, golden hour",
     width: 1600,
     height: 1067,
   }
   ```
   `width` / `height` should be the photo's real dimensions (or any pair with the correct aspect ratio).
3. Save — the dev server reloads automatically.

The home page reads from the `featured` array in the same file.

### Recommended photo sizes
- Long edge ~2000px, JPEG quality ~80, sRGB.
- Next.js handles responsive sizing and WebP conversion automatically.

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
