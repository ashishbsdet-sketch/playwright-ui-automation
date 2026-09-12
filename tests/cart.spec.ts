import { test, expect } from '../helpers/hooks';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { HeaderPage } from '../pages/HeaderPage';

test.describe('cart', () => {
  test('add and remove items from cart', async ({ page }) => {
    const login = new LoginPage(page);
    await login.open();
    await login.signIn(
      process.env.USERNAME || 'standard_user',
      process.env.PASSWORD || 'secret_sauce'
    );

    const inventory = new InventoryPage(page);
    await inventory.addToCartByName('Sauce Labs Backpack');
    await inventory.addToCartByName('Sauce Labs Bike Light');

    const header = new HeaderPage(page);
    await header.openCart();

    const cart = new CartPage(page);
    await cart.removeItem('Sauce Labs Bike Light');

    const names = await cart.getItemNames();
    expect(names).toContain('Sauce Labs Backpack');
    expect(names).not.toContain('Sauce Labs Bike Light');
  });
});
