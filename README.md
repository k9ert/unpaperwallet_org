# Bitcoin Paper Wallet Transaction Creator

A secure offline tool for creating Bitcoin transactions from paper wallets.

## Development

### Prerequisites
- Node.js (for installing dependencies)
- Python 3 (for local dev server)

### Setup
```bash
# Install dependencies
npm install

# Build the application
npm run build

# Run local dev server
npm run dev
```

The app will be available at `http://localhost:8000`

### Testing

This project uses [Playwright](https://playwright.dev/) for end-to-end testing.

#### Running Tests

```bash
# Run all tests (headless)
npm test

# Run tests with browser UI visible
npm run test:headed

# Run tests in interactive UI mode
npm run test:ui

# View test report
npm run test:report
```

#### Test Coverage

The test suite covers:
- Page loads and basic functionality
- Disclaimer and security warnings display
- Test mode toggle functionality
- Form field states (offline mode security)
- Transaction form presence
- Instructions and documentation display
- Status indicator functionality
- Secure defaults (fields disabled when offline)

Tests run against both Chromium and Firefox browsers.

## Scripts

- `npm run build` - Build the application (copies `src/` to `dist/`)
- `npm run clean` - Remove `dist/` directory
- `npm run dev` - Build and serve locally on port 8000
- `npm test` - Run Playwright E2E tests
- `npm run test:headed` - Run tests with visible browser
- `npm run test:ui` - Run tests in interactive UI mode
- `npm run test:report` - View HTML test report

## Security

This application is designed for offline use. See the in-app instructions for proper security practices when handling private keys.
