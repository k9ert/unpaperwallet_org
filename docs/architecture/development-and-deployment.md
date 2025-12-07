# Development and Deployment

## Local Development Setup

### Requirements
- **Node.js**: For installing dependencies (npm)
- **HTTP Server**: Any static file server (Python SimpleHTTPServer, VS Code Live Server, etc.)
- **Browser**: Chrome/Firefox/Brave (desktop only, latest versions)
- **HTTPS** (for camera): Use localhost or configure HTTPS

### Setup Steps

```bash
# 1. Clone/download repository
cd /home/kim/src/unpaperwallet_org

# 2. Install dependencies (for rebuilding libraries if needed)
npm install

# 3. Serve locally (example with Python)
python3 -m http.server 8000

# 4. Open browser
# Navigate to: http://localhost:8000

# 5. Enable test mode to test online (bypass security)
# Toggle "Test Mode" switch in UI
```

### Rebuilding Libraries (If Needed)

```bash
# Rebuild bitcoinjs-lib bundle
browserify build.js -o bitcoinjs-lib.min.js

# Rebuild qrcode bundle
browserify qr-build.js -o qrcode.min.js
```

**NOTE**: `qr-scanner.min.js` is NOT built via browserify. It's a prebuilt ES6 module from npmjs/GitHub.

## Build Process

**Current State**: No formal build process (static files)

**Build Files**:
- `build.js` - Browserify config for bitcoinjs-lib
- `qr-build.js` - Browserify config for qrcode
- `package.json` - Dependencies

**Build Command** (if regenerating bundles):
```bash
npm install
# Manually run browserify (no npm script defined)
```

## Deployment

**Method**: Static file hosting
**Options**:
- GitHub Pages
- Netlify
- Any web server
- Local file (offline usage)

**Requirements**:
- HTTPS (for camera access in production)
- No server-side processing needed

---
