import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import fs from 'fs';
import { promises as fsPromises } from 'fs';
import os from 'os';
import path from 'path';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  console.log('POST request received to /api/whisper-api');
  
  let tempFilePath: string | undefined;

  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File | null;

    if (!audioFile) {
      console.log('Error: No audio file provided in the request');
      return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
    }
    console.log(`Audio file received: ${audioFile.name}, size: ${audioFile.size} bytes`);

    const buffer = Buffer.from(await audioFile.arrayBuffer());
    tempFilePath = path.join(os.tmpdir(), `audio-${Date.now()}.wav`);
    await fsPromises.writeFile(tempFilePath, buffer);
    console.log(`Audio file written to temporary location: ${tempFilePath}`);

    console.log('Initiating transcription with OpenAI Whisper API...');
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(tempFilePath),
      model: "whisper-1",
    });
    console.log('Transcription completed successfully');

    return NextResponse.json({ text: transcription.text });
  } catch (error) {
    console.error('Error occurred during processing:', error);
    
    if (error instanceof OpenAI.APIError) {
      console.error('OpenAI API error details:', JSON.stringify(error, null, 2));
      return NextResponse.json({ error: `OpenAI API error: ${error.message}` }, { status: error.status || 500 });
    }
    
    return NextResponse.json({ error: 'Error transcribing audio' }, { status: 500 });
  } finally {
    if (tempFilePath) {
      fsPromises.unlink(tempFilePath)
        .then(() => console.log('Temporary file deleted successfully'))
        .catch(err => console.error('Error deleting temp file:', err));
    }
  }
}

// Log the API key status (do not log the actual key!)
console.log(`OpenAI API Key status: ${process.env.OPENAI_API_KEY ? 'Set' : 'Not set'}`);