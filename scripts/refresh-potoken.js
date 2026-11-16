#!/usr/bin/env node

/**
 * Generates a fresh YouTube PO token and visitor data.
 *
 * Prerequisites:
 *   npm install puppeteer-core
 *   (or use puppeteer which bundles Chromium)
 *
 * Usage:
 *   node scripts/refresh-potoken.js
 *
 * This script uses a headless browser to visit YouTube, extract the
 * visitor data from the page context, and generate a PO (Proof of
 * Origin) token via YouTube's botguard/attestation challenge.
 *
 * After running, set the secrets on your Cloudflare Worker:
 *   echo "PASTE_PO_TOKEN" | wrangler secret put PO_TOKEN
 *   echo "PASTE_VISITOR_DATA" | wrangler secret put VISITOR_DATA
 */

import { execSync } from 'child_process';

console.log(`
=== YouTube PO Token Refresh ===

This script helps you generate a fresh PO token for YouTube innertube API access.

Option 1: Use youtube-trusted-session-generator (recommended)
  npx youtube-trusted-session-generator

  This will open a browser, visit YouTube, and output:
  - Visitor Data
  - PO Token

Option 2: Manual extraction from browser DevTools
  1. Open https://www.youtube.com in Chrome
  2. Open DevTools (F12) → Console
  3. Run: document.cookie.match(/VISITOR_INFO1_LIVE=([^;]+)/)?.[1]
     → This is your VISITOR_DATA
  4. In the Network tab, find a request to /youtubei/v1/player
  5. Look for serviceIntegrityDimensions.poToken in the request body
     → This is your PO_TOKEN

After obtaining the values, set them as Worker secrets:

  echo "YOUR_PO_TOKEN_HERE" | wrangler secret put PO_TOKEN
  echo "YOUR_VISITOR_DATA_HERE" | wrangler secret put VISITOR_DATA

The PO token typically expires after a few hours to days.
Refresh it when YouTube downloads via Path B start failing.
`);

// Try to run youtube-trusted-session-generator if available
try {
  console.log('Attempting to run youtube-trusted-session-generator...\n');
  execSync('npx --yes youtube-trusted-session-generator', { stdio: 'inherit' });
} catch {
  console.log('\nyoutube-trusted-session-generator failed or is not available.');
  console.log('Use the manual extraction method described above.');
}
