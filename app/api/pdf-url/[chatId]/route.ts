// app/api/pdf-content/[chatId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getContext } from "@/lib/ context";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: { chatId: string } }
) {
  try {
    const chatId = params.chatId;

    const _chats = await db.select().from(chats).where(eq(chats.id, parseInt(chatId)));
    if (_chats.length !== 1) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    const fileKey = _chats[0].fileKey;
    const context = await getContext("Retrieve the content of this PDF", fileKey);

    if (context.length < 100) {  // Adjust this threshold as needed
      return NextResponse.json({ error: "Not enough content in the PDF." }, { status: 400 });
    }

    return NextResponse.json({ content: context });
  } catch (error) {
    console.error("Error fetching PDF content:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}