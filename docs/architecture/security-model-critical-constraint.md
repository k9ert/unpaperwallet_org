# Security Model (Critical Constraint)

## Online/Offline Detection

**File**: `ui-manager.js:6, 64-76`

```javascript
let isOnline = navigator.onLine;

window.addEventListener('online', handleOnline);
window.addEventListener('offline', handleOffline);
```

**Status Indicator States**:
- 🔴 **ONLINE**: Red - "ONLINE - Inputs Disabled for Security"
- 🟢 **OFFLINE**: Green - "OFFLINE - Safe to Use"
- 🟡 **TEST MODE**: Orange - "TEST MODE - Development Only"

## Form State Management

**File**: `ui-manager.js:100-128`

**Rules**:
1. **Non-sensitive fields** (txid, vout, target address, amount, fee): Always enabled
2. **Private key field**: Disabled when online (unless test mode)
3. **Submit button**: Disabled when online (unless test mode)
4. **Scan QR button**: Disabled when online (unless test mode)

```javascript
const shouldEnable = !isOnline || testMode;
privateKeyInput.disabled = !shouldEnable;
createTxBtn.disabled = !shouldEnable;
scanPrivateKeyBtn.disabled = !shouldEnable;
```

## Security Features

| Feature | Implementation | Purpose |
|---------|---------------|---------|
| **Online Detection** | `navigator.onLine` event listeners | Prevent private key exposure online |
| **Input Disabling** | Programmatic `disabled` attribute | Force offline usage |
| **Test Mode** | Toggle switch for development | Allow testing while online |
| **Paste Prevention** | ⚠️ NOT IMPLEMENTED (instructions say it is) | Claimed in UI instructions |
| **Page Unload Warning** | `beforeunload` event if private key entered | Prevent accidental loss |

**⚠️ DISCREPANCY**: Instructions claim private key field prevents pasting, but code doesn't implement this. Only disabling is enforced.

---
