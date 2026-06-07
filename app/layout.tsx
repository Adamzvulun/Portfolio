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
  // Absolute base so opengraph-image / twitter-image and other relative
  // metadata URLs resolve to the production domain when links are shared.
  metadataBase: new URL("https://adamzvulun.com"),
  title,
  description,
  openGraph: {
    title,
    description,
    url: "/",
    siteName: "Adam Zvulun",
    type: "website",
    // Explicit absolute URL with no query string. Next's file-convention
    // opengraph-image.jpg also emits a tag (which most scrapers handle), but
    // WhatsApp's scraper can choke on the cache-busting `?hash` suffix and
    // drop the preview image. Pointing it at a clean static copy is the
    // reliable path for WhatsApp.
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
    description,
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
