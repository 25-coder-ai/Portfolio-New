// ============================================================
// GITHUB — SINGLE SOURCE OF TRUTH
// Replace GITHUB_USERNAME with your handle and the contributions
// card + API route + profile link all update automatically.
// ============================================================

/** Your GitHub username (the part after github.com/). */
export const GITHUB_USERNAME = "25-coder-ai";

/** Public profile URL — derived from the username. */
export const GITHUB_PROFILE_URL = `https://github.com/${GITHUB_USERNAME}`;

/**
 * How long (seconds) the server caches the contribution count before
 * refetching. Server-side ISR — visitors are served from cache and the
 * upstream contributions API is hit at most once per window.
 */
export const GITHUB_REVALIDATE_SECONDS = 60 * 60; // 1 hour
