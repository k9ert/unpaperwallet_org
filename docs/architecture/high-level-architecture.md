# High-Level Architecture

## Technical Summary

| Aspect | Current State |
|--------|--------------|
| **Type** | Static web application (SPA-like) |
| **Backend** | None - 100% client-side |
| **Framework** | Vanilla JavaScript (no React/Vue/Angular) |
| **Module System** | Hybrid (browserify bundles + ES6 dynamic imports) |
| **Build Process** | Browserify for bitcoinjs-lib and qrcode bundling |
| **Deployment** | Static file hosting (GitHub Pages, local, etc.) |
| **Security** | Client-side only, designed for offline use |

## Actual Tech Stack

| Category | Technology | Version/Notes |
|----------|-----------|---------------|
| **Runtime** | Browser JavaScript | ES6+ (async/await, dynamic imports) |
| **Bitcoin Library** | bitcoinjs-lib | v5.2.0 (bundled to `bitcoinjs-lib.min.js`) |
| **QR Generation** | qrcode | v1.5.3 (bundled to `qrcode.min.js`) |
| **QR Scanning** | nimiq/qr-scanner | Latest (ES6 module, `qr-scanner.min.js`) |
| **Build Tool** | Browserify | v17.0.1 (for bundling Node libs) |
| **HTML/CSS** | Vanilla | No preprocessors, no framework |
| **Module Loading** | Mixed | Script tags + dynamic imports |

## Repository Structure

```
unpaperwallet_org/
├── index.html                      # Main HTML entry point
├── styles.css                      # All CSS styling
├── ui-manager.js                   # UI logic, QR scanner ⚠️
├── bitcoin-transaction.js          # Transaction creation
├── utils.js                        # Validation utilities
├── bitcoinjs-lib.min.js           # Bundled Bitcoin library
├── qrcode.min.js                   # Bundled QR generation
├── qr-scanner.min.js              # QR scanner library (ES6 module)
├── qr-scanner-worker.min.js       # Web worker for QR scanning
├── build.js                        # Browserify config for bitcoinjs
├── qr-build.js                     # Browserify config for qrcode
├── package.json                    # Dependencies
├── docs/
│   ├── prd.md                     # Product requirements (QR scanner fix)
│   └── architecture.md            # This document
└── .bmad-core/                     # Development tooling
```

**NOTE**: No `src/` directory - all files in root (simple structure)

---
