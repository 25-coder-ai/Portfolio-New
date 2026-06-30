# Premium Interactive Portfolio
### CS Student · Big Data Analytics · Production-Quality Web Experience

---

## Overview

A premium, fully interactive personal portfolio built to feel like a product launch page — not a typical student portfolio. Every section has a flagship interactive feature built with production-quality code.

**Inspired by:** Linear, Vercel, Stripe, Framer, Apple Product Pages

---

## Features

| Section | Flagship Feature | Technology |
|---------|-----------------|-----------|
| **Hero** | Cursor trail spawning mini-cards | Framer Motion + rAF |
| **About** | Robotic arm assembling skill components | Framer Motion SVG |
| **Skills** | Floating 3D mechanical keyboard | React Three Fiber + Three.js |
| **Projects** | Engineering blueprint book with page flip | Framer Motion CSS 3D |
| **Experience** | Conveyor belt timeline with box unfold | Framer Motion |
| **Achievements** | Premium display case gallery | Framer Motion |
| **Contact** | Designer's desk (laptop, resume, business card) | Framer Motion |

---

## Architecture

```
Next.js 16 (App Router) — Server-side rendering, routing, image optimization
React 19             — Component model, concurrent features
TypeScript           — Type safety across all files
Tailwind CSS v4      — Design system, responsive layout, utilities
Framer Motion        — All entrance animations, micro-interactions, cursor trail
GSAP                 — Available for complex timeline sequences
Three.js + R3F       — 3D mechanical keyboard scene
Lucide React         — Icon system
```

---

## Folder Structure

```
Portfolio-New/
├── public/
│   ├── images/
│   │   ├── projects/        ← DROP PROJECT IMAGES HERE
│   │   ├── achievements/    ← DROP ACHIEVEMENT IMAGES HERE
│   │   └── profile/         ← DROP YOUR PROFILE PHOTO HERE (avatar.jpg)
│   ├── resume/              ← DROP YOUR RESUME HERE (resume.pdf)
│   └── fonts/               ← DROP PARISIAN FONT HERE (optional)
├── src/
│   ├── app/
│   │   ├── layout.tsx       ← Fonts, metadata, HTML shell
│   │   ├── page.tsx         ← Section composition
│   │   └── globals.css      ← Design system, CSS variables, animations
│   ├── components/
│   │   ├── layout/          ← Navigation, Footer
│   │   ├── hero/            ← HeroSection, CursorTrail, TrailCard
│   │   ├── about/           ← AboutSection, RoboticArm
│   │   ├── skills/          ← SkillsSection, KeyboardScene, SkillCard3D
│   │   ├── projects/        ← ProjectsSection, BlueprintBook
│   │   ├── experience/      ← ExperienceSection, ConveyorBelt, ExperienceBox
│   │   ├── achievements/    ← AchievementsSection, DisplayCase
│   │   ├── contact/         ← ContactSection, DesignerDesk, Laptop, BusinessCard, CoffeeMug
│   │   └── ui/              ← SectionHeading, Badge, Icons
│   ├── data/
│   │   ├── profile.ts       ← YOUR PERSONAL INFO (edit this)
│   │   ├── projects.ts      ← YOUR PROJECTS (edit this)
│   │   ├── skills.ts        ← YOUR SKILLS (edit this)
│   │   ├── experience.ts    ← YOUR EXPERIENCE (edit this)
│   │   └── achievements.ts  ← YOUR ACHIEVEMENTS (edit this)
│   ├── hooks/
│   │   ├── useCursorTrail.ts
│   │   ├── useScrollAnimation.ts
│   │   └── useReducedMotion.ts
│   ├── lib/
│   │   ├── constants.ts     ← Colors, animation timings, cursor config
│   │   └── utils.ts         ← Helper functions
│   └── types/
│       └── index.ts         ← TypeScript interfaces
└── docs/                    ← Full documentation (PRD, specs, architecture)
```

---

## Installation

```bash
# Clone the repo
git clone <your-repo-url>
cd Portfolio-New

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Environment Variables

No environment variables are required for the base portfolio.

If you add a contact form backend (e.g., Resend, SendGrid):

```bash
# .env.local
RESEND_API_KEY=your_key_here
CONTACT_EMAIL=your@email.com
```

---

## Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Upload .next folder via Netlify CLI or drag-and-drop
```

### Self-Hosted
```bash
npm run build
npm run start
```

---

# Content To Replace

All placeholder content lives in `src/data/`. Edit these files to make the portfolio yours.

## 1. `src/data/profile.ts`

| Field | Description | Example |
|-------|-------------|---------|
| `name` | Your full name | `"Arjun Krishnan"` |
| `tagline` | One-line personal brand | `"Turning data into decisions."` |
| `subtitle` | Role description (shown in hero) | `"Computer Science Student · Big Data Analytics"` |
| `email` | Your email address | `"arjun@email.com"` |
| `phone` | Your phone number | `"+91 98765 43210"` |
| `github` | GitHub profile URL | `"https://github.com/arjunkrishnan"` |
| `linkedin` | LinkedIn profile URL | `"https://linkedin.com/in/arjunkrishnan"` |
| `cgpa` | Your CGPA | `"9.1"` |
| `location` | Your city/country | `"Chennai, India"` |
| `bio` | 1-2 sentence bio | Your story |
| `resumeUrl` | Path to resume PDF | `"/resume/resume.pdf"` |
| `profileImage` | Path to profile photo | `"/images/profile/avatar.jpg"` |

## 2. `src/data/projects.ts`

For each project, replace:
- `title` — Project name
- `problem` — What problem did it solve?
- `solution` — How did you solve it?
- `techStack` — Array of technologies used
- `features` — Array of key features/achievements
- `images` — Array of image paths (add images to `public/images/projects/`)
- `demoUrl` — Live demo link (or `undefined`)
- `githubUrl` — GitHub repository link
- `category` — e.g., "Big Data", "Machine Learning", "Cloud"
- `year` — e.g., "2024"
- `color` — Hex accent color for this project

## 3. `src/data/skills.ts`

For each skill:
- `name` — Technology name
- `level` — `"beginner" | "intermediate" | "advanced" | "expert"`
- `levelPercent` — 0–100
- `category` — `"language" | "framework" | "tool" | "concept" | "cloud"`
- `description` — Short description of your experience
- `brandColor` — Official brand color (e.g., Python's `#3776AB`)

## 4. `src/data/experience.ts`

For each experience item:
- `title` — Role or achievement title
- `organization` — Company/institution name
- `type` — `"internship" | "hackathon" | "leadership" | "research" | "volunteering" | "academic" | "club"`
- `startDate` / `endDate` — `"YYYY-MM"` format (use `"Present"` for current roles)
- `description` — 1-2 sentence summary
- `responsibilities` — Array of bullet points
- `technologies` — Array of tools/skills used
- `icon` — Emoji for the conveyor box

## 5. `src/data/achievements.ts`

For each achievement:
- `title` — Certificate/award name
- `issuer` — Who issued it
- `type` — `"certificate" | "award" | "competition" | "hackathon" | "academic"`
- `date` — `"YYYY-MM"` format
- `description` — What it recognizes
- `image` — Optional path to certificate image
- `credentialUrl` — Optional verification URL
- `rank` — Optional ranking (e.g., "1st Place", "Top 5%")

---

## Files to Add to `public/`

| Path | Description |
|------|-------------|
| `public/resume/resume.pdf` | Your resume PDF — enables download button |
| `public/images/profile/avatar.jpg` | Your profile photo |
| `public/images/projects/project1-1.jpg` | Project screenshots (name must match `data/projects.ts`) |
| `public/images/achievements/hackathon-1.jpg` | Achievement certificates/photos |
| `public/fonts/Parisian.woff2` | Parisian font file (optional — currently uses Playfair Display as alternative) |

---

## Parisian Font Setup (Optional)

The hero uses **Playfair Display** (from Google Fonts) as a premium serif alternative to the Parisian typeface.

To use the actual **Parisian BT** font:

1. Obtain the font file (`.woff2` format recommended)
2. Place it at `public/fonts/Parisian.woff2`
3. In `src/app/globals.css`, add:

```css
@font-face {
  font-family: "Parisian";
  src: url("/fonts/Parisian.woff2") format("woff2");
  font-weight: normal;
  font-display: swap;
}
```

4. In `src/app/layout.tsx`, remove the `Playfair_Display` import and update the font variable.
5. Replace `.font-display` class usage with the new font.

---

## Customization Guide

### Change the Accent Color

In `src/lib/constants.ts`:
```ts
accentBlue: "#4F8EF7",  // Change this to your preferred accent
```

Also update in `src/app/globals.css`:
```css
--color-accent-blue: #4F8EF7;  // Update to match
```

### Adjust Cursor Trail Behavior

In `src/lib/constants.ts`:
```ts
export const CURSOR_TRAIL = {
  maxCards: 6,          // Max cards on screen at once
  speedThreshold: 8,    // Higher = only spawns on fast movement
  spawnCooldown: 400,   // Lower = more frequent cards
  cardLifetime: 2800,   // How long cards stay (ms)
};
```

### Disable a Section

In `src/app/page.tsx`, simply comment out or remove the section import and usage.

### Add More Projects

Add to the `projects` array in `src/data/projects.ts` — the blueprint book paginates automatically.

### Add More Skills to the Keyboard

Add to `skills` array in `src/data/skills.ts` — keyboard layout auto-arranges.

---

## Performance Notes

- Three.js keyboard is **lazy-loaded** (`dynamic` import with `ssr: false`)
- All section animations use `react-intersection-observer` — only run when in viewport
- Cursor trail uses `requestAnimationFrame` for 60fps tracking
- Framer Motion's `AnimatePresence` handles cleanup automatically
- `prefers-reduced-motion` disables all animations for accessibility

---

## Browser Support

| Browser | Support |
|---------|---------|
| Chrome 90+ | Full |
| Firefox 88+ | Full |
| Safari 15+ | Full (WebGL required for 3D keyboard) |
| Edge 90+ | Full |
| Mobile Chrome | Full (3D keyboard shows 2D fallback) |
| Mobile Safari | Full (3D keyboard shows 2D fallback) |
