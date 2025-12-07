# Integration Points and External Dependencies

## External Libraries

| Library | Version | Purpose | Loading Method | Status |
|---------|---------|---------|---------------|---------|
| **bitcoinjs-lib** | 5.2.0 | Bitcoin transaction creation | Browserify bundle → script tag | ✅ Working |
| **qrcode** | 1.5.3 | QR code generation (output) | Browserify bundle → script tag | ✅ Working |
| **nimiq/qr-scanner** | Latest | QR code scanning (input) | Dynamic ES6 import | ⚠️ Broken |
| **buffer** | 6.0.3 | Polyfill for bitcoinjs-lib | Bundled in bitcoinjs-lib | ✅ Working |
| **browserify** | 17.0.1 | Bundling tool (build time) | Build process | ✅ Working |

## Library Files in Repo

```
bitcoinjs-lib.min.js       # 827 KB - Full Bitcoin library
qrcode.min.js               # 82 KB  - QR generation
qr-scanner.min.js           # 6 KB   - QR scanning
qr-scanner-worker.min.js    # 43 KB  - Web worker for QR scanning
```

## External Service Dependencies

**NONE** - 100% client-side, no API calls for QR scanning.

**Exception**: Transaction broadcasting (out of scope) uses external services (mempool.space) per user instructions.

---
