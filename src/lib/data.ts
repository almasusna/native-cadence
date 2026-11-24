// Mock data — stands in for the database until the backend exists.

export type EventSlug =
  | "job-interview"
  | "ielts-speaking"
  | "qatar-airways"
  | "customer-complaints"
  | "visa-interview"
  | "pitch";

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
    slug: "ielts-speaking",
    title: "IELTS Speaking",
    kicker: "Parts 1 · 2 · 3 — band-scored",
    blurb:
      "Familiar topics, the two-minute long turn, then abstract discussion. Marked on the four official criteria.",
    room: "One examiner, a timer and a recorder",
    duration: "11–14 min",
    tone: "signal",
    scoring: ["Fluency & Coherence", "Lexical Resource", "Grammar", "Pronunciation"],
  },
  {
    slug: "qatar-airways",
    title: "Qatar Airways Cabin Crew",
    kicker: "Assessment day · Final interview",
    blurb:
      "Warmth under pressure. Situational questions about difficult passengers, teamwork at 38,000 ft and why you want to fly.",
    room: "Two recruiters, smiling, taking notes",
    duration: "20–30 min",
    tone: "moss",
    scoring: ["Warmth", "Clarity", "Service language", "Composure", "Fluency"],
  },
  {
    slug: "customer-complaints",
    title: "Customer Complaints",
    kicker: "De-escalation on the front line",
    blurb:
      "An angry caller, a refund you can't give, a manager who isn't coming. Learn the language that lowers the temperature.",
    room: "One frustrated customer",
    duration: "5–10 min",
    tone: "marker",
    scoring: ["Empathy", "Ownership", "Clarity", "Tone", "Resolution"],
  },
  {
    slug: "visa-interview",
    title: "Visa Interview",
    kicker: "Consular window · Three minutes",
    blurb:
      "Short, direct answers about your plans, your ties and your funds. Every hesitation is noticed.",
    room: "One consular officer behind glass",
    duration: "2–5 min",
    tone: "ink",
    scoring: ["Directness", "Consistency", "Confidence", "Fluency"],
  },
  {
    slug: "pitch",
    title: "Pitch & Presentation",
    kicker: "Investors · Stakeholders · Demo day",
    blurb:
      "Open strong, land the number, survive the question you hoped they wouldn't ask.",
    room: "Five people, one of them on their phone",
    duration: "3–10 min",
    tone: "signal",
    scoring: ["Hook", "Clarity", "Persuasion", "Pace", "Q&A poise"],
  },
];

// Who published each practice. Fictional schools and companies for the demo.
export const providers: Provider[] = [
  { id: "brightline", name: "Brightline English School", kind: "School", about: "IELTS and general English" },
  { id: "harbour", name: "Harbour Business English", kind: "School", about: "Interview and workplace English" },
  { id: "skyward", name: "Skyward Cabin Crew Academy", kind: "School", about: "Airline assessment-day coaching" },
  { id: "northwind", name: "Northwind Telecom", kind: "Company", about: "Front-line support training" },
  { id: "nc", name: "Native Cadence", kind: "Platform", about: "Free starter practices" },
];

const providerByEvent: Record<EventSlug, string> = {
  "ielts-speaking": "brightline",
  "job-interview": "harbour",
  "qatar-airways": "skyward",
  "customer-complaints": "northwind",
  "visa-interview": "nc",
  pitch: "nc",
};

export const scenarios: Scenario[] = [
  // ── Company interview
  {
    id: "ji-1",
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
    event: "job-interview",
    title: "Kill your own feature",
    prompt: "Tell me about a time you decided to stop working on something you'd championed.",
    hint: "Data first, ego last. Mention who you told and how.",
    seconds: 120,
    level: "Standard",
    plays: 1530,
  },

  // ── IELTS
  {
    id: "ie-1",
    event: "ielts-speaking",
    title: "Part 1 — Your hometown",
    prompt: "Let's talk about where you grew up. What do you like most about your hometown?",
    hint: "Answer, then extend with one reason and one example. Two to three sentences — don't deliver a speech.",
    framework: "Answer · Reason · Example",
    seconds: 40,
    level: "Warm-up",
    plays: 40211,
  },
  {
    id: "ie-2",
    event: "ielts-speaking",
    title: "Part 2 — A skill you learned",
    prompt:
      "Describe a skill you learned that took a long time. You should say: what it was, why you learned it, how you learned it, and explain how you feel about it now.",
    hint: "Use your minute of prep to jot four keywords, one per bullet. Keep talking for the full two minutes — the examiner will stop you.",
    framework: "What · Why · How · Feeling",
    seconds: 120,
    level: "Standard",
    plays: 35870,
  },
  {
    id: "ie-3",
    event: "ielts-speaking",
    title: "Part 3 — Technology & learning",
    prompt: "Do you think technology has made people better or worse at learning new skills?",
    hint: "Take a position, then concede the other side. Use hedging language: 'to some extent', 'it largely depends on'.",
    framework: "Position · Concession · Example",
    seconds: 90,
    level: "Pressure",
    plays: 22104,
  },
  {
    id: "ie-4",
    event: "ielts-speaking",
    title: "Part 1 — Weekends",
    prompt: "How do you usually spend your weekends?",
    hint: "Contrast past and present to show tense control: 'I used to… but these days I tend to…'.",
    seconds: 40,
    level: "Warm-up",
    plays: 31009,
  },
  {
    id: "ie-c1",
    event: "ielts-speaking",
    title: "Part 2 — A place with too many people",
    prompt:
      "Describe a crowded place you have visited. Say where it was, when you went, what you did there, and explain how you felt.",
    hint: "Sensory detail lifts Lexical Resource: sounds, smells, how close people stood.",
    seconds: 120,
    level: "Standard",
    plays: 8810,
  },
  {
    id: "ie-c2",
    event: "ielts-speaking",
    title: "Part 3 — Cities of the future",
    prompt: "Will people prefer living in cities or the countryside fifty years from now?",
    hint: "Speculative grammar: 'it's conceivable that…', 'we may well see…'.",
    seconds: 90,
    level: "Pressure",
    plays: 6102,
  },

  // ── Qatar Airways
  {
    id: "qr-1",
    event: "qatar-airways",
    title: "Why cabin crew?",
    prompt: "Why do you want to become cabin crew, and why with us specifically?",
    hint: "Avoid 'I love to travel'. Talk about service, people and the standard the airline is known for.",
    seconds: 75,
    level: "Warm-up",
    plays: 15420,
  },
  {
    id: "qr-2",
    event: "qatar-airways",
    title: "The upgrade demand",
    prompt: "A business-class-ticket holder's seat is broken and the cabin is full. They're demanding to speak to the captain. What do you do?",
    hint: "Acknowledge → Apologise → Act → Assure. Offer what you can do, never promise what you can't.",
    framework: "Acknowledge · Apologise · Act · Assure",
    seconds: 90,
    level: "Pressure",
    plays: 12077,
  },
  {
    id: "qr-3",
    event: "qatar-airways",
    title: "Working with someone difficult",
    prompt: "Tell us about a time you worked with a team member you didn't get along with.",
    hint: "On board, teamwork is safety. Show you kept the service seamless for passengers.",
    seconds: 90,
    level: "Standard",
    plays: 9930,
  },
  {
    id: "qr-c1",
    event: "qatar-airways",
    title: "Nervous first-time flyer",
    prompt: "A passenger grips your arm during turbulence and says they think the plane is going to crash. Speak to them.",
    hint: "Lower your voice, slow your pace, give them a job: 'Let's breathe together for the next minute'.",
    seconds: 60,
    level: "Standard",
    plays: 4410,
  },
  {
    id: "qr-c2",
    event: "qatar-airways",
    title: "The group interview hand-raise",
    prompt: "In the group task, two candidates are talking over each other. Bring the group back to the task.",
    hint: "Recruiters watch who includes the quiet person. Use names.",
    seconds: 60,
    level: "Pressure",
    plays: 3874,
  },

  // ── Complaints
  {
    id: "cc-1",
    event: "customer-complaints",
    title: "Charged twice",
    prompt: "\"I've been charged twice this month and nobody has called me back. This is the third time I'm calling!\"",
    hint: "Don't defend the company first. Acknowledge the repeat contact specifically, then give a timeline.",
    framework: "Hear · Own · Fix · Follow-up",
    seconds: 60,
    level: "Standard",
    plays: 7703,
  },
  {
    id: "cc-2",
    event: "customer-complaints",
    title: "The refund you can't give",
    prompt: "\"I want a full refund. I don't care what the policy says.\" — the item is outside the return window.",
    hint: "Say what you CAN do before what you can't. Offer two options so they feel in control.",
    seconds: 75,
    level: "Pressure",
    plays: 6620,
  },
  {
    id: "cc-3",
    event: "customer-complaints",
    title: "Late delivery, special occasion",
    prompt: "\"This was my daughter's birthday present and it's not here. The party is tomorrow.\"",
    hint: "Name the emotion and the stakes. People forgive delays, not indifference.",
    seconds: 60,
    level: "Warm-up",
    plays: 5512,
  },
  {
    id: "cc-c1",
    event: "customer-complaints",
    title: "\"I'm cancelling today\"",
    prompt: "\"Ten years I've been with you and you raise my bill again? Cancel it. Now.\"",
    hint: "Honour the loyalty out loud before you mention a retention offer.",
    seconds: 75,
    level: "Pressure",
    plays: 1980,
  },

  // ── Visa
  {
    id: "vi-1",
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
    event: "visa-interview",
    title: "Who pays?",
    prompt: "Who is funding your studies, and how?",
    hint: "Name the sponsor, the relationship and the amount. Confident numbers sound like truth.",
    seconds: 30,
    level: "Standard",
    plays: 8340,
  },

  // ── Pitch
  {
    id: "pi-1",
    event: "pitch",
    title: "The opening line",
    prompt: "You have 30 seconds. What does your company do and why should we care?",
    hint: "Problem in one line, your answer in one line, one number that proves it's working.",
    framework: "Problem · Answer · Proof",
    seconds: 30,
    level: "Warm-up",
    plays: 6731,
  },
  {
    id: "pi-2",
    event: "pitch",
    title: "\"Why won't Google just build this?\"",
    prompt: "What stops a big incumbent from copying you next quarter?",
    hint: "Don't say 'nothing'. Talk about speed, focus, a data advantage or a distribution wedge.",
    seconds: 60,
    level: "Pressure",
    plays: 4102,
  },
  {
    id: "pi-c1",
    event: "pitch",
    title: "Interrupted at slide two",
    prompt: "\"Sorry — before you go on, what's your revenue right now?\"",
    hint: "Answer the number straight, then bridge back: 'and that's exactly why the next slide matters'.",
    seconds: 45,
    level: "Pressure",
    plays: 1702,
  },
];

// ── Feedback fixtures — what the Groq pipeline will eventually return
const baseFeedback: Record<"behavioural" | "ielts" | "service", Feedback> = {
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
  ielts: {
    headline: "Band 6.5 → within reach of 7.",
    band: "6.5",
    verdict:
      "Fluent and on-topic, but your vocabulary stayed in safe territory. Examiners reward less common, precise words and natural collocations — you have room to show more range.",
    stats: { wpm: 131, fillers: 5, seconds: 118, uniqueWords: 141 },
    scores: [
      { label: "Fluency & Coherence", value: 72, note: "Kept going for the full turn. Some self-correction." },
      { label: "Lexical Resource", value: 58, note: "'Very', 'good', 'nice' repeated." },
      { label: "Grammar", value: 64, note: "Mostly simple sentences; one tense slip." },
      { label: "Pronunciation", value: 70, note: "Clear; flatten intonation less on lists." },
    ],
    transcript: [
      { t: "I want to talk about " },
      { t: "how I learn", kind: "grammar", fix: "how I learned", note: "Past event → past tense." },
      { t: " to play the oud. " },
      { t: "Um, ", kind: "filler" },
      { t: "it was " },
      { t: "very difficult", kind: "weak", fix: "painstakingly slow", note: "Precise adverb + adjective lifts Lexical Resource." },
      { t: " because my fingers " },
      { t: "were hurting all the time", kind: "good", note: "Nice concrete detail." },
      { t: ". My grandfather " },
      { t: "teached", kind: "grammar", fix: "taught", note: "Irregular past." },
      { t: " me every Sunday and " },
      { t: "it was really nice", kind: "weak", fix: "those afternoons are some of my fondest memories", note: "Replace generic praise with a feeling." },
      { t: ". " },
      { t: "Now I feel good about it", kind: "weak", fix: "Looking back, I'm genuinely proud I persevered", note: "Shows reflection + less common verb." },
      { t: " because " },
      { t: "you know, ", kind: "filler" },
      { t: "I can play at family events." },
    ],
    phrases: [
      { id: "p-pains", text: "It was a painstakingly slow process", use: "Describing difficulty precisely", register: "Neutral", example: "Learning the scales was a painstakingly slow process." },
      { id: "p-fond", text: "…some of my fondest memories", use: "Talking about the past with feeling", register: "Warm", example: "Those Sunday lessons are some of my fondest memories." },
      { id: "p-pers", text: "I'm genuinely proud I persevered", use: "Part 2 'explain how you feel' bullet", register: "Neutral", example: "Looking back, I'm genuinely proud I persevered." },
      { id: "p-extent", text: "To a large extent, …", use: "Hedging an opinion in Part 3", register: "Formal", example: "To a large extent, technology has made learning more accessible." },
      { id: "p-hang", text: "Once I got the hang of it…", use: "Natural idiom for progress", register: "Warm", example: "Once I got the hang of it, I practised every evening." },
    ],
    upgraded:
      "I'd like to talk about how I learned to play the oud. Honestly, it was a painstakingly slow process — for months my fingertips were sore all the time. My grandfather taught me every Sunday, and those afternoons are some of my fondest memories. Once I got the hang of it, I started practising every evening. Looking back, I'm genuinely proud I persevered, because now I can play at family gatherings.",
  },
  service: {
    headline: "Kind — but you apologised your authority away.",
    verdict:
      "Your warmth comes through. But you said 'sorry' four times and never told the passenger what happens next. Calm people with a plan, not with apologies.",
    stats: { wpm: 156, fillers: 4, seconds: 82, uniqueWords: 96 },
    scores: [
      { label: "Warmth", value: 82, note: "Tone is genuinely caring." },
      { label: "Ownership", value: 49, note: "No clear next step offered." },
      { label: "Service language", value: 61, note: "Over-apology, under-commitment." },
      { label: "Composure", value: 68, note: "Pace sped up — 156 wpm." },
      { label: "Clarity", value: 63, note: "Two sentences ran together." },
    ],
    transcript: [
      { t: "Oh I'm so sorry, " },
      { t: "I'm really really sorry", kind: "weak", fix: "I completely understand how frustrating this is", note: "Validate the feeling, apologise once." },
      { t: " sir. " },
      { t: "Um, ", kind: "filler" },
      { t: "the captain is busy", kind: "weak", fix: "the captain needs to stay focused on the flight", note: "Gives a reason, not a brush-off." },
      { t: " so " },
      { t: "I can't do that", kind: "weak", fix: "what I can do right now is", note: "Lead with what you CAN do." },
      { t: ". " },
      { t: "Let me see what seats are free", kind: "good", note: "Good instinct — action." },
      { t: " and " },
      { t: "I'll try to", kind: "weak", fix: "I will personally", note: "'Try' sounds like failure is likely." },
      { t: " come back to you." },
    ],
    phrases: [
      { id: "p-under", text: "I completely understand how frustrating this is.", use: "Validating before solving", register: "Warm", example: "I completely understand how frustrating this is after a long day." },
      { id: "p-can", text: "What I can do for you right now is…", use: "Redirecting from 'no' to action", register: "Neutral", example: "What I can do for you right now is find you a seat with extra legroom." },
      { id: "p-pers2", text: "I'll personally make sure that…", use: "Taking ownership", register: "Formal", example: "I'll personally make sure the purser knows about this." },
      { id: "p-moment", text: "Give me two minutes and I'll come straight back to you.", use: "Giving a concrete timeline", register: "Neutral", example: "Give me two minutes and I'll come straight back to you with options." },
      { id: "p-appre", text: "I really appreciate your patience.", use: "Closing on gratitude, not apology", register: "Warm", example: "Thank you — I really appreciate your patience while we sort this out." },
    ],
    upgraded:
      "I completely understand how frustrating this is, sir, especially on a long flight. The captain needs to stay focused on flying us safely, but what I can do for you right now is check every available seat in the cabin. Give me two minutes and I'll come straight back to you — and I'll personally make sure the purser hears about this so it's resolved properly on the ground. I really appreciate your patience.",
  },
};

export function feedbackFor(event: EventSlug): Feedback {
  if (event === "ielts-speaking") return baseFeedback.ielts;
  if (event === "qatar-airways" || event === "customer-complaints") return baseFeedback.service;
  return baseFeedback.behavioural;
}

export const getEvent = (slug: string) => events.find((e) => e.slug === slug);
export const getScenario = (id: string) => scenarios.find((s) => s.id === id);
export const getProvider = (s: Scenario) => providers.find((p) => p.id === providerByEvent[s.event])!;
export const scenariosFor = (slug: EventSlug) => scenarios.filter((s) => s.event === slug);

export const toneClass: Record<StageEvent["tone"], { bg: string; fg: string }> = {
  signal: { bg: "bg-signal", fg: "text-card" },
  moss: { bg: "bg-moss", fg: "text-card" },
  ink: { bg: "bg-ink", fg: "text-paper" },
  marker: { bg: "bg-marker", fg: "text-ink" },
};

