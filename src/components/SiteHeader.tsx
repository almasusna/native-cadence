"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./ui";

export function SiteHeader() {
  const path = usePathname();
  const onSchools = path.startsWith("/schools");

  return (
    <header className="sticky top-0 z-40 px-3 pt-3 md:px-6 md:pt-4">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-4 rounded-full border border-white/70 bg-white/70 pl-5 pr-2.5 shadow-[0_10px_30px_-14px_rgb(18_21_43/0.25)] backdrop-blur-xl md:pl-6">
        <Link href="/" aria-label="Native Cadence home">
          <Logo />
        </Link>
        <nav className="flex items-center gap-1">
          <Link
            href="/#practices"
            className="hidden rounded-full px-4 py-2 text-[0.92rem] font-medium text-mute transition-colors hover:text-ink sm:block"
          >
            Practices
          </Link>
          <Link
            href="/schools"
            className={`rounded-full px-4 py-2.5 text-[0.92rem] font-semibold transition-colors ${
              onSchools ? "bg-signal text-card" : "bg-ink text-paper hover:bg-signal"
            }`}
          >
            For schools
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mx-3 mb-3 mt-24 rounded-[2rem] bg-ink text-paper md:mx-6 md:mb-6">
      <div className="mx-auto flex max-w-[1200px] flex-col justify-between gap-8 px-6 py-12 md:flex-row md:items-end md:px-10">
        <p className="font-display text-4xl leading-[1.05]">
          Say it badly here,
          <br />
          <span className="text-marker">so you say it well there.</span>
        </p>
        <div className="flex gap-6 text-sm text-paper/70">
          <Link href="/#practices" className="hover:text-paper">Practices</Link>
          <Link href="/schools" className="hover:text-paper">For schools</Link>
        </div>
      </div>
      <div className="border-t border-paper/15">
        <div className="label mx-auto flex max-w-[1200px] justify-between px-6 py-4 text-paper/50 md:px-10">
          <span>© 2026 Native Cadence</span>
          <span>Speak. Review. Repeat.</span>
        </div>
      </div>
    </footer>
  );
}
