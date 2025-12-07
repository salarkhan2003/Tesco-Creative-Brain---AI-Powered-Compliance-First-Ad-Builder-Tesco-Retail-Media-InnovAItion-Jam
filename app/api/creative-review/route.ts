import { NextRequest, NextResponse } from 'next/server';

/**
 * AI Creative Reviewer API
 * Reviews the current creative state and provides feedback
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

    // Check for API key
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey.trim() === '') {
      console.error('GEMINI_API_KEY not set or empty');
      
      // Fallback: provide basic review based on warnings
      const numPackshots = layoutSummary?.numPackshots ?? 0;
      
      if (warnings.length === 0 && numPackshots > 0) {
        return NextResponse.json<ReviewResponse>({
          status: 'ready',
          summary: 'Your creative appears compliant with Tesco guidelines based on automated checks.',
          suggestions: [],
        });
      } else if (numPackshots === 0) {
        return NextResponse.json<ReviewResponse>({
          status: 'not_ready',
          summary: 'Please upload at least one packshot image to create your creative.',
          suggestions: ['Upload 1-3 product images to get started'],
        });
      } else {
        return NextResponse.json<ReviewResponse>({
          status: 'not_ready',
          summary: `Found ${warnings.length} compliance issue${warnings.length > 1 ? 's' : ''} that need attention.`,
          suggestions: warnings.slice(0, 5).map(w => w.message),
        });
      }
    }

    // Build the prompt
    const prompt = `You are a Tesco Retail Media compliance and creative quality assistant.

You are given:
- Headline text: "${headline}"
- Category: ${category || 'Not specified'}
- Number of compliance warnings: ${warnings.length}
- Compliance warnings: ${warnings.length > 0 ? warnings.map(w => `"${w.message}" (${w.severity})`).join(', ') : 'None'}
- Layout info:
  - Format: ${layoutSummary?.format || 'unknown'}
  - Number of packshots: ${layoutSummary?.numPackshots || 0}
  - Safe zone violations: ${layoutSummary?.hasSafeZoneViolations ? 'Yes' : 'No'}
  - Alcohol category: ${layoutSummary?.hasAlcoholCategory ? 'Yes' : 'No'}
  - Human detected: ${layoutSummary?.hasHumanFlag ? 'Yes' : 'No'}
  - Contrast issues: ${layoutSummary?.contrastIssue ? 'Yes' : 'No'}

Tesco prototype rules:
- No prices or % off, no "best price", no "discount", no money-back guarantees.
- No eco/green claims like "eco-friendly", "sustainable", "greenest".
- Max 3 packshots.
- Minimum font size is 16px.
- Respect safe zones for social UI (top and bottom).
- For Alcohol, a Drinkaware lock-up must be present.
- Text should be readable (good contrast).

TASK:
1. Decide if this creative is READY or NOT READY for Tesco use.
2. If READY, respond with a JSON like:
{
  "status": "ready",
  "summary": "Short positive summary here.",
  "suggestions": []
}
3. If NOT READY, respond with:
{
  "status": "not_ready",
  "summary": "Short diagnosis here.",
  "suggestions": [
    "Bullet recommendation 1",
    "Bullet recommendation 2"
  ]
}

Do NOT include any prices or non-compliant phrases in your suggestions.
Only return valid JSON. No extra text.`;

    // Call Gemini API
    console.log('Calling Gemini API for creative review...');
    
    const geminiResponse = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 500,
          }
        }),
      }
    );

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error('Gemini API error:', geminiResponse.status, errorText);
      
      // Fallback based on warnings
      const numPackshots = layoutSummary?.numPackshots ?? 0;
      
      if (warnings.length === 0 && numPackshots > 0) {
        return NextResponse.json<ReviewResponse>({
          status: 'ready',
          summary: 'Your creative appears compliant based on automated checks. (AI review unavailable)',
          suggestions: [],
        });
      } else {
        return NextResponse.json<ReviewResponse>({
          status: 'not_ready',
          summary: `Found ${warnings.length} compliance issue${warnings.length > 1 ? 's' : ''}.`,
          suggestions: warnings.slice(0, 5).map(w => w.message),
        });
      }
    }

    const data = await geminiResponse.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!generatedText) {
      throw new Error('No text generated from Gemini');
    }

    // Parse JSON from response
    let review: ReviewResponse;
    try {
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        review = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', parseError);
      
      // Fallback based on warnings count
      if (warnings.length === 0) {
        review = {
          status: 'ready',
          summary: 'Your creative appears compliant with Tesco guidelines.',
          suggestions: [],
        };
      } else {
        review = {
          status: 'not_ready',
          summary: `Found ${warnings.length} compliance issue${warnings.length > 1 ? 's' : ''}.`,
          suggestions: warnings.slice(0, 5).map(w => w.message),
        };
      }
    }

    return NextResponse.json<ReviewResponse>(review);

  } catch (error) {
    console.error('Creative review error:', error);
    
    return NextResponse.json<ReviewResponse>(
      {
        status: 'unknown',
        summary: 'AI review failed. Please try again.',
        suggestions: [],
      },
      { status: 500 }
    );
  }
}
