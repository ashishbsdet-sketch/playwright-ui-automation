import { type Page, type Locator } from '@playwright/test';

export class CheckoutPage {
  constructor(private readonly page: Page) {}

  async fillInformation(firstName: string, lastName: string, postalCode: string) {
    await this.page.getByPlaceholder('First Name').fill(firstName);
    await this.page.getByPlaceholder('Last Name').fill(lastName);
    await this.page.getByPlaceholder('Zip/Postal Code').fill(postalCode);
    await this.page.getByRole('button', { name: /continue/i }).click();
  }

  async finish() {
    await this.page.getByRole('button', { name: /finish/i }).click();
  }

  async continueWithoutInfo() {
    await this.page.getByRole('button', { name: /continue/i }).click();
  }

  getErrorMessage(): Locator {
    return this.page.getByText(/error:/i);
  }
}
