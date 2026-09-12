import { test } from '../helpers/hooks';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';

test.describe('product details', () => {
  test('opens product details and returns to inventory', async ({ page }) => {
    const login = new LoginPage(page);
    await login.open();
    await login.signIn(
      process.env.USERNAME || 'standard_user',
      process.env.PASSWORD || 'secret_sauce'
    );

    const inventory = new InventoryPage(page);
    const product = await inventory.openProduct('Sauce Labs Backpack');
    await product.assertLoaded('Sauce Labs Backpack');
    await product.backToProducts();
  });
});
