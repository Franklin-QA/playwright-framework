import AxeBuilder from '@axe-core/playwright';
import { test, expect } from '../../fixtures/test';

/**
 * Accessibility checks with axe-core (WCAG 2.1 A/AA rules).
 * The demo site has known moderate issues, so the gate fails only on CRITICAL
 * violations; every violation is attached to the report for review.
 */
test.describe('Accessibility @a11y', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('login page has no critical WCAG violations', async ({ page }, testInfo) => {
    await page.goto('/');
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();

    await testInfo.attach('axe-results.json', {
      body: JSON.stringify(results.violations, null, 2),
      contentType: 'application/json',
    });

    const critical = results.violations.filter((v) => v.impact === 'critical');
    expect(critical.map((v) => `${v.id}: ${v.help}`)).toEqual([]);
  });
});
