'use client';

interface Props {
  backgroundColor: string;
  onBackgroundColorChange: (color: string) => void;
}

const PRESET_COLORS = [
  { name: 'White', value: '#FFFFFF' },
  { name: 'Tesco Blue', value: '#00539F' },
  { name: 'Light Blue', value: '#E3F2FD' },
  { name: 'Light Gray', value: '#F5F5F5' },
  { name: 'Cream', value: '#FFF8E1' },
  { name: 'Light Green', value: '#E8F5E9' },
];

export default function BackgroundControls({
  backgroundColor,
  onBackgroundColorChange,
}: Props) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">Background Color</label>
        
        <div className="grid grid-cols-3 gap-3 mb-4">
          {PRESET_COLORS.map((color) => (
            <button
              key={color.value}
              onClick={() => onBackgroundColorChange(color.value)}
              className={`relative px-3 py-3 rounded-lg border-2 transition-all duration-200 shadow-sm hover:shadow-md ${
                backgroundColor === color.value
                  ? 'border-blue-600 ring-2 ring-blue-300 scale-105'
                  : 'border-gray-300 hover:border-blue-400'
              }`}
              style={{ backgroundColor: color.value }}
            >
              <span className="text-xs font-semibold drop-shadow-sm" style={{ 
                color: color.value === '#FFFFFF' || color.value.startsWith('#F') || color.value.startsWith('#E') ? '#1F2937' : '#FFFFFF',
                textShadow: color.value === '#FFFFFF' || color.value.startsWith('#F') || color.value.startsWith('#E') ? 'none' : '0 1px 2px rgba(0,0,0,0.3)'
              }}>
                {color.name}
              </span>
              {backgroundColor === color.value && (
                <div className="absolute top-1 right-1 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Custom:</label>
          <input
            type="color"
            value={backgroundColor}
            onChange={(e) => onBackgroundColorChange(e.target.value)}
            className="w-12 h-12 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 transition"
          />
          <input
            type="text"
            value={backgroundColor}
            onChange={(e) => onBackgroundColorChange(e.target.value)}
            className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg text-sm font-mono focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
            placeholder="#FFFFFF"
          />
        </div>
      </div>
    </div>
  );
}
