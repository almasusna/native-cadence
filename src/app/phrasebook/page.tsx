import type { Metadata } from "next";
import { PhrasebookView } from "@/components/PhrasebookView";

export const metadata: Metadata = { title: "Phrasebook — Native Cadence" };

export default function PhrasebookPage() {
  return (
    <div className="mx-auto max-w-[1320px] px-5 md:px-8">
      <PhrasebookView />
    </div>
  );
}
