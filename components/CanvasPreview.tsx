'use client';

import { useEffect, useRef } from 'react';
import { AdSize, PackshotImage } from '@/lib/types';
import { generateLayout } from '@/lib/layout';
import { drawCreative } from '@/lib/canvas';

interface Props {
  adSize: AdSize;
  packshots: PackshotImage[];
  headline: string;
  backgroundColor: string;
  fontSize: number;
  textAlign?: 'left' | 'center' | 'right';
  textColor?: string;
  showSafeZones?: boolean;
  showGrid?: boolean;
}

export default function CanvasPreview({
  adSize,
  packshots,
  headline,
  backgroundColor,
  fontSize,
  textAlign = 'center',
  textColor = '#000000',
  showSafeZones = true,
  showGrid = false,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const layout = generateLayout(adSize, packshots, headline, fontSize);
    
    const textStyle = {
      fontSize,
      fontFamily: 'Arial',
      color: textColor,
      textAlign,
      verticalOffset: 0,
    };
    
    drawCreative(canvas, layout, backgroundColor, textStyle, showSafeZones, showGrid).catch((error) => {
      console.error('Canvas drawing error:', error);
    });
  }, [adSize, packshots, headline, backgroundColor, fontSize, textAlign, textColor, showSafeZones, showGrid]);

  // Base scale for display
  const baseScale = adSize === '1080x1920' ? 0.25 : 0.35;

  return (
    <div className="flex justify-center items-center bg-gray-100 p-4 rounded overflow-auto">
      <canvas
        ref={canvasRef}
        style={{
          width: `${1080 * baseScale}px`,
          height: `${(adSize === '1080x1920' ? 1920 : 1080) * baseScale}px`,
          border: '1px solid #ccc',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          imageRendering: 'crisp-edges',
        }}
      />
    </div>
  );
}
