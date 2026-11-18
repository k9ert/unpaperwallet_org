// @ts-check
const { test, expect } = require('@playwright/test');
const fs = require('fs/promises');
const path = require('path');

test('keeps key entry locked until offline status is verified', async ({ page }, testInfo) => {
  let websiteReachable = false;
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'onLine', { configurable: true, value: true });
  });
  await page.route('https://unpaperwallet.org/**', route =>
    websiteReachable ? route.fulfill({ status: 200, body: '' }) : route.abort()
  );

  await page.goto('/');

  const status = page.locator('#status-text');
  const privateKey = page.locator('#private-key');
  await expect(status).toHaveText('CONNECTION UNVERIFIED - Private Key Locked');
  await expect(privateKey).toBeDisabled();

  if (testInfo.project.name === 'chromium') {
    const proofPath = path.join(__dirname, '..', 'test-results', 'offline-detection-proof.png');
    await fs.mkdir(path.dirname(proofPath), { recursive: true });
    await page.screenshot({ path: proofPath });
  }

  await page.locator('#offline-confirm-checkbox').check();
  await page.locator('#offline-confirm-btn').click();
  await expect(status).toHaveText('OFFLINE - Manually Verified');
  await expect(privateKey).toBeEnabled();

  websiteReachable = true;
  await page.evaluate(() => window.dispatchEvent(new Event('online')));
  await expect(status).toHaveText('ONLINE - Inputs Disabled for Security');
  await expect(privateKey).toBeDisabled();
});
