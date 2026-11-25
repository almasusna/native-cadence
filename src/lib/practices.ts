"use client";

import { useCallback, useSyncExternalStore } from "react";
import { events, getEvent, getProvider, scenarios, slugify, type EventSlug, type Level, type ProviderKind } from "./data";

/** One row in the public practice list. */
export type PracticeItem = {
  id: string;
  title: string;
  prompt: string;
  event: EventSlug;
  /** Practice type title, e.g. "Company Interview". */
  type: string;
  /** The school's own category, e.g. "IELTS Prep Speaking". */
  category: string;
  provider: string;
  providerId: string;
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
    type: getEvent(s.event)!.title,
    category: s.category,
    provider: p.name,
    providerId: p.id,
    providerKind: p.kind,
    level: s.level,
    seconds: s.seconds,
  };
});

export const categories = events.map((e) => ({ slug: e.slug, title: e.title }));

export type SchoolGroup = {
  id: string;
  name: string;
  kind: ProviderKind;
  practices: PracticeItem[];
  /** Categories in the order the school's practices first use them. */
  categories: { name: string; practices: PracticeItem[] }[];
};

const UNCATEGORISED = "Other practices";

/** Groups practices into one entry per school, each split into its categories. */
export function groupBySchool(items: PracticeItem[]): SchoolGroup[] {
  const schools = new Map<string, SchoolGroup>();
  for (const p of items) {
    let school = schools.get(p.providerId);
    if (!school) {
      school = { id: p.providerId, name: p.provider, kind: p.providerKind, practices: [], categories: [] };
      schools.set(p.providerId, school);
    }
    school.practices.push(p);
    const name = p.category.trim() || UNCATEGORISED;
    let cat = school.categories.find((c) => c.name.toLowerCase() === name.toLowerCase());
    if (!cat) school.categories.push((cat = { name, practices: [] }));
    cat.practices.push(p);
  }
  return [...schools.values()];
}

// ── Practices added by schools in this browser. Local-only until there is a backend.

const KEY = "cadence.added-practices.v1";
const EMPTY: PracticeItem[] = [];
let cache: PracticeItem[] | null = null;
const listeners = new Set<() => void>();

/** Items saved before schools had categories stored the practice type in `category`. */
function normalise(p: PracticeItem): PracticeItem {
  if (p.type && p.providerId) return p;
  const type = getEvent(p.event)?.title ?? p.category;
  return { ...p, type, category: p.category === type ? "" : p.category, providerId: slugify(p.provider) };
}

function read(): PracticeItem[] {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(KEY);
    cache = raw ? (JSON.parse(raw) as PracticeItem[]).map(normalise) : EMPTY;
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
  const add = useCallback((p: Omit<PracticeItem, "id" | "pending" | "type" | "providerId">) => {
    const item: PracticeItem = {
      ...p,
      id: `added-${Date.now()}`,
      type: getEvent(p.event)!.title,
      providerId: slugify(p.provider),
      pending: true,
    };
    write([item, ...read()]);
    return item;
  }, []);
  return { items, add };
}
