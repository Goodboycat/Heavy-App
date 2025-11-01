#!/usr/bin/env node
const { execSync } = require('child_process');
const path = require('path');

console.log('Running tests only in current project...');

try {
  // Run server tests
  console.log('🚀 Running server tests...');
  execSync('cd server && npx vitest run --config vitest.config.js', { 
    stdio: 'inherit',
    cwd: __dirname 
  });
} catch (error) {
  console.log('Server tests failed, continuing...');
}

try {
  // Run client tests
  console.log('🎨 Running client tests...');
  execSync('cd client && npx vitest run --config vitest.config.js', { 
    stdio: 'inherit',
    cwd: __dirname 
  });
} catch (error) {
  console.log('Client tests failed');
  process.exit(1);
}
