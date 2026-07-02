import type { Metadata } from "next";
import { LayeredGlassContact } from "@/components/contact-lab/LayeredGlassContact";

export const metadata: Metadata = {
  title: "Contact Lab · 02 — Layered Glass",
};

export default function ContactLabConcept2() {
  return <LayeredGlassContact />;
}
