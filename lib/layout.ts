// Layout engine for WYSIWYG creative element positioning
// Calculates exact positions for packshots, text, and value tiles

import { CreativeLayout, LayoutElement, PackshotImage, TextStyle } from './types';

/**
 * Helper to create packshot element with transformations
 */
function createPackshotElement(
  packshot: PackshotImage,
  x: number,
  y: number,
  width: number,
  height: number
): LayoutElement {
  return {
    type: 'packshot',
    position: { x, y, width, height },
    imageUrl: packshot.dataUrl,
    scale: packshot.scale,
    rotation: packshot.rotation,
  };
}

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
      elements.push(createPackshotElement(
        packshots[0],
        (width - packshotSize) / 2,
        packshotY,
        packshotSize,
        packshotSize
      ));
    } else if (packshots.length === 2) {
      // Two packshots - side by side with overlap
      const spacing = 200;
      elements.push(createPackshotElement(
        packshots[0],
        width / 2 - packshotSize - spacing / 2,
        packshotY,
        packshotSize,
        packshotSize
      ));
      elements.push(createPackshotElement(
        packshots[1],
        width / 2 + spacing / 2,
        packshotY,
        packshotSize,
        packshotSize
      ));
    } else {
      // Three packshots - overlapping arrangement
      const smallSize = 320;
      elements.push(createPackshotElement(
        packshots[0],
        width / 2 - packshotSize / 2,
        packshotY - 50,
        packshotSize,
        packshotSize
      ));
      elements.push(createPackshotElement(
        packshots[1],
        100,
        packshotY + 100,
        smallSize,
        smallSize
      ));
      elements.push(createPackshotElement(
        packshots[2],
        width - 100 - smallSize,
        packshotY + 100,
        smallSize,
        smallSize
      ));
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
      elements.push(createPackshotElement(
        packshots[0],
        (width - packshotSize) / 2,
        packshotY,
        packshotSize,
        packshotSize
      ));
    } else if (packshots.length === 2) {
      // Two packshots - stacked vertically
      const smallSize = 450;
      elements.push(createPackshotElement(
        packshots[0],
        (width - smallSize) / 2,
        650,
        smallSize,
        smallSize
      ));
      elements.push(createPackshotElement(
        packshots[1],
        (width - smallSize) / 2,
        1150,
        smallSize,
        smallSize
      ));
    } else {
      // Three packshots - creative arrangement
      const mainSize = 450;
      const smallSize = 350;
      elements.push(createPackshotElement(
        packshots[0],
        (width - mainSize) / 2,
        600,
        mainSize,
        mainSize
      ));
      elements.push(createPackshotElement(
        packshots[1],
        80,
        1100,
        smallSize,
        smallSize
      ));
      elements.push(createPackshotElement(
        packshots[2],
        width - 80 - smallSize,
        1100,
        smallSize,
        smallSize
      ));
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
  fontSizeOrTextStyle: number | TextStyle,
  layoutMode: 'auto' | 'manual' = 'auto'
): CreativeLayout {
  // For manual mode, use packshot positions if available
  if (layoutMode === 'manual') {
    // Use custom positions from packshots if they have them
    const layout = adSize === '1080x1080' 
      ? calculateSquareLayout(packshots, headline, fontSizeOrTextStyle)
      : calculateVerticalLayout(packshots, headline, fontSizeOrTextStyle);
    
    // Apply manual positioning if packshots have x/y coordinates
    layout.elements = layout.elements.map(element => {
      if (element.type === 'packshot' && element.imageUrl) {
        const packshot = packshots.find(p => p.dataUrl === element.imageUrl);
        if (packshot && packshot.x !== undefined && packshot.y !== undefined) {
          // Convert percentage to pixels
          const x = (packshot.x / 100) * layout.width - element.position.width / 2;
          const y = (packshot.y / 100) * layout.height - element.position.height / 2;
          return {
            ...element,
            position: {
              ...element.position,
              x: Math.max(0, Math.min(x, layout.width - element.position.width)),
              y: Math.max(0, Math.min(y, layout.height - element.position.height)),
            }
          };
        }
      }
      return element;
    });
    
    return layout;
  }
  
  // Auto mode - use default layouts
  if (adSize === '1080x1080') {
    return calculateSquareLayout(packshots, headline, fontSizeOrTextStyle);
  } else {
    return calculateVerticalLayout(packshots, headline, fontSizeOrTextStyle);
  }
}
