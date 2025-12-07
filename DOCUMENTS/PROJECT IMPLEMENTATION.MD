You are an expert full-stack engineer and product designer.

PROJECT CONTEXT
---------------
This project is for the “Tesco Retail Media InnovAItion Jam” hackathon (dunnhumby + Tesco).

The idea has already been shortlisted under the title:
“Tesco Creative Brain: An Autonomous Compliance-First GenAI Creative Builder”.

We now need to implement a polished, working prototype that:
- Feels like a production-quality SaaS tool.
- Demonstrates strong REAL-TIME COMPLIANCE for text + image.
- Uses Generative AI (Google Gemini) as an assistant (for headlines & layout suggestions, optionally image tweaks).
- Follows the hackathon spec: social formats, multi-size creatives, less than 500 KB, AI + guideline enforcement, minimal manual effort.

Use the attached PPT concept as the product vision:
- Creative Conundrum (problems: violations, expensive agencies, slow turnaround, small advertisers). 
- GenAI Creative Builder: AI + rule engine + smart constraints + auto-formatting.
- How it works: Packshot upload → AI layout → real-time guideline engine → auto-resize → export.
- Compliance engine: OCR for forbidden copy, visual checks, contrast, tags, value tiles, packshot placement, font size, unsafe zones, Drinkaware lock-ups.
- Benefits: zero violations, multi-format automation, reduced review load.
- Roadmap: collaboration, API integration, multi-retailer, performance optimisation.
(Implement a *lightweight, hackathon-level* version of this; structure it so it can grow later.)

STACK & ARCHITECTURE
--------------------
Use:
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Client-side HTML5 canvas for layout & export
- Next API routes for:
  - Gemini text/headline/layout suggestions.
  - Background removal / simple image enhancements (can use a 3rd party API or mock).

NO separate FastAPI backend. Keep everything inside Next.js.

Project structure (create/update as needed):

- app/
  - page.tsx                      // main UI
  - api/
    - gemini-headlines/route.ts   // Gemini: headline + rewrite + layout suggestions
    - remove-bg/route.ts          // background removal proxy or mock
    - image-enhance/route.ts      // optional: AI-based image suggestion/mock endpoint
- components/
  - LayoutShell.tsx               // Main layout & navigation shell
  - PackshotUploader.tsx
  - ProductInfoForm.tsx
  - HeadlineControls.tsx
  - BackgroundControls.tsx
  - CanvasPreview.tsx
  - CanvasToolbar.tsx             // zoom, grid, safe zone toggle
  - WarningsPanel.tsx
  - ExportPanel.tsx
  - AISuggestionsPanel.tsx        // Gemini text/layout suggestions
  - ComplianceSummary.tsx
- lib/
  - compliance.ts                 // text + layout + image compliance logic
  - layout.ts                     // layout heuristics & coordinate math
  - imageUtils.ts                 // canvas helpers: scaling, compression, etc.
- public/
  - minimal logo / icons

Add a good README.md explaining:
- Features
- Tech stack
- How to run
- How this matches the Tesco brief & PPT.

ENVIRONMENT VARIABLES
---------------------
Do NOT hardcode API keys.

Use:
- GEMINI_API_KEY for Google Gemini

User will create `.env.local` with:
GEMINI_API_KEY=YOUR_KEY_HERE

Read using `process.env.GEMINI_API_KEY` in server code only (API routes).

CORE UX & FLOW
--------------
Main goals:
- Look & feel like a professional SaaS creative tool.
- Clear Tesco branding flavour (Tesco red & blue accents, clean typography).
- Very easy to use for non-designers.

Page layout:

1) Header (top)
   - Logo/icon: "Tesco Creative Brain"
   - Subtitle: "AI-Powered Compliance-First Ad Builder"
   - Right side: small badge: "Prototype – Tesco Retail Media InnovAItion Jam"

2) Main 2-column layout (on desktop; stacked on mobile):

   LEFT COLUMN – “Creative Controls” card:
   ------------------------------------------------
   Sections (accordion or stacked cards):

   A. Product Images (Packshots) – Max 3
      - Drag & drop + “Upload Images” button.
      - Thumbnails with:
        - Remove button
        - Simple controls: Rotate (90° steps), Scale slider, Reset.
        - “Remove Background” button → calls /api/remove-bg.
      - Enforce hard limit: max 3 images. Show clear error if user tries more.

   B. Product Information (for AI)
      - Inputs:
        - Product Name
        - Description
        - Category dropdown (e.g. “Fresh Produce”, “Snacking”, “Beverages”, “Alcohol”, “Household”, etc.)
      - This is used to condition Gemini prompts.

   C. Headline Text
      - Textarea for headline
      - Character counter under it: e.g. “37 characters”.
      - Font size options: Small (16px), Medium (24px), Large (32px), Custom slider (16–40px).
      - Alignment: left / center / right.
      - Text color picker (default Tesco blue or white depending on background).
      - Show compliance inline:
        - Green badge when text complies.
        - Red badge + short reason if not (e.g. "Price/claim not allowed").

   D. AI Suggestions (Gemini)
      - Buttons:
        - “Generate New” (no current headline, use product name + description)
        - “Rewrite Current” (send current headline for Tesco-safe rewrite)
      - Description text: “Click 'Generate New' to get AI-powered Tesco-compliant headlines.”
      - Should call /api/gemini-headlines and display suggestions in AISuggestionsPanel.
      - When a suggestion is clicked → fills the main headline input.

   E. Background Settings
      - Preset color swatches:
        - White, Tesco Blue, Light Blue, Light Gray, Cream, Light Green.
      - Custom color input (#hex).
      - Optional simple gradients:
        - Tesco Blue → Light Blue.
        - Light Gray → White.
      - Optional overlay intensity slider (for dimming background behind text).

   F. Layout Mode
      - Toggle:
        - “Auto Layout (AI suggested)”
        - “Manual Layout”
      - Auto Layout: use layout.ts heuristics + Gemini layout hints (see AI section below).
      - Manual Layout: enable drag/drop + sliders.

   G. Image AI Enhance (optional)
      - Button: “AI Enhance Packshot” (per image or main one).
      - This calls /api/image-enhance (can be a mocked endpoint that returns same image but conceptually shows AI entry point).
      - IMPORTANT: AI edit is OPTIONAL; normal image editing (resize, rotate, BG removal) must work without AI. Do NOT make Gemini mandatory for basic editing.

   RIGHT COLUMN – “Live Preview & Compliance”:
   -------------------------------------------
   A. Preview Selector:
      - Tabs or segmented control:
        - “1080×1080 – Square / Feed”
        - “1080×1920 – Vertical / Story”
      - Under tabs, show:
        - Canvas area for current size.
        - A small top toolbar (CanvasToolbar):
          - Zoom slider (UI only, scale preview).
          - Toggle: “Show Safe Zones” (when on, overlay red bars or outlines).
          - Toggle: “Show Grid” (light grid).

   B. CanvasPreview component:
      - Internally maintain logical canvas of exact size:
        - 1080 × 1080
        - 1080 × 1920
      - In DOM, render at a scaled size (e.g. 360 × 360, or 270 × 480) with CSS scaling, but all drawing should use the logical resolution so export is crisp.
      - Draw in layers:
        1) Background (solid color or gradient)
        2) Packshots (1–3) with proper scaling and positions
        3) Value Tile (dummy CTA / Tesco tag rectangle)
        4) Headline text
        5) Safe zone overlay (only when toggle on):
           - For 1080×1920:
             - Top red band: first 200px
             - Bottom red band: last 250px
           - For 1080×1080:
             - Optional smaller safe zones (e.g., 80px top/bottom).
      - INTERACTION:
        - In Manual Layout mode:
          - Allow user to click elements (headline, packshot) to select them.
          - Drag to reposition (update x/y in logical coordinates).
          - Optionally show resize handles for packshots (scale via drag).
        - In Auto Layout mode:
          - Positions come from layout.ts; disable drag but still show overlays.

      - Fix previous issue:
        - The packshot must NOT appear tiny in a huge blank canvas.
        - Use default scale so main packshot covers about 40–60% of canvas height.
        - Ensure text is visually aligned relative to image, not stuck at the very top.

   C. WarningsPanel:
      - Show all current compliance warnings (from lib/compliance.ts).
      - Style:
        - If none: “All compliance checks passed! Your creative meets all Tesco brand guidelines (prototype).”
        - If there are warnings:
          - Show each with an icon and severity:
            - Red for “Hard Fail”
            - Amber for “Soft Warning”
          - Examples:
            - “Price/claim not allowed in text.”
            - “Font too small (minimum 16px).”
            - “Safe zone violation: headline overlaps social UI area.”
            - “Only 3 packshots allowed.”
            - “Packshot is outside safe bounds.”

   D. ExportPanel:
      - Buttons:
        - “Export 1080×1080 (PNG)”
        - “Export 1080×1920 (PNG)”
      - When clicked:
        - Render the relevant canvas at full resolution.
        - Hide safe zone overlays from export.
        - Use toDataURL('image/png') and trigger download.
        - Compress under 500 KB by:
          - Reducing quality (for JPEG alternative).
          - Or allowing export as JPEG with quality slider.
      - Below buttons:
        - Description:
          - “Exports will be generated without safe zone guides for production use.”
          - “Target file size: < 500KB for optimal delivery.”

COMPLIANCE ENGINE – STRONG IMAGE + TEXT VALIDATION
--------------------------------------------------
Implement a central compliance engine in lib/compliance.ts.

It should evaluate:
- TEXT
- LAYOUT
- IMAGE POSITIONING

and return:
- An array of Warning objects:
  - { id, message, severity: 'hard' | 'soft', source: 'text' | 'layout' | 'image' }

Inputs:
- headline text
- font size
- headline bounding box (x, y, width, height) per canvas size
- packshot list with bounding boxes
- canvas size (width, height)
- background + text color (for contrast calc)
- category (to enable alcohol-specific checks later)
- number of packshots

Rules to implement (lightweight but clear):

1) Forbidden Copy (text compliance):
   - Case-insensitive detection of:
     - “% off”
     - “[0-9]+% off”
     - “best price”
     - “discount”
     - “deal of the day”
     - “eco-friendly”, “sustainable”, “greenest”, “environmentally friendly”
     - Money-back guarantees & strong claims (words like “guaranteed”, “or your money back”).
   - Price patterns:
     - Digits + currency symbol (`£`, `$`, `€`, `₹`) or the word “price”.
   - If detected → Hard Fail:
     - “Price/claim not allowed in text.”

2) Packshot Limits:
   - Max 3 packshots.
   - Attempting to add >3 → block + Hard Fail warning:
     - “Only 3 packshots allowed.”
   - Ensure at least 1 lead product is present if any packshot is used.

3) Minimum Font Size:
   - Minimum = 16px (configurable).
   - If font size < min → Hard Fail:
     - “Font too small (minimum 16px).”

4) Safe Zones:
   - For 1080×1920:
     - Top safe zone: 0–200 px reserved (no text).
     - Bottom safe zone: last 250 px reserved (no text).
   - For 1080×1080:
     - Optional: 0–80px at top & bottom reserved.
   - If headline bounding box intersects these zones → Hard Fail:
     - “Safe zone violation (headline in protected social area).”

5) Canvas Bounds:
   - Any element (text or packshot) must have its bounding box fully within [0, width] and [0, height].
   - If not → Hard Fail:
     - “Element outside safe bounds.”

6) Contrast Check (basic WCAG AA approximation):
   - Calculate approximate luminosity contrast between background color and headline text color.
   - If contrast ratio < ~4.5:1 → Soft Warning:
     - “Low contrast between text and background (accessibility issue).”

7) Human Detection Stub (image compliance concept):
   - For prototype, you can:
     - Either use a simple heuristic (e.g., if filename/tag suggests “people”), or
     - Just keep a placeholder flag `containsHuman: boolean` on each packshot that user can toggle manually.
   - If containsHuman is true:
     - Show Soft Warning:
       - “Human detected – confirm model rights and Tesco approvals.”
   - This matches the idea of “detection of humans with user confirmation prompts” without requiring heavy ML.

8) Alcohol / Drinkaware Stub:
   - If category = “Alcohol”:
     - Require that the “value tile” or a small footer text includes “Drinkaware” placeholder within canvas.
     - If not present → Hard Fail:
       - “Alcohol creative must include Drinkaware lock-up (prototype check).”

Design the compliance engine so it runs:
- On every relevant state change (headline, font size, layout changes).
- Returns results to WarningsPanel and small inline badges in the UI.

LAYOUT ENGINE – SMART BUT SIMPLE
--------------------------------
Implement heuristics in lib/layout.ts to handle "Auto Layout" for each size.

For each format, define default positions & sizes:

1) For 1080×1080:
   - Background: full canvas.
   - Main packshot:
     - Centered horizontally.
     - Vertical position: slightly below center.
     - Scale: ~45–60% of canvas height.
   - Secondary packshots (if any):
     - Slightly offset left/right behind main packshot.
   - Headline:
     - Top area, centered horizontally by default.
     - Keep inside safe area.
   - Value tile:
     - Bottom right quadrant; fixed size rectangle.
     - Ensure it doesn’t overlap packshot or go into margins.

2) For 1080×1920:
   - Background: full.
   - Headline:
     - Placed between 200px and 600px from top (avoid top zone).
   - Packshot(s):
     - Middle-lower area, above bottom 250px safe zone.
   - Value tile:
     - Bottom area but above 1920−250 boundary.

Expose functions:
- getDefaultLayout(size, numPackshots, hasAIHints?)
- applyAIHintsToLayout(layout, hintsFromGemini)

The layout should produce:
- Coordinates & sizes for:
  - background (not needed for compliance)
  - each packshot (x, y, width, height)
  - headline bounding box
  - value tile bounding box

AI INTEGRATION – GEMINI
-----------------------
Use Google Gemini API via /api/gemini-headlines.

Route: app/api/gemini-headlines/route.ts

Behavior:
- Method: POST
- Body:
  {
    productName: string;
    description: string;
    category?: string;
    currentHeadline?: string;
    mode: "generate" | "rewrite" | "layout";
  }

Modes:

1) mode = "generate"
   - Task: generate 3–5 Tesco-compliant ad headlines.
   - Prompt:
     - Explain Tesco context + compliance rules (no prices, no % off, no “best price”, no strong claims).
     - Provide product name, description, category.
   - Response:
     - JSON: { headlines: string[] }

2) mode = "rewrite"
   - Task: rewrite the current headline to remove violations while keeping intent.
   - Prompt:
     - Provide currentHeadline, product info, and same Tesco rules.
   - Response:
     - JSON: { headlines: string[] } (first one can be the main “fixed” version).

3) mode = "layout"
   - Task: suggest layout hints (high-level, not pixel-perfect).
   - Prompt:
     - Provide info: number of packshots, format (square or vertical), brand colours.
   - Ask Gemini to respond with JSON like:
     {
       "headlinePosition": "top-center" | "middle" | "bottom",
       "headlineMaxLines": 2,
       "packshotEmphasis": "single-large" | "grid",
       "primaryColor": "#00539F",
       "valueTilePosition": "bottom-right"
     }
   - You may parse or ignore parts; just show that the architecture is ready for AI-driven layout optimisation.

Implementation details:
- Read GEMINI_API_KEY from env.
- Call:
  POST https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent
- Headers:
  - Content-Type: application/json
  - X-goog-api-key: GEMINI_API_KEY
- Simple error handling: if API fails, return 500 & a simple error JSON.

AI IMAGE ENHANCEMENT – OPTIONAL
-------------------------------
Route: app/api/image-enhance/route.ts

Goal:
- Conceptually represent AI editing of images (e.g., light enhancements, blur background).
- For hackathon, this can be:
  - A mock that returns the same image with “AI enhanced” flag.
  - Or a simple effect (e.g., apply a blur or brightness adjustment using a library, if feasible).

Important:
- The base image editing workflow (scale, rotate, BG removal) must **not depend on AI**.
- AI Image Enhance is an optional “wow” feature:
  - Button: “AI Enhance”
  - On click: call the route, update preview.
  - Even if the backend just echoes the same image, the UX path shows how a real AI integration would work.

BACKGROUND REMOVAL
------------------
Route: app/api/remove-bg/route.ts

- Accepts uploaded image or data URL.
- If a 3rd party API key is available, call it.
- If not, simply return the original image (mock behavior) but keep the architecture.

UI behaviour:
- User clicks “Remove Background”.
- Show loading state; then replace packshot or mark as “BG removed”.

VISUAL DESIGN / TAILWIND
------------------------
Make the UI look like a professional SaaS product:

- Full page background: subtle gradient (light grey/white).
- Main content: centered, max-width, with generous padding.
- Cards for each control group with:
  - rounded-xl
  - shadow-sm / shadow-md
  - border border-slate-200
- Consistent spacing: gap-4 / gap-6.
- Text:
  - Use Tailwind classes with font-medium / font-semibold for headings.
  - Clear section titles: “Creative Controls”, “Live Preview”, “Export Creatives”.
- Buttons:
  - Primary: Tesco blue (#00539F) background, white text, rounded-full.
  - Secondary: light border, subtle hover.
- Micro-interactions:
  - Hover states.
  - Disabled states.
- Optional: Use framer-motion for small fade/slide-in animations (not required, but nice).

COPY IN UI (TEXT TO REUSE)
--------------------------
Use / keep texts like:

- “Tesco Creative Brain”
- “AI-Powered Compliance-First Ad Builder”
- Section headings:
  - “Creative Controls”
  - “Product Images (Packshots) – Max 3”
  - “Product Information (for AI)”
  - “Headline Text”
  - “AI Suggestions (Gemini)”
  - “Background Color”
  - “Live Preview”
  - “Export Creatives”
- Messages:
  - “Red zones indicate safe areas where text should not appear.”
  - “All compliance checks passed! Your creative meets all Tesco brand guidelines (prototype).”
  - “Exports will be generated without safe zone guides for production use.”
  - “This is a hackathon prototype demonstrating Tesco's compliance-first approach to retail media creative generation.”

QUALITY & DX
------------
- Use proper TypeScript types for layout, compliance warnings, API responses.
- Avoid `any`.
- Add comments explaining non-trivial logic (layout & compliance).
- Ensure `npm install` and `npm run dev` works without TypeScript errors.
- Make state management straightforward (React hooks; no need for Redux).

FINAL CHECKLIST
---------------
When everything is implemented, the app should allow me to:

1. Open the app.
2. Upload 1–3 packshots.
3. Remove backgrounds (or simulate it).
4. Enter product info.
5. Type a headline and see live compliance warnings.
6. Click “Generate New” to get Tesco-compliant Gemini headlines.
7. Click “Rewrite Current” to fix a non-compliant headline (e.g., “50% off best price”).
8. Choose background colors and see canvas update in real time.
9. Switch between 1080×1080 and 1080×1920 previews.
10. Drag text / images in Manual Layout mode and see compliance warnings update (e.g., safe zone violation).
11. Confirm that the downloaded PNG looks exactly like the on-screen preview (minus guides) and is under ~500KB.
12. Read a short About/Prototype section explaining how this matches Tesco’s goals and how it can scale (brand memory, multi-retailer, performance optimisation).

Now:
- Implement or refactor all the necessary files.
- Fix layout scaling so images are not tiny, and text is properly aligned relative to packshots.
- Ensure strong text + image compliance logic is actually running and visible to the user.
- Make the overall experience look and feel like a polished SaaS tool ready to demo to Tesco judges.
