'use client';

import { PackshotImage } from '@/lib/types';
import { useState } from 'react';

interface Props {
  packshots: PackshotImage[];
  onPackshotsChange: (packshots: PackshotImage[]) => void;
  maxPackshots?: number;
}

export default function PackshotUploader({ packshots, onPackshotsChange, maxPackshots = 3 }: Props) {
  const [removingBg, setRemovingBg] = useState<string | null>(null);
  const [originalImages, setOriginalImages] = useState<Record<string, string>>({});

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newPackshots: PackshotImage[] = [];
    
    Array.from(files).forEach((file) => {
      if (packshots.length + newPackshots.length >= maxPackshots) return;
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        newPackshots.push({
          id: Math.random().toString(36).substr(2, 9),
          dataUrl,
          file,
          backgroundRemoved: false,
          scale: 1.0,     // Default scale
          rotation: 0,    // Default rotation
          x: 50,          // Center horizontally (percentage)
          y: 50,          // Center vertically (percentage)
        });
        
        if (newPackshots.length === Math.min(files.length, maxPackshots - packshots.length)) {
          onPackshotsChange([...packshots, ...newPackshots]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveBackground = async (id: string) => {
    setRemovingBg(id);
    
    const packshot = packshots.find((p) => p.id === id);
    if (!packshot) {
      setRemovingBg(null);
      return;
    }

    // Store original image if not already stored
    if (!originalImages[id]) {
      setOriginalImages(prev => ({ ...prev, [id]: packshot.dataUrl }));
    }

    try {
      console.log('Starting background removal for:', packshot.file.name);
      
      const formData = new FormData();
      formData.append('image', packshot.file);

      const response = await fetch('/api/remove-bg', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (!response.ok) {
        console.error('Background removal API error:', data);
        alert(`Background removal failed: ${data.error || 'Unknown error'}\n${data.message || ''}`);
        setRemovingBg(null);
        return;
      }

      console.log('Background removal response:', data);
      
      // Update packshot with new image
      onPackshotsChange(
        packshots.map((p) =>
          p.id === id ? { 
            ...p, 
            dataUrl: data.imageUrl, 
            backgroundRemoved: !data.mock // Only mark as removed if not mock
          } : p
        )
      );
      
      // Show success message
      if (data.mock) {
        alert('Background removal is in mock mode. Add REMOVE_BG_API_KEY to .env.local for real removal.');
      } else {
        console.log('Background removed successfully!');
      }
      
    } catch (error) {
      console.error('Background removal error:', error);
      alert(`Background removal failed: ${error instanceof Error ? error.message : 'Unknown error'}\n\nCheck:\n1. REMOVE_BG_API_KEY in .env.local\n2. API key is valid\n3. You have credits remaining`);
    } finally {
      setRemovingBg(null);
    }
  };

  const handleRestoreBackground = (id: string) => {
    const originalImage = originalImages[id];
    if (!originalImage) return;

    onPackshotsChange(
      packshots.map((p) =>
        p.id === id ? { 
          ...p, 
          dataUrl: originalImage, 
          backgroundRemoved: false
        } : p
      )
    );
  };

  const handleRemovePackshot = (id: string) => {
    onPackshotsChange(packshots.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Product Images (Packshots) - Max {maxPackshots}
        </label>
        
        {packshots.length < maxPackshots && (
          <label className="cursor-pointer inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg font-medium">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileUpload}
              className="hidden"
            />
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Upload Images
          </label>
        )}
        
        {packshots.length >= maxPackshots && (
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg border border-red-200">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium">Maximum {maxPackshots} packshots reached</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {packshots.map((packshot) => (
          <div key={packshot.id} className="relative border-2 border-gray-200 rounded-xl p-4 bg-white hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md">
            <div className="flex gap-4">
              {/* Image Preview */}
              <div className="flex-shrink-0 w-32 h-32 bg-gray-50 rounded-lg p-2 flex items-center justify-center">
                <img
                  src={packshot.dataUrl}
                  alt="Packshot"
                  className="max-w-full max-h-full object-contain"
                  style={{
                    transform: `scale(${packshot.scale}) rotate(${packshot.rotation || 0}deg)`
                  }}
                />
              </div>
              
              {/* Controls */}
              <div className="flex-1 space-y-3">
                {/* Scale Control */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Scale: {packshot.scale.toFixed(1)}x
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="1.5"
                    step="0.1"
                    value={packshot.scale}
                    onChange={(e) => {
                      const newScale = parseFloat(e.target.value);
                      onPackshotsChange(
                        packshots.map((p) =>
                          p.id === packshot.id ? { ...p, scale: newScale } : p
                        )
                      );
                    }}
                    className="w-full"
                  />
                </div>
                
                {/* Rotation Control */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Rotation: {packshot.rotation || 0}°
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        const currentRotation = packshot.rotation || 0;
                        const newRotation = (currentRotation - 90) % 360;
                        onPackshotsChange(
                          packshots.map((p) =>
                            p.id === packshot.id ? { ...p, rotation: newRotation } : p
                          )
                        );
                      }}
                      className="flex-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition text-xs font-medium"
                    >
                      ↺ -90°
                    </button>
                    <button
                      onClick={() => {
                        onPackshotsChange(
                          packshots.map((p) =>
                            p.id === packshot.id ? { ...p, rotation: 0 } : p
                          )
                        );
                      }}
                      className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-xs font-medium"
                    >
                      Reset
                    </button>
                    <button
                      onClick={() => {
                        const currentRotation = packshot.rotation || 0;
                        const newRotation = (currentRotation + 90) % 360;
                        onPackshotsChange(
                          packshots.map((p) =>
                            p.id === packshot.id ? { ...p, rotation: newRotation } : p
                          )
                        );
                      }}
                      className="flex-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition text-xs font-medium"
                    >
                      ↻ +90°
                    </button>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-2">
                  {!packshot.backgroundRemoved && (
                    <button
                      onClick={() => handleRemoveBackground(packshot.id)}
                      disabled={removingBg === packshot.id}
                      className="flex-1 text-xs px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-sm hover:shadow"
                    >
                      {removingBg === packshot.id ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Removing...
                        </span>
                      ) : 'Remove BG'}
                    </button>
                  )}
                  
                  {packshot.backgroundRemoved && originalImages[packshot.id] && (
                    <>
                      <button
                        onClick={() => handleRestoreBackground(packshot.id)}
                        className="flex-1 text-xs px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium shadow-sm hover:shadow flex items-center justify-center gap-1"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                        </svg>
                        Restore BG
                      </button>
                      <button
                        onClick={() => handleRemoveBackground(packshot.id)}
                        disabled={removingBg === packshot.id}
                        className="flex-1 text-xs px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-sm hover:shadow flex items-center justify-center gap-1"
                      >
                        {removingBg === packshot.id ? (
                          <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Removing...
                          </span>
                        ) : (
                          <>
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Remove Again
                          </>
                        )}
                      </button>
                    </>
                  )}
                  
                  {packshot.backgroundRemoved && !originalImages[packshot.id] && (
                    <div className="flex-1 flex items-center justify-center gap-1 text-xs text-green-700 bg-green-50 py-2 rounded-lg font-medium">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      BG Removed
                    </div>
                  )}
                  
                  <button
                    onClick={() => handleRemovePackshot(packshot.id)}
                    className="flex-1 text-xs px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 font-medium shadow-sm hover:shadow"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
