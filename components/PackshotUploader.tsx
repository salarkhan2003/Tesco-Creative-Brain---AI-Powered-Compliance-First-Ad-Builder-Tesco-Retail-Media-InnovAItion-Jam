'use client';

import { PackshotImage } from '@/lib/types';
import { useState } from 'react';

interface Props {
  packshots: PackshotImage[];
  onPackshotsChange: (packshots: PackshotImage[]) => void;
  maxPackshots?: number;
  onCategoryDetected?: (category: string) => void;
}

interface PackshotAnalysis {
  productType: string;
  suggestedCategory: string;
  qualityScore: number;
  suggestions: string[];
}

export default function PackshotUploader({ packshots, onPackshotsChange, maxPackshots = 3, onCategoryDetected }: Props) {
  const [removingBg, setRemovingBg] = useState<string | null>(null);
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const [analyses, setAnalyses] = useState<Record<string, PackshotAnalysis>>({});
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
          scale: 1.0,
          rotation: 0,
          x: 50,
          y: 50,
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

    if (!originalImages[id]) {
      setOriginalImages((prev: Record<string, string>) => ({ ...prev, [id]: packshot.dataUrl }));
    }

    try {
      const formData = new FormData();
      formData.append('image', packshot.file);

      const response = await fetch('/api/remove-bg', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        alert(`Background removal failed: ${data.error || 'Unknown error'}`);
        setRemovingBg(null);
        return;
      }

      onPackshotsChange(
        packshots.map((p) =>
          p.id === id ? {
            ...p,
            dataUrl: data.imageUrl,
            backgroundRemoved: !data.mock
          } : p
        )
      );

      if (data.mock) {
        alert('Background removal is in mock mode. Add REMOVE_BG_API_KEY to .env.local for real removal.');
      }

    } catch (error) {
      console.error('Background removal error:', error);
      alert(`Background removal failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
    setAnalyses((prev: Record<string, PackshotAnalysis>) => {
      const newAnalyses = { ...prev };
      delete newAnalyses[id];
      return newAnalyses;
    });
  };

  const handleAnalyzePackshot = async (id: string) => {
    const packshot = packshots.find((p) => p.id === id);
    if (!packshot) return;

    setAnalyzingId(id);

    try {
      const formData = new FormData();
      formData.append('image', packshot.file);

      const response = await fetch('/api/packshot-analyze', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setAnalyses((prev: Record<string, PackshotAnalysis>) => ({ ...prev, [id]: data }));

      if (data.suggestedCategory && onCategoryDetected) {
        onCategoryDetected(data.suggestedCategory);
      }

    } catch (error) {
      console.error('Packshot analysis error:', error);
      setAnalyses((prev: Record<string, PackshotAnalysis>) => ({
        ...prev,
        [id]: {
          productType: 'Product',
          suggestedCategory: 'General',
          qualityScore: 75,
          suggestions: ['Analysis unavailable - check API configuration'],
        },
      }));
    } finally {
      setAnalyzingId(null);
    }
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

              <div className="flex-1 space-y-3">
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

                <div className="flex gap-2 flex-wrap">
                  {!packshot.backgroundRemoved && (
                    <button
                      onClick={() => handleRemoveBackground(packshot.id)}
                      disabled={removingBg === packshot.id}
                      className="flex-1 text-xs px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-sm hover:shadow"
                    >
                      {removingBg === packshot.id ? 'Removing...' : 'Remove BG'}
                    </button>
                  )}

                  {packshot.backgroundRemoved && originalImages[packshot.id] && (
                    <button
                      onClick={() => handleRestoreBackground(packshot.id)}
                      className="flex-1 text-xs px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium shadow-sm hover:shadow"
                    >
                      Restore BG
                    </button>
                  )}

                  {packshot.backgroundRemoved && (
                    <div className="flex items-center gap-1 text-xs text-green-700 bg-green-50 px-2 py-1 rounded-lg font-medium">
                      ✓ BG Removed
                    </div>
                  )}

                  <button
                    onClick={() => handleAnalyzePackshot(packshot.id)}
                    disabled={analyzingId === packshot.id}
                    className="flex-1 text-xs px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-sm hover:shadow"
                  >
                    {analyzingId === packshot.id ? 'Analyzing...' : '🤖 AI Analyze'}
                  </button>

                  <button
                    onClick={() => handleRemovePackshot(packshot.id)}
                    className="flex-1 text-xs px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 font-medium shadow-sm hover:shadow"
                  >
                    Remove
                  </button>
                </div>

                {analyses[packshot.id] && (
                  <div className="mt-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-bold text-purple-800">🤖 AI Analysis</span>
                    </div>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Product:</span>
                        <span className="font-medium text-gray-800">{analyses[packshot.id].productType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Category:</span>
                        <span className="font-medium text-purple-700">{analyses[packshot.id].suggestedCategory}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Quality:</span>
                        <div className="flex items-center gap-1">
                          <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                analyses[packshot.id].qualityScore >= 80 ? 'bg-green-500' :
                                analyses[packshot.id].qualityScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${analyses[packshot.id].qualityScore}%` }}
                            />
                          </div>
                          <span className="font-medium text-gray-800">{analyses[packshot.id].qualityScore}%</span>
                        </div>
                      </div>
                      {analyses[packshot.id].suggestions.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-purple-200">
                          <span className="text-gray-600 font-medium">Suggestions:</span>
                          <ul className="mt-1 space-y-0.5">
                            {analyses[packshot.id].suggestions.map((suggestion: string, idx: number) => (
                              <li key={idx} className="text-gray-700 flex items-start gap-1">
                                <span className="text-purple-500">•</span>
                                {suggestion}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

