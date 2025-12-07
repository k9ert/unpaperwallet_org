# Quick Reference - Critical Files for QR Scanner Fix

## Must-Read Files (QR Scanner)

| File | Purpose | Lines of Interest |
|------|---------|------------------|
| **index.html** | HTML structure, script loading order | Lines 221-238 (script tags) |
| **ui-manager.js** | QR scanner implementation | Lines 175-268 (handleQRScan) |
| **qr-scanner.min.js** | QR scanner library (nimiq) | Entire file (external lib) |
| **qr-scanner-worker.min.js** | Web worker for QR processing | Entire file (external lib) |
| **utils.js** | Private key validation | Lines 85-102 (validatePrivateKey) |
| **styles.css** | Modal styling | Lines 384-398 (scan-button, input-with-button) |

## Enhancement Impact Areas

**Files That Will Need Modification**:
- `index.html` - May need type="module" or module loading changes
- `ui-manager.js:175-268` - Fix QR scanner implementation
- Potentially add configuration for QrScanner.WORKER_PATH

**New Files/Modules Needed**:
- None (all dependencies already included)

---
