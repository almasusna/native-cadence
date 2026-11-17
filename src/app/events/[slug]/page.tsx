import Link from "next/link";
import { notFound } from "next/navigation";
import { events, getEvent, scenariosFor, toneClass } from "@/lib/data";
import { ScenarioBoard } from "@/components/ScenarioBoard";

export function generateStaticParams() {
  return events.map((e) => ({ slug: e.slug }));
}

export default async function EventPage(props: PageProps<"/events/[slug]">) {
  const { slug } = await props.params;
  const event = getEvent(slug);
  if (!event) notFound();

  const list = scenariosFor(event.slug);
  const idx = events.findIndex((e) => e.slug === event.slug);
  const t = toneClass[event.tone];

  return (
    <div className="mx-auto max-w-[1320px] px-5 md:px-8">
      <div className="label flex items-center gap-2 pt-8 text-mute">
        <Link href="/" className="hover:text-ink">
          Programme
        </Link>
        <span>/</span>
        <span className="text-ink">Stage {String(idx + 1).padStart(2, "0")}</span>
      </div>

      {/* header */}
      <header className="grid gap-10 border-b-[1.5px] border-ink pb-12 pt-8 md:grid-cols-[1.5fr_1fr]">
        <div className="animate-rise">
          <span className={`label inline-block border border-ink px-2 py-1 ${t.bg} ${t.fg}`}>
            {event.kicker}
          </span>
          <h1 className="mt-6 font-display text-[clamp(3rem,7vw,6.5rem)] leading-[0.9] tracking-[-0.02em]">
            {event.title}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-2">{event.blurb}</p>
        </div>

        <dl className="grid grid-cols-2 self-end border-[1.5px] border-ink bg-card">
          <div className="col-span-2 border-b border-ink p-5">
            <dt className="label text-mute">In the room</dt>
            <dd className="mt-1 font-display text-2xl italic leading-tight">{event.room}</dd>
          </div>
          <div className="border-r border-ink p-5">
            <dt className="label text-mute">Real duration</dt>
            <dd className="mt-1 font-display text-3xl">{event.duration}</dd>
          </div>
          <div className="p-5">
            <dt className="label text-mute">Cues</dt>
            <dd className="mt-1 font-display text-3xl">{list.length}</dd>
          </div>
          <div className="col-span-2 border-t border-ink p-5">
            <dt className="label mb-2 text-mute">You’re scored on</dt>
            <dd className="flex flex-wrap gap-1.5">
              {event.scoring.map((s) => (
                <span key={s} className="border border-ink/60 px-2 py-0.5 text-sm">
                  {s}
                </span>
              ))}
            </dd>
          </div>
        </dl>
      </header>

      <ScenarioBoard scenarios={list} />
    </div>
  );
}
