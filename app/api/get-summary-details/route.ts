import { db } from "@/lib/db";
import { summaries } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const runtime = "edge";

export const POST = async (req: Request) => {
    const { chatId } = await req.json();
    const _summaries = await db
        .select()
        .from(summaries)
        .where(eq(summaries.chatId, chatId));
    return NextResponse.json(_summaries);
}