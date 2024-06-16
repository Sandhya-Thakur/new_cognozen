import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";

export const dynamic = 'force-dynamic'; // static by default, unless reading the request
export const runtime = 'edge'; // specify the runtime to be edge

export async function GET(request: Request) {
  try {
    const data = await db.select().from(chats).orderBy(desc(chats.id));
    if (data.length > 0) {
      return NextResponse.json(data);
    } else {
      return NextResponse.json({ error: "No chat IDs found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Failed to fetch chat IDs", error);
    return NextResponse.json({ error: "Failed to fetch chat IDs" }, { status: 500 });
  }
}

      
