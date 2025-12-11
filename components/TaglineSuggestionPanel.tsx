'use client';

import { useState } from 'react';

interface Props {
  productName: string;
  productCategory: string;
  currentTagline: string;
  onSelectTagline: (tagline: string) => void;
}

export default function TaglineSuggestionPanel({
  productName,
  productCategory,
  currentTagline,
  onSelectTagline,
}: Props) {
  const [taglines, setTaglines] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateTaglines = async (rewrite: boolean = false) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/gemini-taglines', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productName: productName || 'Product',
          productCategory: productCategory || 'General',
          currentTagline: rewrite ? currentTagline : undefined,
        }),
      });

      const data = await response.json();

      if (data.error && !data.taglines) {
        setError(data.error);
      } else {
        setTaglines(data.taglines || []);
      }
    } catch (err) {
      setError('Failed to generate taglines. Please try again.');
      console.error('AI generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="font-bold text-gray-800">Tagline Suggestions (Gemini)</h3>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => generateTaglines(false)}
          disabled={loading}
          className="flex-1 px-4 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:from-cyan-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-md hover:shadow-lg flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              Generate New
            </>
          )}
        </button>

        {currentTagline && (
          <button
            onClick={() => generateTaglines(true)}
            disabled={loading}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-teal-600 to-green-600 text-white rounded-lg hover:from-teal-700 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Rewriting...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Rewrite Current
              </>
            )}
          </button>
        )}
      </div>

      {error && (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
          {error}
        </div>
      )}

      {taglines.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-600">Tesco-Compliant Taglines:</p>
          {taglines.map((tagline, index) => (
            <div
              key={index}
              className="group p-4 bg-gradient-to-r from-cyan-50 to-blue-50 border-2 border-cyan-200 rounded-lg hover:border-cyan-400 transition-all duration-200 cursor-pointer"
              onClick={() => onSelectTagline(tagline)}
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-medium text-gray-800 flex-1">{tagline}</p>
                <button
                  className="flex-shrink-0 px-3 py-1 bg-cyan-600 text-white text-xs rounded-md hover:bg-cyan-700 transition opacity-0 group-hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectTagline(tagline);
                  }}
                >
                  Use This
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {taglines.length === 0 && !loading && (
        <div className="p-6 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg text-center">
          <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          <p className="text-sm text-gray-600">
            Click &quot;Generate New&quot; to get AI-powered Tesco-compliant taglines
          </p>
        </div>
      )}
    </div>
  );
}
