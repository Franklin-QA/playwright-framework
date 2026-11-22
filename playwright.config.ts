import { defineConfig, devices } from '@playwright/test';

const UI_BASE_URL = process.env.UI_BASE_URL ?? 'https://www.saucedemo.com';
const API_BASE_URL = process.env.API_BASE_URL ?? 'https://restful-booker.herokuapp.com';
const isCI = !!process.env.CI;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 4 : undefined,
  timeout: 30_000,
  expect: { timeout: 7_000 },
  // CI writes blob reports so shards can be merged into one HTML report.
  reporter: isCI ? [['blob'], ['github']] : [['html', { open: 'never' }], ['list']],
  use: {
    testIdAttribute: 'data-test',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    // 1. Logs in once and saves the session so UI tests skip the login screen.
    {
      name: 'ui-setup',
      testDir: './tests/setup',
      testMatch: /.*\.setup\.ts/,
      use: { baseURL: UI_BASE_URL },
    },
    // 2. UI tests on two browsers, reusing the saved session.
    {
      name: 'chromium',
      testDir: './tests/ui',
      dependencies: ['ui-setup'],
      use: { ...devices['Desktop Chrome'], baseURL: UI_BASE_URL, storageState: '.auth/standard-user.json' },
    },
    {
      name: 'firefox',
      testDir: './tests/ui',
      dependencies: ['ui-setup'],
      use: { ...devices['Desktop Firefox'], baseURL: UI_BASE_URL, storageState: '.auth/standard-user.json' },
    },
    // 3. API tests: no browser needed.
    {
      name: 'api',
      testDir: './tests/api',
      use: { baseURL: API_BASE_URL, extraHTTPHeaders: { Accept: 'application/json' } },
    },
  ],
});
