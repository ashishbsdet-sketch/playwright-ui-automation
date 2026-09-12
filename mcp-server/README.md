# MCP Server (development scaffold)

This is a minimal Model Context Protocol (MCP) server scaffold used for local development and integrations.

Endpoints:

- `GET /mcp/ping` — health check, returns `{ ok: true }`.
- `GET /mcp/models` — returns a small example models list.
- `POST /mcp/context` — accepts JSON payload and returns a small context object.
- `POST /mcp/execute` — accepts JSON payload with `{ action }` and returns a simple execution result.

- `POST /mcp/heal` — auto-healing endpoint. Actions:
	- `regenerate-report` — runs `node scripts/generate-enhanced-report.js` and returns stdout/stderr (sync).
	- `rerun-tests` — starts `KEEP_HAR=true npm test` in the background and returns the spawned pid.

	This endpoint is disabled by default. Enable with `MCP_ALLOW_HEAL=true` environment variable.

Usage:

```bash
# from repository root
npm run mcp:start
curl http://localhost:8081/mcp/ping
```

Port can be configured with the `MCP_PORT` environment variable.

NPM script (convenience)

You can start the MCP server with healing enabled via the convenience npm script:

```bash
# runs the server with healing endpoints enabled
npm run mcp:start:heal
```

This sets `MCP_ALLOW_HEAL=true` for the process and is equivalent to running:

```bash
MCP_ALLOW_HEAL=true npm run mcp:start
```
