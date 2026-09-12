#!/usr/bin/env node
// Enhanced Playwright report generator (single cohesive implementation)
const fs = require('fs');
const path = require('path');

const OUT = path.join(process.cwd(), 'playwright-report', 'enhanced-report.html');
const TEST_RESULTS = path.join(process.cwd(), 'test-results');
const JUNIT = path.join(TEST_RESULTS, 'junit', 'results.xml');
const PLAYWRIGHT_REPORT = path.join(process.cwd(), 'playwright-report', 'index.html');

function listDirSafe(dir) {
  try { return fs.readdirSync(dir, { withFileTypes: true }); } catch (e) { return []; }
}

function walk(dir) {
  const res = [];
  if (!fs.existsSync(dir)) return res;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) res.push(...walk(full)); else res.push(full);
  }
  return res;
}

function collectTests() {
  if (!fs.existsSync(TEST_RESULTS)) return [];
  return fs.readdirSync(TEST_RESULTS, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => ({ name: d.name, path: path.join(TEST_RESULTS, d.name) }));
}

function parseJUnit() {
  if (!fs.existsSync(JUNIT)) return null;
  const xml = fs.readFileSync(JUNIT, 'utf8');
  const tests = xml.match(/tests="(\d+)"/)?.[1] || null;
  const failures = xml.match(/failures="(\d+)"/)?.[1] || null;
  const skipped = xml.match(/skipped="(\d+)"/)?.[1] || xml.match(/disabled="(\d+)"/)?.[1] || null;
  return {
    tests: tests ? parseInt(tests, 10) : null,
    failures: failures ? parseInt(failures, 10) : 0,
    skipped: skipped ? parseInt(skipped, 10) : 0
  };
}

function asize(n) { return Number.isFinite(n) ? n : 0; }

function makeDonut(passed, failed, skipped) {
  const total = passed + failed + skipped || 1;
  const size = 120;
  const radius = 50;
  const cx = 60, cy = 60;
  const circumference = 2 * Math.PI * radius;
  const a1 = (passed / total) * circumference;
  const a2 = (failed / total) * circumference;
  const a3 = (skipped / total) * circumference;
  return `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
      <g transform="rotate(-90 ${cx} ${cy})">
        <circle cx="${cx}" cy="${cy}" r="${radius}" fill="transparent" stroke="#e6e6e6" stroke-width="20" />
        <circle cx="${cx}" cy="${cy}" r="${radius}" fill="transparent" stroke="#28a745" stroke-width="20" stroke-dasharray="${a1} ${circumference - a1}" stroke-linecap="butt" />
        <circle cx="${cx}" cy="${cy}" r="${radius}" fill="transparent" stroke="#d73a49" stroke-width="20" stroke-dasharray="${a2} ${circumference - a2}" stroke-dashoffset="-${a1}" stroke-linecap="butt" />
        <circle cx="${cx}" cy="${cy}" r="${radius}" fill="transparent" stroke="#ffd33d" stroke-width="20" stroke-dasharray="${a3} ${circumference - a3}" stroke-dashoffset="-${a1 + a2}" stroke-linecap="butt" />
      </g>
    </svg>
  `;
}

function rel(from, to) { return path.relative(path.dirname(from), to).split(path.sep).join('/'); }

function build() {
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  const junit = parseJUnit();
  const tests = collectTests();

  const total = asize(junit?.tests) || tests.length;
  const failed = asize(junit?.failures) || 0;
  const skipped = asize(junit?.skipped) || 0;
  const passed = Math.max(0, total - failed - skipped);

  let html = `<!doctype html><html><head><meta charset="utf-8"><title>Enhanced Playwright Report</title>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <style>
    body{font-family:Inter,Arial,Helvetica,sans-serif;margin:20px;color:#222}
    .header{display:flex;align-items:center;gap:24px}
    .summary{display:flex;gap:16px;align-items:center}
    .kpi{background:#f7f8fa;padding:12px;border-radius:8px}
    .tests{margin-top:20px}
    .test{border:1px solid #eee;padding:12px;border-radius:8px;margin-bottom:12px}
    .attachments img{max-width:160px;max-height:120px;margin:4px;border:1px solid #ddd}
    a{color:#0366d6}
  </style>
  </head><body>`;

  html += `<div class="header"><div class="summary"><div class="kpi"><strong>Total</strong><div>${total}</div></div><div class="kpi"><strong>Passed</strong><div style="color:#28a745">${passed}</div></div><div class="kpi"><strong>Failed</strong><div style="color:#d73a49">${failed}</div></div><div class="kpi"><strong>Skipped</strong><div style="color:#ffd33d">${skipped}</div></div></div><div>${makeDonut(passed, failed, skipped)}</div></div>`;

  if (fs.existsSync(PLAYWRIGHT_REPORT)) {
    html += `<p><a href="./index.html">Open Playwright HTML Report</a></p>`;
  }

  html += `<div class="tests"><h2>Test Result Folders</h2>`;
  if (!tests.length) html += `<div>No test-results found.</div>`;
  for (const t of tests) {
    html += `<div class="test"><h3>${t.name}</h3>`;
    const files = walk(t.path).filter(f => !f.endsWith('.json') && !f.endsWith('.xml'));
    if (files.length === 0) {
      html += `<div>No attachments</div>`;
    } else {
      html += `<div class="attachments">`;
      for (const f of files) {
        const ext = path.extname(f).toLowerCase();
        const href = rel(OUT, f);
        if (['.png', '.jpg', '.jpeg', '.gif'].includes(ext)) {
          html += `<a href="${href}" target="_blank"><img src="${href}" alt="${path.basename(f)}"/></a>`;
        } else if (['.webm', '.mp4'].includes(ext)) {
          html += `<div><a href="${href}" target="_blank">Video: ${path.basename(f)}</a></div>`;
        } else if (['.har'].includes(ext)) {
          html += `<div><a href="${href}" target="_blank">HAR: ${path.basename(f)}</a></div>`;
        } else {
          html += `<div><a href="${href}" target="_blank">${path.basename(f)}</a></div>`;
        }
      }
      html += `</div>`;
    }
    html += `</div>`;
  }
  html += `</div>`;

  html += `<hr/><footer>Generated: ${new Date().toISOString()}</footer></body></html>`;

  fs.writeFileSync(OUT, html, 'utf8');
  console.log('Enhanced report generated at', OUT);
}

build();

