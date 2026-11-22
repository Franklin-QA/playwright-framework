# Playwright + TypeScript E2E Framework

![Playwright Tests](https://github.com/Franklin-QA/playwright-ts-e2e-framework/actions/workflows/playwright.yml/badge.svg)

A production-style test automation framework built with **Playwright and TypeScript**. It tests a web shop UI across two browsers and a REST API, using page objects, custom fixtures, saved login sessions, accessibility checks and sharded parallel runs in GitHub Actions.

It runs against two free public practice sites, so anyone can clone it and run it in minutes:

| Layer | System under test |
|---|---|
| UI | [Sauce Demo](https://www.saucedemo.com), a demo web shop |
| API | [Restful-Booker](https://restful-booker.herokuapp.com), a practice booking API |

---

## What this project demonstrates

- **Page Object Model** in TypeScript, with one class per page and no selectors inside tests
- **Custom fixtures**: tests request `inventoryPage` or `authToken`, and Playwright builds them
- **Login once, reuse everywhere**: a setup project saves the session (`storageState`), so UI tests skip the login screen
- **Cross-browser testing** on Chromium and Firefox
- **API testing** covering the full CRUD lifecycle, auth and negative cases (403, 404, bad credentials)
- **Accessibility testing** with axe-core against WCAG 2.1 AA rules
- **Unique test data** per test, so parallel runs never collide
- **CI/CD**: GitHub Actions runs 3 parallel shards, merges them into one HTML report, and runs nightly
- **Debuggability**: traces, screenshots and videos are captured automatically on failure

---

## Test coverage

| Suite | File | What it checks |
|---|---|---|
| Login | `tests/ui/login.spec.ts` | Valid login, locked-out user, invalid credentials, empty fields, protected-page redirect |
| Inventory | `tests/ui/inventory.spec.ts` | Product count, price and name sorting, cart badge add/remove |
| Checkout | `tests/ui/checkout.spec.ts` | Full end-to-end order with subtotal check, required-field validation |
| Accessibility | `tests/ui/accessibility.spec.ts` | No critical WCAG violations on the login page |
| Booking API | `tests/api/booking.spec.ts` | Health check, CRUD lifecycle, search, missing and invalid tokens, bad credentials, 404 |

Tags: `@smoke` marks the fast critical-path tests, and `@a11y` marks accessibility tests.

---

## Project structure

```
playwright-ts-e2e-framework/
├── playwright.config.ts      # projects: ui-setup, chromium, firefox, api
├── fixtures/test.ts          # custom fixtures (page objects, API token)
├── pages/                    # Page Object Model
│   ├── LoginPage.ts
│   ├── InventoryPage.ts
│   ├── CartPage.ts
│   └── CheckoutPage.ts
├── test-data/                # users, customer and booking data builders
├── tests/
│   ├── setup/auth.setup.ts   # logs in once and saves the session
│   ├── ui/                   # browser tests
│   └── api/                  # API tests
└── .github/workflows/playwright.yml
```

---

## How to run it

### Prerequisites
- **Node.js 20+** ([download](https://nodejs.org))
- Git

### 1. Install
```bash
git clone https://github.com/Franklin-QA/playwright-ts-e2e-framework.git
cd playwright-ts-e2e-framework
npm install
npx playwright install --with-deps chromium firefox
```

### 2. Run tests
```bash
npm test                         # everything
npm run test:ui                  # browser tests only
npm run test:api                 # API tests only
npm run test:a11y                # accessibility tests only
npx playwright test --grep @smoke    # smoke suite only
npm run test:headed              # watch the browser run
```

### 3. View the report
```bash
npm run report
```
The HTML report shows every test, plus a trace viewer, screenshot and video for any failure.

### Point it at another environment
```bash
UI_BASE_URL=https://staging.example.com API_BASE_URL=https://api.staging.example.com npm test
```

---

## CI/CD

> **Tip:** after your first `npm install`, commit the generated `package-lock.json`. You can then switch the workflow to `npm ci` with `cache: npm` for faster, reproducible builds.

The workflow in `.github/workflows/playwright.yml`:
1. Runs on every push, every pull request, nightly, and on demand.
2. Type-checks the TypeScript code before any test runs.
3. Splits the suite across **3 parallel shards**.
4. Merges all shards into **one HTML report**, downloadable from the run's **Artifacts** section.

---

## Design notes

- **Selectors** use the site's `data-test` attributes (`testIdAttribute: 'data-test'`), which are more stable than CSS classes.
- **No hard-coded waits.** Playwright's auto-waiting and web-first assertions (`toHaveText`, `toBeVisible`) keep tests reliable.
- **Retries happen only in CI** (2), and traces are recorded on the first retry, so flaky tests surface instead of hiding.
- **The accessibility gate** fails only on critical violations, because the demo site has known moderate issues. The full axe results are attached to the report.

## Troubleshooting

| Problem | Fix |
|---|---|
| `browserType.launch: Executable doesn't exist` | Run `npx playwright install --with-deps` |
| API tests fail with connection errors | Restful-Booker is a free public service that occasionally goes down. Retry later. |
| UI tests fail at login | Check that https://www.saucedemo.com is reachable from your network |

---

**Author:** Franklin, QA Automation Lead · [LinkedIn](https://www.linkedin.com/in/franklin-c-5194851b1/) · [GitHub](https://github.com/Franklin-QA)
