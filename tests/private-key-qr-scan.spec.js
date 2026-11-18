// @ts-check
const { test, expect } = require('@playwright/test');

test('loads the QR decoder with the correct worker and decodes a generated QR image', async ({ page }) => {
  await page.goto('/');

  const workerPath = await page.evaluate(() => window.QrScanner?.WORKER_PATH);
  expect(new URL(workerPath).pathname).toBe('/vendor/qr-scanner-worker.min.js');

  const decodedExactly = await page.evaluate(async () => {
    const privateKey = window.bitcoin.ECPair.makeRandom().toWIF();
    const dataUrl = await window.QRCode.toDataURL(privateKey);
    const image = new Image();
    image.src = dataUrl;
    await image.decode();
    return await window.QrScanner.scanImage(image) === privateKey;
  });
  expect(decodedExactly).toBe(true);
});

test('private key QR scanning rejects invalid data and accepts a valid WIF key', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => {
    window.dispatchEvent(new Event('offline'));
    window.QrScanner = class {
      constructor(video, onDecode) { window.__qrDecode = onDecode; }
      async start() {}
      destroy() {}
      setGrayscaleWeights() {}
      setInversionMode() {}
    };
  });

  const privateKey = await page.evaluate(() => window.bitcoin.ECPair.makeRandom().toWIF());
  const privateKeyField = page.locator('#private-key');
  await page.locator('#scan-private-key-btn').click();
  await expect(page.locator('.qr-scan-modal')).toBeVisible();

  await page.evaluate(() => window.__qrDecode({ data: 'not a private key' }));
  await expect(page.locator('.qr-scan-status')).toContainText('Invalid private key format');
  await expect(privateKeyField).toHaveValue('');

  await page.evaluate(key => window.__qrDecode({ data: key }), privateKey);
  await expect(privateKeyField).toHaveValue(privateKey);
  await expect(page.locator('.qr-scan-modal')).toHaveCount(0);
  await expect(page.locator('#success-message')).toHaveText('Private key scanned successfully!');
});
