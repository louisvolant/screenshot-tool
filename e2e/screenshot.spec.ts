import { test, expect } from '@playwright/test';

test.describe('Feature 2: Screenshot & Device Mockup Studio', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display hardware frame selectors and switch frame types', async ({ page }) => {
    const frameGrid = page.locator('#frame-type-grid');
    await expect(frameGrid).toBeVisible();

    const frames = ['browser', 'phone', 'tablet', 'laptop', 'watch', 'windows', 'none', 'desktop'];
    for (const frame of frames) {
      const btn = page.locator(`.grid-btn[data-frame="${frame}"]`);
      await expect(btn).toBeVisible();
      await btn.click();
      await expect(btn).toHaveClass(/active/);
    }
  });

  test('should switch modes: single, compare (before/after), and montage', async ({ page }) => {
    // Switch to Before/After mode
    const compareBtn = page.locator('#shot-mode-seg .seg-btn[data-val="compare"]');
    await compareBtn.click();
    await expect(compareBtn).toHaveClass(/active/);

    const compareControls = page.locator('#compare-controls');
    await expect(compareControls).toBeVisible();

    // Test compare layouts
    const layouts = ['stacked', 'split', 'overlay', 'side'];
    for (const layout of layouts) {
      const btn = page.locator(`#compare-layout-seg .seg-btn[data-val="${layout}"]`);
      await btn.click();
      await expect(btn).toHaveClass(/active/);
    }

    // Switch to Montage mode
    const montageBtn = page.locator('#shot-mode-seg .seg-btn[data-val="montage"]');
    await montageBtn.click();
    await expect(montageBtn).toHaveClass(/active/);

    const montageControls = page.locator('#montage-controls');
    await expect(montageControls).toBeVisible();

    // Test montage layouts
    const montageLayouts = ['row', 'fan', 'grid', 'cascade'];
    for (const layout of montageLayouts) {
      const btn = page.locator(`#montage-layout-seg .seg-btn[data-val="${layout}"]`);
      await btn.click();
      await expect(btn).toHaveClass(/active/);
    }
  });

  test('should add sample shots and update montage spread slider', async ({ page }) => {
    const montageBtn = page.locator('#shot-mode-seg .seg-btn[data-val="montage"]');
    await montageBtn.click();

    const addSampleBtn = page.locator('#btn-add-sample');
    await addSampleBtn.click();

    // Spread slider
    const spreadSlider = page.locator('#montage-spread');
    await spreadSlider.fill('65');
    await spreadSlider.dispatchEvent('input');

    const spreadVal = page.locator('#montage-spread-val');
    await expect(spreadVal).toHaveText('65%');
  });
});
