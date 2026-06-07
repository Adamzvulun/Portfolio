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
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
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
