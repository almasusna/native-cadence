"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Feedback, Provider, Scenario, StageEvent } from "@/lib/data";
import { Arrow, LevelMeter, MicIcon, fmtTime } from "./ui";
import { Review } from "./Review";

type Phase = "ready" | "countdown" | "recording" | "processing" | "review";

const BARS = 56;
const PIPELINE = [
  { label: "Uploading take", detail: "Sending your recording" },
  { label: "Transcribing", detail: "Every word, ums included" },
  { label: "Reading for structure & vocabulary", detail: "Checking how the answer flows" },
  { label: "Marking up with the red pen", detail: "Scoring against the rubric" },
];

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function PracticeSession({
  scenario,
  event,
  feedback,
  provider,
  nextId,
}: {
  scenario: Scenario;
  event: StageEvent;
  feedback: Feedback;
  provider?: Provider;
  nextId?: string;
}) {
  const [phase, setPhase] = useState<Phase>("ready");
  const [count, setCount] = useState(3);
  const [elapsed, setElapsed] = useState(0);
  const [levels, setLevels] = useState<number[]>(() => Array(BARS).fill(0.06));
  const [simulated, setSimulated] = useState(false);
  const [step, setStep] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [hintOpen, setHintOpen] = useState(true);
  const [result, setResult] = useState<Feedback | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [retryable, setRetryable] = useState(false);

  const alive = useRef(true);
  const raf = useRef(0);
  const stream = useRef<MediaStream | null>(null);
  const ctx = useRef<AudioContext | null>(null);
  const analyser = useRef<AnalyserNode | null>(null);
  const recorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const history = useRef<number[]>(Array(BARS).fill(0.06));
  const stopRef = useRef<() => void>(() => {});
  const lastBlob = useRef<Blob | null>(null);
  const elapsedRef = useRef(0);

  const teardown = useCallback(() => {
    cancelAnimationFrame(raf.current);
    stream.current?.getTracks().forEach((t) => t.stop());
    stream.current = null;
    ctx.current?.close().catch(() => {});
    ctx.current = null;
  }, []);

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
      teardown();
    };
  }, [teardown]);

  const process = useCallback(async () => {
    setPhase("processing");
    for (let i = 0; i < PIPELINE.length; i++) {
      if (!alive.current) return;
      setStep(i);
      await wait(i === 1 ? 1300 : 850);
    }
    if (!alive.current) return;
    setStep(PIPELINE.length);
    await wait(350);
    if (alive.current) {
      setPhase("review");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  /** Send the recorded take to /api/analyze (transcription → feedback). */
  const analyze = useCallback(
    async (blob: Blob) => {
      setPhase("processing");
      setError(null);
      setStep(0);
      if (elapsedRef.current < 2) {
        setRetryable(false);
        setError("That take was under two seconds. Record a fuller answer and try again.");
        return;
      }
      // the server does both steps in one request — advance the checklist on a rough clock
      const timers = [setTimeout(() => setStep(1), 500), setTimeout(() => setStep(2), 1700)];
      try {
        const body = new FormData();
        const ext = blob.type.includes("mp4") ? "m4a" : blob.type.includes("ogg") ? "ogg" : "webm";
        body.append("audio", blob, `take.${ext}`);
        body.append("scenarioId", scenario.id);
        body.append("seconds", String(Math.round(elapsedRef.current)));
        const res = await fetch("/api/analyze", { method: "POST", body });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? `Request failed (${res.status})`);
        if (!alive.current) return;
        timers.forEach(clearTimeout);
        setResult(json.feedback as Feedback);
        setStep(3);
        await wait(450);
        setStep(PIPELINE.length);
        await wait(250);
        if (!alive.current) return;
        setPhase("review");
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (e) {
        timers.forEach(clearTimeout);
        if (!alive.current) return;
        setRetryable(true);
        setError(e instanceof Error ? e.message : "Something went wrong.");
      }
    },
    [scenario.id],
  );

  const stop = useCallback(() => {
    cancelAnimationFrame(raf.current);
    if (recorder.current && recorder.current.state !== "inactive") {
      recorder.current.stop(); // onstop → analyze(blob)
    } else {
      teardown();
      process(); // no mic: fall back to the sample review
    }
  }, [process, teardown]);
  useEffect(() => {
    stopRef.current = stop;
  }, [stop]);

  const startRecording = useCallback(
    (s: MediaStream | null) => {
      history.current = Array(BARS).fill(0.06);
      setSimulated(!s);
      let buf: Uint8Array<ArrayBuffer> | null = null;

      if (s) {
        stream.current = s;
        const ac = new AudioContext();
        const an = ac.createAnalyser();
        an.fftSize = 512;
        ac.createMediaStreamSource(s).connect(an);
        ctx.current = ac;
        analyser.current = an;
        buf = new Uint8Array(an.fftSize);

        try {
          const rec = new MediaRecorder(s);
          chunks.current = [];
          rec.ondataavailable = (e) => e.data.size && chunks.current.push(e.data);
          rec.onstop = () => {
            const blob = new Blob(chunks.current, { type: rec.mimeType || "audio/webm" });
            setAudioUrl((old) => {
              if (old) URL.revokeObjectURL(old);
              return URL.createObjectURL(blob);
            });
            teardown();
            lastBlob.current = blob;
            recorder.current = null;
            analyze(blob);
          };
          rec.start();
          recorder.current = rec;
        } catch {
          recorder.current = null;
        }
      }

      setPhase("recording");
      const t0 = performance.now();
      let last = 0;

      const loop = (now: number) => {
        const secs = (now - t0) / 1000;
        if (now - last > 70) {
          last = now;
          let lvl: number;
          if (analyser.current && buf) {
            analyser.current.getByteTimeDomainData(buf);
            let sum = 0;
            for (let i = 0; i < buf.length; i++) {
              const v = (buf[i] - 128) / 128;
              sum += v * v;
            }
            lvl = Math.min(1, Math.sqrt(sum / buf.length) * 4.2);
          } else {
            // simulated speech envelope: syllables + phrase pauses
            const phrase = Math.sin(secs * 0.9) > -0.6 ? 1 : 0.15;
            lvl = (0.25 + Math.abs(Math.sin(secs * 9.3)) * 0.55 + Math.random() * 0.2) * phrase;
          }
          history.current = [...history.current.slice(1), Math.max(0.06, lvl)];
          setLevels(history.current);
          setElapsed(secs);
          elapsedRef.current = secs;
        }
        if (secs >= scenario.seconds) {
          stopRef.current();
          return;
        }
        raf.current = requestAnimationFrame(loop);
      };
      raf.current = requestAnimationFrame(loop);
    },
    [scenario.seconds, teardown, analyze],
  );

  const begin = useCallback(async () => {
    setPhase("countdown");
    setElapsed(0);
    setResult(null);
    setError(null);
    const mic: Promise<MediaStream | null> = navigator.mediaDevices?.getUserMedia
      ? navigator.mediaDevices.getUserMedia({ audio: true }).catch(() => null)
      : Promise.resolve(null);
    for (let n = 3; n > 0; n--) {
      if (!alive.current) return;
      setCount(n);
      await wait(750);
    }
    const s = await mic;
    if (!alive.current) {
      s?.getTracks().forEach((t) => t.stop());
      return;
    }
    startRecording(s);
  }, [startRecording]);

  const retake = () => {
    teardown();
    setPhase("ready");
    setElapsed(0);
    setStep(0);
    setError(null);
    setResult(null);
    setLevels(Array(BARS).fill(0.06));
  };

  const sample = () => {
    setSimulated(true);
    setResult(null);
    setError(null);
    setElapsed(feedback.stats.seconds);
    process();
  };

  if (phase === "review") {
    return (
      <Review
        scenario={scenario}
        event={event}
        feedback={result ?? feedback}
        audioUrl={audioUrl}
        simulated={simulated || !result}
        elapsed={elapsed}
        nextId={nextId}
        onRetake={retake}
      />
    );
  }

  const remaining = Math.max(0, scenario.seconds - elapsed);
  const progress = Math.min(1, elapsed / scenario.seconds);
  const R = 118;
  const C = 2 * Math.PI * R;
  const live = phase === "recording";

  return (
    <div className="grid gap-8 pb-10 pt-6 lg:grid-cols-[1.15fr_1fr]">
      {/* ── The cue ── */}
      <section className="cue flex flex-col p-7 pt-10 md:p-10 md:pt-12">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="label text-mute">{event.title}</span>
          <LevelMeter level={scenario.level} />
        </div>

        <h1 className="mt-6 font-display text-[1.35rem] italic text-mute">{scenario.title}</h1>
        <p className="mt-2 font-display text-[clamp(2rem,3.6vw,3.3rem)] leading-[1.04] tracking-[-0.01em]">
          “{scenario.prompt}”
        </p>

        <div className="mt-8">
          <button
            onClick={() => setHintOpen((v) => !v)}
            className="label flex items-center gap-2 text-ink-2 hover:text-ink"
            aria-expanded={hintOpen}
          >
            <span className={`inline-block transition-transform ${hintOpen ? "rotate-90" : ""}`}>▸</span>
            How to answer
          </button>
          {hintOpen && (
            <div className="relative mt-3 rotate-[-0.6deg] rounded-2xl border border-line bg-marker p-5 hard-shadow-sm">
              {scenario.framework && (
                <div className="mb-3 flex flex-wrap gap-1.5">
                  {scenario.framework.split(" · ").map((f, i) => (
                    <span
                      key={f}
                      className="flex items-center gap-1.5 border border-line bg-card px-2 py-1 text-sm font-semibold"
                    >
                      <span className="font-mono text-[0.65rem] text-mute">{i + 1}</span>
                      {f}
                    </span>
                  ))}
                </div>
              )}
              <p className="leading-relaxed">{scenario.hint}</p>
            </div>
          )}
        </div>

        <div className="flex-1" />

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-dashed border-line pt-5">
          {provider ? (
            <span className="text-sm">
              Published by <b>{provider.name}</b>
              <span className="text-mute"> · {provider.kind}</span>
            </span>
          ) : (
            <span />
          )}
          <span className="label text-mute">Time limit {fmtTime(scenario.seconds)}</span>
        </div>
      </section>

      {/* ── The booth ── */}
      <section className="relative flex flex-col overflow-hidden rounded-2xl border border-line bg-ink text-paper">
        <div className="flex items-center justify-between border-b border-paper/15 px-6 py-4">
          <span className="label text-paper/60">Booth A · Mono</span>
          <span
            className={`label flex items-center gap-2 border px-2.5 py-1 transition-colors ${
              live ? "border-signal bg-signal text-card" : "border-paper/30 text-paper/40"
            }`}
          >
            <span className={`h-2 w-2 rounded-full ${live ? "animate-onair bg-card" : "bg-paper/30"}`} />
            On air
          </span>
        </div>

        {phase === "processing" && error ? (
          <div className="flex flex-1 flex-col justify-center px-8 py-12">
            <div className="label text-signal">Take not analysed</div>
            <p className="mt-3 font-display text-4xl italic">That didn’t go through.</p>
            <p className="mt-4 max-w-md text-paper/75">{error}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              {retryable && (
                <button onClick={() => lastBlob.current && analyze(lastBlob.current)} className="btn btn-signal">
                  Try again
                </button>
              )}
              <button onClick={retake} className="btn border-paper text-paper">
                Record a new take
              </button>
              <button onClick={sample} className="label px-2 text-marker hover:underline">
                Show sample feedback
              </button>
            </div>
          </div>
        ) : phase === "processing" ? (
          <div className="flex flex-1 flex-col justify-center px-8 py-12">
            <div className="label text-paper/50">Processing take · {fmtTime(elapsed)}</div>
            <p className="mt-3 font-display text-4xl italic">Reading it back…</p>
            <ol className="mt-10 space-y-5">
              {PIPELINE.map((p, i) => {
                const done = i < step;
                const cur = i === step;
                return (
                  <li key={p.label} className={`flex items-start gap-4 transition-opacity ${i > step ? "opacity-30" : ""}`}>
                    <span
                      className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border text-xs ${
                        done ? "border-marker bg-marker text-ink" : cur ? "border-signal" : "border-paper/40"
                      }`}
                    >
                      {done ? "✓" : cur ? <span className="h-2 w-2 animate-onair rounded-full bg-signal" /> : ""}
                    </span>
                    <span>
                      <span className="block font-medium">{p.label}</span>
                      <span className="font-mono text-xs text-paper/45">{p.detail}</span>
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center px-6 py-10">
            {/* clock ring + button */}
            <div className="relative grid h-[272px] w-[272px] place-items-center">
              <svg viewBox="0 0 272 272" className="pointer-events-none absolute inset-0 -rotate-90" aria-hidden>
                <circle cx="136" cy="136" r={R} fill="none" stroke="currentColor" strokeOpacity=".14" strokeWidth="2" />
                {Array.from({ length: 60 }).map((_, i) => {
                  const a = (i / 60) * Math.PI * 2;
                  const r1 = R + 8;
                  const r2 = R + (i % 5 === 0 ? 16 : 12);
                  const f = (v: number) => Math.round(v * 100) / 100;
                  return (
                    <line
                      key={i}
                      x1={f(136 + Math.cos(a) * r1)}
                      y1={f(136 + Math.sin(a) * r1)}
                      x2={f(136 + Math.cos(a) * r2)}
                      y2={f(136 + Math.sin(a) * r2)}
                      stroke="currentColor"
                      strokeOpacity={i / 60 < progress ? 0.9 : 0.22}
                      strokeWidth={i % 5 === 0 ? 2 : 1}
                    />
                  );
                })}
                <circle
                  cx="136"
                  cy="136"
                  r={R}
                  fill="none"
                  stroke="var(--color-signal)"
                  strokeWidth="4"
                  strokeDasharray={C}
                  strokeDashoffset={C * (1 - progress)}
                  strokeLinecap="round"
                />
              </svg>

              {phase === "countdown" ? (
                <span key={count} className="animate-rise font-display text-[8rem] leading-none text-marker">
                  {count}
                </span>
              ) : live ? (
                <button
                  onClick={stop}
                  className="group grid h-44 w-44 place-items-center rounded-full bg-signal animate-onair transition-transform hover:scale-[1.03]"
                  aria-label="Stop recording"
                >
                  <span className="flex flex-col items-center gap-2">
                    <span className="h-9 w-9 rounded-[4px] bg-card" />
                    <span className="label text-card">Stop</span>
                  </span>
                </button>
              ) : (
                <button
                  onClick={begin}
                  className="group grid h-44 w-44 place-items-center rounded-full border-2 border-paper/80 transition-colors hover:border-signal hover:bg-signal"
                  aria-label="Start recording"
                >
                  <span className="flex flex-col items-center gap-2">
                    <MicIcon className="h-8 w-8" />
                    <span className="label">Record</span>
                  </span>
                </button>
              )}
            </div>

            <div className="mt-6 text-center">
              <div className="font-mono text-4xl tabular-nums tracking-tight">
                {live ? fmtTime(remaining) : fmtTime(scenario.seconds)}
              </div>
              <div className="label mt-1 text-paper/50">
                {live ? (simulated ? "Mic unavailable — simulating take" : "Recording · speak naturally") : phase === "countdown" ? "Breathe in…" : "Press record when ready"}
              </div>
            </div>

            {/* live levels */}
            <div className="mt-8 flex h-20 w-full items-center gap-[3px]" aria-hidden>
              {levels.map((l, i) => (
                <span
                  key={i}
                  className={`block flex-1 rounded-full transition-[height] duration-75 ${live ? "bg-signal" : "bg-paper/25"}`}
                  style={{ height: `${Math.max(6, l * 100)}%`, opacity: live ? 0.35 + (i / BARS) * 0.65 : 1 }}
                />
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between border-t border-paper/15 px-6 py-4 text-sm">
          {phase === "ready" ? (
            <>
              <span className="text-paper/55">One take. No pausing — just like the real room.</span>
              <button onClick={sample} className="label inline-flex items-center gap-2 text-marker hover:underline">
                No mic? Use a sample take <Arrow className="h-3 w-3" />
              </button>
            </>
          ) : (
            <>
              <span className="text-paper/55">Your audio stays private to you.</span>
              <span className="label text-paper/40">{fmtTime(elapsed)} recorded</span>
            </>
          )}
        </div>
      </section>

      {phase === "ready" && (
        <Link
          href="/#practices"
          className="label inline-flex items-center gap-2 text-mute hover:text-ink lg:col-span-2"
        >
          ← All practices
        </Link>
      )}
    </div>
  );
}
