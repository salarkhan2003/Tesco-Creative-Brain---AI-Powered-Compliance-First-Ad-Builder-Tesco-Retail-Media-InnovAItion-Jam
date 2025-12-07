// Core types for the Tesco Creative Brain prototype

export interface PackshotImage {
  id: string;
  dataUrl: string;
  file: File;
  backgroundRemoved?: boolean;
  containsHuman?: boolean; // For model rights compliance check
  scale: number; // 0.5 to 1.5
  x: number; // 0 to 100 (percentage)
  y: number; // 0 to 100 (percentage)
  rotation?: number; // 0, 90, 180, 270 degrees
}

export interface ElementPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface TextStyle {
  fontSize: number;
  fontFamily: string;
  color: string;
  textAlign: 'left' | 'center' | 'right';
  verticalOffset: number; // -100 to 100 (percentage)
}

export interface LayoutElement {
  type: 'packshot' | 'headline' | 'valueTile' | 'background';
  position: ElementPosition;
  content?: string;
  imageUrl?: string;
}

export interface CreativeLayout {
  width: number;
  height: number;
  elements: LayoutElement[];
}

export interface ComplianceWarning {
  type: 'forbidden-text' | 'packshot-limit' | 'font-size' | 'safe-zone' | 'bounds';
  message: string;
  severity: 'error' | 'warning';
}

export interface CreativeConfig {
  packshots: PackshotImage[];
  headline: string;
  backgroundColor: string;
  textStyle: TextStyle;
}

export type AdSize = '1080x1080' | '1080x1920';

export type ProductCategory = 
  | 'Fresh Produce'
  | 'Snacking'
  | 'Beverages'
  | 'Alcohol'
  | 'Household'
  | 'Health & Beauty'
  | 'Bakery'
  | 'Frozen'
  | 'Other';

export type LayoutMode = 'auto' | 'manual';

// Gemini API types
export interface GeminiHeadlineRequest {
  productName: string;
  description: string;
  category?: ProductCategory;
  tone?: string;
  currentHeadline?: string;
}

export interface GeminiHeadlineResponse {
  headlines: string[];
  error?: string;
}

export interface GeminiLayoutRequest {
  productName: string;
  numPackshots: number;
  adSize: AdSize;
  category?: ProductCategory;
}

export interface GeminiLayoutResponse {
  headlinePosition: 'top-center' | 'middle' | 'bottom';
  headlineMaxLines: number;
  packshotEmphasis: 'single-large' | 'grid';
  primaryColor: string;
  valueTilePosition: 'bottom-right' | 'bottom-center';
}
