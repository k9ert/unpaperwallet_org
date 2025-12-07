# Dependencies & Environment

## Code Dependencies
- `ui-manager.js` - QR scanner implementation (needs fix)
- `qr-scanner.min.js` - nimiq QR scanner library (already included)
- `qr-scanner-worker.min.js` - Web worker (already included)
- `utils.js` - `validatePrivateKey()` function
- `index.html` - Script loading order

## Environment Requirements
- **Development**: HTTP localhost (camera access allowed) OR HTTPS
- **Production**: HTTPS required (browser camera API restriction)
- **Testing Devices**: Desktop computers with webcams

---
