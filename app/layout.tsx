import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import "./globals.css";

const serif = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const sans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Adam Zvulun — Photography",
  description: "Photography portfolio of Adam Zvulun.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-neutral-900">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
