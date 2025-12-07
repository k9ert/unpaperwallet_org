# Technical Context

## Current Implementation

**Location**: `ui-manager.js` lines 175-268
**Function**: `async handleQRScan()`
**Library**: nimiq/qr-scanner (ES6 module)

**Key Integration Points**:
- Button: `#scan-private-key-btn`
- Input: `#private-key`
- Validation: `validatePrivateKey()` from `utils.js`
- Security: Disabled when `isOnline === true` (unless test mode)

## Root Cause (Hypothesis)

```javascript
// Line 185 - LIKELY FAILURE POINT
const { default: QrScanner } = await import('./qr-scanner.min.js');
```

**Issue**: Dynamic ES6 import in non-module context (index.html uses classic script tags)

**Additional Issues**:
- Worker path may not be configured (`QrScanner.WORKER_PATH`)
- HTTPS required for camera access (localhost OK for development)

## Technical Constraints

| Constraint | Rationale |
|------------|-----------|
| **100% client-side** | Privacy/security - no backend |
| **Offline capable** | Core security model |
| **No new runtime dependencies** | Use existing qr-scanner library |
| **Maintain security model** | Scanner disabled when online |
| **Vanilla JavaScript** | No framework changes |

**Note**: Test automation tools (e.g., Playwright) are acceptable as dev dependencies for automated testing.

---
