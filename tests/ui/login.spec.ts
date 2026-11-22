import { test, expect } from '../../fixtures/test';
import { USERS } from '../../test-data/users';

// Login tests must start logged out, so they ignore the saved session.
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.open();
  });

  test('standard user can log in @smoke', async ({ loginPage, page }) => {
    await loginPage.login(USERS.standard.username, USERS.standard.password);
    await expect(page).toHaveURL(/inventory/);
  });

  test('locked-out user sees a clear error', async ({ loginPage }) => {
    await loginPage.login(USERS.locked.username, USERS.locked.password);
    await loginPage.expectError(/locked out/i);
  });

  test('invalid credentials are rejected', async ({ loginPage }) => {
    await loginPage.login(USERS.invalid.username, USERS.invalid.password);
    await loginPage.expectError(/do not match/i);
  });

  test('empty username shows a validation error', async ({ loginPage }) => {
    await loginPage.login('', USERS.standard.password);
    await loginPage.expectError(/username is required/i);
  });

  test('protected page redirects when not logged in', async ({ page, loginPage }) => {
    await page.goto('/inventory.html');
    await expect(loginPage.loginButton).toBeVisible();
    await loginPage.expectError(/only access/i);
  });
});
