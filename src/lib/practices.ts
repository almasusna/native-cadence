"use client";

import { useCallback, useSyncExternalStore } from "react";
import { events, getEvent, getProvider, scenarios, type EventSlug, type Level, type ProviderKind } from "./data";

/** One row in the public practice list. */
export type PracticeItem = {
  id: string;
  title: string;
  prompt: string;
  event: EventSlug;
  category: string;
  provider: string;
  providerKind: ProviderKind;
  level: Level;
  seconds: number;
  /** Added from the "For schools" form and not yet reviewed: listed, not playable. */
  pending?: boolean;
};

export const listedPractices: PracticeItem[] = scenarios.map((s) => {
  const p = getProvider(s);
  return {
    id: s.id,
    title: s.title,
    prompt: s.prompt,
    event: s.event,
    category: getEvent(s.event)!.title,
    provider: p.name,
    providerKind: p.kind,
    level: s.level,
    seconds: s.seconds,
  };
});

export const categories = events.map((e) => ({ slug: e.slug, title: e.title }));

// ── Practices added by schools in this browser. Local-only until there is a backend.

const KEY = "cadence.added-practices.v1";
const EMPTY: PracticeItem[] = [];
let cache: PracticeItem[] | null = null;
const listeners = new Set<() => void>();

function read(): PracticeItem[] {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(KEY);
    cache = raw ? (JSON.parse(raw) as PracticeItem[]) : EMPTY;
  } catch {
    cache = EMPTY;
  }
  return cache;
}

function write(next: PracticeItem[]) {
  cache = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* storage blocked — keep in memory */
  }
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

export function useAddedPractices() {
  const items = useSyncExternalStore(subscribe, read, () => EMPTY);
  const add = useCallback((p: Omit<PracticeItem, "id" | "pending" | "category">) => {
    const item: PracticeItem = {
      ...p,
      id: `added-${Date.now()}`,
      category: getEvent(p.event)!.title,
      pending: true,
    };
    write([item, ...read()]);
    return item;
  }, []);
  return { items, add };
}
