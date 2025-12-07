# Tesco Retail Media Compliance Guide

## 🎯 Implementation Status

This prototype implements **comprehensive Tesco compliance rules** from the hackathon guidelines (Appendix A & B).

## ✅ Implemented Features

### 1. **Smart Auto-Layout Engine**
- **Automatic image positioning** when adding 2nd/3rd packshots
- **Professional compositions** following Tesco guidelines
- **Adaptive layouts** for both square (1080x1080) and vertical (1080x1920) formats

#### Layout Patterns:
- **1 Image**: Large centered hero packshot
- **2 Images**: 
  - Square: Side-by-side with 15% overlap
  - Vertical: Stacked vertically with 15% overlap
- **3 Images**:
  - Square: Hero center + 2 smaller on sides
  - Vertical: Hero top + 2 smaller below

### 2. **Compliance Checking (Hard Fails)**

#### Forbidden Text Patterns:
- ❌ Price callouts: "% off", "discount", "deal", "£X"
- ❌ Superlatives: "best price", "lowest price", "cheapest"
- ❌ Sustainability claims: "eco-friendly", "sustainable", "green"
- ❌ Competitions: "win", "competition", "prize"
- ❌ Charity partnerships: "charity", "donate"
- ❌ Money-back guarantees: "money-back", "guarantee"
- ❌ Unproven claims: "best", "perfect", "#1"
- ❌ T&Cs: asterisks, "terms apply"

#### Format Rules:
- ✅ Maximum 3 packshots
- ✅ Minimum font size: 20px (social), 10px (checkout single)
- ✅ Safe zones: 200px top, 250px bottom (vertical format)
- ✅ WCAG AA contrast: 4.5:1 minimum ratio
- ✅ Value tile: Predefined position, cannot be moved
- ✅ No overlapping with value tile

#### Alcohol-Specific:
- ✅ Drinkaware lock-up required (minimum 20px height)
- ✅ Must be black or white only
- ✅ Sufficient contrast from background

### 3. **Image Manipulation Features**

#### Background Removal:
- ✅ Real API integration (remove.bg)
- ✅ Retry logic (3 attempts with exponential backoff)
- ✅ Undo/Redo functionality
- ✅ Original image preservation

#### Image Adjustments:
- ✅ Scale: 0.5x - 1.5x
- ✅ Rotation: -90°, 0°, +90°
- ✅ Applied to canvas and exports
- ✅ Real-time preview

### 4. **Canvas Controls**
- ✅ Zoom: 50% - 150%
- ✅ Grid overlay (50px minor, 100px major)
- ✅ Safe zone visualization
- ✅ Real-time updates

### 5. **AI-Powered Features**

#### Headline Generation (Gemini API):
- ✅ Compliance-aware suggestions
- ✅ Category-specific tone
- ✅ Rewrite non-compliant text
- ✅ 3 variations per request

#### Smart Layout:
- ✅ Automatic packshot positioning
- ✅ Headline placement avoiding packshots
- ✅ Value tile collision avoidance
- ✅ Safe zone compliance

### 6. **Export Features**
- ✅ PNG format (high quality)
- ✅ Multiple sizes: 1080x1080, 1080x1920
- ✅ No safe zones/grid in exports
- ✅ Full resolution output

## 📋 Tesco Guidelines Implemented

### Appendix A - Element Rules

| Element | Rule | Status |
|---------|------|--------|
| **Tags** | Must use approved Tesco tags | ✅ Validated |
| **Safe Zones** | 200px top, 250px bottom (9:16) | ✅ Enforced |
| **Value Tile** | Predefined position, no overlap | ✅ Enforced |
| **Headline** | Appears on all banners | ✅ Required |
| **Packshot** | Maximum 3 packshots | ✅ Enforced |
| **Background** | Flat color or single image | ✅ Supported |

### Appendix B - Compliance Rules

| Rule Type | Detail | Severity | Status |
|-----------|--------|----------|--------|
| **Alcohol** | Drinkaware lock-up required | Hard fail | ✅ Checked |
| **Copy - T&Cs** | No T&Cs allowed | Hard fail | ✅ Blocked |
| **Copy - Competitions** | Not allowed | Hard fail | ✅ Blocked |
| **Copy - Sustainability** | No green claims | Hard fail | ✅ Blocked |
| **Copy - Charity** | Not allowed | Hard fail | ✅ Blocked |
| **Copy - Price** | No price callouts | Hard fail | ✅ Blocked |
| **Copy - Guarantees** | No money-back | Hard fail | ✅ Blocked |
| **Copy - Claims** | No unproven claims | Hard fail | ✅ Blocked |
| **Design - Value Tile** | Correct size/position | Hard fail | ✅ Enforced |
| **Format - Safe Zone** | Text-free zones | Hard fail | ✅ Enforced |
| **Accessibility - Font** | Minimum 20px (social) | Hard fail | ✅ Enforced |
| **Accessibility - Contrast** | WCAG AA (4.5:1) | Hard fail | ✅ Checked |
| **Packshot - Count** | Maximum 3 | Hard fail | ✅ Enforced |

## 🚀 How It Works

### Auto-Layout Algorithm:

```typescript
1. Analyze packshot count (1, 2, or 3)
2. Calculate optimal positions based on:
   - Ad size (square vs vertical)
   - Safe zones (top/bottom exclusions)
   - Value tile position
   - Professional spacing
3. Apply transformations (scale, rotation)
4. Adjust for value tile collision
5. Position headline above packshots
6. Validate compliance
```

### Compliance Validation:

```typescript
1. Text Analysis:
   - Scan for forbidden patterns (regex)
   - Check against 50+ compliance rules
   - Return violations with severity

2. Layout Analysis:
   - Check safe zone violations
   - Validate font sizes
   - Check contrast ratios
   - Verify packshot count

3. Real-time Feedback:
   - Red errors (hard fails)
   - Yellow warnings (soft fails)
   - Green success indicators
```

## 🎨 Usage Examples

### Adding Multiple Images:
1. Upload 1st image → Auto-positioned as hero
2. Upload 2nd image → Auto-positioned with overlap
3. Upload 3rd image → Auto-arranged in professional layout
4. All images respect safe zones and value tile

### Compliance Checking:
```
❌ "50% off best price" → BLOCKED
✅ "Fresh Quality Products" → APPROVED

❌ Font size 12px → ERROR
✅ Font size 24px → APPROVED

❌ Text at 150px from top → SAFE ZONE VIOLATION
✅ Text at 250px from top → APPROVED
```

### AI Headline Generation:
```
Input: "Organic Apples, Fresh from local farms"
Output:
1. "Fresh Quality Apples"
2. "Crisp Local Apples"
3. "Farm Fresh Apples"

All outputs are pre-validated for compliance!
```

## 🔧 Technical Implementation

### Files Created:
- `lib/tesco-compliance-rules.ts` - Comprehensive rule definitions
- `lib/smart-layout.ts` - Auto-layout engine
- Enhanced `lib/layout.ts` - Integration layer
- Enhanced `lib/compliance.ts` - Validation engine

### API Integrations:
- **Gemini 2.0 Flash** - AI headline generation
- **remove.bg** - Background removal
- Both with retry logic and error handling

### Key Algorithms:
- **Smart positioning** - Calculates optimal packshot positions
- **Collision detection** - Avoids value tile overlaps
- **Safe zone validation** - Ensures text placement compliance
- **Contrast calculation** - WCAG AA compliance checking

## 📊 Compliance Score

The tool provides real-time compliance scoring:
- **Green (100%)**: All checks passed
- **Yellow (50-99%)**: Warnings present
- **Red (0-49%)**: Hard fails present

## 🎯 Hackathon Requirements Met

✅ Import packshots and backgrounds
✅ Remove background (with undo/redo)
✅ Resize and rotate images
✅ Compose creative using all assets
✅ Professional and visually appealing
✅ Suggest similar creatives (AI-powered)
✅ Comply with retailer guidelines
✅ Support multiple formats (1080x1080, 1080x1920)
✅ Download in PNG format
✅ Minimize manual intervention

### Stretch Goals:
✅ AI-driven adaptive resizing
✅ Intelligent guideline validation
✅ Auto-generate campaign-ready sets

## 🏆 Innovation Highlights

1. **Zero-config compliance** - Rules enforced automatically
2. **Smart auto-layout** - Professional compositions without design skills
3. **AI-powered suggestions** - Compliance-aware headline generation
4. **Real-time validation** - Instant feedback on violations
5. **Undo/Redo system** - Non-destructive editing workflow
6. **Multi-format support** - One design, multiple outputs

---

**Ready for Demo!** All mandatory Tesco requirements implemented with AI-powered enhancements.
