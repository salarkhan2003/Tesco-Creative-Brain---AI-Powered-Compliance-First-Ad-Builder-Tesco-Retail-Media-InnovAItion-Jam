import { NextRequest, NextResponse } from 'next/server';
import { analyzePackshot } from '@/lib/gemini';

/**
 * AI Packshot Analysis API
 * Uses Google Gemini Vision to analyze product images and provide suggestions
 */

interface AnalysisResponse {
  productType: string;
  suggestedCategory: string;
  qualityScore: number;
  suggestions: string[];
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get('image') as File;

    if (!imageFile) {
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!imageFile.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload an image.' },
        { status: 400 }
      );
    }

    console.log('Packshot Analysis - Analyzing image:', imageFile.name);

    // Convert image to base64
    const buffer = await imageFile.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    const dataUrl = `data:${imageFile.type};base64,${base64}`;

    // Analyze the packshot using Gemini Vision
    const analysis = await analyzePackshot(dataUrl);

    return NextResponse.json<AnalysisResponse>(analysis);

  } catch (error) {
    console.error('Packshot analysis error:', error);

    return NextResponse.json<AnalysisResponse>(
      {
        productType: 'Product',
        suggestedCategory: 'General',
        qualityScore: 75,
        suggestions: ['Image uploaded successfully', 'Unable to perform detailed analysis'],
      },
      { status: 200 }
    );
  }
}

