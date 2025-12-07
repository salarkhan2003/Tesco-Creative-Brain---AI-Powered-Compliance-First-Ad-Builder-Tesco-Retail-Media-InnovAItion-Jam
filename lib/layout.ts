// Layout engine for WYSIWYG creative element positioning
// Calculates exact positions for packshots, text, and value tiles

import { CreativeLayout, LayoutElement, PackshotImage, TextStyle } from './types';

/**
 * Calculate layout for 1080x1080 square format
 * Supports both old (fontSize) and new (textStyle) API for backward compatibility
 */
export function calculateSquareLayout(
  packshots: PackshotImage[],
  headline: string,
  fontSizeOrTextStyle: number | TextStyle
): CreativeLayout {
  const width = 1080;
  const height = 1080;
  const elements: LayoutElement[] = [];
  
  // Extract fontSize from either number or TextStyle
  const fontSize = typeof fontSizeOrTextStyle === 'number' 
    ? fontSizeOrTextStyle 
    : fontSizeOrTextStyle.fontSize;
  
  // Background (full canvas)
  elements.push({
    type: 'background',
    position: { x: 0, y: 0, width, height },
  });
  
  // Headline - top area, centered
  const headlineHeight = fontSize * 2.5; // Approximate height with padding
  elements.push({
    type: 'headline',
    position: {
      x: 60,
      y: 120,
      width: width - 120,
      height: headlineHeight,
    },
    content: headline,
  });
  
  // Packshots - lower-middle area
  if (packshots.length > 0) {
    const packshotSize = 600; // Increased from 400 to 600
    const packshotY = 350; // Moved up from 450
    
    if (packshots.length === 1) {
      // Single packshot - centered
      elements.push({
        type: 'packshot',
        position: {
          x: (width - packshotSize) / 2,
          y: packshotY,
          width: packshotSize,
          height: packshotSize,
        },
        imageUrl: packshots[0].dataUrl,
      });
    } else if (packshots.length === 2) {
      // Two packshots - side by side with overlap
      const spacing = 200;
      elements.push({
        type: 'packshot',
        position: {
          x: width / 2 - packshotSize - spacing / 2,
          y: packshotY,
          width: packshotSize,
          height: packshotSize,
        },
        imageUrl: packshots[0].dataUrl,
      });
      elements.push({
        type: 'packshot',
        position: {
          x: width / 2 + spacing / 2,
          y: packshotY,
          width: packshotSize,
          height: packshotSize,
        },
        imageUrl: packshots[1].dataUrl,
      });
    } else {
      // Three packshots - overlapping arrangement
      const smallSize = 320;
      elements.push({
        type: 'packshot',
        position: {
          x: width / 2 - packshotSize / 2,
          y: packshotY - 50,
          width: packshotSize,
          height: packshotSize,
        },
        imageUrl: packshots[0].dataUrl,
      });
      elements.push({
        type: 'packshot',
        position: {
          x: 100,
          y: packshotY + 100,
          width: smallSize,
          height: smallSize,
        },
        imageUrl: packshots[1].dataUrl,
      });
      elements.push({
        type: 'packshot',
        position: {
          x: width - 100 - smallSize,
          y: packshotY + 100,
          width: smallSize,
          height: smallSize,
        },
        imageUrl: packshots[2].dataUrl,
      });
    }
  }
  
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
 * Supports both old (fontSize) and new (textStyle) API for backward compatibility
 */
export function calculateVerticalLayout(
  packshots: PackshotImage[],
  headline: string,
  fontSizeOrTextStyle: number | TextStyle
): CreativeLayout {
  // Extract fontSize from either number or TextStyle
  const fontSize = typeof fontSizeOrTextStyle === 'number' 
    ? fontSizeOrTextStyle 
    : fontSizeOrTextStyle.fontSize;
  const width = 1080;
  const height = 1920;
  const elements: LayoutElement[] = [];
  
  // Background (full canvas)
  elements.push({
    type: 'background',
    position: { x: 0, y: 0, width, height },
  });
  
  // Headline - upper area, below safe zone (200px)
  const headlineHeight = fontSize * 2.5;
  elements.push({
    type: 'headline',
    position: {
      x: 60,
      y: 250, // Below 200px safe zone
      width: width - 120,
      height: headlineHeight,
    },
    content: headline,
  });
  
  // Packshots - middle area
  if (packshots.length > 0) {
    const packshotSize = 700; // Increased from 500 to 700
    const packshotY = 600; // Moved up from 700
    
    if (packshots.length === 1) {
      // Single packshot - centered
      elements.push({
        type: 'packshot',
        position: {
          x: (width - packshotSize) / 2,
          y: packshotY,
          width: packshotSize,
          height: packshotSize,
        },
        imageUrl: packshots[0].dataUrl,
      });
    } else if (packshots.length === 2) {
      // Two packshots - stacked vertically
      const smallSize = 450;
      elements.push({
        type: 'packshot',
        position: {
          x: (width - smallSize) / 2,
          y: 650,
          width: smallSize,
          height: smallSize,
        },
        imageUrl: packshots[0].dataUrl,
      });
      elements.push({
        type: 'packshot',
        position: {
          x: (width - smallSize) / 2,
          y: 1150,
          width: smallSize,
          height: smallSize,
        },
        imageUrl: packshots[1].dataUrl,
      });
    } else {
      // Three packshots - creative arrangement
      const mainSize = 450;
      const smallSize = 350;
      elements.push({
        type: 'packshot',
        position: {
          x: (width - mainSize) / 2,
          y: 600,
          width: mainSize,
          height: mainSize,
        },
        imageUrl: packshots[0].dataUrl,
      });
      elements.push({
        type: 'packshot',
        position: {
          x: 80,
          y: 1100,
          width: smallSize,
          height: smallSize,
        },
        imageUrl: packshots[1].dataUrl,
      });
      elements.push({
        type: 'packshot',
        position: {
          x: width - 80 - smallSize,
          y: 1100,
          width: smallSize,
          height: smallSize,
        },
        imageUrl: packshots[2].dataUrl,
      });
    }
  }
  
  // Value tile - bottom center, above safe zone (250px)
  elements.push({
    type: 'valueTile',
    position: {
      x: (width - 160) / 2,
      y: height - 400, // Above 250px safe zone
      width: 160,
      height: 160,
    },
    content: 'VALUE',
  });
  
  return { width, height, elements };
}

/**
 * Generate layout based on ad size
 * Supports both old (fontSize) and new (textStyle) API for backward compatibility
 */
export function generateLayout(
  adSize: '1080x1080' | '1080x1920',
  packshots: PackshotImage[],
  headline: string,
  fontSizeOrTextStyle: number | TextStyle
): CreativeLayout {
  if (adSize === '1080x1080') {
    return calculateSquareLayout(packshots, headline, fontSizeOrTextStyle);
  } else {
    return calculateVerticalLayout(packshots, headline, fontSizeOrTextStyle);
  }
}
