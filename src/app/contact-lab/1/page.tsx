import type { Metadata } from "next";
import { GlassSlabContact } from "@/components/contact-lab/GlassSlabContact";

export const metadata: Metadata = {
  title: "Contact Lab · 01 — Glass Slab",
};

export default function ContactLabConcept1() {
  return <GlassSlabContact />;
}
