#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, 'src');
const DIST_DIR = path.join(__dirname, 'dist');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function cleanDist() {
  log('🧹 Cleaning dist directory...', 'yellow');
  if (fs.existsSync(DIST_DIR)) {
    fs.rmSync(DIST_DIR, { recursive: true, force: true });
    log('✓ Removed old dist directory', 'green');
  }
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function copyRecursive(src, dest) {
  const stats = fs.statSync(src);

  if (stats.isDirectory()) {
    ensureDir(dest);
    const entries = fs.readdirSync(src);

    for (const entry of entries) {
      const srcPath = path.join(src, entry);
      const destPath = path.join(dest, entry);
      copyRecursive(srcPath, destPath);
    }
  } else {
    ensureDir(path.dirname(dest));
    fs.copyFileSync(src, dest);

    // Preserve executable permissions
    const srcStats = fs.statSync(src);
    fs.chmodSync(dest, srcStats.mode);

    return 1; // Return 1 for file count
  }

  return 0;
}

function build() {
  try {
    log('\n🏗️  Building project...', 'blue');
    log('─'.repeat(50), 'blue');

    // Check if src directory exists
    if (!fs.existsSync(SRC_DIR)) {
      throw new Error('src/ directory not found!');
    }

    // Clean dist directory
    cleanDist();

    // Create dist directory
    log('\n📁 Creating dist directory...', 'yellow');
    ensureDir(DIST_DIR);

    // Copy all files
    log('\n📋 Copying files from src/ to dist/...', 'yellow');
    const startTime = Date.now();

    let fileCount = 0;
    const entries = fs.readdirSync(SRC_DIR);

    for (const entry of entries) {
      const srcPath = path.join(SRC_DIR, entry);
      const destPath = path.join(DIST_DIR, entry);

      const stats = fs.statSync(srcPath);
      if (stats.isDirectory()) {
        const dirEntries = fs.readdirSync(srcPath, { recursive: true });
        log(`  Copying ${entry}/... (${dirEntries.length} items)`, 'blue');
        copyRecursive(srcPath, destPath);
        fileCount += dirEntries.length;
      } else {
        log(`  Copying ${entry}`, 'blue');
        fs.copyFileSync(srcPath, destPath);
        fs.chmodSync(destPath, stats.mode);
        fileCount++;
      }
    }

    // Copy CNAME if it exists (for GitHub Pages custom domain)
    const cnamePath = path.join(__dirname, 'CNAME');
    if (fs.existsSync(cnamePath)) {
      log('\n📝 Copying CNAME...', 'yellow');
      fs.copyFileSync(cnamePath, path.join(DIST_DIR, 'CNAME'));
      fileCount++;
    }

    const duration = Date.now() - startTime;

    // Success report
    log('\n' + '─'.repeat(50), 'green');
    log('✅ Build successful!', 'green');
    log(`📊 Copied ${fileCount} files in ${duration}ms`, 'green');
    log(`📦 Output: ${DIST_DIR}`, 'green');
    log('─'.repeat(50) + '\n', 'green');

    process.exit(0);

  } catch (error) {
    log('\n' + '─'.repeat(50), 'red');
    log('❌ Build failed!', 'red');
    log(`Error: ${error.message}`, 'red');
    log('─'.repeat(50) + '\n', 'red');
    process.exit(1);
  }
}

// Run build
build();
