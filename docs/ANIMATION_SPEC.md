# Animation Specification

## Global Timing System

| Token | Value | Use case |
|-------|-------|---------|
| `durationFast` | 150ms | Button hover states, icon toggles |
| `durationBase` | 300ms | Card reveals, badge appearances |
| `durationSlow` | 600ms | Section entrances, content reveals |
| `durationEpic` | 1000ms+ | Full-scene choreography |

## Easing Curves

| Name | Bezier | Feel |
|------|--------|------|
| `easingStandard` | `cubic-bezier(0.16, 1, 0.3, 1)` | Fast start, smooth deceleration |
| `easingBounce` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Slight overshoot — used for item pop-in |
| `easingSnap` | `cubic-bezier(0.25, 0.46, 0.45, 0.94)` | Linear-feeling, no bounce |

---

## Section-by-Section Choreography

### HERO
| Element | Animation | Duration | Delay |
|---------|-----------|---------|-------|
| Eyebrow label | Fade + Y | 300ms | 300ms |
| Name (H1) | Fade + Y | 600ms | 412ms |
| Gradient divider | Scale X | 400ms | 524ms |
| Subtitle lines | Fade + Y | 600ms | 636ms |
| Bio text | Fade + Y | 600ms | 748ms |
| CTA buttons | Fade + Y | 600ms | 860ms |
| Social links | Fade + Y | 600ms | 972ms |
| Scroll indicator | Fade | 600ms | 1500ms |

### CURSOR TRAIL
- **Entrance:** `opacity: 0→1, scale: 0.75→1, y: 12→0` · 250ms · easingStandard
- **Exit:** `opacity: 1→0, scale: 1→0.7, y: 0→-8` · 200ms
- **Card lifetime:** 2800ms (configurable)
- **Max concurrent:** 6 cards

### ABOUT — ROBOTIC ARM
| Phase | Element | Duration |
|-------|---------|---------|
| 1 | Arm reaches out | 700ms |
| 2 | Arm carries component | 800ms |
| 3 | Arm places component | 600ms |
| 4 | Component materializes | 500ms (bounce) |
| 5 | Next cycle delay | 600ms |

### SKILLS — 3D KEYBOARD
- **Key hover lift:** `y: 0→0.12` · 60fps lerp factor 0.15
- **Key hover glow:** `emissiveIntensity: 0→0.35` · 60fps lerp factor 0.12
- **Key press:** `y: 0.12→-0.06→0.12` · Press then release
- **Float animation:** React Three Drei `Float` · speed 1.5, rotation 0.08, float 0.2

### PROJECTS — BLUEPRINT BOOK
- **Page transition:** `x: ±60px, opacity: 0→1` · 400ms · easingStandard
- **Direction:** Slide right-to-left for "next", left-to-right for "prev"

### EXPERIENCE — CONVEYOR BELT
- **Belt scroll:** CSS animation `belt-move` · linear · 1.5s infinite
- **Box movement:** Framer Motion translate · `duration = numItems × 4.5s` · linear loop
- **Unfold entrance:** `scaleY: 0.6→1, y: 20→0, opacity: 0→1` · 500ms · easingStandard
- **Responsibility items:** Stagger `delay: 0.1 + index × 0.06`

### ACHIEVEMENTS — DISPLAY GALLERY
- **Grid entrance:** Stagger 70ms between cards · `y: 30→0, opacity: 0→1`
- **Case lid:** Scale X on hover · 250ms
- **Modal entrance:** `scale: 0.88→1, y: 24→0` · 350ms · easingStandard
- **Modal exit:** `scale: 1→0.85, y: 0→16` · 250ms

### CONTACT — DESIGNER'S DESK
- **Desk entrance:** viewport trigger · `y: 50→0, opacity: 0→1`
- **Object stagger:** Resume (delay 0.1s), Laptop (delay 0.2s), Business Card (delay 0.3s)
- **Business card flip:** `rotateY: 0→180deg` · 550ms · easingStandard
- **Steam particles:** `y: 0→-24px, opacity: 0.6→0, scaleX: 1→1.5` · 2s infinite · staggered

---

## Accessibility — Reduced Motion

When `prefers-reduced-motion: reduce`:
- All CSS animations disabled via `animation-duration: 0.01ms`
- Robotic arm shows all components immediately (no sequence)
- Cursor trail returns `null` — no cards rendered
- Three.js Float animation still plays (non-attention-seeking)
- All page transitions remain but are instant
