import fs from 'fs';
import path from 'path';
import { test as base, expect, type Page } from '@playwright/test';
import { BrowserManager } from './BrowserManager';

function sanitize(name: string) {
  return name.replace(/[^a-zA-Z0-9-_.]/g, '_').slice(0, 200);
}

export const test = base.extend<{ page: Page }>({
  page: async ({ browser }, use, testInfo) => {
    const harDir = path.join(process.cwd(), 'test-results', 'har');
    await fs.promises.mkdir(harDir, { recursive: true });
    const harName = `${sanitize(testInfo.title)}-${testInfo.workerIndex}-${testInfo.project.name}.har`;
    const harPath = path.join(harDir, harName);

    const context = await browser.newContext({
      ...BrowserManager.getContextOptions(),
      recordHar: { path: harPath }
    });
    const page = await context.newPage();

    await use(page);
    await context.close();

    const shouldKeepHar =
      testInfo.status !== testInfo.expectedStatus ||
      String(process.env.KEEP_HAR).toLowerCase() === 'true';

    if (shouldKeepHar) {
      await testInfo
        .attach('network.har', { path: harPath, contentType: 'application/json' })
        .catch(() => undefined);
    } else {
      await fs.promises.rm(harPath).catch(() => undefined);
    }
  }
});

export { expect };
