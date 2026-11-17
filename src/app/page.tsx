import Link from "next/link";
import { creators, events, getEvent, me, scenarios, scenariosFor, toneClass } from "@/lib/data";
import { Arrow, Avatar, SectionHead, Waveform } from "@/components/ui";

export default function Home() {
  const resume = scenarios.find((s) => s.id === "ie-2")!;
  const resumeEvent = getEvent(resume.event)!;

  return (
    <div className="mx-auto max-w-[1320px] px-5 md:px-8">
      {/* ───────────── Hero ───────────── */}
      <section className="grid gap-12 pb-20 pt-12 md:grid-cols-[1.25fr_1fr] md:pt-20">
        <div className="animate-rise">
          <div className="label mb-8 flex items-center gap-3 text-mute">
            <span className="inline-flex items-center gap-2 border border-signal px-2 py-1 text-signal">
              <span className="h-2 w-2 animate-onair rounded-full bg-signal" /> On air
            </span>
            Good evening, {me.name} — {me.takesThisWeek} takes this week
          </div>

          <h1 className="font-display text-[clamp(3.2rem,8vw,7.4rem)] leading-[0.88] tracking-[-0.02em]">
            Rehearse the room
            <br />
            <span className="italic">before</span> you{" "}
            <span className="relative inline-block">
              walk in.
              <svg
                viewBox="0 0 300 24"
                className="absolute -bottom-2 left-0 h-4 w-full text-signal"
                preserveAspectRatio="none"
                aria-hidden
              >
                <path
                  d="M3 16 C 60 6, 120 22, 180 10 S 270 8, 297 14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>

          <p className="mt-10 max-w-xl text-lg leading-relaxed text-ink-2">
            Pick a stage. Answer the cue out loud. Native Cadence transcribes your take, marks it up like an
            editor with a red pen, and hands you the{" "}
            <span className="marker">exact phrases</span> that would have landed better.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <a href="#programme" className="btn btn-signal">
              Choose a stage <Arrow />
            </a>
            <Link href="/exchange" className="btn btn-ghost">
              Browse community scenarios
            </Link>
          </div>
        </div>

        {/* stacked cue cards */}
        <div className="relative min-h-[540px] animate-rise [animation-delay:120ms]">
          <div className="cue absolute right-2 top-6 w-[88%] rotate-[4deg] p-6 pt-8 opacity-70">
            <div className="label text-mute">Cue 03 · Pressure</div>
            <p className="mt-3 font-display text-2xl leading-tight">
              “What stops a big incumbent from copying you?”
            </p>
          </div>
          <div className="cue absolute left-0 top-16 w-[92%] -rotate-[2.5deg] p-6 pt-8 hard-shadow">
            <div className="flex items-center justify-between">
              <span className="label text-mute">Cue 02 · Company interview</span>
              <span className="label text-signal">● 01:12</span>
            </div>
            <p className="mt-4 font-display text-[1.9rem] leading-[1.08]">
              “Tell me about a time you disagreed with a colleague.”
            </p>
            <Waveform className="mt-6 h-14" barClass="bg-signal" seed={3} animate />
            <div className="mt-5 border-t border-dashed border-ink/30 pt-4 text-[0.95rem] leading-relaxed text-ink-2">
              So I <span className="pen-strike">did a meeting</span>{" "}
              <span className="font-hand text-xl text-signal">set up a working session</span> and we
              looked at the data together…
            </div>
          </div>
          <div className="absolute -bottom-2 right-0 w-[64%] rotate-[3deg] border-[1.5px] border-ink bg-marker p-4 hard-shadow-sm">
            <div className="label">Saved to phrasebook</div>
            <p className="mt-1 font-display text-2xl italic">“We found common ground by…”</p>
          </div>
        </div>
      </section>

      {/* ───────────── Resume strip ───────────── */}
      <section className="mb-24 grid items-stretch border-[1.5px] border-ink bg-card md:grid-cols-[auto_1fr_auto]">
        <div className="flex items-center gap-4 border-b border-ink bg-ink px-6 py-5 text-paper md:border-b-0 md:border-r">
          <span className="label text-paper/60">Pick up</span>
          <span className="font-display text-3xl italic">where you left off</span>
        </div>
        <div className="flex flex-col justify-center gap-1 px-6 py-5">
          <span className="label text-mute">
            {resumeEvent.title} · last take scored band 6.5
          </span>
          <span className="font-display text-2xl">{resume.title}</span>
        </div>
        <Link
          href={`/practice/${resume.id}`}
          className="group flex items-center justify-center gap-3 border-t border-ink bg-signal px-8 py-5 font-semibold text-card transition-colors hover:bg-signal-deep md:border-l md:border-t-0"
        >
          Retake <Arrow className="transition-transform group-hover:translate-x-1" />
        </Link>
      </section>

      {/* ───────────── Programme ───────────── */}
      <section id="programme" className="scroll-mt-28">
        <SectionHead
          index="§ 01"
          title={
            <>
              Tonight’s <span className="italic">programme</span>
            </>
          }
          aside={<span className="label text-mute">{events.length} stages · {scenarios.length} cues</span>}
        />

        <ol>
          {events.map((e, i) => {
            const count = scenariosFor(e.slug).length;
            const t = toneClass[e.tone];
            return (
              <li key={e.slug}>
                <Link
                  href={`/events/${e.slug}`}
                  className="group grid grid-cols-[3.5rem_1fr_auto] items-center gap-4 border-b border-ink py-7 transition-colors hover:bg-ink hover:text-paper md:grid-cols-[6rem_1.3fr_1fr_auto] md:gap-8 md:px-4"
                >
                  <span className="font-display text-5xl leading-none text-ink/25 transition-colors group-hover:text-signal md:text-7xl">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>
                    <span className="block font-display text-3xl leading-tight md:text-[2.6rem]">
                      {e.title}
                    </span>
                    <span className="label mt-2 block text-mute group-hover:text-paper/60">
                      {e.kicker}
                    </span>
                  </span>
                  <span className="hidden text-[0.95rem] leading-relaxed text-ink-2 group-hover:text-paper/75 md:block">
                    {e.blurb}
                  </span>
                  <span className="flex flex-col items-end gap-3">
                    <span
                      className={`label px-2 py-1 ${t.bg} ${t.fg} border border-ink group-hover:border-paper`}
                    >
                      {count} cues
                    </span>
                    <Arrow className="h-6 w-6 transition-transform group-hover:translate-x-1.5" />
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      </section>

      {/* ───────────── How a take works ───────────── */}
      <section className="mt-28">
        <SectionHead
          index="§ 02"
          title={
            <>
              Anatomy of a <span className="italic">take</span>
            </>
          }
        />
        <div className="grid border-[1.5px] border-ink md:grid-cols-4">
          {[
            {
              n: "Rec",
              title: "Speak to the cue",
              body: "A prompt, a hint on how to shape it, and a clock. No retries mid-take — just like the real room.",
            },
            {
              n: "Txt",
              title: "Transcribed in seconds",
              body: "Your audio is transcribed word-for-word — fillers, false starts and all.",
            },
            {
              n: "Pen",
              title: "Red-penned",
              body: "Weak verbs struck through, stronger alternatives written in the margin, scores on a mixing desk.",
            },
            {
              n: "Keep",
              title: "Phrases you keep",
              body: "Save the lines you liked. Drill them later until they come out on their own.",
            },
          ].map((s, i) => (
            <div
              key={s.n}
              className={`relative p-7 ${i < 3 ? "border-b border-ink md:border-b-0 md:border-r" : ""} ${i === 2 ? "bg-card" : ""}`}
            >
              <div className="flex items-center justify-between">
                <span className="grid h-12 w-12 place-items-center rounded-full border-[1.5px] border-ink font-mono text-[0.68rem] font-bold uppercase">
                  {s.n}
                </span>
                <span className="label text-mute">0{i + 1}</span>
              </div>
              <h3 className="mt-8 font-display text-3xl leading-tight">{s.title}</h3>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-2">{s.body}</p>
              {i === 2 && (
                <p className="mt-4 text-[0.95rem]">
                  <span className="pen-strike">got</span>{" "}
                  <span className="font-hand text-2xl text-signal">achieved</span>
                </p>
              )}
              {i === 3 && (
                <p className="mt-4 font-display text-xl italic">
                  <span className="marker">“I took ownership of…”</span>
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ───────────── Exchange teaser ───────────── */}
      <section className="mt-28">
        <SectionHead
          index="§ 03"
          title={
            <>
              The <span className="italic">Exchange</span>
            </>
          }
          aside={
            <Link href="/exchange" className="label inline-flex items-center gap-2 hover:text-signal">
              All creators <Arrow />
            </Link>
          }
        />
        <p className="-mt-2 mb-10 max-w-2xl text-lg text-ink-2">
          Scenarios written by people who sat on the other side of the table — recruiters, examiners,
          trainers. Subscribe to a pack, or write your own and{" "}
          <span className="marker">earn every month someone practises with it.</span>
        </p>
        <div className="grid gap-6 md:grid-cols-3">
          {creators.slice(0, 3).map((c) => {
            const ev = getEvent(c.event)!;
            return (
              <Link
                key={c.id}
                href="/exchange"
                className="stub group flex flex-col border-[1.5px] border-ink bg-card transition-transform hover:-translate-y-1"
              >
                <div className="flex items-center gap-3 border-b border-dashed border-ink/40 p-5">
                  <Avatar initials={c.initials} />
                  <div>
                    <div className="font-semibold">{c.name}</div>
                    <div className="text-sm text-mute">{c.credential}</div>
                  </div>
                </div>
                <div className="flex-1 p-5">
                  <div className="label text-mute">{ev.title}</div>
                  <div className="mt-2 font-display text-[1.7rem] leading-tight">{c.packTitle}</div>
                </div>
                <div className="flex items-center justify-between border-t border-ink px-5 py-3">
                  <span className="label">{c.scenarioCount} cues · ★ {c.rating}</span>
                  <span className="font-display text-2xl">
                    ${c.price}
                    <span className="text-base italic text-mute">/mo</span>
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
