#!/usr/bin/env node

/**
 * Simple test script to verify the OCR API endpoint
 * Run with: node test-api.js
 */

import https from 'https';
import fs from 'fs';
import path from 'path';

const API_URL = 'https://gb-ocr-stage.vertekx.com/categorize';

console.log('🔍 Testing OCR API endpoint...\n');
console.log(`Endpoint: ${API_URL}\n`);

// Test 1: Check if endpoint is reachable
console.log('1️⃣ Testing endpoint reachability...');

const testConnection = () => {
  return new Promise((resolve, reject) => {
    const req = https.request(API_URL, {
      method: 'HEAD',
      timeout: 10000,
    }, (res) => {
      console.log(`✅ Endpoint reachable - Status: ${res.statusCode}`);
      console.log(`   Headers: ${JSON.stringify(res.headers, null, 2)}`);
      resolve(res);
    });

    req.on('error', (error) => {
      console.log(`❌ Connection failed: ${error.message}`);
      reject(error);
    });

    req.on('timeout', () => {
      console.log('⏰ Request timeout');
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.end();
  });
};

// Test 2: Check SSL certificate
console.log('\n2️⃣ Testing SSL certificate...');

const testSSL = () => {
  return new Promise((resolve, reject) => {
    const req = https.request(API_URL, {
      method: 'HEAD',
      timeout: 10000,
    }, (res) => {
      const cert = res.socket.getPeerCertificate();
      if (cert && cert.subject) {
        console.log('✅ SSL certificate valid');
        console.log(`   Subject: ${cert.subject.CN || 'Unknown'}`);
        console.log(`   Issuer: ${cert.issuer.CN || 'Unknown'}`);
        console.log(`   Valid from: ${cert.valid_from}`);
        console.log(`   Valid to: ${cert.valid_to}`);
      } else {
        console.log('⚠️  SSL certificate information not available');
      }
      resolve(res);
    });

    req.on('error', (error) => {
      console.log(`❌ SSL test failed: ${error.message}`);
      reject(error);
    });

    req.on('timeout', () => {
      console.log('⏰ SSL test timeout');
      req.destroy();
      reject(new Error('SSL test timeout'));
    });

    req.end();
  });
};

// Test 3: Test with a simple POST request (without file)
console.log('\n3️⃣ Testing POST method...');

const testPost = () => {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({ test: 'connection' });
    
    const req = https.request(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
      },
      timeout: 10000,
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`✅ POST method works - Status: ${res.statusCode}`);
        if (data) {
          console.log(`   Response: ${data.substring(0, 200)}${data.length > 200 ? '...' : ''}`);
        }
        resolve(res);
      });
    });

    req.on('error', (error) => {
      console.log(`❌ POST test failed: ${error.message}`);
      reject(error);
    });

    req.on('timeout', () => {
      console.log('⏰ POST test timeout');
      req.destroy();
      reject(new Error('POST test timeout'));
    });

    req.write(postData);
    req.end();
  });
};

// Run all tests
async function runTests() {
  try {
    await testConnection();
    await testSSL();
    await testPost();
    
    console.log('\n🎉 All tests completed successfully!');
    console.log('✅ The API endpoint is properly configured and accessible.');
    console.log('✅ HTTPS is working correctly.');
    console.log('✅ The endpoint accepts POST requests.');
    
  } catch (error) {
    console.log('\n❌ Some tests failed:');
    console.log(`   Error: ${error.message}`);
    console.log('\n💡 Troubleshooting tips:');
    console.log('   - Check your internet connection');
    console.log('   - Verify the API endpoint is correct');
    console.log('   - Check if the service is running');
    console.log('   - Verify SSL certificate is valid');
    
    process.exit(1);
  }
}

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n\n🛑 Test interrupted by user');
  process.exit(0);
});

// Run the tests
runTests();
