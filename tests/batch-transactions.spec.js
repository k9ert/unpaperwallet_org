// @ts-check
const { test, expect } = require('@playwright/test');
const fs = require('fs/promises');
const path = require('path');

test('batches every fetched UTXO into one signed transaction with one fee', async ({ page }, testInfo) => {
  const utxos = [
    { txid: 'a'.repeat(64), vout: 0, value: 100000, status: { confirmed: true } },
    { txid: 'b'.repeat(64), vout: 1, value: 250000, status: { confirmed: true } },
  ];
  await page.route('https://blockstream.info/api/address/**/utxo', route =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(utxos) })
  );
  await page.goto('/');
  await page.locator('#source-address').fill('1BoatSLRHtKNngkdXEeobR76b53LETtpyT');
  await page.locator('#fetch-utxos-btn').click();
  await expect(page.locator('#use-all-utxos-btn')).toBeVisible();

  await page.locator('#use-all-utxos-btn').click();
  await expect(page.locator('#batch-selection-summary')).toContainText('2 UTXOs selected');
  await expect(page.locator('#txid')).toBeDisabled();
  await expect(page.locator('#vout')).toBeDisabled();
  await expect(page.locator('#amount')).toBeDisabled();

  await page.evaluate(() => window.dispatchEvent(new Event('offline')));
  const privateKey = await page.evaluate(() => window.bitcoin.ECPair.makeRandom().toWIF());
  await page.locator('#private-key').fill(privateKey);
  await page.locator('#target-address').fill('1BoatSLRHtKNngkdXEeobR76b53LETtpyT');
  await expect(page.locator('#create-tx-btn')).toBeEnabled();
  await page.locator('#create-tx-btn').click();
  await expect(page.locator('#transaction-output')).toBeVisible();

  const tx = await page.evaluate(() => {
    const transaction = window.bitcoin.Transaction.fromHex(document.querySelector('#tx-hex').textContent);
    return {
      inputs: transaction.ins.length,
      outputs: transaction.outs.length,
      outputValue: transaction.outs[0].value,
    };
  });
  expect(tx).toEqual({ inputs: 2, outputs: 1, outputValue: 349000 });

  if (testInfo.project.name === 'chromium') {
    const proofPath = path.join(__dirname, '..', 'test-results', 'batch-transaction-proof.png');
    await fs.mkdir(path.dirname(proofPath), { recursive: true });
    await page.locator('#transaction-output').screenshot({ path: proofPath });
  }
});
