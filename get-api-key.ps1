# Open Google AI Studio to get API key
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "🔑 GET YOUR GEMINI API KEY" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Opening Google AI Studio in your browser..." -ForegroundColor Green
Write-Host ""
Write-Host "Steps:" -ForegroundColor Yellow
Write-Host "1. Sign in with your Google account"
Write-Host "2. Click 'Create API Key'"
Write-Host "3. Select 'Create API key in new project'"
Write-Host "4. COPY the generated key"
Write-Host "5. Update .env.local with your new key"
Write-Host "6. Restart server: npm run dev"
Write-Host ""

# Open the URL
Start-Process "https://aistudio.google.com/app/apikey"

Write-Host "Browser opened! Follow the steps above." -ForegroundColor Green
Write-Host ""
Write-Host "After getting your key:" -ForegroundColor Yellow
Write-Host "1. Open: .env.local"
Write-Host "2. Replace: GEMINI_API_KEY=your_new_key_here"
Write-Host "3. Save file"
Write-Host "4. Restart: npm run dev"
Write-Host ""
Write-Host "Press any key to continue..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
