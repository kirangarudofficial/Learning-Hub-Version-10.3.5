#!/usr/bin/env node

/**
 * Learning Platform API Testing Script
 * 
 * This script tests the main API endpoints to verify functionality
 * Run with: node test-api.js
 */

const http = require('http');
const https = require('https');

const API_BASE_URL = 'http://localhost:3000';
const API_PREFIX = '/api';

// Test configuration
const tests = [
  {
    name: 'Health Check',
    method: 'GET',
    path: '/health',
    expectedStatus: 200,
    public: true,
  },
  {
    name: 'API Documentation',
    method: 'GET', 
    path: '/docs',
    expectedStatus: 200,
    public: true,
  },
  {
    name: 'Get All Courses (Public)',
    method: 'GET',
    path: `${API_PREFIX}/courses`,
    expectedStatus: 200,
    public: true,
  },
  {
    name: 'User Registration',
    method: 'POST',
    path: `${API_PREFIX}/auth/register`,
    expectedStatus: 201,
    public: true,
    body: {
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      password: 'testpassword123',
      role: 'USER'
    }
  },
  {
    name: 'User Login',
    method: 'POST',
    path: `${API_PREFIX}/auth/login`,
    expectedStatus: 200,
    public: true,
    body: {
      email: 'test@example.com',
      password: 'testpassword123'
    }
  },
];

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function makeRequest(options, postData) {
  return new Promise((resolve, reject) => {
    const protocol = options.protocol === 'https:' ? https : http;
    
    const req = protocol.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data,
        });
      });
    });
    
    req.on('error', (err) => {
      reject(err);
    });
    
    if (postData) {
      req.write(postData);
    }
    
    req.end();
  });
}

async function runTest(test) {
  const url = new URL(API_BASE_URL + test.path);
  
  const options = {
    hostname: url.hostname,
    port: url.port || (url.protocol === 'https:' ? 443 : 80),
    path: url.pathname + url.search,
    method: test.method,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  };

  let postData = null;
  if (test.body) {
    postData = JSON.stringify(test.body);
    options.headers['Content-Length'] = Buffer.byteLength(postData);
  }

  try {
    console.log(`${colors.blue}Testing:${colors.reset} ${test.name}`);
    console.log(`  ${colors.cyan}${test.method} ${test.path}${colors.reset}`);
    
    const startTime = Date.now();
    const response = await makeRequest(options, postData);
    const duration = Date.now() - startTime;
    
    const statusColor = response.statusCode === test.expectedStatus ? colors.green : colors.red;
    console.log(`  Status: ${statusColor}${response.statusCode}${colors.reset} (Expected: ${test.expectedStatus})`);
    console.log(`  Duration: ${duration}ms`);
    
    // Try to parse JSON response
    let parsedBody = null;
    try {
      parsedBody = JSON.parse(response.body);
      console.log(`  Response: ${JSON.stringify(parsedBody, null, 2).substring(0, 200)}...`);
    } catch (e) {
      console.log(`  Response: ${response.body.substring(0, 200)}...`);
    }
    
    const success = response.statusCode === test.expectedStatus;
    console.log(`  Result: ${success ? colors.green + '✓ PASS' : colors.red + '✗ FAIL'}${colors.reset}\n`);
    
    return {
      name: test.name,
      success,
      statusCode: response.statusCode,
      expectedStatus: test.expectedStatus,
      duration,
      response: parsedBody || response.body,
    };
    
  } catch (error) {
    console.log(`  Error: ${colors.red}${error.message}${colors.reset}`);
    console.log(`  Result: ${colors.red}✗ FAIL${colors.reset}\n`);
    
    return {
      name: test.name,
      success: false,
      error: error.message,
      duration: 0,
    };
  }
}

async function runAllTests() {
  console.log(`${colors.magenta}======================================${colors.reset}`);
  console.log(`${colors.magenta}  Learning Platform API Test Suite  ${colors.reset}`);
  console.log(`${colors.magenta}======================================${colors.reset}\n`);
  
  console.log(`Testing API at: ${colors.yellow}${API_BASE_URL}${colors.reset}\n`);
  
  const results = [];
  
  for (const test of tests) {
    const result = await runTest(test);
    results.push(result);
    
    // Wait a bit between tests
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // Summary
  console.log(`${colors.magenta}======================================${colors.reset}`);
  console.log(`${colors.magenta}              SUMMARY                 ${colors.reset}`);
  console.log(`${colors.magenta}======================================${colors.reset}\n`);
  
  const passed = results.filter(r => r.success).length;
  const failed = results.length - passed;
  
  console.log(`Total Tests: ${results.length}`);
  console.log(`${colors.green}Passed: ${passed}${colors.reset}`);
  console.log(`${colors.red}Failed: ${failed}${colors.reset}\n`);
  
  if (failed > 0) {
    console.log(`${colors.red}Failed Tests:${colors.reset}`);
    results.filter(r => !r.success).forEach(result => {
      console.log(`  - ${result.name}: ${result.error || `Status ${result.statusCode} (expected ${result.expectedStatus})`}`);
    });
    console.log();
  }
  
  const avgDuration = results.reduce((sum, r) => sum + (r.duration || 0), 0) / results.length;
  console.log(`Average Response Time: ${avgDuration.toFixed(2)}ms`);
  
  console.log(`\n${colors.yellow}Note: Make sure the API server is running on ${API_BASE_URL}${colors.reset}`);
  console.log(`${colors.yellow}Start the server with: npm run start:dev${colors.reset}`);
}

// Run tests if this script is executed directly
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = { runAllTests, runTest, tests };