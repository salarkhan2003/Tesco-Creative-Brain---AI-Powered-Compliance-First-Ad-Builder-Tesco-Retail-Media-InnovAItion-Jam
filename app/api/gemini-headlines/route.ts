import { NextRequest, NextResponse } from 'next/server';
import { generateHeadlines } from '@/lib/gemini';

/**
 * Gemini AI Headline Generation API
 * Generates Tesco-compliant ad headlines using Google Gemini AI
 */

interface GeminiRequest {
  productName: string;
  description: string;
  tone?: string;
  currentHeadline?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: GeminiRequest = await request.json();
    const { productName, description, tone, currentHeadline } = body;

    // Validate input
    if (!productName || !description) {
      return NextResponse.json(
        { error: 'Product name and description are required' },
        { status: 400 }
      );
    }

    console.log('Headline Generation - Product:', productName);

    // Generate headlines using the Gemini client
    const headlines = await generateHeadlines(
      productName,
      description,
      tone,
      currentHeadline
    );

    return NextResponse.json({
      headlines,
    });

  } catch (error) {
    console.error('Headline generation error:', error);

    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
        headlines: ['Fresh Quality Products', 'Great Value Every Day', 'Shop Smart with Tesco']
      },
      { status: 200 }
    );
  }
}
