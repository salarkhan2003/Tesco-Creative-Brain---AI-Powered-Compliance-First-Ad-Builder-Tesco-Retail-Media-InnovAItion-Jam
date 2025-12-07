'use client';

import { TextStyle } from '@/lib/types';

interface Props {
  headline: string;
  onHeadlineChange: (headline: string) => void;
  textStyle: TextStyle;
  onTextStyleChange: (style: Partial<TextStyle>) => void;
  productName: string;
  onProductNameChange: (name: string) => void;
  description: string;
  onDescriptionChange: (desc: string) => void;
}

const FONT_SIZES = [16, 20, 24, 28, 32, 36, 40, 48];
const FONT_FAMILIES = ['Arial', 'Helvetica', 'Georgia', 'Times New Roman', 'Verdana'];

export default function HeadlineControlsEnhanced({
  headline,
  onHeadlineChange,
  textStyle,
  onTextStyleChange,
  productName,
  onProductNameChange,
  description,
  onDescriptionChange,
}: Props) {
  return (
    <div className="space-y-6">
      {/* Product Info for AI */}
      <div className="space-y-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
        <h4 className="font-semibold text-sm text-purple-900">Product Information (for AI)</h4>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Product Name</label>
          <input
            type="text"
            value={productName}
            onChange={(e) => onProductNameChange(e.target.value)}
            placeholder="e.g., Fresh Organic Apples"
            className="w-full px-3 py-2 border-2 border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition text-sm bg-white text-gray-800 placeholder-gray-400"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="e.g., Crisp, sweet, locally sourced"
            className="w-full px-3 py-2 border-2 border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition text-sm bg-white text-gray-800 placeholder-gray-400"
          />
        </div>
      </div>

      {/* Headline Text */}
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

      {/* Text Styling */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Font Size</label>
          <select
            value={textStyle.fontSize}
            onChange={(e) => onTextStyleChange({ fontSize: Number(e.target.value) })}
            className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white text-gray-800 font-medium cursor-pointer"
          >
            {FONT_SIZES.map((size) => (
              <option key={size} value={size}>
                {size}px
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Font Family</label>
          <select
            value={textStyle.fontFamily}
            onChange={(e) => onTextStyleChange({ fontFamily: e.target.value })}
            className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white text-gray-800 font-medium cursor-pointer"
          >
            {FONT_FAMILIES.map((font) => (
              <option key={font} value={font}>
                {font}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Text Color */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Text Color</label>
        <div className="flex gap-3">
          {['#000000', '#FFFFFF', '#00539F', '#E50000', '#FFB81C'].map((color) => (
            <button
              key={color}
              onClick={() => onTextStyleChange({ color })}
              className={`w-12 h-12 rounded-lg border-4 transition-all ${
                textStyle.color === color ? 'border-blue-600 scale-110' : 'border-gray-300'
              }`}
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
          <input
            type="color"
            value={textStyle.color}
            onChange={(e) => onTextStyleChange({ color: e.target.value })}
            className="w-12 h-12 border-4 border-gray-300 rounded-lg cursor-pointer"
          />
        </div>
      </div>

      {/* Text Alignment */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Text Alignment</label>
        <div className="flex gap-2">
          {(['left', 'center', 'right'] as const).map((align) => (
            <button
              key={align}
              onClick={() => onTextStyleChange({ textAlign: align })}
              className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
                textStyle.textAlign === align
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {align.charAt(0).toUpperCase() + align.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Vertical Position */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Vertical Position: {textStyle.verticalOffset > 0 ? '+' : ''}{textStyle.verticalOffset}
        </label>
        <input
          type="range"
          min="-100"
          max="100"
          value={textStyle.verticalOffset}
          onChange={(e) => onTextStyleChange({ verticalOffset: Number(e.target.value) })}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Top</span>
          <span>Center</span>
          <span>Bottom</span>
        </div>
      </div>
    </div>
  );
}
