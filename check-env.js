// Test script to check environment variables
require('dotenv').config({ path: '.env.local' });

console.log('=== Environment Check ===');
console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? `Found (${process.env.GEMINI_API_KEY.substring(0, 15)}...)` : 'NOT FOUND');
console.log('REMOVE_BG_API_KEY:', process.env.REMOVE_BG_API_KEY ? `Found (${process.env.REMOVE_BG_API_KEY.substring(0, 10)}...)` : 'NOT FOUND');

// Also read the file directly
const fs = require('fs');
try {
  const content = fs.readFileSync('.env.local', 'utf8');
  console.log('\n=== .env.local file content ===');
  console.log(content);
  console.log('\n=== Hex dump of first 100 bytes ===');
  const buffer = fs.readFileSync('.env.local');
  console.log(buffer.slice(0, 100).toString('hex'));
} catch (e) {
  console.log('Error reading file:', e.message);
}

