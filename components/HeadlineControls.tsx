'use client';

interface Props {
  headline: string;
  onHeadlineChange: (headline: string) => void;
  fontSize: number;
  onFontSizeChange: (size: number) => void;
  textAlign?: 'left' | 'center' | 'right';
  onTextAlignChange?: (align: 'left' | 'center' | 'right') => void;
  textColor?: string;
  onTextColorChange?: (color: string) => void;
}

const FONT_SIZES = [
  { label: 'Small (16px)', value: 16 },
  { label: 'Medium (24px)', value: 24 },
  { label: 'Large (32px)', value: 32 },
  { label: 'X-Large (40px)', value: 40 },
];

export default function HeadlineControls({
  headline,
  onHeadlineChange,
  fontSize,
  onFontSizeChange,
  textAlign = 'center',
  onTextAlignChange,
  textColor = '#000000',
  onTextColorChange,
}: Props) {
  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Headline Text</label>
        <textarea
          value={headline}
          onChange={(e) => onHeadlineChange(e.target.value)}
          placeholder="Enter your creative headline..."
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none text-gray-800 placeholder-gray-400"
          rows={3}
        />
        <p className="mt-2 text-xs text-gray-500">{headline.length} characters</p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Font Size</label>
        <select
          value={fontSize}
          onChange={(e) => onFontSizeChange(Number(e.target.value))}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white text-gray-800 font-medium cursor-pointer hover:border-blue-400"
        >
          {FONT_SIZES.map((size) => (
            <option key={size.value} value={size.value}>
              {size.label}
            </option>
          ))}
        </select>
      </div>

      {onTextAlignChange && (
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Text Alignment</label>
          <div className="flex gap-2">
            <button
              onClick={() => onTextAlignChange('left')}
              className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
                textAlign === 'left'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <svg className="w-5 h-5 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </button>
            <button
              onClick={() => onTextAlignChange('center')}
              className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
                textAlign === 'center'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <svg className="w-5 h-5 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm2 4a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm0 4a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm-2 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </button>
            <button
              onClick={() => onTextAlignChange('right')}
              className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
                textAlign === 'right'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <svg className="w-5 h-5 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm6 4a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1zm-6 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm6 4a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {onTextColorChange && (
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Text Color</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={textColor}
              onChange={(e) => onTextColorChange(e.target.value)}
              className="w-16 h-12 rounded-lg border-2 border-gray-300 cursor-pointer"
            />
            <input
              type="text"
              value={textColor}
              onChange={(e) => onTextColorChange(e.target.value)}
              placeholder="#000000"
              className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition font-mono text-sm"
            />
          </div>
        </div>
      )}
    </div>
  );
}
