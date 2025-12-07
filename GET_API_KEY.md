# 🔑 How to Get a Real Gemini API Key

## Current Issue

Your `.env.local` file has this API key:
```
GEMINI_API_KEY=AIzaSyDxVGzN8K7YqH5vZ3wQ2mR4nP6jL8tB9cE
```

This appears to be a placeholder/example key and won't work with the actual Gemini API.

## Get Your FREE API Key (2 minutes)

### Step 1: Go to Google AI Studio
Open this link in your browser:
```
https://aistudio.google.com/app/apikey
```

Or alternatively:
```
https://makersuite.google.com/app/apikey
```

### Step 2: Sign In
- Sign in with your Google account
- Accept the terms of service

### Step 3: Create API Key
1. Click **"Create API Key"** button
2. Select **"Create API key in new project"** (or use existing project)
3. Your key will be generated instantly

### Step 4: Copy the Key
- The key will look like: `AIzaSyABC123def456GHI789jkl012MNO345pqr`
- Click the **Copy** button
- Keep this key secure!

### Step 5: Update .env.local
1. Open `tesco-creative-brain/.env.local`
2. Replace the current key with your new key:
```
GEMINI_API_KEY=AIzaSyABC123def456GHI789jkl012MNO345pqr
```
3. Save the file

### Step 6: Restart Server
```powershell
# Stop the server (Ctrl+C)
# Then restart
npm run dev
```

### Step 7: Test It
1. Open `http://localhost:3000`
2. Click **"Run AI Review"**
3. Should work now! (no more "AI review unavailable")
4. Open chatbot and ask a question
5. Should get real AI responses!

---

## Free Tier Limits

✅ **60 requests per minute**
✅ **1,500 requests per day**
✅ **1 million tokens per month**
✅ **No credit card required**

Perfect for demos and development!

---

## Troubleshooting

### "API key not valid"
- Make sure you copied the entire key
- No spaces before or after the key
- No quotes around the key
- Format: `GEMINI_API_KEY=AIzaSy...`

### "Quota exceeded"
- You've hit the free tier limit
- Wait a few minutes and try again
- Or create a new API key

### Still not working?
1. Check browser console (F12) for errors
2. Check terminal/server logs
3. Verify `.env.local` file saved correctly
4. Restart server completely

---

## Quick Test

After adding your real API key, test with this:

### Test 1: AI Creative Review
1. Upload an image
2. Type headline: "50% off best price"
3. Click "Run AI Review"
4. Should see: "Needs Improvement" with suggestions

### Test 2: Compliance Chatbot
1. Click blue chat button (bottom-right)
2. Ask: "Can I mention 50% off?"
3. Should get detailed AI response

---

## Alternative: Use Without API Key

If you can't get an API key right now, the tool still works!

**Fallback Mode Features:**
- ✅ Automated compliance checks
- ✅ Pre-programmed guideline answers
- ✅ Basic creative validation
- ✅ All other features work normally

The AI features will show:
- "(AI review unavailable)" - but still provide automated checks
- Pre-programmed answers for common questions

---

## Security Note

⚠️ **Never commit API keys to Git!**

The `.env.local` file is already in `.gitignore`, so your key is safe.

---

## Need Help?

If you're doing this for the hackathon demo and need a key urgently:

1. Use your personal Google account
2. Create key at: https://aistudio.google.com/app/apikey
3. Copy and paste into `.env.local`
4. Restart server
5. Test immediately

**It takes less than 2 minutes!** 🚀
