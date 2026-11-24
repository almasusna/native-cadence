import type { Metadata } from "next";
import { AddPracticeForm } from "@/components/AddPracticeForm";

export const metadata: Metadata = { title: "For schools — Native Cadence" };

const points = [
  { title: "Your practices, your name", body: "Every practice shows your school, so learners can find and search for you." },
  { title: "Instant feedback for your students", body: "Learners record answers and get transcripts, scores and better phrases." },
  { title: "Free to publish", body: "Add IELTS questions, interview tasks or any speaking practice you teach." },
];

export default function SchoolsPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-5 md:px-8">
      <section className="grid gap-12 pb-10 pt-14 md:grid-cols-[1fr_1.15fr] md:pt-20">
        <div className="animate-rise">
          <span className="label inline-block rounded-full bg-card px-3 py-1.5 text-signal shadow-sm">
            For English schools & companies
          </span>
          <h1 className="mt-6 font-display text-[clamp(2.4rem,5vw,4rem)] leading-[1]">
            Put your speaking practices in front of <span className="italic">learners</span>.
          </h1>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-ink-2">
            Add a question once. Learners anywhere can practise it out loud and get feedback, and they see your
            school&rsquo;s name on it.
          </p>
          <ul className="mt-8 space-y-4">
            {points.map((p) => (
              <li key={p.title} className="flex gap-3">
                <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-marker text-xs">✓</span>
                <span>
                  <span className="block font-semibold">{p.title}</span>
                  <span className="text-sm leading-relaxed text-ink-2">{p.body}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <AddPracticeForm />
      </section>
    </div>
  );
}
