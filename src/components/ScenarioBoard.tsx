"use client";

import Link from "next/link";
import { useState } from "react";
import { creators, type Scenario } from "@/lib/data";
import { Arrow, Avatar, LevelMeter, LockIcon, fmtTime } from "./ui";

export function ScenarioBoard({ scenarios }: { scenarios: Scenario[] }) {
  const [tab, setTab] = useState<"house" | "community">("house");
  const [subscribed, setSubscribed] = useState<Record<string, boolean>>({});
  const house = scenarios.filter((s) => s.source === "house");
  const community = scenarios.filter((s) => s.source === "community");
  const shown = tab === "house" ? house : community;

  return (
    <section className="pt-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div role="tablist" className="flex border-[1.5px] border-ink">
          {(
            [
              ["house", "House set", house.length],
              ["community", "Community", community.length],
            ] as const
          ).map(([key, label, n]) => (
            <button
              key={key}
              role="tab"
              aria-selected={tab === key}
              onClick={() => setTab(key)}
              className={`flex items-center gap-3 px-5 py-3 text-[0.95rem] font-semibold transition-colors ${
                tab === key ? "bg-ink text-paper" : "hover:bg-paper-2"
              } ${key === "community" ? "border-l-[1.5px] border-ink" : ""}`}
            >
              {label}
              <span
                className={`font-mono text-xs ${tab === key ? "text-marker" : "text-mute"}`}
              >
                {String(n).padStart(2, "0")}
              </span>
            </button>
          ))}
        </div>
        <p className="max-w-md text-sm text-mute">
          {tab === "house"
            ? "Written and calibrated by the Native Cadence team. Free, forever."
            : "Written by recruiters, examiners and trainers. Some cues are free previews; the rest come with the creator’s pack."}
        </p>
      </div>

      {shown.length === 0 ? (
        <div className="mt-10 border-[1.5px] border-dashed border-ink p-14 text-center">
          <p className="font-display text-3xl italic">No community cues yet.</p>
          <p className="mt-2 text-mute">Be the first to write one — and get paid when people use it.</p>
          <Link href="/studio#new" className="btn btn-ink mt-6">
            Write a scenario <Arrow />
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-x-6 gap-y-10 md:grid-cols-2 xl:grid-cols-3">
          {shown.map((s, i) => {
            const creator = creators.find((c) => c.id === s.creatorId);
            const locked = s.locked && !(creator && subscribed[creator.id]);
            return (
              <article
                key={s.id}
                className={`cue flex animate-rise flex-col pt-7 ${i % 3 === 1 ? "md:translate-y-6" : ""}`}
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="flex items-center justify-between px-6">
                  <span className="label text-mute">
                    Cue {String(i + 1).padStart(2, "0")}
                  </span>
                  <LevelMeter level={s.level} />
                </div>

                <h3 className="mt-5 px-6 font-display text-[1.9rem] leading-[1.05]">{s.title}</h3>

                <p className={`mt-4 px-6 text-[0.98rem] leading-relaxed text-ink-2 ${locked ? "select-none blur-[5px]" : ""}`}>
                  “{s.prompt}”
                </p>

                {!locked && (
                  <div className="mx-6 mt-5 border-l-[3px] border-marker bg-marker/20 py-2 pl-3 pr-2">
                    <div className="label text-ink-2">Hint</div>
                    <p className="mt-1 text-sm leading-relaxed">{s.hint}</p>
                  </div>
                )}

                <div className="flex-1" />

                {creator && (
                  <div className="mt-6 flex items-center gap-3 border-t border-dashed border-ink/40 px-6 pt-4">
                    <Avatar initials={creator.initials} className="h-7 w-7 text-[0.6rem]" />
                    <div className="text-sm leading-tight">
                      <div className="font-semibold">{creator.name}</div>
                      <div className="text-mute">{creator.credential}</div>
                    </div>
                  </div>
                )}

                <div className="mt-5 grid grid-cols-[1fr_auto] border-t border-ink">
                  <div className="label flex items-center gap-4 px-6 text-mute">
                    <span>⏱ {fmtTime(s.seconds)}</span>
                    <span>{(s.plays / 1000).toFixed(1)}k takes</span>
                  </div>
                  {locked && creator ? (
                    <button
                      onClick={() => setSubscribed((p) => ({ ...p, [creator.id]: true }))}
                      className="flex items-center gap-2 border-l border-ink bg-marker px-5 py-3.5 text-sm font-semibold transition-colors hover:bg-ink hover:text-marker"
                    >
                      <LockIcon /> Unlock · ${creator.price}/mo
                    </button>
                  ) : (
                    <Link
                      href={`/practice/${s.id}`}
                      className="group flex items-center gap-2 border-l border-ink bg-ink px-5 py-3.5 text-sm font-semibold text-paper transition-colors hover:bg-signal"
                    >
                      <span className="h-2 w-2 rounded-full bg-signal group-hover:bg-card" />
                      Rehearse
                    </Link>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
