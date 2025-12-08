/**
 * Gemini AI Client for Tesco Creative Brain
 *
 * This module provides a robust integration with Google's Gemini AI API
 * for headline generation, compliance assistance, and creative review.
 */

import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

// API Key - fallback if env variable not loaded
const FALLBACK_API_KEY = 'AIzaSyBDuL3pUkmBQLocbb86StvZ4Ao72dhFPk8';

// Initialize the Gemini client
let genAI: GoogleGenerativeAI | null = null;

export function getGeminiClient(): GoogleGenerativeAI | null {
  // Try env variable first, then fallback
  let apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === 'your_gemini_api_key_here' || apiKey.trim() === '' || apiKey.includes('filepath')) {
    console.log('Using fallback API key');
    apiKey = FALLBACK_API_KEY;
  }

  console.log('GEMINI_API_KEY:', apiKey ? `Using key (${apiKey.substring(0, 15)}...)` : 'NOT FOUND');

  if (!genAI) {
    console.log('Creating new GoogleGenerativeAI client');
    genAI = new GoogleGenerativeAI(apiKey);
  }

  return genAI;
}

// Safety settings for Gemini
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

// Tesco compliance rules context
export const TESCO_COMPLIANCE_CONTEXT = `
You are an expert AI assistant for Tesco Retail Media creative guidelines.

TESCO COMPLIANCE RULES:
1. NO prices, discount percentages, or "% off" in creative text
2. NO "best price", "lowest price", "cheapest", "deal of the day"
3. NO eco claims like "eco-friendly", "sustainable", "greenest" (unless officially certified)
4. NO "money-back guarantee" or specific claims
5. NO superlatives without proof ("best", "greatest", "perfect", "#1")
6. Maximum 60 characters for headlines
7. Maximum 3 product packshots per creative
8. Minimum font size is 16px (20px recommended for social)
9. Safe zones:
   - Vertical (1080x1920): No text in top 200px and bottom 250px
   - Square (1080x1080): No text in top 80px and bottom 80px
10. For Alcohol category, Drinkaware lock-up is required
11. Good contrast required (WCAG AA: 4.5:1 ratio)
12. Professional tone, Tesco brand colors (blue #00539F)
13. No T&Cs, competitions, charity partnerships in ad creative

APPROVED MESSAGING THEMES:
- Quality and freshness
- Value (without specific pricing)
- Convenience
- Product features and benefits
- Seasonal relevance
`;

/**
 * Generate AI response using Gemini
 */
export async function generateAIResponse(
  prompt: string,
  options?: {
    temperature?: number;
    maxOutputTokens?: number;
    model?: string;
  }
): Promise<string | null> {
  const client = getGeminiClient();

  if (!client) {
    console.log('No Gemini client available - returning null');
    return null;
  }

  try {
    // Try gemini-1.5-flash first, then fallback to other models
    const modelName = options?.model || 'gemini-1.5-flash';
    console.log('Using Gemini model:', modelName);

    const model = client.getGenerativeModel({
      model: modelName,
      generationConfig: {
        temperature: options?.temperature ?? 0.7,
        maxOutputTokens: options?.maxOutputTokens ?? 1024,
      },
    });

    console.log('Sending request to Gemini API...');
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    console.log('Gemini API response received, length:', text?.length || 0);

    return text;
  } catch (error: unknown) {
    console.error('Gemini API error:', error);
    // If model not found, try alternative models in sequence
    const alternativeModels = ['gemini-pro', 'gemini-1.0-pro', 'models/gemini-pro'];

    for (const altModelName of alternativeModels) {
      try {
        console.log('Trying alternative model:', altModelName);
        const altModel = client.getGenerativeModel({
          model: altModelName,
        });
        const result = await altModel.generateContent(prompt);
        console.log('Alternative model succeeded:', altModelName);
        return result.response.text();
      } catch (altError) {
        console.error(`Model ${altModelName} failed:`, altError);
      }
    }
    return null;
  }
}

/**
 * Generate Tesco-compliant headlines
 */
export async function generateHeadlines(
  productName: string,
  description: string,
  tone?: string,
  currentHeadline?: string
): Promise<string[]> {
  const prompt = currentHeadline
    ? `${TESCO_COMPLIANCE_CONTEXT}

TASK: Rewrite this headline to be Tesco-compliant and provide 3 alternatives.

Current headline: "${currentHeadline}"
Product: ${productName}
Description: ${description}
${tone ? `Tone: ${tone}` : ''}

Return ONLY a valid JSON array of exactly 3 headline strings.
Example: ["Headline 1", "Headline 2", "Headline 3"]`
    : `${TESCO_COMPLIANCE_CONTEXT}

TASK: Generate 3 compelling, Tesco-compliant ad headlines.

Product: ${productName}
Description: ${description}
${tone ? `Tone: ${tone}` : ''}

Return ONLY a valid JSON array of exactly 3 headline strings.
Example: ["Headline 1", "Headline 2", "Headline 3"]`;

  const response = await generateAIResponse(prompt, {
    temperature: 0.7,
    maxOutputTokens: 200,
  });

  if (!response) {
    return getDefaultHeadlines(productName);
  }

  try {
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const headlines = JSON.parse(jsonMatch[0]);
      if (Array.isArray(headlines) && headlines.length >= 3) {
        return headlines.slice(0, 3);
      }
    }
  } catch (e) {
    console.error('Failed to parse headlines:', e);
  }

  return getDefaultHeadlines(productName);
}

/**
 * Get compliance assistant response
 */
export async function getComplianceAssistantResponse(question: string): Promise<string> {
  const prompt = `${TESCO_COMPLIANCE_CONTEXT}

User Question: ${question}

TASK:
- Answer clearly and politely
- Explain which rules are relevant
- Provide DOs and DON'Ts with examples
- Keep response under 300 words
- Use bullet points for clarity

Format response with clear sections.`;

  const response = await generateAIResponse(prompt, {
    temperature: 0.5,
    maxOutputTokens: 600,
  });

  if (!response) {
    return getFallbackComplianceResponse(question);
  }

  return response;
}

/**
 * Get creative review
 */
export async function getCreativeReview(data: {
  headline: string;
  category?: string;
  warnings: Array<{ message: string; severity: string }>;
  layoutSummary: {
    format: string;
    numPackshots: number;
    hasSafeZoneViolations: boolean;
    hasAlcoholCategory: boolean;
    contrastIssue: boolean;
  };
}): Promise<{ status: string; summary: string; suggestions: string[] }> {
  const prompt = `${TESCO_COMPLIANCE_CONTEXT}

CREATIVE DETAILS:
- Headline: "${data.headline}"
- Category: ${data.category || 'Not specified'}
- Compliance warnings: ${data.warnings.length > 0 ? data.warnings.map(w => w.message).join(', ') : 'None'}
- Format: ${data.layoutSummary.format}
- Packshots: ${data.layoutSummary.numPackshots}
- Safe zone issues: ${data.layoutSummary.hasSafeZoneViolations ? 'Yes' : 'No'}
- Alcohol category: ${data.layoutSummary.hasAlcoholCategory ? 'Yes' : 'No'}
- Contrast issues: ${data.layoutSummary.contrastIssue ? 'Yes' : 'No'}

TASK: Review and respond with ONLY valid JSON:
{
  "status": "ready" or "not_ready",
  "summary": "Brief assessment",
  "suggestions": ["suggestion 1", "suggestion 2"]
}`;

  const response = await generateAIResponse(prompt, {
    temperature: 0.3,
    maxOutputTokens: 500,
  });

  if (!response) {
    return getFallbackReview(data);
  }

  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (e) {
    console.error('Failed to parse review:', e);
  }

  return getFallbackReview(data);
}

/**
 * Analyze packshot image
 */
export async function analyzePackshot(imageBase64: string): Promise<{
  productType: string;
  suggestedCategory: string;
  qualityScore: number;
  suggestions: string[];
}> {
  const client = getGeminiClient();

  if (!client) {
    return {
      productType: 'Product',
      suggestedCategory: 'General',
      qualityScore: 75,
      suggestions: ['Image uploaded successfully', 'Consider removing background for better presentation'],
    };
  }

  try {
    // Try models that support vision/multimodal input
    const visionModels = ['gemini-1.5-flash', 'gemini-pro-vision', 'gemini-1.5-pro'];

    // Remove data URL prefix if present
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');

    for (const modelName of visionModels) {
      try {
        console.log('Trying vision model:', modelName);
        const model = client.getGenerativeModel({ model: modelName });

        const result = await model.generateContent([
          {
            inlineData: {
              mimeType: 'image/png',
              data: base64Data,
            },
          },
          `Analyze this product packshot image for Tesco Retail Media.

Provide a JSON response with:
{
  "productType": "type of product shown",
  "suggestedCategory": "Food/Beverage/Alcohol/Health & Beauty/Household/Other",
  "qualityScore": 1-100 rating of image quality for advertising,
  "suggestions": ["improvement suggestion 1", "improvement suggestion 2"]
}

Consider:
- Image clarity and resolution
- Background cleanliness
- Product visibility
- Professional presentation
- Suitability for advertising

Return ONLY valid JSON.`,
        ]);

        const response = result.response.text();
        const jsonMatch = response.match(/\{[\s\S]*\}/);

        if (jsonMatch) {
          console.log('Vision analysis succeeded with model:', modelName);
          return JSON.parse(jsonMatch[0]);
        }
      } catch (modelError) {
        console.error(`Vision model ${modelName} failed:`, modelError);
      }
    }
  } catch (error) {
    console.error('Packshot analysis error:', error);
  }

  return {
    productType: 'Product',
    suggestedCategory: 'General',
    qualityScore: 75,
    suggestions: ['Image uploaded successfully'],
  };
}

// Fallback functions
function getDefaultHeadlines(productName: string): string[] {
  return [
    `Fresh Quality ${productName || 'Products'}`,
    'Great Value Every Day',
    'Shop Smart with Tesco',
  ];
}

function getFallbackComplianceResponse(question: string): string {
  const lowerQuestion = question.toLowerCase();

  if (lowerQuestion.includes('50%') || lowerQuestion.includes('price') || lowerQuestion.includes('discount')) {
    return `**No, price callouts are not allowed.**

**Rules:**
- No discount percentages (%, "% off")
- No "best price", "lowest price", "cheapest"
- No specific price amounts

**✅ DO:** "Fresh Quality Products", "Great Value"
**❌ DON'T:** "50% off", "Best price ever", "£5 deal"`;
  }

  if (lowerQuestion.includes('safe zone')) {
    return `**Safe Zone Rules:**

**Vertical (1080x1920):**
- Top 200px: No text
- Bottom 250px: No text

**Square (1080x1080):**
- Top 80px: No text
- Bottom 80px: No text

Keep important content within these boundaries.`;
  }

  if (lowerQuestion.includes('packshot') || lowerQuestion.includes('image')) {
    return `**Maximum 3 packshots per creative.**

This ensures:
- Clean, uncluttered design
- Focus on key products
- Professional appearance
- Compliance with guidelines`;
  }

  return `I can help with Tesco creative guidelines! Ask about:
- Price callouts and discounts
- Safe zone rules
- Packshot limits
- Font size requirements
- Forbidden text patterns
- Alcohol compliance`;
}

function getFallbackReview(data: { warnings: Array<{ message: string }>; layoutSummary: { numPackshots: number } }): { status: string; summary: string; suggestions: string[] } {
  if (data.layoutSummary.numPackshots === 0) {
    return {
      status: 'not_ready',
      summary: 'Please upload at least one packshot image.',
      suggestions: ['Upload 1-3 product images', 'Packshots are required for Tesco creatives'],
    };
  }

  if (data.warnings.length === 0) {
    return {
      status: 'ready',
      summary: 'Your creative appears compliant with Tesco guidelines.',
      suggestions: [],
    };
  }

  return {
    status: 'not_ready',
    summary: `Found ${data.warnings.length} compliance issue(s).`,
    suggestions: data.warnings.slice(0, 5).map(w => w.message),
  };
}

