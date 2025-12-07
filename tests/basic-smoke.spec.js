// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * Basic smoke tests for unpaperwallet.org
 * Tests critical user workflows and security features
 */

test.describe('Basic Application Smoke Tests', () => {

  test('page loads successfully', async ({ page }) => {
    await page.goto('/');

    // Check title
    await expect(page).toHaveTitle(/Bitcoin Paper Wallet Transaction Creator/);

    // Check main heading
    const heading = page.locator('h1');
    await expect(heading).toContainText('Bitcoin Paper Wallet Transaction Creator');

    // Check status indicator exists
    const statusIndicator = page.locator('#status-indicator');
    await expect(statusIndicator).toBeVisible();
  });

  test('disclaimer and security warnings are visible', async ({ page }) => {
    await page.goto('/');

    // Check disclaimer (first div.warning)
    const disclaimer = page.locator('div.warning').first();
    await expect(disclaimer).toContainText('USE AT YOUR OWN RISK');

    // Check security warning (second div.warning)
    const securityWarning = page.locator('div.warning').nth(1);
    await expect(securityWarning).toContainText('SECURITY WARNING');
    await expect(securityWarning).toContainText('offline');
  });

  test('test mode toggle exists and is functional', async ({ page }) => {
    await page.goto('/');

    // Find test mode checkbox (it's styled/hidden, so check it exists)
    const testModeCheckbox = page.locator('#test-mode');
    await expect(testModeCheckbox).toBeAttached();

    // Initially unchecked
    await expect(testModeCheckbox).not.toBeChecked();

    // Verify the toggle label is visible
    const toggleLabel = page.locator('label[for="test-mode"]');
    await expect(toggleLabel).toBeVisible();
    await expect(toggleLabel).toContainText('Test Mode');
  });

  test('form fields are initially disabled (offline mode)', async ({ page }) => {
    await page.goto('/');

    // Wait for status to update (may take a moment)
    await page.waitForTimeout(1000);

    // Check critical form fields are disabled when offline
    const txidInput = page.locator('#txid');
    const privateKeyInput = page.locator('#private-key');
    const submitButton = page.locator('#create-tx-btn');

    // These should be disabled in offline mode
    await expect(privateKeyInput).toBeDisabled();
    await expect(submitButton).toBeDisabled();
  });

  test('transaction form has all required fields', async ({ page }) => {
    await page.goto('/');

    // Check all form fields exist
    await expect(page.locator('#txid')).toBeVisible();
    await expect(page.locator('#vout')).toBeVisible();
    await expect(page.locator('#private-key')).toBeVisible();
    await expect(page.locator('#target-address')).toBeVisible();
    await expect(page.locator('#amount')).toBeVisible();
    await expect(page.locator('#fee')).toBeVisible();
    await expect(page.locator('#create-tx-btn')).toBeVisible();
  });

  test('instructions column is visible and complete', async ({ page }) => {
    await page.goto('/');

    // Check instructions column exists
    const instructions = page.locator('.instructions-column');
    await expect(instructions).toBeVisible();

    // Check it has the step-by-step heading
    const heading = instructions.locator('h2');
    await expect(heading).toContainText('Step-by-Step Instructions');

    // Check critical warning box is present
    const criticalWarning = page.locator('.critical-warning');
    await expect(criticalWarning).toBeVisible();
    await expect(criticalWarning).toContainText('Paper Wallet Security Workflow');
  });

});
