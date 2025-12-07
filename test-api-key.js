/**
 * Quick test script to verify Gemini API key
 * Run with: node test-api-key.js
 */

const fs = require('fs');
const path = require('path');

// Read .env.local file manually
const envPath = path.join(__dirname, '.env.local');
let apiKey = '';

try {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const match = envContent.match(/GEMINI_API_KEY=(.+)/);
  if (match) {
    apiKey = match[1].trim();
  }
} catch (error) {
  console.error('Error reading .env.local:', error.message);
}

console.log('='.repeat(60));
console.log('🔑 Gemini API Key Test');
console.log('='.repeat(60));

if (!apiKey) {
  console.log('❌ ERROR: GEMINI_API_KEY not found in .env.local');
  console.log('\n📝 To fix:');
  console.log('1. Get a key from: https://aistudio.google.com/app/apikey');
  console.log('2. Add to .env.local: GEMINI_API_KEY=your_key_here');
  console.log('3. Restart server: npm run dev');
  process.exit(1);
}

console.log('✅ API Key found in .env.local');
console.log(`📏 Length: ${apiKey.length} characters`);
console.log(`🔤 Starts with: ${apiKey.substring(0, 10)}...`);

// Test the API
console.log('\n🧪 Testing API connection...\n');

const testPrompt = 'Say "Hello from Gemini!" in JSON format: {"message": "..."}';

fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    contents: [{
      parts: [{
        text: testPrompt
      }]
    }],
    generationConfig: {
      temperature: 0.5,
      maxOutputTokens: 100,
    }
  }),
})
.then(async response => {
  console.log(`📡 Response Status: ${response.status} ${response.statusText}`);
  
  if (!response.ok) {
    const errorText = await response.text();
    console.log('\n❌ API ERROR:');
    console.log(errorText);
    console.log('\n💡 Common Issues:');
    console.log('1. Invalid API key - Get a new one from: https://aistudio.google.com/app/apikey');
    console.log('2. API key not activated - Wait a few minutes after creation');
    console.log('3. Quota exceeded - Check your usage limits');
    process.exit(1);
  }
  
  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  
  console.log('\n✅ SUCCESS! API is working!');
  console.log('\n📨 Response from Gemini:');
  console.log(text);
  console.log('\n🎉 Your AI features should work now!');
  console.log('\n📝 Next steps:');
  console.log('1. Make sure server is running: npm run dev');
  console.log('2. Open http://localhost:3000');
  console.log('3. Try "Run AI Review" button');
  console.log('4. Try the chatbot (blue button, bottom-right)');
})
.catch(error => {
  console.log('\n❌ CONNECTION ERROR:');
  console.log(error.message);
  console.log('\n💡 Check:');
  console.log('1. Internet connection');
  console.log('2. Firewall settings');
  console.log('3. Proxy configuration');
  process.exit(1);
});
