import { NextResponse } from "next/server";
import { fetchGitHubContributions } from "@/lib/github";
import { GITHUB_USERNAME, GITHUB_REVALIDATE_SECONDS } from "@/config/github";

// GET /api/github → live GitHub contribution totals.
// Heavy caching lives in the upstream fetch (see lib/github); this handler
// simply exposes it to the client card. No polling, no hardcoding.
export async function GET() {
  try {
    const stats = await fetchGitHubContributions(GITHUB_USERNAME);
    return NextResponse.json(stats, {
      headers: {
        "Cache-Control": `public, s-maxage=${GITHUB_REVALIDATE_SECONDS}, stale-while-revalidate=60`,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to load contributions" },
      { status: 502 },
    );
  }
}
