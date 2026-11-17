"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, Logo } from "./ui";
import { me } from "@/lib/data";

const nav = [
  { href: "/", label: "Stages" },
  { href: "/exchange", label: "Exchange" },
  { href: "/phrasebook", label: "Phrasebook" },
  { href: "/studio", label: "Studio" },
];

const ticker = [
  "IELTS Part 2 — 2026 cue cards just dropped",
  "Layla H. published 4 new cabin-crew scenarios",
  "Most rehearsed today: “Tell me about yourself”",
  "Phrase of the day: “What I can do for you right now is…”",
  "1,284 people practising Qatar Airways finals this week",
  "Creators earned $41,920 on the Exchange in October",
];

export function SiteHeader() {
  const path = usePathname();
  const active = (href: string) =>
    href === "/" ? path === "/" || path.startsWith("/events") || path.startsWith("/practice") : path.startsWith(href);

  return (
    <header className="sticky top-0 z-40 bg-paper/92 backdrop-blur-[2px]">
      {/* broadcast ticker */}
      <div className="flex h-8 items-center overflow-hidden border-b border-ink bg-ink text-paper">
        <span className="label z-10 flex h-full shrink-0 items-center gap-2 bg-signal px-3 text-card">
          <span className="h-1.5 w-1.5 animate-onair rounded-full bg-card" />
          Live
        </span>
        <div className="relative flex-1 overflow-hidden">
          <div className="flex w-max animate-ticker">
            {[...ticker, ...ticker].map((t, i) => (
              <span key={i} className="label whitespace-nowrap px-6 text-paper/80">
                {t} <span className="ml-6 text-signal">✦</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto flex h-16 max-w-[1320px] items-center justify-between gap-6 border-b border-ink px-5 md:px-8">
        <Link href="/" aria-label="Native Cadence home">
          <Logo />
        </Link>

        <nav className="hidden items-center md:flex">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`relative px-4 py-2 text-[0.92rem] font-medium transition-colors ${
                active(n.href) ? "text-ink" : "text-mute hover:text-ink"
              }`}
            >
              {active(n.href) && (
                <span className="absolute inset-x-3 -bottom-[13px] h-[3px] bg-signal" />
              )}
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <div className="hidden text-right sm:block">
            <div className="label text-mute">Streak</div>
            <div className="font-display text-xl leading-none">
              {me.streak} <span className="text-base italic text-mute">days</span>
            </div>
          </div>
          <Avatar initials={me.initials} />
        </div>
      </div>

      {/* mobile nav */}
      <nav className="flex border-b border-ink md:hidden">
        {nav.map((n) => (
          <Link
            key={n.href}
            href={n.href}
            className={`label flex-1 py-3 text-center ${
              active(n.href) ? "bg-ink text-paper" : "text-ink-2"
            }`}
          >
            {n.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-ink bg-ink text-paper">
      <div className="mx-auto grid max-w-[1320px] gap-10 px-5 py-14 md:grid-cols-[1.4fr_1fr_1fr] md:px-8">
        <div>
          <p className="font-display text-5xl leading-[0.95]">
            Say it badly here,
            <br />
            <span className="italic text-signal">so you say it well there.</span>
          </p>
        </div>
        <div className="space-y-2 text-sm text-paper/70">
          <div className="label mb-3 text-paper">Practice</div>
          <Link href="/" className="block hover:text-paper">All stages</Link>
          <Link href="/phrasebook" className="block hover:text-paper">Phrasebook drills</Link>
          <Link href="/exchange" className="block hover:text-paper">Community scenarios</Link>
        </div>
        <div className="space-y-2 text-sm text-paper/70">
          <div className="label mb-3 text-paper">Create</div>
          <Link href="/studio" className="block hover:text-paper">Creator studio</Link>
          <Link href="/studio#new" className="block hover:text-paper">Write a scenario</Link>
          <span className="block">Payouts · 70% to creators</span>
        </div>
      </div>
      <div className="border-t border-paper/15">
        <div className="label mx-auto flex max-w-[1320px] justify-between px-5 py-4 text-paper/50 md:px-8">
          <span>© 2026 Native Cadence</span>
          <span>Transcription & feedback powered by Groq</span>
        </div>
      </div>
    </footer>
  );
}
