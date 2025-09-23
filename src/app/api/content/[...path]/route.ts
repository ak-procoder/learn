import { NextRequest, NextResponse } from 'next/server';
import { readdir } from 'fs/promises';
import { join } from 'path';

/**
 * API route to get directory listings for dynamic content loading
 * GET /api/content/{path} - Returns list of files in the specified directory
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    // Construct the path from the dynamic segments
    const contentPath = params.path.join('/');
    const fullPath = join(process.cwd(), 'public', 'content', contentPath);
    
    // Read directory contents
    const files = await readdir(fullPath);
    
    // Filter for markdown files and sort them
    const markdownFiles = files
      .filter(file => file.endsWith('.md'))
      .sort();
    
    return NextResponse.json(markdownFiles);
  } catch (error) {
    console.error('Error reading directory:', error);
    return NextResponse.json(
      { error: 'Directory not found' },
      { status: 404 }
    );
  }
}