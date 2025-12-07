# Requirements

## User Story

**As a** Bitcoin holder with a paper wallet
**I want to** scan my private key QR code using my device camera
**So that** I can import my key quickly without typing errors

## Acceptance Criteria

The fix is complete when ALL of the following are verified:

### Core Functionality
- [ ] Click "Scan QR" button → camera modal opens (offline/test mode only)
- [ ] Browser requests camera permission
- [ ] Camera feed displays in modal (300x300px minimum)
- [ ] QR code automatically detected and decoded
- [ ] Valid WIF private key (5/K/L prefix, 51-52 chars) populates input field
- [ ] Success message displays: "Private key scanned successfully!"
- [ ] Modal automatically closes after successful scan

### Error Handling
- [ ] Camera permission denied → Clear error: "Camera access denied. Please allow camera access and try again."
- [ ] Camera unavailable → Clear error: "Camera not available in this browser"
- [ ] Invalid QR code → Clear error: "Invalid private key format. Must be WIF format (starts with 5, K, or L)"
- [ ] Non-WIF QR code → Validation error shown
- [ ] Close button manually closes modal
- [ ] Camera resources released when modal closes (manual or automatic)

### Security Compliance
- [ ] Scanner button disabled when online (red status indicator)
- [ ] Scanner button enabled when offline (green status indicator)
- [ ] Scanner button enabled in test mode (orange status indicator)
- [ ] No private key data logged or transmitted

### Cross-Browser Testing
- [ ] Chrome desktop (Windows/Mac/Linux) ✓
- [ ] Firefox desktop ✓
- [ ] Brave desktop ✓

### Edge Cases
- [ ] QR codes at various distances/angles scan successfully
- [ ] Works with different QR code sizes (phone screen to printed paper)
- [ ] Works in different lighting conditions (reasonable range)
- [ ] User can retry scanning without page refresh after error

---
