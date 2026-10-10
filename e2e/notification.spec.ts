import { test, expect } from '@playwright/test';

test.describe('Feature 8: Mobile & Desktop Notification Mockup', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Switch to notification tool
    await page.click('button[data-tool="notification"]');
    await expect(page.locator('#panel-tool-title')).toHaveText('Notification & Toast Settings');
  });

  test('switches across notification platforms (iOS, Android, macOS, Toast)', async ({ page }) => {
    // Check initial iOS platform
    await expect(page.locator('#notif-platform-seg button[data-val="ios"]')).toHaveClass(/active/);

    // Switch to Android
    await page.click('#notif-platform-seg button[data-val="android"]');
    await expect(page.locator('#notif-platform-seg button[data-val="android"]')).toHaveClass(/active/);

    // Switch to macOS
    await page.click('#notif-platform-seg button[data-val="macos"]');
    await expect(page.locator('#notif-platform-seg button[data-val="macos"]')).toHaveClass(/active/);

    // Switch to Toast and verify toast type options become visible
    await page.click('#notif-platform-seg button[data-val="toast"]');
    await expect(page.locator('#notif-platform-seg button[data-val="toast"]')).toHaveClass(/active/);
    await expect(page.locator('#toast-type-field')).toBeVisible();

    // Select warning toast type
    await page.click('#toast-type-seg button[data-val="warning"]');
    await expect(page.locator('#toast-type-seg button[data-val="warning"]')).toHaveClass(/active/);
  });

  test('toggles dark appearance and edits notification texts', async ({ page }) => {
    // Switch to Dark appearance
    await page.click('#notif-appearance-seg button[data-val="dark"]');
    await expect(page.locator('#notif-appearance-seg button[data-val="dark"]')).toHaveClass(/active/);

    // Fill in custom title and message
    const titleInput = page.locator('#notif-title');
    await titleInput.fill('High Priority Alert');
    await expect(titleInput).toHaveValue('High Priority Alert');

    const messageInput = page.locator('#notif-message');
    await messageInput.fill('Server CPU usage exceeded 90% threshold');
    await expect(messageInput).toHaveValue('Server CPU usage exceeded 90% threshold');

    const timeInput = page.locator('#notif-time');
    await timeInput.fill('1m ago');
    await expect(timeInput).toHaveValue('1m ago');
  });

  test('toggles device screen embed mode with lockscreen wallpaper', async ({ page }) => {
    const deviceCheckbox = page.locator('#notif-device');
    await expect(deviceCheckbox).not.toBeChecked();

    // Enable device embed
    await deviceCheckbox.check();
    await expect(deviceCheckbox).toBeChecked();

    // Canvas should render framed phone device with lockscreen clock and notification card
    const canvas = page.locator('#preview-canvas');
    await expect(canvas).toBeVisible();

    // Disable device embed to return to isolated notification card
    await deviceCheckbox.uncheck();
    await expect(deviceCheckbox).not.toBeChecked();
  });
});
