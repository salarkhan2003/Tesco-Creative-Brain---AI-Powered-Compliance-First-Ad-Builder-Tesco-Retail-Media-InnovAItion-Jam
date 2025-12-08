import { NextRequest, NextResponse } from 'next/server';
import { getComplianceAssistantResponse } from '@/lib/gemini';

/**
 * Tesco Compliance Assistant Chatbot API
 * Uses Google Gemini AI for intelligent responses about Tesco creative guidelines
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

    console.log('Compliance Assistant - Processing question:', question.substring(0, 50) + '...');

    // Get AI response using the Gemini client
    const answer = await getComplianceAssistantResponse(question);

    return NextResponse.json<AssistantResponse>({
      answer,
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
