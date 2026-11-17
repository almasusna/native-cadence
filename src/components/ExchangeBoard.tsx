"use client";

import Link from "next/link";
import { useState } from "react";
import { creators, events, getEvent, scenarios, type EventSlug } from "@/lib/data";
import { Arrow, Avatar } from "./ui";

export function ExchangeBoard() {
  const [filter, setFilter] = useState<EventSlug | "all">("all");
  const [subs, setSubs] = useState<Record<string, boolean>>({ marcus: true });
  const [sort, setSort] = useState<"popular" | "rating">("popular");

  const list = creators
    .filter((c) => filter === "all" || c.event === filter)
    .sort((a, b) => (sort === "popular" ? b.subscribers - a.subscribers : b.rating - a.rating));
  const featured = creators[0];
  const featuredCues = scenarios.filter((s) => s.creatorId === featured.id);
  const monthly = creators.filter((c) => subs[c.id]).reduce((a, c) => a + c.price, 0);

  return (
    <>
      {/* featured */}
      <section className="mt-12 grid border-[1.5px] border-ink md:grid-cols-[1fr_1.2fr]">
        <div className="flex flex-col justify-between bg-moss p-8 text-card md:p-10">
          <div>
            <div className="label text-card/60">Featured creator · November</div>
            <div className="mt-6 flex items-center gap-4">
              <Avatar initials={featured.initials} className="h-14 w-14 text-sm" />
              <div>
                <div className="font-display text-3xl">{featured.name}</div>
                <div className="text-sm text-card/70">{featured.credential}</div>
              </div>
            </div>
            <p className="mt-8 font-display text-[2.4rem] italic leading-[1.05]">
              “Recruiters decide in the first ninety seconds. I wrote these so your first ninety are
              rehearsed.”
            </p>
          </div>
          <div className="label mt-8 flex gap-6 text-card/70">
            <span>{featured.subscribers.toLocaleString("en-US")} subscribers</span>
            <span>★ {featured.rating}</span>
          </div>
        </div>
        <div className="flex flex-col bg-card">
          <div className="border-b border-ink p-8">
            <div className="label text-mute">{getEvent(featured.event)?.title}</div>
            <h2 className="mt-2 font-display text-4xl leading-tight">{featured.packTitle}</h2>
            <p className="mt-2 text-ink-2">{featured.packBlurb}</p>
          </div>
          <ul className="flex-1">
            {featuredCues.map((s, i) => (
              <li key={s.id} className="flex items-center justify-between gap-4 border-b border-dashed border-ink/30 px-8 py-4">
                <span className="flex items-baseline gap-4">
                  <span className="font-mono text-xs text-mute">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-medium">{s.title}</span>
                </span>
                {s.locked && !subs[featured.id] ? (
                  <span className="label text-mute">Locked</span>
                ) : (
                  <Link href={`/practice/${s.id}`} className="label text-signal hover:underline">
                    Rehearse →
                  </Link>
                )}
              </li>
            ))}
            <li className="px-8 py-4 text-sm italic text-mute">
              + {featured.scenarioCount - featuredCues.length} more cues in the pack
            </li>
          </ul>
          <SubscribeBar
            price={featured.price}
            on={!!subs[featured.id]}
            onToggle={() => setSubs((p) => ({ ...p, [featured.id]: !p[featured.id] }))}
          />
        </div>
      </section>

      {/* controls */}
      <div className="mt-16 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {[{ slug: "all" as const, title: "All stages" }, ...events].map((e) => (
            <button
              key={e.slug}
              onClick={() => setFilter(e.slug)}
              className={`border-[1.5px] border-ink px-3 py-1.5 text-sm font-medium transition-colors ${
                filter === e.slug ? "bg-ink text-paper" : "hover:bg-paper-2"
              }`}
            >
              {e.title}
            </button>
          ))}
        </div>
        <label className="label flex items-center gap-2 text-mute">
          Sort
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as typeof sort)}
            className="border-[1.5px] border-ink bg-card px-2 py-1.5 font-sans text-sm normal-case tracking-normal text-ink"
          >
            <option value="popular">Most subscribed</option>
            <option value="rating">Top rated</option>
          </select>
        </label>
      </div>

      {/* packs */}
      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {list.map((c) => {
          const on = !!subs[c.id];
          return (
            <article
              key={c.id}
              className={`stub flex flex-col border-[1.5px] border-ink transition-colors ${on ? "bg-marker" : "bg-card"}`}
            >
              <div className="flex items-start justify-between gap-4 p-6">
                <div className="flex items-center gap-3">
                  <Avatar initials={c.initials} />
                  <div>
                    <div className="font-semibold leading-tight">{c.name}</div>
                    <div className="text-sm text-mute">{c.credential}</div>
                  </div>
                </div>
                <span className="label shrink-0 text-mute">★ {c.rating}</span>
              </div>
              <div className="flex-1 border-t border-dashed border-ink/40 p-6">
                <div className="label text-mute">{getEvent(c.event)?.title}</div>
                <h3 className="mt-2 font-display text-[2rem] leading-[1.05]">{c.packTitle}</h3>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-2">{c.packBlurb}</p>
                <div className="label mt-5 flex gap-5 text-mute">
                  <span>{c.scenarioCount} cues</span>
                  <span>{c.subscribers.toLocaleString("en-US")} subs</span>
                </div>
              </div>
              <SubscribeBar
                price={c.price}
                on={on}
                onToggle={() => setSubs((p) => ({ ...p, [c.id]: !p[c.id] }))}
              />
            </article>
          );
        })}
      </div>

      {/* running tab */}
      <div className="sticky bottom-4 z-30 mx-auto mt-12 flex w-fit items-center gap-6 border-[1.5px] border-ink bg-ink px-6 py-3 text-paper hard-shadow">
        <span className="label text-paper/60">Your tab</span>
        <span className="font-display text-2xl">
          ${monthly}
          <span className="text-base italic text-paper/60">/mo</span>
        </span>
        <span className="label text-paper/60">
          {Object.values(subs).filter(Boolean).length} packs
        </span>
        <Link href="/" className="label inline-flex items-center gap-2 text-marker">
          Practise <Arrow className="h-3 w-3" />
        </Link>
      </div>
    </>
  );
}

function SubscribeBar({ price, on, onToggle }: { price: number; on: boolean; onToggle: () => void }) {
  return (
    <div className="grid grid-cols-[1fr_auto] border-t border-ink">
      <div className="flex items-baseline gap-1 px-6 py-3">
        <span className="font-display text-3xl">${price}</span>
        <span className="italic text-mute">/ month</span>
      </div>
      <button
        onClick={onToggle}
        aria-pressed={on}
        className={`border-l border-ink px-6 text-sm font-semibold transition-colors ${
          on ? "bg-ink text-marker hover:bg-signal hover:text-card" : "bg-signal text-card hover:bg-ink"
        }`}
      >
        {on ? "✓ Subscribed" : "Subscribe"}
      </button>
    </div>
  );
}
