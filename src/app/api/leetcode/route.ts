import { NextResponse } from "next/server";
import { fetchLeetCodeStats } from "@/lib/leetcode";
import {
  LEETCODE_USERNAME,
  LEETCODE_REVALIDATE_SECONDS,
} from "@/config/leetcode";

// GET /api/leetcode → live LeetCode stats.
// The heavy caching lives in the upstream fetch (see lib/leetcode); this
// handler simply exposes it to the client card. No polling, no hardcoding.
export async function GET() {
  try {
    const stats = await fetchLeetCodeStats(LEETCODE_USERNAME);
    return NextResponse.json(stats, {
      headers: {
        // Let CDNs/browsers reuse the response between server revalidations.
        "Cache-Control": `public, s-maxage=${LEETCODE_REVALIDATE_SECONDS}, stale-while-revalidate=60`,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to load statistics" },
      { status: 502 },
    );
  }
}
