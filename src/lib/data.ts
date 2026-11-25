// Mock data — stands in for the database until the backend exists.

export type EventSlug =
  | "job-interview"
  | "visa-interview";

export type StageEvent = {
  slug: EventSlug;
  title: string;
  kicker: string;
  blurb: string;
  room: string; // who you are speaking to
  duration: string;
  tone: "signal" | "moss" | "ink" | "marker";
  scoring: string[];
};

export type Level = "Warm-up" | "Standard" | "Pressure";

export type Scenario = {
  id: string;
  event: EventSlug;
  /** Who published it (a Provider id). */
  provider: string;
  /** The school's own grouping, e.g. "Intermediate Speaking" or "IELTS Prep Speaking". */
  category: string;
  title: string;
  prompt: string;
  hint: string;
  framework?: string;
  seconds: number;
  level: Level;
  plays: number;
};

export type ProviderKind = "School" | "Company" | "Platform";

export type Provider = {
  id: string;
  name: string;
  kind: ProviderKind;
  about: string;
};

export type Phrase = {
  id: string;
  text: string;
  use: string;
  register: "Formal" | "Neutral" | "Warm";
  example: string;
};

export type Segment = {
  t: string;
  kind?: "filler" | "weak" | "good" | "grammar";
  fix?: string;
  note?: string;
};

export type Feedback = {
  transcript: Segment[];
  scores: { label: string; value: number; note: string }[];
  verdict: string;
  headline: string;
  band?: string;
  stats: { wpm: number; fillers: number; seconds: number; uniqueWords: number };
  phrases: Phrase[];
  upgraded: string;
};

export const events: StageEvent[] = [
  {
    slug: "job-interview",
    title: "Company Interview",
    kicker: "Behavioural · Competency · Culture fit",
    blurb:
      "The questions every hiring manager asks, and the ones they ask when they want to see you think on your feet.",
    room: "A hiring manager and a panel lead",
    duration: "30–45 min",
    tone: "ink",
    scoring: ["Structure", "Evidence", "Vocabulary", "Fluency", "Presence"],
  },
  {
    slug: "visa-interview",
    title: "Visa Interview",
    kicker: "Consular window · Three minutes",
    blurb:
      "Short, direct answers about your plans, your ties and your funds. Every hesitation is noticed.",
    room: "One consular officer behind glass",
    duration: "2–5 min",
    tone: "signal",
    scoring: ["Directness", "Consistency", "Confidence", "Fluency"],
  },
];

// Who published each practice. Fictional schools and companies for the demo.
// A provider's id is the slug of its name, so practices added in the browser land on the same school page.
export const providers: Provider[] = [
  { id: "harbour-business-english", name: "Harbour Business English", kind: "School", about: "Interview and workplace English" },
  { id: "native-cadence", name: "Native Cadence", kind: "Platform", about: "Free starter practices" },
];

export const slugify = (name: string) =>
  name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "school";

export const scenarios: Scenario[] = [
  // ── Company interview
  {
    id: "ji-1",
    provider: "harbour-business-english",
    category: "Intermediate Interview Speaking",
    event: "job-interview",
    title: "Tell me about yourself",
    prompt: "Walk me through your background and what brings you to this role.",
    hint: "Present → Past → Future. Keep it under 90 seconds and end on why this role, not your life story.",
    framework: "Present · Past · Future",
    seconds: 90,
    level: "Warm-up",
    plays: 18233,
  },
  {
    id: "ji-2",
    provider: "harbour-business-english",
    category: "Intermediate Interview Speaking",
    event: "job-interview",
    title: "A conflict with a colleague",
    prompt: "Tell me about a time you disagreed with a colleague. How did you handle it?",
    hint: "Use STAR. Spend most of your time on the Action and show you listened before you argued.",
    framework: "Situation · Task · Action · Result",
    seconds: 120,
    level: "Standard",
    plays: 11408,
  },
  {
    id: "ji-3",
    provider: "harbour-business-english",
    category: "Advanced Interview Speaking",
    event: "job-interview",
    title: "Your biggest failure",
    prompt: "What's the biggest professional mistake you've made, and what did you change afterwards?",
    hint: "Own it in the first sentence. Pick a real mistake with a real cost, then show the system you built so it can't repeat.",
    framework: "Own · Impact · Fix · Lesson",
    seconds: 120,
    level: "Pressure",
    plays: 9021,
  },
  {
    id: "ji-4",
    provider: "harbour-business-english",
    category: "Intermediate Interview Speaking",
    event: "job-interview",
    title: "Why should we hire you?",
    prompt: "We've seen a lot of strong candidates. Why you?",
    hint: "Three proof points that map to the job description. Close with a forward-looking line about their team.",
    seconds: 75,
    level: "Standard",
    plays: 13560,
  },
  {
    id: "ji-c1",
    provider: "harbour-business-english",
    category: "Advanced Interview Speaking",
    event: "job-interview",
    title: "Two VPs want opposite things",
    prompt: "Sales and Engineering VPs both escalate to you with conflicting priorities for next quarter. Walk me through your call.",
    hint: "Name the decision criteria before the decision. Show how you'd communicate the 'no' to the loser.",
    seconds: 150,
    level: "Pressure",
    plays: 2204,
  },
  {
    id: "ji-c2",
    provider: "harbour-business-english",
    category: "Advanced Interview Speaking",
    event: "job-interview",
    title: "Kill your own feature",
    prompt: "Tell me about a time you decided to stop working on something you'd championed.",
    hint: "Data first, ego last. Mention who you told and how.",
    seconds: 120,
    level: "Standard",
    plays: 1530,
  },

  // ── Visa
  {
    id: "vi-1",
    provider: "native-cadence",
    category: "Student Visa Prep",
    event: "visa-interview",
    title: "Purpose of travel",
    prompt: "What is the purpose of your trip?",
    hint: "One sentence. Specific. Match your documents exactly.",
    seconds: 20,
    level: "Warm-up",
    plays: 12210,
  },
  {
    id: "vi-2",
    provider: "native-cadence",
    category: "Student Visa Prep",
    event: "visa-interview",
    title: "Ties to home",
    prompt: "What guarantees that you will return to your home country?",
    hint: "Concrete ties: job, family, property, a start date. No pleading, no over-explaining.",
    seconds: 40,
    level: "Pressure",
    plays: 10044,
  },
  {
    id: "vi-3",
    provider: "native-cadence",
    category: "Student Visa Prep",
    event: "visa-interview",
    title: "Who pays?",
    prompt: "Who is funding your studies, and how?",
    hint: "Name the sponsor, the relationship and the amount. Confident numbers sound like truth.",
    seconds: 30,
    level: "Standard",
    plays: 8340,
  },
];

// ── Feedback fixtures — what the Groq pipeline will eventually return
const baseFeedback: Record<"behavioural", Feedback> = {
  behavioural: {
    headline: "Good story, buried lede.",
    verdict:
      "You had a strong example but took 25 seconds to reach it. Lead with the result, cut the fillers and swap the vague verbs for ones that show ownership.",
    stats: { wpm: 142, fillers: 7, seconds: 104, uniqueWords: 118 },
    scores: [
      { label: "Structure", value: 58, note: "Situation ran long; Result was rushed." },
      { label: "Evidence", value: 71, note: "One concrete number. Add another." },
      { label: "Vocabulary", value: 54, note: "'Did', 'got', 'thing' carried too much weight." },
      { label: "Fluency", value: 66, note: "7 fillers — mostly at sentence starts." },
      { label: "Presence", value: 74, note: "Confident close." },
    ],
    transcript: [
      { t: "So, ", kind: "filler" },
      { t: "um, ", kind: "filler" },
      { t: "basically at my last job " },
      { t: "there was this thing", kind: "weak", fix: "we hit a turning point", note: "Name it — vague nouns sound unprepared." },
      { t: " where the designer and I " },
      { t: "didn't really agree", kind: "weak", fix: "had fundamentally different views", note: "Stronger, still diplomatic." },
      { t: " on the onboarding flow. " },
      { t: "Like, ", kind: "filler" },
      { t: "she wanted more screens and I wanted " },
      { t: "less", kind: "grammar", fix: "fewer", note: "'Screens' is countable → fewer." },
      { t: ". " },
      { t: "So I did a meeting", kind: "weak", fix: "So I set up a working session", note: "'Did a meeting' is flat; show initiative." },
      { t: " and we looked at the data together, " },
      { t: "and I listened to her reasons first", kind: "good", note: "This is the line interviewers remember." },
      { t: ". In the end we " },
      { t: "got", kind: "weak", fix: "achieved", note: "" },
      { t: " a 23% lift in completion, " },
      { t: "which was, you know, pretty good.", kind: "weak", fix: "which became the team's benchmark for every launch after.", note: "Don't undersell your own result." },
    ],
    phrases: [
      { id: "p-own", text: "I took ownership of…", use: "Opening the Action in a STAR answer", register: "Neutral", example: "I took ownership of the rollout and set up a weekly sync." },
      { id: "p-diff", text: "We had fundamentally different views on…", use: "Describing disagreement without blame", register: "Formal", example: "We had fundamentally different views on how much friction users would tolerate." },
      { id: "p-common", text: "We found common ground by…", use: "Turning conflict into collaboration", register: "Neutral", example: "We found common ground by testing both versions with real users." },
      { id: "p-bench", text: "…which became the benchmark for…", use: "Landing the Result with impact", register: "Formal", example: "…which became the benchmark for every launch that quarter." },
      { id: "p-hind", text: "In hindsight, I would have…", use: "Showing reflection & growth", register: "Neutral", example: "In hindsight, I would have looped in support much earlier." },
    ],
    upgraded:
      "At my last company, the lead designer and I had fundamentally different views on our onboarding flow — she wanted more guidance screens, I wanted fewer. Rather than escalate, I set up a working session where we reviewed the drop-off data together, and I made a point of hearing her reasoning first. We found common ground by testing a hybrid version, which lifted completion by 23% and became the team's benchmark for every launch after that.",
  },
};

export function feedbackFor(): Feedback {
  return baseFeedback.behavioural;
}

export const getEvent = (slug: string) => events.find((e) => e.slug === slug);
export const getScenario = (id: string) => scenarios.find((s) => s.id === id);
export const getProvider = (s: Scenario) => providers.find((p) => p.id === s.provider)!;
export const scenariosFor = (slug: EventSlug) => scenarios.filter((s) => s.event === slug);

export const toneClass: Record<StageEvent["tone"], { bg: string; fg: string }> = {
  signal: { bg: "bg-signal", fg: "text-card" },
  moss: { bg: "bg-moss", fg: "text-card" },
  ink: { bg: "bg-ink", fg: "text-paper" },
  marker: { bg: "bg-marker", fg: "text-ink" },
};

