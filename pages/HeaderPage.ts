import { type Page, expect } from '@playwright/test';

export class HeaderPage {
  constructor(private readonly page: Page) {}

  async openMenu() {
    await this.page.locator('#react-burger-menu-btn').click();
    await this.page.getByText('Logout').waitFor({ state: 'visible' });
  }

  async logout() {
    await this.page.getByText('Logout').click();
  }

  async openCart() {
    await this.page.locator('.shopping_cart_link').click();
    await expect(this.page.getByText('Your Cart')).toBeVisible();
  }

  async getCartCount(): Promise<number> {
    const badge = this.page.locator('.shopping_cart_badge');
    if (!(await badge.count())) return 0;
    const text = await badge.first().textContent();
    return text ? parseInt(text, 10) : 0;
  }
}

export default HeaderPage;
