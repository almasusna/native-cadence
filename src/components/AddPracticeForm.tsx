"use client";

import Link from "next/link";
import { useState } from "react";
import type { EventSlug, Level, ProviderKind } from "@/lib/data";
import { categories, useAddedPractices } from "@/lib/practices";
import { Arrow } from "./ui";

const levels: Level[] = ["Warm-up", "Standard", "Pressure"];
const field =
  "w-full rounded-xl border border-line bg-card px-3.5 py-2.5 outline-none focus:border-signal focus:ring-4 focus:ring-signal/15";
const lbl = "mb-1.5 block text-sm font-semibold";

export function AddPracticeForm() {
  const { add } = useAddedPractices();
  const [provider, setProvider] = useState("");
  const [providerKind, setProviderKind] = useState<ProviderKind>("School");
  const [event, setEvent] = useState<EventSlug>("ielts-speaking");
  const [title, setTitle] = useState("");
  const [prompt, setPrompt] = useState("");
  const [seconds, setSeconds] = useState(90);
  const [level, setLevel] = useState<Level>("Standard");
  const [done, setDone] = useState<string | null>(null);

  if (done) {
    return (
      <div className="cue flex flex-col items-start justify-center p-8 md:p-10">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-marker text-xl">✓</span>
        <h2 className="mt-6 font-display text-3xl">Practice added</h2>
        <p className="mt-3 text-ink-2">
          <b>{done}</b> is now in the practice list, marked “In review”. Learners can use it once it has been
          reviewed.
        </p>
        <p className="label mt-4 text-mute">Demo: practices are saved in this browser only.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/#practices" className="btn btn-signal">
            See it in the list <Arrow />
          </Link>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => {
              setTitle("");
              setPrompt("");
              setDone(null);
            }}
          >
            Add another
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      className="cue space-y-5 p-6 md:p-8"
      onSubmit={(e) => {
        e.preventDefault();
        add({ provider: provider.trim(), providerKind, event, title: title.trim(), prompt: prompt.trim(), seconds, level });
        setDone(title.trim());
      }}
    >
      <h2 className="font-display text-2xl">Add a practice</h2>

      <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
        <div>
          <label htmlFor="provider" className={lbl}>
            School or company name
          </label>
          <input
            id="provider"
            required
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
            placeholder="e.g. Brightline English School"
            className={field}
          />
        </div>
        <div>
          <span className={lbl}>Type</span>
          <div className="flex gap-1 rounded-xl border border-line bg-paper p-1">
            {(["School", "Company"] as const).map((k) => (
              <button
                type="button"
                key={k}
                onClick={() => setProviderKind(k)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium ${providerKind === k ? "bg-card shadow-sm" : "text-mute"}`}
              >
                {k}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="category" className={lbl}>
          Category
        </label>
        <select id="category" value={event} onChange={(e) => setEvent(e.target.value as EventSlug)} className={field}>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.title}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="title" className={lbl}>
          Practice title
        </label>
        <input
          id="title"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Part 2 — Describe a festival"
          className={field}
        />
      </div>

      <div>
        <label htmlFor="prompt" className={lbl}>
          Question the learner answers
        </label>
        <textarea
          id="prompt"
          required
          rows={3}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g. Describe a festival that is important in your country. You should say…"
          className={field}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="seconds" className={lbl}>
            Time to answer
          </label>
          <select id="seconds" value={seconds} onChange={(e) => setSeconds(Number(e.target.value))} className={field}>
            {[30, 45, 60, 90, 120, 180].map((s) => (
              <option key={s} value={s}>
                {s < 60 ? `${s} seconds` : `${s / 60} min`}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="level" className={lbl}>
            Difficulty
          </label>
          <select id="level" value={level} onChange={(e) => setLevel(e.target.value as Level)} className={field}>
            {levels.map((l) => (
              <option key={l}>{l}</option>
            ))}
          </select>
        </div>
      </div>

      <button type="submit" className="btn btn-signal w-full justify-center">
        Add practice <Arrow />
      </button>
    </form>
  );
}
