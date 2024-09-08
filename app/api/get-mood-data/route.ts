//api/get-mood-data
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { moodData } from "@/lib/db/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic"; // static by default, unless reading the request
export const runtime = "edge"; // specify the runtime to be edge

export async function GET(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/sign-in");
  }

  try {
    const data = await db
      .select()
      .from(moodData)
      .where(eq(moodData.userId, userId));

    if (data.length > 0) {
      return NextResponse.json(data);
    } else {
      return NextResponse.json({ error: "No mood data found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Failed to fetch mood data", error);
    return NextResponse.json(
      { error: "Failed to fetch mood data" },
      { status: 500 },
    );
  }
}