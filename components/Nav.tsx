"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Gallery" },
  { href: "/architecture", label: "Architecture" },
  { href: "/portraits", label: "Portraits" },
  { href: "/wildlife", label: "Wildlife" },
  { href: "/contact", label: "Contact" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <header className="pt-16 sm:pt-28 pb-16 text-center">
      <Link
        href="/"
        className="inline-block text-4xl sm:text-4xl font-bold uppercase tracking-wider text-neutral-900 hover:text-neutral-700 transition-colors"
      >
        Adam Zvulun
      </Link>

      <nav className="mt-6 flex flex-wrap justify-center gap-x-8 gap-y-3 text-xs uppercase tracking-[0.2em]">
        {links.map((l) => {
          const active = pathname === l.href;
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`transition-colors ${
                active
                  ? "text-neutral-900"
                  : "text-neutral-400 hover:text-neutral-900"
              }`}
            >
              {l.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
