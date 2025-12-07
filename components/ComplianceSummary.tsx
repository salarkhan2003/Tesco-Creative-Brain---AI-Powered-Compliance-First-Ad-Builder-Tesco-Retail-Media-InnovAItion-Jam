'use client';

import { ComplianceWarning } from '@/lib/types';

interface Props {
  warnings: ComplianceWarning[];
}

export default function ComplianceSummary({ warnings }: Props) {
  const errors = warnings.filter((w) => w.severity === 'error');
  const warningsOnly = warnings.filter((w) => w.severity === 'warning');
  
  if (warnings.length === 0) {
    return (
      <div className="p-4 bg-green-50 border-2 border-green-200 rounded-lg">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-green-900 text-lg">All Checks Passed!</h3>
            <p className="text-sm text-green-700 mt-1">
              Your creative meets all Tesco brand guidelines (prototype)
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-3">
      {errors.length > 0 && (
        <div className="p-4 bg-red-50 border-2 border-red-200 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-red-900 mb-2">{errors.length} Error{errors.length > 1 ? 's' : ''}</h4>
              <ul className="space-y-1">
                {errors.map((error, index) => (
                  <li key={index} className="text-sm text-red-800 flex items-start gap-2">
                    <span className="text-red-500 font-bold">•</span>
                    <span>{error.message}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
      
      {warningsOnly.length > 0 && (
        <div className="p-4 bg-amber-50 border-2 border-amber-200 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-amber-900 mb-2">{warningsOnly.length} Warning{warningsOnly.length > 1 ? 's' : ''}</h4>
              <ul className="space-y-1">
                {warningsOnly.map((warning, index) => (
                  <li key={index} className="text-sm text-amber-800 flex items-start gap-2">
                    <span className="text-amber-500 font-bold">•</span>
                    <span>{warning.message}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
