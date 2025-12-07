'use client';

import { PackshotImage } from '@/lib/types';

interface Props {
  packshot: PackshotImage;
  onUpdate: (updates: Partial<PackshotImage>) => void;
  onRemove: () => void;
  onRemoveBackground: () => void;
  isRemovingBg: boolean;
}

export default function PackshotControls({
  packshot,
  onUpdate,
  onRemove,
  onRemoveBackground,
  isRemovingBg,
}: Props) {
  return (
    <div className="relative border-2 border-gray-200 rounded-xl p-4 bg-white hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md">
      {/* Image Preview */}
      <div className="bg-gray-50 rounded-lg p-3 mb-4">
        <img
          src={packshot.dataUrl}
          alt="Packshot"
          className="w-full h-32 object-contain"
        />
      </div>

      {/* Position Controls */}
      <div className="space-y-3 mb-4">
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-semibold text-gray-700">Scale</label>
            <span className="text-xs font-mono text-blue-600">{packshot.scale.toFixed(2)}x</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="1.5"
            step="0.05"
            value={packshot.scale}
            onChange={(e) => onUpdate({ scale: Number(e.target.value) })}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-0.5">
            <span>0.5x</span>
            <span>1.5x</span>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-semibold text-gray-700">Horizontal</label>
            <span className="text-xs font-mono text-blue-600">{packshot.x}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={packshot.x}
            onChange={(e) => onUpdate({ x: Number(e.target.value) })}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-0.5">
            <span>Left</span>
            <span>Right</span>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-semibold text-gray-700">Vertical</label>
            <span className="text-xs font-mono text-blue-600">{packshot.y}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={packshot.y}
            onChange={(e) => onUpdate({ y: Number(e.target.value) })}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-0.5">
            <span>Top</span>
            <span>Bottom</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2">
        {!packshot.backgroundRemoved && (
          <button
            onClick={onRemoveBackground}
            disabled={isRemovingBg}
            className="w-full text-xs px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-sm hover:shadow flex items-center justify-center gap-2"
          >
            {isRemovingBg ? (
              <>
                <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Removing...
              </>
            ) : (
              <>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Remove BG
              </>
            )}
          </button>
        )}

        {packshot.backgroundRemoved && (
          <div className="flex items-center justify-center gap-1 text-xs text-green-700 bg-green-50 py-2 rounded-lg font-medium">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            BG Removed
          </div>
        )}

        <button
          onClick={onRemove}
          className="w-full text-xs px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 font-medium shadow-sm hover:shadow flex items-center justify-center gap-2"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Remove
        </button>
      </div>
    </div>
  );
}
