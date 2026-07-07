# Live LeetCode Card

The LeetCode metric in the **About** section is **live** — it fetches your real
profile statistics (current streak + problems solved) from LeetCode's public
GraphQL API. No numbers are hardcoded. When your LeetCode activity changes, the
portfolio reflects it automatically on the next cache cycle.

---

## 1. Quick start — the ONE thing you must change

Open **`src/config/leetcode.ts`** and set your username:

```ts
export const LEETCODE_USERNAME = "your_username";
```

That's it. The API route, the profile link, and the card all derive from this
single value. Save, restart the dev server, and the card is live.

> Your username is the part after `leetcode.com/u/` in your profile URL.
> e.g. for `https://leetcode.com/u/john_doe/` the username is `john_doe`.

---

## 2. How "dynamic" actually works

There is **no browser polling** and **no hardcoded data**. The flow:

```
Browser (LeetCodeCard.tsx)
   │  fetch("/api/leetcode")   ← once, on mount
   ▼
Route Handler (src/app/api/leetcode/route.ts)
   │  fetchLeetCodeStats()
   ▼
LeetCode GraphQL  ── cached server-side via next.revalidate ──┐
   ▲                                                          │
   └──────── only re-hit AFTER the cache window expires ──────┘
```

- The server caches the LeetCode response for a fixed window
  (`LEETCODE_REVALIDATE_SECONDS`, default **6 hours**).
- Every visitor in that window is served the **cached** result — LeetCode is
  contacted at most once per window, no matter how much traffic you get.
- After the window expires, the next request triggers a fresh fetch in the
  background (Incremental Static Regeneration), and the cache updates.

So "dynamic" = **your profile changes → within one cache window the site shows
the new numbers, with zero manual edits and zero redeploys.**

### Making it update faster (or slower)

Edit the window in `src/config/leetcode.ts`:

```ts
export const LEETCODE_REVALIDATE_SECONDS = 6 * 60 * 60; // 6h (default)
// export const LEETCODE_REVALIDATE_SECONDS = 60 * 30;  // 30 min — fresher
// export const LEETCODE_REVALIDATE_SECONDS = 60;       // 1 min — very fresh
```

Trade-off: shorter window = fresher data but more calls to LeetCode. 30–60 min
is a good "feels live" setting; 6 h is the polite default.

---

## 3. Where it needs to run for live updates

Live updates require a **server runtime** (the route handler runs on demand):

| Deployment                                   | Live updates? |
| -------------------------------------------- | ------------- |
| `next start` (Node server)                   | ✅ Yes        |
| Vercel / Netlify / any Node or edge host     | ✅ Yes        |
| `next dev` (local)                           | ✅ Yes        |
| **`output: "export"` (fully static HTML)**   | ❌ No — the API route can't run |

This project uses the standard (server) output, so you're good. Just don't
switch to a static export.

---

## 4. Files (clean architecture — one concern each)

| File                                        | Responsibility                                   |
| ------------------------------------------- | ------------------------------------------------ |
| `src/config/leetcode.ts`                    | **Configuration** — username, profile URL, cache window. Single source of truth. |
| `src/lib/leetcode.ts`                       | **API logic** — GraphQL query, parsing, current-streak computation. Server-only. |
| `src/app/api/leetcode/route.ts`             | **Route Handler** — exposes the cached stats at `GET /api/leetcode`. |
| `src/components/about/LeetCodeCard.tsx`     | **UI + animation** — states, count-up, hover reveal. |
| `src/types/index.ts` (`LeetCodeStats`)      | **Types** — shared data shape.                   |

To swap the data source later (e.g. a different API), you only touch
`src/lib/leetcode.ts` — the route, card, and config stay untouched.

---

## 5. What the card shows

```
LeetCode
🔥 126            ← current streak (counts up 0 → value, ~1s, once)
Current Streak
────────────
842               ← problems solved (counts up)
Problems Solved
────────────
● Updated Live    ← pulsing amber dot
```

Deliberately minimal — **no** ranking, acceptance rate, badges, or contest
history, as specified.

### States (the card is never empty)

- **Loading** — skeleton shimmer + "Loading profile…", same height as the
  loaded card (no layout shift).
- **Error** — "Unable to load statistics." + a **Visit Profile →** button so the
  visitor can still reach your profile.
- **Hover / keyboard focus** — the stats smoothly crossfade to **Visit
  Profile →** (a fade, not a flip/rotate).

### Accessibility

- Keyboard accessible: the profile link is focusable and the reveal also
  triggers on `focus-within`, with a visible focus ring.
- ARIA labels announce the real values (e.g. `Current streak: 126 days`); the
  animated digits are `aria-hidden` so screen readers hear the final number.
- Respects `prefers-reduced-motion`: no count-up, no shimmer, no pulse — final
  values render instantly.

---

## 6. Troubleshooting

**The card shows "Unable to load statistics."**

1. Check the username in `src/config/leetcode.ts` is exactly right
   (case-sensitive, no `u/`, no trailing slash).
2. Visit `http://localhost:3000/api/leetcode` directly:
   - `{"totalSolved":…,"streak":…}` → working; the card will render it.
   - `{"error":"Unable to load statistics"}` → LeetCode rejected the request or
     the user wasn't found.
3. LeetCode occasionally rate-limits or blocks server IPs. It usually recovers
   on its own; the card safely falls back to the error state meanwhile.

**Numbers look stale.** That's the cache doing its job — wait out the
`LEETCODE_REVALIDATE_SECONDS` window, or lower it temporarily. In local dev a
hard refresh (`Ctrl+Shift+R`) bypasses the cache.

**Streak looks off.** The streak is computed from your submission calendar as a
true *current* consecutive-day streak (with a one-day grace period), which can
differ from the single "streak" number LeetCode shows on some pages.

---

## 7. Note: the Hero social icon

The LeetCode icon in the **Hero** section links via `profile.leetcode` in
`src/data/profile.ts` — that's a separate value. Point it at the same profile
URL for consistency (or import `LEETCODE_PROFILE_URL` from the config if you
want a single source there too).
