#!/usr/bin/env node

/**
 * Verify Environment Variables Configuration
 * Run with: node verify-env.js
 */

console.log('='.repeat(60));
console.log('Environment Variables Verification');
console.log('='.repeat(60));
console.log('');

// Check if .env.local exists
const fs = require('fs');
const path = require('path');

const envLocalPath = path.join(__dirname, '.env.local');
const envExamplePath = path.join(__dirname, '.env.example');

console.log('📁 Checking environment files:');
console.log('  .env.local exists:', fs.existsSync(envLocalPath) ? '✅' : '❌');
console.log('  .env.example exists:', fs.existsSync(envExamplePath) ? '✅' : '❌');
console.log('');

if (fs.existsSync(envLocalPath)) {
  console.log('📄 Contents of .env.local:');
  const envContent = fs.readFileSync(envLocalPath, 'utf8');
  const lines = envContent.split('\n');
  
  let foundApiUrl = false;
  lines.forEach(line => {
    if (line.trim() && !line.trim().startsWith('#')) {
      console.log('  ' + line);
      if (line.includes('NEXT_PUBLIC_API_URL')) {
        foundApiUrl = true;
      }
    }
  });
  
  console.log('');
  console.log('✅ NEXT_PUBLIC_API_URL found:', foundApiUrl ? 'Yes' : 'No');
} else {
  console.log('❌ .env.local not found!');
  console.log('   Please create it from .env.example');
}

console.log('');
console.log('🔍 Testing backend connection:');

// Test backend connection
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://mansa-backend-1rr8.onrender.com';
console.log('  API URL:', apiUrl);

const https = require('https');
const http = require('http');

const testEndpoint = (url) => {
  return new Promise((resolve) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, (res) => {
      console.log(`  Status: ${res.statusCode} ${res.statusMessage}`);
      if (res.statusCode === 200) {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const json = JSON.parse(data);
            console.log(`  ✅ Valid JSON response`);
            console.log(`  Results count: ${json.count || json.length || 'N/A'}`);
            resolve(true);
          } catch (e) {
            console.log(`  ❌ Invalid JSON response`);
            resolve(false);
          }
        });
      } else {
        console.log(`  ❌ Request failed`);
        resolve(false);
      }
    });
    
    req.on('error', (error) => {
      console.log(`  ❌ Connection error: ${error.message}`);
      resolve(false);
    });
    
    req.setTimeout(10000, () => {
      console.log(`  ❌ Request timeout`);
      req.destroy();
      resolve(false);
    });
  });
};

(async () => {
  console.log('');
  console.log('Testing mentors endpoint...');
  await testEndpoint(`${apiUrl}/api/v1/mentorship/mentors/?page=1&page_size=1`);
  
  console.log('');
  console.log('Testing expertise endpoint...');
  await testEndpoint(`${apiUrl}/api/v1/mentorship/expertise/`);
  
  console.log('');
  console.log('='.repeat(60));
  console.log('Verification complete!');
  console.log('='.repeat(60));
})();
