import { NextRequest, NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

function generate_tagline_prompt(productName: string, productCategory: string): string {
  return `
    Role: You are a professional, compliance-first Copywriter for Tesco Retail Media.
    
    Task: Write 3 catchy, engaging taglines for the following product.
    
    Product Details:
    - Name: "${productName}"
    - Category: "${productCategory}"
    
    Constraints:
    1. Length: STRICTLY between 5 and 20 words per tagline.
    2. Tone: Helpful, warm, human, and professional (Tesco Brand Voice).
    3. Compliance Rules (HARD FAIL):
       - NO "money-back guarantees".
       - NO unverified health claims.
       - NO price callouts (e.g., do not write "£5" or "50% off" in the tagline).
       - NO time-limited pressure (e.g., "Hurry", "Last chance").
    
    Output Format:
    Return ONLY a raw JSON list of strings. Do not include markdown formatting like \`\`\`json.
    Example: ["Tagline option 1", "Tagline option 2", "Tagline option 3"]
    `;
}

export async function POST(request: NextRequest) {
  try {
    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY is not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { productName, productCategory, currentTagline } = body;

    if (!productName || !productCategory) {
      return NextResponse.json(
        { error: 'Product name and category are required' },
        { status: 400 }
      );
    }

    let prompt = generate_tagline_prompt(productName, productCategory);

    // If rewriting an existing tagline
    if (currentTagline) {
      prompt += `\n\nPlease rewrite the following tagline while maintaining Tesco compliance:\nCurrent tagline: "${currentTagline}"`;
    }

    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': GEMINI_API_KEY,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
          },
          {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
          },
          {
            category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
          },
          {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API error:', errorData);
      return NextResponse.json(
        { 
          error: errorData.error?.message || 'Failed to generate taglines from Gemini API',
          taglines: []
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Extract the text content from Gemini response
    const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!textContent) {
      return NextResponse.json(
        { error: 'No content generated', taglines: [] },
        { status: 500 }
      );
    }

    // Parse the JSON array from the response
    let taglines: string[] = [];
    try {
      // Extract JSON array from the text (it might be surrounded by other text)
      const jsonMatch = textContent.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        taglines = JSON.parse(jsonMatch[0]);
        if (!Array.isArray(taglines)) {
          throw new Error('Parsed content is not an array');
        }
        // Ensure all items are strings
        taglines = taglines.map(item => String(item));
      } else {
        throw new Error('No JSON array found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse taglines:', parseError, 'Response:', textContent);
      return NextResponse.json(
        { 
          error: 'Failed to parse generated taglines. Please try again.',
          taglines: []
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ taglines });
  } catch (error) {
    console.error('Error in tagline generation:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'An error occurred while generating taglines',
        taglines: []
      },
      { status: 500 }
    );
  }
}
