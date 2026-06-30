# Future Enhancements

## Tier 1 — High Impact, Low Risk

### 1. Three.js Page Flip (Projects)
**Current:** CSS 3D slide transition
**Enhancement:** Full Three.js page flip with paper shader — realistic curl, paper crinkle
**Tech:** Three.js ShaderMaterial, custom geometry deformation
**Effort:** High

### 2. GSAP ScrollTrigger Integration
**Current:** IntersectionObserver-based section triggers
**Enhancement:** GSAP ScrollTrigger for parallax, scrubbing, pin animations
**Note:** Already installed — extend any animation system
**Effort:** Medium

### 3. Skill Dependency Graph
**Current:** Individual skill keys on keyboard
**Enhancement:** Click a key → shows relationship lines between skills (what depends on what)
**Tech:** Three.js line geometry, custom graph layout
**Effort:** Medium

### 4. Real Contact Backend
**Current:** mailto: link (opens mail client)
**Enhancement:** Resend or SendGrid API for direct server-side email delivery
**Tech:** Next.js API Route (`/api/contact`) + Resend SDK
**Effort:** Low

---

## Tier 2 — Premium Polish

### 5. Ambient Audio
Subtle, toggleable keyboard click sounds when interacting with the 3D keyboard. Web Audio API.

### 6. Theme System
Add a light/dark toggle with smooth color transitions. Keep the current dark as default.

### 7. Blog Integration
Add a `/blog` route using MDX files for technical writing. Recruiters value written communication.

### 8. Analytics
Add Plausible or Vercel Analytics to track recruiter engagement — which sections they scroll to, what they click.

### 9. i18n
Support multiple languages using `next-intl` — useful for applying to companies in different regions.

---

## Tier 3 — Experimental

### 10. WebGL Shader Hero Background
Replace the CSS gradient background with a subtle WebGL shader animation (noise fields, particle systems). Keep it extremely subtle.

### 11. Cursor Glow
Add a color-shifting radial glow that follows the cursor and reacts to what's underneath (changes color when over different sections).

### 12. 3D Avatar
React Three Fiber — a stylized low-poly 3D avatar in the About section instead of/alongside the robotic arm.

### 13. Project Video Previews
Hover over a project in the Blueprint Book → plays a short screen recording of the project.

---

## Technical Debt to Address

1. **Convert to Resend API**: Replace mailto fallback with actual API delivery
2. **Image optimization**: Add blur placeholders for project images using `next/image`
3. **Bundle analysis**: Run `@next/bundle-analyzer` and split chunks if keyboard scene > 200KB
4. **E2E Tests**: Add Playwright tests for critical interactions (cursor trail, keyboard hover, book flip)
5. **CSP Headers**: Add Content Security Policy for production deployment
