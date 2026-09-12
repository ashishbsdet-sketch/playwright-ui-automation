import { test, expect } from '../helpers/hooks';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';

test.describe('product page', () => {
  test('can open product details and return', async ({ page }) => {
    const login = new LoginPage(page);
    await login.open();
    await login.signIn(process.env.USERNAME || 'standard_user', process.env.PASSWORD || 'secret_sauce');

    // Click the product's "View details" button (not a link)
      const inventory = new InventoryPage(page);
      const product = await inventory.openProduct('Sauce Labs Backpack');
      await product.assertLoaded('Sauce Labs Backpack');
      await product.backToProducts();
  });
});
