"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { events, getEvent, type EventSlug } from "@/lib/data";
import { usePhrasebook, type SavedPhrase } from "@/lib/phrasebook";
import { Arrow } from "./ui";

const masteryLabel = ["New", "Shaky", "Getting there", "Natural"];

function blankOut(p: SavedPhrase) {
  const core = p.text.replace(/[…."]/g, "").replace(/,\s*$/, "").trim();
  const idx = p.example.toLowerCase().indexOf(core.toLowerCase());
  if (idx < 0) return { before: "", after: "", hidden: false };
  return {
    before: p.example.slice(0, idx),
    after: p.example.slice(idx + core.length),
    hidden: true,
  };
}

export function PhrasebookView() {
  const { items, remove, setMastery } = usePhrasebook();
  const [filter, setFilter] = useState<EventSlug | "all">("all");
  const [mode, setMode] = useState<"shelf" | "drill">("shelf");
  const [cursor, setCursor] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const list = useMemo(
    () => (filter === "all" ? items : items.filter((p) => p.event === filter)),
    [items, filter],
  );
  // keep deck order stable while rating, so cards don't jump around mid-drill
  const drillDeck = list;
  const card = drillDeck.length ? drillDeck[cursor % drillDeck.length] : undefined;
  const usedEvents = events.filter((e) => items.some((p) => p.event === e.slug));
  const natural = items.filter((p) => p.mastery === 3).length;

  const rate = (m: SavedPhrase["mastery"]) => {
    if (!card) return;
    setMastery(card.id, m);
    setRevealed(false);
    setCursor((c) => c + 1);
  };

  return (
    <>
      {/* header */}
      <header className="grid gap-8 border-b-[1.5px] border-ink pb-10 pt-12 md:grid-cols-[1.4fr_1fr] md:items-end">
        <div>
          <div className="label text-mute">Your collection</div>
          <h1 className="mt-4 font-display text-[clamp(3rem,7vw,6.2rem)] leading-[0.9] tracking-[-0.02em]">
            The <span className="italic">phrasebook</span>
          </h1>
          <p className="mt-5 max-w-lg text-lg text-ink-2">
            Lines you stole from your own feedback. Drill them until they stop sounding borrowed.
          </p>
        </div>
        <div className="grid grid-cols-3 border-[1.5px] border-ink bg-card">
          {[
            ["Saved", items.length],
            ["Natural", natural],
            ["Stages", usedEvents.length],
          ].map(([k, v], i) => (
            <div key={k} className={`p-5 ${i ? "border-l border-ink" : ""}`}>
              <div className="label text-mute">{k}</div>
              <div className="mt-1 font-display text-5xl leading-none">{v}</div>
            </div>
          ))}
        </div>
      </header>

      {/* controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 py-6">
        <div className="flex flex-wrap gap-2">
          {[{ slug: "all" as const, title: "All" }, ...usedEvents].map((e) => (
            <button
              key={e.slug}
              onClick={() => {
                setFilter(e.slug);
                setCursor(0);
                setRevealed(false);
              }}
              className={`border-[1.5px] border-ink px-3 py-1.5 text-sm font-medium transition-colors ${
                filter === e.slug ? "bg-ink text-paper" : "hover:bg-paper-2"
              }`}
            >
              {e.title}
            </button>
          ))}
        </div>
        <div className="flex border-[1.5px] border-ink">
          {(["shelf", "drill"] as const).map((m, i) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`label px-4 py-2.5 ${i ? "border-l-[1.5px] border-ink" : ""} ${
                mode === m ? "bg-signal text-card" : "hover:bg-paper-2"
              }`}
            >
              {m === "shelf" ? "▤ Shelf" : "◉ Drill"}
            </button>
          ))}
        </div>
      </div>

      {list.length === 0 ? (
        <div className="border-[1.5px] border-dashed border-ink p-16 text-center">
          <p className="font-display text-4xl italic">Nothing here yet.</p>
          <p className="mt-2 text-mute">Record a take and save the phrases you like from the feedback.</p>
          <Link href="/" className="btn btn-ink mt-6">
            Pick a stage <Arrow />
          </Link>
        </div>
      ) : mode === "shelf" ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => (
            <article key={p.id} className="cue group flex flex-col pt-7">
              <div className="flex items-center justify-between px-5">
                <span className="label text-mute">{getEvent(p.event)?.title}</span>
                <button
                  onClick={() => remove(p.id)}
                  className="label text-mute opacity-0 transition-opacity hover:text-signal group-hover:opacity-100 focus:opacity-100"
                  aria-label={`Remove ${p.text}`}
                >
                  Remove ✕
                </button>
              </div>
              <p className="mt-4 px-5 font-display text-[1.85rem] leading-[1.08]">
                <span className="marker">{p.text}</span>
              </p>
              <p className="mt-3 px-5 text-sm font-medium text-ink-2">{p.use}</p>
              <p className="mt-2 px-5 text-sm italic text-mute">{p.example}</p>
              <div className="flex-1" />
              <div className="mt-5 flex items-center justify-between border-t border-ink px-5 py-3">
                <span className="text-xs text-mute">from “{p.scenarioTitle}”</span>
                <span className="flex items-center gap-2" title={masteryLabel[p.mastery]}>
                  <span className="flex gap-1">
                    {[1, 2, 3].map((i) => (
                      <span
                        key={i}
                        className={`h-2.5 w-2.5 rounded-full border border-ink ${i <= p.mastery ? "bg-moss" : ""}`}
                      />
                    ))}
                  </span>
                </span>
              </div>
            </article>
          ))}
        </div>
      ) : card ? (
        <DrillCard
          key={card.id + cursor}
          card={card}
          index={(cursor % drillDeck.length) + 1}
          total={drillDeck.length}
          revealed={revealed}
          onReveal={() => setRevealed(true)}
          onRate={rate}
        />
      ) : null}
    </>
  );
}

function DrillCard({
  card,
  index,
  total,
  revealed,
  onReveal,
  onRate,
}: {
  card: SavedPhrase;
  index: number;
  total: number;
  revealed: boolean;
  onReveal: () => void;
  onRate: (m: SavedPhrase["mastery"]) => void;
}) {
  const b = blankOut(card);
  return (
    <div className="mx-auto max-w-3xl animate-rise">
      <div className="label mb-3 flex justify-between text-mute">
        <span>
          Card {index} / {total}
        </span>
        <span>Currently: {masteryLabel[card.mastery]}</span>
      </div>
      <div className="cue hard-shadow p-8 pt-12 md:p-12 md:pt-14">
        <div className="label text-mute">The situation</div>
        <p className="mt-2 text-xl font-medium">{card.use}</p>

        <div className="label mt-10 text-mute">Say the full sentence out loud</div>
        <p className="mt-3 font-display text-[clamp(1.8rem,3.4vw,2.6rem)] leading-[1.2]">
          {b.hidden ? (
            <>
              {b.before}
              {revealed ? (
                <span className="marker">{card.text.replace(/[…]/g, "").replace(/,\s*$/, "").trim()}</span>
              ) : (
                <span className="inline-block min-w-[8ch] border-b-[3px] border-dotted border-signal align-baseline">
                  &nbsp;
                </span>
              )}
              {b.after}
            </>
          ) : revealed ? (
            <span className="marker">{card.text}</span>
          ) : (
            <span className="italic text-mute">Recall the phrase…</span>
          )}
        </p>
        <p className="mt-6 font-hand text-2xl text-signal">
          {revealed ? `${card.register} register · from “${card.scenarioTitle}”` : "hint: " + card.text.split(" ").slice(0, 2).join(" ") + "…"}
        </p>
      </div>

      {revealed ? (
        <div className="mt-6 grid grid-cols-3 border-[1.5px] border-ink">
          {(
            [
              [1, "Again", "hover:bg-signal hover:text-card"],
              [2, "Getting there", "hover:bg-marker"],
              [3, "Natural", "hover:bg-moss hover:text-card"],
            ] as const
          ).map(([m, label, cls], i) => (
            <button
              key={label}
              onClick={() => onRate(m)}
              className={`py-4 font-semibold transition-colors ${i ? "border-l-[1.5px] border-ink" : ""} ${cls}`}
            >
              {label}
            </button>
          ))}
        </div>
      ) : (
        <button onClick={onReveal} className="btn btn-ink mt-6 w-full justify-center">
          Reveal phrase
        </button>
      )}
    </div>
  );
}
