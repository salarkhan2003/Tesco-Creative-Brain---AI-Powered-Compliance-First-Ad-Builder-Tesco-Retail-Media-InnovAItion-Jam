# Tesco Creative Brain 🧠

A professional SaaS-style compliance-first retail media creative builder for Tesco. This prototype features WYSIWYG canvas editing, AI-powered headline generation via Google Gemini, real-time compliance checking, and multi-size creative export.

## Overview

This tool helps Tesco retail media teams create compliant ad creatives by:
- Automatically arranging product packshots and text
- Running real-time compliance checks against Tesco brand guidelines
- Enforcing safe zones for different ad formats
- Exporting production-ready creatives in multiple sizes

## ✨ Features

### 🎨 WYSIWYG Creative Editor
- **Precise Packshot Control**: Scale (0.5x-1.5x) and position (X/Y percentage) each product image
- **Advanced Text Styling**: Font size, family, color, alignment, and vertical positioning
- **Real-Time Preview**: See exactly what you'll export - no surprises
- **Multi-Size Support**: Switch between 1080×1080 (square) and 1080×1920 (vertical) formats

### 🤖 AI-Powered Headlines (Google Gemini)
- **Smart Generation**: Create Tesco-compliant headlines from product descriptions
- **Intelligent Rewriting**: Fix non-compliant headlines automatically
- **Context-Aware**: Uses product name and description for relevant suggestions
- **One-Click Apply**: Select and use AI suggestions instantly

### ✅ Real-Time Compliance Engine
- **Forbidden Text Detection**: Catches price claims, unsubstantiated environmental claims, superlatives
- **Safe Zone Validation**: Ensures text stays out of platform UI areas
- **Font Size Enforcement**: Minimum 16px for readability
- **Packshot Limits**: Maximum 3 images per creative
- **Visual Warnings**: Color-coded error and warning panels

### 📤 Professional Export
- **Pixel-Perfect Output**: Exported PNG matches preview exactly
- **Multiple Formats**: 1080×1080 (square/feed) and 1080×1920 (vertical/story)
- **Production-Ready**: No safe zone guides in final export
- **Instant Download**: One-click PNG generation

### Tesco Compliance Rules Implemented

1. **Forbidden Text Patterns**
   - No price claims ("50% off", "discount", "£10")
   - No unsubstantiated environmental claims ("eco-friendly")
   - No superlative price claims ("best price")

2. **Safe Zones**
   - 1080×1920: Top 200px and bottom 250px reserved
   - 1080×1080: Top 80px and bottom 80px reserved

3. **Brand Guidelines**
   - Minimum font size: 16px
   - Maximum 3 packshots per creative
   - Elements must stay within canvas bounds

## 🚀 Getting Started

### Prerequisites
- **Node.js 18+** installed
- **npm** or **yarn** package manager
- (Optional) **Google Gemini API key** for AI features
- (Optional) **Remove.bg API key** for background removal

### Quick Start

1. **Navigate to project directory**:
```bash
cd tesco-creative-brain
```

2. **Install dependencies**:
```bash
npm install
```

3. **Configure API keys** (optional but recommended):
```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your API keys:
```env
# Google Gemini API Key (for AI headline generation)
GEMINI_API_KEY=your_gemini_api_key_here

# Remove.bg API Key (for background removal)
REMOVE_BG_API_KEY=your_remove_bg_key_here
```

**Get API Keys**:
- **Gemini**: https://aistudio.google.com/app/apikey (Free tier available)
- **Remove.bg**: https://www.remove.bg/api (Free tier: 50 images/month)

**Note**: The app works without API keys:
- Without Gemini: Provides fallback headline suggestions
- Without Remove.bg: Returns original images (mock mode)

4. **Run the development server**:
```bash
npm run dev
```

5. **Open in browser**: [http://localhost:3000](http://localhost:3000)

## 📖 Usage Guide

### Creating Your First Creative

1. **Upload Product Images**
   - Click "Upload Images" to add 1-3 packshot images
   - Adjust each image's scale and position using sliders
   - Optional: Click "Remove BG" for transparent backgrounds

2. **Add Product Information** (for AI)
   - Enter product name (e.g., "Fresh Organic Apples")
   - Add description (e.g., "Crisp, sweet, locally sourced")

3. **Create Your Headline**
   - **Manual**: Type directly in the headline field
   - **AI-Powered**: Click "Generate New" for AI suggestions
   - **Rewrite**: Click "Rewrite Current" to make existing text compliant

4. **Style Your Text**
   - Choose font size (16px - 48px)
   - Select font family (Arial, Helvetica, etc.)
   - Pick text color (presets or custom)
   - Set alignment (left, center, right)
   - Adjust vertical position with slider

5. **Choose Background**
   - Select from Tesco brand colors
   - Or use custom color picker

6. **Preview & Check Compliance**
   - Switch between 1080×1080 and 1080×1920 formats
   - Review compliance warnings (if any)
   - Adjust until all checks pass ✅

7. **Export Production-Ready Creatives**
   - Click "Download 1080×1080" for square format
   - Click "Download 1080×1920" for vertical/story format
   - Files are ready for immediate use!

### 🧪 Testing Compliance Features

Try these to see the compliance engine in action:

**Forbidden Text Detection**:
- Type "50% off" → Price claim warning
- Type "best price ever" → Superlative claim warning
- Type "eco-friendly" → Unsubstantiated environmental claim

**Safe Zone Violations**:
- Move text slider to extreme top or bottom
- Watch for safe zone warnings

**Packshot Limits**:
- Try uploading 4+ images → Limit warning

**Font Size**:
- Select 16px (minimum allowed)
- Compliance engine validates in real-time

### 🤖 Using AI Features

**Generate Fresh Headlines**:
1. Fill in product name and description
2. Click "Generate New"
3. Review 3 AI-generated Tesco-compliant options
4. Click any suggestion to use it

**Rewrite for Compliance**:
1. Type a headline (even non-compliant)
2. Click "Rewrite Current"
3. Get 3 compliant alternatives
4. Select the best one

## Project Structure

```
tesco-creative-brain/
├── app/
│   ├── api/
│   │   └── remove-bg/
│   │       └── route.ts          # Background removal API endpoint
│   ├── page.tsx                   # Main application page
│   ├── layout.tsx                 # Root layout
│   └── globals.css                # Global styles
├── components/
│   ├── BackgroundControls.tsx     # Background color selector
│   ├── CanvasPreview.tsx          # Canvas rendering component
│   ├── ExportButtons.tsx          # Export functionality
│   ├── HeadlineControls.tsx       # Headline and font controls
│   ├── PackshotUploader.tsx       # Image upload and management
│   └── WarningsPanel.tsx          # Compliance warnings display
├── lib/
│   ├── canvas.ts                  # Canvas drawing utilities
│   ├── compliance.ts              # Compliance checking engine
│   ├── layout.ts                  # Layout generation logic
│   └── types.ts                   # TypeScript type definitions
└── README.md
```

## Technical Architecture

### Frontend
- **Next.js 14** with App Router
- **React 18** with hooks for state management
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **HTML5 Canvas** for rendering and export

### Backend
- **Next.js API Routes** for background removal proxy
- **Environment variables** for API key management
- **Error handling** with proper HTTP status codes

### Key Design Decisions

1. **Client-Side Rendering**: Canvas operations run in the browser for instant feedback
2. **In-Memory State**: No database needed for hackathon prototype
3. **Modular Compliance Engine**: Easy to extend with new rules
4. **Deterministic Layouts**: Consistent positioning across renders
5. **Mock Mode Support**: Works without external API dependencies

## Extending the Compliance Engine

To add new compliance rules, edit `lib/compliance.ts`:

```typescript
// Example: Add new forbidden pattern
const FORBIDDEN_PATTERNS = [
  // ... existing patterns
  { pattern: /new-pattern/i, message: 'Your warning message' },
];

// Example: Add new check function
export function checkNewRule(params): ComplianceWarning[] {
  const warnings: ComplianceWarning[] = [];
  // Your validation logic
  return warnings;
}

// Add to runComplianceChecks()
export function runComplianceChecks(...) {
  // ... existing checks
  warnings.push(...checkNewRule(params));
  return warnings;
}
```

## Future Production Enhancements

To transform this prototype into a production Tesco retail media platform:

### Infrastructure & Scalability
- **Database**: PostgreSQL for storing creative templates, user projects, and audit logs
- **Cloud Storage**: S3/Azure Blob for packshot images and exported creatives
- **CDN**: CloudFront/Azure CDN for fast asset delivery globally
- **Caching**: Redis for session management and frequently accessed templates

### Authentication & Authorization
- **SSO Integration**: Tesco employee authentication via Azure AD/Okta
- **Role-Based Access**: Different permissions for designers, approvers, and admins
- **Audit Trail**: Track all creative changes and compliance decisions

### Advanced Features
- **AI-Powered Layout**: Machine learning for optimal element positioning
- **Brand Asset Library**: Centralized repository of approved Tesco assets
- **Batch Processing**: Generate multiple creative variations simultaneously
- **A/B Testing Integration**: Connect to Tesco's campaign management platform
- **Real-Time Collaboration**: Multiple users editing creatives simultaneously
- **Version History**: Track and revert creative changes
- **Approval Workflows**: Multi-stage review process with notifications

### Compliance & Governance
- **Extended Rule Engine**: Support for regional regulations (ASA, FTC, etc.)
- **Dynamic Rules**: Update compliance rules without code deployment
- **Legal Review Queue**: Flag creatives requiring legal approval
- **Automated Reporting**: Compliance dashboards and violation analytics

### Integration
- **Tesco Booking Platform**: Direct creative submission to media buying system
- **DAM Integration**: Connect to Tesco's Digital Asset Management system
- **Analytics**: Track creative performance and compliance metrics
- **API for Partners**: Allow agencies to programmatically generate compliant creatives

### Performance & Reliability
- **Server-Side Rendering**: Faster initial page loads
- **Background Jobs**: Queue-based processing for heavy operations
- **Monitoring**: Application performance monitoring (APM) and error tracking
- **Load Balancing**: Handle high traffic during campaign launches
- **Disaster Recovery**: Automated backups and failover systems

### Enhanced UX
- **Template Library**: Pre-approved layouts for common use cases
- **Drag-and-Drop Editor**: Manual element positioning with snap-to-grid
- **Animation Support**: Video and animated creative formats
- **Mobile App**: iOS/Android apps for on-the-go creative review
- **Accessibility**: WCAG 2.1 AA compliance for all user interfaces

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `REMOVE_BG_API_KEY` | No | API key for remove.bg service. App works in mock mode without it. |

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Canvas**: HTML5 Canvas API
- **Background Removal**: remove.bg API (optional)

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## License

This is a hackathon prototype for demonstration purposes.

## Support

For questions or issues, please contact the development team.
