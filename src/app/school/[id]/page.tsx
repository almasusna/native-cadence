import Link from "next/link";
import { Suspense } from "react";
import { providers } from "@/lib/data";
import { SchoolPractices } from "@/components/SchoolPractices";

export function generateStaticParams() {
  return providers.map((p) => ({ id: p.id }));
}

export default function SchoolPage({ params }: PageProps<"/school/[id]">) {
  return (
    <div className="mx-auto max-w-[1200px] px-5 md:px-8">
      <div className="label flex flex-wrap items-center gap-2 pt-8 text-mute">
        <Link href="/#practices" className="hover:text-ink">
          Practices
        </Link>
        <span>/</span>
        <span className="text-ink">School</span>
      </div>
      {/* Schools added in the browser aren't known at build time, so the id is read at request time. */}
      <Suspense fallback={<div className="h-64" />}>
        {params.then(({ id }) => (
          <SchoolPractices id={id} />
        ))}
      </Suspense>
    </div>
  );
}
