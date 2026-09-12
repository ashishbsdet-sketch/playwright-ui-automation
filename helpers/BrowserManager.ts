import type { BrowserContextOptions } from '@playwright/test';

export class BrowserManager {
  static getContextOptions(projectName?: string): BrowserContextOptions {
    const common: BrowserContextOptions = {
      viewport: { width: 1280, height: 720 },
      permissions: []
    };

    if ((projectName || '').toLowerCase() === 'firefox') {
      return {
        ...common,
        firefoxUserPrefs: { 'privacy.trackingprotection.enabled': false }
      };
    }

    return common;
  }
}

export default BrowserManager;
