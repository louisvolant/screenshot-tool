import { test, expect } from '@playwright/test';

test.describe('Feature 1: Core Architecture & Studio Shell', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load the studio interface and initialize preview canvas', async ({ page }) => {
    await expect(page).toHaveTitle(/Graphic Studio/);
    const canvas = page.locator('#preview-canvas');
    await expect(canvas).toBeVisible();

    const box = await canvas.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThan(100);
    expect(box!.height).toBeGreaterThan(100);
  });

  test('should navigate across all 7 creative tools', async ({ page }) => {
    const tools = ['screenshot', 'code', 'social', 'testimonial', 'chat', 'notification', 'announce'];
    for (const tool of tools) {
      const btn = page.locator(`.tool-btn[data-tool="${tool}"]`);
      await expect(btn).toBeVisible();
      await btn.click();
      await expect(btn).toHaveClass(/active/);
    }
  });

  test('should toggle dark and light UI theme', async ({ page }) => {
    const html = page.locator('html');
    await expect(html).toHaveAttribute('data-theme', 'dark');

    const themeBtn = page.locator('#btn-theme');
    await themeBtn.click();
    await expect(html).toHaveAttribute('data-theme', 'light');

    await themeBtn.click();
    await expect(html).toHaveAttribute('data-theme', 'dark');
  });

  test('should support undo and redo on layout and background controls', async ({ page }) => {
    const undoBtn = page.locator('#btn-undo');
    const redoBtn = page.locator('#btn-redo');

    // Initially undo should be disabled
    await expect(undoBtn).toBeDisabled();

    // Change background angle
    const angleSlider = page.locator('#bg-angle');
    await angleSlider.fill('270');
    await angleSlider.dispatchEvent('input');

    // Undo should now be enabled
    await expect(undoBtn).toBeEnabled();

    // Click undo
    await undoBtn.click();
    await expect(redoBtn).toBeEnabled();

    // Click redo
    await redoBtn.click();
    await expect(undoBtn).toBeEnabled();
  });
});
