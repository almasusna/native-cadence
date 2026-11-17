import type { Metadata } from "next";
import Link from "next/link";
import { ExchangeBoard } from "@/components/ExchangeBoard";
import { Arrow } from "@/components/ui";

export const metadata: Metadata = { title: "The Exchange — Native Cadence" };

export default function ExchangePage() {
  return (
    <div className="mx-auto max-w-[1320px] px-5 md:px-8">
      <header className="grid gap-10 border-b-[1.5px] border-ink pb-12 pt-12 md:grid-cols-[1.5fr_1fr] md:items-end">
        <div className="animate-rise">
          <div className="label text-mute">Community scenarios</div>
          <h1 className="mt-4 font-display text-[clamp(3rem,7.5vw,6.8rem)] leading-[0.88] tracking-[-0.02em]">
            The <span className="italic">Exchange</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-2">
            Packs written by people who’ve sat on the other side of the table. One flat monthly price per
            creator, cancel any time.
          </p>
        </div>

        <aside className="stub relative border-[1.5px] border-ink bg-marker p-7 hard-shadow">
          <div className="label">For creators</div>
          <p className="mt-3 font-display text-[2.1rem] leading-[1.02]">
            Know what they really ask? <span className="italic">Get paid for it.</span>
          </p>
          <p className="mt-3 text-sm leading-relaxed">
            Set your price (~$5/mo). Keep <b>70%</b> of every subscriber, every month.
          </p>
          <Link href="/studio#new" className="btn btn-ink mt-5">
            Write your first scenario <Arrow />
          </Link>
        </aside>
      </header>

      <ExchangeBoard />
    </div>
  );
}
