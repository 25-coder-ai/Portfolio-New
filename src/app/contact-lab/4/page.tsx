import type { Metadata } from "next";
import { FloatingCardsContact } from "@/components/contact-lab/FloatingCardsContact";

export const metadata: Metadata = {
  title: "Contact Lab · 04 — Floating Cards",
};

export default function ContactLabConcept4() {
  return <FloatingCardsContact />;
}
