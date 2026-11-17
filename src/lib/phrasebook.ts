"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { EventSlug, Phrase } from "./data";

// Local-only phrasebook. Swap for a server action / DB table later.

export type SavedPhrase = Phrase & {
  event: EventSlug;
  scenarioTitle: string;
  savedAt: number;
  mastery: 0 | 1 | 2 | 3;
};

const KEY = "cadence.phrasebook.v1";
const EMPTY: SavedPhrase[] = [];

const seed: SavedPhrase[] = [
  {
    id: "p-own",
    text: "I took ownership of…",
    use: "Opening the Action in a STAR answer",
    register: "Neutral",
    example: "I took ownership of the rollout and set up a weekly sync.",
    event: "job-interview",
    scenarioTitle: "A conflict with a colleague",
    savedAt: Date.UTC(2026, 10, 12),
    mastery: 2,
  },
  {
    id: "p-fond",
    text: "…some of my fondest memories",
    use: "Talking about the past with feeling",
    register: "Warm",
    example: "Those Sunday lessons are some of my fondest memories.",
    event: "ielts-speaking",
    scenarioTitle: "Part 2 — A skill you learned",
    savedAt: Date.UTC(2026, 10, 14),
    mastery: 1,
  },
  {
    id: "p-can",
    text: "What I can do for you right now is…",
    use: "Redirecting from 'no' to action",
    register: "Neutral",
    example: "What I can do for you right now is find you a seat with extra legroom.",
    event: "qatar-airways",
    scenarioTitle: "The upgrade demand",
    savedAt: Date.UTC(2026, 10, 15),
    mastery: 0,
  },
  {
    id: "p-extent",
    text: "To a large extent, …",
    use: "Hedging an opinion in Part 3",
    register: "Formal",
    example: "To a large extent, technology has made learning more accessible.",
    event: "ielts-speaking",
    scenarioTitle: "Part 3 — Technology & learning",
    savedAt: Date.UTC(2026, 10, 16),
    mastery: 3,
  },
];

let cache: SavedPhrase[] | null = null;
const listeners = new Set<() => void>();

function read(): SavedPhrase[] {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(KEY);
    cache = raw ? (JSON.parse(raw) as SavedPhrase[]) : seed;
  } catch {
    cache = seed;
  }
  return cache;
}

function write(next: SavedPhrase[]) {
  cache = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* storage full or blocked — keep in memory */
  }
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

export function usePhrasebook() {
  const items = useSyncExternalStore(subscribe, read, () => EMPTY);

  const has = useCallback((id: string) => items.some((p) => p.id === id), [items]);

  const toggle = useCallback(
    (p: Phrase, ctx: { event: EventSlug; scenarioTitle: string }) => {
      const cur = read();
      if (cur.some((x) => x.id === p.id)) write(cur.filter((x) => x.id !== p.id));
      else write([{ ...p, ...ctx, savedAt: Date.now(), mastery: 0 }, ...cur]);
    },
    [],
  );

  const remove = useCallback((id: string) => write(read().filter((x) => x.id !== id)), []);

  const setMastery = useCallback((id: string, mastery: SavedPhrase["mastery"]) => {
    write(read().map((x) => (x.id === id ? { ...x, mastery } : x)));
  }, []);

  return { items, has, toggle, remove, setMastery };
}
