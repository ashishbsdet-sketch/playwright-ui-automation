# Playwright UI Tests

This repository contains a small Playwright + TypeScript test suite for the Sauce Demo sample app.

What's included
- Page objects in `pages/` (`LoginPage`, `InventoryPage`, `CartPage`, `CheckoutPage`).
- Tests in `tests/` covering login, end-to-end purchase flow, product, cart, checkout validation and sorting.
- Helpers in `helpers/` including `BrowserManager` and test hooks that record HARs and attach artifacts on failures.
- Playwright configuration in `playwright.config.ts` enabling screenshots, video-on-failure, trace on first retry, and retries in CI.
- A GitHub Actions workflow at `.github/workflows/playwright.yml` to run the tests and upload artifacts.

Quick start

1. Install dependencies and browsers

```bash
npm install
npx playwright install --with-deps
```

2. Run tests (default runs Chromium only)

```bash
npm test
```

3. Run headed (visible) tests

```bash
npm run test:headed
```

4. Run all projects (all browsers defined in `playwright.config.ts`)

```bash
npx playwright test
```

Environment variables
- The repository uses `config/.env` by default for URL and credentials. Keys used:
	- `URL` — base URL (default: https://www.saucedemo.com)
	- `USERNAME` — login username (default: `standard_user`)
	- `PASSWORD` — login password (default: `secret_sauce`)

For CI, set the same keys as repository secrets (`URL`, `USERNAME`, `PASSWORD`) so the workflow can run safely.

Artifacts and debugging
- Playwright HTML report is written to `playwright-report/` after a run. Open locally with:

```bash
npx playwright show-report
```

- Test artifacts (HARs, screenshots, videos, traces) are stored under `test-results/` and uploaded by the CI workflow.

Project layout

- `pages/` — page object files
- `tests/` — test specs
- `helpers/` — test hooks and browser manager
- `playwright.config.ts` — Playwright configuration
- `package.json` — scripts and dev dependencies

Troubleshooting
- If Playwright complains about missing browsers, run `npx playwright install --with-deps`.
- If you change or add environment variables, restart your shell or run `source config/.env` when testing locally (or set them in your environment).

Contributing
- To add tests, add new files under `tests/` and reuse page objects from `pages/` and hooks from `helpers/hooks.ts`.

Questions or changes you'd like me to make?


