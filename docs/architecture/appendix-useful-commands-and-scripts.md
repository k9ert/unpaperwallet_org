# Appendix - Useful Commands and Scripts

## Development Commands

```bash
# Start local server (Python)
python3 -m http.server 8000

# Start local server (Node.js - install http-server first)
npx http-server -p 8000

# Install dependencies
npm install

# Rebuild bitcoinjs-lib bundle (if modified)
npx browserify build.js -o bitcoinjs-lib.min.js

# Rebuild qrcode bundle (if modified)
npx browserify qr-build.js -o qrcode.min.js
```

---
