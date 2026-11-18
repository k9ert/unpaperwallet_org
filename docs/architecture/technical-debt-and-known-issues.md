# Technical Debt and Known Issues

## Addressed in this change

- Online/offline status now checks whether the published site responds, and asks users to confirm disconnection when the browser's status is inconclusive.
- QR scanning is shared by the private-key, UTXO source-address, and destination-address fields. WIF keys and Bitcoin addresses are validated before being accepted.
- The scanner worker URL is resolved relative to the ES module so it works from the built `dist/` paths.
- Fetched UTXOs can be selected together and signed as multiple transaction inputs with one fee.
- The source repository is linked in the deployed page footer.

## Remaining limitations

- A failed request to the website cannot prove that all network routes are disconnected. The user confirmation is still a manual check; maximum security requires disconnecting every network adapter.
- Camera access requires a supported browser, a secure context, and user permission. Automated browser tests verify QR decoding and scan-result handling without requesting a real camera permission.
- The application still uses classic global scripts alongside the ES module that loads the QR scanner.
- Users must verify the signed transaction, all inputs, the destination, and the amount before broadcasting.
