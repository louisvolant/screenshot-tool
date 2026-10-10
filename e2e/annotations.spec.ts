import { test, expect } from '@playwright/test';

test.describe('Feature 3: Vector & Canvas Annotation Suite', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display floating annotation toolbar and activate tools', async ({ page }) => {
    const toolbar = page.locator('#annot-toolbar');
    await expect(toolbar).toBeVisible();

    const tools = ['text', 'arrow', 'box', 'sticker', 'loupe', 'blur', 'select'];
    for (const tool of tools) {
      const btn = page.locator(`.annot-btn[data-tool="${tool}"]`);
      await expect(btn).toBeVisible();
      await btn.click();
      await expect(btn).toHaveClass(/active/);
    }
  });

  test('should place text and sticker annotations onto canvas on click', async ({ page }) => {
    const canvas = page.locator('#preview-canvas');

    // Select text tool
    const textToolBtn = page.locator('.annot-btn[data-tool="text"]');
    await textToolBtn.click();

    // Click canvas to drop annotation
    await canvas.click({ position: { x: 150, y: 150 } });

    // After click, active tool resets to select
    const selectBtn = page.locator('.annot-btn[data-tool="select"]');
    await expect(selectBtn).toHaveClass(/active/);

    // Select sticker tool
    const stickerToolBtn = page.locator('.annot-btn[data-tool="sticker"]');
    await stickerToolBtn.click();
    await canvas.click({ position: { x: 250, y: 200 } });
  });

  test('should delete selected annotation', async ({ page }) => {
    const canvas = page.locator('#preview-canvas');

    // Add a box annotation
    const boxToolBtn = page.locator('.annot-btn[data-tool="box"]');
    await boxToolBtn.click();
    await canvas.click({ position: { x: 180, y: 180 } });

    // Click delete button
    const deleteBtn = page.locator('#btn-annot-delete');
    await deleteBtn.click();
  });

  test('should switch annotation tools via keyboard shortcuts', async ({ page }) => {
    await page.keyboard.press('t');
    await expect(page.locator('.annot-btn[data-tool="text"]')).toHaveClass(/active/);

    await page.keyboard.press('a');
    await expect(page.locator('.annot-btn[data-tool="arrow"]')).toHaveClass(/active/);

    await page.keyboard.press('r');
    await expect(page.locator('.annot-btn[data-tool="box"]')).toHaveClass(/active/);

    await page.keyboard.press('v');
    await expect(page.locator('.annot-btn[data-tool="select"]')).toHaveClass(/active/);
  });
});
