// app/api/get-mood-suggested-activities/route.ts
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { suggestedActivities } from "@/lib/db/schema";
import { eq, and, gte, lte } from "drizzle-orm";

export const dynamic = "force-dynamic";
export const runtime = "edge";

interface Activity {
  title: string;
  description: string;
}

interface SuggestedActivity {
  id: number;
  date: string;
  mood: string;
  activities: Activity[];
}

export async function GET(request: Request) {
  console.log("GET request received");
  try {
    const { userId } = await auth();
    console.log("User ID:", userId);
    if (!userId) {
      console.log("Unauthorized access attempt");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "today";
    console.log("Requested period:", period);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let startDate = new Date(today);
    let endDate = new Date(today);
    endDate.setDate(endDate.getDate() + 1);

    switch (period) {
      case "week":
        startDate.setDate(startDate.getDate() - 7);
        break;
      case "month":
        startDate.setMonth(startDate.getMonth() - 1);
        break;
    }

    console.log("Date range:", { startDate, endDate });

    const rawData = await db
      .select()
      .from(suggestedActivities)
      .where(
        and(
          eq(suggestedActivities.userId, userId),
          gte(suggestedActivities.createdAt, startDate),
          lte(suggestedActivities.createdAt, endDate)
        )
      )
      .orderBy(suggestedActivities.createdAt);

    console.log("Raw data fetched:", rawData.length, "items");

    if (rawData.length === 0) {
      console.log(`No activities found for ${period}`);
      return NextResponse.json({ error: `No activities found for ${period}` }, { status: 404 });
    }

    const processedData: SuggestedActivity[] = rawData
      .map(item => {
        console.log("Processing item:", item.id);
        try {
          const parsedActivities = JSON.parse(item.activities);
          if (Array.isArray(parsedActivities)) {
            return {
              id: item.id,
              date: item.createdAt.toISOString(),
              mood: item.mood,
              activities: parsedActivities
            };
          } else {
            console.error("Invalid activities format for item:", item.id);
            return null;
          }
        } catch (parseError) {
          console.error("Error parsing activities for item:", item.id, parseError);
          return null;
        }
      })
      .filter((item): item is SuggestedActivity => item !== null);

    console.log("Processed data:", processedData.length, "items");

    return NextResponse.json(processedData);
  } catch (error) {
    console.error("Detailed error in GET request:", error);
    if (error instanceof Error) {
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    return NextResponse.json(
      { error: `Failed to fetch suggested activities`, details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    );
  }
}