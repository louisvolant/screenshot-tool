import { test, expect } from '@playwright/test';

test.describe('Feature 4: Code Snippet & Terminal Beautifier', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Switch to Code tool
    const codeToolBtn = page.locator('.tool-btn[data-tool="code"]');
    await codeToolBtn.click();
  });

  test('should display code editor fields and update filename & content', async ({ page }) => {
    const filenameInput = page.locator('#code-filename');
    await expect(filenameInput).toBeVisible();
    await filenameInput.fill('server.ts');
    await filenameInput.dispatchEvent('input');

    const codeText = page.locator('#code-text');
    await expect(codeText).toBeVisible();
    await codeText.fill('const message: string = "Hello Studio";');
    await codeText.dispatchEvent('input');

    // Highlights input
    const highlightInput = page.locator('#code-highlight');
    await highlightInput.fill('1');
    await highlightInput.dispatchEvent('input');
  });

  test('should change syntax themes and automatically update background palette', async ({ page }) => {
    const themeSelect = page.locator('#code-theme');
    await expect(themeSelect).toBeVisible();

    await themeSelect.selectOption('monokai');
    await themeSelect.dispatchEvent('change');

    await themeSelect.selectOption('nocturne');
    await themeSelect.dispatchEvent('change');
  });

  test('should switch between code editor and terminal mode', async ({ page }) => {
    const terminalBtn = page.locator('#code-mode-seg .seg-btn[data-val="terminal"]');
    await terminalBtn.click();
    await expect(terminalBtn).toHaveClass(/active/);

    const terminalFields = page.locator('#terminal-fields');
    await expect(terminalFields).toBeVisible();

    const termText = page.locator('#terminal-text');
    await termText.fill('$ git status\nOn branch master\nNothing to commit.');
    await termText.dispatchEvent('input');

    // Switch back to code
    const codeBtn = page.locator('#code-mode-seg .seg-btn[data-val="code"]');
    await codeBtn.click();
    await expect(codeBtn).toHaveClass(/active/);
  });

  test('should simulate AI code generation on prompt', async ({ page }) => {
    const promptInput = page.locator('#ai-prompt');
    await expect(promptInput).toBeVisible();
    await promptInput.fill('TypeScript debounce function');

    const generateBtn = page.locator('#btn-ai-generate');
    await generateBtn.click();

    // Verify code textarea received generated snippet
    const codeText = page.locator('#code-text');
    await expect(codeText).toHaveValue(/export function debounce/);
  });
});
