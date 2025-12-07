import { NextRequest, NextResponse } from 'next/server';

/**
 * Tesco Compliance Assistant Chatbot API
 * Answers questions about Tesco creative guidelines
 */

interface AssistantRequest {
  question: string;
}

interface AssistantResponse {
  answer: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: AssistantRequest = await request.json();
    const { question } = body;

    // Validate input
    if (!question || question.trim() === '') {
      return NextResponse.json(
        { error: 'Question is required' },
        { status: 400 }
      );
    }

    // Check for API key
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey.trim() === '') {
      console.error('GEMINI_API_KEY not set or empty');
      
      // Provide fallback answers for common questions
      const lowerQuestion = question.toLowerCase();
      
      if (lowerQuestion.includes('50%') || lowerQuestion.includes('price') || lowerQuestion.includes('discount')) {
        return NextResponse.json<AssistantResponse>({
          answer: `No, price callouts like "50% off" or discount percentages are not allowed in Tesco creatives.

**Rules:**
- No discount percentages (%, "% off")
- No "best price", "lowest price", "cheapest"
- No specific price amounts in headlines

**✅ DO:** "Fresh Quality Products", "Great Value"
**❌ DON'T:** "50% off", "Best price ever", "£5 deal"

Focus on quality, freshness, and value without specific pricing.`,
        });
      }
      
      if (lowerQuestion.includes('safe zone')) {
        return NextResponse.json<AssistantResponse>({
          answer: `Safe zones are areas where text and logos should not appear:

**For 1080x1920 (Vertical/Story):**
- Top 200px: Reserved for platform UI
- Bottom 250px: Reserved for platform UI

**For 1080x1080 (Square):**
- Top 80px: Reserved for platform UI
- Bottom 80px: Reserved for platform UI

Keep your headline and important content within the safe area between these zones.`,
        });
      }
      
      if (lowerQuestion.includes('packshot') || lowerQuestion.includes('image')) {
        return NextResponse.json<AssistantResponse>({
          answer: `**Maximum of 3 product packshots** per creative.

This ensures:
- Clean, uncluttered design
- Focus on key products
- Professional appearance
- Compliance with Tesco guidelines

If you need to show more products, consider creating multiple creative variations.`,
        });
      }
      
      return NextResponse.json<AssistantResponse>({
        answer: `I can help with Tesco creative guidelines! Try asking about:

- Price callouts and discounts
- Safe zone rules
- Packshot limits
- Font size requirements
- Forbidden text patterns
- Alcohol compliance

What would you like to know?`,
      });
    }

    // Build the prompt
    const prompt = `You are a helpful assistant specializing in Tesco Retail Media creative guidelines.

IMPORTANT: You are advising based on a prototype ruleset, not official legal policy.

PROTOTYPE RULES YOU MUST FOLLOW:
- No prices or discount percentages in creative text.
- Do not allow "best price", "discount", "deal of the day".
- Avoid claims like "eco-friendly", "sustainable", "greenest", etc.
- Maximum of 3 product packshots.
- Minimum headline font size is 16px (20px recommended for social).
- Safe zones:
  - For 1080x1920 (vertical/story), no text in the top 200px and bottom 250px.
  - For 1080x1080 (square), no text in the top 80px and bottom 80px.
- For Alcohol category, include a Drinkaware lock-up or disclaimer.
- Ensure good contrast between headline text and background (WCAG AA: 4.5:1 ratio).
- Respect brand consistency (Tesco blue #00539F, clean layout, professional tone).
- No T&Cs, competitions, charity partnerships, or money-back guarantees.
- No superlatives without proof ("best", "perfect", "#1").
- Maximum 60 characters for headlines.

User Question:
${question}

TASK:
- Answer the question clearly and politely.
- Explain which rules are relevant.
- Provide DOs and DON'Ts.
- Use simple formatting:
  - Short intro sentence.
  - Bullet points for rules (use "- " prefix).
  - Example of compliant vs non-compliant text where helpful.
- Never suggest including prices, % off, or strong claims.
- Keep your answer concise (under 300 words).

Format your response with clear sections and bullet points for readability.`;

    // Call Gemini API
    console.log('Calling Gemini API for compliance assistant...');
    
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
            temperature: 0.5,
            maxOutputTokens: 600,
          }
        }),
      }
    );

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error('Gemini API error:', geminiResponse.status, errorText);
      
      // Provide helpful fallback
      return NextResponse.json<AssistantResponse>({
        answer: `I'm having trouble connecting to the AI service right now. Here are some key Tesco guidelines:

**Forbidden Text:**
- No price callouts (%, "off", discounts)
- No superlatives ("best", "perfect")
- No eco claims without proof

**Layout Rules:**
- Maximum 3 packshots
- Minimum 20px font size
- Respect safe zones (200px top, 250px bottom for vertical)

**Need specific help?** Try rephrasing your question or check the compliance panel for real-time validation.`,
      });
    }

    const data = await geminiResponse.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!generatedText) {
      throw new Error('No text generated from Gemini');
    }

    return NextResponse.json<AssistantResponse>({
      answer: generatedText.trim(),
    });

  } catch (error) {
    console.error('Compliance assistant error:', error);
    
    return NextResponse.json<AssistantResponse>(
      {
        answer: 'Sorry, I encountered an error processing your question. Please try again.',
      },
      { status: 500 }
    );
  }
}
