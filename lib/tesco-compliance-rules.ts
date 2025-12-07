/**
 * Tesco Retail Media Compliance Rules
 * Based on Appendix A & B from hackathon guidelines
 */

export interface ComplianceRule {
  type: string;
  name: string;
  detail: string;
  severity: 'hard-fail' | 'warning';
  check: (context: any) => boolean;
  message: string;
}

// Forbidden text patterns
export const FORBIDDEN_PATTERNS = {
  // Price callouts
  price: /(\d+%\s*off|discount|deal|save|£\d+|price|cheapest|lowest price|best price)/gi,
  
  // Sustainability claims
  sustainability: /(eco-friendly|sustainable|green|carbon neutral|environmentally friendly)/gi,
  
  // Competitions
  competition: /(win|competition|prize|enter to|giveaway|contest)/gi,
  
  // Charity partnerships
  charity: /(charity|donate|donation|fundrais)/gi,
  
  // Money-back guarantees
  moneyBack: /(money.?back|guarantee|refund)/gi,
  
  // Claims requiring proof
  claims: /(best|greatest|perfect|#1|number one|leading|award.?winning)/gi,
  
  // T&Cs indicators
  tcs: /(\*|terms apply|t&cs|conditions apply)/gi,
};

// Valid Tesco tags
export const VALID_TESCO_TAGS = [
  'Only at Tesco',
  'Available at Tesco',
  'Selected stores. While stocks last.',
];

// Safe zone requirements (pixels from edge)
export const SAFE_ZONES = {
  '1080x1920': {
    top: 200,
    bottom: 250,
  },
  '1080x1080': {
    top: 80,
    bottom: 80,
  },
};

// Minimum font sizes
export const MIN_FONT_SIZES = {
  brand: 20,
  social: 20,
  checkout_double: 20,
  checkout_single: 10,
  says: 12,
};

// Value tile positions (predefined, cannot be moved)
export const VALUE_TILE_POSITIONS = {
  '1080x1080': {
    x: 900, // bottom-right
    y: 900,
    width: 140,
    height: 140,
  },
  '1080x1920': {
    x: 460, // bottom-center
    y: 1520,
    width: 160,
    height: 160,
  },
};

// Packshot rules
export const PACKSHOT_RULES = {
  maxCount: 3,
  minGap: 24, // minimum gap between packshot and CTA
  minGapSingle: 12, // for single density
};

// Drinkaware logo requirements
export const DRINKAWARE_RULES = {
  minHeight: 20,
  saysMinHeight: 12,
  allowedColors: ['#000000', '#FFFFFF'],
};

/**
 * Check if text contains forbidden patterns
 */
export function checkForbiddenText(text: string): {
  violations: string[];
  clean: boolean;
} {
  const violations: string[] = [];
  
  if (FORBIDDEN_PATTERNS.price.test(text)) {
    violations.push('Price callouts not allowed (e.g., "% off", "discount", "deal")');
  }
  
  if (FORBIDDEN_PATTERNS.sustainability.test(text)) {
    violations.push('Sustainability claims not allowed without certification');
  }
  
  if (FORBIDDEN_PATTERNS.competition.test(text)) {
    violations.push('Competition copy not allowed');
  }
  
  if (FORBIDDEN_PATTERNS.charity.test(text)) {
    violations.push('Charity partnership text not allowed');
  }
  
  if (FORBIDDEN_PATTERNS.moneyBack.test(text)) {
    violations.push('Money-back guarantees not allowed');
  }
  
  if (FORBIDDEN_PATTERNS.claims.test(text)) {
    violations.push('Superlative claims require proof (e.g., "best", "perfect")');
  }
  
  if (FORBIDDEN_PATTERNS.tcs.test(text)) {
    violations.push('T&Cs and claims with asterisks not allowed');
  }
  
  return {
    violations,
    clean: violations.length === 0,
  };
}

/**
 * Check safe zone compliance
 */
export function checkSafeZone(
  adSize: '1080x1080' | '1080x1920',
  elementY: number,
  elementHeight: number
): boolean {
  const zones = SAFE_ZONES[adSize];
  const elementBottom = elementY + elementHeight;
  const canvasHeight = adSize === '1080x1920' ? 1920 : 1080;
  
  // Check if element is in top safe zone
  if (elementY < zones.top) {
    return false;
  }
  
  // Check if element is in bottom safe zone
  if (elementBottom > canvasHeight - zones.bottom) {
    return false;
  }
  
  return true;
}

/**
 * Check font size compliance
 */
export function checkFontSize(fontSize: number, context: 'social' | 'brand' = 'social'): boolean {
  const minSize = context === 'social' ? MIN_FONT_SIZES.social : MIN_FONT_SIZES.brand;
  return fontSize >= minSize;
}

/**
 * Check packshot count compliance
 */
export function checkPackshotCount(count: number): boolean {
  return count <= PACKSHOT_RULES.maxCount;
}

/**
 * Calculate contrast ratio (WCAG AA compliance)
 */
export function getContrastRatio(color1: string, color2: string): number {
  const getLuminance = (hex: string): number => {
    const rgb = parseInt(hex.replace('#', ''), 16);
    const r = ((rgb >> 16) & 0xff) / 255;
    const g = ((rgb >> 8) & 0xff) / 255;
    const b = (rgb & 0xff) / 255;
    
    const [rs, gs, bs] = [r, g, b].map(c => {
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };
  
  const l1 = getLuminance(color1);
  const l2 = getLuminance(color2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check WCAG AA contrast compliance (4.5:1 for normal text)
 */
export function checkContrastCompliance(textColor: string, backgroundColor: string): boolean {
  const ratio = getContrastRatio(textColor, backgroundColor);
  return ratio >= 4.5;
}

/**
 * Validate Tesco tag text
 */
export function validateTescoTag(tagText: string, hasClubcardPrice: boolean): {
  valid: boolean;
  message?: string;
} {
  if (hasClubcardPrice) {
    // Must include Clubcard text with end date
    const clubcardPattern = /Clubcard\/app required\. Ends \d{2}\/\d{2}/;
    if (!clubcardPattern.test(tagText)) {
      return {
        valid: false,
        message: 'Clubcard promotions must include: "Clubcard/app required. Ends DD/MM"',
      };
    }
  }
  
  // Check if tag matches valid options
  const isValid = VALID_TESCO_TAGS.some(validTag => tagText.includes(validTag));
  
  if (!isValid) {
    return {
      valid: false,
      message: `Tag must be one of: ${VALID_TESCO_TAGS.join(', ')}`,
    };
  }
  
  return { valid: true };
}

/**
 * Get all compliance violations for a creative
 */
export function getComplianceViolations(creative: {
  headline: string;
  subhead?: string;
  fontSize: number;
  textColor: string;
  backgroundColor: string;
  packshotCount: number;
  adSize: '1080x1080' | '1080x1920';
  headlineY: number;
  headlineHeight: number;
  category?: string;
}): Array<{ type: string; message: string; severity: 'hard-fail' | 'warning' }> {
  const violations: Array<{ type: string; message: string; severity: 'hard-fail' | 'warning' }> = [];
  
  // Check headline text
  const headlineCheck = checkForbiddenText(creative.headline);
  if (!headlineCheck.clean) {
    headlineCheck.violations.forEach(v => {
      violations.push({ type: 'copy', message: v, severity: 'hard-fail' });
    });
  }
  
  // Check subhead if present
  if (creative.subhead) {
    const subheadCheck = checkForbiddenText(creative.subhead);
    if (!subheadCheck.clean) {
      subheadCheck.violations.forEach(v => {
        violations.push({ type: 'copy', message: `Subhead: ${v}`, severity: 'hard-fail' });
      });
    }
  }
  
  // Check font size
  if (!checkFontSize(creative.fontSize, 'social')) {
    violations.push({
      type: 'accessibility',
      message: `Font size must be at least ${MIN_FONT_SIZES.social}px for social media`,
      severity: 'hard-fail',
    });
  }
  
  // Check contrast
  if (!checkContrastCompliance(creative.textColor, creative.backgroundColor)) {
    violations.push({
      type: 'accessibility',
      message: 'Text color does not meet WCAG AA contrast requirements (4.5:1)',
      severity: 'hard-fail',
    });
  }
  
  // Check packshot count
  if (!checkPackshotCount(creative.packshotCount)) {
    violations.push({
      type: 'packshot',
      message: `Maximum ${PACKSHOT_RULES.maxCount} packshots allowed`,
      severity: 'hard-fail',
    });
  }
  
  // Check safe zones
  if (!checkSafeZone(creative.adSize, creative.headlineY, creative.headlineHeight)) {
    const zones = SAFE_ZONES[creative.adSize];
    violations.push({
      type: 'format',
      message: `Text must be ${zones.top}px from top and ${zones.bottom}px from bottom`,
      severity: 'hard-fail',
    });
  }
  
  // Check alcohol category for drinkaware
  if (creative.category === 'Alcohol') {
    violations.push({
      type: 'alcohol',
      message: 'Alcohol promotions must include Drinkaware lock-up (minimum 20px height)',
      severity: 'warning',
    });
  }
  
  return violations;
}
