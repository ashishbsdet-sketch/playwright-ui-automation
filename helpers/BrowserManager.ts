type ContextOptions = any;

export class BrowserManager {
  static getContextOptions(projectName?: string): ContextOptions {
    const common = {
      viewport: { width: 1280, height: 720 },
      permissions: []
    };

    switch ((projectName || '').toLowerCase()) {
      case 'chromium':
        return {
          ...common,
          // chromium-specific tweaks can go here
        };
      case 'firefox':
        return {
          ...common,
          // firefox-specific tweaks
          firefoxUserPrefs: { 'privacy.trackingprotection.enabled': false }
        };
      case 'webkit':
        return {
          ...common,
          // webkit-specific tweaks
        };
      default:
        return common;
    }
  }
}

export default BrowserManager;
