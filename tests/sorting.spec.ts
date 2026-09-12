import { test, expect } from '../helpers/hooks';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';

test.describe('sorting', () => {
  test('sort products by price low to high', async ({ page }) => {
    const login = new LoginPage(page);
    await login.open();
    await login.signIn(process.env.USERNAME || 'standard_user', process.env.PASSWORD || 'secret_sauce');

    const inventory = new InventoryPage(page);
    await inventory.sortBy('lohi');
    const numeric = await inventory.getPrices();
    const sorted = [...numeric].sort((a,b) => a - b);
    expect(numeric).toEqual(sorted);
  });
});
