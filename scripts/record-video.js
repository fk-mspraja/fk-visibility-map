/**
 * FourKites Globe — 4K Video Generator
 * Uses Puppeteer v22+ built-in screencast → WebM → 4K MP4 via FFmpeg
 *
 * Usage:  node scripts/record-video.js
 */

import puppeteer from 'puppeteer';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const URL      = 'https://gsko-globe-react-a147xtuyg-mspraja-2873s-projects.vercel.app';
const WIDTH    = 1920;
const HEIGHT   = 1080;
const DURATION = 75 * 1000;           // ms
const WEBM_OUT = path.join(__dirname, '../output/globe_raw.webm');
const MP4_OUT  = path.join(__dirname, '../output/fourkites_globe_4k.mp4');

fs.mkdirSync(path.join(__dirname, '../output'), { recursive: true });

console.log(`
╔══════════════════════════════════════════════╗
║   FourKites Globe — 4K Video Generator       ║
╠══════════════════════════════════════════════╣
║  Capture  : 1920×1080 via Puppeteer screencast║
║  Output   : 3840×2160 4K MP4                 ║
║  Duration : 75 seconds                       ║
╚══════════════════════════════════════════════╝
`);

// ── Step 1: Capture using Puppeteer screencast ───────────────────────────────
async function captureScreencast() {
  console.log('🚀 Launching browser...');

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: WIDTH, height: HEIGHT },
    args: [
      `--window-size=${WIDTH},${HEIGHT}`,
      '--no-sandbox',
      '--disable-infobars',
      '--disable-notifications',
      '--disable-extensions',
    ],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: WIDTH, height: HEIGHT });

  console.log(`📡 Loading globe...`);
  await page.goto(URL, { waitUntil: 'networkidle0', timeout: 30000 });

  console.log('⏳ Waiting 8s for globe to fully render...');
  await new Promise(r => setTimeout(r, 8000));

  // Hide cursor for clean recording
  await page.evaluate(() => { document.body.style.cursor = 'none'; });

  console.log(`🎬 Recording for ${DURATION / 1000}s (watch the browser window)...\n`);

  // Puppeteer v22+ built-in screencast
  const recorder = await page.screencast({ path: WEBM_OUT });

  // Show progress
  const start = Date.now();
  const timer = setInterval(() => {
    const elapsed = ((Date.now() - start) / 1000).toFixed(0);
    const remaining = Math.max(0, DURATION / 1000 - elapsed);
    process.stdout.write(`\r  ⏱️  Recording: ${elapsed}s elapsed | ${remaining}s remaining...`);
  }, 1000);

  await new Promise(r => setTimeout(r, DURATION));
  clearInterval(timer);

  console.log('\n\n✅ Stopping recorder...');
  await recorder.stop();
  await browser.close();

  const sizeMB = (fs.statSync(WEBM_OUT).size / 1024 / 1024).toFixed(1);
  console.log(`📦 Raw WebM: ${sizeMB} MB`);
}

// ── Step 2: Convert WebM → 4K MP4 ───────────────────────────────────────────
async function encodeMP4() {
  console.log('\n🎞️  Encoding 4K MP4 with FFmpeg...\n');

  const args = [
    '-i', WEBM_OUT,
    '-vf', [
      `scale=3840:2160:flags=lanczos`,
      'unsharp=5:5:0.5:3:3:0.3',      // slight sharpening after upscale
    ].join(','),
    '-c:v', 'libx264',
    '-preset', 'slow',
    '-crf', '16',
    '-pix_fmt', 'yuv420p',
    '-movflags', '+faststart',
    '-profile:v', 'high',
    '-level', '5.2',
    '-maxrate', '68M',
    '-bufsize', '68M',
    '-y',
    MP4_OUT,
  ];

  return new Promise((resolve, reject) => {
    const ff = spawn('ffmpeg', args, { stdio: 'inherit' });
    ff.on('close', code => code === 0 ? resolve() : reject(new Error(`FFmpeg exited: ${code}`)));
  });
}

// ── Main ─────────────────────────────────────────────────────────────────────
const t0 = Date.now();
try {
  await captureScreencast();
  await encodeMP4();

  fs.unlinkSync(WEBM_OUT); // cleanup raw

  const mins = ((Date.now() - t0) / 60000).toFixed(1);
  const size = (fs.statSync(MP4_OUT).size / 1024 / 1024).toFixed(0);

  console.log(`
╔══════════════════════════════════════════════╗
║           ✅ 4K VIDEO READY!                 ║
╠══════════════════════════════════════════════╣
║  📁 output/fourkites_globe_4k.mp4            ║
║  📦 ${(size + ' MB').padEnd(43)}║
║  ⏱️  ${(mins + ' min total').padEnd(43)}║
╚══════════════════════════════════════════════╝
`);

} catch (err) {
  console.error('\n❌ Error:', err.message);
  process.exit(1);
}
