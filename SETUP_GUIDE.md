# Complete Setup Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Google Gemini API key (optional but recommended)

### Step 1: Install Dependencies
```bash
cd tesco-creative-brain
npm install
```

### Step 2: Configure Environment
```bash
# Copy the example environment file
copy .env.local.example .env.local

# Edit .env.local and add your API key
# GEMINI_API_KEY=your_key_here
```

### Step 3: Run Development Server
```bash
npm run dev
```

### Step 4: Open Browser
Navigate to: `http://localhost:3000`

**That's it! You're ready to demo.**

---

## 🔑 API Keys

### Gemini API (Required)
1. Get key: https://makersuite.google.com/app/apikey
2. Add to `.env.local`: `GEMINI_API_KEY=your_key`
3. Test: Click "Generate New" headlines

### Remove.bg API (Optional)
1. Get key: https://www.remove.bg/api (50 free calls/month)
2. Add to `.env.local`: `REMOVE_BG_API_KEY=your_key`
3. Test: Click "Remove BG" button

**Without keys**: App works with fallback/mock modes

---

## 📁 Project Structure

```
tesco-creative-brain/
├── app/
│   ├── api/
│   │   ├── gemini-headlines/route.ts    # AI headline generation
│   │   ├── remove-bg/route.ts           # Background removal
│   │   └── image-enhance/route.ts       # Image enhancement (mock)
│   ├── page.tsx                         # Main application
│   ├── layout.tsx                       # Root layout
│   └── globals.css                      # Global styles
├── components/
│   ├── AISuggestionsPanel.tsx           # Gemini integration UI
│   ├── BackgroundControls.tsx           # Color picker
│   ├── CanvasPreview.tsx                # Live preview
│   ├── CanvasToolbar.tsx                # Zoom, grid, safe zones
│   ├── ComplianceSummary.tsx            # Warnings display
│   ├── ExportButtons.tsx                # PNG export
│   ├── HeadlineControls.tsx             # Text input
│   ├── LayoutModeToggle.tsx             # Auto/Manual mode
│   ├── PackshotUploader.tsx             # Image upload
│   ├── ProductInfoForm.tsx              # Product details
│   └── WarningsPanel.tsx                # Compliance warnings
├── lib/
│   ├── canvas.ts                        # Canvas rendering
│   ├── compliance.ts                    # Compliance engine
│   ├── layout.ts                        # Layout calculations
│   └── types.ts                         # TypeScript types
├── public/
│   └── logo.png                         # Tesco logo
├── .env.local.example                   # Environment template
├── package.json                         # Dependencies
├── tsconfig.json                        # TypeScript config
├── tailwind.config.ts                   # Tailwind config
└── README.md                            # Documentation
```

---

## 🧪 Quick Tests

1. **Compliance**: Type "50% off" → See warnings → Click "Rewrite"
2. **AI**: Enter product info → Click "Generate New" → See 3 options
3. **Multi-Format**: Switch 1080×1080 ↔ 1080×1920 → Layout adjusts
4. **Export**: Click export buttons → Download PNGs

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| "GEMINI_API_KEY not configured" | Check `.env.local` exists, restart server |
| Canvas not rendering | Check console, refresh page |
| Export not working | Check browser allows downloads |
| BG removal fails | Add REMOVE_BG_API_KEY or use mock mode |
| Slow AI | Normal for first request |

---

## �  Tech Stack

- Next.js 14 + React 18 + TypeScript
- Tailwind CSS
- Google Gemini API
- Remove.bg API (optional)

## ✅ Pre-Demo Checklist

- [ ] `npm install` completed
- [ ] `.env.local` configured with GEMINI_API_KEY
- [ ] `npm run dev` running
- [ ] Browser at http://localhost:3000
- [ ] Test images ready
- [ ] Reviewed DEMO_SCRIPT.md

**Ready to demo!** 🎉
