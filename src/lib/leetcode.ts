// ============================================================
// LEETCODE API LOGIC (server-only)
// Fetches live stats from LeetCode's public GraphQL endpoint.
// No statistics are hardcoded — everything comes from here.
// ============================================================
// NOTE: only import this from server code (route handlers / server
// components). It calls fetch with Next's ISR cache options.
import type { LeetCodeStats } from "@/types";
import { LEETCODE_REVALIDATE_SECONDS } from "@/config/leetcode";

const LEETCODE_GRAPHQL = "https://leetcode.com/graphql";

// Only the fields we actually display — no ranking / badges / contests.
const QUERY = /* GraphQL */ `
  query userStats($username: String!) {
    matchedUser(username: $username) {
      submitStatsGlobal {
        acSubmissionNum {
          difficulty
          count
        }
      }
      userCalendar {
        streak
        submissionCalendar
      }
    }
  }
`;

interface GraphQLResponse {
  data?: {
    matchedUser: {
      submitStatsGlobal: {
        acSubmissionNum: { difficulty: string; count: number }[];
      };
      userCalendar: {
        streak: number | null;
        submissionCalendar: string | null;
      };
    } | null;
  };
}

const SECONDS_PER_DAY = 86_400;

/**
 * Derive the *current* consecutive-day streak from the submission calendar.
 * LeetCode's `streak` field can report the year's best streak rather than the
 * live one, so we count backwards from today (with a one-day grace period so a
 * streak stays "current" until you miss a full day).
 */
function computeCurrentStreak(submissionCalendar: string | null): number {
  if (!submissionCalendar) return 0;

  let calendar: Record<string, number>;
  try {
    calendar = JSON.parse(submissionCalendar);
  } catch {
    return 0;
  }

  const activeDays = new Set<number>();
  for (const [ts, count] of Object.entries(calendar)) {
    if (count > 0) activeDays.add(Math.floor(Number(ts) / SECONDS_PER_DAY));
  }
  if (activeDays.size === 0) return 0;

  const today = Math.floor(Date.now() / 1000 / SECONDS_PER_DAY);
  // Anchor to today if active, otherwise yesterday (grace period).
  let day = activeDays.has(today) ? today : today - 1;
  if (!activeDays.has(day)) return 0;

  let streak = 0;
  while (activeDays.has(day)) {
    streak += 1;
    day -= 1;
  }
  return streak;
}

/**
 * Fetch live LeetCode statistics for a username.
 * Cached server-side via `next.revalidate` — safe to call per request.
 * @throws if the profile can't be found or the API is unreachable.
 */
export async function fetchLeetCodeStats(username: string): Promise<LeetCodeStats> {
  const res = await fetch(LEETCODE_GRAPHQL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // LeetCode rejects some server-side calls without a referer.
      Referer: `https://leetcode.com/u/${username}/`,
      "User-Agent": "Mozilla/5.0 (compatible; Portfolio/1.0)",
    },
    body: JSON.stringify({ query: QUERY, variables: { username } }),
    // Server-side ISR cache — the key to being "live" without polling.
    next: { revalidate: LEETCODE_REVALIDATE_SECONDS },
  });

  if (!res.ok) {
    throw new Error(`LeetCode API responded with ${res.status}`);
  }

  const json = (await res.json()) as GraphQLResponse;
  const user = json.data?.matchedUser;
  if (!user) {
    throw new Error(`LeetCode user "${username}" not found`);
  }

  const totalSolved =
    user.submitStatsGlobal.acSubmissionNum.find((d) => d.difficulty === "All")
      ?.count ?? 0;

  // Prefer the computed live streak; fall back to the reported field.
  const computed = computeCurrentStreak(user.userCalendar?.submissionCalendar);
  const streak = computed || user.userCalendar?.streak || 0;

  return { totalSolved, streak };
}
