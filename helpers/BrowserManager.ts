import type { BrowserContextOptions } from '@playwright/test';

export class BrowserManager {
  static getContextOptions(): BrowserContextOptions {
    return {
      viewport: { width: 1280, height: 720 },
      permissions: []
    };
  }
}

export default BrowserManager;
