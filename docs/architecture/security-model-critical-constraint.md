# Security Model

## Online and offline detection

`src/js/ui-manager.js` combines the browser's `navigator.onLine` state with a short request to the published site. The browser flag alone can report online when a virtual adapter is active without an internet route.

| State | Private-key entry and transaction creation |
|---|---|
| Checking or online | Disabled |
| Connection check failed | Disabled until the user confirms the device is fully disconnected |
| Offline event or confirmed offline | Enabled |
| Test mode | Enabled for development |

A successful request means the site is reachable, so the app locks private-key entry. A failed request cannot prove there is no internet route; the confirmation prompt tells users to check physical, VPN, and virtual adapters. Connectivity is checked at startup, after browser online events, and every 30 seconds.

The confirmation is a user assertion, not a technical guarantee. For maximum safety, disconnect all network interfaces before entering a private key.

## Form state management

Non-sensitive transaction details remain available while online. Private-key entry, private-key QR scanning, and transaction creation are disabled while the connection is checking, online, or unverified. Address QR scanning remains available because it reads public Bitcoin addresses.

## Test mode

Test mode intentionally enables private-key entry and transaction creation while online. It is for development only and should remain off during real wallet use.

## Private-key handling

- QR content is validated as a WIF private key before it enters the form.
- Invalid QR content remains in the scanner dialog so the user can retry.
- The application does not log or transmit scanned private-key data.
- Camera tracks are released when the scanner dialog closes.
