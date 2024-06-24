import { db } from "@/lib/db";
import { flashcards } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const runtime = "edge";

export const POST = async (req: Request) => {
    const { chatId } = await req.json();
    const _flashcards = await db
        .select()
        .from(flashcards)
        .where(eq(flashcards.chatId, chatId));
    return NextResponse.json(_flashcards);
}
        