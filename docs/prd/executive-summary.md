# Executive Summary

The Bitcoin Paper Wallet application has a **broken QR scanner** for private key input. The feature is fully implemented (`ui-manager.js:175-268`) but non-functional due to a module loading issue. This PRD defines the scope to debug and fix the existing implementation.

**Goal**: Enable users to scan paper wallet QR codes instead of manually typing 51-52 character private keys.

**Target Users**: Non-technical Bitcoin holders using the app offline.

---
