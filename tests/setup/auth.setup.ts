import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { USERS } from '../../test-data/users';

const AUTH_FILE = '.auth/standard-user.json';

/** Runs once before UI tests: logs in through the UI and saves the session. */
setup('authenticate as standard user', async ({ page }) => {
  const login = new LoginPage(page);
  await login.open();
  await login.login(USERS.standard.username, USERS.standard.password);
  await expect(page).toHaveURL(/inventory/);
  await page.context().storageState({ path: AUTH_FILE });
});
