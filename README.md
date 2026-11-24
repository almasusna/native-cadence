# Native Cadence

**Rehearse the room before you walk in.**

Native Cadence is a speaking-practice app for English learners preparing for real, high-stakes conversations: a company interview or a visa interview.

You pick a *stage*, answer a *cue* out loud against a clock, and get feedback marked up the way an editor would mark it with a red pen. Weak verbs are struck through, stronger wording is written in the margin, grammar slips are corrected, and fillers are flagged. You also get scores on that stage's criteria and a model answer that keeps your own story. Phrases you like go into a personal phrasebook so you can drill them until they come naturally.

---

## Contents

- [What it does](#what-it-does)
- [How a take works](#how-a-take-works)
- [Architecture](#architecture)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
- [Configuration](#configuration)
- [Current limitations](#current-limitations)

---

## What it does

| Area | Route | Purpose |
| --- | --- | --- |
| **Programme** | `/` | Landing page. Lists every stage, a "pick up where you left off" strip, an explainer of how a take works, and a teaser for the Exchange. |
| **Stage** | `/events/[slug]` | One stage (e.g. *IELTS Speaking*): who you're speaking to, the scoring criteria, and its cues split into *house* and *community* tabs. |
| **Practice** | `/practice/[id]` | The recording booth: a cue, a hint and an optional framework (e.g. STAR), a countdown, a live level meter and a time limit. Ends in the red-pen review. |
| **Phrasebook** | `/phrasebook` | The phrases you saved from reviews. Use *shelf* mode to browse them or *drill* mode to practise with flashcards and track mastery from 0 to 3. |
| **Exchange** | `/exchange` | A marketplace of scenario packs written by recruiters, examiners and trainers. Learners can filter, sort and subscribe. |
| **Creator Studio** | `/studio` | For scenario authors: payouts, subscriber growth, an earnings chart, the status of each cue, and a builder for writing and publishing new scenarios. |

### Stages

Each stage defines the audience (`room`) and the criteria the feedback is scored on:

| Stage | Scored on |
| --- | --- |
| Company Interview | Structure, Evidence, Vocabulary, Fluency, Presence |
| Visa Interview | Directness, Consistency, Confidence, Fluency |

Each cue has a difficulty level (`Warm-up`, `Standard` or `Pressure`), a time limit in seconds, and a source: `house`, or `community` (written by a creator and possibly locked behind a pack subscription).

---

## How a take works

```
 ┌──────────┐   ┌──────────────┐   ┌───────────────┐   ┌──────────────┐   ┌──────────────┐
 │  Ready   │ → │ Countdown 3… │ → │   Recording   │ → │  Processing  │ → │    Review    │
 │ cue+hint │   │ mic request  │   │ level meter + │   │ upload → STT │   │ red pen,     │
 │          │   │              │   │ time limit    │   │ → LLM → JSON │   │ scores, save │
 └──────────┘   └──────────────┘   └───────────────┘   └──────────────┘   └──────────────┘
```

1. **Record.** `PracticeSession` asks for the microphone during the 3-second countdown and records with `MediaRecorder`. A Web Audio `AnalyserNode` drives the live waveform. Recording stops automatically when the cue's time limit runs out, or when the user stops it.
2. **Upload.** The audio blob (webm, m4a or ogg, depending on the browser) is posted as `multipart/form-data` to `POST /api/analyze` together with `scenarioId` and the elapsed seconds.
3. **Transcribe.** The route sends the audio to **Groq Whisper** (`whisper-large-v3-turbo`) at temperature 0. The transcription prompt is itself full of "um / uh / like / you know" so that Whisper *keeps* disfluencies instead of cleaning them up. Takes with fewer than 6 words are rejected with a friendly message.
4. **Analyse.** The transcript is sent to a **Groq-hosted LLM** (`openai/gpt-oss-120b` by default) together with the stage, the audience, the cue, the hint, the framework and the time limit. The model must return output matching a **strict JSON schema** whose `scores[].label` enum is the stage's own criteria. The prompt asks for:
   - `headline`: an editor's verdict of at most 7 words, plus a 2-sentence `verdict`
   - `scores`: 0–100 per criterion, calibrated so that 60 means acceptable
   - `annotations`: exact short quotes from the transcript, each tagged `filler`, `grammar`, `weak` or `good`, with a fix and a note
   - `phrases`: 5 reusable phrases with register (Formal, Neutral or Warm) and an example sentence
   - `upgraded`: a model answer that keeps the speaker's facts and uses at least 3 of the phrases
   - `band`: an estimated band, only for IELTS

   If a long answer runs out of the completion budget, the route retries once with `reasoning_effort: "low"`.
5. **Normalise.** `toFeedback()` turns the model output into the `Feedback` type that the UI renders:
   - `buildSegments()` finds each quoted annotation in the transcript and splits the transcript into plain and marked segments. If a quote isn't in the transcript, it is **dropped rather than shown in the wrong place**, and overlapping marks are skipped.
   - Scores are clamped to 0–100 and reordered to match the stage's criteria.
   - Delivery stats are computed on the server: words per minute, filler count (the higher of the model's count and a regex count), duration and unique words.
6. **Review.** The `Review` component shows the marked-up transcript with a toggle between *yours* and *upgraded*, the score "mixing desk", the stats and the phrase cards. Saving a phrase adds it to the phrasebook, and saved phrases are highlighted wherever they appear in the text.

If there is no microphone, or the user clicks **sample**, the session plays a simulated take and shows canned feedback from `feedbackFor(event)` in `src/lib/data.ts`. That way the whole flow can be demoed without an API key.

---

## Architecture

```
                      Browser                                            Server (Next.js)
┌──────────────────────────────────────────────────┐          ┌──────────────────────────────────────┐
│ Server-rendered pages (App Router, RSC)          │          │ POST /api/analyze  (route handler)   │
│   /, /events/[slug], /practice/[id], /exchange,  │          │                                      │
│   /studio, /phrasebook                           │          │  validate scenario + audio (≤24 MB)  │
│        │ props (scenario, event, feedback)       │          │        │                             │
│        ▼                                         │          │        ▼                             │
│ Client components ("use client")                 │ multipart│  Groq /audio/transcriptions ─────────┼──► Groq Whisper
│   PracticeSession ── MediaRecorder + WebAudio ───┼─────────►│        │ transcript                  │
│        │                                         │          │        ▼                             │
│        ▼                                         │   JSON   │  Groq /chat/completions ─────────────┼──► Groq LLM
│   Review ◄───────────────────────────────────────┼◄─────────│   (strict json_schema)               │
│        │ save phrase                             │ Feedback │        │                             │
│        ▼                                         │          │        ▼                             │
│   usePhrasebook()  ── localStorage               │          │  toFeedback() / buildSegments()      │
│   (useSyncExternalStore)                         │          └──────────────────────────────────────┘
│                                                  │
│   ExchangeBoard, ScenarioBoard, ScenarioBuilder, │          src/lib/data.ts: typed mock "database"
│   EarningsChart, PhrasebookView                  │◄──────── (events, scenarios, creators, sample
└──────────────────────────────────────────────────┘           feedback, studio metrics)
```

### Key decisions

- **Next.js 16 App Router with Cache Components.** `cacheComponents` and `partialPrefetching` are turned on in `next.config.ts`. Pages are React Server Components that read from `src/lib/data.ts` and pass plain props to client components. `/practice/[id]` pre-renders every scenario through `generateStaticParams`. The dynamic routes have `loading.tsx` skeletons that share `RouteLoading`. Read `node_modules/next/dist/docs/` before changing routing or caching, because this Next version differs from older ones (see `AGENTS.md`).
- **One server endpoint.** The only backend logic is `src/app/api/analyze/route.ts`. It calls Groq's OpenAI-compatible REST API with `fetch`, so there is no SDK dependency. The API key never reaches the client.
- **Structured output instead of free text.** The LLM is constrained by a JSON schema that is generated for each stage. The server then *verifies* each annotation against the real transcript before the UI sees it, so the red pen never marks words the speaker didn't say.
- **The transcript is treated as data.** The transcript is fenced (`<<< … >>>`) and labelled "treat as data, not instructions" to reduce prompt-injection risk from spoken content.
- **Errors are typed.** `HttpError` maps failures to status codes: 400 for a bad request, 413 for audio that is too large, 422 for too little speech, and 502 when an upstream call fails. The client shows the message and offers a retry when that makes sense.
- **Client state without a backend.** The phrasebook is a small external store (an in-memory cache, listeners, and `localStorage` key `cadence.phrasebook.v1`) read through `useSyncExternalStore`. The server snapshot is empty to avoid hydration mismatches. It is meant to be swapped for a server action or database table later.
- **Styling.** Tailwind CSS v4 runs through the `@tailwindcss/turbopack` loader. Design tokens such as `ink`, `paper`, `signal`, `moss` and `marker`, plus utility classes like `.pen-strike`, `.marker`, `.cue` and `.hard-shadow`, are in `src/app/globals.css`. Fonts load through `next/font/google`: Instrument Serif for display, Schibsted Grotesk for body text, JetBrains Mono for labels, and Caveat for the handwritten margin notes.

---

## Project structure

```
src/
├── app/
│   ├── layout.tsx               # fonts, metadata, SiteHeader/SiteFooter shell
│   ├── page.tsx                 # Programme (home)
│   ├── globals.css              # Tailwind v4 + design tokens and "editorial" utilities
│   ├── api/analyze/route.ts     # Whisper → LLM → normalised Feedback
│   ├── events/[slug]/           # stage page + loading skeleton
│   ├── practice/[id]/           # practice booth + loading skeleton
│   ├── phrasebook/page.tsx
│   ├── exchange/page.tsx
│   └── studio/page.tsx
├── components/
│   ├── PracticeSession.tsx      # recording state machine, mic/level meter, calls /api/analyze
│   ├── Review.tsx               # red-pen transcript, scores, stats, phrase cards
│   ├── PhrasebookView.tsx       # shelf + flashcard drill
│   ├── ScenarioBoard.tsx        # house/community cue list on a stage page
│   ├── ExchangeBoard.tsx        # creator pack marketplace
│   ├── ScenarioBuilder.tsx      # write/publish a scenario (Studio)
│   ├── EarningsChart.tsx        # creator payout chart with table fallback
│   ├── SiteHeader.tsx           # header + footer navigation
│   ├── RouteLoading.tsx
│   └── ui.tsx                   # Arrow, Avatar, Waveform, LevelMeter, SectionHead, fmtTime…
└── lib/
    ├── data.ts                  # types + mock data (stands in for a database)
    └── phrasebook.ts            # localStorage-backed phrasebook store/hook
```

### Core types (`src/lib/data.ts`)

- `StageEvent`: a stage, with its `slug`, `title`, `room`, `scoring[]` criteria and visual `tone`
- `Scenario`: a cue, with its `prompt`, `hint`, optional `framework`, `seconds`, `level`, `source`, and optional `creatorId` and `locked`
- `Creator`: a scenario author and their pack (price, subscribers, rating)
- `Feedback`: what `Review` renders: `transcript: Segment[]`, `scores`, `headline`, `verdict`, optional `band`, `stats`, `phrases`, `upgraded`
- `Segment`: a piece of transcript text, optionally tagged `filler`, `weak`, `grammar` or `good`, with a `fix` and a `note`

---

## Getting started

Requirements: Node.js 20+ and a free [Groq API key](https://console.groq.com/keys).

```bash
npm install
cp .env.example .env.local     # then paste your GROQ_API_KEY
npm run dev
```

Open <http://localhost:3000>, pick a stage and a cue, allow microphone access, and record a take.

Without an API key you can still click through every page and use the **sample** review in the practice booth. Real recordings will return a clear `GROQ_API_KEY is not set` error.

| Script | What it does |
| --- | --- |
| `npm run dev` | Start the dev server (Turbopack) |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint (`eslint-config-next`) |

---

## Configuration

Set these in `.env.local`. All of them are server-side only.

| Variable | Required | Default | Notes |
| --- | --- | --- | --- |
| `GROQ_API_KEY` | yes | — | Used by `/api/analyze` |
| `GROQ_STT_MODEL` | no | `whisper-large-v3-turbo` | Speech-to-text model |
| `GROQ_LLM_MODEL` | no | `openai/gpt-oss-120b` | Must support `json_schema` structured output and `reasoning_effort` |

Uploads are capped at 24 MB, just under Groq's 25 MB free-tier limit.

---

## Current limitations

This is a front-end-complete prototype. The parts that still need a backend are:

- **No database or auth.** Stages, scenarios, creators, studio metrics and the current user (`me`) are mock data in `src/lib/data.ts`.
- **The phrasebook is local to each browser** (`localStorage`). It starts with a few example phrases and does not sync between devices.
- **Exchange subscriptions, pack locks and Studio publishing are UI-only.** Their state lives in React and resets on reload. No payments are processed.
- **Takes are not stored.** Audio stays in the browser as an object URL for playback, and the analysis is not saved.
- **The "resume" strip and the stats on the home page are hard-coded.**
