# 🧪 How to Test Your API Key

## Quick Test

```powershell
# Navigate to the project folder
cd tesco-creative-brain

# Run the test
node test-api-key.js
```

## Expected Output

### ✅ If API Key Works:
```
============================================================
🔑 Gemini API Key Test
============================================================
✅ API Key found in .env.local
📏 Length: 39 characters
🔤 Starts with: AIzaSyABC1...

🧪 Testing API connection...

📡 Response Status: 200 OK

✅ SUCCESS! API is working!

📨 Response from Gemini:
{"message": "Hello from Gemini!"}

🎉 Your AI features should work now!
```

### ❌ If API Key Doesn't Work:
```
❌ API ERROR:
{
  "error": {
    "code": 400,
    "message": "API key not valid..."
  }
}

💡 Common Issues:
1. Invalid API key - Get a new one from: https://aistudio.google.com/app/apikey
2. API key not activated - Wait a few minutes after creation
3. Quota exceeded - Check your usage limits
```

## Get a Real API Key

1. Visit: https://aistudio.google.com/app/apikey
2. Sign in with Google
3. Click "Create API Key"
4. Copy the key
5. Update `.env.local`:
   ```
   GEMINI_API_KEY=your_new_key_here
   ```
6. Run test again: `node test-api-key.js`

## After Successful Test

```powershell
# Start the development server
npm run dev

# Open in browser
# http://localhost:3000

# Test features:
# 1. Upload images
# 2. Click "Run AI Review"
# 3. Open chatbot (blue button)
# 4. Ask a question
```

## Troubleshooting

### "Cannot find module"
Make sure you're in the `tesco-creative-brain` folder:
```powershell
cd tesco-creative-brain
node test-api-key.js
```

### "GEMINI_API_KEY not found"
Check your `.env.local` file exists and has:
```
GEMINI_API_KEY=your_key_here
```

### "API key not valid"
Get a new key from: https://aistudio.google.com/app/apikey

---

**Quick command:**
```powershell
cd tesco-creative-brain && node test-api-key.js
```
