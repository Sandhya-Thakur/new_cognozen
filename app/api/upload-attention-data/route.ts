import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { attentionData } from "@/lib/db/schema";

// Define the AttentionData type
type AttentionData = {
  level: number;
  timestamp: string;
};

let attentionDataStore: AttentionData[] = [];
<<<<<<< HEAD
=======
let lastLoggedTime = Date.now();

function logDataEveryThirtySeconds() {
  const currentTime = Date.now();
  const thirtySeconds = 30000;

  if (currentTime - lastLoggedTime >= thirtySeconds) {
    console.log(
      "Aggregated attention data for the last 30 seconds:",
      attentionDataStore,
    );
    attentionDataStore = [];
    lastLoggedTime = currentTime;
  }
}
>>>>>>> 73239b525beb90395278205e6fac4fc356c7a6a0

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
<<<<<<< HEAD
    const body = await req.json();
    const level = parseFloat(body.output.attention); // Ensure level is parsed as a float
    const timestamp = new Date().toISOString(); // Generate the current timestamp

    console.log("live data:", body); // Log received data

    // Insert data into the database
    const attentionDataResult = await db
      .insert(attentionData)
      .values({
        level: level,
        timestamp: new Date(timestamp),
        userId: userId,
      })
      .returning({
        insertedId: attentionData.id,
      });

    console.log("Attention data result:", attentionDataResult); // Log the result

    // Add received data to the store
    attentionDataStore.push({ level, timestamp });
=======
    const { attentionData }: { attentionData: AttentionData } =
      await req.json();
    attentionDataStore.push(attentionData); // Add received data to the store
    logDataEveryThirtySeconds(); // Check if it's time to log the data
>>>>>>> 73239b525beb90395278205e6fac4fc356c7a6a0

    return NextResponse.json({ message: "Attention data received" });
  } catch (error) {
    console.error("Error in API:", error); // Log error
    return NextResponse.json(
      { error: "internal server error" },
      { status: 500 },
    );
  }
}
