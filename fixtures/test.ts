import { test as base, APIRequestContext, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { ADMIN } from '../test-data/booking';

type Pages = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
};

type Api = {
  /** Auth token for restful-booker write operations. */
  authToken: string;
  api: APIRequestContext;
};

/**
 * Custom fixtures: tests ask for what they need ("inventoryPage", "authToken")
 * and Playwright builds it. No setup code repeated in every test.
 */
export const test = base.extend<Pages & Api>({
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  inventoryPage: async ({ page }, use) => use(new InventoryPage(page)),
  cartPage: async ({ page }, use) => use(new CartPage(page)),
  checkoutPage: async ({ page }, use) => use(new CheckoutPage(page)),

  api: async ({ request }, use) => use(request),

  authToken: async ({ request }, use) => {
    const res = await request.post('/auth', { data: ADMIN });
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.token, 'auth should return a token').toBeTruthy();
    await use(body.token as string);
  },
});

export { expect };
