"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { EventSlug } from "@/lib/data";
import { categories, listedPractices, useAddedPractices, type PracticeItem } from "@/lib/practices";
import { Arrow, fmtTime } from "./ui";

export function PracticeList() {
  const { items: added } = useAddedPractices();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<EventSlug | "all">("all");
  const [provider, setProvider] = useState("all");

  const all = useMemo(() => [...added, ...listedPractices], [added]);
  const providers = useMemo(() => [...new Set(all.map((p) => p.provider))].sort(), [all]);

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return all.filter(
      (p) =>
        (cat === "all" || p.event === cat) &&
        (provider === "all" || p.provider === provider) &&
        (!needle ||
          [p.title, p.prompt, p.category, p.provider].some((f) => f.toLowerCase().includes(needle))),
    );
  }, [all, q, cat, provider]);

  const chip = (on: boolean) =>
    `rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
      on ? "border-ink bg-ink text-paper" : "border-line bg-card hover:border-ink/40"
    }`;

  return (
    <div>
      <div className="flex flex-col gap-3 md:flex-row">
        <label className="relative flex-1">
          <span className="sr-only">Search practices</span>
          <svg viewBox="0 0 24 24" fill="none" className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-mute" aria-hidden>
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
            <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="2" />
          </svg>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by topic, question, school or company…"
            className="h-14 w-full rounded-2xl border border-line bg-card pl-12 pr-4 text-base outline-none focus:border-signal focus:ring-4 focus:ring-signal/15"
          />
        </label>
        <label className="md:w-72">
          <span className="sr-only">School or company</span>
          <select
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
            className="h-14 w-full rounded-2xl border border-line bg-card px-4 text-base outline-none focus:border-signal focus:ring-4 focus:ring-signal/15"
          >
            <option value="all">All schools & companies</option>
            {providers.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" onClick={() => setCat("all")} className={chip(cat === "all")}>
          All
        </button>
        {categories.map((c) => (
          <button type="button" key={c.slug} onClick={() => setCat(c.slug)} className={chip(cat === c.slug)}>
            {c.title}
          </button>
        ))}
      </div>

      <p className="label mt-8 text-mute">
        {shown.length} {shown.length === 1 ? "practice" : "practices"}
      </p>

      {shown.length ? (
        <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((p) => (
            <li key={p.id}>
              <PracticeCard p={p} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-4 rounded-2xl border border-dashed border-line p-12 text-center">
          <p className="font-display text-2xl">Nothing matches that yet.</p>
          <p className="mt-2 text-ink-2">
            Run a school?{" "}
            <Link href="/schools" className="font-semibold text-signal underline underline-offset-4">
              Add your practices
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}

function PracticeCard({ p }: { p: PracticeItem }) {
  const body = (
    <>
      <div className="flex items-center justify-between gap-3">
        <span className="truncate text-sm font-semibold">{p.provider}</span>
        <span className="label shrink-0 rounded-full bg-paper px-2 py-0.5 text-mute">
          {p.pending ? "In review" : p.providerKind}
        </span>
      </div>
      <h3 className="mt-4 font-display text-2xl leading-tight">{p.title}</h3>
      <p className="mt-2 line-clamp-2 text-[0.95rem] leading-relaxed text-ink-2">{p.prompt}</p>
      <div className="mt-auto flex items-center justify-between gap-3 pt-5">
        <span className="label text-mute">
          {p.category} · {p.level} · {fmtTime(p.seconds)}
        </span>
        {!p.pending && (
          <span className="grid h-9 w-9 place-items-center rounded-full bg-signal text-card transition-transform group-hover:translate-x-1">
            <Arrow />
          </span>
        )}
      </div>
    </>
  );

  const cls = "cue group flex h-full flex-col p-5";
  return p.pending ? (
    <div className={`${cls} opacity-80`}>{body}</div>
  ) : (
    <Link href={`/practice/${p.id}`} className={`${cls} transition-transform hover:-translate-y-1`}>
      {body}
    </Link>
  );
}
