import Link from "next/link";
import { PracticeList } from "@/components/PracticeList";
import { Arrow } from "@/components/ui";

const steps = [
  { n: "1", title: "Pick a practice", body: "IELTS, job interviews, cabin crew, customer calls and more." },
  { n: "2", title: "Answer out loud", body: "Read the question, press record and speak against the clock." },
  { n: "3", title: "Get feedback", body: "See your transcript, your scores and better phrases to use next time." },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-[1200px] px-5 md:px-8">
      <section className="animate-rise pb-14 pt-14 text-center md:pt-20">
        <span className="label inline-block rounded-full bg-card px-3 py-1.5 text-signal shadow-sm">
          Speaking practice for English learners
        </span>
        <h1 className="mx-auto mt-6 max-w-3xl font-display text-[clamp(2.6rem,6vw,4.8rem)] leading-[0.98]">
          Practise speaking <span className="italic">before</span> the real thing.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-ink-2">
          Choose a practice, answer out loud, and get instant feedback on your English. English schools and
          companies publish the practices; anyone can use them.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a href="#practices" className="btn btn-signal">
            Find a practice <Arrow />
          </a>
          <Link href="/schools" className="btn btn-ghost">
            For schools: add your practices
          </Link>
        </div>

        <ol className="mx-auto mt-14 grid max-w-4xl gap-4 text-left md:grid-cols-3">
          {steps.map((s) => (
            <li key={s.n} className="flex gap-4 rounded-2xl bg-card/70 p-5">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-ink font-mono text-sm text-paper">
                {s.n}
              </span>
              <span>
                <span className="block font-semibold">{s.title}</span>
                <span className="mt-1 block text-sm leading-relaxed text-ink-2">{s.body}</span>
              </span>
            </li>
          ))}
        </ol>
      </section>

      <section id="practices" className="scroll-mt-28">
        <h2 className="mb-6 font-display text-3xl md:text-4xl">
          Find a <span className="italic">practice</span>
        </h2>
        <PracticeList />
      </section>
    </div>
  );
}
