import { type Page, expect } from '@playwright/test';

export class ProductPage {
  constructor(private readonly page: Page) {}

  async assertLoaded(name: string) {
    await expect(this.page.getByText(name)).toBeVisible();
  }

  async getPrice(): Promise<number> {
    const text = await this.page.locator('.inventory_details_price').textContent();
    return parseFloat((text || '').replace('$', '').trim());
  }

  async getDescription(): Promise<string | null> {
    return this.page.locator('.inventory_details_desc').textContent();
  }

  async addToCart() {
    const add = this.page.getByRole('button', { name: /add to cart/i });
    await add.click();
    await this.page.getByRole('button', { name: /remove/i }).waitFor({ state: 'visible' });
  }

  async backToProducts() {
    await this.page.getByRole('button', { name: /back to products/i }).click();
    await expect(this.page.getByText('Products')).toBeVisible();
  }
}

export default ProductPage;
