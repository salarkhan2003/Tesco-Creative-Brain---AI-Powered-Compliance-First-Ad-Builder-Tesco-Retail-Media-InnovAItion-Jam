# 🔧 Troubleshooting Guide

## AI Features Not Working

### Issue: "AI review unavailable at the moment"

**Causes:**
1. GEMINI_API_KEY not set or invalid
2. API quota exceeded
3. Network connectivity issues

**Solutions:**

#### 1. Check API Key
```powershell
# View your .env.local file
type .env.local
```

Should show:
```
GEMINI_API_KEY=AIzaSyDxVGzN8K7YqH5vZ3wQ2mR4nP6jL8tB9cE
```

If empty or missing:
1. Get a key from: https://makersuite.google.com/app/apikey
2. Add to `.env.local`
3. Restart server: `npm run dev`

#### 2. Restart Development Server
```powershell
# Stop server (Ctrl+C)
# Then restart
npm run dev
```

#### 3. Check Console Logs
- Open browser DevTools (F12)
- Check Console tab for errors
- Look for "GEMINI_API_KEY" messages

#### 4. Fallback Mode
Even without API key, the features work with fallback responses:
- AI Review uses automated compliance checks
- Chatbot provides pre-programmed answers for common questions

---

## Issue: "Please upload packshot" when reviewing

**This is correct behavior!**

The AI Creative Reviewer requires at least one packshot image to analyze your creative.

**Solution:**
1. Click "Upload Images" button
2. Select 1-3 product images
3. Wait for upload to complete
4. Then click "Run AI Review"

---

## Issue: Chat text not visible (white on white)

**Fixed in latest version!**

If you still see this:
1. Hard refresh: `Ctrl+Shift+R`
2. Clear browser cache
3. Restart dev server

**What was fixed:**
- User messages: Blue background with white text
- AI messages: White background with dark gray text
- All text now has explicit color classes

---

## Issue: Chat button and other elements overlap

**Fixed in latest version!**

**What was fixed:**
- Button positioned at `bottom-6 right-6`
- Chat window at `bottom-24 right-6`
- Smaller button size (14x14 → 56px)
- Better z-index management

---

## Issue: Chatbot says "Sorry, I encountered an error"

**Causes:**
1. API key issue
2. Network timeout
3. Invalid API response

**Solutions:**

#### Check Network
- Open DevTools → Network tab
- Look for failed requests to `/api/compliance-assistant`
- Check response status and error message

#### Fallback Answers
The chatbot now provides helpful fallback answers even when API fails:
- Common questions answered from knowledge base
- Guidelines summary provided
- Suggestions to check compliance panel

#### Test with Quick Questions
1. Open chat
2. Click a quick question button
3. If this works, API is fine
4. If not, check API key and restart server

---

## Issue: API calls timing out

**Solutions:**

1. **Check Internet Connection**
   - Gemini API requires internet access
   - Test: Open https://generativelanguage.googleapis.com in browser

2. **Increase Timeout** (if needed)
   - Edit API route files
   - Add timeout to fetch calls

3. **Use Fallback Mode**
   - Features work without API
   - Automated checks still run
   - Pre-programmed answers available

---

## Common Questions

### Q: Do I need an API key for the tool to work?

**A:** No! The tool works in two modes:

**With API Key (Full AI Mode):**
- AI-generated creative reviews
- Conversational chatbot responses
- Context-aware suggestions

**Without API Key (Fallback Mode):**
- Automated compliance checks
- Pre-programmed guideline answers
- Basic creative validation

### Q: How do I get a Gemini API key?

**A:** 
1. Go to: https://makersuite.google.com/app/apikey
2. Sign in with Google account
3. Click "Create API Key"
4. Copy the key
5. Add to `.env.local`
6. Restart server

### Q: Is the API key free?

**A:** Yes! Gemini API has a generous free tier:
- 60 requests per minute
- Perfect for demos and development
- No credit card required

### Q: Why does the chatbot give different answers?

**A:** 
- **With API**: AI generates contextual responses
- **Without API**: Uses pre-programmed fallback answers
- Both are accurate and helpful!

---

## Testing Checklist

### AI Creative Reviewer
- [ ] Upload at least 1 packshot
- [ ] Click "Run AI Review"
- [ ] See loading state (2-3 seconds)
- [ ] Get status badge (green/amber/gray)
- [ ] Read summary and suggestions
- [ ] Fix issues and run again

### Compliance Chatbot
- [ ] Click blue chat button (bottom-right)
- [ ] Chat window opens
- [ ] See welcome message (readable text)
- [ ] Click quick question
- [ ] Get formatted response
- [ ] Type custom question
- [ ] Get helpful answer
- [ ] Close and reopen chat

---

## Debug Mode

### Enable Verbose Logging

**In API routes:**
```typescript
console.log('API Key:', apiKey ? 'Present' : 'Missing');
console.log('Request body:', JSON.stringify(body, null, 2));
console.log('Gemini response:', data);
```

**In browser console:**
```javascript
// Check if API key is loaded
fetch('/api/creative-review', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ headline: 'Test', warnings: [], layoutSummary: { numPackshots: 1 } })
}).then(r => r.json()).then(console.log);
```

---

## Still Having Issues?

### Check These Files:
1. `.env.local` - API keys present?
2. `app/api/creative-review/route.ts` - Logs in console?
3. `app/api/compliance-assistant/route.ts` - Logs in console?
4. Browser DevTools → Console - Any errors?
5. Browser DevTools → Network - Failed requests?

### Quick Reset:
```powershell
# Stop server
Ctrl+C

# Clear Next.js cache
Remove-Item -Recurse -Force .next

# Reinstall dependencies
npm install

# Restart
npm run dev
```

---

## Contact & Support

For hackathon demo issues:
1. Check this troubleshooting guide
2. Review `AI_FEATURES_GUIDE.md`
3. Check browser console for errors
4. Verify `.env.local` configuration

**Remember:** Features work in fallback mode even without API key!
