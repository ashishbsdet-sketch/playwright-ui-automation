import { test, expect } from '../helpers/hooks';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { HeaderPage } from '../pages/HeaderPage';

test.describe('checkout validation', () => {
  test('shows an error when customer information is missing', async ({ page }) => {
    const login = new LoginPage(page);
    await login.open();
    await login.signIn(
      process.env.USERNAME || 'standard_user',
      process.env.PASSWORD || 'secret_sauce'
    );

    const inventory = new InventoryPage(page);
    await inventory.addToCartByName('Sauce Labs Backpack');

    const header = new HeaderPage(page);
    await header.openCart();

    const cart = new CartPage(page);
    await cart.proceedToCheckout();

    const checkout = new CheckoutPage(page);
    await checkout.continueWithoutInfo();
    await expect(checkout.getErrorMessage()).toContainText('First Name is required');
  });
});
