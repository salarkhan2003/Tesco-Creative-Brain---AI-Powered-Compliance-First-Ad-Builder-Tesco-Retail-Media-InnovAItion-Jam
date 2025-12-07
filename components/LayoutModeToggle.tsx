'use client';

import { LayoutMode } from '@/lib/types';

interface Props {
  mode: LayoutMode;
  onModeChange: (mode: LayoutMode) => void;
}

export default function LayoutModeToggle({ mode, onModeChange }: Props) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-gray-700">Layout Mode</label>
      
      <div className="flex gap-2">
        <button
          onClick={() => onModeChange('auto')}
          className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
            mode === 'auto'
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>Auto Layout</span>
          </div>
          <div className="text-xs mt-1 opacity-80">AI suggested</div>
        </button>
        
        <button
          onClick={() => onModeChange('manual')}
          className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
            mode === 'manual'
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
            <span>Manual Layout</span>
          </div>
          <div className="text-xs mt-1 opacity-80">Drag & drop</div>
        </button>
      </div>
      
      {mode === 'manual' && (
        <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg text-xs text-purple-800">
          <div className="flex items-start gap-2">
            <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Manual mode allows you to drag elements on the canvas. Compliance checks still apply.</span>
          </div>
        </div>
      )}
    </div>
  );
}
