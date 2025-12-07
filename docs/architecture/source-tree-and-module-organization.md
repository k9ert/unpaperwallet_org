# Source Tree and Module Organization

## Script Loading Order (CRITICAL)

**File**: `index.html` (lines 221-238)

```html
<!-- Libraries loaded first (global scope) -->
<script src="bitcoinjs-lib.min.js"></script>  <!-- 1. Bitcoin library -->
<script src="qrcode.min.js"></script>          <!-- 2. QR code generation -->

<!-- Application modules (depend on libraries) -->
<script src="utils.js"></script>                <!-- 3. Utilities -->
<script src="bitcoin-transaction.js"></script>  <!-- 4. Transaction logic -->
<script src="ui-manager.js"></script>           <!-- 5. UI management -->

<!-- Initialization -->
<script>
    let bitcoin = window.bitcoin;  // Global reference
    document.addEventListener('DOMContentLoaded', initializeApp);
</script>
```

**⚠️ QR Scanner Exception**: `qr-scanner.min.js` is NOT loaded via script tag. It's dynamically imported in `ui-manager.js:185` using ES6 `import()`.

## Module System Hybrid Approach

1. **Bundled Global Libraries** (Script Tags):
   - `bitcoinjs-lib.min.js` → `window.bitcoin`
   - `qrcode.min.js` → `window.QRCode`
   - Created via browserify from `build.js` and `qr-build.js`

2. **Vanilla JS Modules** (Script Tags):
   - `utils.js`, `bitcoin-transaction.js`, `ui-manager.js`
   - Functions in global scope
   - No exports/imports

3. **ES6 Dynamic Import** (⚠️ Problematic):
   - `qr-scanner.min.js` loaded via `await import('./qr-scanner.min.js')`
   - This is where the QR scanner issue likely originates

## Key Modules and Their Purpose

### 1. **ui-manager.js** (Primary Focus for QR Fix)

**Purpose**: UI state management, online/offline detection, form validation, **QR scanning**

**Key Functions**:
- `initializeApp()` - Application entry point (line 271)
- `initializeUI()` - DOM element references (line 14)
- `setupEventListeners()` - Event bindings (line 32)
- `updateFormState()` - Enable/disable inputs based on online status (line 100)
- `validateForm()` - Form validation (line 131)
- **`handleQRScan()` - QR scanner implementation (line 176) ⚠️ BROKEN**

**Security Integration**:
- `scanPrivateKeyBtn.disabled = !shouldEnable` (line 116)
- Scanner only works when offline or in test mode

### 2. **utils.js**

**Purpose**: Validation functions for all inputs

**Key Functions**:
- `validatePrivateKey(privateKey)` (line 85) - Used after QR scan
- `validateBitcoinAddress(address)` (line 105)
- `validateTransactionId(txid)` (line 68)
- `showError(message)`, `showSuccess(message)` (lines 34, 49)

### 3. **bitcoin-transaction.js**

**Purpose**: Bitcoin transaction creation and signing

**Key Functions**:
- `createTransaction()` (line 6) - Main transaction builder
- `displayTransaction()` (line 56) - Show result with QR code
- `handleTransactionSubmit()` (line 93) - Form handler

**NOT RELEVANT** to QR scanner fix (out of scope)

### 4. **styles.css**

**QR Scanner Relevant Styles**:
- `.input-with-button` (line 384) - Private key input layout
- `.scan-button` (line 394) - QR scan button styling
- **No modal styles defined** - Modal created dynamically in JS

---
