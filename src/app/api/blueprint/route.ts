import { BlueprintGraph } from '@/lib/types';
import fs from 'fs';
import { NextResponse } from 'next/server';
import path from 'path';

export async function GET() {
  try {
    // Read the JSON file from the public directory
    const filePath = path.join(process.cwd(), 'public', 'graph.json');
    let data: BlueprintGraph;

    try {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      
      // Handle empty file case
      if (!fileContent.trim()) {
        data = { nodes: [], edges: [] }; // Or whatever default structure you need
      } else {
        data = JSON.parse(fileContent) as BlueprintGraph;
      }
    } catch (error) {
      console.error('Error reading blueprint data:', error);
      return new Response(JSON.stringify({ error: 'Failed to read blueprint data' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error reading blueprint data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blueprint data' },
      { status: 500 }
    );
  }
}