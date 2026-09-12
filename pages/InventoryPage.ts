import { type Page } from '@playwright/test';
import { ProductPage } from './ProductPage';

export class InventoryPage {
  constructor(private readonly page: Page) {}

  async addToCartByName(name: string) {
    const nameLocator = this.page.getByText(name);
    const item = nameLocator.locator('xpath=ancestor::div[contains(@class,"inventory_item")]');
    const addButton = item.getByRole('button', { name: /add to cart/i });
    await addButton.click();
    await item.getByRole('button', { name: /remove/i }).waitFor({ state: 'visible' });
  }

  async openProduct(name: string): Promise<ProductPage> {
    const item = this.page.locator('.inventory_item').filter({ hasText: name });
    await item.locator('[data-test$="-title-link"]').first().click();
    const product = new ProductPage(this.page);
    await product.assertLoaded(name);
    return product;
  }

  async openCart() {
    await this.page.locator('.shopping_cart_link').click();
  }

  async openMenu() {
    await this.page.locator('#react-burger-menu-btn').click();
    await this.page.getByText('Logout').waitFor({ state: 'visible' });
  }

  async logout() {
    await this.page.getByText('Logout').click();
  }

  async sortBy(optionValue: string) {
    await this.page.getByRole('combobox', { name: /sort/i }).selectOption(optionValue);
  }

  async getPrices(): Promise<number[]> {
    const prices = await this.page.locator('.inventory_item_price').allTextContents();
    return prices.map(p => parseFloat(p.replace('$', '')));
  }
}
