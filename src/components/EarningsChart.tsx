"use client";

import { useState } from "react";

type Month = { m: string; subs: number; payout: number };

/** Single-series bar chart: monthly payout. Hover any column for details. */
export function EarningsChart({ months }: { months: Month[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const [table, setTable] = useState(false);
  const max = Math.ceil(Math.max(...months.map((m) => m.payout)) / 200) * 200;
  const ticks = [0, max / 2, max];
  const last = months.length - 1;

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="label text-mute">Monthly payout, USD</div>
        <button onClick={() => setTable((t) => !t)} className="label text-mute underline-offset-4 hover:text-ink hover:underline">
          {table ? "Show chart" : "Show table"}
        </button>
      </div>

      {table ? (
        <table className="mt-4 w-full border-[1.5px] border-ink bg-card text-sm">
          <thead>
            <tr className="label border-b border-ink text-left text-mute">
              <th className="px-4 py-2 font-normal">Month</th>
              <th className="px-4 py-2 text-right font-normal">Subscribers</th>
              <th className="px-4 py-2 text-right font-normal">Payout</th>
            </tr>
          </thead>
          <tbody>
            {months.map((m) => (
              <tr key={m.m} className="border-b border-dashed border-ink/30 last:border-0">
                <td className="px-4 py-2">{m.m}</td>
                <td className="px-4 py-2 text-right tabular-nums">{m.subs}</td>
                <td className="px-4 py-2 text-right tabular-nums">${m.payout.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="mt-4 border-[1.5px] border-ink bg-card p-6">
          <div className="relative grid h-64 grid-cols-[2.5rem_1fr]">
            {/* y axis */}
            <div className="relative">
              {ticks.map((t) => (
                <span
                  key={t}
                  className="absolute right-2 translate-y-1/2 font-mono text-[0.65rem] text-mute"
                  style={{ bottom: `${(t / max) * 100}%` }}
                >
                  {t}
                </span>
              ))}
            </div>
            <div className="relative">
              {ticks.map((t) => (
                <span
                  key={t}
                  className={`absolute inset-x-0 h-px ${t === 0 ? "bg-ink" : "bg-ink/10"}`}
                  style={{ bottom: `${(t / max) * 100}%` }}
                />
              ))}
              <div className="absolute inset-0 flex items-end gap-[2px]">
                {months.map((m, i) => (
                  <div
                    key={m.m}
                    className="relative flex h-full flex-1 items-end justify-center"
                    onMouseEnter={() => setHover(i)}
                    onMouseLeave={() => setHover(null)}
                  >
                    <div
                      className={`w-[58%] rounded-t-[4px] transition-colors ${
                        i === last ? "bg-signal" : hover === i ? "bg-ink" : "bg-ink/75"
                      }`}
                      style={{ height: `${(m.payout / max) * 100}%` }}
                    />
                    {(hover === i || (hover === null && i === last)) && (
                      <div
                        className="pointer-events-none absolute z-10 -translate-y-2 whitespace-nowrap border border-ink bg-paper px-2.5 py-1.5 text-xs shadow-[2px_2px_0_0_var(--color-ink)]"
                        style={{ bottom: `${(m.payout / max) * 100}%` }}
                      >
                        <div className="font-semibold">${m.payout.toFixed(0)}</div>
                        <div className="text-mute">{m.subs} subs</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="ml-10 mt-2 flex gap-[2px]">
            {months.map((m) => (
              <span key={m.m} className="label flex-1 text-center text-mute">
                {m.m}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
