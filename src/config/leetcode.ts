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

/**
 * Last-known-good stats. Shown ONLY if the live LeetCode API is unreachable —
 * LeetCode frequently rate-limits or blocks server-side requests from cloud
 * (datacenter) IPs, so a deployed site can intermittently fail to fetch even
 * though it works locally. Returning these keeps the card populated instead of
 * showing "Unable to load statistics." The live values are always preferred;
 * update these numbers occasionally so the offline fallback stays realistic.
 */
export const LEETCODE_FALLBACK = { totalSolved: 214, streak: 184 };
