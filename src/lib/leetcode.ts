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
 * Derive the *longest* (max) consecutive-day streak from the submission
 * calendar. This is a fixed, historical figure — it never shrinks as days pass,
 * so the card can display it without needing to stay "live".
 */
function computeMaxStreak(submissionCalendar: string | null): number {
  if (!submissionCalendar) return 0;

  let calendar: Record<string, number>;
  try {
    calendar = JSON.parse(submissionCalendar);
  } catch {
    return 0;
  }

  const activeDays: number[] = [];
  for (const [ts, count] of Object.entries(calendar)) {
    if (count > 0) activeDays.push(Math.floor(Number(ts) / SECONDS_PER_DAY));
  }
  if (activeDays.length === 0) return 0;

  activeDays.sort((a, b) => a - b);

  let best = 1;
  let run = 1;
  for (let i = 1; i < activeDays.length; i++) {
    if (activeDays[i] === activeDays[i - 1] + 1) {
      run += 1;
    } else if (activeDays[i] !== activeDays[i - 1]) {
      run = 1;
    }
    if (run > best) best = run;
  }
  return best;
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

  // Longest streak from the calendar; fall back to the reported field.
  const computed = computeMaxStreak(user.userCalendar?.submissionCalendar);
  const streak = computed || user.userCalendar?.streak || 0;

  return { totalSolved, streak };
}
