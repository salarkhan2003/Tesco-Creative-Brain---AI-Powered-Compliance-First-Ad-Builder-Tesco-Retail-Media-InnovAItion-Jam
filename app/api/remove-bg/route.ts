import { NextRequest, NextResponse } from 'next/server';

/**
 * Background removal API endpoint
 * 
 * This endpoint proxies to remove.bg or provides a mock fallback.
 * Set REMOVE_BG_API_KEY environment variable to enable real background removal.
 */
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

    // Check for API key
    const apiKey = process.env.REMOVE_BG_API_KEY;

    if (!apiKey) {
      // Mock mode: return original image with a note
      console.log('REMOVE_BG_API_KEY not set. Returning original image (mock mode).');
      
      const buffer = await imageFile.arrayBuffer();
      const base64 = Buffer.from(buffer).toString('base64');
      const dataUrl = `data:${imageFile.type};base64,${base64}`;

      return NextResponse.json({
        imageUrl: dataUrl,
        mock: true,
        message: 'Background removal is in mock mode. Set REMOVE_BG_API_KEY to enable real removal.',
      });
    }

    // Real mode: call remove.bg API with retry logic
    console.log('Calling remove.bg API with key:', apiKey.substring(0, 10) + '...');
    
    // Convert File to Buffer for remove.bg
    const imageBuffer = await imageFile.arrayBuffer();
    const imageBlob = new Blob([imageBuffer], { type: imageFile.type });
    
    const removeBgFormData = new FormData();
    removeBgFormData.append('image_file', imageBlob, imageFile.name);
    removeBgFormData.append('size', 'auto');

    let response;
    let lastError;
    
    // Retry up to 3 times
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        console.log(`remove.bg API attempt ${attempt}/3...`);
        
        response = await fetch('https://api.remove.bg/v1.0/removebg', {
          method: 'POST',
          headers: {
            'X-Api-Key': apiKey,
          },
          body: removeBgFormData,
        });
        
        console.log('remove.bg response status:', response.status);
        
        if (response.ok) {
          break; // Success, exit retry loop
        }
        
        lastError = await response.text();
        
        // Don't retry on client errors (400-499)
        if (response.status >= 400 && response.status < 500) {
          break;
        }
        
        // Wait before retry (exponential backoff)
        if (attempt < 3) {
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
      } catch (err) {
        lastError = err instanceof Error ? err.message : 'Network error';
        console.error(`Attempt ${attempt} failed:`, lastError);
        
        if (attempt < 3) {
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
      }
    }

    if (!response || !response.ok) {
      const errorText = lastError || 'Unknown error';
      console.error('remove.bg API error:', response?.status, errorText);
      
      // If API fails, return original image with error message
      const buffer = await imageFile.arrayBuffer();
      const base64 = Buffer.from(buffer).toString('base64');
      const dataUrl = `data:${imageFile.type};base64,${base64}`;
      
      return NextResponse.json({
        imageUrl: dataUrl,
        mock: true,
        error: `Background removal failed: ${errorText}`,
        message: 'Returning original image. Check API key and credits.',
      });
    }

    // Convert response to base64 data URL
    const resultBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(resultBuffer).toString('base64');
    const dataUrl = `data:image/png;base64,${base64}`;

    console.log('Background removal successful!');

    return NextResponse.json({
      imageUrl: dataUrl,
      mock: false,
      message: 'Background removed successfully!',
    });

  } catch (error) {
    console.error('Background removal error:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
