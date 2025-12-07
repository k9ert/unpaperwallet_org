# The QR Scanner Implementation (Current Broken State)

## Overview

**File**: `ui-manager.js:175-268`
**Function**: `async handleQRScan()`
**Status**: ⚠️ **NON-FUNCTIONAL**
**Library**: nimiq/qr-scanner (https://github.com/nimiq/qr-scanner)

## Current Implementation Flow

```
User clicks "Scan QR" button
        ↓
handleQRScan() triggered
        ↓
Check navigator.mediaDevices support
        ↓
Dynamic import: await import('./qr-scanner.min.js')  ⚠️ LIKELY FAILS HERE
        ↓
Create video element (300x300px)
        ↓
Create modal overlay (full screen, dark background)
        ↓
Initialize QrScanner with callback
        ↓
qrScanner.start() - request camera permissions
        ↓
Scan QR code → extract text
        ↓
Validate WIF private key format
        ↓
Populate private-key input field
        ↓
Show success message & close modal
```

## Implementation Summary

**Key Steps**:
1. Check `navigator.mediaDevices` API support
2. **⚠️ Dynamic import** of qr-scanner library (LIKELY FAILURE POINT - line 185)
3. Create video element (300x300px) and modal UI with inline styles
4. Initialize QrScanner with result callback handling multiple formats
5. Configure scanner settings (grayscale weights, inversion mode)
6. Start camera stream and display "Camera ready" status
7. On successful scan: populate input, validate, close modal, show success
8. On error/close: destroy scanner, release camera resources

**Critical Code References**:
- **Module import**: `ui-manager.js:185` - Dynamic ES6 import (root cause)
- **Scanner initialization**: `ui-manager.js:224-341` - QrScanner setup and callbacks
- **Result handling**: `ui-manager.js:315-340` - Multiple format support
- **Validation**: `ui-manager.js:331` - Calls `validatePrivateKey()` from `utils.js`
- **Resource cleanup**: `ui-manager.js:333, 353` - Camera release via `qrScanner.destroy()`

**For complete implementation details**, see `ui-manager.js:175-268` (94 lines)

## Likely Root Causes (Investigation Needed)

### 1. **Module Loading Issue** (MOST LIKELY)
**Problem**: `await import('./qr-scanner.min.js')` fails

**Why**:
- `index.html` doesn't declare `<script type="module">`
- Dynamic imports require module context
- Browser may block ES6 imports in non-module scripts
- CORS issues if served from file:// protocol

**Evidence**:
- `qr-scanner.min.js` is an ES6 module (uses `export default`)
- Other scripts loaded as classic scripts (no type="module")
- Mixed module system

### 2. **Worker Path Not Configured**
**Problem**: QrScanner can't find `qr-scanner-worker.min.js`

**Why**:
- Library expects `QrScanner.WORKER_PATH` to be set
- Default path may not match file structure
- Worker loading may fail silently

**Fix Required**:
```javascript
// Before initializing QrScanner
QrScanner.WORKER_PATH = './qr-scanner-worker.min.js';
```

### 3. **HTTPS Required (Less Likely in Dev)**
**Problem**: `getUserMedia()` requires HTTPS (except localhost)

**Why**:
- Browser security policy
- Camera access restricted to secure contexts

**Mitigation**:
- Use localhost for development (allowed)
- Use HTTPS in production

### 4. **Browser Compatibility**
**Problem**: Different browsers handle dynamic imports differently

**Affected**: Older browsers, Safari quirks

---
