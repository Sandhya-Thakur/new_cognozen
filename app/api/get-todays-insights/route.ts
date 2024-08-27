// app/api/get-todays-insights/route.ts
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { insightsAndTips } from "@/lib/db/schema";
import { NextResponse } from "next/server";
import { eq, and, gte, lte } from "drizzle-orm";

export const dynamic = "force-dynamic";
export const runtime = "edge";

export async function GET(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/sign-in");
  }

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const data = await db
      .select()
      .from(insightsAndTips)
      .where(
        and(
          eq(insightsAndTips.userId, userId),
          gte(insightsAndTips.createdAt, today),
          lte(insightsAndTips.createdAt, tomorrow)
        )
      )
      .orderBy(insightsAndTips.createdAt);

    if (data.length > 0) {
      return NextResponse.json(data);
    } else {
      return NextResponse.json({ error: "No insights found for today" }, { status: 404 });
    }
  } catch (error) {
    console.error("Failed to fetch today's insights", error);
    return NextResponse.json(
      { error: "Failed to fetch today's insights" },
      { status: 500 },
    );
  }
}