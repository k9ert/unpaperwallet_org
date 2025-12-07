# Technical Debt and Known Issues

## Critical Technical Debt

### 1. **QR Scanner Non-Functional** (PRD Scope)
**Severity**: High
**Impact**: Users cannot scan private keys
**Files**: `ui-manager.js:175-268`, `index.html`
**Root Cause**: Module loading mismatch (ES6 import in non-module context)

### 2. **No Module System Consistency**
**Severity**: Medium
**Impact**: Maintainability, future upgrades
**Issue**: Mixed browserify bundles + ES6 dynamic imports + global scripts
**Recommendation**: Standardize (but not required for QR fix)

### 3. **Paste Prevention Not Implemented**
**Severity**: Low (documentation issue)
**Impact**: User confusion
**Issue**: Instructions claim paste is disabled, but it's not in code
**Files**: `index.html:159` (false claim), no implementation

### 4. **No Error Logging in Production**
**Severity**: Low
**Impact**: Debugging user issues
**Issue**: Only `console.error()` calls, no structured logging

## Workarounds and Gotchas

### 1. **Test Mode Bypass**
**What**: Toggle switch that allows online usage
**Why**: Development convenience
**Risk**: Users might enable in production (low risk - checkbox labeled clearly)
**Location**: `index.html:28-35`, `ui-manager.js:79-83`

### 2. **QR Scanner Library Loaded Dynamically**
**What**: `qr-scanner.min.js` not in initial script tags
**Why**: Unknown (may be intentional for size, or incomplete implementation)
**Issue**: Causes module loading problems
**Fix Path**: Either bundle it or fix module loading

### 3. **Manual DOM Manipulation for Modal**
**What**: QR scanner modal created entirely in JavaScript (no HTML template)
**Why**: Simple implementation
**Trade-off**: Harder to style, no reusability
**Location**: `ui-manager.js:196-220`

---
