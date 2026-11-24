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
    id: "p-hind",
    text: "In hindsight, I would have…",
    use: "Showing reflection & growth",
    register: "Neutral",
    example: "In hindsight, I would have looped in support much earlier.",
    event: "job-interview",
    scenarioTitle: "Your biggest failure",
    savedAt: Date.UTC(2026, 10, 15),
    mastery: 1,
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
