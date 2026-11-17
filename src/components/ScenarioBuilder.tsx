"use client";

import { useState } from "react";
import { events, type EventSlug, type Level } from "@/lib/data";
import { Avatar, LevelMeter, fmtTime } from "./ui";

const levels: Level[] = ["Warm-up", "Standard", "Pressure"];

export function ScenarioBuilder() {
  const [event, setEvent] = useState<EventSlug>("job-interview");
  const [title, setTitle] = useState("Counter-offer from your current boss");
  const [prompt, setPrompt] = useState(
    "Your manager just offered you a 15% raise to stay. You've already accepted our offer. What do you tell them?",
  );
  const [hint, setHint] = useState(
    "Thank them sincerely, restate your decision in one sentence, and offer a clean handover. No re-negotiating.",
  );
  const [framework, setFramework] = useState("Thank · Decide · Handover");
  const [seconds, setSeconds] = useState(75);
  const [level, setLevel] = useState<Level>("Standard");
  const [visibility, setVisibility] = useState<"free" | "pack">("pack");
  const [price, setPrice] = useState(5);
  const [subs, setSubs] = useState(150);
  const [submitted, setSubmitted] = useState(false);

  const ev = events.find((e) => e.slug === event)!;
  const field = "w-full border-[1.5px] border-ink bg-card px-3 py-2.5 outline-none focus:bg-paper focus:shadow-[3px_3px_0_0_var(--color-signal)]";

  return (
    <section id="new" className="mt-24 scroll-mt-28">
      <div className="rule-double" />
      <div className="mt-4 flex items-baseline gap-4">
        <span className="label text-mute">§ New</span>
        <h2 className="font-display text-4xl md:text-5xl">
          Write a <span className="italic">scenario</span>
        </h2>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1fr]">
        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitted(true);
          }}
        >
          <div>
            <label className="label mb-2 block text-ink-2">Stage</label>
            <div className="flex flex-wrap gap-2">
              {events.map((e) => (
                <button
                  type="button"
                  key={e.slug}
                  onClick={() => setEvent(e.slug)}
                  className={`border-[1.5px] border-ink px-3 py-1.5 text-sm ${event === e.slug ? "bg-ink text-paper" : "hover:bg-paper-2"}`}
                >
                  {e.title}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="sb-title" className="label mb-2 block text-ink-2">Title</label>
            <input id="sb-title" className={field} value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div>
            <label htmlFor="sb-prompt" className="label mb-2 block text-ink-2">The statement or question</label>
            <textarea id="sb-prompt" rows={3} className={`${field} font-display text-xl leading-snug`} value={prompt} onChange={(e) => setPrompt(e.target.value)} />
          </div>

          <div>
            <label htmlFor="sb-hint" className="label mb-2 block text-ink-2">Hint — how to answer it</label>
            <textarea id="sb-hint" rows={3} className={field} value={hint} onChange={(e) => setHint(e.target.value)} />
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="sb-fw" className="label mb-2 block text-ink-2">Framework (· separated)</label>
              <input id="sb-fw" className={field} value={framework} onChange={(e) => setFramework(e.target.value)} />
            </div>
            <div>
              <label htmlFor="sb-sec" className="label mb-2 flex justify-between text-ink-2">
                Time limit <span className="text-ink">{fmtTime(seconds)}</span>
              </label>
              <input id="sb-sec" type="range" min={20} max={180} step={5} value={seconds} onChange={(e) => setSeconds(+e.target.value)} className="mt-3 w-full accent-signal" />
            </div>
          </div>

          <div>
            <span className="label mb-2 block text-ink-2">Pressure</span>
            <div className="flex border-[1.5px] border-ink">
              {levels.map((l, i) => (
                <button
                  type="button"
                  key={l}
                  onClick={() => setLevel(l)}
                  className={`flex-1 py-2.5 text-sm font-medium ${i ? "border-l-[1.5px] border-ink" : ""} ${level === l ? "bg-ink text-paper" : "hover:bg-paper-2"}`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          <fieldset className="border-[1.5px] border-ink bg-card p-5">
            <legend className="label px-2 text-ink-2">Monetisation</legend>
            <div className="flex gap-3">
              {(
                [
                  ["free", "Free preview", "Anyone can rehearse it. Great for discovery."],
                  ["pack", "In my pack", "Subscribers only. You earn monthly."],
                ] as const
              ).map(([k, label, desc]) => (
                <label
                  key={k}
                  className={`flex flex-1 cursor-pointer gap-3 border-[1.5px] p-3 ${visibility === k ? "border-ink bg-marker" : "border-ink/30"}`}
                >
                  <input type="radio" name="vis" className="mt-1 accent-ink" checked={visibility === k} onChange={() => setVisibility(k)} />
                  <span>
                    <span className="block text-sm font-semibold">{label}</span>
                    <span className="text-xs text-ink-2">{desc}</span>
                  </span>
                </label>
              ))}
            </div>

            {visibility === "pack" && (
              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="sb-price" className="label flex justify-between text-ink-2">
                    Pack price <span className="text-ink">${price}/mo</span>
                  </label>
                  <input id="sb-price" type="range" min={2} max={15} value={price} onChange={(e) => setPrice(+e.target.value)} className="mt-3 w-full accent-signal" />
                </div>
                <div>
                  <label htmlFor="sb-subs" className="label flex justify-between text-ink-2">
                    If you reach <span className="text-ink">{subs} subs</span>
                  </label>
                  <input id="sb-subs" type="range" min={10} max={2000} step={10} value={subs} onChange={(e) => setSubs(+e.target.value)} className="mt-3 w-full accent-signal" />
                </div>
                <div className="sm:col-span-2 flex items-baseline justify-between border-t border-dashed border-ink/40 pt-4">
                  <span className="text-sm text-ink-2">You’d take home (70%)</span>
                  <span className="font-display text-4xl">
                    ${Math.round(price * subs * 0.7).toLocaleString("en-US")}
                    <span className="text-lg italic text-mute">/month</span>
                  </span>
                </div>
              </div>
            )}
          </fieldset>

          <div className="flex flex-wrap items-center gap-4">
            <button type="submit" className="btn btn-signal">
              Submit for review
            </button>
            <button type="button" className="btn btn-ghost">Save draft</button>
            {submitted && (
              <span className="font-hand text-2xl text-moss">Sent! Editors usually reply in 48h.</span>
            )}
          </div>
        </form>

        {/* live preview */}
        <div className="lg:sticky lg:top-32 lg:self-start">
          <div className="label mb-3 text-mute">Live preview — what learners see</div>
          <article className="cue hard-shadow flex flex-col pt-8">
            <div className="flex items-center justify-between px-7">
              <span className="label text-mute">{ev.title}</span>
              <LevelMeter level={level} />
            </div>
            <h3 className="mt-5 px-7 font-display text-[2.1rem] leading-[1.05]">{title || "Untitled cue"}</h3>
            <p className="mt-4 px-7 text-[1.02rem] leading-relaxed text-ink-2">“{prompt || "Your question goes here…"}”</p>
            <div className="mx-7 mt-5 border-[1.5px] border-ink bg-marker p-4">
              {framework.trim() && (
                <div className="mb-2 flex flex-wrap gap-1.5">
                  {framework.split("·").map((f, i) =>
                    f.trim() ? (
                      <span key={i} className="border border-ink bg-card px-2 py-0.5 text-xs font-semibold">
                        {f.trim()}
                      </span>
                    ) : null,
                  )}
                </div>
              )}
              <p className="text-sm leading-relaxed">{hint || "How should they approach it?"}</p>
            </div>
            <div className="mt-6 flex items-center gap-3 border-t border-dashed border-ink/40 px-7 pt-4">
              <Avatar initials="AL" className="h-7 w-7 text-[0.6rem]" />
              <span className="text-sm">
                <b>You</b> <span className="text-mute">· {visibility === "pack" ? `In your $${price}/mo pack` : "Free preview"}</span>
              </span>
            </div>
            <div className="mt-5 grid grid-cols-[1fr_auto] border-t border-ink">
              <span className="label flex items-center px-7 text-mute">⏱ {fmtTime(seconds)}</span>
              <span className="flex items-center gap-2 border-l border-ink bg-ink px-5 py-3.5 text-sm font-semibold text-paper">
                <span className="h-2 w-2 rounded-full bg-signal" /> Rehearse
              </span>
            </div>
          </article>
          <p className="mt-6 font-hand text-2xl leading-snug text-signal">
            tip: the best hints tell people <u>what shape</u> the answer takes, not what to say.
          </p>
        </div>
      </div>
    </section>
  );
}
