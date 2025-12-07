import { NextRequest, NextResponse } from 'next/server';

/**
 * Gemini AI integration for Tesco-compliant headline generation
 * 
 * This endpoint uses Google's Gemini 2.0 Flash model to generate
 * or rewrite ad headlines that comply with Tesco brand guidelines.
 * 
 * Environment variable required: GEMINI_API_KEY
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

    // Check for API key
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('GEMINI_API_KEY not set in environment variables');
      return NextResponse.json(
        { 
          error: 'Gemini API not configured',
          headlines: ['Fresh Quality Products', 'Great Value Every Day', 'Shop Smart with Tesco']
        },
        { status: 200 }
      );
    }

    // Build the prompt based on whether we're generating new or rewriting
    let prompt: string;
    if (currentHeadline) {
      prompt = `You are an expert ad copywriter for Tesco Retail Media. 

TASK: Rewrite the following headline to be Tesco-compliant and provide 3 alternative versions.

Current headline: "${currentHeadline}"
Product: ${productName}
Description: ${description}
${tone ? `Tone: ${tone}` : ''}

STRICT COMPLIANCE RULES:
- NO prices, discount percentages, or "% off"
- NO "best price", "lowest price", "cheapest"
- NO "eco-friendly", "sustainable", "green" (unless officially certified)
- NO "money-back guarantee" or specific claims
- NO superlatives without proof ("best", "greatest", "perfect")
- Keep under 60 characters
- Focus on quality, value, freshness, convenience
- Use positive, simple language

Return ONLY a valid JSON array of exactly 3 headline strings, nothing else.
Example format: ["Headline 1", "Headline 2", "Headline 3"]`;
    } else {
      prompt = `You are an expert ad copywriter for Tesco Retail Media.

TASK: Generate 3 compelling, Tesco-compliant ad headlines.

Product: ${productName}
Description: ${description}
${tone ? `Tone: ${tone}` : ''}

STRICT COMPLIANCE RULES:
- NO prices, discount percentages, or "% off"
- NO "best price", "lowest price", "cheapest"
- NO "eco-friendly", "sustainable", "green" (unless officially certified)
- NO "money-back guarantee" or specific claims
- NO superlatives without proof ("best", "greatest", "perfect")
- Keep under 60 characters
- Focus on quality, value, freshness, convenience
- Use positive, simple language

Return ONLY a valid JSON array of exactly 3 headline strings, nothing else.
Example format: ["Headline 1", "Headline 2", "Headline 3"]`;
    }

    // Call Gemini API
    console.log('Calling Gemini API for headline generation...');
    
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 200,
          }
        }),
      }
    );

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error('Gemini API error:', errorText);
      
      return NextResponse.json(
        { 
          error: 'Gemini API request failed',
          headlines: ['Fresh Quality Products', 'Great Value Every Day', 'Shop Smart with Tesco']
        },
        { status: 200 }
      );
    }

    const data = await geminiResponse.json();
    
    // Extract text from Gemini response
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!generatedText) {
      throw new Error('No text generated from Gemini');
    }

    // Parse the JSON array from the response
    let headlines: string[];
    try {
      // Try to extract JSON array from the text (using [\s\S] instead of 's' flag for compatibility)
      const jsonMatch = generatedText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        headlines = JSON.parse(jsonMatch[0]);
      } else {
        // Fallback: split by newlines and clean up
        headlines = generatedText
          .split('\n')
          .map((line: string) => line.trim().replace(/^["'\-\d.]\s*/, '').replace(/["']$/, ''))
          .filter((line: string) => line.length > 0 && line.length < 100)
          .slice(0, 3);
      }

      // Ensure we have at least 3 headlines
      if (headlines.length < 3) {
        headlines.push('Fresh Quality Products', 'Great Value Every Day', 'Shop Smart with Tesco');
        headlines = headlines.slice(0, 3);
      }

    } catch (parseError) {
      console.error('Failed to parse Gemini response:', parseError);
      headlines = ['Fresh Quality Products', 'Great Value Every Day', 'Shop Smart with Tesco'];
    }

    return NextResponse.json({
      headlines: headlines.slice(0, 3),
    });

  } catch (error) {
    console.error('Gemini headline generation error:', error);
    
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
