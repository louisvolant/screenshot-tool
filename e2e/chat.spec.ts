import { test, expect } from '@playwright/test';

test.describe('Feature 7: Chat & Messaging Conversation Simulator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Switch to Chat tool
    const chatBtn = page.locator('.tool-btn[data-tool="chat"]');
    await chatBtn.click();
  });

  test('should display chat messenger selector and switch platforms', async ({ page }) => {
    const platformSelect = page.locator('#chat-platform');
    await expect(platformSelect).toBeVisible();

    const platforms = ['whatsapp', 'telegram', 'discord', 'slack', 'imessage'];
    for (const p of platforms) {
      await platformSelect.selectOption(p);
      await platformSelect.dispatchEvent('change');
    }
  });

  test('should toggle light and dark appearance', async ({ page }) => {
    const darkBtn = page.locator('#chat-appearance-seg .seg-btn[data-val="dark"]');
    await darkBtn.click();
    await expect(darkBtn).toHaveClass(/active/);

    const lightBtn = page.locator('#chat-appearance-seg .seg-btn[data-val="light"]');
    await lightBtn.click();
    await expect(lightBtn).toHaveClass(/active/);
  });

  test('should update contact name, status and manage message sequence', async ({ page }) => {
    // Contact details
    const contactInput = page.locator('#chat-contact');
    await contactInput.fill('Jordan Lee');
    await contactInput.dispatchEvent('input');

    const statusInput = page.locator('#chat-status');
    await statusInput.fill('Typing...');
    await statusInput.dispatchEvent('input');

    // Add message
    const addMsgBtn = page.locator('#btn-add-message');
    await addMsgBtn.click();

    const msgInputs = page.locator('.chat-msg-text');
    const count = await msgInputs.count();
    expect(count).toBeGreaterThanOrEqual(4);

    // Edit last message
    const lastInput = msgInputs.last();
    await lastInput.fill('The client just approved the launch roadmap!');
    await lastInput.dispatchEvent('input');

    // Toggle sender on first message
    const firstSenderBtn = page.locator('.chat-toggle-sender').first();
    await firstSenderBtn.click();
  });
});
