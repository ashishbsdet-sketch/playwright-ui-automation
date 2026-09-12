#!/usr/bin/env node
const http = require('http');
const url = require('url');

const PORT = process.env.MCP_PORT || 8081;

function jsonResponse(res, status, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(status, { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) });
  res.end(body);
}

const { spawn, spawnSync } = require('child_process');

const server = http.createServer(async (req, res) => {
  const u = url.parse(req.url, true);
  if (req.method === 'GET' && u.pathname === '/mcp/ping') {
    return jsonResponse(res, 200, { ok: true, ts: new Date().toISOString() });
  }

  if (req.method === 'GET' && u.pathname === '/mcp/models') {
    // example static model list
    return jsonResponse(res, 200, { models: [{ name: 'playwright-context', version: '0.1' }] });
  }

  if (req.method === 'POST' && u.pathname === '/mcp/context') {
    let body = '';
    for await (const chunk of req) body += chunk;
    try {
      const payload = JSON.parse(body || '{}');
      // echo back a small context object
      return jsonResponse(res, 200, { context: { workspace: process.cwd(), payload } });
    } catch (e) {
      return jsonResponse(res, 400, { error: 'invalid json' });
    }
  }

  if (req.method === 'POST' && u.pathname === '/mcp/execute') {
    let body = '';
    for await (const chunk of req) body += chunk;
    try {
      const payload = JSON.parse(body || '{}');
      // simple echo execution result
      return jsonResponse(res, 200, { result: `Executed ${payload.action || 'noop'}` });
    } catch (e) {
      return jsonResponse(res, 400, { error: 'invalid json' });
    }
  }

  // Auto-healing endpoint (gated by MCP_ALLOW_HEAL=true)
  if (req.method === 'POST' && u.pathname === '/mcp/heal') {
    if (String(process.env.MCP_ALLOW_HEAL || '').toLowerCase() !== 'true') {
      return jsonResponse(res, 403, { error: 'healing disabled' });
    }
    let body = '';
    for await (const chunk of req) body += chunk;
    let payload = {};
    try { payload = JSON.parse(body || '{}'); } catch (e) { return jsonResponse(res, 400, { error: 'invalid json' }); }

    const action = payload.action || 'noop';
    try {
      if (action === 'regenerate-report') {
        // run generator synchronously and return output
        const out = spawnSync(process.execPath, ['scripts/generate-enhanced-report.js'], { cwd: process.cwd(), encoding: 'utf8', timeout: 120000 });
        return jsonResponse(res, 200, { action, stdout: out.stdout, stderr: out.stderr, status: out.status });
      }

      if (action === 'rerun-tests') {
        // start tests in background with KEEP_HAR=true
        const child = spawn('sh', ['-c', 'KEEP_HAR=true npm test'], { cwd: process.cwd(), detached: true, stdio: 'ignore' });
        child.unref();
        return jsonResponse(res, 202, { action, pid: child.pid });
      }

      return jsonResponse(res, 400, { error: 'unknown action' });
    } catch (e) {
      return jsonResponse(res, 500, { error: String(e.message) });
    }
  }

  jsonResponse(res, 404, { error: 'not found' });
});

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`MCP server listening on http://localhost:${PORT}`);
});

process.on('SIGINT', () => process.exit(0));
