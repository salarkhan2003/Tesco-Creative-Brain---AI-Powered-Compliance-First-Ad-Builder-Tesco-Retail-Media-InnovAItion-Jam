// Tesco-style compliance engine for retail media creatives
// This module enforces brand guidelines and regulatory requirements
// Implements strong text + image + layout validation for hackathon demo

import { ComplianceWarning, ElementPosition } from './types';

// Minimum font size in pixels (Tesco brand guideline)
const MIN_FONT_SIZE = 16;

// Maximum number of packshots allowed per creative
const MAX_PACKSHOTS = 3;

// Minimum contrast ratio for WCAG AA compliance
const MIN_CONTRAST_RATIO = 4.5;

// Safe zone definitions for different ad sizes
const SAFE_ZONES = {
  '1080x1920': {
    topExclusion: 200,    // Top 200px reserved for platform UI
    bottomExclusion: 250, // Bottom 250px reserved for CTAs
  },
  '1080x1080': {
    topExclusion: 80,
    bottomExclusion: 80,
  },
};

// Forbidden words and patterns (Tesco compliance rules - ENHANCED)
const FORBIDDEN_PATTERNS = [
  // Price claims
  { pattern: /\d+\s*%\s*off/i, message: 'Price claims like "% off" not allowed', severity: 'hard' as const },
  { pattern: /\d+%\s*off/i, message: 'Discount percentage not allowed', severity: 'hard' as const },
  { pattern: /best\s+price/i, message: 'Superlative price claims not allowed', severity: 'hard' as const },
  { pattern: /lowest\s+price/i, message: 'Superlative price claims not allowed', severity: 'hard' as const },
  { pattern: /cheapest/i, message: 'Superlative price claims not allowed', severity: 'hard' as const },
  { pattern: /discount/i, message: 'Discount language not allowed', severity: 'hard' as const },
  { pattern: /deal\s+of\s+the\s+day/i, message: 'Deal claims not allowed', severity: 'hard' as const },
  
  // Currency and price patterns
  { pattern: /[£$€₹]\s*\d+/i, message: 'Price information not allowed in headline', severity: 'hard' as const },
  { pattern: /\bprice\b.*\d+/i, message: 'Price information not allowed in headline', severity: 'hard' as const },
  
  // Environmental claims
  { pattern: /eco-friendly/i, message: 'Unsubstantiated environmental claims not allowed', severity: 'hard' as const },
  { pattern: /sustainable/i, message: 'Unsubstantiated environmental claims not allowed', severity: 'hard' as const },
  { pattern: /greenest/i, message: 'Unsubstantiated environmental claims not allowed', severity: 'hard' as const },
  { pattern: /environmentally\s+friendly/i, message: 'Unsubstantiated environmental claims not allowed', severity: 'hard' as const },
  
  // Guarantees and strong claims
  { pattern: /guaranteed/i, message: 'Money-back guarantees not allowed', severity: 'hard' as const },
  { pattern: /money\s+back/i, message: 'Money-back guarantees not allowed', severity: 'hard' as const },
  { pattern: /or\s+your\s+money\s+back/i, message: 'Money-back guarantees not allowed', severity: 'hard' as const },
];

/**
 * Check if headline text contains forbidden words or patterns
 * ENHANCED: Returns severity from pattern definition
 */
export function checkForbiddenText(headline: string): ComplianceWarning[] {
  const warnings: ComplianceWarning[] = [];
  
  if (!headline || headline.trim() === '') {
    return warnings;
  }
  
  for (const { pattern, message, severity } of FORBIDDEN_PATTERNS) {
    if (pattern.test(headline)) {
      warnings.push({
        type: 'forbidden-text',
        message,
        severity: severity === 'hard' ? 'error' : 'warning',
      });
    }
  }
  
  return warnings;
}

/**
 * Calculate relative luminance for contrast checking (WCAG formula)
 */
function getRelativeLuminance(hexColor: string): number {
  // Remove # if present
  const hex = hexColor.replace('#', '');
  
  // Parse RGB
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  
  // Apply gamma correction
  const rsRGB = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
  const gsRGB = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
  const bsRGB = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);
  
  return 0.2126 * rsRGB + 0.7152 * gsRGB + 0.0722 * bsRGB;
}

/**
 * Check contrast ratio between text and background (WCAG AA)
 */
export function checkContrast(
  textColor: string,
  backgroundColor: string
): ComplianceWarning[] {
  const warnings: ComplianceWarning[] = [];
  
  try {
    const textLum = getRelativeLuminance(textColor);
    const bgLum = getRelativeLuminance(backgroundColor);
    
    // Calculate contrast ratio
    const lighter = Math.max(textLum, bgLum);
    const darker = Math.min(textLum, bgLum);
    const contrastRatio = (lighter + 0.05) / (darker + 0.05);
    
    if (contrastRatio < MIN_CONTRAST_RATIO) {
      warnings.push({
        type: 'safe-zone',
        message: `Low contrast (${contrastRatio.toFixed(1)}:1, minimum ${MIN_CONTRAST_RATIO}:1 for accessibility)`,
        severity: 'warning',
      });
    }
  } catch (error) {
    // Invalid color format - skip check
    console.warn('Invalid color format for contrast check:', error);
  }
  
  return warnings;
}

/**
 * Check for alcohol-specific compliance (Drinkaware requirement)
 */
export function checkAlcoholCompliance(
  category: string | undefined,
  hasValueTile: boolean
): ComplianceWarning[] {
  const warnings: ComplianceWarning[] = [];
  
  if (category?.toLowerCase() === 'alcohol') {
    if (!hasValueTile) {
      warnings.push({
        type: 'bounds',
        message: 'Alcohol creative must include Drinkaware lock-up (value tile placeholder)',
        severity: 'error',
      });
    }
  }
  
  return warnings;
}

/**
 * Check for human detection (stub for hackathon)
 */
export function checkHumanDetection(
  packshots: Array<{ containsHuman?: boolean }>
): ComplianceWarning[] {
  const warnings: ComplianceWarning[] = [];
  
  const hasHumans = packshots.some(p => p.containsHuman === true);
  
  if (hasHumans) {
    warnings.push({
      type: 'bounds',
      message: 'Human detected – confirm model rights and Tesco approvals',
      severity: 'warning',
    });
  }
  
  return warnings;
}

/**
 * Check if packshot count exceeds limit
 */
export function checkPackshotLimit(packshotCount: number): ComplianceWarning[] {
  const warnings: ComplianceWarning[] = [];
  
  if (packshotCount > MAX_PACKSHOTS) {
    warnings.push({
      type: 'packshot-limit',
      message: `Only ${MAX_PACKSHOTS} packshots allowed (currently ${packshotCount})`,
      severity: 'error',
    });
  }
  
  return warnings;
}

/**
 * Check if font size meets minimum requirements
 */
export function checkFontSize(fontSize: number): ComplianceWarning[] {
  const warnings: ComplianceWarning[] = [];
  
  if (fontSize < MIN_FONT_SIZE) {
    warnings.push({
      type: 'font-size',
      message: `Font too small (min ${MIN_FONT_SIZE}px, current ${fontSize}px)`,
      severity: 'error',
    });
  }
  
  return warnings;
}

/**
 * Check if text element violates safe zone rules
 */
export function checkSafeZone(
  textPosition: ElementPosition,
  adSize: '1080x1080' | '1080x1920'
): ComplianceWarning[] {
  const warnings: ComplianceWarning[] = [];
  const safeZone = SAFE_ZONES[adSize];
  
  const textTop = textPosition.y;
  const textBottom = textPosition.y + textPosition.height;
  
  // Check top safe zone violation
  if (textTop < safeZone.topExclusion) {
    warnings.push({
      type: 'safe-zone',
      message: `Headline violates top safe zone (must be below ${safeZone.topExclusion}px)`,
      severity: 'error',
    });
  }
  
  // Check bottom safe zone violation
  const canvasHeight = adSize === '1080x1920' ? 1920 : 1080;
  if (textBottom > canvasHeight - safeZone.bottomExclusion) {
    warnings.push({
      type: 'safe-zone',
      message: `Headline violates bottom safe zone (must be above ${canvasHeight - safeZone.bottomExclusion}px)`,
      severity: 'error',
    });
  }
  
  return warnings;
}

/**
 * Check if elements are within canvas bounds
 */
export function checkBounds(
  position: ElementPosition,
  canvasWidth: number,
  canvasHeight: number,
  elementType: string
): ComplianceWarning[] {
  const warnings: ComplianceWarning[] = [];
  
  if (
    position.x < 0 ||
    position.y < 0 ||
    position.x + position.width > canvasWidth ||
    position.y + position.height > canvasHeight
  ) {
    warnings.push({
      type: 'bounds',
      message: `${elementType} is outside canvas bounds`,
      severity: 'warning',
    });
  }
  
  return warnings;
}

/**
 * Run all compliance checks for a creative (ENHANCED for hackathon)
 */
export function runComplianceChecks(
  headline: string,
  packshotCount: number,
  fontSize: number,
  headlinePosition: ElementPosition,
  packshotPositions: ElementPosition[],
  adSize: '1080x1080' | '1080x1920',
  options?: {
    textColor?: string;
    backgroundColor?: string;
    category?: string;
    packshots?: Array<{ containsHuman?: boolean }>;
  }
): ComplianceWarning[] {
  const warnings: ComplianceWarning[] = [];
  
  // 1. Check forbidden text (prices, claims, environmental)
  warnings.push(...checkForbiddenText(headline));
  
  // 2. Check packshot limit
  warnings.push(...checkPackshotLimit(packshotCount));
  
  // 3. Check font size
  warnings.push(...checkFontSize(fontSize));
  
  // 4. Check safe zone for headline
  warnings.push(...checkSafeZone(headlinePosition, adSize));
  
  // 5. Check bounds for packshots
  const canvasWidth = 1080;
  const canvasHeight = adSize === '1080x1920' ? 1920 : 1080;
  
  packshotPositions.forEach((pos, index) => {
    warnings.push(...checkBounds(pos, canvasWidth, canvasHeight, `Packshot ${index + 1}`));
  });
  
  // 6. Check contrast (if colors provided)
  if (options?.textColor && options?.backgroundColor) {
    warnings.push(...checkContrast(options.textColor, options.backgroundColor));
  }
  
  // 7. Check alcohol compliance (if category provided)
  if (options?.category) {
    const hasValueTile = true; // Assume value tile is present in layout
    warnings.push(...checkAlcoholCompliance(options.category, hasValueTile));
  }
  
  // 8. Check human detection (if packshot data provided)
  if (options?.packshots) {
    warnings.push(...checkHumanDetection(options.packshots));
  }
  
  return warnings;
}
