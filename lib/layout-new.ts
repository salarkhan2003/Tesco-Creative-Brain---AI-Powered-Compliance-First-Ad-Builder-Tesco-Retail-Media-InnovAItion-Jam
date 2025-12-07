// Enhanced layout engine with WYSIWYG positioning
// All coordinates are in logical canvas pixels (1080x1080 or 1080x1920)

import { CreativeLayout, LayoutElement, PackshotImage, TextStyle } from './types';

/**
 * Calculate layout for 1080x1080 square format
 */
export function calculateSquareLayout(
  packshots: PackshotImage[],
  headline: string,
  textStyle: TextStyle
): CreativeLayout {
  const width = 1080;
  const height = 1080;
  const elements: LayoutElement[] = [];
  
  // Background (full canvas)
  elements.push({
    type: 'background',
    position: { x: 0, y: 0, width, height },
  });
  
  // Packshots with user-controlled positioning
  packshots.forEach((packshot) => {
    // Calculate actual position from percentage
    const baseSize = 500; // Base size for packshots
    const scaledSize = baseSize * packshot.scale;
    
    // Convert percentage position to pixels
    const x = (packshot.x / 100) * width - scaledSize / 2;
    const y = (packshot.y / 100) * height - scaledSize / 2;
    
    elements.push({
      type: 'packshot',
      position: {
        x,
        y,
        width: scaledSize,
        height: scaledSize,
      },
      imageUrl: packshot.dataUrl,
    });
  });
  
  // Headline with user-controlled positioning
  const headlineY = calculateHeadlineY(height, textStyle.verticalOffset);
  const headlineX = calculateHeadlineX(width, textStyle.textAlign);
  const maxWidth = width - 120; // Padding from edges
  
  elements.push({
    type: 'headline',
    position: {
      x: headlineX,
      y: headlineY,
      width: maxWidth,
      height: textStyle.fontSize * 3, // Approximate height for multi-line
    },
    content: headline,
  });
  
  // Value tile - bottom right
  elements.push({
    type: 'valueTile',
    position: {
      x: width - 180,
      y: height - 180,
      width: 140,
      height: 140,
    },
    content: 'VALUE',
  });
  
  return { width, height, elements };
}

/**
 * Calculate layout for 1080x1920 vertical/story format
 */
export function calculateVerticalLayout(
  packshots: PackshotImage[],
  headline: string,
  textStyle: TextStyle
): CreativeLayout {
  const width = 1080;
  const height = 1920;
  const elements: LayoutElement[] = [];
  
  // Background (full canvas)
  elements.push({
    type: 'background',
    position: { x: 0, y: 0, width, height },
  });
  
  // Packshots with user-controlled positioning
  packshots.forEach((packshot) => {
    // Calculate actual position from percentage
    const baseSize = 600; // Larger base size for vertical format
    const scaledSize = baseSize * packshot.scale;
    
    // Convert percentage position to pixels
    const x = (packshot.x / 100) * width - scaledSize / 2;
    const y = (packshot.y / 100) * height - scaledSize / 2;
    
    elements.push({
      type: 'packshot',
      position: {
        x,
        y,
        width: scaledSize,
        height: scaledSize,
      },
      imageUrl: packshot.dataUrl,
    });
  });
  
  // Headline with user-controlled positioning
  const headlineY = calculateHeadlineY(height, textStyle.verticalOffset);
  const headlineX = calculateHeadlineX(width, textStyle.textAlign);
  const maxWidth = width - 120;
  
  elements.push({
    type: 'headline',
    position: {
      x: headlineX,
      y: headlineY,
      width: maxWidth,
      height: textStyle.fontSize * 3,
    },
    content: headline,
  });
  
  // Value tile - bottom center, above safe zone
  elements.push({
    type: 'valueTile',
    position: {
      x: (width - 160) / 2,
      y: height - 400,
      width: 160,
      height: 160,
    },
    content: 'VALUE',
  });
  
  return { width, height, elements };
}

/**
 * Calculate headline Y position based on vertical offset
 * @param canvasHeight - Height of the canvas
 * @param verticalOffset - Offset from -100 (top) to 100 (bottom)
 */
function calculateHeadlineY(canvasHeight: number, verticalOffset: number): number {
  // Map -100 to 100 range to actual Y position
  // -100 = near top (200px), 0 = center, 100 = near bottom (height - 300px)
  const minY = 200;
  const maxY = canvasHeight - 300;
  const centerY = canvasHeight / 2 - 50;
  
  if (verticalOffset < 0) {
    // Between top and center
    return centerY + (verticalOffset / 100) * (centerY - minY);
  } else {
    // Between center and bottom
    return centerY + (verticalOffset / 100) * (maxY - centerY);
  }
}

/**
 * Calculate headline X position based on text alignment
 */
function calculateHeadlineX(canvasWidth: number, textAlign: 'left' | 'center' | 'right'): number {
  const padding = 60;
  
  switch (textAlign) {
    case 'left':
      return padding;
    case 'right':
      return canvasWidth - padding;
    case 'center':
    default:
      return padding;
  }
}

/**
 * Generate layout based on ad size
 */
export function generateLayout(
  adSize: '1080x1080' | '1080x1920',
  packshots: PackshotImage[],
  headline: string,
  textStyle: TextStyle
): CreativeLayout {
  if (adSize === '1080x1080') {
    return calculateSquareLayout(packshots, headline, textStyle);
  } else {
    return calculateVerticalLayout(packshots, headline, textStyle);
  }
}
