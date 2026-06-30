// ============================================================
// GLOBAL CONSTANTS — DO NOT CONVERT COLORS TO RGB
// ============================================================

export const HERO_BACKGROUND = "#111B2F";
export const CONTACT_BACKGROUND = "#111B2F";

export const COLORS = {
  background: "#111B2F",
  surface: "#1A2540",
  surfaceElevated: "#1F2D4A",
  border: "rgba(255,255,255,0.07)",
  borderAccent: "rgba(79,142,247,0.25)",
  textPrimary: "#E8EEFF",
  textSecondary: "#8892A4",
  textMuted: "#4A5568",
  accentBlue: "#4F8EF7",
  accentPurple: "#A78BFA",
  accentGreen: "#34D399",
  accentAmber: "#F59E0B",
  accentRed: "#F87171",
} as const;

export const ANIMATION = {
  durationFast: 0.15,
  durationBase: 0.3,
  durationSlow: 0.6,
  durationEpic: 1.0,
  easingStandard: [0.16, 1, 0.3, 1] as const,
  easingBounce: [0.34, 1.56, 0.64, 1] as const,
  easingSnap: [0.25, 0.46, 0.45, 0.94] as const,
} as const;

export const CURSOR_TRAIL = {
  maxCards: 6,
  speedThreshold: 8,       // px/ms — only spawn above this speed
  spawnCooldown: 400,       // ms between spawns
  cardLifetime: 2800,       // ms before card exits
} as const;

// Hero image-trail (Codrops-style): images spawn at uniform spacing as the
// cursor moves, then fade out after a fixed lifetime. Hero section only.
export const IMAGE_TRAIL = {
  spawnDistance: 175,       // px between images — ~1/8 of the 200px width overlaps
  imageLifetime: 700,     // ms each image lives (long → many coexist = ribbon)
  maxImages: 70,            // hard cap on simultaneous trail images
  width: 200,               // px
  height: 250,              // px
} as const;

export const NAV_ITEMS = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Achievements", href: "#achievements" },
  { label: "Contact", href: "#contact" },
] as const;

export const SECTION_IDS = {
  hero: "hero",
  about: "about",
  skills: "skills",
  projects: "projects",
  experience: "experience",
  achievements: "achievements",
  contact: "contact",
} as const;
