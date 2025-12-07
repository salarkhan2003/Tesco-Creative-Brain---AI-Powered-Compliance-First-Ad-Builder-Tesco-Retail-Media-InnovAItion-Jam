'use client';

import { ProductCategory } from '@/lib/types';

interface Props {
  productName: string;
  description: string;
  category: ProductCategory;
  onProductNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onCategoryChange: (value: ProductCategory) => void;
}

const CATEGORIES: ProductCategory[] = [
  'Fresh Produce',
  'Snacking',
  'Beverages',
  'Alcohol',
  'Household',
  'Health & Beauty',
  'Bakery',
  'Frozen',
  'Other',
];

export default function ProductInfoForm({
  productName,
  description,
  category,
  onProductNameChange,
  onDescriptionChange,
  onCategoryChange,
}: Props) {
  return (
    <div className="space-y-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
      <h4 className="font-semibold text-sm text-purple-900 flex items-center gap-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        Product Information (for AI)
      </h4>
      
      <div>
        <label className="block text-xs font-semibold text-gray-800 mb-2">Product Name</label>
        <input
          type="text"
          value={productName}
          onChange={(e) => onProductNameChange(e.target.value)}
          placeholder="e.g., Fresh Organic Apples"
          className="w-full px-4 py-3 border-2 border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition text-sm bg-white text-gray-900 placeholder-gray-500 font-medium"
        />
      </div>
      
      <div>
        <label className="block text-xs font-semibold text-gray-800 mb-2">Description</label>
        <input
          type="text"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="e.g., Crisp, sweet, locally sourced"
          className="w-full px-4 py-3 border-2 border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition text-sm bg-white text-gray-900 placeholder-gray-500 font-medium"
        />
      </div>
      
      <div>
        <label className="block text-xs font-semibold text-gray-800 mb-2">Category</label>
        <select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value as ProductCategory)}
          className="w-full px-4 py-3 border-2 border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition text-sm bg-white text-gray-900 font-medium"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        
        {category === 'Alcohol' && (
          <div className="mt-2 flex items-start gap-2 p-2 bg-amber-50 border border-amber-200 rounded text-xs text-amber-800">
            <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Alcohol creative must include Drinkaware lock-up</span>
          </div>
        )}
      </div>
    </div>
  );
}
