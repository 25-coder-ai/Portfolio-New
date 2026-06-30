import type { Experience, ExperienceType } from "@/types";

// ============================================================
// Cinematic Experience — display helpers (data-driven)
// ============================================================

export const TYPE_LABEL: Record<ExperienceType, string> = {
  internship: "Internship",
  hackathon: "Hackathon",
  leadership: "Leadership",
  research: "Research",
  volunteering: "Volunteering",
  academic: "Education",
  club: "Community",
};

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function formatMonth(value: string): string {
  const [y, m] = value.split("-");
  if (!m) return value;
  const idx = Number(m) - 1;
  return MONTHS[idx] ? `${MONTHS[idx]} ${y}` : value;
}

/** "May 2024 — Aug 2024", or "Jul 2022 — Present" for ongoing milestones. */
export function formatRange(exp: Experience): string {
  const start = formatMonth(exp.startDate);
  const end =
    exp.endDate.toLowerCase() === "present" ? "Present" : formatMonth(exp.endDate);
  return start === end ? start : `${start} — ${end}`;
}

/** The oversized anchor numeral — the year the milestone began. */
export function bigYear(exp: Experience): string {
  return exp.startDate.slice(0, 4);
}

/** Short year used by the side navigation. */
export function navYear(exp: Experience): string {
  return exp.startDate.slice(0, 4);
}
