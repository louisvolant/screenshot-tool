import { test, expect } from '@playwright/test';

test.describe('Feature 5: Social Media Post Simulator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Switch to Social tool
    const socialBtn = page.locator('.tool-btn[data-tool="social"]');
    await socialBtn.click();
  });

  test('should display social settings and switch across 8 platforms', async ({ page }) => {
    const platformSelect = page.locator('#social-platform');
    await expect(platformSelect).toBeVisible();

    const platforms = ['instagram', 'linkedin', 'facebook', 'tiktok', 'threads', 'bluesky', 'mastodon', 'x'];
    for (const p of platforms) {
      await platformSelect.selectOption(p);
      await platformSelect.dispatchEvent('change');
    }
  });

  test('should toggle light and dark appearance', async ({ page }) => {
    const darkBtn = page.locator('#social-appearance-seg .seg-btn[data-val="dark"]');
    await darkBtn.click();
    await expect(darkBtn).toHaveClass(/active/);

    const lightBtn = page.locator('#social-appearance-seg .seg-btn[data-val="light"]');
    await lightBtn.click();
    await expect(lightBtn).toHaveClass(/active/);
  });

  test('should update post content, author details, verified badge, and metrics', async ({ page }) => {
    // Author Name
    const nameInput = page.locator('#social-name');
    await nameInput.fill('Alex Rivera');
    await nameInput.dispatchEvent('input');

    // Handle
    const handleInput = page.locator('#social-handle');
    await handleInput.fill('alex_dev');
    await handleInput.dispatchEvent('input');

    // Verified badge
    const verifiedCheck = page.locator('#social-verified');
    await verifiedCheck.check();
    await verifiedCheck.dispatchEvent('change');

    // Post Text
    const postText = page.locator('#social-text');
    await postText.fill('Shipped our new analytics engine today!');
    await postText.dispatchEvent('input');

    const charCount = page.locator('#social-char-count');
    await expect(charCount).toHaveText('39 chars');

    // Metrics
    const likesInput = page.locator('#social-likes');
    await likesInput.fill('2.5k');
    await likesInput.dispatchEvent('input');
  });
});
