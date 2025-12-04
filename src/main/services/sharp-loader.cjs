/**
 * Sharp Loader - CommonJS wrapper for native module
 * This file is NOT processed by Vite/TypeScript - it's pure CommonJS
 * that gets copied to the build directory and loaded at runtime
 */

// Use dynamic require to load sharp
function loadSharp() {
  try {
    const sharp = require('sharp');
    console.log('✅ Sharp loaded successfully via CommonJS wrapper');
    console.log('📦 Sharp version:', sharp.versions?.sharp || 'unknown');
    return sharp;
  } catch (error) {
    console.error('❌ Failed to load sharp:', error);
    throw new Error(`Cannot load sharp: ${error.message}`);
  }
}

module.exports = { loadSharp };
