# Customization Guide

## Quick Start — 5 Files, Full Personalization

All content is centralized in `src/data/`. You don't need to touch component code to fully personalize the portfolio.

---

## Step 1 — Your Identity (`src/data/profile.ts`)

```ts
export const profile: Profile = {
  name: "Your Full Name",
  tagline: "Your personal brand in one sentence.",
  subtitle: "Computer Science Student · Big Data Analytics",
  email: "your@email.com",
  phone: "+91 00000 00000",
  github: "https://github.com/yourusername",
  linkedin: "https://linkedin.com/in/yourusername",
  cgpa: "8.5",
  location: "Chennai, India",
  bio: "Two sentences about who you are.",
  resumeUrl: "/resume/resume.pdf",
  profileImage: "/images/profile/avatar.jpg",
};
```

Drop files at:
- `public/resume/resume.pdf`
- `public/images/profile/avatar.jpg`

---

## Step 2 — Your Projects (`src/data/projects.ts`)

Each project appears as a page in the Blueprint Book.

```ts
{
  id: "unique-id",           // kebab-case, no spaces
  title: "Project Name",
  problem: "The problem you solved in 1-2 sentences.",
  solution: "How you solved it in 1-2 sentences.",
  techStack: ["Python", "FastAPI", "PostgreSQL"],
  features: [
    "Key metric or feature 1",
    "Key metric or feature 2",
  ],
  images: ["/images/projects/your-project.jpg"],
  demoUrl: "https://your-demo.com",   // or undefined
  githubUrl: "https://github.com/...",
  category: "Big Data",
  year: "2024",
  color: "#4F8EF7",  // Accent color for this project
}
```

Add project images to `public/images/projects/`.

---

## Step 3 — Your Skills (`src/data/skills.ts`)

Each skill maps to a key on the 3D keyboard.

```ts
{
  id: "python",
  name: "Python",
  level: "expert",          // beginner | intermediate | advanced | expert
  levelPercent: 92,         // 0–100
  category: "language",     // language | framework | tool | concept | cloud
  description: "Your experience with this skill in 2-3 sentences.",
  color: "#4F8EF7",         // Display color
  brandColor: "#3776AB",    // Official brand color
  icon: "🐍",               // Emoji icon shown on key
}
```

---

## Step 4 — Your Experience (`src/data/experience.ts`)

Each experience appears as a box on the conveyor belt.

```ts
{
  id: "intern-company",
  title: "Role Title",
  organization: "Company Name",
  type: "internship",  // internship | hackathon | leadership | research | volunteering | academic | club
  startDate: "2024-05",  // YYYY-MM
  endDate: "2024-08",    // YYYY-MM or "Present"
  description: "One-paragraph summary.",
  responsibilities: [
    "Bullet point 1",
    "Bullet point 2",
  ],
  technologies: ["Python", "AWS"],
  location: "Chennai, India",
  color: "#4F8EF7",
  icon: "💼",  // Emoji shown on conveyor box
}
```

---

## Step 5 — Your Achievements (`src/data/achievements.ts`)

Each achievement becomes a display case in the gallery.

```ts
{
  id: "ach-cert-aws",
  title: "AWS Certified Solutions Architect",
  issuer: "Amazon Web Services",
  type: "certificate",  // certificate | award | competition | hackathon | academic
  date: "2024-01",
  description: "What this achievement recognizes.",
  image: "/images/achievements/aws-cert.jpg",  // optional
  credentialUrl: "https://aws.amazon.com/verify/...",  // optional
  rank: "Top 5%",  // optional, shown as a badge
  color: "#FF9900",  // Card accent color
}
```

---

## Design System Customization

### Accent Color

In `src/lib/constants.ts`:
```ts
accentBlue: "#4F8EF7",  // → Change to your preferred color
```

In `src/app/globals.css`:
```css
--color-accent-blue: #4F8EF7;  // → Match the above
```

### Background Color

The design spec requires `#111B2F`. To change:

In `src/lib/constants.ts`:
```ts
export const HERO_BACKGROUND = "#111B2F";    // → Your new color
export const CONTACT_BACKGROUND = "#111B2F"; // → Your new color
```

### Typography

Current fonts (loaded in `src/app/layout.tsx`):
- **Display:** Playfair Display → replaces Parisian
- **Body:** Inter
- **Mono:** JetBrains Mono

To change the display font, replace `Playfair_Display` with any Google Font.

---

## Cursor Trail Configuration

In `src/lib/constants.ts`:

```ts
export const CURSOR_TRAIL = {
  maxCards: 6,          // How many cards can be visible at once
  speedThreshold: 8,    // Mouse speed (px/ms) needed to spawn a card
  spawnCooldown: 400,   // Minimum ms between spawns
  cardLifetime: 2800,   // How long a card lives before exiting (ms)
};
```

Lower `speedThreshold` → cards appear even with slow movement.
Lower `spawnCooldown` → more cards appear.

---

## Adding a Section

1. Create `src/components/yoursection/YourSection.tsx`
2. Add `id="yoursection"` to the section element
3. Import and add to `src/app/page.tsx`
4. Add to `NAV_ITEMS` in `src/lib/constants.ts`
