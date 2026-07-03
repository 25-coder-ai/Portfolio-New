import type { Metadata } from "next";
import { SpotlightGlassContact } from "@/components/contact-lab/SpotlightGlassContact";

export const metadata: Metadata = {
  title: "Contact Lab · 03 — Spotlight Glass",
};

export default function ContactLabConcept3() {
  return <SpotlightGlassContact />;
}
