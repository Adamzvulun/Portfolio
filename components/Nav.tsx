"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/automotive", label: "Automotive" },
  { href: "/architecture", label: "Architecture" },
  { href: "/portraits", label: "Portraits" },
  { href: "/wildlife", label: "Wildlife" },
  { href: "/contact", label: "Contact" },
];

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-neutral-200">
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="text-xl font-bold uppercase tracking-wider text-neutral-900 hover:text-neutral-600 transition-colors"
          onClick={() => setOpen(false)}
        >
          Adam Zvulun
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm uppercase tracking-widest">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`hover:text-neutral-900 transition-colors ${
                  active ? "text-neutral-900 underline underline-offset-8" : "text-neutral-500"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <button
          aria-label="Toggle menu"
          aria-expanded={open}
          className="md:hidden p-2 -mr-2"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="block w-6 h-px bg-neutral-900 mb-1.5" />
          <span className="block w-6 h-px bg-neutral-900 mb-1.5" />
          <span className="block w-6 h-px bg-neutral-900" />
        </button>
      </div>

      {open && (
        <nav className="md:hidden border-t border-neutral-200 px-6 py-4 flex flex-col gap-4 text-sm uppercase tracking-widest">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={pathname === l.href ? "text-neutral-900" : "text-neutral-500"}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
