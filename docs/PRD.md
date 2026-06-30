# Product Requirements Document (PRD)
# Premium Interactive Portfolio — CS Student, Big Data Analytics

---

## 1. Product Vision

A premium, interactive personal portfolio that feels like a curated product launch rather than a typical student page. Every interaction has purpose. Every animation tells a story. The experience should be memorable, recruiter-friendly, and technically impressive.

**Inspiration:** Linear, Vercel, Stripe, Framer, Apple Product Pages

---

## 2. Target Audience

- **Primary:** Recruiters and hiring managers at tech companies
- **Secondary:** Engineering leads and senior engineers reviewing candidates
- **Tertiary:** Peer developers and collaborators

---

## 3. Success Criteria

| Metric | Target |
|--------|--------|
| First Contentful Paint | < 1.2s |
| Time to Interactive | < 2.5s |
| Lighthouse Performance | > 90 |
| Lighthouse Accessibility | > 95 |
| Mobile usability | 100% functional |
| Reduced motion support | Full compliance |

---

## 4. Sections

| # | Section | Flagship Feature | Priority |
|---|---------|-----------------|----------|
| 1 | Hero | Cursor Trail Cards | P0 |
| 2 | About | Robotic Arm Assembly | P1 |
| 3 | Skills | 3D Mechanical Keyboard | P0 |
| 4 | Projects | Engineering Blueprint Book | P0 |
| 5 | Experience | Conveyor Belt Timeline | P0 |
| 6 | Achievements | Display Case Gallery | P1 |
| 7 | Contact | Designer's Desk | P1 |

---

## 5. Tech Stack Rationale

| Technology | Location | Rationale |
|-----------|----------|-----------|
| **Next.js 14 (App Router)** | Core framework | SSR for SEO, file-based routing, optimized image handling, streaming |
| **React 19** | UI layer | Component architecture, concurrent features, latest performance improvements |
| **TypeScript** | All files | Type safety, better DX, self-documenting code, prevents runtime errors |
| **Tailwind CSS v4** | All styling | Utility-first, zero dead CSS, responsive design system, custom tokens |
| **Framer Motion** | Entrance animations, cursor trail, micro-interactions, page transitions | Declarative animation API, excellent React integration, gesture support |
| **GSAP** | Complex sequential animations (robotic arm, conveyor belt, box unfold) | Superior timeline control for multi-step choreography, ScrollTrigger plugin |
| **Three.js** | 3D rendering engine | WebGL abstraction, mature ecosystem |
| **React Three Fiber** | 3D Mechanical Keyboard, 3D scenes | Declarative Three.js in React, full hooks support, automatic disposal |
| **@react-three/drei** | Keyboard helpers, environment maps, text | Higher-level R3F utilities, prebuilt geometries, performance helpers |

---

## 6. Global Design System

### 6.1 Color System
```
Background:    #111B2F  (HERO_BACKGROUND / CONTACT_BACKGROUND)
Surface:       #1A2540
Surface+:      #1F2D4A
Border:        rgba(255,255,255,0.07)
Border accent: rgba(79,142,247,0.25)
Text primary:  #E8EEFF
Text secondary:#8892A4
Text muted:    #4A5568
Accent blue:   #4F8EF7
Accent purple: #A78BFA
Accent green:  #34D399
Accent amber:  #F59E0B
```

### 6.2 Typography System
```
Display:  "Playfair Display" (Parisian font alternative — see CUSTOMIZATION_GUIDE.md)
Body:     "Inter"
Mono:     "JetBrains Mono"
```

### 6.3 Spacing System
Base unit: 4px (0.25rem)
Scale: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 192

### 6.4 Animation System
- Duration fast: 150ms
- Duration base: 300ms
- Duration slow: 600ms
- Duration epic: 1000ms+
- Easing standard: cubic-bezier(0.16, 1, 0.3, 1)
- Easing bounce: cubic-bezier(0.34, 1.56, 0.64, 1)

---

## 7. Accessibility Strategy

- WCAG 2.1 AA compliance
- `prefers-reduced-motion` media query respected globally
- All interactive elements keyboard navigable
- Proper ARIA labels on custom components
- Focus-visible rings on all interactive elements
- Color contrast ratio ≥ 4.5:1 for body text
- Screen reader announcements for dynamic content

---

## 8. Performance Strategy

- Three.js scenes lazy-loaded via dynamic imports
- Images served via Next.js Image component with WebP
- Code splitting per section
- GSAP ScrollTrigger deferred until section is near viewport
- Canvas cleanup on component unmount
- requestAnimationFrame for cursor tracking
- Max 6 cursor trail cards with automatic cleanup

---

## 9. Mobile Strategy

| Breakpoint | Strategy |
|-----------|----------|
| Mobile (<768px) | Full 2D fallback for 3D scenes, stacked layout |
| Tablet (768-1024px) | Simplified 3D (reduced geometry), adjusted layout |
| Desktop (>1024px) | Full experience |
