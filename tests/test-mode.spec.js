// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * Test Mode and Online/Offline behavior tests
 * Verifies security model and test mode functionality
 */

test.describe('Test Mode Functionality', () => {

  test('status indicator shows correct state', async ({ page }) => {
    await page.goto('/');

    // Wait for status to initialize
    await page.waitForTimeout(1000);

    // Status indicator should be visible
    const statusIndicator = page.locator('#status-indicator');
    await expect(statusIndicator).toBeVisible();

    // Status text should exist
    const statusText = page.locator('#status-text');
    await expect(statusText).toBeVisible();

    // Should show either online or offline status
    const text = await statusText.textContent();
    expect(text).toBeTruthy();
  });

  test('form starts in secure state with fields disabled', async ({ page }) => {
    await page.goto('/');

    // Wait for initial state
    await page.waitForTimeout(1000);

    // Critical security fields should be disabled initially (offline mode)
    const privateKeyInput = page.locator('#private-key');
    const submitButton = page.locator('#create-tx-btn');

    await expect(privateKeyInput).toBeDisabled();
    await expect(submitButton).toBeDisabled();
  });

});
