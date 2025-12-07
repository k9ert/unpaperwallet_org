# Enhancement Impact Analysis (QR Scanner Fix)

## Files That Will Need Modification

### 1. **index.html** (LIKELY)
**Changes Needed**:
- Add `type="module"` to main script OR
- Load qr-scanner via script tag instead of dynamic import

**Current** (lines 225-228):
```html
<script src="utils.js"></script>
<script src="bitcoin-transaction.js"></script>
<script src="ui-manager.js"></script>
```

**Option A** (Convert to module):
```html
<script type="module" src="ui-manager.js"></script>
```

**Option B** (Load QR scanner globally):
```html
<script src="qr-scanner.min.js"></script>
<script src="utils.js"></script>
<script src="bitcoin-transaction.js"></script>
<script src="ui-manager.js"></script>
```

### 2. **ui-manager.js:175-268** (REQUIRED)
**Changes Needed**:
- Fix dynamic import OR use global `QrScanner`
- Add `QrScanner.WORKER_PATH` configuration
- Add better error handling/logging for debugging

**Minimal Fix** (if loading globally):
```javascript
async function handleQRScan() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        showError('Camera access not available in this browser');
        return;
    }

    try {
        // Configure worker path BEFORE using QrScanner
        QrScanner.WORKER_PATH = './qr-scanner-worker.min.js';

        // Remove dynamic import line (if loading globally)
        // const { default: QrScanner } = await import('./qr-scanner.min.js');

        // Use global QrScanner directly
        // ... rest of implementation ...
    } catch (error) {
        showError('QR scanning failed: ' + error.message);
        console.error('QR scan error:', error);
    }
}
```

## New Files/Modules Needed

**NONE** - All dependencies already present.

## Integration Considerations

1. **Must maintain security model**: Scanner disabled when online (already implemented)
2. **Must validate scanned data**: Use existing `validatePrivateKey()` (already implemented)
3. **Must release camera resources**: `qrScanner.destroy()` (already implemented)
4. **Must show user feedback**: Success/error messages (already implemented)

---
