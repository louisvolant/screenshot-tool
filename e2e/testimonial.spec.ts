import { test, expect } from '@playwright/test';

test.describe('Feature 6: Customer Testimonial & Review Card Generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Switch to Testimonial tool
    const testimBtn = page.locator('.tool-btn[data-tool="testimonial"]');
    await testimBtn.click();
  });

  test('should display testimonial controls and switch themes', async ({ page }) => {
    const styleGrid = page.locator('#testim-style-grid');
    await expect(styleGrid).toBeVisible();

    const themes = ['creme', 'menthe', 'bonbon', 'ocean', 'minuit', 'sorbet'];
    for (const t of themes) {
      const btn = page.locator(`.grid-btn[data-theme="${t}"]`);
      await btn.click();
    }
  });

  test('should update customer quote, author name, and company', async ({ page }) => {
    const quoteText = page.locator('#testim-text');
    await quoteText.fill('This platform increased our conversion rate by 45% in one week.');
    await quoteText.dispatchEvent('input');

    const nameInput = page.locator('#testim-name');
    await nameInput.fill('Sarah Jenkins');
    await nameInput.dispatchEvent('input');

    const roleInput = page.locator('#testim-role');
    await roleInput.fill('VP of Marketing, CloudScale');
    await roleInput.dispatchEvent('input');
  });

  test('should configure star rating and review source', async ({ page }) => {
    // Star rating
    const rating4 = page.locator('#testim-rating-seg .seg-btn[data-val="4"]');
    await rating4.click();
    await expect(rating4).toHaveClass(/active/);

    const rating5 = page.locator('#testim-rating-seg .seg-btn[data-val="5"]');
    await rating5.click();
    await expect(rating5).toHaveClass(/active/);

    // Source platform
    const sourceSelect = page.locator('#testim-source');
    await sourceSelect.selectOption('google');
    await sourceSelect.dispatchEvent('change');

    await sourceSelect.selectOption('g2');
    await sourceSelect.dispatchEvent('change');
  });
});
