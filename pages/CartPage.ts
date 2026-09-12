import { type Page } from '@playwright/test';

export class CartPage {
  constructor(private readonly page: Page) {}

  async getItemNames() {
    return this.page.locator('.cart_item .inventory_item_name').allTextContents();
  }

  async getItemCount() {
    // Count items in cart by counting visible "Remove" buttons on the cart page.
    return await this.page.getByRole('button', { name: /remove/i }).count();
  }

  async proceedToCheckout() {
    await this.page.getByRole('button', { name: /checkout/i }).click();
  }

  async removeItem(name: string) {
    const item = this.page.locator('.cart_item').filter({ hasText: name });
    await item.getByRole('button', { name: /remove/i }).click();
  }

  async hasItem(name: string) {
    const names = await this.getItemNames();
    return names.includes(name);
  }
}
