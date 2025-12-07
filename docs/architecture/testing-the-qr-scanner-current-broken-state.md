# Testing the QR Scanner (Current Broken State)

## How to Test (Once Fixed)

1. **Serve locally**: `http://localhost:8000`
2. **Go offline** or **enable test mode**
3. **Click "Scan QR" button** next to private key field
4. **Expected**: Modal opens with camera feed
5. **Point camera** at WIF private key QR code
6. **Expected**: Key scanned, modal closes, input populated

## Current Behavior (Broken)

**Observed** (investigation needed):
- Click "Scan QR" → Nothing happens? Error in console?
- Modal doesn't appear?
- Camera permission not requested?
- Error message shown?

**Investigation TODO**:
1. Open browser dev tools
2. Click "Scan QR" button
3. Check console for errors (likely module loading error)
4. Check network tab (does `qr-scanner.min.js` fail to load?)

---
