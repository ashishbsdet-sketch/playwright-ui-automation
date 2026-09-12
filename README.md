# Playwright UI Automation Portfolio

[![Playwright Tests](https://github.com/ashishbsdet-sketch/playwright-ui-automation/actions/workflows/playwright.yml/badge.svg)](https://github.com/ashishbsdet-sketch/playwright-ui-automation/actions/workflows/playwright.yml)

A Playwright and TypeScript automation framework for the Sauce Demo e-commerce application. The project demonstrates maintainable test design, business-flow coverage, cross-browser execution, CI/CD integration and failure diagnostics.

## What this project demonstrates

- Page Object Model with focused, reusable page classes
- Functional, negative and end-to-end checkout scenarios
- Chromium and Firefox execution
- Parallel test support with CI retries
- HTML, JSON and JUnit reports
- Screenshots, video, traces and HAR capture for failed tests
- GitHub Actions validation on pushes and pull requests
- Environment-driven configuration without committed secrets
- Experimental MCP companion for local test and report operations

## Coverage

| Area | Scenarios |
| --- | --- |
| Authentication | Successful and invalid login, logout |
| Inventory | Product details and price sorting |
| Cart | Add multiple products and remove selected items |
| Checkout | Required-field validation and completed purchase |
| End-to-end | Login through order confirmation |

## Project structure

```text
.
├── .github/workflows/       # CI pipeline
├── helpers/                 # Playwright fixture and browser configuration
├── mcp-server/              # Experimental local MCP companion
├── pages/                   # Page Object Model
├── scripts/                 # Report utilities
├── tests/                   # Independent test specifications
├── .env.example             # Safe configuration template
├── playwright.config.ts     # Execution and reporting configuration
└── tsconfig.json            # Strict TypeScript checks
```

## Run locally

Prerequisites: Node.js 20+ and npm.

```bash
git clone https://github.com/ashishbsdet-sketch/playwright-ui-automation.git
cd playwright-ui-automation
npm ci
npx playwright install --with-deps
cp .env.example config/.env
npm test
```

Useful commands:

```bash
npm test                 # Chromium regression
npm run test:all         # Chromium and Firefox
npm run test:headed      # Visible Chromium run
npm run test:debug       # Playwright Inspector
npm run test:typecheck   # Strict TypeScript validation
npm run report           # Open the latest HTML report
```

## Configuration

| Variable | Purpose | Default |
| --- | --- | --- |
| `URL` | Application base URL | `https://www.saucedemo.com` |
| `USERNAME` | Test account | `standard_user` |
| `PASSWORD` | Test password | `secret_sauce` |
| `KEEP_HAR` | Keep HAR files for successful tests | `false` |

Copy `.env.example` to `config/.env` for local execution. For real applications, store credentials in GitHub Actions secrets and never commit them.

## CI and diagnostics

The pipeline performs a locked dependency installation, strict TypeScript validation and the Chromium regression suite in an official Playwright container. Reports are retained as workflow artifacts. Failed tests include the relevant screenshot, video, trace and network HAR for investigation.

## Design decisions

- User-facing locators are preferred where practical because they reflect how users interact with the application.
- Page objects contain UI operations while tests retain business intent and assertions.
- Tests use isolated browser contexts, which prevents state leakage.
- CI uses bounded retries and concurrency cancellation to reduce noise without hiding persistent failures.

## MCP companion

The `mcp-server/` directory is an experimental local companion for exposing test operations. It is intentionally separated from the core framework, and automatic reruns are disabled unless `MCP_ALLOW_HEAL=true`.

## Roadmap

- Add authenticated storage-state fixtures for faster suites
- Add API-assisted test-data setup
- Add accessibility checks and visual comparisons
- Add tagged smoke and regression projects

## Disclaimer

Sauce Demo is a public training application. This repository is an independent portfolio project and is not affiliated with Sauce Labs.
