"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import type { Feedback, Phrase, Scenario, StageEvent } from "@/lib/data";
import { usePhrasebook } from "@/lib/phrasebook";
import { Arrow, fmtTime } from "./ui";

const kindLabel = {
  weak: { tag: "Upgrade", cls: "bg-signal text-card" },
  grammar: { tag: "Grammar", cls: "bg-ink text-paper" },
  good: { tag: "Keep", cls: "bg-moss text-card" },
  filler: { tag: "Filler", cls: "bg-paper-2" },
} as const;

/** Wrap every occurrence of a saved-phrase "core" in a highlighter span. */
function highlight(text: string, phrases: Phrase[]): ReactNode[] {
  const cores = phrases
    .map((p) => p.text.replace(/[…."]/g, "").replace(/,\s*$/, "").trim())
    .filter((c) => c.length > 3)
    .map((c) => c.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  if (!cores.length) return [text];
  const re = new RegExp(`(${cores.join("|")})`, "gi");
  return text.split(re).map((part, i) =>
    i % 2 === 1 ? (
      <span key={i} className="marker">
        {part}
      </span>
    ) : (
      part
    ),
  );
}

export function Review({
  scenario,
  event,
  feedback,
  audioUrl,
  simulated,
  elapsed,
  nextId,
  onRetake,
}: {
  scenario: Scenario;
  event: StageEvent;
  feedback: Feedback;
  audioUrl: string | null;
  simulated: boolean;
  elapsed: number;
  nextId?: string;
  onRetake: () => void;
}) {
  const [view, setView] = useState<"yours" | "upgraded">("yours");
  const [focus, setFocus] = useState<number | null>(null);
  const book = usePhrasebook();
  const overall = Math.round(feedback.scores.reduce((a, s) => a + s.value, 0) / feedback.scores.length);
  const seconds = simulated ? feedback.stats.seconds : Math.round(elapsed) || feedback.stats.seconds;

  // number the annotations once
  let n = 0;
  const marked = feedback.transcript.map((seg) => ({
    ...seg,
    n: seg.kind && seg.kind !== "filler" ? ++n : 0,
  }));
  const notes = marked.filter((s) => s.n > 0);

  return (
    <div className="pb-10 pt-6">
      {/* ── Verdict masthead ── */}
      <header className="grid animate-rise overflow-hidden rounded-2xl border border-line bg-card md:grid-cols-[1fr_auto]">
        <div className="p-7 md:p-10">
          <div className="label flex flex-wrap items-center gap-3 text-mute">
            <span className="bg-ink px-2 py-1 text-paper">Take reviewed</span>
            {scenario.title}
            {simulated && <span className="text-signal">· sample take</span>}
          </div>
          <h1 className="mt-5 font-display text-[clamp(2.4rem,5vw,4.4rem)] leading-[0.95]">
            {feedback.headline}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-2">{feedback.verdict}</p>
        </div>
        <div className="flex flex-row items-center justify-center gap-6 border-t border-line bg-ink p-8 text-paper md:flex-col md:border-l md:border-t-0">
          <span className="label text-paper/50">{feedback.band ? "Est. band" : "Overall"}</span>
          <span className="font-display text-[5.5rem] leading-none text-marker">
            {feedback.band ?? overall}
          </span>
          <span className="label text-paper/50">{feedback.band ? "of 9.0" : "of 100"}</span>
        </div>
      </header>

      {/* ── Stats strip ── */}
      <dl className="grid grid-cols-2 border-x-[1.5px] border-b-[1.5px] border-line md:grid-cols-4">
        {[
          ["Duration", fmtTime(seconds)],
          ["Pace", `${feedback.stats.wpm} wpm`],
          ["Fillers", String(feedback.stats.fillers)],
          ["Unique words", String(feedback.stats.uniqueWords)],
        ].map(([k, v], i) => (
          <div key={k} className={`px-6 py-4 ${i % 2 === 0 ? "border-r border-line" : ""} ${i === 1 ? "md:border-r" : ""} ${i < 2 ? "border-b border-line md:border-b-0" : ""}`}>
            <dt className="label text-mute">{k}</dt>
            <dd className="mt-1 font-display text-3xl">{v}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.6fr_1fr]">
        {/* ── Transcript editor ── */}
        <section>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex overflow-hidden rounded-2xl border border-line">
              {(
                [
                  ["yours", "Your take, red-penned"],
                  ["upgraded", "Upgraded take"],
                ] as const
              ).map(([k, label], i) => (
                <button
                  key={k}
                  onClick={() => setView(k)}
                  className={`px-4 py-2.5 text-sm font-semibold ${i ? "border-l-[1.5px] border-line" : ""} ${
                    view === k ? "bg-ink text-paper" : "hover:bg-paper-2"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            {audioUrl && (
              <audio controls src={audioUrl} className="h-9 max-w-full" />
            )}
          </div>

          <div className="relative mt-5 rounded-2xl border border-line bg-card p-7 md:p-9">
            {/* margin rule like a legal pad */}
            <span className="absolute bottom-0 left-12 top-0 hidden w-px bg-signal/40 md:block" />
            {view === "yours" ? (
              <p className="text-[1.18rem] leading-[2.15] md:pl-10">
                {marked.map((seg, i) => {
                  if (!seg.kind) return <span key={i}>{seg.t}</span>;
                  if (seg.kind === "filler")
                    return (
                      <span key={i} className="pen-strike">
                        {seg.t}
                      </span>
                    );
                  const active = focus === seg.n;
                  const sup = (
                    <sup
                      className={`ml-0.5 font-mono text-[0.62rem] font-bold ${seg.kind === "good" ? "text-moss" : "text-signal"}`}
                    >
                      {seg.n}
                    </sup>
                  );
                  if (seg.kind === "good")
                    return (
                      <span
                        key={i}
                        onMouseEnter={() => setFocus(seg.n)}
                        onMouseLeave={() => setFocus(null)}
                        className={`pen-good cursor-help ${active ? "bg-moss-soft" : ""}`}
                      >
                        {seg.t}
                        {sup}
                      </span>
                    );
                  return (
                    <span
                      key={i}
                      onMouseEnter={() => setFocus(seg.n)}
                      onMouseLeave={() => setFocus(null)}
                      className={`cursor-help ${active ? "bg-marker/50" : ""}`}
                    >
                      <span className="pen-strike">{seg.t.trim()}</span>
                      <span className="font-hand text-[1.55rem] leading-none text-signal">
                        {" "}
                        ‸{seg.fix}
                      </span>
                      {sup}
                      {seg.t.endsWith(" ") ? " " : ""}
                    </span>
                  );
                })}
              </p>
            ) : (
              <p className="font-display text-[1.6rem] leading-[1.45] md:pl-10">
                {highlight(feedback.upgraded, feedback.phrases)}
              </p>
            )}
          </div>

          {view === "yours" && (
            <>
              <div className="label mt-8 text-mute">Editor’s notes</div>
              <ol className="mt-3 grid gap-px rounded-2xl border border-line bg-ink sm:grid-cols-2">
                {notes.map((s) => {
                  const k = kindLabel[s.kind!];
                  return (
                    <li
                      key={s.n}
                      onMouseEnter={() => setFocus(s.n)}
                      onMouseLeave={() => setFocus(null)}
                      className={`flex gap-3 p-4 transition-colors ${focus === s.n ? "bg-marker/40" : "bg-paper"}`}
                    >
                      <span className="font-display text-3xl leading-none text-ink/30">{s.n}</span>
                      <div className="min-w-0">
                        <span className={`label px-1.5 py-0.5 ${k.cls}`}>{k.tag}</span>
                        <p className="mt-2 text-sm">
                          <span className="text-mute">“{s.t.trim()}”</span>
                          {s.fix && (
                            <>
                              {" → "}
                              <b>{s.fix}</b>
                            </>
                          )}
                        </p>
                        {s.note && <p className="mt-1 text-sm text-ink-2">{s.note}</p>}
                      </div>
                    </li>
                  );
                })}
              </ol>
            </>
          )}
        </section>

        {/* ── Mixing desk ── */}
        <aside>
          <div className="rounded-2xl border border-line bg-ink p-6 text-paper">
            <div className="flex items-center justify-between">
              <span className="label text-paper/60">Mixing desk</span>
              <span className="label text-paper/40">{event.title}</span>
            </div>
            <div className="mt-6 flex justify-between gap-2">
              {feedback.scores.map((s) => (
                <div key={s.label} className="group flex flex-1 flex-col items-center">
                  <span className="font-display text-2xl text-marker">{s.value}</span>
                  <div className="relative mt-3 h-48 w-2.5 rounded-full bg-paper/15">
                    <div
                      className={`absolute bottom-0 left-0 right-0 rounded-full ${s.value < 60 ? "bg-signal" : "bg-paper/70"}`}
                      style={{ height: `${s.value}%` }}
                    />
                    <div
                      className="absolute left-1/2 h-4 w-9 -translate-x-1/2 translate-y-1/2 rounded-[3px] border border-line bg-paper shadow-[0_2px_0_0_rgba(0,0,0,.5)]"
                      style={{ bottom: `${s.value}%` }}
                    >
                      <span className="absolute inset-x-1.5 top-1/2 h-px bg-ink" />
                    </div>
                  </div>
                  <span className="label mt-4 h-8 text-center text-[0.56rem] leading-tight text-paper/70">
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <ul className="border-x-[1.5px] border-b-[1.5px] border-line bg-card">
            {feedback.scores.map((s) => (
              <li key={s.label} className="flex gap-3 border-b border-dashed border-line px-5 py-3 text-sm last:border-0">
                <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${s.value < 60 ? "bg-signal" : "bg-ink"}`} />
                <span>
                  <b>{s.label}.</b> <span className="text-ink-2">{s.note}</span>
                </span>
              </li>
            ))}
          </ul>
        </aside>
      </div>

      {/* ── Phrases to steal ── */}
      <section className="mt-16">
        <div className="rule-double" />
        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-display text-4xl md:text-5xl">
            Phrases to <span className="italic">steal</span>
          </h2>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {feedback.phrases.map((p, i) => {
            const saved = book.has(p.id);
            return (
              <article
                key={p.id}
                className={`flex flex-col rounded-2xl border border-line transition-all ${saved ? "bg-marker hard-shadow-sm" : "bg-card"}`}
                style={{ transform: `rotate(${[-0.6, 0.4, -0.2, 0.7, -0.5][i % 5]}deg)` }}
              >
                <div className="flex items-center justify-between border-b border-line px-5 py-3">
                  <span className="label text-ink-2">{p.register}</span>
                  <span className="label text-mute">№ {String(i + 1).padStart(2, "0")}</span>
                </div>
                <div className="flex-1 p-5">
                  <p className="font-display text-[1.75rem] leading-[1.1]">{p.text}</p>
                  <p className="mt-3 text-sm font-medium text-ink-2">{p.use}</p>
                  <p className="mt-3 border-l-2 border-line pl-3 text-sm italic text-mute">{p.example}</p>
                </div>
                <button
                  onClick={() => book.toggle(p, { event: event.slug, scenarioTitle: scenario.title })}
                  className={`flex items-center justify-center gap-2 border-t border-line py-3 text-sm font-semibold transition-colors ${
                    saved ? "bg-ink text-marker" : "hover:bg-ink hover:text-paper"
                  }`}
                  aria-pressed={saved}
                >
                  {saved ? "✓ In your phrasebook" : "+ Save to phrasebook"}
                </button>
              </article>
            );
          })}
        </div>
      </section>

      {/* ── Next actions ── */}
      <div className="mt-16 grid rounded-2xl border border-line md:grid-cols-3">
        <button onClick={onRetake} className="flex items-center justify-between gap-3 p-6 text-left transition-colors hover:bg-paper-2">
          <span>
            <span className="label block text-mute">Same cue</span>
            <span className="font-display text-3xl">Retake</span>
          </span>
          <span className="text-2xl">↺</span>
        </button>
        <Link
          href="/#practices"
          className="flex items-center justify-between gap-3 border-t border-line p-6 transition-colors hover:bg-paper-2 md:border-l md:border-t-0"
        >
          <span>
            <span className="label block text-mute">Back to</span>
            <span className="font-display text-3xl">All practices</span>
          </span>
        </Link>
        {nextId && (
          <Link
            href={`/practice/${nextId}`}
            className="group flex items-center justify-between gap-3 border-t border-line bg-signal p-6 text-card transition-colors hover:bg-signal-deep md:border-l md:border-t-0"
          >
            <span>
              <span className="label block text-card/70">Keep going</span>
              <span className="font-display text-3xl">Next cue</span>
            </span>
            <Arrow className="h-7 w-7 transition-transform group-hover:translate-x-1" />
          </Link>
        )}
      </div>
    </div>
  );
}
