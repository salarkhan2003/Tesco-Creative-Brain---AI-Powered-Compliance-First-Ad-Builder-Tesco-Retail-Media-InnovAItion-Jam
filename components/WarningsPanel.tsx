'use client';

import { ComplianceWarning } from '@/lib/types';

interface Props {
  warnings: ComplianceWarning[];
}

export default function WarningsPanel({ warnings }: Props) {
  if (warnings.length === 0) {
    return (
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-md">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <span className="text-green-900 font-bold text-lg">All compliance checks passed!</span>
            <p className="text-green-700 text-sm mt-1">Your creative meets all Tesco brand guidelines</p>
          </div>
        </div>
      </div>
    );
  }

  const errors = warnings.filter((w) => w.severity === 'error');
  const warningsOnly = warnings.filter((w) => w.severity === 'warning');

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
        <svg className="w-6 h-6 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        Compliance Issues
      </h3>
      
      {errors.length > 0 && (
        <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-300 rounded-xl p-5 shadow-sm">
          <h4 className="font-bold text-red-900 mb-3 flex items-center gap-2 text-base">
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            Errors ({errors.length})
          </h4>
          <ul className="space-y-2">
            {errors.map((warning, index) => (
              <li key={index} className="text-sm text-red-800 flex items-start gap-3 bg-white bg-opacity-50 p-3 rounded-lg">
                <span className="flex-shrink-0 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold">!</span>
                <span className="font-medium">{warning.message}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {warningsOnly.length > 0 && (
        <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-300 rounded-xl p-5 shadow-sm">
          <h4 className="font-bold text-yellow-900 mb-3 flex items-center gap-2 text-base">
            <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            Warnings ({warningsOnly.length})
          </h4>
          <ul className="space-y-2">
            {warningsOnly.map((warning, index) => (
              <li key={index} className="text-sm text-yellow-800 flex items-start gap-3 bg-white bg-opacity-50 p-3 rounded-lg">
                <span className="flex-shrink-0 w-5 h-5 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xs font-bold">⚠</span>
                <span className="font-medium">{warning.message}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
