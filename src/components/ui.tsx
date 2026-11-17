import type { ReactNode } from "react";

/** Deterministic decorative waveform (no randomness → no hydration mismatch). */
export function Waveform({
  bars = 48,
  className = "",
  barClass = "bg-ink",
  seed = 7,
  animate = false,
}: {
  bars?: number;
  className?: string;
  barClass?: string;
  seed?: number;
  animate?: boolean;
}) {
  const heights = Array.from({ length: bars }, (_, i) => {
    const v =
      Math.abs(Math.sin((i + seed) * 0.61) * 0.55 + Math.sin((i + seed) * 0.23) * 0.35) + 0.12;
    return Math.min(1, v);
  });
  return (
    <div className={`flex items-center gap-[3px] ${className}`} aria-hidden>
      {heights.map((h, i) => (
        <span
          key={i}
          className={`block w-[3px] flex-1 rounded-full ${barClass} ${animate ? "idle-bar" : ""}`}
          style={{
            height: `${Math.round(h * 100)}%`,
            animationDelay: animate ? `${(i % 12) * 0.09}s` : undefined,
          }}
        />
      ))}
    </div>
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <span className="relative grid h-8 w-8 place-items-center rounded-full bg-ink">
        <span className="flex h-3.5 items-center gap-[2px]">
          {[0.45, 1, 0.7, 0.3].map((h, i) => (
            <span
              key={i}
              className="w-[2.5px] rounded-full bg-paper"
              style={{ height: `${h * 100}%` }}
            />
          ))}
        </span>
        <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-paper bg-signal" />
      </span>
      <span className="font-display text-[1.65rem] leading-none tracking-tight">
        Native Cadence
      </span>
    </span>
  );
}

export function Tag({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`label inline-flex items-center gap-1.5 border border-ink/70 px-2 py-1 ${className}`}
    >
      {children}
    </span>
  );
}

export function Avatar({
  initials,
  className = "",
}: {
  initials: string;
  className?: string;
}) {
  return (
    <span
      className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border-[1.5px] border-ink bg-marker font-mono text-[0.7rem] font-bold ${className}`}
    >
      {initials}
    </span>
  );
}

export function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={`h-4 w-4 ${className}`} aria-hidden>
      <path d="M4 12h15m0 0-6-6m6 6-6 6" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export function LockIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={`h-3.5 w-3.5 ${className}`} aria-hidden>
      <rect x="5" y="11" width="14" height="9" stroke="currentColor" strokeWidth="2" />
      <path d="M8 11V8a4 4 0 1 1 8 0v3" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export function MicIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={`h-5 w-5 ${className}`} aria-hidden>
      <rect x="9" y="3" width="6" height="11" rx="3" stroke="currentColor" strokeWidth="2" />
      <path d="M5 11a7 7 0 0 0 14 0M12 18v3" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export function SectionHead({
  index,
  title,
  aside,
}: {
  index: string;
  title: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <div className="mb-8">
      <div className="rule-double" />
      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div className="flex items-baseline gap-4">
          <span className="label text-mute">{index}</span>
          <h2 className="font-display text-4xl leading-none md:text-5xl">{title}</h2>
        </div>
        {aside}
      </div>
    </div>
  );
}

export const levelDots: Record<string, number> = { "Warm-up": 1, Standard: 2, Pressure: 3 };

export function LevelMeter({ level }: { level: string }) {
  const n = levelDots[level] ?? 1;
  return (
    <span className="label inline-flex items-center gap-1.5 text-ink-2">
      <span className="flex gap-[3px]">
        {[1, 2, 3].map((i) => (
          <span
            key={i}
            className={`h-2 w-2 rounded-full border border-ink ${i <= n ? (n === 3 ? "bg-signal" : "bg-ink") : ""}`}
          />
        ))}
      </span>
      {level}
    </span>
  );
}

export const fmtTime = (s: number) =>
  `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
