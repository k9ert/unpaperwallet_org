# Testing the QR Scanner

The Playwright suite covers the following without requesting camera access:

- The bundled decoder reads a generated QR image.
- Valid WIF keys populate the private-key field; invalid content is rejected so the user can retry.
- Plain Bitcoin addresses and `bitcoin:` URIs populate the source and destination fields.
- Invalid addresses do not enter the form.

To smoke-test a physical camera, serve the app from HTTPS or `localhost`, enable Test Mode for the private-key scanner, grant camera access in the browser, and scan test data only. Confirm the dialog closes and the camera stops after a scan or manual close.
