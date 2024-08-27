import { db } from "@/lib/db";
import { chats, flashcards } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(request: Request) {
    try {
      const { searchParams } = new URL(request.url);
      const idParam = searchParams.get('id');
  
      if (!idParam) {
        // Fetch all flashcards if no id is provided
        const allFlashcards = await db
          .select({
            id: flashcards.id,
            content: flashcards.content,
            createdAt: flashcards.createdAt,
            role: flashcards.role,
            pdfName: chats.pdfName,
          })
          .from(flashcards)
          .leftJoin(chats, eq(flashcards.chatId, chats.id));
        return NextResponse.json(allFlashcards);
      }
  
      const id = parseInt(idParam, 10);
      if (isNaN(id)) {
        return NextResponse.json({ error: "Invalid id parameter" }, { status: 400 });
      }
  
      // Fetch a specific flashcard by id
      const flashcard = await db
        .select({
          id: flashcards.id,
          content: flashcards.content,
          createdAt: flashcards.createdAt,
          role: flashcards.role,
          pdfName: chats.pdfName,
        })
        .from(flashcards)
        .leftJoin(chats, eq(flashcards.chatId, chats.id))
        .where(eq(flashcards.id, id))
        .limit(1);
  
      if (flashcard.length === 0) {
        return NextResponse.json({ error: "Flashcard not found" }, { status: 404 });
      }
  
      return NextResponse.json(flashcard[0]);
    } catch (error) {
      console.error("Error fetching flashcard(s):", error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }
  
  export async function PUT(request: Request) {
    try {
      const { searchParams } = new URL(request.url);
      const idParam = searchParams.get('id');
      const body = await request.json();
  
      if (!idParam) {
        return NextResponse.json({ error: "Missing id parameter" }, { status: 400 });
      }
  
      const id = parseInt(idParam, 10);
      if (isNaN(id)) {
        return NextResponse.json({ error: "Invalid id parameter" }, { status: 400 });
      }
  
      const updatedFlashcard = await db.update(flashcards)
        .set(body)
        .where(eq(flashcards.id, id))
        .returning();
  
      if (updatedFlashcard.length === 0) {
        return NextResponse.json({ error: "Flashcard not found" }, { status: 404 });
      }
  
      // Fetch the updated flashcard with pdfName
      const flashcardWithPdfName = await db
        .select({
          id: flashcards.id,
          content: flashcards.content,
          createdAt: flashcards.createdAt,
          role: flashcards.role,
          pdfName: chats.pdfName,
        })
        .from(flashcards)
        .leftJoin(chats, eq(flashcards.chatId, chats.id))
        .where(eq(flashcards.id, id))
        .limit(1);
  
      return NextResponse.json(flashcardWithPdfName[0]);
    } catch (error) {
      console.error("Error updating flashcard:", error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const idParam = searchParams.get('id');

    if (!idParam) {
      return NextResponse.json({ error: "Missing id parameter" }, { status: 400 });
    }

    const id = parseInt(idParam, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid id parameter" }, { status: 400 });
    }

    const deletedFlashcard = await db.delete(flashcards)
      .where(eq(flashcards.id, id))
      .returning();

    if (deletedFlashcard.length === 0) {
      return NextResponse.json({ error: "Flashcard not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Flashcard deleted successfully" });
  } catch (error) {
    console.error("Error deleting flashcard:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}