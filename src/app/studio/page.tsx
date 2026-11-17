import type { Metadata } from "next";
import { studioMonths } from "@/lib/data";
import { ScenarioBuilder } from "@/components/ScenarioBuilder";
import { EarningsChart } from "@/components/EarningsChart";

export const metadata: Metadata = { title: "Creator Studio — Native Cadence" };

const myCues = [
  { title: "Explain a gap in your CV", event: "Company Interview", takes: 1840, rating: 4.8, status: "Live" },
  { title: "Salary expectations, without flinching", event: "Company Interview", takes: 1312, rating: 4.7, status: "Live" },
  { title: "The interviewer who won't smile", event: "Company Interview", takes: 905, rating: 4.9, status: "Live" },
  { title: "Counter-offer from your current boss", event: "Company Interview", takes: 0, rating: 0, status: "In review" },
];

export default function StudioPage() {
  const now = studioMonths[studioMonths.length - 1];
  const prev = studioMonths[studioMonths.length - 2];
  const growth = Math.round(((now.subs - prev.subs) / prev.subs) * 100);
  const lifetime = studioMonths.reduce((a, m) => a + m.payout, 0);

  return (
    <div className="mx-auto max-w-[1320px] px-5 md:px-8">
      <header className="flex flex-wrap items-end justify-between gap-6 border-b-[1.5px] border-ink pb-10 pt-12">
        <div>
          <div className="label text-mute">Creator studio · Pack “Interviews That Bite”</div>
          <h1 className="mt-4 font-display text-[clamp(3rem,7vw,6.2rem)] leading-[0.9] tracking-[-0.02em]">
            Your <span className="italic">studio</span>
          </h1>
        </div>
        <a href="#new" className="btn btn-signal">
          + Write a scenario
        </a>
      </header>

      {/* hero numbers */}
      <section className="mt-10 grid border-[1.5px] border-ink md:grid-cols-[1.3fr_1fr_1fr]">
        <div className="bg-ink p-8 text-paper">
          <div className="label text-paper/60">November payout · est.</div>
          <div className="mt-3 font-display text-[5rem] leading-none text-marker">
            ${now.payout.toFixed(0)}
          </div>
          <div className="mt-3 text-sm text-paper/70">
            {now.subs} subscribers × $5 × 70% · paid Dec 1
          </div>
        </div>
        <div className="border-t border-ink p-8 md:border-l md:border-t-0">
          <div className="label text-mute">Subscribers</div>
          <div className="mt-3 font-display text-6xl leading-none">{now.subs}</div>
          <div className="mt-3 text-sm">
            <span className="font-semibold text-moss">▲ {growth}%</span>{" "}
            <span className="text-mute">vs October</span>
          </div>
        </div>
        <div className="border-t border-ink p-8 md:border-l md:border-t-0">
          <div className="label text-mute">Lifetime earned</div>
          <div className="mt-3 font-display text-6xl leading-none">${Math.round(lifetime).toLocaleString("en-US")}</div>
          <div className="mt-3 text-sm text-mute">since June 2026</div>
        </div>
      </section>

      <section className="mt-10 grid gap-10 lg:grid-cols-[1.2fr_1fr]">
        <EarningsChart months={studioMonths} />

        <div>
          <div className="label text-mute">Your cues</div>
          <ul className="mt-4 border-[1.5px] border-ink bg-card">
            {myCues.map((c, i) => (
              <li
                key={c.title}
                className="grid grid-cols-[auto_1fr_auto] items-center gap-4 border-b border-dashed border-ink/30 px-5 py-4 last:border-0"
              >
                <span className="font-mono text-xs text-mute">{String(i + 1).padStart(2, "0")}</span>
                <span>
                  <span className="block font-medium leading-tight">{c.title}</span>
                  <span className="text-sm text-mute">
                    {c.takes ? `${c.takes.toLocaleString("en-US")} takes · ★ ${c.rating}` : "Awaiting editorial review"}
                  </span>
                </span>
                <span
                  className={`label px-2 py-1 ${c.status === "Live" ? "bg-moss text-card" : "border border-ink"}`}
                >
                  {c.status}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <ScenarioBuilder />
    </div>
  );
}
