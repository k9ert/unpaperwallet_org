# QR Scanner Implementation

The app loads `qr-scanner.min.js` from `src/js/qr-scanner-wrapper.js`, exposes `QrScanner` for the existing classic scripts, and resolves the worker URL relative to the wrapper module.

`startQrScanner()` in `src/js/ui-manager.js` owns the shared camera dialog and releases the scanner when it closes. Its callbacks validate data before accepting it:

- Private-key QR codes must contain a valid WIF key.
- Source and destination address QR codes may contain a plain address or a `bitcoin:` URI. The app validates and keeps the address, without URI query parameters.

The scanner requires `getUserMedia()` support and browser camera permission. The deployed site uses HTTPS; local development can use `localhost`. Automated tests exercise a generated QR image with the real decoder and simulate scan results for the form flows. They do not request camera permission or replace a manual hardware-camera check.
