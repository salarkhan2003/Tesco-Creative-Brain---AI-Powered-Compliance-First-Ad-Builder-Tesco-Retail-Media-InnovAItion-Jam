'use client';

import { AdSize, PackshotImage } from '@/lib/types';
import { generateLayout } from '@/lib/layout';
import { drawCreative, downloadCanvas } from '@/lib/canvas';

interface Props {
  packshots: PackshotImage[];
  headline: string;
  backgroundColor: string;
  fontSize: number;
  textAlign?: 'left' | 'center' | 'right';
  textColor?: string;
}

export default function ExportButtons({
  packshots,
  headline,
  backgroundColor,
  fontSize,
  textAlign = 'center',
  textColor = '#000000',
}: Props) {
  const handleExport = async (adSize: AdSize) => {
    // Create temporary canvas
    const canvas = document.createElement('canvas');
    const layout = generateLayout(adSize, packshots, headline, fontSize);
    
    const textStyle = {
      fontSize,
      fontFamily: 'Arial',
      color: textColor,
      textAlign,
      verticalOffset: 0,
    };
    
    // Draw without safe zones for export
    await drawCreative(canvas, layout, backgroundColor, textStyle, false, false);
    
    // Download
    const filename = `tesco-creative-${adSize.replace('x', '-')}.png`;
    downloadCanvas(canvas, filename);
  };

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Export Creatives
      </h3>
      
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => handleExport('1080x1080')}
          className="group relative px-5 py-4 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <div className="flex flex-col items-center gap-2">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <div>
              <div className="text-base">1080×1080</div>
              <div className="text-xs opacity-90">Square / Feed</div>
            </div>
          </div>
        </button>
        
        <button
          onClick={() => handleExport('1080x1920')}
          className="group relative px-5 py-4 bg-gradient-to-br from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <div className="flex flex-col items-center gap-2">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <div>
              <div className="text-base">1080×1920</div>
              <div className="text-xs opacity-90">Vertical / Story</div>
            </div>
          </div>
        </button>
      </div>
      
      <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
        <p className="text-xs text-blue-800 font-medium">
          Exports will be generated without safe zone guides for production use
        </p>
      </div>
    </div>
  );
}
