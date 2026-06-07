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
const description = "Photography portfolio of Adam Zvulun.";

export const metadata: Metadata = {
  // Absolute base so relative metadata URLs resolve to the production domain
  // when links are shared.
  metadataBase: new URL("https://adamzvulun.com"),
  title,
  // The SEO description is emitted via `other` (below) rather than the
  // top-level `description` field on purpose: Next auto-copies a top-level
  // description into og:description / twitter:description, which would put a
  // subtitle line on the share card. Routing it through `other` keeps the
  // <meta name="description"> tag for search engines without feeding the card.
  other: { description },
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

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${montserrat.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-neutral-900">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
        <BackToTop />
        <Analytics />
      </body>
    </html>
  );
}
