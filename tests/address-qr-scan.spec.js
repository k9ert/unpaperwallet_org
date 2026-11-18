// @ts-check
const { test, expect } = require('@playwright/test');

test('scans Bitcoin address QR codes into both address fields', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => {
    window.QrScanner = class {
      constructor(video, onDecode) { window.__qrDecode = onDecode; }
      async start() {}
      destroy() {}
      setGrayscaleWeights() {}
      setInversionMode() {}
    };
  });

  const address = '1BoatSLRHtKNngkdXEeobR76b53LETtpyT';
  for (const [button, input, qrData] of [
    ['#scan-source-address-btn', '#source-address', `bitcoin:${address}?amount=0.01`],
    ['#scan-target-address-btn', '#target-address', address],
  ]) {
    await page.locator(button).click();
    await expect(page.locator('.qr-scan-modal')).toBeVisible();
    await page.evaluate(data => window.__qrDecode({ data }), qrData);
    await expect(page.locator(input)).toHaveValue(address);
    await expect(page.locator('.qr-scan-modal')).toHaveCount(0);
  }
});
