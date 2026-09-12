import { test, expect } from '../helpers/hooks';

const USERNAME = process.env.USERNAME || 'standard_user';
const PASSWORD = process.env.PASSWORD || 'secret_sauce';
import { LoginPage } from '../pages/LoginPage';

test.describe('authentication', () => {
  test('standard user can sign in', async ({ page }) => {
    const login = new LoginPage(page);
    await login.open();
    await login.signIn(USERNAME, PASSWORD);
    await expect(page).toHaveURL(/inventory/);
    await expect(page.getByText('Products')).toBeVisible();
  });

  test('invalid credentials show a useful error', async ({ page }) => {
    const login = new LoginPage(page);
    await login.open();
    await login.signIn('invalid_user', 'wrong_password');
    await expect(page.getByText(/Username and password do not match/)).toBeVisible();
  });
});

