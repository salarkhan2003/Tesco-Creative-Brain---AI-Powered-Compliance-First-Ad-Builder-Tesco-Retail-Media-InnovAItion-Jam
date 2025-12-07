# Quick Start Guide

## 🚀 Get Started in 3 Minutes

### 1. Install & Setup
```powershell
cd "E:\PROJECTS\TESCO RETAIL PROJECT\tesco-creative-brain"
npm install
copy .env.local.example .env.local
```

### 2. Add API Key
Edit `.env.local` and add:
```
GEMINI_API_KEY=your_gemini_api_key_here
```
Get key from: https://makersuite.google.com/app/apikey

### 3. Start Server
```powershell
npm run dev
```
Open: **http://localhost:3000**

---

## ✅ Quick Test

1. Upload an image
2. Type: "50% off best price!"
3. See red warnings
4. Click "Rewrite Current"
5. Warnings disappear ✅

**You're ready to demo!**

---

## 🐛 Common Issues

**"Cannot find module"** → Run `npm install`

**"Port 3000 in use"** → Kill process:
```powershell
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**"GEMINI_API_KEY not configured"** → Check `.env.local` exists and has key

**Background removal not working** → Optional feature, add `REMOVE_BG_API_KEY` to `.env.local` (get from remove.bg)

---

## 📚 More Info

- **Full Setup**: See SETUP_GUIDE.md
- **Demo Script**: See DEMO_SCRIPT.md
- **Features**: See README.md
