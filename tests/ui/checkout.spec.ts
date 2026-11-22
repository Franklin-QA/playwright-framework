import { test, expect } from '../../fixtures/test';
import { CUSTOMER } from '../../test-data/users';

test.describe('Checkout (end to end)', () => {
  test('completes an order and the subtotal matches item prices @smoke', async ({
    inventoryPage, cartPage, checkoutPage,
  }) => {
    await inventoryPage.open();
    await inventoryPage.addToCart('Sauce Labs Backpack');   // $29.99
    await inventoryPage.addToCart('Sauce Labs Onesie');     // $7.99
    await inventoryPage.goToCart();

    await expect(cartPage.items).toHaveCount(2);
    await cartPage.checkout();
    await checkoutPage.fillCustomer(CUSTOMER.firstName, CUSTOMER.lastName, CUSTOMER.postalCode);

    expect(await checkoutPage.subtotalValue()).toBeCloseTo(37.98, 2);
    await checkoutPage.finish();
  });

  test('checkout requires customer details', async ({ inventoryPage, cartPage, checkoutPage }) => {
    await inventoryPage.open();
    await inventoryPage.addToCart('Sauce Labs Backpack');
    await inventoryPage.goToCart();
    await cartPage.checkout();
    await checkoutPage.continueButton.click();
    await expect(checkoutPage.error).toContainText(/first name is required/i);
  });
});
