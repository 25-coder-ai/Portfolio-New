// ============================================================
// LEETCODE — SINGLE SOURCE OF TRUTH
// Replace LEETCODE_USERNAME with your handle and everything else
// (API route, profile link, card) updates automatically.
// ============================================================

/** Your LeetCode username, e.g. the "u/<username>" in your profile URL. */
export const LEETCODE_USERNAME = "Dakshithaa";

/** Public profile URL — derived from the username. */
export const LEETCODE_PROFILE_URL = `https://leetcode.com/u/Dakshithaa/`;

/**
 * How long (seconds) the server caches LeetCode stats before refetching.
 * The card is NOT polled from the browser — this is server-side ISR caching,
 * so visitors are served from cache and LeetCode is hit at most once per window.
 * 6 hours is a good balance of "live" vs. respectful of the upstream API.
 */
export const LEETCODE_REVALIDATE_SECONDS = 6 * 60 * 60;
