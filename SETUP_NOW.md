# Setup Right Now - Step by Step

## ✅ Step 1: File Created!

I just created `.env.local` for you. Now you need to add your API keys.

## 📝 Step 2: Add Your Gemini API Key

### Get the Key:
1. Open: https://makersuite.google.com/app/apikey
2. Click "Create API Key"
3. Copy the key (looks like: `AIzaSyABC123...`)

### Add to File:
1. Open file: `E:\PROJECTS\TESCO RETAIL PROJECT\tesco-creative-brain\.env.local`
2. Find the line: `GEMINI_API_KEY=`
3. Paste your key after the `=` (no spaces!)
4. Should look like: `GEMINI_API_KEY=AIzaSyABC123DEF456...`
5. Save the file

## 🎯 Step 3: Start the Server

```powershell
cd "E:\PROJECTS\TESCO RETAIL PROJECT\tesco-creative-brain"
npm run dev
```

## ✅ Step 4: Test It

1. Open: http://localhost:3000
2. Upload an image
3. Enter product name: "Fresh Apples"
4. Click "Generate New" button
5. Should see 3 AI-generated headlines!

---

## 🔧 If You Get Errors

### "GEMINI_API_KEY not configured"
- Check `.env.local` file has the key
- Make sure no spaces: `GEMINI_API_KEY=AIza...` (not `GEMINI_API_KEY = AIza...`)
- Restart the server after adding key

### "Cannot find module"
```powershell
npm install
```

### "Port 3000 in use"
```powershell
netstat -ano | findstr :3000
# Note the PID number
taskkill /PID <number> /F
```

---

## 📋 Quick Checklist

- [x] `.env.local` file created (I did this!)
- [ ] Gemini API key added to file
- [ ] File saved
- [ ] Server started with `npm run dev`
- [ ] Browser open to http://localhost:3000
- [ ] Tested AI generation

---

## 🎬 You're Almost Ready!

Just add your Gemini API key and start the server. That's it!

**Need the key?** → https://makersuite.google.com/app/apikey
