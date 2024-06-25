import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

// Define the AttentionData type
type AttentionData = {
  level: number;
  timestamp: string;

};


let attentionDataStore: AttentionData[] = [];
let lastLoggedTime = Date.now();

function logDataEveryTenSeconds() {
  const currentTime = Date.now();
  const tenSeconds = 10000;

  if (currentTime - lastLoggedTime >= tenSeconds) {
    console.log("Aggregated attention data for the last 10 seconds:", attentionDataStore);
    attentionDataStore = []; 
    lastLoggedTime = currentTime; 
  }
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    const { attentionData }: { attentionData: AttentionData } = await req.json();
    attentionDataStore.push(attentionData); // Add received data to the store
    logDataEveryTenSeconds(); // Check if it's time to log the data
    return NextResponse.json({ message: "Attention data received" });
  } catch (error) {
    console.error("Error in API:", error); // Log error
    return NextResponse.json(
      { error: "internal server error" },
      { status: 500 }
    );
  }
}
