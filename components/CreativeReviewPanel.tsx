'use client';

import { useState } from 'react';
import { ComplianceWarning } from '@/lib/types';

interface Props {
  headline: string;
  category?: string;
  warnings: ComplianceWarning[];
  layoutSummary: {
    format: 'square' | 'vertical';
    hasSafeZoneViolations: boolean;
    numPackshots: number;
    hasAlcoholCategory: boolean;
    hasHumanFlag: boolean;
    contrastIssue: boolean;
  };
}

interface ReviewResult {
  status: 'ready' | 'not_ready' | 'unknown';
  summary: string;
  suggestions: string[];
}

export default function CreativeReviewPanel({
  headline,
  category,
  warnings,
  layoutSummary,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [review, setReview] = useState<ReviewResult | null>(null);

  const handleRunReview = async () => {
    // Validate packshots before review
    if (layoutSummary.numPackshots === 0) {
      setReview({
        status: 'not_ready',
        summary: 'Please upload at least one packshot image to create your creative.',
        suggestions: [
          'Upload 1-3 product images using the "Upload Images" button',
          'Packshots are required for Tesco creatives',
        ],
      });
      return;
    }

    setLoading(true);
    setReview(null);

    try {
      const response = await fetch('/api/creative-review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          headline,
          category,
          warnings: warnings.map(w => ({
            message: w.message,
            severity: w.severity,
            source: w.type,
          })),
          layoutSummary,
        }),
      });

      const data = await response.json();
      setReview(data);
    } catch (error) {
      console.error('Review error:', error);
      setReview({
        status: 'unknown',
        summary: 'Failed to get AI review. Please try again.',
        suggestions: ['Check your internet connection', 'Verify API configuration'],
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-3">
        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
          <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        AI Creative Review
      </h2>

      <button
        onClick={handleRunReview}
        disabled={loading}
        className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Analyzing Creative...
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            Run AI Review
          </>
        )}
      </button>

      {!review && !loading && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600 text-center">
            Run the AI reviewer to get expert feedback on your current creative.
          </p>
        </div>
      )}

      {review && (
        <div className="mt-6 space-y-4">
          {/* Status Badge */}
          <div className="flex items-center gap-3">
            {review.status === 'ready' && (
              <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full font-semibold">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Production Ready
              </div>
            )}
            {review.status === 'not_ready' && (
              <div className="flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-800 rounded-full font-semibold">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Needs Improvement
              </div>
            )}
            {review.status === 'unknown' && (
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-800 rounded-full font-semibold">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Review Unavailable
              </div>
            )}
          </div>

          {/* Summary */}
          <div className={`p-4 rounded-lg border-2 ${
            review.status === 'ready' 
              ? 'bg-green-50 border-green-200' 
              : review.status === 'not_ready'
              ? 'bg-amber-50 border-amber-200'
              : 'bg-gray-50 border-gray-200'
          }`}>
            <p className="text-sm font-medium text-gray-800">
              {review.summary}
            </p>
          </div>

          {/* Suggestions */}
          {review.suggestions && review.suggestions.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Recommendations:
              </h3>
              <ul className="space-y-2">
                {review.suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-700 bg-white p-3 rounded-lg border border-gray-200">
                    <span className="flex-shrink-0 w-5 h-5 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                      {index + 1}
                    </span>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
