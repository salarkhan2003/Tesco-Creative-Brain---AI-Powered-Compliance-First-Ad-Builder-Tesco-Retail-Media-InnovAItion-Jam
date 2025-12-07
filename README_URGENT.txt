========================================
🚨 YOUR API KEY IS INVALID! 🚨
========================================

The server logs show:
"API key not valid. Please pass a valid API key."

This means you need a REAL Google API key.

========================================
FASTEST FIX (2 MINUTES)
========================================

Option 1: Run this command (opens browser):
.\get-api-key.ps1

Option 2: Manually visit:
https://aistudio.google.com/app/apikey

Then:
1. Sign in with Google
2. Click "Create API Key"
3. Copy the key
4. Open .env.local
5. Replace GEMINI_API_KEY=... with your new key
6. Save file
7. Restart: npm run dev

========================================
TEST YOUR KEY
========================================

After updating .env.local:

node test-api-key.js

Should show: ✅ SUCCESS!

========================================
WHAT'S FIXED
========================================

✅ Chat input text now visible (dark gray)
✅ Packshot validation working
✅ Test script working
✅ Better error messages

STILL NEED:
❌ Real API key for AI features

========================================
ALL ISSUES
========================================

1. ✅ FIXED: Input text invisible
   - Added text-gray-900 bg-white

2. ✅ FIXED: No packshot validation  
   - Now checks before review

3. ❌ NOT FIXED: Invalid API key
   - YOU NEED: Real key from Google

========================================
GET KEY NOW
========================================

https://aistudio.google.com/app/apikey

FREE - No credit card required
Takes 2 minutes

========================================
AFTER YOU GET THE KEY
========================================

1. Open: .env.local
2. Find: GEMINI_API_KEY=AIzaSyDxVGzN8K7YqH5vZ3wQ2mR4nP6jL8tB9cE
3. Replace with: GEMINI_API_KEY=your_new_key_here
4. Save
5. Restart: npm run dev
6. Test: node test-api-key.js

========================================
DEMO READY CHECKLIST
========================================

Before demo:
[ ] Get real API key
[ ] Update .env.local
[ ] Restart server
[ ] Test: node test-api-key.js (passes)
[ ] Upload images
[ ] Run AI Review (works)
[ ] Open chatbot (responds)
[ ] Type in chat (visible)

========================================
QUICK COMMANDS
========================================

Get key (opens browser):
.\get-api-key.ps1

Test key:
node test-api-key.js

Check .env.local:
type .env.local

Restart server:
npm run dev

========================================
