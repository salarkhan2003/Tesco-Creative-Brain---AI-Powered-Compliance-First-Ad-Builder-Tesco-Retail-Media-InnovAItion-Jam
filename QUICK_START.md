# 🚀 Quick Start Guide - Tesco Creative Brain

## Setup (2 minutes)

### 1. Install Dependencies
```powershell
npm install
```

### 2. Verify API Keys
Your `.env.local` file already has:
```
GEMINI_API_KEY=AIzaSyDxVGzN8K7YqH5vZ3wQ2mR4nP6jL8tB9cE
REMOVE_BG_API_KEY=FkSZorFbVNQb8JAskp79Yt3H
```

### 3. Start Development Server
```powershell
npm run dev
```

### 4. Open Browser
Navigate to: `http://localhost:3000`

---

## 🎯 Demo Workflow (5 minutes)

### Step 1: Upload Images (Auto-Layout Magic!)
1. Click **"Upload Images"**
2. Select 1-3 product images
3. Watch them **auto-position** professionally!

**What happens:**
- 1 image → Large centered hero
- 2 images → Side-by-side with overlap
- 3 images → Hero + 2 supporting images

### Step 2: Adjust Images
For each image:
- **Scale**: Drag slider (0.5x - 1.5x)
- **Rotate**: Click -90°, Reset, or +90°
- **Remove BG**: Click "Remove BG" button
- **Undo**: Click "Restore BG" to undo

### Step 3: Generate AI Headlines
1. Enter **Product Name**: "Organic Apples"
2. Enter **Description**: "Fresh from local farms"
3. Select **Category**: "Fresh Produce"
4. Click **"Generate New"**
5. Choose from 3 AI-generated, compliance-checked headlines!

### Step 4: Customize Design
- **Headline**: Edit text directly
- **Font Size**: Adjust slider (16px - 48px)
- **Text Color**: Pick color
- **Background**: Choose color
- **Text Align**: Left, Center, Right

### Step 5: Check Compliance
Watch the **Compliance Status** panel:
- ✅ **Green**: All checks passed!
- ⚠️ **Yellow**: Warnings (review recommended)
- ❌ **Red**: Violations (must fix)

**Try these to see violations:**
- Type "50% off" → ❌ Price callout blocked
- Set font to 12px → ❌ Too small
- Type "best price ever" → ❌ Superlative claim

### Step 6: Use Canvas Controls
- **Zoom**: Adjust 50% - 150%
- **Show Grid**: Toggle grid overlay
- **Show Safe Zones**: See restricted areas
- **Format**: Switch between Square (1080x1080) and Vertical (1080x1920)

### Step 7: AI Creative Review (NEW!)
1. Scroll to **"AI Creative Review"** panel
2. Click **"Run AI Review"**
3. Wait 2-3 seconds for AI analysis
4. See status:
   - ✅ Green = Production Ready
   - ⚠️ Amber = Needs Improvement
5. Read AI suggestions and fix issues

### Step 8: Ask the AI Assistant (NEW!)
1. Click the **blue chat button** (bottom-right corner)
2. Try a quick question: "Can I mention 50% off?"
3. See detailed AI response with rules
4. Ask custom questions about guidelines
5. Chat history persists during session

### Step 9: Export
1. Click **"1080×1080"** or **"1080×1920"**
2. PNG downloads automatically
3. No safe zones/grid in export
4. Production-ready!

---

## 🎬 Demo Script for Judges

### Opening (30 seconds)
> "Tesco Creative Brain solves the challenge of creating compliant retail media creatives. Small advertisers struggle with complex guidelines and lack agency support. Our AI-powered tool makes it effortless."

### Demo Part 1: Smart Auto-Layout (1 minute)
1. **Upload 1 image**: "See how it centers as a hero packshot"
2. **Upload 2nd image**: "Watch it auto-arrange with professional overlap"
3. **Upload 3rd image**: "Now we have a balanced, Tesco-compliant composition"
4. **Adjust scale/rotation**: "Fine-tune without breaking the layout"

### Demo Part 2: AI Compliance (1 minute)
1. **Type forbidden text**: "50% off best price"
2. **Show violations**: "Real-time compliance checking catches this"
3. **Click 'Rewrite Current'**: "AI fixes it automatically"
4. **Show green status**: "Now fully compliant!"

### Demo Part 3: Background Removal (30 seconds)
1. **Click 'Remove BG'**: "Real API integration, not mock"
2. **Show result**: "Clean packshot in 2-3 seconds"
3. **Click 'Restore BG'**: "Undo/redo for flexibility"

### Demo Part 4: AI Creative Reviewer (1 minute) **NEW!**
1. **Scroll to AI Review panel**: "Let's get a second opinion"
2. **Click 'Run AI Review'**: "AI analyzes everything"
3. **Show violations**: "Catches issues we might miss"
4. **Fix one issue**: Change headline
5. **Run again**: "Now production-ready!"

### Demo Part 5: Compliance Chatbot (1 minute) **NEW!**
1. **Click chat button**: "24/7 AI compliance expert"
2. **Ask question**: "Can I mention 50% off?"
3. **Show response**: "Detailed rules with examples"
4. **Ask another**: "What about safe zones?"
5. **Show expertise**: "Instant, accurate guidance"

### Demo Part 6: Multi-Format Export (30 seconds)
1. **Switch to Vertical**: "Same design, different format"
2. **Show auto-adjustment**: "Safe zones respected automatically"
3. **Export both**: "Campaign-ready assets in seconds"

### Closing (30 seconds)
> "We've implemented all mandatory requirements plus stretch goals:
> - ✅ Smart auto-layout with AI
> - ✅ 50+ compliance rules enforced
> - ✅ Real-time validation
> - ✅ AI Creative Reviewer (NEW!)
> - ✅ AI Compliance Chatbot (NEW!)
> - ✅ Multi-format support
> - ✅ Professional quality without agencies
> 
> This is more than a tool—it's an AI-powered creative partner that empowers small advertisers to create compliant, professional creatives autonomously."

---

## 🐛 Troubleshooting

### Images not auto-adjusting?
- Make sure you're in **"Auto Layout"** mode (not Manual)
- Refresh the page and try again

### Background removal not working?
- Check API key in `.env.local`
- Restart dev server: `Ctrl+C` then `npm run dev`
- Check console for error messages

### AI headlines not generating?
- Verify GEMINI_API_KEY in `.env.local`
- Check internet connection
- Look for errors in browser console (F12)

### Zoom/Grid not working?
- Clear browser cache
- Hard refresh: `Ctrl+Shift+R`
- Check that you restarted server after updates

---

## 📊 Key Features to Highlight

### Innovation:
1. **Smart Auto-Layout** - No design skills needed
2. **AI Compliance Checking** - 50+ rules enforced automatically
3. **Real-time Validation** - Instant feedback
4. **Undo/Redo System** - Non-destructive workflow

### Technical Excellence:
1. **Gemini 2.0 Flash** - Latest AI model
2. **WCAG AA Compliance** - Accessibility built-in
3. **Retry Logic** - Robust API handling
4. **Multi-format Support** - One design, multiple outputs

### User Experience:
1. **Zero Configuration** - Works out of the box
2. **Visual Feedback** - Clear compliance indicators
3. **Professional Results** - Agency-quality output
4. **Fast Workflow** - Minutes, not hours

---

## 🎯 Evaluation Criteria Coverage

✅ **Innovation**: AI-powered auto-layout + compliance checking
✅ **Guideline Alignment**: 50+ Tesco rules implemented
✅ **Scalability**: Multi-format, multi-channel ready
✅ **User Experience**: Non-expert friendly
✅ **Technical Feasibility**: Fully functional prototype

---

## 📞 Support

If you encounter issues during demo:
1. Check `.env.local` has both API keys
2. Restart server: `npm run dev`
3. Clear browser cache
4. Check browser console (F12) for errors

**You're ready to demo! Good luck! 🚀**
