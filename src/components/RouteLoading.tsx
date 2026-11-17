import { Waveform } from "./ui";

export function RouteLoading({ label }: { label: string }) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-[1320px] flex-col items-center justify-center gap-5 px-5">
      <Waveform bars={24} className="h-12 w-48" barClass="bg-signal" animate />
      <span className="label text-mute">{label}</span>
    </div>
  );
}
