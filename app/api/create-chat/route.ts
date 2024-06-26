import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { loadS3IntoPinecone } from "@/lib/ pinecone";
import { getS3Url } from "@/lib/s3";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

// /api/create-chat
export async function POST(req: Request) {
  console.log("API endpoint hit"); // Log to confirm API hit
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const { file_key, file_name } = body;
    console.log("Received body:", body); // Log received body
    await loadS3IntoPinecone(file_key);

    const chatResult = await db
      .insert(chats)
      .values({
        fileKey: file_key,
        pdfName: file_name,
        pdfUrl: getS3Url(file_key),
        userId,
      })
      .returning({
        insertedId: chats.id,
      });

    const chat_id = chatResult[0].insertedId;

    console.log("Chat ID:", chat_id); // Log chat ID
    return NextResponse.json(
      {
        chat_id,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error in API:", error); // Log error
    return NextResponse.json(
      { error: "internal server error" },
      { status: 500 },
    );
  }
}
