"use client";

import Link from "next/link";
import { useMemo } from "react";
import { groupBySchool, listedPractices, useAddedPractices } from "@/lib/practices";
import { PracticeCard } from "./PracticeList";

export function SchoolPractices({ id }: { id: string }) {
  const { items: added } = useAddedPractices();
  const school = useMemo(
    () => groupBySchool([...added, ...listedPractices]).find((s) => s.id === id),
    [added, id],
  );

  if (!school) {
    return (
      <div className="mt-10 rounded-2xl border border-dashed border-line p-12 text-center">
        <p className="font-display text-2xl">We couldn&rsquo;t find that school.</p>
        <p className="mt-2 text-ink-2">
          <Link href="/#practices" className="font-semibold text-signal underline underline-offset-4">
            Back to all schools
          </Link>
        </p>
      </div>
    );
  }

  const n = school.practices.length;
  return (
    <>
      <header className="animate-rise pb-4 pt-8">
        <span className="label inline-block rounded-full bg-card px-3 py-1.5 text-signal shadow-sm">{school.kind}</span>
        <h1 className="mt-5 font-display text-[clamp(2.4rem,5vw,4rem)] leading-[1]">{school.name}</h1>
        <p className="label mt-4 text-mute">
          {n} {n === 1 ? "practice" : "practices"} · {school.categories.length}{" "}
          {school.categories.length === 1 ? "category" : "categories"}
        </p>
        {school.categories.length > 1 && (
          <nav className="mt-6 flex flex-wrap gap-2" aria-label="Categories">
            {school.categories.map((c, i) => (
              <a
                key={c.name}
                href={`#cat-${i}`}
                className="rounded-full border border-line bg-card px-3.5 py-1.5 text-sm font-medium transition-colors hover:border-ink/40"
              >
                {c.name}
              </a>
            ))}
          </nav>
        )}
      </header>

      {school.categories.map((c, i) => (
        <section key={c.name} id={`cat-${i}`} className="mt-10 scroll-mt-28">
          <h2 className="flex items-baseline gap-3 font-display text-3xl">
            {c.name}
            <span className="label text-mute">{c.practices.length}</span>
          </h2>
          <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {c.practices.map((p) => (
              <li key={p.id}>
                <PracticeCard p={p} />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </>
  );
}
