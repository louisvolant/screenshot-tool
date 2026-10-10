import { test, expect } from '@playwright/test';

test.describe('Feature 9: Key Metrics & Release Announcement Cards', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Switch to announce tool
    await page.click('button[data-tool="announce"]');
    await expect(page.locator('#panel-tool-title')).toHaveText('Key Metrics & Release Settings');
  });

  test('configures KPI Stat card with hero metrics and sparkline toggle', async ({ page }) => {
    // Initial mode is stat
    await expect(page.locator('#announce-kind-seg button[data-val="stat"]')).toHaveClass(/active/);
    await expect(page.locator('#announce-stat-fields')).toBeVisible();

    // Fill KPI Brand, Value, Label
    const brandInput = page.locator('#stat-brand');
    await brandInput.fill('Venture Metrics');
    await expect(brandInput).toHaveValue('Venture Metrics');

    const valueInput = page.locator('#stat-value');
    await valueInput.fill('$1.5M ARR');
    await expect(valueInput).toHaveValue('$1.5M ARR');

    const labelInput = page.locator('#stat-label');
    await labelInput.fill('Annual Recurring Revenue');
    await expect(labelInput).toHaveValue('Annual Recurring Revenue');

    // Toggle Trend direction to Down then back to Up
    await page.click('#stat-trend-seg button[data-val="down"]');
    await expect(page.locator('#stat-trend-seg button[data-val="down"]')).toHaveClass(/active/);

    await page.click('#stat-trend-seg button[data-val="up"]');
    await expect(page.locator('#stat-trend-seg button[data-val="up"]')).toHaveClass(/active/);

    // Toggle sparkline chart off and on
    const chartCheckbox = page.locator('#stat-chart');
    await expect(chartCheckbox).toBeChecked();
    await chartCheckbox.uncheck();
    await expect(page.locator('#stat-points-field')).toBeHidden();

    await chartCheckbox.check();
    await expect(page.locator('#stat-points-field')).toBeVisible();

    // Modify chart points
    const pointsInput = page.locator('#stat-points');
    await pointsInput.fill('10 18 25 32 40 55 70');
    await expect(pointsInput).toHaveValue('10 18 25 32 40 55 70');
  });

  test('switches to Product Release changelog card and manages changelog items', async ({ page }) => {
    // Switch to Changelog mode
    await page.click('#announce-kind-seg button[data-val="release"]');
    await expect(page.locator('#announce-kind-seg button[data-val="release"]')).toHaveClass(/active/);
    await expect(page.locator('#announce-release-fields')).toBeVisible();
    await expect(page.locator('#announce-stat-fields')).toBeHidden();

    // Update release title, version, and date
    const titleInput = page.locator('#rel-title');
    await titleInput.fill('Autumn 2026 Release');
    await expect(titleInput).toHaveValue('Autumn 2026 Release');

    const versionInput = page.locator('#rel-version');
    await versionInput.fill('v3.0.0-pro');
    await expect(versionInput).toHaveValue('v3.0.0-pro');

    const dateInput = page.locator('#rel-date');
    await dateInput.fill('November 2026');
    await expect(dateInput).toHaveValue('November 2026');

    // Add a new changelog row
    const initialItemCount = await page.locator('#changelog-items-container .item-text-input').count();
    await page.click('#btn-add-changelog');
    const newItemCount = await page.locator('#changelog-items-container .item-text-input').count();
    expect(newItemCount).toBe(initialItemCount + 1);

    // Edit tag and text of the newly added row
    const lastSelect = page.locator('#changelog-items-container .item-tag-select').last();
    await lastSelect.selectOption('fixed');
    await expect(lastSelect).toHaveValue('fixed');

    const lastTextInput = page.locator('#changelog-items-container .item-text-input').last();
    await lastTextInput.fill('Resolved memory leak in batch export pipeline');
    await expect(lastTextInput).toHaveValue('Resolved memory leak in batch export pipeline');

    // Delete the first item
    await page.locator('#changelog-items-container .btn-del-item').first().click();
    const afterDeleteCount = await page.locator('#changelog-items-container .item-text-input').count();
    expect(afterDeleteCount).toBe(newItemCount - 1);
  });
});
