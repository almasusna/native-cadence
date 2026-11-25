import Link from "next/link";
import { notFound } from "next/navigation";
import { feedbackFor, getEvent, getProvider, scenarios } from "@/lib/data";
import { PracticeSession } from "@/components/PracticeSession";

export function generateStaticParams() {
  return scenarios.map((s) => ({ id: s.id }));
}

export default async function PracticePage(props: PageProps<"/practice/[id]">) {
  const { id } = await props.params;
  const scenario = scenarios.find((s) => s.id === id);
  if (!scenario) notFound();

  const event = getEvent(scenario.event)!;
  const provider = getProvider(scenario);
  // "Next" stays inside the same school category.
  const siblings = scenarios.filter((s) => s.provider === scenario.provider && s.category === scenario.category);
  const pos = siblings.findIndex((s) => s.id === scenario.id);
  const next = siblings[(pos + 1) % siblings.length];

  return (
    <div className="mx-auto max-w-[1320px] px-5 md:px-8">
      <div className="label flex flex-wrap items-center gap-2 pt-8 text-mute">
        <Link href="/#practices" className="hover:text-ink">
          Practices
        </Link>
        <span>/</span>
        <Link href={`/school/${provider.id}`} className="hover:text-ink">
          {provider.name}
        </Link>
        <span>/</span>
        <span>{scenario.category}</span>
        <span>/</span>
        <span className="text-ink">
          Cue {String(pos + 1).padStart(2, "0")} of {String(siblings.length).padStart(2, "0")}
        </span>
      </div>

      <PracticeSession
        scenario={scenario}
        event={event}
        feedback={feedbackFor()}
        provider={provider}
        nextId={next.id === scenario.id ? undefined : next.id}
      />
    </div>
  );
}
