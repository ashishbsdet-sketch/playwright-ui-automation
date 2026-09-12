#!/usr/bin/env node
// Minimal enhanced report generator (clean copy)
const fs = require('fs');
const path = require('path');

const OUT = path.join(process.cwd(), 'playwright-report', 'enhanced-report.html');
const TEST_RESULTS = path.join(process.cwd(), 'test-results');
const PLAYWRIGHT_REPORT = path.join(process.cwd(), 'playwright-report', 'index.html');

fs.mkdirSync(path.dirname(OUT), { recursive: true });

function collect() {
  if (!fs.existsSync(TEST_RESULTS)) return [];
  return fs.readdirSync(TEST_RESULTS, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => ({ name: d.name, files: fs.readdirSync(path.join(TEST_RESULTS, d.name)) }));
}

const groups = collect();
let html = `<!doctype html><html><head><meta charset="utf-8"><title>Enhanced Playwright Report</title></head><body>`;
if (fs.existsSync(PLAYWRIGHT_REPORT)) html += `<p><a href="./index.html">Open Playwright HTML Report</a></p>`;
html += `<h1>Enhanced Playwright Report</h1>`;
if (!groups.length) html += `<p>No test-results found.</p>`;
for (const g of groups) {
  html += `<h3>${g.name}</h3>`;
  for (const f of g.files) {
    const rel = path.relative(path.dirname(OUT), path.join(TEST_RESULTS, g.name, f)).split(path.sep).join('/');
    const ext = path.extname(f).toLowerCase();
    if (['.png', '.jpg', '.jpeg', '.gif'].includes(ext)) html += `<a href="${rel}" target="_blank"><img src="${rel}" style="max-width:160px;margin:6px"/></a>`;
    else html += `<div><a href="${rel}" target="_blank">${f}</a></div>`;
  }
}
html += `</body></html>`;
fs.writeFileSync(OUT, html, 'utf8');
console.log('Enhanced report generated at', OUT);
