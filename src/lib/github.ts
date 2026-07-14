// ============================================================
// GITHUB CONTRIBUTIONS (server-only)
//
// Two paths:
//  1. If GITHUB_TOKEN is set (a personal access token), we use GitHub's
//     authenticated GraphQL API — this returns the SAME number shown on your
//     profile ("N contributions in the last year"), INCLUDING private ones.
//  2. Otherwise we fall back to the public jogruber contributions API, which
//     can only see PUBLIC contributions (so it may read lower than your profile).
// ============================================================
// NOTE: only import this from server code (route handlers / server components).
import { GITHUB_REVALIDATE_SECONDS } from "@/config/github";

export type GitHubStats = {
  /** Contributions in the last 365 days — GitHub's headline number. */
  lastYear: number;
  /** Kept for API shape parity; equals lastYear here. */
  total: number;
};

// --- Authenticated GraphQL: includes private contributions (matches profile) ---
async function fetchViaGraphQL(username: string, token: string): Promise<number> {
  const query = `query($login:String!){user(login:$login){contributionsCollection{contributionCalendar{totalContributions}}}}`;
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "Portfolio/1.0",
    },
    body: JSON.stringify({ query, variables: { login: username } }),
    next: { revalidate: GITHUB_REVALIDATE_SECONDS },
  });
  if (!res.ok) throw new Error(`GitHub GraphQL responded with ${res.status}`);
  const json = (await res.json()) as {
    data?: { user?: { contributionsCollection?: { contributionCalendar?: { totalContributions?: number } } } };
  };
  const total = json.data?.user?.contributionsCollection?.contributionCalendar?.totalContributions;
  if (typeof total !== "number") throw new Error("GitHub GraphQL: no contribution data");
  return total;
}

// --- Public fallback: PUBLIC contributions only ---
async function fetchViaPublic(username: string): Promise<number> {
  const res = await fetch(
    `https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(username)}?y=last`,
    {
      headers: { "User-Agent": "Portfolio/1.0" },
      next: { revalidate: GITHUB_REVALIDATE_SECONDS },
    },
  );
  if (!res.ok) throw new Error(`GitHub contributions API responded with ${res.status}`);
  const json = (await res.json()) as {
    total?: Record<string, number>;
    contributions?: { count: number }[];
  };
  const summed = (json.contributions ?? []).reduce((a, c) => a + c.count, 0);
  const value = json.total?.lastYear ?? summed;
  // Guard against transient empty responses being cached as a real "0".
  if (!value && summed === 0 && (json.contributions?.length ?? 0) === 0) {
    throw new Error("GitHub contributions API returned an empty calendar");
  }
  return value;
}

/**
 * Fetch GitHub contributions for a username, cached server-side via
 * `next.revalidate`. Prefers the token path (private included) when available.
 * @throws if the profile can't be found or the API is unreachable.
 */
export async function fetchGitHubContributions(username: string): Promise<GitHubStats> {
  const token = process.env.GITHUB_TOKEN;
  const lastYear = token
    ? await fetchViaGraphQL(username, token)
    : await fetchViaPublic(username);
  return { lastYear, total: lastYear };
}
