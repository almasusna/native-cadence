import type { Metadata } from "next";
import { Caveat, Instrument_Serif, JetBrains_Mono, Schibsted_Grotesk } from "next/font/google";
import { SiteFooter, SiteHeader } from "@/components/SiteHeader";
import "./globals.css";

const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const schibsted = Schibsted_Grotesk({
  variable: "--font-schibsted",
  subsets: ["latin"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Native Cadence — rehearse the room before you walk in",
  description:
    "Practise interviews, IELTS speaking, cabin-crew finals and difficult customer calls. Record, get red-pen feedback, keep the phrases that work.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${instrument.variable} ${schibsted.variable} ${jetbrains.variable} ${caveat.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
