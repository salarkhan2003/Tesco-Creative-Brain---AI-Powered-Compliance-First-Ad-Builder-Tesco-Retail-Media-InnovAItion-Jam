// Canvas rendering utilities for creative preview and export

import { CreativeLayout, LayoutElement } from './types';

import { TextStyle } from './types';

/**
 * Draw a creative layout on a canvas element with WYSIWYG accuracy
 * Supports both old (fontSize) and new (textStyle) API for backward compatibility
 */
export async function drawCreative(
  canvas: HTMLCanvasElement,
  layout: CreativeLayout,
  backgroundColor: string,
  fontSizeOrTextStyle: number | TextStyle,
  showSafeZones: boolean = true,
  showGrid: boolean = false
): Promise<void> {
  // Convert fontSize to TextStyle if needed for backward compatibility
  const textStyle: TextStyle = typeof fontSizeOrTextStyle === 'number'
    ? {
        fontSize: fontSizeOrTextStyle,
        fontFamily: 'Arial',
        color: getContrastColor(backgroundColor),
        textAlign: 'center',
        verticalOffset: 0,
      }
    : fontSizeOrTextStyle;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  // Set canvas dimensions
  canvas.width = layout.width;
  canvas.height = layout.height;
  
  // Clear canvas
  ctx.clearRect(0, 0, layout.width, layout.height);
  
  // Draw grid if enabled (before other elements)
  if (showGrid) {
    drawGrid(ctx, layout.width, layout.height);
  }
  
  // Draw each element
  for (const element of layout.elements) {
    await drawElement(ctx, element, backgroundColor, textStyle);
  }
  
  // Draw safe zone guides if enabled
  if (showSafeZones) {
    drawSafeZones(ctx, layout.width, layout.height);
  }
}

/**
 * Draw a single layout element with proper styling
 */
async function drawElement(
  ctx: CanvasRenderingContext2D,
  element: LayoutElement,
  backgroundColor: string,
  textStyle: TextStyle
): Promise<void> {
  const { position } = element;
  
  switch (element.type) {
    case 'background':
      // Draw background
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(position.x, position.y, position.width, position.height);
      break;
      
    case 'headline':
      // Draw headline text with user-defined styling
      ctx.fillStyle = textStyle.color;
      ctx.font = `bold ${textStyle.fontSize}px ${textStyle.fontFamily}, sans-serif`;
      ctx.textAlign = textStyle.textAlign;
      ctx.textBaseline = 'top';
      
      // Add text shadow for better readability
      const isLightText = textStyle.color === '#FFFFFF' || textStyle.color.toLowerCase() === '#fff';
      ctx.shadowColor = isLightText ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.6)';
      ctx.shadowBlur = 6;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      
      // Word wrap for long headlines
      const words = (element.content || '').split(' ');
      let line = '';
      let y = position.y;
      const lineHeight = textStyle.fontSize * 1.4;
      const maxWidth = position.width;
      
      // Calculate X position based on alignment
      let textX: number;
      switch (textStyle.textAlign) {
        case 'left':
          textX = position.x;
          break;
        case 'right':
          textX = position.x + position.width;
          break;
        case 'center':
        default:
          textX = position.x + position.width / 2;
          break;
      }
      
      for (const word of words) {
        const testLine = line + word + ' ';
        const metrics = ctx.measureText(testLine);
        
        if (metrics.width > maxWidth && line !== '') {
          ctx.fillText(line, textX, y);
          line = word + ' ';
          y += lineHeight;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, textX, y);
      
      // Reset shadow
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      break;
      
    case 'packshot':
      // Draw packshot image
      if (element.imageUrl) {
        try {
          const img = await loadImage(element.imageUrl);
          ctx.drawImage(img, position.x, position.y, position.width, position.height);
        } catch (error) {
          // Fallback: draw placeholder
          ctx.fillStyle = '#e0e0e0';
          ctx.fillRect(position.x, position.y, position.width, position.height);
          ctx.strokeStyle = '#999';
          ctx.strokeRect(position.x, position.y, position.width, position.height);
        }
      }
      break;
      
    case 'valueTile':
      // Draw value tile
      ctx.fillStyle = '#00539F'; // Tesco blue
      ctx.fillRect(position.x, position.y, position.width, position.height);
      
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 24px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(
        element.content || 'VALUE',
        position.x + position.width / 2,
        position.y + position.height / 2
      );
      break;
  }
}

/**
 * Draw grid overlay for alignment
 */
function drawGrid(ctx: CanvasRenderingContext2D, width: number, height: number): void {
  ctx.save();
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
  ctx.lineWidth = 1;
  
  const gridSize = 50; // 50px grid
  
  // Vertical lines
  for (let x = 0; x <= width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  
  // Horizontal lines
  for (let y = 0; y <= height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
  
  ctx.restore();
}

/**
 * Draw safe zone guides
 */
function drawSafeZones(ctx: CanvasRenderingContext2D, width: number, height: number): void {
  const isVertical = height > width;
  const topZone = isVertical ? 200 : 80;
  const bottomZone = isVertical ? 250 : 80;
  
  ctx.save();
  
  // Top safe zone
  ctx.fillStyle = 'rgba(255, 0, 0, 0.1)';
  ctx.fillRect(0, 0, width, topZone);
  
  // Bottom safe zone
  ctx.fillRect(0, height - bottomZone, width, bottomZone);
  
  // Draw zone labels
  ctx.fillStyle = 'rgba(255, 0, 0, 0.8)';
  ctx.font = '14px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`Safe Zone: No text in top ${topZone}px`, width / 2, topZone / 2);
  ctx.fillText(`Safe Zone: No text in bottom ${bottomZone}px`, width / 2, height - bottomZone / 2);
  
  ctx.restore();
}

/**
 * Load an image from a URL or data URL
 */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Export canvas as PNG data URL
 */
export function exportCanvasToPNG(canvas: HTMLCanvasElement): string {
  return canvas.toDataURL('image/png');
}

/**
 * Trigger download of canvas as PNG file
 */
export function downloadCanvas(canvas: HTMLCanvasElement, filename: string): void {
  const dataUrl = exportCanvasToPNG(canvas);
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  link.click();
}

/**
 * Calculate contrast color (black or white) based on background brightness
 */
function getContrastColor(hexColor: string): string {
  // Convert hex to RGB
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  // Calculate relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Return black for light backgrounds, white for dark backgrounds
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}
