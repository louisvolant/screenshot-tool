import { test, expect } from '@playwright/test';

test.describe('Feature 10: Presets Browser, JSON Import/Export & Batch Pack', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('opens and navigates presets library modal, filtering by category and applying a preset', async ({ page }) => {
    const modal = page.locator('#presets-modal');
    await expect(modal).toBeHidden();

    // Open via button
    await page.click('#btn-presets');
    await expect(modal).toBeVisible();

    // Check categories exist
    const categories = page.locator('#presets-categories button');
    await expect(categories).toHaveCount(8); // All, Modern, Dark, Pastel, Vibrant, Minimal, Editorial, Cyber

    // Filter by Dark category
    await page.click('#presets-categories button:has-text("Dark")');
    const darkCards = page.locator('#presets-grid .preset-card');
    const darkCount = await darkCards.count();
    expect(darkCount).toBeGreaterThan(0);

    // Click first dark preset card to apply
    await darkCards.first().click();

    // Modal should close automatically upon selection
    await expect(modal).toBeHidden();
  });

  test('shuffles styles via Shuffle button and keyboard shortcut S', async ({ page }) => {
    const previewCanvas = page.locator('#preview-canvas');
    await expect(previewCanvas).toBeVisible();

    // Click Shuffle button
    await page.click('#btn-shuffle');

    // Trigger keyboard shortcut 'S'
    await page.keyboard.press('s');

    // Toggle presets modal with keyboard shortcut 'G'
    const modal = page.locator('#presets-modal');
    await page.keyboard.press('g');
    await expect(modal).toBeVisible();

    // Close with Escape key
    await page.keyboard.press('Escape');
    await expect(modal).toBeHidden();
  });

  test('exports state to JSON and verifies JSON file export trigger', async ({ page }) => {
    // Listen for download event on JSON export
    const downloadPromise = page.waitForEvent('download');
    await page.click('#btn-json-export');
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toMatch(/studio-preset-.*\.json/);
  });

  test('executes batch ZIP package generation on click', async ({ page }) => {
    // Listen for download event on batch ZIP export
    const downloadPromise = page.waitForEvent('download');
    await page.click('#btn-batch-export');
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toMatch(/.*social-pack.*\.zip/);
  });
});
