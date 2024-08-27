// app/api/pdf-content/[fileKey]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: { fileKey: string } }
) {
  const fileKey = params.fileKey;

  const filePath = path.join(process.cwd(), 'filesUploads', fileKey);

  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return NextResponse.json({ content });
  } catch (error) {
    console.error('Error reading file:', error);
    return new NextResponse('Error reading file', { status: 500 });
  }
}