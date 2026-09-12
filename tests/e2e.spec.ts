import { test, expect } from '../helpers/hooks';

const USERNAME = process.env.USERNAME || 'standard_user';
const PASSWORD = process.env.PASSWORD || 'secret_sauce';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { HeaderPage } from '../pages/HeaderPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';

test.describe('e2e flows', () => {
  test('purchase flow completes successfully', async ({ page }) => {
    const login = new LoginPage(page);
    await login.open();
    await login.signIn(USERNAME, PASSWORD);

    const inventory = new InventoryPage(page);
    await inventory.addToCartByName('Sauce Labs Backpack');
    await inventory.openCart();

    const cart = new CartPage(page);
    const count = await cart.getItemCount();
    await expect(count).toBe(1);

    await cart.proceedToCheckout();

    const checkout = new CheckoutPage(page);
    await checkout.fillInformation('Jane', 'Doe', '12345');
    await checkout.finish();

    await expect(page.getByText(/thank you for your order/i)).toBeVisible();
  });

  test('user can logout from inventory', async ({ page }) => {
    const login = new LoginPage(page);
    await login.open();
    await login.signIn('standard_user', 'secret_sauce');

    const inventory = new InventoryPage(page);
    const header = new HeaderPage(page);
    await header.openMenu();
    await header.logout();

    await expect(login.getUsernameField()).toBeVisible();
  });
});
