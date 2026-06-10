import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const title = "Adam Zvulun — Photography";

export const metadata: Metadata = {
  // Absolute base so relative metadata URLs resolve to the production domain
  // when links are shared.
  metadataBase: new URL("https://adamzvulun.com"),
  title,
  // No `description` anywhere on purpose. Link-preview scrapers (WhatsApp,
  // etc.) fall back to <meta name="description"> when og:description is
  // absent, so any description tag would reappear as a subtitle on the share
  // card. Omitting it entirely keeps the card to image + title; search
  // engines just generate a snippet from page content.
  openGraph: {
    title,
    siteName: "Adam Zvulun",
    type: "website",
    // Explicit absolute URL with no query string — WhatsApp's scraper can
    // choke on the cache-busting `?hash` suffix Next adds to file-convention
    // images, so we point at a clean static copy in /public.
    // No `url` (og:url) on purpose: a canonical og:url makes WhatsApp dedupe
    // every `?param` test link back to the bare domain's cached entry.
    images: [
      {
        url: "https://adamzvulun.com/og.jpg",
        width: 1200,
        height: 630,
        alt: "Adam Zvulun — Photography",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    images: ["https://adamzvulun.com/og.jpg"],
  },
};

// Person structured data so search engines (and AI crawlers) can connect the
// site to Adam as a photographer. No `description` field — see the metadata
// note above; JSON-LD doesn't emit a <meta name="description">, so the
// WhatsApp share-card workaround is unaffected.
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Adam Zvulun",
  url: "https://adamzvulun.com",
  jobTitle: "Photographer",
  image: "https://adamzvulun.com/og.jpg",
  sameAs: ["https://www.instagram.com/fouzi_bukhtar/"],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${montserrat.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-neutral-900">
        {/* `<` escaped per Next's JSON-LD guidance to prevent HTML injection. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
        <BackToTop />
        <Analytics />
      </body>
    </html>
  );
}
