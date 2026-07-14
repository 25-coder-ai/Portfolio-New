// ============================================================
// GITHUB CONTRIBUTIONS (server-only)
// Fetches the public contribution calendar (no auth token needed) via the
// jogruber contributions API, which mirrors the graph on your GitHub profile.
// ============================================================
// NOTE: only import this from server code (route handlers / server
// components). It calls fetch with Next's ISR cache options.
import { GITHUB_REVALIDATE_SECONDS } from "@/config/github";

export type GitHubStats = {
  /** Contributions in the last 365 days — GitHub's headline number. */
  lastYear: number;
  /** All-time contributions across every year on record. */
  total: number;
};

interface ContributionsResponse {
  total: Record<string, number>;
  contributions: { date: string; count: number }[];
}

const CONTRIB_API = "https://github-contributions-api.jogruber.de/v4";

/**
 * Fetch GitHub contribution totals for a username.
 * Cached server-side via `next.revalidate` — safe to call per request.
 * @throws if the profile can't be found or the API is unreachable.
 */
export async function fetchGitHubContributions(
  username: string,
): Promise<GitHubStats> {
  const res = await fetch(`${CONTRIB_API}/${encodeURIComponent(username)}`, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; Portfolio/1.0)" },
    // Server-side ISR cache — the key to being "live" without polling.
    next: { revalidate: GITHUB_REVALIDATE_SECONDS },
  });

  if (!res.ok) {
    throw new Error(`GitHub contributions API responded with ${res.status}`);
  }

  const json = (await res.json()) as ContributionsResponse;

  const total = Object.values(json.total ?? {}).reduce((a, b) => a + b, 0);

  const cutoff = Date.now() - 365 * 24 * 60 * 60 * 1000;
  const lastYear = (json.contributions ?? [])
    .filter((c) => new Date(c.date).getTime() >= cutoff)
    .reduce((a, c) => a + c.count, 0);

  return { lastYear, total };
}
