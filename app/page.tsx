'use client';

import { useState, useMemo } from 'react';
import { AdSize, PackshotImage, ComplianceWarning, ProductCategory, LayoutMode } from '@/lib/types';
import { runComplianceChecks } from '@/lib/compliance';
import { generateLayout } from '@/lib/layout';
import PackshotUploader from '@/components/PackshotUploader';
import HeadlineControls from '@/components/HeadlineControls';
import BackgroundControls from '@/components/BackgroundControls';
import CanvasPreview from '@/components/CanvasPreview';
import WarningsPanel from '@/components/WarningsPanel';
import ExportButtons from '@/components/ExportButtons';
import AISuggestionsPanel from '@/components/AISuggestionsPanel';
import ProductInfoForm from '@/components/ProductInfoForm';
import LayoutModeToggle from '@/components/LayoutModeToggle';
import CanvasToolbar from '@/components/CanvasToolbar';
import ComplianceSummary from '@/components/ComplianceSummary';

export default function Home() {
  // Creative state
  const [packshots, setPackshots] = useState<PackshotImage[]>([]);
  const [headline, setHeadline] = useState('Fresh Quality Products at Great Value');
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
  const [fontSize, setFontSize] = useState(32);
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>('center');
  const [textColor, setTextColor] = useState('#000000');
  const [activeTab, setActiveTab] = useState<AdSize>('1080x1080');

  // Product info for AI
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ProductCategory>('Fresh Produce');
  
  // Layout mode
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('auto');
  
  // Canvas controls
  const [showSafeZones, setShowSafeZones] = useState(true);
  const [showGrid, setShowGrid] = useState(false);
  const [zoom, setZoom] = useState(100);

  // Generate layout for compliance checks
  const layout = useMemo(
    () => generateLayout(activeTab, packshots, headline, fontSize, layoutMode),
    [activeTab, packshots, headline, fontSize, layoutMode]
  );

  // Run compliance checks with enhanced options
  const warnings = useMemo<ComplianceWarning[]>(() => {
    const headlineElement = layout.elements.find((e) => e.type === 'headline');
    const packshotElements = layout.elements.filter((e) => e.type === 'packshot');

    if (!headlineElement) return [];

    return runComplianceChecks(
      headline,
      packshots.length,
      fontSize,
      headlineElement.position,
      packshotElements.map((e) => e.position),
      activeTab,
      {
        textColor,
        backgroundColor,
        category,
        packshots: packshots.map(p => ({ containsHuman: p.containsHuman })),
      }
    );
  }, [headline, packshots, fontSize, layout, activeTab, backgroundColor, category, textColor]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white py-8 shadow-2xl border-b-4 border-red-600">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <img
                src="/logo.png"
                alt="Tesco Creative Brain Logo"
                className="h-16 w-16 object-contain bg-white rounded-xl p-2 shadow-lg"
              />
              <div>
                <h1 className="text-4xl font-bold tracking-tight">Tesco Creative Brain</h1>
                <p className="text-blue-100 mt-1 text-lg">AI-Powered Compliance-First Ad Builder</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-red-600 px-4 py-2 rounded-full shadow-lg border-2 border-white">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="font-bold text-sm whitespace-nowrap">Tesco Retail Media InnovAItion Jam</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-10">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column: Controls */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                </div>
                Creative Controls
              </h2>

              <div className="space-y-8">
                <PackshotUploader
                  packshots={packshots}
                  onPackshotsChange={setPackshots}
                  maxPackshots={3}
                />

                <div className="border-t border-gray-200"></div>

                <ProductInfoForm
                  productName={productName}
                  description={description}
                  category={category}
                  onProductNameChange={setProductName}
                  onDescriptionChange={setDescription}
                  onCategoryChange={setCategory}
                />

                <div className="border-t border-gray-200"></div>

                <HeadlineControls
                  headline={headline}
                  onHeadlineChange={setHeadline}
                  fontSize={fontSize}
                  onFontSizeChange={setFontSize}
                  textAlign={textAlign}
                  onTextAlignChange={setTextAlign}
                  textColor={textColor}
                  onTextColorChange={setTextColor}
                />

                <div className="border-t border-gray-200"></div>

                {/* AI Suggestions */}
                <AISuggestionsPanel
                  productName={productName}
                  description={description}
                  currentHeadline={headline}
                  onSelectHeadline={setHeadline}
                />

                <div className="border-t border-gray-200"></div>

                <BackgroundControls
                  backgroundColor={backgroundColor}
                  onBackgroundColorChange={setBackgroundColor}
                />

                <div className="border-t border-gray-200"></div>

                <LayoutModeToggle
                  mode={layoutMode}
                  onModeChange={setLayoutMode}
                />
              </div>
            </div>
          </div>

          {/* Right Column: Preview & Export */}
          <div className="space-y-6">
            {/* Preview Tabs */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                Live Preview
              </h2>

              <div className="flex gap-3 mb-6">
                <button
                  onClick={() => setActiveTab('1080x1080')}
                  className={`flex-1 px-5 py-3 rounded-xl font-semibold transition-all duration-200 ${activeTab === '1080x1080'
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg transform scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  <div className="text-base">1080×1080</div>
                  <div className="text-xs opacity-80 mt-1">Square</div>
                </button>
                <button
                  onClick={() => setActiveTab('1080x1920')}
                  className={`flex-1 px-5 py-3 rounded-xl font-semibold transition-all duration-200 ${activeTab === '1080x1920'
                      ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg transform scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  <div className="text-base">1080×1920</div>
                  <div className="text-xs opacity-80 mt-1">Vertical</div>
                </button>
              </div>

              <CanvasToolbar
                showSafeZones={showSafeZones}
                showGrid={showGrid}
                zoom={zoom}
                onShowSafeZonesChange={setShowSafeZones}
                onShowGridChange={setShowGrid}
                onZoomChange={setZoom}
              />

              <CanvasPreview
                adSize={activeTab}
                packshots={packshots}
                headline={headline}
                backgroundColor={backgroundColor}
                fontSize={fontSize}
                textAlign={textAlign}
                textColor={textColor}
                showSafeZones={showSafeZones}
                showGrid={showGrid}
                zoom={zoom}
              />

              <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-600 bg-gray-50 py-2 px-4 rounded-lg">
                <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Red zones indicate safe areas where text should not appear</span>
              </div>
            </div>

            {/* Compliance Warnings */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                Compliance Status
              </h2>
              <ComplianceSummary warnings={warnings} />
            </div>

            {/* Export Buttons */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <ExportButtons
                packshots={packshots}
                headline={headline}
                backgroundColor={backgroundColor}
                fontSize={fontSize}
                textAlign={textAlign}
                textColor={textColor}
              />
            </div>
          </div>
        </div>

        {/* Info Footer */}
        <div className="mt-10 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-2 border-blue-200 rounded-2xl p-8 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-md">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-xl text-blue-900 mb-3">About This Prototype</h3>
              <p className="text-sm text-gray-700 leading-relaxed mb-4">
                This is a hackathon prototype demonstrating Tesco&apos;s compliance-first approach to retail media creative generation.
                The tool uses <strong>Google Gemini AI</strong> to generate compliant headlines and automatically checks for brand guideline violations, safe zone issues, and regulatory compliance in real-time.
              </p>
              <div className="bg-white bg-opacity-60 rounded-lg p-4 border border-blue-200">
                <p className="text-sm font-semibold text-blue-900 mb-2">🤖 Try AI Features:</p>
                <ul className="text-xs text-gray-700 space-y-1 ml-4 mb-3">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-purple-600 rounded-full"></span>
                    Enter product name and description
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-purple-600 rounded-full"></span>
                    Click &quot;Generate New&quot; for AI headlines
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-purple-600 rounded-full"></span>
                    Click &quot;Rewrite Current&quot; to fix non-compliant text
                  </li>
                </ul>
                <p className="text-sm font-semibold text-blue-900 mb-2 mt-3">💡 Try Compliance Checks:</p>
                <ul className="text-xs text-gray-700 space-y-1 ml-4">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                    Type &quot;50% off best price&quot; in the headline
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                    Select Small (16px) font size
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                    Try uploading more than 3 packshots
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
