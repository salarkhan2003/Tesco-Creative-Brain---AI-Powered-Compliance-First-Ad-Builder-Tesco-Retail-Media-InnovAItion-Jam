/**
 * Smart Auto-Layout Engine
 * Automatically positions packshots following Tesco guidelines
 * Ensures professional, balanced compositions
 */

import { PackshotImage, AdSize, LayoutElement } from './types';
import { SAFE_ZONES, VALUE_TILE_POSITIONS } from './tesco-compliance-rules';

interface LayoutConfig {
  width: number;
  height: number;
  safeZoneTop: number;
  safeZoneBottom: number;
  valueTileArea: { x: number; y: number; width: number; height: number };
}

/**
 * Get layout configuration for ad size
 */
function getLayoutConfig(adSize: AdSize): LayoutConfig {
  const width = 1080;
  const height = adSize === '1080x1920' ? 1920 : 1080;
  const safeZones = SAFE_ZONES[adSize];
  const valueTile = VALUE_TILE_POSITIONS[adSize];
  
  return {
    width,
    height,
    safeZoneTop: safeZones.top,
    safeZoneBottom: safeZones.bottom,
    valueTileArea: valueTile,
  };
}

/**
 * Calculate optimal packshot positions for 1 image
 */
function layoutSinglePackshot(config: LayoutConfig): Array<{ x: number; y: number; size: number }> {
  const { width, height, safeZoneTop, safeZoneBottom } = config;
  
  // Large centered packshot
  const size = Math.min(width * 0.65, (height - safeZoneTop - safeZoneBottom) * 0.55);
  const x = (width - size) / 2;
  const y = safeZoneTop + (height - safeZoneTop - safeZoneBottom - size) * 0.55;
  
  return [{ x, y, size }];
}

/**
 * Calculate optimal packshot positions for 2 images
 */
function layoutTwoPackshots(config: LayoutConfig): Array<{ x: number; y: number; size: number }> {
  const { width, height, safeZoneTop, safeZoneBottom } = config;
  
  if (height > width) {
    // Vertical format: stack vertically with slight overlap
    const size = width * 0.5;
    const spacing = size * 0.85; // 15% overlap
    const totalHeight = size + spacing;
    const startY = safeZoneTop + (height - safeZoneTop - safeZoneBottom - totalHeight) * 0.5;
    
    return [
      { x: (width - size) / 2, y: startY, size },
      { x: (width - size) / 2, y: startY + spacing, size },
    ];
  } else {
    // Square format: side by side with slight overlap
    const size = width * 0.45;
    const spacing = size * 0.85; // 15% overlap
    const totalWidth = size + spacing;
    const startX = (width - totalWidth) / 2;
    const y = safeZoneTop + (height - safeZoneTop - safeZoneBottom - size) * 0.55;
    
    return [
      { x: startX, y, size },
      { x: startX + spacing, y, size },
    ];
  }
}

/**
 * Calculate optimal packshot positions for 3 images
 */
function layoutThreePackshots(config: LayoutConfig): Array<{ x: number; y: number; size: number }> {
  const { width, height, safeZoneTop, safeZoneBottom } = config;
  
  if (height > width) {
    // Vertical format: hero + 2 smaller below
    const heroSize = width * 0.55;
    const smallSize = width * 0.38;
    const heroY = safeZoneTop + (height - safeZoneTop - safeZoneBottom) * 0.25;
    const smallY = heroY + heroSize * 0.7; // Overlap with hero
    const spacing = (width - smallSize * 2) / 3;
    
    return [
      { x: (width - heroSize) / 2, y: heroY, size: heroSize }, // Hero center
      { x: spacing, y: smallY, size: smallSize }, // Left
      { x: width - spacing - smallSize, y: smallY, size: smallSize }, // Right
    ];
  } else {
    // Square format: hero center + 2 smaller on sides
    const heroSize = width * 0.5;
    const smallSize = width * 0.32;
    const heroY = safeZoneTop + (height - safeZoneTop - safeZoneBottom - heroSize) * 0.5;
    const smallY = heroY + (heroSize - smallSize) * 0.5; // Vertically centered with hero
    
    return [
      { x: (width - heroSize) / 2, y: heroY, size: heroSize }, // Hero center
      { x: 60, y: smallY, size: smallSize }, // Left
      { x: width - 60 - smallSize, y: smallY, size: smallSize }, // Right
    ];
  }
}

/**
 * Generate smart auto-layout for packshots
 */
export function generateSmartLayout(
  adSize: AdSize,
  packshots: PackshotImage[]
): Array<LayoutElement> {
  const config = getLayoutConfig(adSize);
  const elements: LayoutElement[] = [];
  
  if (packshots.length === 0) {
    return elements;
  }
  
  // Get optimal positions based on count
  let positions: Array<{ x: number; y: number; size: number }>;
  
  switch (packshots.length) {
    case 1:
      positions = layoutSinglePackshot(config);
      break;
    case 2:
      positions = layoutTwoPackshots(config);
      break;
    case 3:
      positions = layoutThreePackshots(config);
      break;
    default:
      // Fallback for more than 3 (shouldn't happen due to validation)
      positions = layoutThreePackshots(config).slice(0, packshots.length);
  }
  
  // Create layout elements with packshot transformations
  packshots.forEach((packshot, index) => {
    if (index < positions.length) {
      const pos = positions[index];
      elements.push({
        type: 'packshot',
        position: {
          x: pos.x,
          y: pos.y,
          width: pos.size,
          height: pos.size,
        },
        imageUrl: packshot.dataUrl,
        scale: packshot.scale || 1.0,
        rotation: packshot.rotation || 0,
      });
    }
  });
  
  return elements;
}

/**
 * Calculate headline position that avoids packshots
 */
export function calculateHeadlinePosition(
  adSize: AdSize,
  fontSize: number,
  packshotElements: LayoutElement[]
): { x: number; y: number; width: number; height: number } {
  const config = getLayoutConfig(adSize);
  const { width, safeZoneTop } = config;
  
  // Find the highest packshot
  const highestPackshotY = packshotElements.length > 0
    ? Math.min(...packshotElements.map(el => el.position.y))
    : config.height / 2;
  
  // Position headline above packshots, within safe zone
  const headlineHeight = fontSize * 2.5;
  const padding = 40;
  const y = Math.max(safeZoneTop + padding, highestPackshotY - headlineHeight - padding * 2);
  
  return {
    x: 60,
    y,
    width: width - 120,
    height: headlineHeight,
  };
}

/**
 * Check if element overlaps with value tile
 */
export function checkValueTileOverlap(
  adSize: AdSize,
  elementPosition: { x: number; y: number; width: number; height: number }
): boolean {
  const valueTile = VALUE_TILE_POSITIONS[adSize];
  
  // Check for overlap
  const noOverlap = 
    elementPosition.x + elementPosition.width < valueTile.x ||
    elementPosition.x > valueTile.x + valueTile.width ||
    elementPosition.y + elementPosition.height < valueTile.y ||
    elementPosition.y > valueTile.y + valueTile.height;
  
  return !noOverlap;
}

/**
 * Adjust packshot positions to avoid value tile
 */
export function adjustForValueTile(
  adSize: AdSize,
  packshotElements: LayoutElement[]
): LayoutElement[] {
  return packshotElements.map(element => {
    if (checkValueTileOverlap(adSize, element.position)) {
      // Move packshot up to avoid value tile
      const valueTile = VALUE_TILE_POSITIONS[adSize];
      const newY = valueTile.y - element.position.height - 40;
      
      return {
        ...element,
        position: {
          ...element.position,
          y: Math.max(SAFE_ZONES[adSize].top + 100, newY),
        },
      };
    }
    return element;
  });
}
