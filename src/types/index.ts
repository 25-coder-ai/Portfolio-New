// ============================================================
// GLOBAL TYPE DEFINITIONS
// ============================================================

export interface Profile {
  name: string;
  tagline: string;
  subtitle: string;
  email: string;
  phone: string;
  github: string;
  linkedin: string;
  cgpa: string;
  location: string;
  bio: string;
  resumeUrl: string;
  profileImage: string;
}

export interface Project {
  id: string;
  title: string;
  problem: string;
  solution: string;
  techStack: string[];
  features: string[];
  images: string[];
  /** Optional looping demo video embedded in the project card (autoplay, muted). */
  video?: string;
  /** Optional poster shown before the video loads / as fallback. */
  poster?: string;
  demoUrl?: string;
  githubUrl?: string;
  category: string;
  year: string;
  color: string;
}

export type SkillLevel = "beginner" | "intermediate" | "advanced" | "expert";

export interface Skill {
  id: string;
  name: string;
  level: SkillLevel;
  levelPercent: number;
  category: "language" | "framework" | "tool" | "concept" | "cloud";
  description: string;
  color: string;
  brandColor: string;
  keyRow: number;
  keyCol: number;
  icon?: string;
}

export type ExperienceType =
  | "internship"
  | "hackathon"
  | "leadership"
  | "research"
  | "volunteering"
  | "academic"
  | "club";

export interface Experience {
  id: string;
  title: string;
  organization: string;
  type: ExperienceType;
  startDate: string;
  endDate: string;
  description: string;
  responsibilities: string[];
  technologies: string[];
  /** Headline outcomes shown last in the unfolded sheet. */
  achievements?: string[];
  location?: string;
  color: string;
  icon: string;
  /** Optional supporting imagery for the cinematic chapter (paths under /public). */
  images?: string[];
  /** Optional headline metrics, e.g. { value: "96%", label: "Accuracy" }. */
  metrics?: { value: string; label: string }[];
  /** Optional call-to-action shown at the end of the chapter. */
  cta?: { label: string; url: string };
}

export type AchievementType =
  | "certificate"
  | "award"
  | "competition"
  | "hackathon"
  | "academic";

export interface Achievement {
  id: string;
  title: string;
  issuer: string;
  type: AchievementType;
  date: string;
  description: string;
  image?: string;
  credentialUrl?: string;
  rank?: string;
  /** Skills gained, shown as chips in the modal. */
  skills?: string[];
  /** Extra context shown last in the modal. */
  notes?: string;
  color: string;
}

// ---- Cursor Trail ----
export type TrailCardType =
  | "project"
  | "achievement"
  | "skill"
  | "blueprint"
  | "note";

export interface TrailCard {
  id: string;
  type: TrailCardType;
  x: number;
  y: number;
  rotation: number;
  title: string;
  subtitle?: string;
  color: string;
  createdAt: number;
}

// ---- Navigation ----
export interface NavItem {
  label: string;
  href: string;
}

// ---- Contact Form ----
export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}
