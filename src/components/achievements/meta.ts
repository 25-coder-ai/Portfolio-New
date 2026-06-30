import { Award, GraduationCap, ScrollText, Sparkles, Trophy, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const TYPE_META: Record<string, { icon: LucideIcon }> = {
  hackathon: { icon: Trophy },
  certificate: { icon: ScrollText },
  competition: { icon: Zap },
  award: { icon: Award },
  academic: { icon: GraduationCap },
  default: { icon: Sparkles },
};

export function formatMonth(date: string): string {
  return new Date(`${date}-01`).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}
