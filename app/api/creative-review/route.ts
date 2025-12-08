import { NextRequest, NextResponse } from 'next/server';
import { getCreativeReview } from '@/lib/gemini';

/**
 * AI Creative Reviewer API
 * Uses Google Gemini AI to review creatives and provide compliance feedback
 */

interface ReviewRequest {
  headline: string;
  category?: string;
  warnings: Array<{ message: string; severity: 'error' | 'warning'; source: string }>;
  layoutSummary?: {
    format: 'square' | 'vertical';
    hasSafeZoneViolations: boolean;
    numPackshots: number;
    hasAlcoholCategory: boolean;
    hasHumanFlag: boolean;
    contrastIssue: boolean;
  };
}

interface ReviewResponse {
  status: 'ready' | 'not_ready' | 'unknown';
  summary: string;
  suggestions: string[];
}

export async function POST(request: NextRequest) {
  try {
    const body: ReviewRequest = await request.json();
    const { headline, category, warnings, layoutSummary } = body;

    // Validate input
    if (!headline) {
      return NextResponse.json(
        { error: 'Headline is required' },
        { status: 400 }
      );
    }

    const numPackshots = layoutSummary?.numPackshots ?? 0;

    // Check for packshots first
    if (numPackshots === 0) {
      return NextResponse.json<ReviewResponse>({
        status: 'not_ready',
        summary: 'Please upload at least one packshot image to create your creative.',
        suggestions: [
          'Click "Upload Images" button to add 1-3 product images',
          'Packshots are required for Tesco creatives'
        ],
      });
    }

    console.log('Creative Review - Analyzing creative with headline:', headline.substring(0, 30) + '...');

    // Get AI review using the Gemini client
    const review = await getCreativeReview({
      headline,
      category,
      warnings: warnings.map(w => ({
        message: w.message,
        severity: w.severity,
      })),
      layoutSummary: {
        format: layoutSummary?.format || 'square',
        numPackshots,
        hasSafeZoneViolations: layoutSummary?.hasSafeZoneViolations || false,
        hasAlcoholCategory: layoutSummary?.hasAlcoholCategory || false,
        contrastIssue: layoutSummary?.contrastIssue || false,
      },
    });

    return NextResponse.json<ReviewResponse>({
      status: review.status as 'ready' | 'not_ready' | 'unknown',
      summary: review.summary,
      suggestions: review.suggestions,
    });

  } catch (error) {
    console.error('Creative review error:', error);

    return NextResponse.json<ReviewResponse>(
      {
        status: 'unknown',
        summary: 'Failed to complete AI review. Please try again.',
        suggestions: ['Check your internet connection', 'Verify API configuration'],
      },
      { status: 500 }
    );
  }
}
